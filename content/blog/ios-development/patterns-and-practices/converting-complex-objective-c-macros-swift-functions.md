---
title: Converting Complex Objective-C Macros to Swift Functions
author: Andrew
type: blog
date: 2015-01-29T13:00:51+00:00
aliases:
  - /2015/01/29/converting-complex-objective-c-macros-swift-functions/
dsq_thread_id:
  - "3463928351"
categories:
  - Swift
tags:
  - '#define'
  - Complex Macro
  - Swift

---
The question of how to convert `#define` macros from Objective-C to Swift is explained fairly simply in the [Apple developer documentation on the subject][1]. For _simple_ macros, it's a matter of rewriting them as global constants. In fact, if you're using the hybrid Objective-C &#8212; Swift approach to writing your app, Swift sees those simple macros and automatically makes them available to your Swift code. I also gave some tips on the [alternative to Objective-C macros][2] a while back.

Where we run into trouble is when we need to port _complex_ Objective-C macros to Swift. According to the [same documentation from Apple][1],

> Complex macros are used in C and Objective-C but have no counterpart in Swift. 

Yikes!

Thankfully there _is_ a silver lining after that scary first sentence:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/01/complex_macros.png" alt="Complex Macros Explanation" width="670" height="168" class="alignnone size-full wp-image-11214" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/01/complex_macros.png 670w, https://www.andrewcbancroft.com/wp-content/uploads/2015/01/complex_macros-300x75.png 300w" sizes="(max-width: 670px) 100vw, 670px" />][3]

> In Swift, you can use functions and generics to achieve the same results without any compromises.

That makes sense, actually! Complex Objective-C macros tend to look a _lot_ like functions, so the transition to Swift was straightforward in a case I ran across recently.

## Two Examples:

### A simple example

What could we do in Swift to convert an Objective-C macro that looks something like this?

<pre class="lang:objc decode:true " >#define SQUARE_NUMBER(n) n * n
```

One thing we could do is write a function that produces the same thing:

```swift
func squareNumber(n: Int) -&gt; Int {
    return n * n
}
```

### A little more complicated

An example situation that came to me on Twitter took the form of converting a macro that was a little more complicated than the simple example just presented. The input to the complex macro was a color, represented as a hexadecimal value, along with an alpha, represented as a float. The output? A `UIColor` instance based on some bitwise manipulations to that hex value.

I've created a GitHub example if you'd like to play around with everything. The relevant code is reproduced below&#8230;

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/ConvertComplexMacroExample" onclick="_gaq.push(['_trackEvent', 'outbound-article', 'https://github.com/andrewcbancroft/ConvertComplexMacroExample', 'Example XCode Project']);" title="Convert Complex Macro Example Project">Example XCode Project</a>
    </li>
  </ul>
</div>

The macro form looked like this:

<pre class="lang:objc decode:true " >#define UIColorFromRGB(rgbValue, alphaValue) \
[UIColor colorWithRed:((float)((rgbValue >> 16) & 0xFF))/255.0 \
green:((float)((rgbValue >> 8) & 0xFF))/255.0 \
blue:((float)((rgbValue >> 0) & 0xFF))/255.0 \
alpha:alphaValue]
```

Rewriting it as a Swift function:

```swift
func UIColorFromRGB(rgb: Int, alpha: Float) -> UIColor {
    let red = CGFloat(Float(((rgb>>16) & 0xFF)) / 255.0)
    let green = CGFloat(Float(((rgb>>8) & 0xFF)) / 255.0)
    let blue = CGFloat(Float(((rgb>>0) & 0xFF)) / 255.0)
    let alpha = CGFloat(alpha)
    
    return UIColor(red: red, green: green, blue: blue, alpha: alpha)
}
```

The main thing to keep in mind is that the output of the macro/function is the focus. The internals could change to better-adapt to Swift's features if you desire. If the macro was ugly inside, make it nice in Swift!

### Where should the function go?

  * For organization's sake, you could create a new .swift file and place the function inside it at the global level. This would provide the most convenient transition for your Objective-C to Swift conversion, because `#defines` were available wherever you imported the Objective-C header file.
  * Alternatively, you could encapsulate the function in a class/struct/enum.

### Wrapping up

With the power of Swift functions and the ability to even declare and use them globally, converting complex macros to a better Swift alternative is much less daunting than you might expect.

 [1]: https://developer.apple.com/library/ios/documentation/Swift/Conceptual/BuildingCocoaApps/InteractingWithCAPIs.html#//apple_ref/doc/uid/TP40014216-CH8-XID_20
 [2]: http://www.andrewcbancroft.com/2014/10/01/swift-alternative-to-objective-c-macros/
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2015/01/complex_macros.png