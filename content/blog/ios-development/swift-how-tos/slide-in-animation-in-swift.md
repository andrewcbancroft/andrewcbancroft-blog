---
title: Slide In Animation in Swift
author: Andrew
type: blog
date: 2014-09-24T18:25:52+00:00
url: /2014/09/24/slide-in-animation-in-swift/
dsq_thread_id:
  - "3050287045"
categories:
  - iOS / Mac
  - Swift
tags:
  - Animations
  - Slide In
  - Swift
  - Swift Extension
  - UIView Extension
dispiosgettingstartedbadge: true

---
In a previous post about <a title="Fade In / Out Animations as Class Extensions in Swift" href="http://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/" target="_blank">fade animations</a> in Swift, I demonstrated how to use a class extension to add the ability for any UIView instance to easily call `fadeIn()` or `fadeOut()` on itself. This strategy was nice – the animations, while simple, would have cluttered my code each time I used them, had I not encapsulated them _somewhere_. Employing class extensions in Swift seemed a natural way to provide this functionality to UIViews.

Well, I liked the idea so much that when it came time for me to implement a slide animation, I kept the same strategy, and I'd like to share my implementation with you today.

<a name="animation-demo" class="jump-target"></a>

### Animation demo

To start off with, here's a sample of what the animation does:

<p style="text-align: center;">
  <a href="http://www.andrewcbancroft.com/wp-content/uploads/2014/09/SlideAnimationSample2.gif"><img class="alignnone size-full wp-image-5171" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/09/SlideAnimationSample2.gif" alt="Slide Animation Example" width="285" height="509" /></a>
</p>

The easiest way to get the gist of what I've done is to <a title="GitHub - SwiftSlideAnimation" href="https://github.com/andrewcbancroft/SwiftSlideAnimation" target="_blank">head over to GitHub and download the example Xcode Project</a>. In real life, I've combined the fade animations and the slide animation into the same UIView extension, but for education's sake, I've split them out so you can easily see the moving parts.

<a name="overview" class="jump-target"></a>

### Implementation overview

There are three major parts to this example implementation, which I'll explain in detail shortly. Here's the overview:

<a name="overview-create-extension" class="jump-target"></a>

#### 1 – Create the UIView extension

```swift
import UIKit

extension UIView {
    // Name this function in a way that makes sense to you... 
    // slideFromLeft, slideRight, slideLeftToRight, etc. are great alternative names
    func slideInFromLeft(duration: NSTimeInterval = 1.0, completionDelegate: AnyObject? = nil) {
        // Create a CATransition animation
        let slideInFromLeftTransition = CATransition()
        
        // Set its callback delegate to the completionDelegate that was provided (if any)
        if let delegate: AnyObject = completionDelegate {
            slideInFromLeftTransition.delegate = delegate
        }
        
        // Customize the animation's properties
        slideInFromLeftTransition.type = kCATransitionPush
        slideInFromLeftTransition.subtype = kCATransitionFromLeft
        slideInFromLeftTransition.duration = duration
        slideInFromLeftTransition.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseInEaseOut)
        slideInFromLeftTransition.fillMode = kCAFillModeRemoved
        
        // Add the animation to the View's layer
        self.layer.addAnimation(slideInFromLeftTransition, forKey: "slideInFromLeftTransition")
    }
}
```

<a name="overview-setup-storyboard" class="jump-target"></a>

#### 2 – Set up the storyboard

  * From the Utilities panel, drag over a regular View to act as a wrapper for the sliding text (use a _regular_ View, not a Container View)
  * From the Utilities panel, drag a Label into the wrapper view and create an IBOutlet to your View Controller for the Label
  * Set up auto layout constraints for both the wrapper and the Label
  * Set the wrapper view's Clip Subviews property to _checked_ in the Attributes Inspector

<a name="overview-code-vc" class="jump-target"></a>

#### 3 – Code the View Controller – initiate slide animation.

In my example, I wired the trigger up to a button's `touchUpInside` action. For you, it may be something different that triggers the animation to begin. Whatever it may be, call `slideInFromLeft()` on your UIView instance (in my case, the UILabel).

```swift
@IBAction func slideTextButtonTapped(sender: UIButton) {
        self.slidingTextLabel.slideInFromLeft()
        self.slidingTextLabel.text = "Sliding Text!"
    }
```

Notice that directly after the call to `slideInFromLeft()`, I change the label's text property to contain the new text that I want to slide in.

<a name="details" class="jump-target"></a>

### Implementation details

The real work all happens inside the UIViewExtensions.swift file where I add the `slideInFromLeft()` <span class="crayon-sy">function to a UIView's arsenal.`

<a name="details-uiviewextensions-swift" class="jump-target"></a>

#### UIViewExtensions.swift

First to note is that I've provided a few default values in the function's signature so that the animation can be initiated as simply as writing `viewInstance.slideInFromLeft()`, or as "complicated&#8221; as providing argument values to both duration and completionDelegate:

```swift
extension UIView {
    func slideInFromLeft(duration: NSTimeInterval = 1.0, completionDelegate: AnyObject? = nil) {
    // Implementation...
}
```

Next, I create a `CATransition` instance, and set its delegate property if a `completionDelegate` is passed when the function is called:

```swift
extension UIView {
    func slideInFromLeft(duration: NSTimeInterval = 1.0, completionDelegate: AnyObject? = nil) {
        let slideInFromLeftTransition = CATransition()
        
        if let delegate: AnyObject = completionDelegate {
            slideInFromLeftTransition.delegate = delegate
        }
            // Remaining implementation...
}
```

I then go about configuring the animation's properties. To achieve the "slide in from left&#8221; animation, I set the `type` and the `subtype` properties to `kCATransitionPush` and `kCATransitionFromLeft`, respectively. These two combined create the "slide in&#8221; effect. Other properties that I set are `duration`, `timingFunction`, and `fillMode`:

```swift
extension UIView {
        // ...
        slideInFromLeftTransition.type = kCATransitionPush
        slideInFromLeftTransition.subtype = kCATransitionFromLeft
        slideInFromLeftTransition.duration = duration
        slideInFromLeftTransition.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionEaseInEaseOut)
        slideInFromLeftTransition.fillMode = kCAFillModeRemoved
        
        // ...
    }
}
```

To keep things simple, I only allow myself to customize the `duration` property, and optionally provide a `completionDelegate` when I call the function&#8230; the other properties are more fundamental to how the animation should perform, so I encapsulate the implementation here so that it's an abstraction when I actually call `slideInFromLeft()` later in my View Controller.

The last thing I do is add the animation that I just created and configured to the view's layer property. "The view&#8221; here would be the instance of UIView that has _calls_ `slideInFromLeft()`:

```swift
extension UIView {
        // ...
        self.layer.addAnimation(slideInFromLeftTransition, forKey: "slideInFromLeftTransition")
    }
}
```

<a name="details-storyboard-setup" class="jump-target"></a>

#### Storyboard setup details

This is probably the more challenging piece, just because it takes some tweaking to get the auto layout constraints just right.

  * My general setup in this example is a Label wrapped inside a containing UIView. I made sure to simply drag over a regular View (not a Container View) from the utilities pane on the right. I then dragged a Label inside the "wrapper&#8221; view.
  * I set wrapper view's width to a value that was less than the entire screen's width. This was so that the sliding view didn't appear to slide in from off-screen and slide out off-screen. Instead it appears to slide in from underneath the wrapper view&#8230; You're welcome to customize this how you want (or avoid the containing view altogether if you find it's not needed for your specific implementation).
  * For the wrapper view, I've set constraints for 
      * Center Horizontally in Container
      * Top Space to Top Layout Guide
      * Width
      * Height

[<img class="alignnone size-large wp-image-5091" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Wrapper-View-Constraints-1024x644.png" alt="Wrapper View Constraints" width="730" height="459" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Wrapper-View-Constraints-1024x644.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Wrapper-View-Constraints-300x188.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Wrapper-View-Constraints-1200x754.png 1200w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Wrapper-View-Constraints.png 1469w" sizes="(max-width: 730px) 100vw, 730px" />][1]

Next, I made sure that my label that will be sliding is _inside_ the wrapper view. I set its constraints to

  * Center Horizontally in Container
  * Center Vertically in Container
  * Equal Widths
  * Equal Heights

[<img class="alignnone size-large wp-image-5081" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Label-Constraints-1024x642.png" alt="Label Constraints" width="730" height="457" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Label-Constraints-1024x642.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Label-Constraints-300x188.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Label-Constraints-1200x752.png 1200w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Label-Constraints.png 1471w" sizes="(max-width: 730px) 100vw, 730px" />][2]

The last thing I do in the storyboard before wiring things in the View Controller is to select the wrapper view and make sure it's Clip Subviews property is _checked_. As an experiment, toggle this option and watch the effect it has on the animation's appearance:

[<img class="alignnone size-large wp-image-5071" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Clib-Subviews-Checked-1024x646.png" alt="Clib Subviews Checked" width="730" height="460" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Clib-Subviews-Checked-1024x646.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Clib-Subviews-Checked-300x189.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Clib-Subviews-Checked-1200x757.png 1200w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Clib-Subviews-Checked.png 1475w" sizes="(max-width: 730px) 100vw, 730px" />][3]

<a name="details-vc-implementation" class="jump-target"></a>

#### View controller implementation

The final piece of the setup is to wire things up to the View Controller and animate the Label.

Since I needed to reference the Label containing the text that I'd like to animate, I created an `IBOutlet` from my storyboard to my View Controller:

```swift
class ViewController: UIViewController {
    @IBOutlet weak var slidingTextLabel: UILabel!
    // ...
}
```

Next, I needed a way to initiate the slide in animation – I decided that wiring it to a button's `touchUpInside` action would be sufficient for the example, so I created an `IBAction` from my Storyboard to my View Controller for that purpose.

Within the body of that `IBAction`, I wrote the call to `slideInFromLeft()` on my `slidingTextLabel` instance:

```swift
import UIKit

class ViewController: UIViewController {
    // ...
    @IBAction func slideTextButtonTapped(sender: UIButton) {
        self.slidingTextLabel.slideInFromLeft()
//      self.slidingTextLabel.slideInFromLeft(duration: 1.0, completionDelegate: self) // Use this line to specify a duration or completionDelegate
        self.slidingTextLabel.text = "Sliding Text!"
    }
    
    // ...
}
```

If you have need to specify a `duration` or a `completionDelegate`, there's a commented out line of code there that shows an example of passing those arguments to the `slideInFromLeft()` function.

If you specify a `completionDelegate` to the `slideInFromLeft()` function, a method called `animationDidStop()` will be called when the animation finishes. Inside this callback function, you can write code to perform any action you'd like to have happen after the animation has finished. If you don't set a completionDelegate, there's no need to have this method override in your code:

```swift
override func animationDidStop(anim: CAAnimation!, finished flag: Bool) {
        println("Animation stopped")
    }
```

That's a wrap, folks! Hope this strategy is helpful for you as you think about where to place code for your UIView animations.

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
      <i class="fa fa-angle-right"></i> <a title="Fade In / Out Animations as Class Extensions in Swift" href="http://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/" target="_blank">Fade In / Out Animations as Class Extensions in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a title="Rotate Animation in Swift" href="http://www.andrewcbancroft.com/2014/10/15/rotate-animation-in-swift/" target="_blank">Rotate Animation in Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Wrapper-View-Constraints.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Label-Constraints.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Clib-Subviews-Checked.png