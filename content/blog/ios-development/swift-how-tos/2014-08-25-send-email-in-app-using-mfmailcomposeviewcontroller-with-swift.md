---
title: Send Email In-App – Using MFMailComposeViewController with Swift
author: Andrew
type: blog
date: 2014-08-26T03:48:30+00:00
aliases:
  - /2014/08/25/send-email-in-app-using-mfmailcomposeviewcontroller-with-swift/
dsq_thread_id:
  - "2959440040"
categories:
  - iOS / Mac
  - Swift
tags:
  - In-App Email
  - Swift

---
<small>Updated on October 11, 2016 &#8211; Swift 3.0</small>

In this writing, I want explore how to use `MFMailComposeViewController` with Swift to send e-mails within your app as a walkthrough. My focus here is &#8220;quick and dirty&#8221; pragmatism, so that we can easily see what the inter-working components of `MFMailComposeViewController` are. That being said, here&#8217;s an important _disclaimer_ &#8211; I&#8217;m going to overload the View Controller&#8217;s responsibilities in the examples to follow.

<a title="Pick a Delegate… Any Delegate… On Clean View Controllers in Swift" href="http://www.andrewcbancroft.com/2014/08/26/pick-a-delegate-clean-view-controllers-in-swift/" target="_blank">An op-ed with my thoughts and experimentation on how to keep the View Controller clean</a> by factoring out some of the configuration and delegate methods to another class is now live as well.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#define-requirements">Defining the requirements</a>
    </li>
    <li>
      <a href="#implementation-overview">Implementation overview</a>
    </li>
    <li>
      <a href="#step-by-step-implementation">Step-by-step implementation</a>
    </li>
    <ul>
      <li>
        <a href="#vc-setup">Setting up the View Controller</a>
      </li>
      <li>
        <a href="#send-button-tapped">sendEmailButtonTapped()</a>
      </li>
      <li>
        <a href="#configured-controller">configuredMailComposeViewController()</a>
      </li>
      <li>
        <a href="#show-send-mail-error">showSendMailErrorAlert()</a>
      </li>
      <li>
        <a href="#delegate-method">MFMailComposeViewController&#8217;s delegate method</a>
      </li>
    </ul>
    
    <li>
    </li>
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="define-requirements" class="jump-target"></a>

## Defining the requirements

As part of your app requirements, you need to be able to send an e-mail _within_ your app without leaving it. Additionally, you need to pre-populate some standard e-mail fields such as &#8220;To&#8221;, &#8220;Subject&#8221;, and &#8220;Body&#8221;.

Not only is this possible, the API for accomplishing it is pretty straight forward.

<a name="implementation-overview" class="jump-target"></a>

## Implementation overview

In order to implement the solution for this requirement, you need a few things:

  1. A View Controller from which your user will initiate the display of the email composer screen, presumably by tapping on a button or something else that&#8217;s wired up to an \`@IBAction\`.
  2. A configured \`MFMailComposeViewController\` to present.
  3. An \`MFMailCompseViewControllerDelegate\` to handle dismissing the email composer screen.

Note that you may have trouble in the iOS 8 Simulator, with symptoms of the composer presenting itself and immediately dismissing. Running the app on an actual device running iOS 8 should work fine, as the problem seems to be isolated to the simulator, only.

<a name="//acbref-MFMailComposeViewControllerExample"></a>An example View Controller class that implements the three steps above is proposed here. All that would be left for you to do is to design a user interface and wire up the `@IBAction`. Lines of code that are of special importance, such as module imports, protocol conformance and assignment, checking for the ability to send e-mail, and the protocol method implementation are highlighted. Take a look:

<pre class="lang:swift mark:3,5,13,22,37-39 decode:true">import Foundation
import UIKit
import MessageUI

class ViewController: UIViewController, MFMailComposeViewControllerDelegate {
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    @IBAction func sendEmailButtonTapped(sender: AnyObject) {
        let mailComposeViewController = configuredMailComposeViewController()
        if MFMailComposeViewController.canSendMail() {
            self.present(mailComposeViewController, animated: true, completion: nil)
        } else {
            self.showSendMailErrorAlert()
        }
    }
    
    func configuredMailComposeViewController() -> MFMailComposeViewController {
        let mailComposerVC = MFMailComposeViewController()
        mailComposerVC.mailComposeDelegate = self // Extremely important to set the --mailComposeDelegate-- property, NOT the --delegate-- property
        
        mailComposerVC.setToRecipients(["someone@somewhere.com"])
        mailComposerVC.setSubject("Sending you an in-app e-mail...")
        mailComposerVC.setMessageBody("Sending e-mail in-app is not so bad!", isHTML: false)
        
        return mailComposerVC
    }
    
    func showSendMailErrorAlert() {
        let sendMailErrorAlert = UIAlertView(title: "Could Not Send Email", message: "Your device could not send e-mail.  Please check e-mail configuration and try again.", delegate: self, cancelButtonTitle: "OK")
        sendMailErrorAlert.show()
    }
    
    // MARK: MFMailComposeViewControllerDelegate Method
    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        controller.dismiss(animated: true, completion: nil)
    }
}</pre>

<a name="step-by-step-implementation" class="jump-target"></a>

## Step-by-step implementation

With the above example in front of you, let&#8217;s explore what&#8217;s going on here in detail.

<a name="vc-setup" class="jump-target"></a>

### Setting up the View Controller

First of all, we need to import the `MessageUI` module.

Second, we need to specify that the View Controller will conform to the `MFMailComposeViewControllerDelegate` protocol. Later, we&#8217;ll actually implement the method that this protocol outlines, which will allow us to make the email composer screen go away once the user is finished either sending an e-mail or cancels out of sending one.

<a name="send-button-tapped" class="jump-target"></a>

### sendEmailButtonTapped()

This is the method that responds to the user tapping on a button. Assuming this is wired up to an appropriate element in the UI, it kicks off everything related to creating and showing the email composer screen. The logic is as follows:

  * Obtain a configured \`MFMailComposeViewController\` instance
  * Check to make sure the device can send e-mail at this moment 
      * If it can, present the configured \`MFMailComposeViewController\`
      * Otherwise, show an alert with an error message

<a name="configured-controller" class="jump-target"></a>

### configuredMailComposeViewController()

I decided to encapsulate the configuration of an `MFMailComposeViewController` instance inside a function. I found that it made things a little more readable, perhaps more testable, and kept the spirit of [decomposing sub-steps of a process into individual, single-responsibility functions][1].

One vital property to set is the `mailComposeDelegate` property (otherwise, you can never get rid of the e-mail composer screen after it&#8217;s presented). Now, there&#8217;s a &#8220;gotcha&#8221; here &#8211; `MFMailComposeViewController` instances _also_ have a property named `delegate` . **The _delegate_** **property is _not_ the one to set** (I did this at first and wondered why my implemented delegate &#8220;callback&#8221; method never got called). Set the `mailComposeDelegate` property to the instance of whatever you want to handle dismissing the email composer screen once the user is finished sending an e-mail or cancels. In the example, I set it to `self`, since the View Controller itself will implement the appropriate delegate method (<a title="Pick a Delegate… Any Delegate… On Clean View Controllers in Swift" href="http://www.andrewcbancroft.com/2014/08/26/pick-a-delegate-clean-view-controllers-in-swift/" target="_blank">Read my thoughts on cleaning this up a bit</a>).

As you can see, setting up the &#8220;To&#8221;, &#8220;Subject&#8221;, and &#8220;Body&#8221; are simply a matter of setting properties of an `MFMailComposeViewController` instance. Notice that `setToRecipients()` accepts an _array_ of e-mail address strings, so don&#8217;t forget to wrap that argument in an array, even for a single recipient. The same would work for Cc, and Bcc recipients, had I configured those.

<a name="show-send-mail-error" class="jump-target"></a>

### showSendMailErrorAlert()

This method shows a simple UIAlertView if the user&#8217;s device cannot send an e-mail at the moment.

<a name="delegate-method" class="jump-target"></a>

### MFMailComposeViewController&#8217;s delegate method

The implementation of this delegate method simply dismisses the email composer screen.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/08/26/pick-a-delegate-clean-view-controllers-in-swift/" title="Pick a Delegate… Any Delegate… On Clean View Controllers in Swift">Pick a Delegate… Any Delegate… On Clean View Controllers in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/10/28/send-text-message-in-app-using-mfmessagecomposeviewcontroller-with-swift/" title="Send Text Message In-App – Using MFMessageComposeViewController with Swift">Send Text Message In-App – Using MFMessageComposeViewController with Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/2014/08/07/clean-coding-in-swift-functions/ "Clean Coding in Swift – Functions"