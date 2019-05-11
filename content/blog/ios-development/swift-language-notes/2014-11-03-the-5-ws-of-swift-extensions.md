---
title: The 5 W’s of Swift Extensions
author: Andrew
type: blog
date: 2014-11-03T19:04:19+00:00
aliases:
  - /2014/11/03/the-5-ws-of-swift-extensions/
dsq_thread_id:
  - "3187869051"
categories:
  - iOS / Mac
  - Swift
tags:
  - Swift
  - Swift Extension

---
For newcomers to Swift, the concept of extending a Type may be new, so I thought I&#8217;d share a high-level overview of Swift extensions in the style of asking the 5 W&#8217;s: Who? What? When? Where? Why?

### Who

&#8220;Swift developers&#8221; is a pretty obvious answer, but here are a scenarios to ask yourself about to see if you could make use of Swift extensions:

  * &#8220;I am relying on Types that are found in 3rd party frameworks or libraries and I wish I could add a little bit of functionality that isn&#8217;t there out of the box. Can I do that easily?&#8221;
  * &#8220;In utilizing Apple&#8217;s frameworks I find that a Type could be more powerful if it could _just do_ [x]. Can I add that power to the Apple framework Type?&#8221;
  * &#8220;I have written a framework for myself / my team that is used in multiple apps, but I desire to add behavior to one of the framework&#8217;s Types that is only relevant in a specific area of one particular app. Can I add that special functionality without changing the framework source?&#8221;

If you related to any or all of those scenarios, you could potentially make use of Swift extensions to speed your workflow and make your more organized and clean. Read on for more!

### What

> Extensions add new functionality to an **existing** class, structure, or enumeration type.  
> &#8211; [Apple Swift Developer Reference][1] 

The key word is **existing**. Hopefully the scenarios listed under &#8220;Who&#8221; make a little more sense with this information in mind. In all of those cases, you wish to add functionality to Types that have _already_ been designed and implemented.

What I have found to be amazing about Swift extensions is that the word &#8220;existing&#8221; _also_ applies to Types for which you don&#8217;t have access to the original source code. _That_ is powerful!

So extensions are especially useful if you want to add behavior to a Type found in any of the Cocoa / Cocoa Touch frameworks, or a 3rd party&#8217;s framework. Additionally, if you&#8217;ve created your own libraries and frameworks and you&#8217;d like to add behavior without modifying the original source, extensions are a good choice for adding that behavior, especially if what you&#8217;re adding doesn&#8217;t apply to every single usage of the Type you&#8217;re extending.

### When

The most logical time to use Swift extensions is when you have a piece of functionality that you want to be able to _reuse_, and the most reasonable place to put that code is within an already-existing Type. Ideally, the piece of functionality is _so closely related_ to that Type that it just makes sense to extend that Type&#8217;s behavior to include your new functionality&#8230; &#8220;If _only_ I could peek inside that Type&#8217;s implementation to inject my new code&#8221;, you think to yourself.

If you&#8217;re pondering along those lines, then chances are, Swift extensions will aid you in your effort to create more reusable, clean, and organized code.

Perhaps a good question to ask here is, **&#8220;When _not_?&#8221;**. When I see phrases like, &#8220;most reasonable place to put that code&#8221;, it begs the question, &#8220;What does &#8216;most reasonable&#8217; mean?&#8221;. The answer isn&#8217;t black and white. I&#8217;ll offer what I&#8217;ve done in the past as general advice:

As a general rule of thumb, extensions are great for small, simple additions to a Type, rather than long, complex functionality.

If you&#8217;re implementing a _set_ of behavior (more than a handful of methods or computed properties), creating a new Type to encapsulate that behavior is most appropriate. After all, that&#8217;s what classes and structs _do_. When deciding on extension vs new Type, they key word that comes to my mind is **relatedness**. _How related_ is this behavior to the Type I think I want to extend?

Additionally, extensions are limited in the area of maintaining state. Extensions cannot add new [stored properties][2] (only [computed ones][3]). Creating a new Type to encapsulate the stored properties and the behavior that utilizes them is your alternative solution in this case.

### Where

So you&#8217;ve decided that you want to create an extension to some class, struct, or enumeration. Where do you put it? My thought on this has always been to create a new .swift file, give it a name that indicates which Type you&#8217;re extending, and create the extension inside that file.

So if I want to extend, say, String to have a new method called &#8220;sayHello&#8221; which printed &#8220;Hello&#8221; when invoked, I would create a new .swift file called StringExtensions.swift. I&#8217;d then place my extension inside:

<pre class="lang:swift decode:true " title="StringExtensions.swift" >extension String {
    func sayHello() {
        println("Hello")
    }
}</pre>

Hey, awesome &#8211; you got a bonus _How_ with that quick example! Creating an extension in Swift is _that easy_.

### Why

  * Swift extensions are powerful. They empower you to add behavior to _any_ class, struct, or enumeration, even if you don&#8217;t have access to the original source code.
  * They are simple and convenient to create.
  * They encourage code re-use by encapsulating behavior that will be used more than once in your project in a single location.
  * Additionally, they promote good code organization, leading to cleaner and more readable code when used to add behavior that&#8217;s closely related to the Type they&#8217;re extending.

### Summary

We&#8217;ve just explored Swift extensions by analyzing _who_ should use them, _what_ they are, _when_ they&#8217;re appropriate, _where_ to put them, and _why_ they&#8217;re useful to your development efforts. As a bonus, _how_ to program an extension was given as a simple example.

If you&#8217;ve found Swift extensions to be useful to your development efforts, sound off in the comments below! I&#8217;d love to hear how you&#8217;re utilizing this feature of Swift.

<div class="related-posts">
  You might also enjoy</p> 
  
  <ul>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/" title="Fade In / Out Animations as Class Extensions in Swift">Fade In / Out Animations as Class Extensions in Swift</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/10/15/rotate-animation-in-swift/" title="Rotate Animation in Swift">Rotate Animation in Swift</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/09/24/slide-in-animation-in-swift/" title="Slide In Animation in Swift">Slide In Animation in Swift</a>
    </li>
  </ul>
</div>

 [1]: https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Extensions.html "Apple Swift Developer Referenc"
 [2]: https://developer.apple.com/library/ios/documentation/swift/conceptual/Swift_Programming_Language/Properties.html#//apple_ref/doc/uid/TP40014097-CH14-XID_381
 [3]: https://developer.apple.com/library/ios/documentation/swift/conceptual/Swift_Programming_Language/Properties.html#//apple_ref/doc/uid/TP40014097-CH14-XID_386