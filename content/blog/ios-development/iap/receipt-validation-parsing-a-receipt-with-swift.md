---
title: 'Receipt Validation –  Parse and Decode a Receipt with Swift'
author: Andrew
type: blog
date: 2017-07-28T03:41:33+00:00
aliases:
  - /2017/07/27/receipt-validation-parsing-a-receipt-with-swift/
dsq_thread_id:
  - "6021747553"
categories:
  - Swift
tags:
  - Receipt Validation
  - Swift

---
The aim of this guide is to help you parse a receipt and decode it so that you have readable pieces of metadata to inspect and finalize all of the receipt validation steps.

This is a continuation of my receipt validation series. I'm assuming that&#8230;

  * You've [prepared to test receipt validation][1] by setting up your app in iTunes Connect.
  * You've brought in a cryptography library like OpenSSL to be able to work with the PKCS #7 container that acts as the &#8220;envelope&#8221; for the receipt. Perhaps you've even done it [the &#8220;easy way&#8221; with CocoaPods][2].
  * You've [located and loaded][3] the receipt for validation.
  * You've [extracted the PKCS #7 container][4].
  * You've [verified the signature on the receipt][5]

After finishing this guide, you'll still have to [compute the GUID hash of your app][6] to compare with the hash that's found within the receipt. You'll also have to inspect the receipt data to perform any app-specific verification steps. But in order to do either, you'll need the parsed receipt metadata.

Just want the code? Here you go!

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/SwiftyLocalReceiptValidator">Swifty Local Receipt Validator</a>
    </li>
  </ul>
</div>

Want to understand the final `ReceiptParser`? Let's get to it!


<a name="final-goal" class="jump-target"></a>

# The final goal: A parsed receipt

The final goal of this guide is a parsed receipt.

What do you say we start things off by defining what one looks like?

At the end of the day, what we'd like back from the parsing process is a simple struct that contains the various pieces of metadata that are found within the [extracted the PKCS #7 container][4]. Things like&#8230;

  * the app's bundle identifier, 
  * the original app version that was purchased, 
  * a collection of all the in app purchase receipts, 
  * etc. 

How does the following look?

<pre class="lang:swift decode:true " title="ParsedReceipt | ParsedInAppPurchaseReceipt" >struct ParsedReceipt {
    let bundleIdentifier: String?
    let bundleIdData: NSData?
    let appVersion: String?
    let opaqueValue: NSData?
    let sha1Hash: NSData?
    let inAppPurchaseReceipts: [ParsedInAppPurchaseReceipt]?
    let originalAppVersion: String?
    let receiptCreationDate: Date?
    let expirationDate: Date?
}

struct ParsedInAppPurchaseReceipt {
    let quantity: Int?
    let productIdentifier: String?
    let transactionIdentifier: String?
    let originalTransactionIdentifier: String?
    let purchaseDate: Date?
    let originalPurchaseDate: Date?
    let subscriptionExpirationDate: Date?
    let cancellationDate: Date?
    let webOrderLineItemId: Int?
}</pre>

You may be wondering, &#8220;How'd he know what values are encoded within the extracted receipt payload?&#8221;. Apple has a very handy [list of all the values that are encoded][7], so I listed each property out in my struct according to their documentation.

Parsing the receipt produces the most valuable piece of the whole process. Sure, it's necessary to go through all of the other validation steps, but having a **decoded receipt** with actual **human-readable values** is, to me, a huge step.

Full disclaimer though: parsing the receipt is not very&#8230; Swifty.

We're going to be working with all kinds of ugly things like `UnsafeMutablePointers`, and cryptically-named C Types.

Let's take it one step at a time though&#8230;

<a name="visualizing-receipt-structure" class="jump-target"></a>

# Visualizing the encoded receipt's structure

Up to now, we've been working only with the PKCS #7 _container_ for the receipt. Now it's time to dig into the container and see what it actually _contains_.

If you crack open the container, what you find is a long series of bytes that encode the actual structure of the receipt.

From beginning to end, the bytes _should_ encode what's called an &#8220;ASN.1 Set&#8221;. In fact, if you open the PKCS #7 container and it _doesn't_ encode an ASN.1 Set, that'd warrant a receipt validation failure&#8230;[more about handling that in a minute][8].

Here's a visual representation of an ASN.1 Set:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Set.jpeg" alt="ASN.1 Set" width="923" height="338" class="alignnone size-full wp-image-13513" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Set.jpeg 923w, https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Set-300x110.jpeg 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Set-768x281.jpeg 768w" sizes="(max-width: 923px) 100vw, 923px" />][9]

Since we've just got a bunch of bytes encoding things, there's got to be some way to say, &#8220;This byte, or these series of bytes, represent [this human understandable thing]&#8221;.

That's exactly what we've got, as you can see by the visual representation.

The first byte in the receipt payload (the green box in the visualization) signals that the bytes that follow encode an ASN.1 Set.

The next bytes in the series (the blue box) encode how long the ASN.1 Set is, so that as you're going along parsing and decoding the contents of the Set, you know when to stop.

The final series of bytes (the yellow boxes) encode chunks of information that can be decoded to give you human readable receipt attributes. Those chunks, themselves, are encoded as ASN.1 _Sequences_.

So what does an ASN.1 Sequence look like? Here's a visual:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Sequence.jpeg" alt="ASN.1 Sequence" width="919" height="337" class="alignnone size-full wp-image-13514" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Sequence.jpeg 919w, https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Sequence-300x110.jpeg 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Sequence-768x282.jpeg 768w" sizes="(max-width: 919px) 100vw, 919px" />][10]

When it comes to app receipts, ASN.1 _Sequences_ are used to say, &#8220;Hey, this series of bytes encodes [the bundle identifier] or [the original app version] or [some other receipt attribute].&#8221;

Each ASN.1 Sequence has a flag (the pink box in the visualization) to signal that the bytes that follow do, in fact, encode an ASN.1 Sequence.

Then, just like an ASN.1 Set, the next bytes in line (the blue box) encode how long the Sequence is. Then comes what we're really after in all this Set/Sequence talk:

The _type_ of attribute (bundle identifier, for example) is encoded next in the series of bytes as an ASN.1 Integer (note that this isn't a Swift Int&#8230;yet&#8230;we'll decode it soon). Each attribute type has a unique ASN.1 Integer value, kind of like an ID. [Apple's documentation][7] is helpful in figuring out which ASN.1 Integer value maps to which receipt attribute.

After the attribute type comes some bytes that encode an &#8220;attribute version&#8221;, also as an ASN.1 Integer. At the time of this guide's publication, &#8220;attribute version&#8221; isn't used for anything. Nonetheless, the series of bytes right after the attribute type within the ASN.1 Sequence is reserved and will always represent the &#8220;attribute version&#8221;.

The remaining bytes in the ASN.1 Sequence encode the actual _value_ of the attribute as an ASN.1 Octet String (don't let the word &#8220;Octet String&#8221; trick you into thinking that it's actually a String&#8230; they're _bytes_ that we'll have to decode shortly&#8230;)

Knowing how the receipt payload is structured will help us formulate a strategy around parsing it. Let's imagine a simple algorithm to do it now.

<a name="parsing-strategy" class="jump-target"></a>

# Receipt parsing strategy

Let's take it step by step. What if we approach parsing the receipt like this:

**1)** Do some preliminary checks to ensure that the receipt payload is in the correct structural format (it should be an ASN.1 Set, for example).

**2)** For each ASN.1 Sequence within the ASN.1 Set, check to see what type of attribute it is.

**3)** Decode its Octet String value into actual, human-readable values. The decoded values would be represented by Swift Types (Int, String, Date are sufficient to cover all of the possibilities for receipts). The final decoded value depends on what _type_ of attribute it is.

**4)** Create and return a ParsedReceipt instance as the final product.

If at any point the receipt payload fails to live up to the expected structure, receipt validation will fail, and we can signal that by throwing an error.

<a name="note-on-iap-receipts" class="jump-target"></a>

## A note on in-app purchase receipts

As we follow the receipt parsing strategy steps that I just described, there's going to come a point where we run into the ASN.1 Sequence that encodes the in-app purchase receipts.

These are special.

In-app purchase receipts are encoded as ASN.1 Sets (with ASN.1 Sequences within) _inside_ the primary ASN.1 Set receipt payload. In other words, they're _nested_ ASN.1 Sets within the _overall_ ASN.1 Set that encodes the whole receipt. The nested Set contains the _in-app purchase_ receipt attributes.

So in order to decode these, we'll have to apply the receipt parsing strategy _within_ the receipt parsing strategy. Fun, huh? We'll only have to do it for the in-app purchase receipt attributes though.

<a name="helper-functions" class="jump-target"></a>

# Preparation step: Helper decoding functions

If you saw the `ParsedReceipt` struct that I proposed earlier in the guide, you'll notice that there are essentially four Swift Types that the receipt attributes (and in-app purchase receipt attributes) get decoded into:

  * `Int?`
  * `String?`
  * `NSData?`
  * `Date?`

`NSData` has a constructor that can work with `UnsafeRawPointers` directly, but `Int?`, `String?`, and `Date?` need some help converting from the ASN.1 versions of those Types to the _Swift_ versions of those Types.

Let me put the code before you and follow up with what I'm doing here:

<pre class="lang:swift decode:true " title="Decoding Helpers" >func DecodeASN1Integer(startOfInt intPointer: inout UnsafePointer&lt;UInt8>?, length: Int) -> Int? {
    // These will be set by ASN1_get_object
    var type = Int32(0)
    var xclass = Int32(0)
    var intLength = 0
    
    ASN1_get_object(&intPointer, &intLength, &type, &xclass, length)
    
    guard type == V_ASN1_INTEGER else {
        return nil
    }
    
    let integer = c2i_ASN1_INTEGER(nil, &intPointer, intLength)
    let result = ASN1_INTEGER_get(integer)
    ASN1_INTEGER_free(integer)
    
    return result
}

func DecodeASN1String(startOfString stringPointer: inout UnsafePointer&lt;UInt8>?, length: Int) -> String? {
    // These will be set by ASN1_get_object
    var type = Int32(0)
    var xclass = Int32(0)
    var stringLength = 0

    ASN1_get_object(&stringPointer, &stringLength, &type, &xclass, length)
    
    if type == V_ASN1_UTF8STRING {
        let mutableStringPointer = UnsafeMutableRawPointer(mutating: stringPointer!)
        return String(bytesNoCopy: mutableStringPointer, length: stringLength, encoding: String.Encoding.utf8, freeWhenDone: false)
    }
    
    if type == V_ASN1_IA5STRING {
        let mutableStringPointer = UnsafeMutableRawPointer(mutating: stringPointer!)
        return String(bytesNoCopy: mutableStringPointer, length: stringLength, encoding: String.Encoding.ascii, freeWhenDone: false)
    }
    
    return nil
}

func DecodeASN1Date(startOfDate datePointer: inout UnsafePointer&lt;UInt8>?, length: Int) -> Date? {
    // Date formatter code from https://www.objc.io/issues/17-security/receipt-validation/#parsing-the-receipt
    let dateFormatter = DateFormatter()
    dateFormatter.locale = Locale(identifier: "en_US_POSIX")
    dateFormatter.dateFormat = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'"
    dateFormatter.timeZone = TimeZone(secondsFromGMT: 0)
    
    if let dateString = DecodeASN1String(startOfString: &datePointer, length:length) {
        return dateFormatter.date(from: dateString)
    }
    
    return nil
}</pre>

Each of these decoding functions are dealing with the receipt attribute _value_ portion of the ASN.1 Sequence that we're working on at the time. Recall the structure:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Sequence.jpeg" alt="ASN.1 Sequence" width="919" height="337" class="alignnone size-full wp-image-13514" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Sequence.jpeg 919w, https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Sequence-300x110.jpeg 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Sequence-768x282.jpeg 768w" sizes="(max-width: 919px) 100vw, 919px" />][10]

So we take in a pointer that's pointing _to_ the start of one of the attribute _values_ (a yellow box). The yellow box's ASN.1 Octet String encodes either an integer, a string, or a date. (Okay, technically I guess you could include NSData, but this doesn't need to be &#8220;decoded&#8221; really. And the in-app purchase receipts will be parsed and decoded into the stated Types as well, so it all boils down to the three I just mentioned&#8230;thus the reason for only three helper functions).

The strategy for the first two functions is basically to take what we're pointing to, and call `ASN1_get_object`.

This function call gets us enough information to decode the bytes from the start of the object to the end of the object into either an `Int?` or a `String?`. If it fails, `nil` is returned.

Decoding dates simply involves initializing a `DateFormatter` with the appropriate locale and date format. The datePointer parameter actually points to an encoded _string_, so the strategy is to use the `DecodeASN1String` function we made, and pass the date string to the date formatter.

So long as the string can be decoded, the date formatter instance is used to create an actual `Date?` instance and return it. Otherwise, `nil` is returned.

<a name="handling-error-conditions" class="jump-target"></a>

# Handling error conditions

The kinds of errors that can occur when parsing the receipt payload all have to do with unexpected structure.

For example, if we're expecting to be stepping through an ASN.1 Payload or an ASN.1 Sequence but instead find that it's not what we expect, this is a situation where reeipt validation should fail, because there's no way to decode the receipt attributes if the bytes of the payload don't conform to the expected structure.

In situations where the receipt payload or one of its in-app purchase receipt payloads is &#8220;malformed&#8221; in some way, we can throw an `Error`.

I've highlighted two new `ReceiptValidationError` cases here:

<pre class="lang:swift decode:true mark:7-8" title="New ReceiptValidationError cases" >enum ReceiptValidationError : Error {
    case couldNotFindReceipt
    case emptyReceiptContents
    case receiptNotSigned
    case appleRootCertificateNotFound
    case receiptSignatureInvalid
    case malformedReceipt
    case malformedInAppPurchaseReceipt
}
</pre>

<a name="implementing-receipt-parser" class="jump-target"></a>

# Implenting ReceiptParser

OK! We've got a few helper functions to decode the receipt attributes, and we've got some `ReceiptValidationError` cases to throw in case parsing fails.

At a very high level, the ReceiptParser will take the following skeletal structure:

<pre class="lang:swift decode:true" title="ReceiptParser Skeleton" >struct ReceiptParser {
    func parse(_ PKCS7Container: UnsafeMutablePointer&lt;PKCS7>) throws -> ParsedReceipt {
        var bundleIdentifier: String?
        var bundleIdData: NSData?
        var appVersion: String?
        var opaqueValue: NSData?
        var sha1Hash: NSData?
        var inAppPurchaseReceipts = [ParsedInAppPurchaseReceipt]()
        var originalAppVersion: String?
        var receiptCreationDate: Date?
        var expirationDate: Date?
        
        // Parse the receipt, setting each variable
        
        return ParsedReceipt(bundleIdentifier: bundleIdentifier,
                             bundleIdData: bundleIdData,
                             appVersion: appVersion,
                             opaqueValue: opaqueValue,
                             sha1Hash: sha1Hash,
                             inAppPurchaseReceipts: inAppPurchaseReceipts,
                             originalAppVersion: originalAppVersion,
                             receiptCreationDate: receiptCreationDate,
                             expirationDate: expirationDate)
    }
    
    func parseInAppPurchaseReceipt(currentInAppPurchaseASN1PayloadLocation: inout UnsafePointer&lt;UInt8>?, payloadLength: Int) throws -> ParsedInAppPurchaseReceipt {
        var quantity: Int?
        var productIdentifier: String?
        var transactionIdentifier: String?
        var originalTransactionIdentifier: String?
        var purchaseDate: Date?
        var originalPurchaseDate: Date?
        var subscriptionExpirationDate: Date?
        var cancellationDate: Date?
        var webOrderLineItemId: Int?
        
        // Parse the in-app purchase receipt, setting each variable
        
        return ParsedInAppPurchaseReceipt(quantity: quantity,
                                          productIdentifier: productIdentifier,
                                          transactionIdentifier: transactionIdentifier,
                                          originalTransactionIdentifier: originalTransactionIdentifier,
                                          purchaseDate: purchaseDate,
                                          originalPurchaseDate: originalPurchaseDate,
                                          subscriptionExpirationDate: subscriptionExpirationDate,
                                          cancellationDate: cancellationDate,
                                          webOrderLineItemId: webOrderLineItemId)
    }
</pre>

So a total of two functions: one to parse the overall receipt, and one to parse each in-app purchase receipt nested _within_ the overall receipt.

Now comes the hard part. Actually doing all the decoding. Don't forget the [strategy][11] we're going to take! That'll help you walk through this code without getting insanely overwhelmed (hopefully).

<a name="parse-function-implementation" class="jump-target"></a>

## `parse` function implementation

First, the implementation of `parse(_:)` with comments throughout to help you find where each step of the [strategy][11] is being implemented:

<pre class="lang:swift decode:true" title="Implementation of parse function" >func parse(_ PKCS7Container: UnsafeMutablePointer&lt;PKCS7>) throws -> ParsedReceipt {
    var bundleIdentifier: String?
    var bundleIdData: NSData?
    var appVersion: String?
    var opaqueValue: NSData?
    var sha1Hash: NSData?
    var inAppPurchaseReceipts = [ParsedInAppPurchaseReceipt]()
    var originalAppVersion: String?
    var receiptCreationDate: Date?
    var expirationDate: Date?
    
    // Strategy Step 1: Preliminary structure checks

    // Must have data to work with
    guard let contents = PKCS7Container.pointee.d.sign.pointee.contents, let octets = contents.pointee.d.data else {
        throw ReceiptValidationError.malformedReceipt
    }
    
    // Determine the start and end of the receipt payload
    var currentASN1PayloadLocation = UnsafePointer(octets.pointee.data)
    let endOfPayload = currentASN1PayloadLocation!.advanced(by: Int(octets.pointee.length))
    
    var type = Int32(0)
    var xclass = Int32(0)
    var length = 0
    
    ASN1_get_object(&currentASN1PayloadLocation, &length, &type, &xclass,Int(octets.pointee.length))
    
    // Payload must be an ASN1 Set
    guard type == V_ASN1_SET else {
        throw ReceiptValidationError.malformedReceipt
    }
    
    // Decode Payload
    // Strategy Step 2: Walk through payload (ASN1 Set) and parse each ASN1 Sequence 
    // within (ASN1 Sets contain one or more ASN1 Sequences)
    while currentASN1PayloadLocation! &lt; endOfPayload {
        
        // Get next ASN1 Sequence
        ASN1_get_object(&#038;currentASN1PayloadLocation, &#038;length, &#038;type, &#038;xclass, currentASN1PayloadLocation!.distance(to: endOfPayload))
        
        // ASN1 Object type must be an ASN1 Sequence
        guard type == V_ASN1_SEQUENCE else {
            throw ReceiptValidationError.malformedReceipt
        }
        
        // Attribute type of ASN1 Sequence must be an Integer
        guard let attributeType = DecodeASN1Integer(startOfInt: &#038;currentASN1PayloadLocation, length: currentASN1PayloadLocation!.distance(to: endOfPayload)) else {
            throw ReceiptValidationError.malformedReceipt
        }
        
        // Attribute version of ASN1 Sequence must be an Integer
        guard DecodeASN1Integer(startOfInt: &#038;currentASN1PayloadLocation, length: currentASN1PayloadLocation!.distance(to: endOfPayload)) != nil else {
            throw ReceiptValidationError.malformedReceipt
        }
        
        // Get ASN1 Sequence value
        ASN1_get_object(&#038;currentASN1PayloadLocation, &#038;length, &#038;type, &#038;xclass, currentASN1PayloadLocation!.distance(to: endOfPayload))
        
        // ASN1 Sequence value must be an ASN1 Octet String
        guard type == V_ASN1_OCTET_STRING else {
            throw ReceiptValidationError.malformedReceipt
        }
        
        // Strategy Step 3: Decode attributes
        switch attributeType {
        case 2:
            var startOfBundleId = currentASN1PayloadLocation
            bundleIdData = NSData(bytes: startOfBundleId, length: length)
            bundleIdentifier = DecodeASN1String(startOfString: &#038;startOfBundleId, length: length)
        case 3:
            var startOfAppVersion = currentASN1PayloadLocation
            appVersion = DecodeASN1String(startOfString: &#038;startOfAppVersion, length: length)
        case 4:
            let startOfOpaqueValue = currentASN1PayloadLocation
            opaqueValue = NSData(bytes: startOfOpaqueValue, length: length)
        case 5:
            let startOfSha1Hash = currentASN1PayloadLocation
            sha1Hash = NSData(bytes: startOfSha1Hash, length: length)
        case 17:
            var startOfInAppPurchaseReceipt = currentASN1PayloadLocation
            let iapReceipt = try parseInAppPurchaseReceipt(currentInAppPurchaseASN1PayloadLocation: &#038;startOfInAppPurchaseReceipt, payloadLength: length)
            inAppPurchaseReceipts.append(iapReceipt)
        case 12:
            var startOfReceiptCreationDate = currentASN1PayloadLocation
            receiptCreationDate = DecodeASN1Date(startOfDate: &#038;startOfReceiptCreationDate, length: length)
        case 19:
            var startOfOriginalAppVersion = currentASN1PayloadLocation
            originalAppVersion = DecodeASN1String(startOfString: &#038;startOfOriginalAppVersion, length: length)
        case 21:
            var startOfExpirationDate = currentASN1PayloadLocation
            expirationDate = DecodeASN1Date(startOfDate: &#038;startOfExpirationDate, length: length)
        default:
            break
        }
        
        currentASN1PayloadLocation = currentASN1PayloadLocation?.advanced(by: length)
    }
    
    // Strategy Step 4: Return ParsedReceipt
    return ParsedReceipt(bundleIdentifier: bundleIdentifier,
                            bundleIdData: bundleIdData,
                            appVersion: appVersion,
                            opaqueValue: opaqueValue,
                            sha1Hash: sha1Hash,
                            inAppPurchaseReceipts: inAppPurchaseReceipts,
                            originalAppVersion: originalAppVersion,
                            receiptCreationDate: receiptCreationDate,
                            expirationDate: expirationDate)
}
</pre>

Aside from the work with pointers and the Open SSL function names, the strategy is pretty straight-forward when you look it from a bird's-eye point of view.

Once again, if you're curious about how I knew to map each `case` within the `switch` to the correct receipt attribute, I simply got them from [Apple's documentation][7].

<a name="parse-in-app-purchase-receipt-implementation" class="jump-target"></a>

## `parseInAppPurchaseRectipt` function implementation

Now it's time to see how to parse an in-app purchase receipt payload. Take a look:

<pre class="lang:swift decode:true" title="Implementation of parse function" >func parseInAppPurchaseReceipt(currentInAppPurchaseASN1PayloadLocation: inout UnsafePointer&lt;UInt8>?, payloadLength: Int) throws -> ParsedInAppPurchaseReceipt {
    var quantity: Int?
    var productIdentifier: String?
    var transactionIdentifier: String?
    var originalTransactionIdentifier: String?
    var purchaseDate: Date?
    var originalPurchaseDate: Date?
    var subscriptionExpirationDate: Date?
    var cancellationDate: Date?
    var webOrderLineItemId: Int?
    
    // Find the end of the in-app purchase receipt payload
    let endOfPayload = currentInAppPurchaseASN1PayloadLocation!.advanced(by: payloadLength)
    var type = Int32(0)
    var xclass = Int32(0)
    var length = 0
    
    ASN1_get_object(&currentInAppPurchaseASN1PayloadLocation, &length, &type, &xclass, payloadLength)
    
    // Payload must be an ASN1 Set
    guard type == V_ASN1_SET else {
        throw ReceiptValidationError.malformedInAppPurchaseReceipt
    }
    
    // Decode Payload
    // Step through payload (ASN1 Set) and parse each ASN1 Sequence within (ASN1 Sets contain one or more ASN1 Sequences)
    while currentInAppPurchaseASN1PayloadLocation! &lt; endOfPayload {
        
        // Get next ASN1 Sequence
        ASN1_get_object(&#038;currentInAppPurchaseASN1PayloadLocation, &#038;length, &#038;type, &#038;xclass, currentInAppPurchaseASN1PayloadLocation!.distance(to: endOfPayload))
        
        // ASN1 Object type must be an ASN1 Sequence
        guard type == V_ASN1_SEQUENCE else {
            throw ReceiptValidationError.malformedInAppPurchaseReceipt
        }
        
        // Attribute type of ASN1 Sequence must be an Integer
        guard let attributeType = DecodeASN1Integer(startOfInt: &#038;currentInAppPurchaseASN1PayloadLocation, length: currentInAppPurchaseASN1PayloadLocation!.distance(to: endOfPayload)) else {
            throw ReceiptValidationError.malformedInAppPurchaseReceipt
        }
        
        // Attribute version of ASN1 Sequence must be an Integer
        guard DecodeASN1Integer(startOfInt: &#038;currentInAppPurchaseASN1PayloadLocation, length: currentInAppPurchaseASN1PayloadLocation!.distance(to: endOfPayload)) != nil else {
            throw ReceiptValidationError.malformedInAppPurchaseReceipt
        }
        
        // Get ASN1 Sequence value
        ASN1_get_object(&#038;currentInAppPurchaseASN1PayloadLocation, &#038;length, &#038;type, &#038;xclass, currentInAppPurchaseASN1PayloadLocation!.distance(to: endOfPayload))
        
        // ASN1 Sequence value must be an ASN1 Octet String
        guard type == V_ASN1_OCTET_STRING else {
            throw ReceiptValidationError.malformedInAppPurchaseReceipt
        }
        
        // Decode attributes
        switch attributeType {
        case 1701:
            var startOfQuantity = currentInAppPurchaseASN1PayloadLocation
            quantity = DecodeASN1Integer(startOfInt: &#038;startOfQuantity , length: length)
        case 1702:
            var startOfProductIdentifier = currentInAppPurchaseASN1PayloadLocation
            productIdentifier = DecodeASN1String(startOfString: &#038;startOfProductIdentifier, length: length)
        case 1703:
            var startOfTransactionIdentifier = currentInAppPurchaseASN1PayloadLocation
            transactionIdentifier = DecodeASN1String(startOfString: &#038;startOfTransactionIdentifier, length: length)
        case 1705:
            var startOfOriginalTransactionIdentifier = currentInAppPurchaseASN1PayloadLocation
            originalTransactionIdentifier = DecodeASN1String(startOfString: &#038;startOfOriginalTransactionIdentifier, length: length)
        case 1704:
            var startOfPurchaseDate = currentInAppPurchaseASN1PayloadLocation
            purchaseDate = DecodeASN1Date(startOfDate: &#038;startOfPurchaseDate, length: length)
        case 1706:
            var startOfOriginalPurchaseDate = currentInAppPurchaseASN1PayloadLocation
            originalPurchaseDate = DecodeASN1Date(startOfDate: &#038;startOfOriginalPurchaseDate, length: length)
        case 1708:
            var startOfSubscriptionExpirationDate = currentInAppPurchaseASN1PayloadLocation
            subscriptionExpirationDate = DecodeASN1Date(startOfDate: &#038;startOfSubscriptionExpirationDate, length: length)
        case 1712:
            var startOfCancellationDate = currentInAppPurchaseASN1PayloadLocation
            cancellationDate = DecodeASN1Date(startOfDate: &#038;startOfCancellationDate, length: length)
        case 1711:
            var startOfWebOrderLineItemId = currentInAppPurchaseASN1PayloadLocation
            webOrderLineItemId = DecodeASN1Integer(startOfInt: &#038;startOfWebOrderLineItemId, length: length)
        default:
            break
        }
        
        currentInAppPurchaseASN1PayloadLocation = currentInAppPurchaseASN1PayloadLocation!.advanced(by: length)
    }
    
    return ParsedInAppPurchaseReceipt(quantity: quantity,
                                        productIdentifier: productIdentifier,
                                        transactionIdentifier: transactionIdentifier,
                                        originalTransactionIdentifier: originalTransactionIdentifier,
                                        purchaseDate: purchaseDate,
                                        originalPurchaseDate: originalPurchaseDate,
                                        subscriptionExpirationDate: subscriptionExpirationDate,
                                        cancellationDate: cancellationDate,
                                        webOrderLineItemId: webOrderLineItemId)
}
</pre>

As you can see, parsing an in-app purchase receipt uses the same strategy as parsing the overall receipt does.

A receipt may contain zero or more in-app purchase receipts, so this function may get called zero, one, or many times, depending on what your app offers as in-app purchases, and of course, what your users have actually purchased.

<a name="final-receipt-parser" class="jump-target"></a>

# Final `ReceiptParser`

I realize that breaking the code apart like I've done is good for teaching purposes, but perhaps not so much for "I just wanna copy-paste and _use_ this" purposes.

I'll spare you having to scroll through _all_ that code again. If you'd like to see the full `ReceiptParser`, [check out the Swifty Local Receipt Validator repo on GitHub][12].

<a name="using-receipt-parser" class="jump-target"></a>

# Using `ReceiptParser`

I initialize an instance of `ReceiptParser` in my [`ReceiptValidator` struct][13], and then call the `parse(_:)` function from `validateReceipt()`:

<pre class="lang:swift decode:true mark:2,10,20" title="ReceiptValidator Updates" >enum ReceiptValidationResult {
    case success(ParsedReceipt) // Now has ParsedReceipt for an associated value
    case error(ReceiptValidationError)
}

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
            return .success(parsedReceipt)
        } catch {
            return .error(error as! ReceiptValidationError)
        }
    }
}
</pre>

<a name="preparing-to-finish-receipt-validation" class="jump-target"></a>

# Preparing to finish receipt validation!

What a journey this has been! We're _almost done_ with this receipt validation process.

What's left? After this guide, you still need to...

  * [Compute the GUID hash of your app][6] to compare with the hash that's found within the receipt. 
  * You'll also have to inspect the receipt data to perform any app-specific verification steps. 

We're that much closer now though! See you next time.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy...
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
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/" title="Extracting a PKCS7 Container for Receipt Validation with Swift">Extracting a PKCS7 Container for Receipt Validation with Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/16/receipt-validation-verifying-a-receipt-signature-in-swift/" title="Receipt Validation – Verifying a Receipt Signature in Swift">Receipt Validation – Verifying a Receipt Signature in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/31/finalizing-receipt-validation-in-swift-computing-a-guid-hash/" title="Finalizing Receipt Validation in Swift – Computing a GUID Hash">Finalizing Receipt Validation in Swift – Computing a GUID Hash</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/2015/10/05/preparing-to-test-receipt-validation-for-ios/
 [2]: https://www.andrewcbancroft.com/2015/09/21/openssl-for-ios-swift-the-easy-way/
 [3]: https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/
 [4]: https://www.andrewcbancroft.com/2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/
 [5]: https://www.andrewcbancroft.com/2017/07/16/receipt-validation-verifying-a-receipt-signature-in-swift/
 [6]: https://www.andrewcbancroft.com/2017/07/31/finalizing-receipt-validation-in-swift-computing-a-guid-hash/
 [7]: https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html
 [8]: #handling-error-conditions
 [9]: https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Set.jpeg
 [10]: https://www.andrewcbancroft.com/wp-content/uploads/2017/07/ASN1Sequence.jpeg
 [11]: #parsing-strategy
 [12]: https://github.com/andrewcbancroft/SwiftyLocalReceiptValidator
 [13]: https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/#receipt-validator