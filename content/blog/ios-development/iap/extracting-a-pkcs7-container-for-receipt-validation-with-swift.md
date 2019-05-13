---
title: Extracting a PKCS7 Container for Receipt Validation with Swift
author: Andrew
type: blog
date: 2016-06-10T03:44:58+00:00
aliases:
  - /2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/
dsq_thread_id:
  - "4898612593"
categories:
  - Swift
tags:
  - OpenSSL
  - Receipt Validation
  - Swift

---
<small>Updated on July 15, 2017 – Swift 3 </small>

So you've [prepared to test receipt validation][1] by setting up your app in iTunes Connect.

You've brought in a cryptography library like OpenSSL to be able to work with the PKCS #7 container that acts as the "envelope&#8221; for the receipt. Perhaps you've even done it [the "easy way&#8221; with CocoaPods][2].

You've [located and loaded][3] the receipt for validation.

Now you're ready to extract the PKCS #7 container and work with it.

The aim of this guide is to get you started using the OpenSSL library in your Swift code by employing it to extract the receipt contents from its PKCS #7 container.

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

<a name="recap" class="jump-target"></a>

# Recap from the previous guide

In [Loading a Receipt for Validation with Swift][3], I began the process of breaking out the various steps of the receipt validation process into separate single-responsibility structs with clearly named functions to help clarify what each piece of code is doing.

Recall that I've created a [main Type called `ReceiptValidator`][4], with references to several smaller single-responsibility Types that it uses to accomplish the overall validation process. So accordingly, as of my last post in the series, I've [created a `ReceiptLoader`][5] that finds the receipt on the file system and loads it into memory.

If a validation step ever fails along the way, I've decided to take advantage of Swift's error throwing features to clearly describe what failed. So far, there's only one case:

```swift
enum ReceiptValidationError : Error {
    case couldNotFindReceipt
}
```

I'll expand this enum Type to cover more failure conditions in this guide.

<a name="receipt-extractor-outline" class="jump-target"></a>

# ReceiptExtractor struct outline

The OpenSSL library comes to us in the form of a C static library. It's not a beautiful API to say the least. The names of the Types and functions are really cryptic at times, so I've decided it's best for my own memory to wrap each step in small function routines that are named for what they do.

So supposing you've [located and loaded][3] the receipt data, or used [Store Kit][6] to request a receipt from Apple&#8230; Take a look at this new `ReceiptExtractor` skeleton of a struct to get an idea of what's going to be required to extract the PKCS7 container for the receipt:

```swift
struct ReceiptExtractor {
    func extractPKCS7Container(_ receiptData: Data) throws -> UnsafeMutablePointer&lt;PKCS7> {
        // use Open SSL to extract the PKCS7 container
        // throw a ReceiptValidationError if something goes wrong in this process
    }
}
```

<a name="new-receiptvalidationerror-cases" class="jump-target"></a>

# New ReceiptValidationError cases

When extracting the receipt information from the PKCS7 container, there are going to be things that would cause overall validation to fail. For example, if the [receipt `Data` instance][5] ends up being empty, that's a validation failure. The PKCS7 container needs to have information inside of it for validation to pass (obviously).

So in this guide, I'll expand the `ReceiptValidationError` enum to have the following cases:

```swift
enum ReceiptValidationError : Error {
    case couldNotFindReceipt
    case emptyReceiptContents
}
```

<a name="prep-pkcs7-union-accessors" class="jump-target"></a>

# Preparation step: PKCS7 union accessors

Before attempting to work with OpenSSL's PKCS7 functions, you've got to do a little prep work to get the functions to play nicely with Swift.

Unfortunately, Swift doesn't work well with [C union types][7]. It simply can't see things defined with a C union.

Thankfully, we can work around the problem by creating some wrappers. If you'll add two new files to your project and implement them, you'll be on your way. They are:

  * pkcs7\_union\_accessors.h
  * pkcs7\_union\_accessors.c

<a name="pkcs7-union-accessors-h-implementation" class="jump-target"></a>

## pkcs7\_union\_accessors.h implementation

<pre class="lang:c decode:true " title="pkcs7_union_accessors.h" >#ifndef pkcs7_union_accessors_h
#define pkcs7_union_accessors_h

#include &lt;openssl/pkcs7.h&gt;

char *pkcs7_d_char(PKCS7 *ptr);
ASN1_OCTET_STRING *pkcs7_d_data(PKCS7 *ptr);
PKCS7_SIGNED *pkcs7_d_sign(PKCS7 *ptr);
PKCS7_ENVELOPE *pkcs7_d_enveloped(PKCS7 *ptr);
PKCS7_SIGN_ENVELOPE *pkcs7_d_signed_and_enveloped(PKCS7 *ptr);
PKCS7_DIGEST *pkcs7_d_digest(PKCS7 *ptr);
PKCS7_ENCRYPT *pkcs7_d_encrypted(PKCS7 *ptr);
ASN1_TYPE *pkcs7_d_other(PKCS7 *ptr);

#endif /* pkcs7_union_accessors_h */
```

<a name="pkcs7-union-accessors-c-implementation" class="jump-target"></a>

## pkcs7\_union\_accessors.c implementation

<pre class="lang:c decode:true " title="pkcs_union_accessors.c" >#include "pkcs7_union_accessors.h"

inline char *pkcs7_d_char(PKCS7 *ptr) {
    return ptr-&gt;d.ptr;
}

inline ASN1_OCTET_STRING *pkcs7_d_data(PKCS7 *ptr) {
    return ptr-&gt;d.data;
}

inline PKCS7_SIGNED *pkcs7_d_sign(PKCS7 *ptr) {
    return ptr-&gt;d.sign;
}

inline PKCS7_ENVELOPE *pkcs7_d_enveloped(PKCS7 *ptr) {
    return ptr-&gt;d.enveloped;
}

inline PKCS7_SIGN_ENVELOPE *pkcs7_d_signed_and_enveloped(PKCS7 *ptr) {
    return ptr-&gt;d.signed_and_enveloped;
}

inline PKCS7_DIGEST *pkcs7_d_digest(PKCS7 *ptr) {
    return ptr-&gt;d.digest;
}

inline PKCS7_ENCRYPT *pkcs7_d_encrypted(PKCS7 *ptr) {
    return ptr-&gt;d.encrypted;
}

inline ASN1_TYPE *pkcs7_d_other(PKCS7 *ptr) {
    return ptr-&gt;d.other;
}
```

<a name="bridging-header-updates" class="jump-target"></a>

## Bridging header updates

After you create the union accessor files, you need to update your project's bridging header to import the new header file:

<pre class="lang:c decode:true " title="bridging header" >#import &lt;openssl/pkcs7.h&gt;
#import &lt;openssl/objects.h&gt;
#import "pkcs7_union_accessors.h"
```

<a name="receiptextractor-implementation" class="jump-target"></a>

# ReceiptExtractor struct implementation

Now it's time to dive into the actual implementation of what I'm calling a `ReceiptExtractor`. Have a look at the code with some explanatory comments following:

```swift
struct ReceiptExtractor {
    func extractPKCS7Container(_ receiptData: Data) throws -> UnsafeMutablePointer&lt;PKCS7> {
        let receiptBIO = BIO_new(BIO_s_mem())       
        BIO_write(receiptBIO, (receiptData as NSData).bytes, Int32(receiptData.count))
        let receiptPKCS7Container = d2i_PKCS7_bio(receiptBIO, nil)
        
        guard receiptPKCS7Container != nil else {
            throw ReceiptValidationError.emptyReceiptContents
        }
        
        let pkcs7DataTypeCode = OBJ_obj2nid(pkcs7_d_sign(receiptPKCS7Container).pointee.contents.pointee.type)
        
        guard pkcs7DataTypeCode == NID_pkcs7_data else {
            throw ReceiptValidationError.emptyReceiptContents
        }
        
        return receiptPKCS7Container!
    }
}
```

<a name="receiptextractor-explanation" class="jump-target"></a>

# ReceiptExtractor struct explanation

Most of the code above is a Swift translation of what's found at [Objc.io's Receipt Validation guide][8].

I did a little research over at the OpenSSL site though, and thought it might be helpful for the curious to know what some of these non-intuitive function names stand for and what they do.

`BIO_new` for example. "BIO&#8221; stands for "Basic I/O&#8221;. It's an abstraction over the underlying basic input and output operations that your app uses for cryptographic operations.

What we're doing with `BIO_new(BIO_s_mem())` is saying that we want a new Basic I/O mechanism that uses _memory_ for its I/O operations.

`BIO_write` takes the [`receiptData` that was located and loaded][3], and writes the entire length of its bytes to memory (the `receiptBIO` that was created first).

To get the actual PKCS #7 container, the `d2i_PKCS7_bio` function is used.

Once we have the container in hand, it's a matter of making sure it has contents.

I couldn't find a lot of information about the call to `pkcs7_d_sign`, but the primary point of line 13 above is to get a "numerical identifier&#8221;, which is what "NID&#8221; stands for in `OBJ_obj2nid`.

Digging into the PKCS #7 container, you can access the right property and convert it to a numerical identifier that you can check.

As long as the NID returned is equal to the `NID_pkcs7_data` constant value, things are good. If they're not, that means the receipt has no information and validation fails (thus, the guard and throw statement in lines 14-15).

If everything passes the guard, though, the PKCS #7 container is returned, and we're ready for the next step of the receipt validation process, which is to verify the signature on the receipt with Apple's root certificate. _That_, however, will happen in another entry to this series.

Until next time!

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
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/16/receipt-validation-verifying-a-receipt-signature-in-swift/" title="Receipt Validation – Verifying a Receipt Signature in Swift">Receipt Validation – Verifying a Receipt Signature in Swift</a>
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
 [4]: https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/#receipt-validator-implementation
 [5]: https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/#receipt-loader-implementation
 [6]: https://developer.apple.com/library/ios/documentation/StoreKit/Reference/StoreKit_Collection/
 [7]: https://en.wikipedia.org/wiki/Union_type#C.2FC.2B.2B
 [8]: https://www.objc.io/issues/17-security/receipt-validation/