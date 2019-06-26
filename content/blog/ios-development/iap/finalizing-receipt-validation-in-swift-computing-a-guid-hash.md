---
title: Finalizing Receipt Validation in Swift – Computing a GUID Hash
author: Andrew
type: blog
date: 2017-07-31T12:36:26+00:00
lastmod: 2019-06-26T00:00:00+00:00
url: /2017/07/31/finalizing-receipt-validation-in-swift-computing-a-guid-hash/
dsq_thread_id:
  - "6030242278"
categories:
  - Swift
tags:
  - Receipt Validation
  - Swift
exclude_related: true
---
The aim of this guide is to help you finalize the receipt validation process by computing the GUID hash for your app, and comparing it to the hash that's stored within your receipt itself.

This is a continuation of my receipt validation series. I'm assuming that&#8230;

  * You've [prepared to test receipt validation][1] by setting up your app in iTunes Connect.
  * You've brought in a cryptography library like OpenSSL to be able to work with the PKCS #7 container that acts as the "envelope&#8221; for the receipt. Perhaps you've even done it [the "easy way&#8221; with CocoaPods][2].
  * You've [located and loaded][3] the receipt for validation.
  * You've [extracted the PKCS #7 container][4].
  * You've [verified the signature on the receipt][5]
  * You've [parsed and decoded the receipt payload][6]

After finishing this guide, you'll simply need to use the parsed receipt data to perform any app-specific enabling/disabling of features based on the data within a valid receipt. If the receipt is _invalid_, you'll need to handle that as well. But all of the relatively difficult work of working with the Open SSL crypto library will be DONE after this guide.

Just want the code? Here you go!

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/SwiftyLocalReceiptValidator">Swifty Local Receipt Validator</a>
    </li>
  </ul>
</div>

Ready? Let's do this thing!

<a name="validating-with-receipt-validator" class="jump-target"></a>

## Validating the device GUID hash with ReceiptValidator

For this final step, I've imagined a single additional function within the [`ReceiptValidator` struct][7] called `validateHash(receipt:)`.

It'll take in a `ParsedReceipt` ([review what it looks like][8]), and will to the computation and comparison necessary to verify that the computed hash matches the hash stored in the receipt.

A `ReceiptValidationError` will be thrown if things go wrong within this function. No `ReceiptValidationError` being thrown indicates a successful hash computation and comparison.

Here's the skeleton of the function:

{{< highlight swift "linenos=table" >}}
fileprivate func validateHash(receipt: ParsedReceipt) throws {
    // Make sure that the ParsedReceipt instances has non-nil values needed for hash comparison

    // Compute the hash for your app & device

    // Compare the computed hash with the receipt's hash
}
{{< /highlight >}}

<a name="signaling-validation-failure" class="jump-target"></a>

## Signaling hash validation failure

Before I get into the implementation of the `validateHash(receipt:)` function, let's define one more `ReceiptValidationError` case to describe a bad hash comparison outcome:

{{< highlight swift "linenos=table" >}}
enum ReceiptValidationError : Error {
    case couldNotFindReceipt
    case emptyReceiptContents
    case receiptNotSigned
    case appleRootCertificateNotFound
    case receiptSignatureInvalid
    case malformedReceipt
    case malformedInAppPurchaseReceipt
    case incorrectHash
}
{{< /highlight >}}

<a name="implementing-validate-hash" class="jump-target"></a>

## Implementing validateHash function

I'll put the code in front of you, and then do my best to explain my thought process.

{{< highlight swift "linenos=table" >}}
fileprivate func validateHash(receipt: ParsedReceipt) throws {
    // Make sure that the ParsedReceipt instances has non-nil values needed for hash comparison
    guard let receiptOpaqueValueData = receipt.opaqueValue else { throw ReceiptValidationError.incorrectHash }
    guard let receiptBundleIdData = receipt.bundleIdData else { throw ReceiptValidationError.incorrectHash }
    guard let receiptHashData = receipt.sha1Hash else { throw ReceiptValidationError.incorrectHash }
    
    var deviceIdentifier = UIDevice.current.identifierForVendor?.uuid
    
    let rawDeviceIdentifierPointer = withUnsafePointer(to: &deviceIdentifier, {
        (unsafeDeviceIdentifierPointer: UnsafePointer&lt;uuid_t?>) -> UnsafeRawPointer in
        return UnsafeRawPointer(unsafeDeviceIdentifierPointer)
    })
    
    let deviceIdentifierData = NSData(bytes: rawDeviceIdentifierPointer, length: 16)
    
    // Compute the hash for your app & device
    
    // Set up the hasing context
    var computedHash = Array&lt;UInt8>(repeating: 0, count: 20)
    var sha1Context = SHA_CTX()
    
    SHA1_Init(&sha1Context)
    SHA1_Update(&sha1Context, deviceIdentifierData.bytes, deviceIdentifierData.length)
    SHA1_Update(&sha1Context, receiptOpaqueValueData.bytes, receiptOpaqueValueData.length)
    SHA1_Update(&sha1Context, receiptBundleIdData.bytes, receiptBundleIdData.length)
    SHA1_Final(&computedHash, &sha1Context)
    
    let computedHashData = NSData(bytes: &computedHash, length: 20)
    
    // Compare the computed hash with the receipt's hash
    guard computedHashData.isEqual(to: receiptHashData as Data) else { throw ReceiptValidationError.incorrectHash }
}
{{< /highlight >}}

<a name="walkthrough" class="jump-target"></a>

#### Walking through validateHash

First up, I've placed three guard statements:

{{< highlight swift "linenos=table" >}}
guard let receiptOpaqueValueData = receipt.opaqueValue else { throw ReceiptValidationError.incorrectHash }
guard let receiptBundleIdData = receipt.bundleIdData else { throw ReceiptValidationError.incorrectHash }
guard let receiptHashData = receipt.sha1Hash else { throw ReceiptValidationError.incorrectHash }
{{< /highlight >}}

These help guarantee that the rest of the function will have all of the required pieces of data that it needs to fully compute a hash and compare it with what's in the receipt.

The hash for your app is computed with the following three pieces of information:  
1) The app purchaser's device identifier  
2) A piece of "opaque data&#8221; found within the receipt  
3) Your app's bundle identifier found within the receipt

The app purchaser's device identifier is represented as a `uuid_t` from the Foundation library. However, to use it with the Open SSL library, we'll need to be working with an `NSData` instance. The following code goes from the `uuid_t` instance, to a raw pointer, to an `NSData` instance:

{{< highlight swift "linenos=table" >}}
var deviceIdentifier = UIDevice.current.identifierForVendor?.uuid

let rawDeviceIdentifierPointer = withUnsafePointer(to: &deviceIdentifier, {
    (unsafeDeviceIdentifierPointer: UnsafePointer&lt;uuid_t?&gt;) -&gt; UnsafeRawPointer in
    return UnsafeRawPointer(unsafeDeviceIdentifierPointer)
})

let deviceIdentifierData = NSData(bytes: rawDeviceIdentifierPointer, length: 16)
{{< /highlight >}}

The last chunk of code within the function actually computes the hash data.

The hash is a SHA1 hash, so what we do here is initialize a SHA1 context, and then update it with all of the ingredients (device identifier, opaque data, and bundle identifier). The hash is finalized, and converted to an instance of `NSData`.

The final guard takes the `computedHashData` instance, and compares it to the receipt's hash data. If it's identical, validation passes! Otherwise, `ReceiptValidationError.incorrectHash` is thrown.

<a name="final-receipt-validator" class="jump-target"></a>

## Final ReceiptValidator

Let's put it all together into the final `ReceiptValidator` struct. Additions are highlighted below:

{{< highlight swift "linenos=table" >}}
struct ReceiptValidator {
    let receiptLoader = ReceiptLoader()
    let receiptExtractor = ReceiptExtractor()
    let receiptSignatureValidator = ReceiptSignatureValidator()
    let receiptParser = ReceiptParser()
    
    func validateReceipt() -> ReceiptValidationResult {
        do {
            let receiptData = try receiptLoader.loadReceipt()
            let receiptContainer = try receiptExtractor.extractPKCS7Container(receiptData)
            
            try receiptSignatureValidator.checkSignaturePresence(receiptContainer)
            try receiptSignatureValidator.checkSignatureAuthenticity(receiptContainer)
            
            let parsedReceipt = try receiptParser.parse(receiptContainer)
            try validateHash(receipt: parsedReceipt)
            
            return .success(parsedReceipt)
        } catch {
            return .error(error as! ReceiptValidationError)
        }
    }
    
    fileprivate func validateHash(receipt: ParsedReceipt) throws {
        // Make sure that the ParsedReceipt instances has non-nil values needed for hash comparison
        guard let receiptOpaqueValueData = receipt.opaqueValue else { throw ReceiptValidationError.incorrectHash }
        guard let receiptBundleIdData = receipt.bundleIdData else { throw ReceiptValidationError.incorrectHash }
        guard let receiptHashData = receipt.sha1Hash else { throw ReceiptValidationError.incorrectHash }
        
        var deviceIdentifier = UIDevice.current.identifierForVendor?.uuid
        
        let rawDeviceIdentifierPointer = withUnsafePointer(to: &deviceIdentifier, {
            (unsafeDeviceIdentifierPointer: UnsafePointer&lt;uuid_t?>) -> UnsafeRawPointer in
            return UnsafeRawPointer(unsafeDeviceIdentifierPointer)
        })
        
        let deviceIdentifierData = NSData(bytes: rawDeviceIdentifierPointer, length: 16)
        
        // Compute the hash for your app & device
        
        // Set up the hasing context
        var computedHash = Array&lt;UInt8>(repeating: 0, count: 20)
        var sha1Context = SHA_CTX()
        
        SHA1_Init(&sha1Context)
        SHA1_Update(&sha1Context, deviceIdentifierData.bytes, deviceIdentifierData.length)
        SHA1_Update(&sha1Context, receiptOpaqueValueData.bytes, receiptOpaqueValueData.length)
        SHA1_Update(&sha1Context, receiptBundleIdData.bytes, receiptBundleIdData.length)
        SHA1_Final(&computedHash, &sha1Context)
        
        let computedHashData = NSData(bytes: &computedHash, length: 20)
        
        // Compare the computed hash with the receipt's hash
        guard computedHashData.isEqual(to: receiptHashData as Data) else { throw ReceiptValidationError.incorrectHash }
    }
}
{{< /highlight >}}

<a name="what-to-do-from-here" class="jump-target"></a>

## What to do from here

So what now?

Well, at this stage, if no errors have been thrown, you've got a valid receipt.

The `validateReceipt` function returns an instance of `ParsedReceipt` so that you can inspect individual Swift-Typed values from the receipt payload to determine what features you should enable or disable, depending on what your needs are.

If a `ReceiptValidationError` is thrown at any point along the way, you'll need to handle them.  
Here are a few ideas:

  * Implement a grace period, just in case the receipt validation failure occurred for a reason that the user can't control (e.g. maybe we couldn't locate the receipt, and requesting a new one failed because Apple was having issues&#8230;)
  * Disable a feature in your app because receipt validation failed too many times
  * Maybe you just need to use the data within the `ParsedReceipt` because you're changing the way you monetize your app. Now, instead of making users pay $0.99 for the app, you're going to give it away for free, but let people buy an in-app purchase to enable "pro&#8221; features, or remove ads&#8230;whatever. In this case, you may check the `ParsedReceipt` to see the original version of the app that your user downloaded. Maybe you want to require users who download your app after version 2.0 to buy an in-app purchase for *Feature X*, but you want to give it to everyone who already _has_ the app since they may have already paid $0.99 for it, and it'd make them feel ripped off if they had to buy the in-app purchase.

How you handle the parsed receipt data or a receipt validation error is really customizable and specific to your particular app.

The bottom line is that from this point on, you no longer need Open SSL or any additional cryptic, low-level, unsafe pointer-type stuff to finish things out.

I hope this series has been helpful in setting you up to validate receipts locally on a user's device!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/10/05/preparing-to-test-receipt-validation-for-ios/" title="Preparing to Test Receipt Validation for iOS">Preparing to Test Receipt Validation for iOS</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/" title="Loading a Receipt for Validation with Swift">Loading a Receipt for Validation with Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/09/21/openssl-for-ios-swift-the-easy-way/" title="OpenSSL for iOS &#038; Swift the Easy Way">OpenSSL for iOS & Swift the Easy Way</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/" Extracting a PKCS7 Container for Receipt Validation with Swift="title">Extracting a PKCS7 Container for Receipt Validation with Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/16/receipt-validation-verifying-a-receipt-signature-in-swift/" Receipt Validation – Verifying a Receipt Signature in Swift="title">Receipt Validation – Verifying a Receipt Signature in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/27/receipt-validation-parsing-a-receipt-with-swift/" Receipt Validation – Parse and Decode a Receipt with Swift="title">Receipt Validation – Parse and Decode a Receipt with Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/2015/10/05/preparing-to-test-receipt-validation-for-ios/
 [2]: https://www.andrewcbancroft.com/2015/09/21/openssl-for-ios-swift-the-easy-way/
 [3]: https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/
 [4]: https://www.andrewcbancroft.com/2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/
 [5]: https://www.andrewcbancroft.com/2017/07/16/receipt-validation-verifying-a-receipt-signature-in-swift/
 [6]: https://www.andrewcbancroft.com/2017/07/27/receipt-validation-parsing-a-receipt-with-swift/
 [7]: https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/#receipt-validator-implementation
 [8]: https://www.andrewcbancroft.com/2017/07/27/receipt-validation-parsing-a-receipt-with-swift/#final-goal