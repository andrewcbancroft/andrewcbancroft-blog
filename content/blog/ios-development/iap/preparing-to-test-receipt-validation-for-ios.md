---
title: Preparing to Test Receipt Validation for iOS
description: "This walk-through should provide guidance to get you ready to work with receipts in your iOS application."
author: Andrew
type: blog
disppsiapbadge: true
date: 2015-10-05T18:25:09+00:00
lastmod: 2019-06-27T00:00:00+00:00
url: /2015/10/05/preparing-to-test-receipt-validation-for-ios/
dsq_thread_id:
  - "4196824551"
tags:
  - In-App Purchases
  - Receipt Validation
  - Swift
exclude_related: true
---

After having to piece together each step along the path of preparing to test receipt validation for iOS apps, I've decided to combine everything into the following guide. Whether you're working to implement receipt validation for a new iOS app, or for an existing one, this walk-through should provide guidance to get you ready to work with receipts in your iOS application.

<a name="app-record-setup" class="jump-target"></a>

### iTunes Connect App Record Setup

##### 1 – Log in to the Apple Developer Member Center.

##### 2 – Make sure you have a bundle identifier set up for your app.

If this is an existing app you're wanting to add receipt validation to, you're already set. If this is a brand new, un-released app, you need to set up a bundle identifier first.

2a) Click on Certificates, Identifiers & Profiles:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/manage-bundle-identifier-1024x296.png" alt="Manage bundle identifier" width="1024" height="296" class="alignnone size-large wp-image-12325" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/manage-bundle-identifier-1024x296.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/manage-bundle-identifier-300x87.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/manage-bundle-identifier.png 1102w" sizes="(max-width: 1024px) 100vw, 1024px" />][1]

2b) Click on Identifiers:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/identifiers.png" alt="Identifiers" width="1005" height="455" class="alignnone size-full wp-image-12326" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/identifiers.png 1005w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/identifiers-300x136.png 300w" sizes="(max-width: 1005px) 100vw, 1005px" />][2]

2c) Add a new App ID that's appropriate for your app:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/add-app-id.png" alt="Add app id" width="1021" height="495" class="alignnone size-full wp-image-12327" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/add-app-id.png 1021w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/add-app-id-300x145.png 300w" sizes="(max-width: 1021px) 100vw, 1021px" />][3]

##### 3 – Log into iTunes Connect.

##### 4 – Click "My Apps&#8221; from the main iTunes Connect dashboard page.

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/itunes-connect-my-apps-1024x495.png" alt="iTunes Connect - My Apps" width="1024" height="495" class="alignnone size-large wp-image-12331" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/itunes-connect-my-apps-1024x495.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/itunes-connect-my-apps-300x145.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/itunes-connect-my-apps.png 1040w" sizes="(max-width: 1024px) 100vw, 1024px" />][4]

##### 5 – Click the + button to add your app into iTunes Connect.

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/add-app.png" alt="Add App" width="454" height="252" class="alignnone size-full wp-image-12332" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/add-app.png 454w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/add-app-300x167.png 300w" sizes="(max-width: 454px) 100vw, 454px" />][5]

<a name="sandbox-tester-setup" class="jump-target"></a>

### Sandbox Tester Setup

#### 1 – Create a new e-mail address that's not associated with an Apple ID already

Your sandbox user account is actually going to be a separate Apple ID. Since it's probably going to be _you_ that's testing the purchasing and receipt features of your app, you will need to create a new e-mail address to associate with a new Apple ID, since Apple does not allow you to use an e-mail address already associated with an existing Apple ID.

##### 2 – Log in to iTunes Connect if you're not still logged in from the previous steps

##### 3 – Click on Users and Roles

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/users-and-roles-1024x445.png" alt="iTunes Connect - Users and Roles" width="1024" height="445" class="alignnone size-large wp-image-12335" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/users-and-roles-1024x445.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/users-and-roles-300x130.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/users-and-roles.png 1165w" sizes="(max-width: 1024px) 100vw, 1024px" />][6]

##### 4 – Click Sandbox Testers

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/sandbox-testers1.png" alt="Sandbox Testers" width="762" height="177" class="alignnone size-full wp-image-12337" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/10/sandbox-testers1.png 762w, https://www.andrewcbancroft.com/wp-content/uploads/2015/10/sandbox-testers1-300x70.png 300w" sizes="(max-width: 762px) 100vw, 762px" />][7]

##### 5 – Click the Add (+) button

##### 6 – Fill out all of the information on this page, and use the new e-mail address you created as the Email field value.

##### 7 – Save the new sandbox user.

##### 8 – You will receive an e-mail from Apple asking you to verify your new Apple ID. Verify it.

<a name="ios-device-setup" class="jump-target"></a>

### iOS Device Setup

##### 1 – On your physical device (not in the Simulator), open Settings and navigate to "App and iTunes Stores&#8221;.

##### 2 – Sign out of your regular Apple ID, but _do not_ re-sign in using your new Sandbox Tester Apple ID that you just set up. Doing this will pose the risk of invalidating your Sandbox User test account. This is explained over in the [Apple Developer documentation][8]:

> Important: If you mistakenly use a sandbox tester account to log in to a production environment on your test device instead of your test environment, the sandbox account becomes invalid and can’t be used again. If this happens, create a new sandbox tester account with a new email address. 

Later on, when you run your app on your device from Xcode, you'll get a prompt to sign in to the _fake_ App Store. You'll enter the credentials you created for the Sandbox User test account into the prompt.

**Note:** Ideally, this step is done on an iOS _test_ device, not on your own personal device. That being said, there are times (like in my own situation) where you might not have a test device and you're forced to switch between Apple IDs to test.

##### 3 – Go through the necessary steps to set up a new iTunes Store account. You'll receive a "Welcome&#8221; e-mail from the iTunes Store once everything is completely set up.

### Write Some Receipt Verification Code

As a quick example, consider the following class that will act as a `ReceiptFetcher`. To test things out, you can simply create an instance of this class in your primary view controller, and call `fetchReceipt` in the `viewDidLoad()` method.

You'll be looking to make sure you're prompted for iTunes Store credentials, and that you successfully receive a receipt (ie, `request(_:didFailWithError:)` did not get called, but instead `requestDidFinish(_:)` got called):

**Receipt Fetcher**
{{< highlight swift "linenos=table" >}}
import Foundation
import StoreKit

class ReceiptFetcher : NSObject, SKRequestDelegate {
    
    let receiptRefreshRequest = SKReceiptRefreshRequest()
    
    override init() {
        super.init()
        receiptRefreshRequest.delegate = self
    }
    
    func fetchReceipt() {
        let receiptUrl = Bundle.main.appStoreReceiptURL
        
        do {
            if let receiptFound = try receiptUrl?.checkResourceIsReachable() {
                if (receiptFound == false) {
                    receiptRefreshRequest.start()
                }
            }
        } catch {
            print("Could not check for receipt presence for some reason... \(error.localizedDescription)")
        }
    }
    
    func requestDidFinish(_ request: SKRequest) {
        print("The request finished successfully")
    }
    
    func request(_ request: SKRequest, didFailWithError error: Error) {
        print("Something went wrong: \(error.localizedDescription)")
    }
}
{{< / highlight  >}}

**View Controller**
{{< highlight swift "linenos=table" >}}
public class ViewController: UIViewController {

    // Note that an instance of ReceiptFetcher is kept at the class-level
    let receiptFetcher = ReceiptFetcher()
    
    override public func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

        receiptFetcher.fetchReceipt()
    }
}
{{< / highlight  >}}

**Note:** Once again, note that the instance of `ReceiptFetcher` is held at the view controller's class-level scope. This is necessary to allow the delegate callback functions to be invoked. If you initialize the `ReceiptFetcher` in `viewDidLoad` without holding a reference at the class level, the instance will be deallocated prior to the delegate callback functions being invoked.

<a name="build-run-on-device" class="jump-target"></a>

### Debug App on Device

##### 1 – Run your app from Xcode on the device you've just set up.

##### 2 – Executing code, such as a request to refresh a receipt should prompt you for your newly created Sandbox Tester credentials.

##### 3 – Enter the password for that Apple ID – you should receive a receipt!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  <ul class="resources-content">
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
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/27/receipt-validation-parsing-a-receipt-with-swift/" title="Receipt Validation – Parse and Decode a Receipt with Swift">Receipt Validation – Parse and Decode a Receipt with Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/31/finalizing-receipt-validation-in-swift-computing-a-guid-hash/" title="Finalizing Receipt Validation in Swift – Computing a GUID Hash">Finalizing Receipt Validation in Swift – Computing a GUID Hash</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/wp-content/uploads/2015/10/manage-bundle-identifier.png
 [2]: https://www.andrewcbancroft.com/wp-content/uploads/2015/10/identifiers.png
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2015/10/add-app-id.png
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2015/10/itunes-connect-my-apps.png
 [5]: https://www.andrewcbancroft.com/wp-content/uploads/2015/10/add-app.png
 [6]: https://www.andrewcbancroft.com/wp-content/uploads/2015/10/users-and-roles.png
 [7]: https://www.andrewcbancroft.com/wp-content/uploads/2015/10/sandbox-testers1.png
 [8]: https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/SettingUpUserAccounts.html#//apple_ref/doc/uid/TP40011225-CH25-SW9