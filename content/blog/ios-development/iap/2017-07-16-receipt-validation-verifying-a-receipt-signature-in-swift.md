---
title: Receipt Validation – Verifying a Receipt Signature in Swift
author: Andrew
type: blog
date: 2017-07-16T21:43:21+00:00
aliases:
  - /2017/07/16/receipt-validation-verifying-a-receipt-signature-in-swift/
dsq_thread_id:
  - "5993480377"
categories:
  - Swift
tags:
  - Receipt Validation
  - Swift

---
  * You&#8217;ve [prepared to test receipt validation][1] by setting up your app in iTunes Connect.
  * You&#8217;ve brought in a cryptography library like OpenSSL to be able to work with the PKCS #7 container that acts as the &#8220;envelope&#8221; for the receipt. Perhaps you&#8217;ve even done it [the &#8220;easy way&#8221; with CocoaPods][2].
  * You&#8217;ve [located and loaded][3] the receipt for validation.
  * You&#8217;ve [extracted the PKCS #7 container][4].

The aim of this guide is to help you take a look _inside_ the PKCS #7 container, and verify the presence and authenticity of the signature on the receipt.

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

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#recap">Recap from the previous guide</a>
    </li>
    <li>
      <a href="#apple-root-cert">Preparation step: Download Apple&#8217;s root certificate</a>
    </li>
    <li>
      <a href="#what-can-go-wrong">What can go wrong with receipt signature verification?</a>
    </li>
    <li>
      <a href="#concept">ReceiptSignatureValidator concept</a>
    </li>
    <li>
      <a href="#implementation">ReceiptSignatureValidator implementation</a>
    </li>
    <ul>
      <li>
        <a href="#signature-presence">Checking signature presence</a>
      </li>
      <li>
        <a href="#signature-authenticity">Checking signature authenticity</a>
      </li>
      <ul>
        <li>
          <a href="#load-apple-root-cert">Loading Apple&#8217;s root certificate</a>
        </li>
        <li>
          <a href="#verify-authenticity">Verifying signature authenticity</a>
        </li>
      </ul>
    </ul>
    
    <li>
      <a href="#putting-it-all-together">Putting it all together</a>
    </li>
    <ul>
      <li>
        <a href="#final-implementation">Final ReceiptSignatureValidator implementation</a>
      </li>
      <li>
        <a href="#additions-to-receipt-validator">Additions to ReceiptValidator</a>
      </li>
      <li>
        <a href="#handling-errors">Handling errors</a>
      </li>
    </ul>
    
    <li>
      <a href="#upcoming-hurdles">Upcoming hurdles</a>
    </li>
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="recap" class="jump-target"></a>

# Recap from the previous guide

In [Loading a Receipt for Validation with Swift][3], I began the process of breaking out the various steps of the receipt validation process into separate single-responsibility structs with clearly named functions to help clarify what each piece of code is doing.

Recall that I’ve [created a main Type called `ReceiptValidator`][5], with references to several smaller single-responsibility Types that it uses to accomplish the overall validation process.

Accordingly, I’ve [created a ReceiptLoader][6] that finds the receipt on the file system and loads it into memory.

As of the last entry in this series of guides, I&#8217;ve also [got a `ReceiptExtractor`][7] to extract the receipt contents from its PKCS #7 container.

If a validation step ever fails along the way, I’ve decided to take advantage of Swift’s error throwing features to clearly describe what failed. So far, there’s only two cases:

<pre class="lang:swift decode:true " title="ReceiptValidationError" >enum ReceiptValidationError : Error {
    case couldNotFindReceipt
    case emptyReceiptContents
}</pre>

<a name="apple-root-cert" class="jump-target"></a>

# Preparation step: Download Apple&#8217;s root certificate

You need a copy of Apple&#8217;s root certificate in order to fully complete this phase of receipt validation.

How do you get a copy of it? Great question (with an answer)!

If you go to <https://www.apple.com/certificateauthority/>, you can get your hands on a copy by downloading the &#8220;Apple Inc. Root Certificate&#8221; file:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/Apple_PKI.png" alt="Apple Certificate Page" width="798" height="688" class="alignnone size-full wp-image-12375" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/Apple_PKI.png 798w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/Apple_PKI-300x259.png 300w" sizes="(max-width: 798px) 100vw, 798px" />][8]

Once you have it, you need to add the certificate to your Xcode project, and add it to your app&#8217;s target:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/06/root_cert_target_membership-1024x621.png" alt="Apple Root Certificate Target Membership" width="1024" height="621" class="alignnone size-large wp-image-12920" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/06/root_cert_target_membership-1024x621.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/06/root_cert_target_membership-300x182.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/06/root_cert_target_membership.png 1223w" sizes="(max-width: 1024px) 100vw, 1024px" />][9]

<a name="what-can-go-wrong" class="jump-target"></a>

# What can go wrong with receipt signature verification?

I&#8217;ll start off the code piece of this guide by asking, &#8220;What could go wrong?&#8221;. That&#8217;ll help define a few more `ReceiptValidationError` cases, and might point us in a direction when it comes to implementing a new Type to use within the `ReceiptValidator`.

Right off the bat, I can think of two or three things that could go awry at this stage of the receipt validation process:

1 &#8211; The receipt that we loaded may not be signed at all  
2 &#8211; We don&#8217;t have a copy of Apple&#8217;s root certificate to validate the signature with  
3 &#8211; The signature on the receipt is invalid because it doesn&#8217;t match against Apple&#8217;s root certificate

I&#8217;ll add those three new error states to the `ReceiptValidationError` enum now:

<pre class="lang:swift decode:true mark:4-6" title="ReceiptValidationError" >enum ReceiptValidationError : Error {
    case couldNotFindReceipt
    case emptyReceiptContents
    case receiptNotSigned
    case appleRootCertificateNotFound
    case receiptSignatureInvalid
}</pre>

<a name="concept" class="jump-target"></a>

# ReceiptSignatureValidator concept

Another step, another Type. This has been my strategy so far, so I&#8217;m stickin&#8217; to it!

I&#8217;m validating the **presence** and **authenticity** of the signature on the receipt, so I picked the name `ReceiptSignatureValidator` for this one.

When I identified three new `ReceiptValidationError` cases earlier, I had in mind that they could potentially point me in a direction when implementing this new `ReceiptSignatureValidator` Type.

What if this Type had two functions?

  * `checkSignaturePresence`
  * `checkSignatureAuthenticity`

In `checkSignaturePresence`, I&#8217;ll look, and if the receipt isn&#8217;t signed at all, I&#8217;ll throw the `receiptNotSigned` Error case.

In `checkSignatureAuthenticity`, I&#8217;ll look, and if the Apple root certificate is missing from the bundle for some reason, I&#8217;ll throw `appleRootCertificateNotFound`. And if the signature on the receipt doesn&#8217;t jive with Apple&#8217;s root certificate, I&#8217;ll throw `receiptSignatureInvalid`.

Here&#8217;s the skeleton of the struct:

<pre class="lang:swift decode:true " title="ReceiptSignatureValidator" >struct ReceiptSignatureValidator {
    func checkSignaturePresence(_ PKCS7Container: UnsafeMutablePointer&lt;PKCS7&gt;) throws {
        // Implementation coming
    }
    
    func checkSignatureAuthenticity(_ PKCS7Container: UnsafeMutablePointer&lt;PKCS7&gt;) throws {
        // Implementation coming
    }
}</pre>

Both `checkSignaturePresence` and `checkSignatureAuthenticity` need to peek into the PKCS #7 container that encapsulates the receipt data, so each function asks for a reference to an `UnsafeMutablePointer<PKCS7>` as one of its arguments.

If you&#8217;re following along with the series, you&#8217;ll be glad to know that [the `ReceiptExtractor` that we built previously][7] has a method called `extractPKCS7Container` that actually _returns_ a `UnsafeMutablePointer<PKCS7>`, so you can just use the a call to `extractPKCS7Container` with the new `ReceiptSignatureValidator's` functions.

<a name="implementation" class="jump-target"></a>

# ReceiptSignatureValidator implementation

Now to actually _implement_ `ReceiptSignatureValidator`&#8230;

<a name="signature-presence" class="jump-target"></a>

## Checking signature presence

Checking for the presence of a signature is actually relatively simple. Take a look:

<pre class="lang:swift decode:true mark:3,5-7" title="ReceiptSignatureValidator" >struct ReceiptSignatureValidator {
    func checkSignaturePresence(_ PKCS7Container: UnsafeMutablePointer&lt;PKCS7&gt;) throws {
        let pkcs7SignedTypeCode = OBJ_obj2nid(PKCS7Container.pointee.type)
        
        guard pkcs7SignedTypeCode == NID_pkcs7_signed else {
            throw ReceiptValidationError.receiptNotSigned
        }
    }
    
    func checkSignatureAuthenticity(_ PKCS7Container: UnsafeMutablePointer&lt;PKCS7&gt;) throws {
        // Implementation coming
    }
}
</pre>

The PKCS #7 container has a type code associated with it if it&#8217;s _signed_. All we need to do is access that type code, and compare it against the `NID_pkcs7_signed` constant.

In order to be valid, the receipt _must_ be signed, so I&#8217;ve implemented this as a guard.

<a name="signature-authenticity" class="jump-target"></a>

## Checking signature authenticity

<a name="load-apple-root-cert" class="jump-target"></a>

### Loading Apple&#8217;s root certificate

Now comes the part where we check whether the signature on the receipt is authentic or not.

First, we&#8217;ve got to load up Apple&#8217;s root certificate (assuming it exists in the app bundle). Here&#8217;s a function that can be nested inside of `ReceiptSignatureValidator` to do the job:

<pre class="lang:swift decode:true " title="loadAppleRootCertificate" >fileprivate func loadAppleRootCertificate() throws -> UnsafeMutablePointer&lt;X509> {
    guard
        let appleRootCertificateURL = Bundle.main.url(forResource: "AppleIncRootCertificate", withExtension: "cer"),
        let appleRootCertificateData = try? Data(contentsOf: appleRootCertificateURL)
        else {
            throw ReceiptValidationError.appleRootCertificateNotFound
    }
    
    //①
    let appleRootCertificateBIO = BIO_new(BIO_s_mem())

    //②
    BIO_write(appleRootCertificateBIO, (appleRootCertificateData as NSData).bytes, Int32(appleRootCertificateData.count))

    //③
    let appleRootCertificateX509 = d2i_X509_bio(appleRootCertificateBIO, nil)
    
    return appleRootCertificateX509!
}</pre>

This function guards against the absence of Apple&#8217;s root certificate. If it can&#8217;t be found in the main bundle, the function throws `appleRootCertificateNotFound`. This error is obviously preventable, but hey &#8211; never hurts to protect yourself if you&#8217;re using this code in multiple projects and forget to grab a copy of Apple&#8217;s root certificate.

① As long as the .cer file exists in the app bundle, the next step is to create a new in-memory BIO (basic input-output) pointer. That&#8217;s what `let appleRootCertificateBIO = BIO_new(BIO_s_mem())` does.

② Next, we&#8217;ve got to write the contents of the certificate to memory so we can work with it:

<pre class="lang:swift decode:true " title="BIO_write">BIO_write(appleRootCertificateBIO, (appleRootCertificateData as NSData).bytes, Int32(appleRootCertificateData.count))
</pre>

`BIO_write` needs a location to write to, namely, our `appleRootCertificateBIO` pointer.

It also needs to know _what_ to write: `(appleRootCertificateData as NSData).bytes`

Finally, it needs to know the length of the data to write: `Int32(appleRootCertificateData.count)`

③ Once that&#8217;s complete, we can obtain pointer to an `X509`, which will be used for the next step: verifying the authenticity of the signature on the receipt with the x509 certificate from Apple&#8217;s root certificate authority. `let appleRootCertificateX509 = d2i_X509_bio(appleRootCertificateBIO, nil)` gives us our return value!

<a name="verify-authenticity" class="jump-target"></a>

### Verifying signature authenticity

The final step is to take the `X509` pointer, and use it to verify the authenticity of the signature on the PKCS #7 Container.

Once again, here&#8217;s a function that can take both items and do the work:

<pre class="lang:swift decode:true " title="verifyAuthenticity" >fileprivate func verifyAuthenticity(_ x509Certificate: UnsafeMutablePointer&lt;X509&gt;, PKCS7Container: UnsafeMutablePointer&lt;PKCS7&gt;) throws {
    //①
    let x509CertificateStore = X509_STORE_new()

    //②
    X509_STORE_add_cert(x509CertificateStore, x509Certificate)
    
    //③
    OpenSSL_add_all_digests()
    
    //④
    let result = PKCS7_verify(PKCS7Container, nil, x509CertificateStore, nil, nil, 0)
    
    //⑤
    if result != 1 {
        throw ReceiptValidationError.receiptSignatureInvalid
    }
}</pre>

① The X509 Store is what holds the information for verification, so we use `X509_STORE_new()` to create one.

② Next, `X509_STORE_add_cert` function is used to prepare the X509 Store, and the X509 _Certificate_ for verification purposes.

③ OpenSSL keeps an internal table of digest algorithms and ciphers. It uses this table to lookup ciphers via certain functions. `OpenSSL_add_all_digests()` is called to load the necessary digest algorithms for verification.

④ The final step is to use the `PKCS7_verify` function, passing it the PKCS #7 Container, and the x509 Certificate Store.

⑤ `PKCS7_Verify` will return **1** if the signature is valid. If `PKCS7_Verify` returns any integer value _other than_ 1, the signature is to be interpreted as _invalid_.

<a name="putting-it-all-together" class="jump-target"></a>

# Putting it all together

<a name="final-implementation" class="jump-target"></a>

## Final ReceiptSignatureValidator implementation

The final version of the `ReceiptSignatureValidator` looks like this:

<pre class="lang:swift decode:true " title="Final ReceiptSignatureValidator" >struct ReceiptSignatureValidator {
    func checkSignaturePresence(_ PKCS7Container: UnsafeMutablePointer&lt;PKCS7&gt;) throws {
        let pkcs7SignedTypeCode = OBJ_obj2nid(PKCS7Container.pointee.type)
        
        guard pkcs7SignedTypeCode == NID_pkcs7_signed else {
            throw ReceiptValidationError.receiptNotSigned
        }
    }
    
    func checkSignatureAuthenticity(_ PKCS7Container: UnsafeMutablePointer&lt;PKCS7&gt;) throws {
        let appleRootCertificateX509 = try loadAppleRootCertificate()
        
        try verifyAuthenticity(appleRootCertificateX509, PKCS7Container: PKCS7Container)
    }
    
    fileprivate func loadAppleRootCertificate() throws -&gt; UnsafeMutablePointer&lt;X509&gt; {
        guard
            let appleRootCertificateURL = Bundle.main.url(forResource: "AppleIncRootCertificate", withExtension: "cer"),
            let appleRootCertificateData = try? Data(contentsOf: appleRootCertificateURL)
            else {
                throw ReceiptValidationError.appleRootCertificateNotFound
        }
        
        let appleRootCertificateBIO = BIO_new(BIO_s_mem())
        BIO_write(appleRootCertificateBIO, (appleRootCertificateData as NSData).bytes, Int32(appleRootCertificateData.count))
        let appleRootCertificateX509 = d2i_X509_bio(appleRootCertificateBIO, nil)
        
        return appleRootCertificateX509!
    }
    
    fileprivate func verifyAuthenticity(_ x509Certificate: UnsafeMutablePointer&lt;X509&gt;, PKCS7Container: UnsafeMutablePointer&lt;PKCS7&gt;) throws {
        let x509CertificateStore = X509_STORE_new()
        X509_STORE_add_cert(x509CertificateStore, x509Certificate)
        
        OpenSSL_add_all_digests()
        
        let result = PKCS7_verify(PKCS7Container, nil, x509CertificateStore, nil, nil, 0)
        
        if result != 1 {
            throw ReceiptValidationError.receiptSignatureInvalid
        }
    }
}</pre>

<a name="additions-to-receipt-validator" class="jump-target"></a>

## Additions to ReceiptValidator

The `ReceiptValidator` struct that&#8217;s been growing to accommodate each of the steps now looks like this (additions highlighted):

<pre class="lang:swift decode:true mark:4,12-13" title="ReceiptValidator" >struct ReceiptValidator {
    let receiptLoader = ReceiptLoader()
    let receiptExtractor = ReceiptExtractor()
    let receiptSignatureValidator = ReceiptSignatureValidator()

    
    func validateReceipt() -> ReceiptValidationResult {
        do {
            let receiptData = try receiptLoader.loadReceipt()
            let receiptContainer = try receiptExtractor.extractPKCS7Container(receiptData)
            
            try receiptSignatureValidator.checkSignaturePresence(receiptContainer)
            try receiptSignatureValidator.checkSignatureAuthenticity(receiptContainer)
            return .success
        } catch {
            return .error(error as! ReceiptValidationError)
        }
    }
}</pre>

<a name="handling-errors" class="jump-target"></a>

## Handling errors

The final piece is to attempt to do something intelligent with any of the possible error conditions that could be included with the `ReceiptValidator` validation result. Here&#8217;s a sample implementation at the call site for `validateReceipt()` (probably in a view controller somewhere in your app:

<pre>override public func viewDidLoad() {
    super.viewDidLoad()

    let validationResult = receiptValidator.validateReceipt()
        
    switch validationResult {
    case .success:
        // Enable app features
    case .error(let error):
        print(error)
        receiptRequest.start()
    }   
}
</pre>

In the case where the receipt signature is invalid, my only thought right now is to request a new receipt from the app store and attempt to re-validate it.

<a name="upcoming-hurdles" class="jump-target"></a>

# Upcoming hurdles

Wait, there&#8217;s more? In short, yes. We&#8217;ve made significant progress, but [there&#8217;s still more work to be done][10] if you want to fully validate a receipt for your app, or for an in-app purchase.

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
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/" title="Extracting a PKCS7 Container for Receipt Validation with Swift">Extracting a PKCS7 Container for Receipt Validation with Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/27/receipt-validation-parsing-a-receipt-with-swift/" title="Receipt Validation – Parse and Decode a Receipt with Swift">Receipt Validation – Parse and Decode a Receipt with Swift</a>
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
 [5]: https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/#receipt-validator-implementation
 [6]: https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/#receipt-loader-implementation
 [7]: https://www.andrewcbancroft.com/2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/#receiptextractor-implementation
 [8]: https://www.andrewcbancroft.com/wp-content/uploads/2015/10/Apple_PKI.png
 [9]: https://www.andrewcbancroft.com/wp-content/uploads/2016/06/root_cert_target_membership.png
 [10]: https://developer.apple.com/library/content/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateLocally.html#//apple_ref/doc/uid/TP40010573-CH1-SW2