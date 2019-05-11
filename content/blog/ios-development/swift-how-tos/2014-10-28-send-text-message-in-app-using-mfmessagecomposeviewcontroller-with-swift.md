---
title: Send Text Message In-App – Using MFMessageComposeViewController with Swift
author: Andrew
type: blog
date: 2014-10-28T11:00:37+00:00
url: /2014/10/28/send-text-message-in-app-using-mfmessagecomposeviewcontroller-with-swift/
dsq_thread_id:
  - "3163852894"
categories:
  - iOS / Mac
  - Swift
tags:
  - Swift

---
In a [previous walkthrough on sending e-mails in-app][1], I explored how to use <span class="lang:swift decode:true  crayon-inline " >MFMailComposeViewController</span> to allow a user to compose an e-mail without ever leaving your app. I then [followed up with a proposal for better-segregating the responsibilities][2] of composing an e-mail and responding to the delegate callbacks out of the View Controller.

I say all this because today, I&#8217;d like to walk you through sending a _text message_ in-app using the same pattern as the _second_ article. This walkthrough should be fairly straight-forward on its own, but if you&#8217;d like to reference [my previous post on clean view controllers][2], it could be helpful in understanding why I&#8217;m not just shoving everything into the View Controller and calling it good.

### The Gist

Here&#8217;s the gist of the components we&#8217;ll need in order to accomplish the task of using <span class="lang:swift decode:true  crayon-inline " >MFMessageComposeViewController</span> to send text messages in-app. Presumably, you&#8217;d like to allow your users to send a text message to a pre-defined recipient, or maybe you want to pre-populate a message and allow your users to text it to whomever they desire. Any and all of this can be accomplished by implementing this general outline:

  * Create a class (I&#8217;ll call it <span class="lang:swift decode:true  crayon-inline " >MessageComposer</span>) that will handle the responsibility of creating/configuring a text message composer.
  * <span class="lang:swift decode:true  crayon-inline " >MessageComposer</span> will also handle the <span class="lang:swift decode:true  crayon-inline " >MFMessageComposeViewControllerDelegate</span> callback method (  
    <span class="lang:swift decode:true  crayon-inline " >messageComposeViewController:didFinishWithResult:</span>).
  * Finally, I&#8217;ll program a View Controller to create an instance of this <span class="lang:swift decode:true  crayon-inline " >MessageComposer</span> class and present it based upon some user action, such as tapping a button.
  * Note that to see the example in action, you&#8217;ll have to run it on an actual device, because the Simulator is unable to send text messages&#8230;

For those who just like to dive in and explore, feel free to [head over to GitHub][3] and grab the example project now!

### The Details

With the general idea in mind, let&#8217;s jump in to discover how to implement the solution&#8230;

#### MessageComposer

While it&#8217;s _possible_ to simply put all of this code inside the View Controller, [I&#8217;d recommend doing your best to avoid it][2]. While this simple example doesn&#8217;t add a ton of complexity if you just write it all into your View Controller, a real-world app will undoubtedly be more complex.

In my experience, it&#8217;s best to try and segregate out as many responsibilities of functionality from the View Controller where it&#8217;s possible. Thankfully, simple examples like this highlight the ease of segregating these responsibilities so that you can begin to employ the pattern for _other_ components that you use within your app.

So in keeping with this idea of nurturing a clean View Controller, I&#8217;ve decided to create a new custom class called <span class="lang:swift decode:true  crayon-inline " >MessageComposer</span>. Take a look:

<pre class="lang:swift mark:2,4,16-18 decode:true " title="MessageComposer.swift">import Foundation
import MessageUI

let textMessageRecipients = ["1-800-867-5309"] // for pre-populating the recipients list (optional, depending on your needs)

class MessageComposer: NSObject, MFMessageComposeViewControllerDelegate {
    
    // A wrapper function to indicate whether or not a text message can be sent from the user's device
    func canSendText() -&gt; Bool {
        return MFMessageComposeViewController.canSendText()
    }
    
    // Configures and returns a MFMessageComposeViewController instance
    func configuredMessageComposeViewController() -&gt; MFMessageComposeViewController {
        let messageComposeVC = MFMessageComposeViewController()
        messageComposeVC.messageComposeDelegate = self  //  Make sure to set this property to self, so that the controller can be dismissed!
        messageComposeVC.recipients = textMessageRecipients
        messageComposeVC.body = "Hey friend - Just sending a text message in-app using Swift!"
        return messageComposeVC
    }
    
    // MFMessageComposeViewControllerDelegate callback - dismisses the view controller when the user is finished with it
    func messageComposeViewController(controller: MFMessageComposeViewController!, didFinishWithResult result: MessageComposeResult) {
        controller.dismissViewControllerAnimated(true, completion: nil)
    }
}</pre>

Taking a close look through the comments, you&#8217;ll notice the following:

  * You need to import the <span class="lang:swift decode:true  crayon-inline " >MessageUI</span> module.
  * Rather than hard-code the recipients list, I&#8217;ve declared a constant at a global scope for easy access/changeability in the future. It&#8217;s actually optional to even supply a recipients list to your composer&#8230; it&#8217;s just dependent on how you want to use it. Notice that it&#8217;s an **array of Strings**.
  * <span class="lang:swift decode:true  crayon-inline " >MessageComposer</span> inherits from <span class="lang:swift decode:true  crayon-inline " >NSObject</span>. This is a requirement of the <span class="lang:swift decode:true  crayon-inline " >MFMessageComposeViewControllerDelegate</span> protocol, which <span class="lang:swift decode:true  crayon-inline " >MessageComposer</span> conforms to.
  * There&#8217;s a function in there called <span class="lang:swift decode:true  crayon-inline " >canSendText</span> that becomes important later on for testing whether or not sending a text message is even _possible_ at the moment on the user&#8217;s device. It wraps <span class="lang:swift decode:true  crayon-inline " >MFMessageComposeViewController</span>&#8216;s <span class="lang:swift decode:true  crayon-inline " >canSendText</span> method to avoid needing to import the <span class="lang:swift decode:true  crayon-inline " >MessageUI</span> module in other places (like the View Controller that uses instances of this class).
  * <span class="lang:swift decode:true  crayon-inline " >configuredMessageComposeViewController</span> does what it says it does &#8211; it returns an instance of a <span class="lang:swift decode:true  crayon-inline " >MFMessageComposeViewController</span> that&#8217;s been configured with a list of recipients and a body.
  * <span class="lang:swift decode:true  crayon-inline " >messageComposeViewController:didFinishWithResult:</span> is what gets called with the user either sends the text, or cancels sending a text from the message composer. I&#8217;ve written code in that method&#8217;s body to simply dismiss the instance of the view controller that called the method.

We&#8217;re now ready to head to the View Controller and wire up the components allowing a user to display a <span class="lang:swift decode:true  crayon-inline " >MessageComposer</span>!

### View Controller

The View Controller is very simple for this example:

<pre class="lang:swift decode:true " title="ViewController.swift" >import UIKit

class ViewController: UIViewController {
    // Create a MessageComposer
    let messageComposer = MessageComposer()
    
    @IBAction func sendTextMessageButtonTapped(sender: UIButton) {
        // Make sure the device can send text messages
        if (messageComposer.canSendText()) {
            // Obtain a configured MFMessageComposeViewController
            let messageComposeVC = messageComposer.configuredMessageComposeViewController()
            
            // Present the configured MFMessageComposeViewController instance
            // Note that the dismissal of the VC will be handled by the messageComposer instance,
            // since it implements the appropriate delegate call-back
            presentViewController(messageComposeVC, animated: true, completion: nil)
        } else {
            // Let the user know if his/her device isn't able to send text messages
            let errorAlert = UIAlertView(title: "Cannot Send Text Message", message: "Your device is not able to send text messages.", delegate: self, cancelButtonTitle: "OK")
            errorAlert.show()
        }
    }
}</pre>

  * You&#8217;ll notice that I create an instance of <span class="lang:swift decode:true  crayon-inline " >MessageComposer</span> (the custom class we just defined in previous steps). It&#8217;s declared at a scope that can be seen throughout the lifetime of the View Controller (so that the delegate callback can be invoked when appropriate).
  * <span class="lang:swift decode:true  crayon-inline " >sendTextMessageButtonTapped</span> is wired up to a button on my storyboard, and will be executed when the user taps the button.
  * Checking to make sure the device can send a text message is critical &#8211; Note that running the example in the Simulator will execute the _else_ block, because the Simulator cannot send text messages.
  * If the device _can_ send texts, a configured <span class="lang:swift decode:true  crayon-inline " >MFMessageComposeViewController</span> is obtained from the <span class="lang:swift decode:true  crayon-inline " >MessageComposer</span> instance. It&#8217;s then displayed.
  * If the device _can&#8217;t_ send texts, it&#8217;s probably a good idea to alert the user somehow&#8230; I&#8217;ve chosen a simple <span class="lang:swift decode:true  crayon-inline " >UIAlertView</span>.

### Summary

In this walkthrough, I&#8217;ve demonstrated the mechanics of configuring, displaying, and dismissing a <span class="lang:swift decode:true  crayon-inline " >MFMessageComposeViewController</span>, which enables your users to send a text message in-app. Additionally, I&#8217;ve attempted to show how to keep the View Controller from handling more than it really should, by segregating out the <span class="lang:swift decode:true  crayon-inline " >MFMessageComposeViewController</span> configuration and delegate protocol conformance to another class.

Happy texting!

<div class="related-posts">
  You might also enjoy</p> 
  
  <ul>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/08/25/send-email-in-app-using-mfmailcomposeviewcontroller-with-swift/" title="Send Email In-App – Using MFMailComposeViewController with Swift">Send Email In-App – Using MFMailComposeViewController with Swift</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/08/26/pick-a-delegate-clean-view-controllers-in-swift/" title="Pick a Delegate… Any Delegate… On Clean View Controllers in Swift">Pick a Delegate… Any Delegate… On Clean View Controllers in Swift</a>
    </li>
  </ul>
</div>

 [1]: http://www.andrewcbancroft.com/2014/08/25/send-email-in-app-using-mfmailcomposeviewcontroller-with-swift/
 [2]: http://www.andrewcbancroft.com/2014/08/26/pick-a-delegate-clean-view-controllers-in-swift/
 [3]: https://github.com/andrewcbancroft/SwiftMFMessageComposeViewController