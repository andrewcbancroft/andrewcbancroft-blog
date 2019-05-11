---
title: Pick a Delegate… Any Delegate… On Clean View Controllers in Swift
author: Andrew
type: blog
date: 2014-08-27T04:43:29+00:00
aliases:
  - /2014/08/26/pick-a-delegate-clean-view-controllers-in-swift/
dsq_thread_id:
  - "2962653146"
categories:
  - iOS / Mac
  - Op-Ed
  - Swift
tags:
  - Clean Code
  - Delegation
  - Swift
  - View Controllers

---
The delegation pattern is ubiquitous in iOS development – the pattern is&nbsp;a &#8220;<a title="Cocoa Core Competencies" href="https://developer.apple.com/library/ios/documentation/general/conceptual/DevPedia-CocoaCore/Delegation.html" target="_blank">core competency</a>&#8221; for developing in Cocoa, and if you program with the iOS SDK for any length of time and you'll end up writing some code that&nbsp;resembles&nbsp;`someInstance.delegate = someDelegate`.

One of the toughest things that I've experienced is choosing what `someDelegate`&nbsp;is. &nbsp;All too often, a&nbsp;View Controller ends up being assigned the responsibility of&nbsp;being the delegate for _everything_ in its hierarchy. &nbsp;My question is: &nbsp;Is there a cleaner way?

Let's pick up on the example I proposed in my [recent post about sending e-mails in-app][1]. &nbsp;For &#8220;quick and dirty&#8221; pragmatism, I just crammed everything into the View Controller with the promise of coming back and (hopefully) showing a cleaner way. &nbsp;<a title="Send Email In-App – Using MFMailComposeViewController with Swift" href="http://www.andrewcbancroft.com/2014/08/25/send-email-in-app-using-mfmailcomposeviewcontroller-with-swift#//acbref-MFMailComposeViewControllerExample" target="_blank">Here is a quick link to&nbsp;example posed before</a>&nbsp;if you'd like to review it before proceeding.

## _What if&#8230;_

What if we could make some adjustments so that the View Controller was trimmed down to the example on the&nbsp;_right (click for larger view)_:

[<img class="alignnone wp-image-4321 size-large" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/08/Clean-View-Controller-Comparison-1024x258.png" alt="Clean View Controller Comparison" width="730" height="183" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/08/Clean-View-Controller-Comparison-1024x258.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/08/Clean-View-Controller-Comparison-300x75.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/08/Clean-View-Controller-Comparison-1200x303.png 1200w" sizes="(max-width: 730px) 100vw, 730px" />][2]

I've created a <a title="Swift Email Composer - GitHub" href="https://github.com/andrewcbancroft/SwiftEmailComposer" target="_blank">fully-working example on GitHub</a> if you'd like to download it and play.

So the question at hand: &nbsp;Is the class labeled &#8220;Clean Example&#8221;&nbsp;_preferable (_ie_, better)_? &nbsp;First, let's explore how I accomplished the &#8220;clean&#8221; View Controller. &nbsp;Then I'll tip my hand on&nbsp;and share what I like about this approach&#8230;

## EmailComposer

In order to accomplish the self-declared Clean View Controller above, I placed all of the configuration processes and the delegate method for the `MFMailComposeViewController`&nbsp;in a _new_ class called `EmailComposer`. &nbsp;It should look familiar if you recall&nbsp;the <a title="Send Email In-App – Using MFMailComposeViewController with Swift" href="http://www.andrewcbancroft.com/2014/08/25/send-email-in-app-using-mfmailcomposeviewcontroller-with-swift#//acbref-MFMailComposeViewControllerExample" target="_blank">previous example</a>:

```swift
import Foundation
import MessageUI

class EmailComposer: NSObject, MFMailComposeViewControllerDelegate {
    // Did this in order to mitigate needing to import MessageUI in my View Controller
    func canSendMail() -&gt; Bool {
        return MFMailComposeViewController.canSendMail()
    }
    
    func configuredMailComposeViewController() -&gt; MFMailComposeViewController {
        let mailComposerVC = MFMailComposeViewController()
        mailComposerVC.mailComposeDelegate = self
        
        mailComposerVC.setToRecipients(["someone@somewhere.com"])
        mailComposerVC.setSubject("Sending you an in-app e-mail...")
        mailComposerVC.setMessageBody("Sending e-mail in-app is not so bad!", isHTML: false)
        
        return mailComposerVC
    }
    
    // MARK: MFMailComposeViewControllerDelegate Method
    func mailComposeController(controller: MFMailComposeViewController!, didFinishWithResult result: MFMailComposeResult, error: NSError!) {
        controller.dismissViewControllerAnimated(true, completion: nil)
    }
}
```

So literally, the only thing I did is

  * Cut the function definitions for `configuredMailComposeViewController`, and the `MFMailComposeViewControllerDelegate`&nbsp;method.
  * Paste them into the new `EmailComposer`&nbsp;&nbsp;class, which inherits from `NSObject`&nbsp;&nbsp;(a requirement for this particular delegate protocol's conformity), and conforms to the `MFMailComposeViewControllerDelegate`&nbsp;&nbsp;protocol.
  * Adjust my View Controller to create an instance of `EmailComposer`&nbsp;, obtain a configured `MFMailComposeViewController`, and present it&nbsp;whenever the user taps on a button in my UI.

## Conclusions

  * The View Controller in its final version is&nbsp;_focused_. &nbsp;It's primary concern is presentation and handling of user interaction with the View itself, rather than needing to worry with configuring an&nbsp;`MFMailComposeViewController`&nbsp;and its delegate callback.
  * `EmailComposer`&nbsp;is less of a hassle to test, in the sense that&nbsp;<span style="line-height: 1.5;">I no longer need to instantiate a View Controller in my </span>`XCTestCase`<span style="line-height: 1.5;">&nbsp;class just to test my </span>`MFMailComposeViewController`<span style="line-height: 1.5;">&nbsp;stuff</span><span style="line-height: 1.5;">. &nbsp;It's a real pain to test an actual&nbsp;View Controller instance, so I like that I can easily create an instance of `EmailComposer`&nbsp;and test away without the bulk.</span>
  * No need to import MessageUI in my View Controller.

All in all, this is the cleanest, simplest, most balanced solution (that&nbsp;I could think of) to factoring out some logic to another class, so as to&nbsp;make my View Controller as clean as possible.

The goal was to&nbsp;make sure the appropriate responsibilities are assigned to the right classes. &nbsp;Presentation logic is all in the View Controller. &nbsp;Configuration and delegate callback implementation is done in `EmailComposer`.

I'm thinking through applying this same idea to other more complicated examples (UITableViewDataSource and UITableViewDelegate come to mind), and I think it would do us a&nbsp;_lot_ of good to strategize on how to avoid making the View Controller the &#8220;catch-all&#8221; delegate / data source class for everything that's currently on the screen_._

Hopefully these thoughts spark some ideas in the Swift community. &nbsp;This post has already been revised slightly based on feedback that I've received from folks on Twitter. &nbsp;If you have additional ideas in regards to choosing the right delegate, holler my way! &nbsp;I'd love to hear from you.

Thanks for reading.

<div class="related-posts">
  <p>
    You might also enjoy
  </p>
  
  <ul>
    <li>
      <a title="Clean Coding in Swift – Functions" href="http://www.andrewcbancroft.com/2014/08/07/clean-coding-in-swift-functions/">Clean Coding in Swift – Functions</a>
    </li>
    <li>
      <a title="Clean Coding in Swift – Type Inference" href="http://www.andrewcbancroft.com/2014/08/12/clean-coding-in-swift-type-inference/">Clean Coding in Swift – Type Inference</a>
    </li>
    <li>
      <a title="Expanded Thoughts on Swift’s Type Inference" href="http://www.andrewcbancroft.com/2014/08/20/expanded-thoughts-on-swifts-type-inference/">Expanded Thoughts on Swift’s Type Inference</a>
    </li>
    <li>
      <a title="Send Email In-App – Using MFMailComposeViewController with Swift" href="http://www.andrewcbancroft.com/2014/08/25/send-email-in-app-using-mfmailcomposeviewcontroller-with-swift/">Send Email In-App – Using MFMailComposeViewController with Swift</a>
    </li>
    <li>
      <a title="Send Text Message In-App – Using MFMessageComposeViewController with Swift" href="http://www.andrewcbancroft.com/2014/10/28/send-text-message-in-app-using-mfmessagecomposeviewcontroller-with-swift/">Send Text Message In-App – Using MFMessageComposeViewController with Swift</a>
    </li>
  </ul>
</div>

 [1]: http://www.andrewcbancroft.com/2014/08/25/send-email-in-app-using-mfmailcomposeviewcontroller-with-swift/ "Send Email In-App – Using MFMailComposeViewController with Swift"
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2014/08/Clean-View-Controller-Comparison.png