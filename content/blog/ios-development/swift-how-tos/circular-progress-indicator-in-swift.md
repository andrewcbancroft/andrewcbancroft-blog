---
title: Circular Progress Indicator in Swift
author: Andrew
type: blog
date: 2015-07-10T04:31:49+00:00
url: /2015/07/09/circular-progress-indicator-in-swift/
dsq_thread_id:
  - "3920502960"
categories:
  - Swift
tags:
  - Circular Progress
  - Storyboard
  - Swift

---
<small>Updated on April 17, 2017 – Swift 3</small>

Circular progress indicators are a nice and compact way to visualize progress information for users of your iOS app. I was extremely grateful to come across [Kaan Dedeoglu's KDCircularProgress project on GitHub][1]. It's a versatile little UI component written in Swift that provides a great amount of flexibility and customization options. I love it!

As a bonus to this amazing component, recent contributions by Kaan have opened up the ability for us to lay out and set up the circular progress indicator in the Storyboard!

My goal in this article is to help get you up and running with this library in your own Storyboard-based Swift project.


<a name="example" class="jump-target"></a>

### Example project

Kaan's GitHub repository has an example project, but I've also gone ahead and made one as well for showing how to use this indicator in a Storyboard. We'll be using the example I created as a reference point for the forthcoming walk-through.

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/CircularProgressExample" title="Circular Progress Example">Circular Progress Example</a>
    </li>
  </ul>
</div>

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/circprogexample1.gif" alt="Circular Progress Example" width="372" height="681" class="alignnone size-full wp-image-12087" />][2]

<a name="getting-started" class="jump-target"></a>

### Getting started

The most obvious starting place is to head over to the [KDCircularProgress repository on GitHub][1] to grab the [KDCircularProgress.swift source file][3] and add it to your own Swift project. Kaan has things set up with CocoaPods as well if you care to use that. I found adding the .swift file to my project to be the least intrusive way to add this indicator to my UI components arsenal.

<a name="to-storyboard" class="jump-target"></a>

### To the Storyboard!

Since Kaan added `IBDesignable` and `IBInspectable` support, working with the circular progress indicator in the Storyboard is super easy.

To get started, all you need to do is drag a plain View over to the Storyboard Scene. Set up your constraints to correctly position the view where you need it:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/UIView-with-Constraints.png" alt="UIView with Constraints" width="906" height="855" class="alignnone size-full wp-image-12080" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/UIView-with-Constraints.png 906w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/UIView-with-Constraints-300x283.png 300w" sizes="(max-width: 906px) 100vw, 906px" />][4]

Next, you need to set the View's class to a _custom_ class, namely, `KDCircularProgress`:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Set-View-Class.png" alt="Set View Class" width="916" height="701" class="alignnone size-full wp-image-12081" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Set-View-Class.png 916w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Set-View-Class-300x230.png 300w" sizes="(max-width: 916px) 100vw, 916px" />][5]

With that in place, Xcode will process things and allow you to modify the properties of the progress indicator directly in the attributes section of the Utilities pane. Best of all, you'll see those changes be reflected in the Storyboard scene in real-time as you adjust values!

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Customized-in-storyboard.png" alt="Customized in Storyboard" width="841" height="702" class="alignnone size-full wp-image-12083" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Customized-in-storyboard.png 841w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Customized-in-storyboard-300x250.png 300w" sizes="(max-width: 841px) 100vw, 841px" />][6]

<a name="view-did-load" class="jump-target"></a>

### viewDidLoad()

While in the Storyboard, I set a few values so that I could actually see certain colors when progress had been made. However, to get things set to their true initial state, there may be some values you want to reset in `viewDidLoad()`. For example, I set the `angle` property to 90 degrees so that I could see the color of the progress track in the storyboard. But when I load the app, I want the angle to be 0 degrees (since no progress has been made when the app first loads).

To accomplish this, you'd simply make sure there's an outlet between your progress view in the Storyboard and the View Controller. Once they're connected, you can write something as simple as `circularProgressView.angle = 0` to start off with no progress.

<a name="increasing-progress" class="jump-target"></a>

### Increasing progress

We're dealing with a progress indicator here, so this implies that there's a beginning, some incremental steps taken toward a completion goal, and of course, the fully completed _whatever it was you were doing_.

The example I've contrived is a simple counter with an upper limit of 5. So as you tap "Increase Progress&#8221;, the circular progress view should update to be some fraction of the way around the 360 degree circle based upon how close we are to completing the count to 5.

There's a function I've built to calculate the new angle:

```swift
func newAngle() -> Double {
    return 360 * (currentCount / maxCount)
}
```

The rest is simply a matter of updating the current count and animating to the new angle:

```swift
@IBAction func increaseProgressButtonTapped(sender: UIButton) {
    if currentCount != maxCount {
        currentCount += 1
        let newAngleValue = newAngle()
        
        circularProgressView.animate(toAngle: newAngleValue, duration: 0.5, completion: nil)
    }
}
```

<a name="resetting" class="jump-target"></a>

### Resetting the indicator

To reset everything, we'd want to update the state of our current count back to 0.

The change to the circular progress indicator's visualization of the progress state can be animated by calling the view's `animate(fromAngle:toAngle:duration:completion:)` method:

```swift
@IBAction func resetButtonTapped(sender: UIButton) {
    currentCount = 0
    circularProgressView.animate(fromAngle: circularProgressView.angle, toAngle: 0, duration: 0.5, completion: nil)
}
```

### Wrapping up

There are a _ton_ of other customization options that you can play with. I highly recommend this UI component if you're looking for an easy-to-use, versatile circular progress indicator!

<a name="share" class="jump-target"></a>

 [1]: https://github.com/kaandedeoglu/KDCircularProgress
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/circprogexample1.gif
 [3]: https://github.com/kaandedeoglu/KDCircularProgress/blob/master/KDCircularProgress/KDCircularProgress.swift
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/UIView-with-Constraints.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Set-View-Class.png
 [6]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Customized-in-storyboard.png