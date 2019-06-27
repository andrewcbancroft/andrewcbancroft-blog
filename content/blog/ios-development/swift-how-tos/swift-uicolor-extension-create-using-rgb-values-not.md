---
title: 'Swift UIColor Extension – Create using RGB Values (Not %)'
author: Andrew
type: blog
date: 2015-06-26T03:11:48+00:00
url: /2015/06/25/swift-uicolor-extension-create-using-rgb-values-not/
dsq_thread_id:
  - "3880288358"
categories:
  - Swift
tags:
  - Extension
  - Swift
  - UIColor

---
I'll say it up front – I'm not a great designer. What tends to happen with me and projects is that I end up saving all-things color until the _end_ of a project. You know&#8230; the old procrastinator's motto: "If you don't get it done today and tomorrow doesn't come, then you ain't gotta do it!&#8221;

So the other day came and I had to "do color&#8221;&#8230;

Thankfully, a buddy of mine has good skills in the area, and gave me a color palette to use. Score!


<a name="working-with-colors" class="jump-target"></a>

### Working with colors

I decided it might be nice to go ahead and encapsulate my color scheme in code and set the various tints and font colors and navigation bar backgrounds to their appropriate values in code.

This seemed like a really nice way to keep all the color stuff in once place, so that if I ever needed to change things, I'd be able to do it in one spot, and the whole app would just magically take on the adjustments.

Inevitably, I'd need to create myself some `UIColor` instances.

<a name="baffled" class="jump-target"></a>

### Baffled

For those of us who spend a lot of time designing in the Storyboard, as opposed to creating views and layouts directly in code, coming up against the `UIColor` API when you haven't in a while can be&#8230;well&#8230;baffling. Not because it's "hard&#8221; but because it's not as intuitive as it looks on first-sight. Here's what I mean&#8230;

My color-adept friend had given me some hex color values. Looking at `UIColor` of course, there's no initializer or class function to create a color with such a value. No worries, though – there are plenty of converters out there!

So I got my red, green, and blue values all in order and did the thing that seemed most obvious: I supplied `UIColor`&#8216;s init method with those values, verbatim:

`let primaryColor = UIColor(red: 39.0, green: 44.0, blue: 79.0, alpha: 1.0)`

And then I realized that I hit the same "gotcha&#8221; that I had before. `UIColor` takes a _percentage_ of red, green, and blue, not the _value_ of red, green, and blue. I needed to divide the values by 255.0 each in order to obtain a value between 0 and 1 as the initializer requires. Sure, this is in [the documentation][1]:

> The red component of the color object, specified as a value from 0.0 to 1.0. 

Similar instructions appear for green, blue, and alpha.

It's easy enough to fix, but man – that sure seems like an easy-to-fall-for mistake if you're coming to this API after spending time away from it, or if you're brand new to iOS development.

<a name="uicolor-extension" class="jump-target"></a>

### UIColor extension

Having to divide the RGB values by 255.0 every time was just annoying enough that I created a `UIColor` extension to help me be able to do the intuitive thing and just supply the RGB values verbatim, like I'd done to begin with. Here it is for your enjoyment:

```swift
extension UIColor {
    static func colorWithRedValue(#redValue: CGFloat, greenValue: CGFloat, blueValue: CGFloat, alpha: CGFloat) -> UIColor {
        return UIColor(red: redValue/255.0, green: greenValue/255.0, blue: blueValue/255.0, alpha: alpha)
    }
}
```

### Wrapping up

I feel a little silly for having made this mistake, but hey – making the mistake is a good way to remember what not to do in the future. And now that I've written an extension (and this blog post), maybe I'll be set for next time I spend extended periods of time avoiding colors.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/" title="Fade In / Out Animations as Class Extensions in Swift">Fade In / Out Animations as Class Extensions in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/10/15/rotate-animation-in-swift/" title="Rotate Animation in Swift">Rotate Animation in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/09/24/slide-in-animation-in-swift/" title="Slide In Animation in Swift">Slide In Animation in Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIColor_Class/#//apple_ref/occ/instm/UIColor/initWithRed:green:blue:alpha: