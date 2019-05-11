---
title: Fade Views In/Out with Fadeable – A Swift Protocol Extension
author: Andrew
type: blog
date: 2016-02-22T19:07:27+00:00
aliases:
  - /2016/02/22/fade-views-inout-with-fadeable-a-swift-protocol-extension/
dsq_thread_id:
  - "4602239888"
categories:
  - Swift
tags:
  - Fade In
  - Fade Out
  - Swift

---
During the production of my [Pluralsight course on Managing Xcode Project Dependencies with CocoaPods][1], I wanted to provide viewers of the course the opportunity to see how to create and deploy a simple library out to the CocoaPods Trunk.

<a name="inspiration" class="jump-target"></a>

### Inspiration

A simple idea came to mind: Create something that allows client developers of the pod to easily fade views in or out on any UIView instance. If you've read andrewcbancroft.com for a long time, you might remember that I [wrote on this very subject already][2], but there, I used an extension to UIView, because protocol extensions hadn't been invented yet!

For my course, I borrowed an idea that I first saw done by [@NSFlexMonkey][3] when he built the [Rotateable protocol extension][4]. Only instead of rotating, I'm fading, so I named it &#8220;Fadeable&#8221;!

<a name="demo" class="jump-target"></a>

### Demo

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/02/fadeable-gif.gif" alt="Fadeable Gif Demo" width="374" height="668" class="alignnone size-full wp-image-12654" />][5]

<a name="sample" class="jump-target"></a>

### Fadeable code sample

The &#8220;library's&#8221; source can be found over at GitHub:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/Fadeable" title="Fadeable">Fadeable</a>
    </li>
  </ul>
</div>

Here's a snippet from the repository so you can see what the extension's doing:

```swift
import UIKit

public protocol Fadeable {
    var alpha: CGFloat {get set}
    
    mutating func fadeIn(duration: NSTimeInterval, delay: NSTimeInterval, completion: (Bool) -&gt; Void)
    mutating func fadeOut(duration: NSTimeInterval, delay: NSTimeInterval, completion: (Bool) -&gt; Void)
}

public extension Fadeable {
    public mutating func fadeIn(duration: NSTimeInterval = 1.0, delay: NSTimeInterval = 0.0, completion: ((Bool) -&gt; Void) = {(finished: Bool) -&gt; Void in}) {
        UIView.animateWithDuration(duration, delay: delay, options: UIViewAnimationOptions.CurveEaseOut, animations: {
            self.alpha = 1.0
            }, completion: completion)  }
    
    public mutating func fadeOut(duration: NSTimeInterval = 1.0, delay: NSTimeInterval = 0.0, completion: (Bool) -&gt; Void = {(finished: Bool) -&gt; Void in}) {
        UIView.animateWithDuration(duration, delay: delay, options: UIViewAnimationOptions.CurveEaseOut, animations: {
            self.alpha = 0.0
            }, completion: completion)
    }
}

extension UIView: Fadeable {}
```

In the code snippet above, I define the `Fadeable` protocol as [Some Type] that has an `alpha` property, and a `fadeIn()` and `fadeOut()` function.

Then I create an extension to the `Fadeable` protocol and provide a simple, default implementation which will animate the alpha to 0, or to 1, depending on whether or not the client developer is fading in or out.

Finally, I extend `UIView` to conform to `Fadeable`. And that's it! Any `UIView` instance can now fade in or out by simply calling the appropriate function:

```swift
class ViewController: UIViewController {
    
    @IBOutlet weak var box: UIView!
    
    // ... Omitted for brevity   

    // The storyboard has a button that can be tapped to toggle the fade action
    @IBAction func fadeToggleTapped(sender: UIButton) {
        if(box.alpha == 0) {
            box.fadeIn()
        } else {
            box.fadeOut()
        }
    }
}
```

<a name="creating-cocoapod-libraries" class="jump-target"></a>

### Creating CocoaPod libraries

If you're interested in seeing a full walk-through of how I created and published the Fadeable Library to the CocoaPods Trunk, I would love it if you gave Module 3 of my Pluralsight course, titled a watch! It's titled [Creating CocoaPod Libraries][1] and covers from beginning to end, the process of creating a library that's compatible with CocoaPods.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/02/03/managing-xcode-project-dependencies-with-cocoapods/" title="Managing Xcode Project Dependencies with CocoaPods">Managing Xcode Project Dependencies with CocoaPods</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2014/09/24/slide-in-animation-in-swift/" title="Slide In Animation in Swift">Slide In Animation in Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.pluralsight.com/courses/cocoapods-xcode-project-dependencies
 [2]: https://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/
 [3]: https://twitter.com/FlexMonkey
 [4]: http://flexmonkey.blogspot.co.uk/2015/10/rotatable-swift-protocol-extension-to.html
 [5]: https://www.andrewcbancroft.com/wp-content/uploads/2016/02/fadeable-gif.gif