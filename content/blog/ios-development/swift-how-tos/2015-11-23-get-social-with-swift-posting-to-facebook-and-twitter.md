---
title: Get Social With Swift – Posting to Facebook and Twitter
author: Andrew
type: blog
date: 2015-11-23T19:17:38+00:00
url: /2015/11/23/get-social-with-swift-posting-to-facebook-and-twitter/
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
Building social media features into our apps has never been easier! In this guide, I will walk you through how to get started with accessing the Social framework for iOS so that you can take advantage of Apple&#8217;s built-in support for two major social media platforms: Facebook, and Twitter.

For your convenience, I&#8217;ve created a simple GitHub repository with an example Xcode project to help you see all of this code in action:

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

**Note**: To try things out in this guide you need to run your app on a physical device, because the Social media features we&#8217;re looking at below are not available in the iOS Simulator.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#import">Importing the Social module</a>
    </li>
    <li>
      <a href="#check-availability">Checking service availability</a>
    </li>
    <ul>
      <li>
        <a href="#service-types">Service types</a>
      </li>
    </ul>
    
    <li>
      <a href="#create-controller">Creating an SLComposeViewController</a>
    </li>
    <li>
      <a href="#configure">(optional) Configure the SLComposeViewController</a>
    </li>
    <li>
      <a href="#present-controller">Present the SLComposeViewController</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="import" class="jump-target"></a>

### Importing the Social module

The first step is to import the Social module into your .swift file. It&#8217;s a simple declaration at the top of your file:

<pre class="lang:default mark:4 decode:true " title="Import Social" >// ...

import UIKit
import Social

// ...</pre>

<a name="check-availability" class="jump-target"></a>

### Checking service availability

Next up is to make sure that the user has Facebook, Twitter, or both set up on their device.

In the [example that&#8217;s included with this guide][1], I will respond to a user&#8217;s tapping on a button in the UI to trigger the presentation of an `SLComposeViewController` instance (which we&#8217;ll configure shortly).

Within the body of the IBAction associated with the button, I will check whether or not the Facebook service is available:

<pre class="lang:swift decode:true mark:2 " title="Check availability" >@IBAction func postToFacebookTapped(sender: UIButton) {
    if(SLComposeViewController.isAvailableForServiceType(SLServiceTypeFacebook)) {
        //...
    }
}</pre>

<a name="service-types" class="jump-target"></a>

#### Service types

Currently there are 4 service types that represented by String constants in Swift. Passing one of the following into `SLComposeViewController.isAvailableForServiceType(_:)` will check for that service&#8217;s availability on the user&#8217;s device:

  * SLServiceTypeFacebook
  * SLServiceTypeTwitter
  * SLServiceTypeSinaWeibo
  * SLServiceTypeTencentWeibo

For the purposes of this guide, we&#8217;ll look at the first two, which map to Facebook and Twitter, respectively.

**Note**: Social media features in the Social module are not available for use/testing on the iOS Simulator, so you need to use a physical device to try things out.

<a name="create-controller" class="jump-target"></a>

### Creating an SLComposeViewController

The Social framework comes with a Type that allows us to present some Apple-built UI to post to any of the four service types. To get at this out-of-the-box user interface, we look to `SLComposeViewController's` initializer that takes an argument for the type of service we&#8217;d like to create a post for:

<pre class="lang:swift decode:true mark:3 " title="Create SLComposeViewController" >@IBAction func postToFacebookTapped(sender: UIButton) {
    if(SLComposeViewController.isAvailableForServiceType(SLServiceTypeFacebook)) {
        let socialController = SLComposeViewController(forServiceType: SLServiceTypeFacebook)

        // ...
    }
}</pre>

In this code snippet, we&#8217;re creating an `SLComposeViewController` instance to post to Facebook, since I&#8217;ve specified the `SLServiceTypeFacebook` type to the initializer.

<a name="configure" class="jump-target"></a>

### (optional) Configure the SLComposeViewController

Optionally, you can choose to pre-populate the &#8220;create post&#8221; UI with some initial text, an image, or a URL. Here&#8217;s a sample of what that might look like:

<pre class="lang:swift decode:true mark:4-6 " title="Configure SLComposeViewController" >@IBAction func postToFacebookTapped(sender: UIButton) {
    if(SLComposeViewController.isAvailableForServiceType(SLServiceTypeFacebook)) {
        let socialController = SLComposeViewController(forServiceType: SLServiceTypeFacebook)
//            socialController.setInitialText("Hello World!")
//            socialController.addImage(someUIImageInstance)
//            socialController.addURL(someNSURLInstance)
        
        // ...
    }
}</pre>

<a name="present-controller" class="jump-target"></a>

### Present the SLComposeViewController

The last step is to present the controller!

<pre class="lang:swift decode:true mark:8" title="Present the SLComposeViewController" >@IBAction func postToFacebookTapped(sender: UIButton) {
    if(SLComposeViewController.isAvailableForServiceType(SLServiceTypeFacebook)) {
        let socialController = SLComposeViewController(forServiceType: SLServiceTypeFacebook)
//            socialController.setInitialText("Hello World!")
//            socialController.addImage(someUIImageInstance)
//            socialController.addURL(someNSURLInstance)
        
        self.presentViewController(socialController, animated: true, completion: nil)
    }
}</pre>

If you need to perform an action when the user has finished their post (or cancelled the action), the completion closure is your opportunity to hook into that event and execute the code you need.

### Wrapping up

As you can see, integrating social media sharing capability into your app has never been easier. Now, in this guide, I didn&#8217;t explicitly go over how to create posts for Twitter, but it&#8217;s as simple as switching `SLServiceTypeFacebook` to `SLServiceTypeTwitter`. The example I&#8217;ve provided with this guide does include code for Twitter, so feel free to [download the full project over at GitHub][1]!

<a name="share" class="jump-target"></a>

 [1]: https://github.com/andrewcbancroft/SocialSwift