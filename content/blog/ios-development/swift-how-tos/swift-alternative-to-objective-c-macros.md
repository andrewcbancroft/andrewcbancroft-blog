---
title: Swift Alternative to Objective-C Macros
author: Andrew
type: blog
date: 2014-10-01T17:58:46+00:00
url: /2014/10/01/swift-alternative-to-objective-c-macros/
dsq_thread_id:
  - "3073143179"
categories:
  - iOS / Mac
  - Swift
tags:
  - '#define'
  - Constants
  - Objective-C Macro
  - Swift

---
I've previously written about <a title="Replace Magic Strings with Enumerations in Swift" href="http://www.andrewcbancroft.com/2014/09/02/replace-magic-strings-with-enumerations-in-swift/" target="_blank">using enumerations in Swift to encapsulate special values</a> that could end up falling into the "magic string&#8221; category if they were to simply be scattered in-line throughout your code. The primary example I proposed for such a "magic string&#8221; replacement was Storyboard Segue Identifiers.  These special identifiers have such a specific purpose that felt to me like a natural fit to create a Type in the form of an enumeration (which I called SegueIdentifier) to group them all together in one place so that I could easily find them and modify them, should I ever need to do so.

I still like that solution for _groups_ of things, but it's a lot of "ceremony&#8221; to use enumerations for encapsulating _everything_ that may have been implemented as a macro expression or a static global constant in Objective-C.

I ran across this in the <a title="Apple Developer Documentation - Using Swift with Cocoa and Objective-C" href="https://developer.apple.com/library/ios/documentation/swift/conceptual/buildingcocoaapps/InteractingWithCAPIs.html#//apple_ref/doc/uid/TP40014216-CH8-XID_19" target="_blank">Swift developer documentation</a> that I think will be of help to folks who want to avoid "magic values&#8221; throughout their code, but don't want to employ enumerations where they're not the best fit.  Here's a snippet:

[<img class="alignnone size-full wp-image-5231" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Macro-Alternatives-in-Swift.png" alt="Macro Alternatives in Swift" width="705" height="149" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Macro-Alternatives-in-Swift.png 705w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Macro-Alternatives-in-Swift-300x63.png 300w" sizes="(max-width: 705px) 100vw, 705px" />][1]

So there you have it, folks!  One easy alternative to your former `#define` habits when you're working in Swift is to simply declare a _constant_ (using the `let` keyword) instead.  The word "constant&#8221; is _key_ – the last thing you want to do is declare a _variable_ in some global scope (using the `var` keyword) where the value of the identifier could be changed somehow, if even by accident.

### Organizing #define Replacement Constants

The question that naturally comes next is, "Where do I declare a constant that I'm using to replace a #define?&#8221;

The answer is not black and white – a few factors play into your decision of where to declare them.

In general, I would probably declare such a constant in the location that's closest to the context in which it is used.  Here are a few examples to consider:

<li style="text-align: left;">
  If it's only going to be used in a single function, it's reasonable to declare the constant locally at the top of that function, or anywhere near where it will be used.
</li>
<li style="text-align: left;">
  If it's only used in a single class/struct, perhaps declaring it at the top of that class/struct is a good idea.
</li>
<li style="text-align: left;">
  If it's going to be a value that's used in <em>multiple</em> classes/structs, it may be time to create a new .swift file and place it there so that you can find it again.
</li>
<li style="text-align: left;">
  Start with a very small scope, and as that constant broadens in its usage throughout your project, gradually move it to more and more globally visible locations.
</li>

Using a globally-defined constant is exactly what I did for <a title="Swift iOS Version Checking" href="http://www.andrewcbancroft.com/2014/09/17/swift-ios-version-check/" target="_blank">checking the iOS version number of a user's device</a>.  I simply created a new file called "<span style="color: #404040;">iOSVersions.swift&#8221;, placed my global constant definitions in it, and was able to reference those constant names everywhere in my project that I needed to perform conditional logic based on the iOS version number.  </span>

### Summary

A simple Swift alternative to a <span class="lang:objc decode:true  crayon-inline ">#define</span> macro in Objective-C it to define a constant at a scope that's appropriate for where you plan to use that constant.

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Macro-Alternatives-in-Swift.png