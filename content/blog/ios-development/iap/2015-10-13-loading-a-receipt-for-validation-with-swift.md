---
title: Loading a Receipt for Validation with Swift
author: Andrew
type: blog
date: 2015-10-14T03:24:02+00:00
url: /2015/10/13/loading-a-receipt-for-validation-with-swift/
dsq_thread_id:
  - "4223016914"
categories:
  - Swift
tags:
  - Receipt Validation
  - Swift

---
<small>Updated on July 15, 2017 &#8211; Swift 3 </small>

I&#8217;m working through a progression of entries on the process of validating receipts with OpenSSL for iOS in Swift.

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

To-date, I&#8217;ve explained how to [get OpenSSL into your project (the easy way)][1], and I&#8217;ve walked through how to [prepare to test receipt validation][2], including how to set everything up in the Apple Developer member center, and in iTunes Connect.

There are at least 5 steps to validate a receipt, as the [Receipt Validation Programming Guide][3] outlines:

1 &#8211; Locate the receipt.  
If no receipt is present, validation fails.

2 &#8211; Verify that the receipt is properly signed by Apple.  
If it is not signed by Apple, validation fails.

3 &#8211; Verify that the bundle identifier in the receipt matches a hard-coded constant containing the CFBundleIdentifier value you expect in the Info.plist file.  
If they do not match, validation fails.

4 &#8211; Verify that the version identifier string in the receipt matches a hard-coded constant containing the CFBundleShortVersionString value (for macOS) or the CFBundleVersion value (for iOS) that you expect in the Info.plist file.  
If they do not match, validation fails.

5 &#8211; Compute the hash of the GUID as described in Compute the Hash of the GUID.  
If the result does not match the hash in the receipt, validation fails.

The thought I had when I saw 5 steps is, &#8220;This is going to become too much responsibility for a single Type to handle&#8221;. I easily got overwhelmed when I analyzed the [most extensive write-up on the subject, found at Objc.io][4].

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#organization-strategy">Validation organization strategy overview</a>
    </li>
    <ul>
      <li>
        <a href="#receipt-validator">ReceiptValidator</a>
      </li>
      <li>
        <a href="#separate-types">Map validation steps to separate Types</a>
      </li>
      <li>
        <a href="#throw-errors">Throw errors when a validation step fails</a>
      </li>
    </ul>
    
    <li>
      <a href="#receipt-validator-implementation">ReceiptValidator implementation</a>
    </li>
    <li>
      <a href="#receipt-loader-implementation">ReceiptLoader implementation</a>
    </li>
    <li>
      <a href="#view-controller-implementation">ViewController implementation</a>
    </li>
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

<a name="organization-strategy" class="jump-target"></a>

### Validation organization strategy overview

To help keep my head wrapped around this process, I&#8217;ve developed a strategy that has kept me sane so far. It incorporates 3 components:

<a name="receipt-validator" class="jump-target"></a>

#### 1 &#8211; ReceiptValidator

First, I&#8217;ve created a top-level Type called `ReceiptValidator`. My idea is to have a single method, `validateReceipt()` that will either run and succeed, or start propagating errors.

<a name="separate-types" class="jump-target"></a>

#### 2 &#8211; Map validation steps to separate Types

Second, I&#8217;ve tried to take each of the steps involved in validating the receipt and create a simple Swift Type to encapsulate the logic that needs to happen in that step.

So when step 1 says to &#8220;locate and load the receipt&#8221;, I created a struct called `ReceiptLoader` that has two methods: `receiptFound()` and `loadReceipt()`.

`ReceiptValidator` currently holds references to instances of each of these little helper Types, and the validator class itself calls methods on those instances to get the overall job of validating the receipt done.

<a name="throw-errors" class="jump-target"></a>

#### 3 &#8211; Throw errors when a validation step fails

Third, whenever some step along the way fails, I&#8217;m utilizing Swift&#8217;s error handling features. I&#8217;ve created an enum called `ReceiptValidationError` with various descriptive values. Whenever a validation error occurs, one of the values in the `ReceiptValidationError` enum is thrown.

The enum&#8217;s definition is simple right now, but it will grow as time goes on with various other error conditions related to receipt validation (and why validation might fail):

<pre class="lang:default decode:true " title="ReceiptValidationError Enum" >enum ReceiptValidationError : Error {
    case couldNotFindReceipt
}</pre>

This enum simply implements the `Error` &#8220;marker&#8221; protocol, which allows its values to be used in Swift&#8217;s error-throwing system. For this blog entry, we&#8217;ll stick with simply throwing the value `couldNotFindReceipt` whenever a receipt can&#8217;t be found and needs to be re-requested from the App Store.

<a name="receipt-validator-implementation" class="jump-target"></a>

### ReceiptValidator implementation

`ReceiptValidator` is where everything for validating receipts launches for me at this point. Calling a single method, `validateReceipt()` will kick off the 5+ step process that Apple describes.

The first thing that needs to happen is to load a receipt that&#8217;ll be validated. If a receipt is not found on the device, a new receipt needs to be requested from the App Store.

I mentioned `ReceiptLoader` in the overview. An implementation will follow, but we&#8217;ll let this instance do the locating and loading of the receipt.

With that architecture in mind, here&#8217;s what `ReceiptValidator` looks like right now:

<pre class="lang:swift decode:true " title="ReceiptValidator.swift" >enum ReceiptValidationResult {
    case success
    case error(ReceiptValidationError)
}

struct ReceiptValidator {
    let receiptLoader = ReceiptLoader()
    
    func validateReceipt() -> ReceiptValidationResult {
        do {
            let receiptData = try receiptLoader.loadReceipt()
            
            // Continue validation steps with receiptData if error not thrown
            return .success
        } catch {
            return .error(error as! ReceiptValidationError)
        }
    }
}</pre>

So the validator simply lets the `ReceiptLoader` instance do it&#8217;s loading job. If it doesn&#8217;t return any data containing a receipt to work with, the validator will catch the error and return the `.error` `ReceiptValidationResult` case with the error cast to a `ReceiptValidationError` as an associated value.

The View Controller is what calls `validateReceipt()`, so it will be waiting to deal with the `ReceiptValidationResult` that&#8217;s returned by the `ReceiptValidator`.

<a name="receipt-loader-implementation" class="jump-target"></a>

### ReceiptLoader implementation

The `ReceiptLoader` has the sole responsibility of going to receipt storage location on a user&#8217;s device and attempting to discover the receipt and pull out the contents of that file in the form of a `Data` instance if it&#8217;s there.

Here&#8217;s the implementation with explanation to follow:

<pre class="lang:swift decode:true " title="ReceiptLoader.swift" >struct ReceiptLoader {
    let receiptUrl = Bundle.main.appStoreReceiptURL
    
    func loadReceipt() throws -> Data {
        if(receiptFound()) {
            let receiptData = try? Data(contentsOf: receiptUrl!)
            if let receiptData = receiptData {
                return receiptData
            }
        }
        
        throw ReceiptValidationError.couldNotFindReceipt
    }
    
    fileprivate func receiptFound() -> Bool {
        do {
            if let isReachable = try receiptUrl?.checkResourceIsReachable() {
                return isReachable
            }
        } catch _ {
            return false
        }
        
        return false
    }
}</pre>

The `loadReceipt()` method will do the job and either return a `Data` instance with the receipt contents that can be extracted and parsed in later steps, or it will throw the `ReceiptValidationError.couldNotFindReceipt` enum value.

The rest of the implementation is all around making sure the receipt is there and accessible by utilizing standard `URL` and `Data` methods.

<a name="view-controller-implementation" class="jump-target"></a>

### ViewController implementation

The View Controller is the kick-off point of all-things receipt validation. To have some code in front of us, take a look at this implementation. Explanatory details are below:

<pre class="lang:swift decode:true " title="ViewController.swift" >public class ViewController: UIViewController, SKRequestDelegate {
    let receiptValidator = ReceiptValidator()
    let receiptRequest = SKReceiptRefreshRequest()
    
    // MARK: View Controller Life Cycle Methods
    override public func viewDidLoad() {
        super.viewDidLoad()
        receiptRequest.delegate = self
        
        let validationResult = receiptValidator.validateReceipt()
 
        switch validationResult {
        case .success:
            // Enable app features
        case .error(let error):
            print(error)
            receiptRequest.start()
        }   
    }
    
    public func requestDidFinish(_ request: SKRequest) {
        do {
            try receiptValidator.validateReceipt()
        } catch {
            // Log unsuccessful attempt and optionally begin grace period
            // before disabling app functionality, or simply disable features
        }
    }
    
    public func request(_ request: SKRequest, didFailWithError error: Error) {
        // debug error condition
        print(error.localizedDescription)
 
        // Log unsuccessful attempt and optionally begin grace period
        // before disabling app functionality, or simply disable features
    }
}</pre>

When the app starts and the controller has loaded, it will prepare itself in a couple of ways:

First, it will initialize a `ReceiptValidator` and an `SKReceiptRefreshRequest` (in case a receipt isn&#8217;t present on the device).

Subtle but important, the `SKReceiptRefreshRequest` instance&#8217;s delegate is set to the view controller itself in `viewDidLoad()`.

Control is then handed over to the `ReceiptValidator` instance to begin its multi-step process (of which we&#8217;ve got step 1 down up to this point).

The View Controller acts as the main error handler for now. If a receipt couldn&#8217;t be found, signaled by the throwing of `ReceiptValidationError.couldNotFindReceipt` by the validator, the receipt refresh request is started.

The View Controller also acts as the `SKRequestDelegate`, and thus gets called back whenever the request finishes (or fails with an error).

If receipt validation fails once the receipt is downloaded to the device, [Apple recommends][3] that in iOS, we _do not attempt to terminate the app_.

Rather, they recommend logging that the receipt validation failed and then initiating a grace period, or disabling functionality in your app, depending on the situation.

<a name="upcoming-hurdles" class="jump-target"></a>

### Upcoming hurdles

That about wraps up locating and loading the receipt. The _real_ challenges of using OpenSSL to extract the receipt, verify its authenticity, parse it, and more are still ahead. I&#8217;ll be sure to chronicle my journey as I jump those hurdles. Stay tuned!

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
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/09/21/openssl-for-ios-swift-the-easy-way/" title="OpenSSL for iOS &#038; Swift the Easy Way">OpenSSL for iOS & Swift the Easy Way</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/" title="Extracting a PKCS7 Container for Receipt Validation with Swift">Extracting a PKCS7 Container for Receipt Validation with Swift</a>
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

 [1]: https://www.andrewcbancroft.com/2015/09/21/openssl-for-ios-swift-the-easy-way/ "OpenSSL for iOS & Swift the Easy Way"
 [2]: https://www.andrewcbancroft.com/2015/10/05/preparing-to-test-receipt-validation-for-ios/ "Preparing to Test Receipt Validation for iOS"
 [3]: https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateLocally.html#//apple_ref/doc/uid/TP40010573-CH1-SW2
 [4]: https://www.objc.io/issues/17-security/receipt-validation/