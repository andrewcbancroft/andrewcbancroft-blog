---
title: Rotate Animation in Swift
author: Andrew
type: blog
date: 2014-10-16T02:57:24+00:00
aliases:
  - /2014/10/15/rotate-animation-in-swift/
dsq_thread_id:
  - "3121520029"
categories:
  - Swift
tags:
  - Animation
  - Extension
  - Rotate Animation
  - Swift
  - UIView Extension

---
<small>Updated on December 14, 2015 &#8211; Swift 2.0 + new examples</small>

With this post, I intend to wrap up my series on&nbsp;animations as UIView Extensions in Swift&#8230; for now. &nbsp;Truthfully, these ideas flowed out of a real-world app that I was working on, which required various simple animations (<a title="Fade In / Out Animations as Class Extensions in Swift" href="http://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/" target="_blank">fading in/out</a>, <a title="Slide In Animation in Swift" href="http://www.andrewcbancroft.com/2014/09/24/slide-in-animation-in-swift/" target="_blank">sliding text</a>, and now, rotating a view&nbsp;360 degrees).

Since I&#8217;ve given two other detailed walk-throughs on the topic, I&#8217;ll try to be to-the-point on this one.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#the-extension">The Extension</a>
    </li>
    <li>
      <a href="#example">Example</a>
    </li>
    <li>
      <a href="#rotate-once">Simple Case – Rotate Once</a>
    </li>
    <li>
      <a href="#advanced">“Advanced” Case – Rotate Until Process Finishes</a>
    </li>
    <li>
      <a href="#summary">Summary</a>
    </li>
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

As with the others, I&#8217;ve created a [GitHub project][1] for you to see the animation in action, and even&nbsp;modify to your liking.

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-github fa-lg"></i> <a title="GitHub - SwiftRotateAnimation" href="https://github.com/andrewcbancroft/SwiftRotateAnimation">Rotate Animation Example Project</a>
    </li>
  </ul>
</div>

<a name="the-extension" class="jump-target"></a>

### The Extension

The following code adds a method to any UIView instance called <span class="lang:swift decode:true  crayon-inline">rotate360Degrees</span>. The code can be placed in a Swift file called &#8220;UIViewExtensions.swift&#8221;:

<pre class="lang:swift decode:true " title="UIViewExtensions.swift">import UIKit

extension UIView {
    func rotate360Degrees(duration: CFTimeInterval = 1.0, completionDelegate: AnyObject? = nil) {
        let rotateAnimation = CABasicAnimation(keyPath: "transform.rotation")
        rotateAnimation.fromValue = 0.0
        rotateAnimation.toValue = CGFloat(M_PI * 2.0)
        rotateAnimation.duration = duration
        
        if let delegate: AnyObject = completionDelegate {
            rotateAnimation.delegate = delegate
        }
        self.layer.addAnimation(rotateAnimation, forKey: nil)
    }
}</pre>

The only critical&nbsp;thing to notice in the above code snippet is the value passed to the <span class="lang:swift decode:true  crayon-inline ">CABasicAnimation</span>&nbsp;constructor. &nbsp;The <span class="lang:swift decode:true  crayon-inline">&#8220;transform.rotation&#8221;</span>&nbsp;string is what sets things up to go spinning, and the string&nbsp;_must_ be typed exactly as-is for the animation to work.

As in my previous animation posts, I provide myself a couple of parameters to set for a little bit of customization if I want it.&nbsp;Since the parameters&nbsp;have default values, the method can be invoked by writing <span class="lang:swift decode:true  crayon-inline ">someUIViewInstance.rotate360Degrees()</span>&nbsp;for simple cases. &nbsp;For more &#8220;advanced&#8221; scenarios where you need to adjust how long the animation takes, or to perform some logic&nbsp;after the animation completes, you can pass in a duration value other than 1.0, assign a completionDelegate, or both, depending on your needs.

Check out the <a title="GitHub - SwiftRotateAnimation" href="https://github.com/andrewcbancroft/SwiftRotateAnimation" target="_blank">GitHub example</a> for details on how to configure things for the <span class="lang:swift decode:true  crayon-inline">completionDelegate</span>. &nbsp;I&#8217;ll be walking through that more &#8220;advanced&#8221; case shortly as well.

<a name="example" class="jump-target"></a>

### Example

Perhaps you&#8217;re asking, &#8220;Why spinning UIViews?&#8221;&#8230;

In my example, I&#8217;ve proposed&nbsp;a simple button that would be used to refresh the view / data in a real-world scenario. &nbsp;When the button is tapped, I want the button to rotate 360 degrees.

In the &#8220;advanced&#8221; example, I want it to rotate continually until a process of some sort finishes, at which point the animation stops until initiated again. &nbsp;Take a look:

[<img class="size-full wp-image-5661 aligncenter" src="https://www.andrewcbancroft.com/wp-content/uploads/2014/10/RotateAnimationExample.gif" alt="Rotate Animation Example" width="357" height="636" />][2]

&nbsp;

<a name="rotate-once" class="jump-target"></a>

### Simple Case &#8211; Rotate Once

Once the UIView extension is in place, the simple use case is&#8230; well&#8230; pretty simple:

<pre class="lang:swift decode:true" title="Simple Rotate Animation">class ViewController: UIViewController {
    @IBOutlet weak var refreshButton: UIButton!
    
    @IBAction func refresh() {
        self.refreshButton.rotate360Degrees()
        // Perhaps start a process which will refresh the UI...
    }
}</pre>

<a name="advanced" class="jump-target"></a>

### &#8220;Advanced&#8221; Case &#8211; Rotate Until Process Finishes

In my&nbsp;example, I decided to simulate a long-running process by using a custom-built <span class="lang:swift decode:true  crayon-inline">Timer</span>&nbsp;class, heavily inspired by <a title="Samuel Mullen - Using Swift Closures with NSTimer" href="http://www.samuelmullen.com/2014/07/using-swifts-closures-with-nstimer" target="_blank">Samuel Mullen&#8217;s implementation</a> (with a few modifications to fit my needs). &nbsp;If you&#8217;re looking through the <a title="GitHub - SwiftRotateAnimation" href="https://github.com/andrewcbancroft/SwiftRotateAnimation" target="_blank">GitHub example</a>, try not to&nbsp;get too bogged down in the details of the <span class="lang:swift decode:true  crayon-inline">Timer</span>, unless it just intrigues you. &nbsp;In real life, you may decide perform a web service call to refresh your data model, or refresh your UI (or both). &nbsp;Whatever the case may be, you&#8217;ll likely end up with similar logic:

  * Refresh button is tapped
  * If the button isn&#8217;t already rotating, make it start
  * Kick off a process that may take some time
  * The <span class="lang:swift decode:true  crayon-inline ">animationDidStop</span>&nbsp;callback is going to be invoked after the view has spun a full 360 degrees. &nbsp;If the longish-running process is finished, the button can stop spinning. &nbsp;Otherwise, it needs to spin around another time. &nbsp;This will be repeated until the longish-running process is complete.

Confession: &nbsp;I&#8217;m not entirely thrilled with the rampant mutability in my implementation, but I couldn&#8217;t figure out a way to do what I wanted in an immutable way. &nbsp;It does work, however. &nbsp;Just be aware that if you&#8217;re really a stickler for immutability in your classes, you&#8217;re going to hate this implementation (and I&#8217;d love to hear constructive feedback&nbsp;on how I could improve it!). &nbsp;Here&#8217;s the code for the bullet-pointed process just outlined:

<pre class="lang:swift mark:9,19-25 decode:true" title="Advanced Rotate Animation">class ViewController2: UIViewController {
    @IBOutlet weak var refreshButton: UIButton!
    // var, var, var!  So much for immutability :/
    var isRotating = false
    var shouldStopRotating = false
    var timer: Timer!
    
    @IBAction func refresh() {
        if self.isRotating == false {
            self.refreshButton.rotate360Degrees(completionDelegate: self)
            // Perhaps start a process which will refresh the UI...
            self.timer = Timer(duration: 5.0, completionHandler: {
                self.shouldStopRotating = true
            })
            self.timer.start()
            self.isRotating = true
        }
    }
    
    override func animationDidStop(anim: CAAnimation!, finished flag: Bool) {
        if self.shouldStopRotating == false {
            self.refreshButton.rotate360Degrees(completionDelegate: self)
        } else {
            self.reset()
        }
    }
    
    func reset() {
        self.isRotating = false
        self.shouldStopRotating = false
    }
}</pre>

<a name="summary" class="jump-target"></a>

### Summary

I tried to strike a balance between making these simple animations easy to call on my labels, buttons, and other&nbsp;UIView subclasses, and just shoving everything into a UIViewExtensions.swift file. &nbsp;The related set of animations just seemed like a really nice use case for Swift extensions, and the strategy served me well in a recent project. &nbsp;Hopefully the series has sparked some ideas in your mind for how to employ extensions to enhance the capabilities of a class so that your code is easier and cleaner to write.

As always &#8211; thanks for reading!  
<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a title="The 5 W’s of Swift Extensions" href="http://www.andrewcbancroft.com/2014/11/03/the-5-ws-of-swift-extensions/">The 5 W’s of Swift Extensions</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a title="Fade In / Out Animations as Class Extensions in Swift" href="http://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/" target="_blank">Fade In / Out Animations as Class Extensions in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a title="Slide In Animation in Swift" href="http://www.andrewcbancroft.com/2014/09/24/slide-in-animation-in-swift/" target="_blank">Slide In Animation in Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://github.com/andrewcbancroft/SwiftRotateAnimation "GitHub - SwiftRotateAnimation"
 [2]: https://www.andrewcbancroft.com/wp-content/uploads/2014/10/RotateAnimationExample.gif