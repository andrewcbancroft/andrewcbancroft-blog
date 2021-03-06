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
dispiosgettingstartedbadge: true

---
In a [previous walkthrough on sending e-mails in-app][1], I explored how to use `MFMailComposeViewController` to allow a user to compose an e-mail without ever leaving your app. I then [followed up with a proposal for better-segregating the responsibilities][2] of composing an e-mail and responding to the delegate callbacks out of the View Controller.

I say all this because today, I'd like to walk you through sending a _text message_ in-app using the same pattern as the _second_ article. This walkthrough should be fairly straight-forward on its own, but if you'd like to reference [my previous post on clean view controllers][2], it could be helpful in understanding why I'm not just shoving everything into the View Controller and calling it good.

### The Gist

Here's the gist of the components we'll need in order to accomplish the task of using `MFMessageComposeViewController` to send text messages in-app. Presumably, you'd like to allow your users to send a text message to a pre-defined recipient, or maybe you want to pre-populate a message and allow your users to text it to whomever they desire. Any and all of this can be accomplished by implementing this general outline:

  * Create a class (I'll call it `MessageComposer`) that will handle the responsibility of creating/configuring a text message composer.
  * `MessageComposer` will also handle the `MFMessageComposeViewControllerDelegate` callback method (  
    `messageComposeViewController:didFinishWithResult:`).
  * Finally, I'll program a View Controller to create an instance of this `MessageComposer` class and present it based upon some user action, such as tapping a button.
  * Note that to see the example in action, you'll have to run it on an actual device, because the Simulator is unable to send text messages&#8230;

For those who just like to dive in and explore, feel free to [head over to GitHub][3] and grab the example project now!

### The Details

With the general idea in mind, let's jump in to discover how to implement the solution&#8230;

#### MessageComposer

While it's _possible_ to simply put all of this code inside the View Controller, [I'd recommend doing your best to avoid it][2]. While this simple example doesn't add a ton of complexity if you just write it all into your View Controller, a real-world app will undoubtedly be more complex.

In my experience, it's best to try and segregate out as many responsibilities of functionality from the View Controller where it's possible. Thankfully, simple examples like this highlight the ease of segregating these responsibilities so that you can begin to employ the pattern for _other_ components that you use within your app.

So in keeping with this idea of nurturing a clean View Controller, I've decided to create a new custom class called `MessageComposer`. Take a look:

```swift
import Foundation
import MessageUI

let textMessageRecipients = ["1-800-867-5309"] // for pre-populating the recipients list (optional, depending on your needs)

class MessageComposer: NSObject, MFMessageComposeViewControllerDelegate {
    
    // A wrapper function to indicate whether or not a text message can be sent from the user's device
    func canSendText() -> Bool {
        return MFMessageComposeViewController.canSendText()
    }
    
    // Configures and returns a MFMessageComposeViewController instance
    func configuredMessageComposeViewController() -> MFMessageComposeViewController {
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
}
```

Taking a close look through the comments, you'll notice the following:

  * You need to import the `MessageUI` module.
  * Rather than hard-code the recipients list, I've declared a constant at a global scope for easy access/changeability in the future. It's actually optional to even supply a recipients list to your composer&#8230; it's just dependent on how you want to use it. Notice that it's an **array of Strings**.
  * `MessageComposer` inherits from `NSObject`. This is a requirement of the `MFMessageComposeViewControllerDelegate` protocol, which `MessageComposer` conforms to.
  * There's a function in there called `canSendText` that becomes important later on for testing whether or not sending a text message is even _possible_ at the moment on the user's device. It wraps `MFMessageComposeViewController`&#8216;s `canSendText` method to avoid needing to import the `MessageUI` module in other places (like the View Controller that uses instances of this class).
  * `configuredMessageComposeViewController` does what it says it does – it returns an instance of a `MFMessageComposeViewController` that's been configured with a list of recipients and a body.
  * `messageComposeViewController:didFinishWithResult:` is what gets called with the user either sends the text, or cancels sending a text from the message composer. I've written code in that method's body to simply dismiss the instance of the view controller that called the method.

We're now ready to head to the View Controller and wire up the components allowing a user to display a `MessageComposer`!

### View Controller

The View Controller is very simple for this example:

```swift
import UIKit

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
}
```

  * You'll notice that I create an instance of `MessageComposer` (the custom class we just defined in previous steps). It's declared at a scope that can be seen throughout the lifetime of the View Controller (so that the delegate callback can be invoked when appropriate).
  * `sendTextMessageButtonTapped` is wired up to a button on my storyboard, and will be executed when the user taps the button.
  * Checking to make sure the device can send a text message is critical – Note that running the example in the Simulator will execute the _else_ block, because the Simulator cannot send text messages.
  * If the device _can_ send texts, a configured `MFMessageComposeViewController` is obtained from the `MessageComposer` instance. It's then displayed.
  * If the device _can't_ send texts, it's probably a good idea to alert the user somehow&#8230; I've chosen a simple `UIAlertView`.

### Summary

In this walkthrough, I've demonstrated the mechanics of configuring, displaying, and dismissing a `MFMessageComposeViewController`, which enables your users to send a text message in-app. Additionally, I've attempted to show how to keep the View Controller from handling more than it really should, by segregating out the `MFMessageComposeViewController` configuration and delegate protocol conformance to another class.

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