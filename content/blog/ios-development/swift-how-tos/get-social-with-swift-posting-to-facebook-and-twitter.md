---
title: Get Social With Swift – Posting to Facebook and Twitter
author: Andrew
type: blog
date: 2015-11-23T19:17:38+00:00
aliases:
  - /2015/11/23/get-social-with-swift-posting-to-facebook-and-twitter/
dsq_thread_id:
  - "4344730341"
categories:
  - Swift
tags:
  - Facebook
  - Social Media
  - Swift
  - Twitter

---
Building social media features into our apps has never been easier! In this guide, I will walk you through how to get started with accessing the Social framework for iOS so that you can take advantage of Apple's built-in support for two major social media platforms: Facebook, and Twitter.

For your convenience, I've created a simple GitHub repository with an example Xcode project to help you see all of this code in action:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/SocialSwift" title="SocialSwift">SocialSwift Example Project</a>
    </li>
  </ul>
</div>

**Note**: To try things out in this guide you need to run your app on a physical device, because the Social media features we're looking at below are not available in the iOS Simulator.


<a name="import" class="jump-target"></a>

### Importing the Social module

The first step is to import the Social module into your .swift file. It's a simple declaration at the top of your file:

```swift
// ...

import UIKit
import Social

// ...
```

<a name="check-availability" class="jump-target"></a>

### Checking service availability

Next up is to make sure that the user has Facebook, Twitter, or both set up on their device.

In the [example that's included with this guide][1], I will respond to a user's tapping on a button in the UI to trigger the presentation of an `SLComposeViewController` instance (which we'll configure shortly).

Within the body of the IBAction associated with the button, I will check whether or not the Facebook service is available:

```swift
@IBAction func postToFacebookTapped(sender: UIButton) {
    if(SLComposeViewController.isAvailableForServiceType(SLServiceTypeFacebook)) {
        //...
    }
}
```

<a name="service-types" class="jump-target"></a>

#### Service types

Currently there are 4 service types that represented by String constants in Swift. Passing one of the following into `SLComposeViewController.isAvailableForServiceType(_:)` will check for that service's availability on the user's device:

  * SLServiceTypeFacebook
  * SLServiceTypeTwitter
  * SLServiceTypeSinaWeibo
  * SLServiceTypeTencentWeibo

For the purposes of this guide, we'll look at the first two, which map to Facebook and Twitter, respectively.

**Note**: Social media features in the Social module are not available for use/testing on the iOS Simulator, so you need to use a physical device to try things out.

<a name="create-controller" class="jump-target"></a>

### Creating an SLComposeViewController

The Social framework comes with a Type that allows us to present some Apple-built UI to post to any of the four service types. To get at this out-of-the-box user interface, we look to `SLComposeViewController's` initializer that takes an argument for the type of service we'd like to create a post for:

```swift
@IBAction func postToFacebookTapped(sender: UIButton) {
    if(SLComposeViewController.isAvailableForServiceType(SLServiceTypeFacebook)) {
        let socialController = SLComposeViewController(forServiceType: SLServiceTypeFacebook)

        // ...
    }
}
```

In this code snippet, we're creating an `SLComposeViewController` instance to post to Facebook, since I've specified the `SLServiceTypeFacebook` type to the initializer.

<a name="configure" class="jump-target"></a>

### (optional) Configure the SLComposeViewController

Optionally, you can choose to pre-populate the &#8220;create post&#8221; UI with some initial text, an image, or a URL. Here's a sample of what that might look like:

```swift
@IBAction func postToFacebookTapped(sender: UIButton) {
    if(SLComposeViewController.isAvailableForServiceType(SLServiceTypeFacebook)) {
        let socialController = SLComposeViewController(forServiceType: SLServiceTypeFacebook)
//            socialController.setInitialText("Hello World!")
//            socialController.addImage(someUIImageInstance)
//            socialController.addURL(someNSURLInstance)
        
        // ...
    }
}
```

<a name="present-controller" class="jump-target"></a>

### Present the SLComposeViewController

The last step is to present the controller!

```swift
@IBAction func postToFacebookTapped(sender: UIButton) {
    if(SLComposeViewController.isAvailableForServiceType(SLServiceTypeFacebook)) {
        let socialController = SLComposeViewController(forServiceType: SLServiceTypeFacebook)
//            socialController.setInitialText("Hello World!")
//            socialController.addImage(someUIImageInstance)
//            socialController.addURL(someNSURLInstance)
        
        self.presentViewController(socialController, animated: true, completion: nil)
    }
}
```

If you need to perform an action when the user has finished their post (or cancelled the action), the completion closure is your opportunity to hook into that event and execute the code you need.

### Wrapping up

As you can see, integrating social media sharing capability into your app has never been easier. Now, in this guide, I didn't explicitly go over how to create posts for Twitter, but it's as simple as switching `SLServiceTypeFacebook` to `SLServiceTypeTwitter`. The example I've provided with this guide does include code for Twitter, so feel free to [download the full project over at GitHub][1]!

<a name="share" class="jump-target"></a>

 [1]: https://github.com/andrewcbancroft/SocialSwift