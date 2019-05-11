---
title: Fade In / Out Animations as Class Extensions in Swift
author: Andrew
type: blog
date: 2014-07-27T20:13:53+00:00
url: /2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/
spacious_page_layout:
  - default_layout
dsq_thread_id:
  - "2877954932"
categories:
  - iOS / Mac
  - Swift
tags:
  - Animation
  - Fade In
  - Fade Out
  - Swift
  - Swift Extension
  - UIView Extension

---
<small>Updated on December 6, 2016 &#8211; Xcode 8 & Swift 3.0</small>

The question has been <a title="Fade In / Out - Stack Overflow" href="http://stackoverflow.com/questions/20891614/fade-in-fade-out-animation" target="_blank">asked (and solved) on StackOverflow in Objective-C</a>, but my aim in this post is to take the Objective-C implementation and leverage Swift _extensions_ to make this job even easier to achieve and reuse.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#fade-without-extension">Fading without an extension</a>
    </li>
    <li>
      <a href="#refactoring-using-swift-extensions">Refactoring using Swift extensions</a>
    </li>
    <ul>
      <li>
        <a href="#create-uiviewextensions">Step 1 &#8211; Create UIViewExtensions.swift</a>
      </li>
      <li>
        <a href="#move-fadeout-fadein">Step 2 &#8211; Move fadeOut and fadeIn to UIViewExtensions.swift</a>
      </li>
      <li>
        <a href="#parameters-default-values">Step 3 &#8211; Provide parameters with default values</a>
      </li>
    </ul>
    
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

Fade animations basically involve adjusting a <span class="lang:swift decode:true  crayon-inline">UIView</span>&#8216;s alpha value from 1.0 to 0.0 (fade out) or 0.0 to 1.0 (fade in) over a specified duration using some kind of easing option (like starting fast, then slowing down at the end of the animation, or starting slow and speeding up at the end of the animation).

I&#8217;ve <a title="Swift Fade Animations - GitHub Project" href="https://github.com/andrewcbancroft/SwiftFadeAnimations" target="_blank">published an example XCode project to GitHub</a> with the final working version of the code below if you&#8217;d like to just see it. Read on for the full explanation.

**Edit: 2/23/2016** &#8211; A new idea flowing out of my [Pluralsight Course][1] involves a similar implementation, but using protocol extensions instead. This article&#8217;s implementation still works though, so feel free to check out either the contents of this blog entry, or the new one!

<div class="resources">
  <div class="resources-header">
    New article using protocol extensions
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/02/22/fade-views-inout-with-fadeable-a-swift-protocol-extension/" title="Fade Views In/Out with Fadeable – A Swift Protocol Extension">Fade Views In/Out with Fadeable – A Swift Protocol Extension</a>
    </li>
  </ul>
</div>

<a name="fade-without-extension" class="jump-target"></a>

### Fade _without_ an extension

Below is an example of how my view controller may look if I want to click a button and have it fade out a label, set the text, and fade it back in again:

<pre class="lang:swift decode:true" title="ViewController.swift">class ViewController: UIViewController {
    @IBOutlet weak var birdTypeLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup that your app requires
    }
    
    @IBAction func updateBirdTypeLabel(_ sender: UIButton) {
        // Fade out to set the text
        UIView.animate(withDuration: 1.0, delay: 0.0, options: UIViewAnimationOptions.curveEaseOut, animations: {
            self.birdTypeLabel.alpha = 0.0
            }, completion: {
                (finished: Bool) -> Void in
                
                //Once the label is completely invisible, set the text and fade it back in
                self.birdTypeLabel.text = "Bird Type: Swift"
                
                // Fade in
                UIView.animate(withDuration: 1.0, delay: 0.0, options: UIViewAnimationOptions.curveEaseIn, animations: {
                    self.birdTypeLabel.alpha = 1.0
                    }, completion: nil)
        })
    }
}</pre>

What I don&#8217;t like about this implementation is that if I want to perform this same kind of animation again elsewhere in my app, I&#8217;ve got to write the bulk of that algorithm again each time I want to fade something in or out. I&#8217;d like it to be in one place for easier maintainability. I&#8217;d also like to be able to fade in / out simply by doing something like `self.birdTypeLabel.fadeIn()` or `self.birdTypeLabel.fadeOut()` _optionally_ setting parameters for duration, delay, and completion. With these goals in mind, let&#8217;s see what Swift extensions provide us in terms of simplifying the process.

<a name="refactoring-using-swift-extensions" class="jump-target"></a>

### Refactoring using Swift extensions

<a name="create-uiviewextensions" class="jump-target"></a>

#### Step 1 &#8211; Create UIViewExtensions.swift

Create a new Swift file and name it something like UIViewExtensions.swift

<a name="move-fadeout-fadein" class="jump-target"></a>

#### Step 2 &#8211; Move fadeOut and fadeIn to UIViewExtensions.swift

Use the previously-written `fadeOut()` and \`fadeIn() algorithms in the new UIViewExtensions.swift file.

We can leverage what we wrote before with a few modifications. Take a look (I&#8217;ve written some comments to help identify some of the tweaks for the extension version):

<pre class="lang:swift mark:8,14 decode:true " title="UIViewExtensions.swift">import Foundation
import UIKit

extension UIView {
    func fadeIn() {
        // Move our fade out code from earlier
        UIView.animate(withDuration: 1.0, delay: 0.0, options: UIViewAnimationOptions.curveEaseIn, animations: {
            self.alpha = 1.0 // Instead of a specific instance of, say, birdTypeLabel, we simply set [thisInstance] (ie, self)'s alpha
            }, completion: nil)
    }
    
    func fadeOut() {
        UIView.animate(withDuration: 1.0, delay: 0.0, options: UIViewAnimationOptions.curveEaseOut, animations: {
            self.alpha = 0.0
            }, completion: nil)
    }
}</pre>

With this extension in place, we can now call <span class="lang:swift decode:true  crayon-inline">self.birdTypeLabel.fadeIn()</span> or <span class="lang:swift decode:true  crayon-inline">self.birdTypeLabel.fadeOut()</span> . To gain a little more control (if I so choose), I can outfit the `fadeIn` and `fadeOut` extension functions with parameters with default values defined so that I can call them with or without parameters as I need.

<a name="parameters-default-values" class="jump-target"></a>

#### Step 3 &#8211; Provide parameters with default values

In Step 2, we simply hard-coded values for duration, delay, and completion. Below is the final version of the extension that provides parameters for you to (optionally) pass arguments to.

<pre class="lang:swift decode:true" title="UIViewExtensions.swift - FINAL">import Foundation
import UIKit

extension UIView {
    func fadeIn(_ duration: TimeInterval = 1.0, delay: TimeInterval = 0.0, completion: @escaping ((Bool) -> Void) = {(finished: Bool) -> Void in}) {
        UIView.animate(withDuration: duration, delay: delay, options: UIViewAnimationOptions.curveEaseIn, animations: {
            self.alpha = 1.0
            }, completion: completion)  }
    
    func fadeOut(_ duration: TimeInterval = 1.0, delay: TimeInterval = 0.0, completion: @escaping (Bool) -> Void = {(finished: Bool) -> Void in}) {
        UIView.animate(withDuration: duration, delay: delay, options: UIViewAnimationOptions.curveEaseIn, animations: {
            self.alpha = 0.0
            }, completion: completion)
    }
}</pre>

With this now in place, the final version of my view controller becomes much simpler and clean:

<pre class="lang:swift decode:true" title="ViewController.swift - FINAL">import UIKit

class ViewController: UIViewController {
    @IBOutlet weak var birdTypeLabel: UILabel!
                        
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup that your app requires
    }
    
    @IBAction func updateBirdTypeLabel(_ sender: UIButton) {
        self.birdTypeLabel.fadeOut(completion: {
            (finished: Bool) -> Void in
            self.birdTypeLabel.text = "Bird Type: Swift"
            self.birdTypeLabel.fadeIn()
            })
    }
}</pre>

By employing Swift extensions to encapsulate the fade in / out animation logic, I was able to

  * Define the animation logic in one place for easy maintainability
  * Make my view controller&#8217;s code simpler and clean
  * Provide a more natural way to perform the animation on any UIView instance by simply calling fadeIn() or fadeOut()
  * Give myself the option to specify a different duration, delay, or completion closure if I need extra control

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/02/22/fade-views-inout-with-fadeable-a-swift-protocol-extension/" title="Fade Views In/Out with Fadeable – A Swift Protocol Extension">Fade Views In/Out with Fadeable – A Swift Protocol Extension</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a title="The 5 W’s of Swift Extensions" href="http://www.andrewcbancroft.com/2014/11/03/the-5-ws-of-swift-extensions/">The 5 W’s of Swift Extensions</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a title="Slide In Animation in Swift" href="http://www.andrewcbancroft.com/2014/09/24/slide-in-animation-in-swift/" target="_blank">Slide In Animation in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a title="Rotate Animation in Swift" href="http://www.andrewcbancroft.com/2014/10/15/rotate-animation-in-swift/" target="_blank">Rotate Animation in Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.pluralsight.com/courses/cocoapods-xcode-project-dependencies