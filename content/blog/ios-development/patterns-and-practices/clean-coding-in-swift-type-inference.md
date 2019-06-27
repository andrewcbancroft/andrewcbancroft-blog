---
title: Clean Coding in Swift – Type Inference
author: Andrew
type: blog
date: 2014-08-13T04:22:25+00:00
url: /2014/08/12/clean-coding-in-swift-type-inference/
spacious_page_layout:
  - default_layout
dsq_thread_id:
  - "2922554425"
categories:
  - iOS / Mac
  - Op-Ed
  - Swift
tags:
  - Clean Code
  - Swift
  - Type Inference

---
Quick!  Tell me!  What is the Type of the `birdDetails`constant in this code example:

```swift
let birdDetails = birdDetailsFromStorage()
```

With no additional context to glean information from, the correct answer to the question is, "I have absolutely no clue&#8230;&#8221;  <a title="Expanded Thoughts on Swift’s Type Inference" href="http://www.andrewcbancroft.com/2014/08/20/expanded-thoughts-on-swifts-type-inference/" target="_blank"><em>Or is it?</em></a>

"Not fair!&#8221;, you say.  "In the real world, I'd have the ability to option-click and learn the type from a pop-up tooltip, or learn this information by inspection from Xcode's utilities panel.&#8221;

Truth.  We would.  _But&#8230;_ should we _have_ to for an example like the one above?  Could we have helped ourselves out a bit by being explicit about the type of `birdDetails`?

This was the question I asked myself as I set out to determine how and when I prefer to explicitly specify the Types of my variables and constants at declaration-time, rather than letting the compiler _infer_ the Type for me.

<a title="Apple Documentation - Type Inference" href="https://developer.apple.com/library/prerelease/mac/documentation/Swift/Conceptual/Swift_Programming_Language/TheBasics.html#//apple_ref/doc/uid/TP40014097-CH5-XID_468" target="_blank">Type Inference</a> is powerful and convenient.  It enables us to leave off explicit type specifications when we declare a variable or constant, leaving us with nice, terse, clean-_looking_ code.  But in reality, for examples like the one posed above, is clean-_looking_ truly "clean code&#8221;?

From Apple's documentation:

> <span style="color: #414141;">Type inference enables a compiler to deduce the type of a particular expression automatically when it compiles your code, simply by examining the values you provide.</span>

The key phrase that stuck out to me was this:  "Type inference enables a **_compiler_** to deduce the type of a particular expression&#8230;&#8221;.  Humans are not compilers!

I don't know about you, but I could use all the help I can get when it comes to figuring out simple things like the Type resulting from an expression.  Sure, I could rely on the IDE, but in debugging, or in trying to simply read and understand what the intention of my code is when I come back to it sometime later, I want to focus on the _code_, not on pop-up tool tips or inspector panels.

For instances where deducing the type is not simple for a human to do (and I mean _really_ simple), I'm getting to where I prefer to specify the Type up-front.  We're used to doing this in Objective-C, and I even do it in C# when using <span class="lang:c# decode:true  crayon-inline ">var</span> would obscure things.  When a language gives me the option to be clear about Types, I try to take advantage of that valuable language feature for all but the simplest of situations.

### The Simplest of Situations

Let's think for a moment about this so-called "simplest of situations&#8221;.  I would define such a situation to be when the Type resulting from an expression can easily, at a glance, be inferred by a human being _without_ assistance from an IDE.  It's all about context here, and for these simplest of situations, I love Type Inference.

Compare the following two lines of code:

```swift
let birdDetails = "Swift"
```

and

```swift
let birdDetails: String = "Swift"
```

In the example just presented, typing "`: String` &#8221; to explicitly specify `birdDetails`&#8216; type is superfluous in my opinion (and I prefer not to be repetitively redundant when I can).  It's crystal clear that `birdDetails` in this example is a `String`.

_However_, in situations like the one at the beginning of the article where, by simply _looking,_ I would have to answer, "I have no clue what the Type of this is&#8221;, my preference / proposal for your consideration would be to go ahead and specify the Type at declaration time.  Consider:

```swift
let birdDetails: (genusSpecies: String, commonName: String) = birdDetailsFromStorage()


//... somewhere else in a Swift file far, far away ...


func birdDetailsFromStorage() -> (genusSpecies: String, commonName: String) {
    return ("Apus apus", "Swift")
}
```

When I'm writing this the first time, I can spend the time looking up the function's return Type and specify it when I declare my constant.  It will make my life so much easier down the road.

Don't stumble over the fact that `birdDetails` is a tuple type `(String, String)`.  The point is that the function could have returned _anything_, and it would still have been impossible for me to tell you what the Type of the constant was just by looking, had I not specified it upon its declaration.

Being explicit about the type in the declaration has great potential to immediately help us get our bearings around a particular set of code when we return to it after any length of time.  And it seems to me that one of the principal goals of writing clean code is to help ourselves and our teams make sense of code quicker so that everyone's happier and more productive.

Whew.  That was a long-winded exploration of some things to think about when relying on (or avoiding) Type Inference in your own code.  Thanks for reading!

* * *

Since publishing this op-ed, I've <a title="Expanded Thoughts on Swift’s Type Inference" href="http://www.andrewcbancroft.com/2014/08/20/expanded-thoughts-on-swifts-type-inference/" target="_blank">expanded my thoughts on Type Inference</a> as it relates to clean coding practices in Swift.  I highly recommend that this post be read and considered alongside my latest musings,which were heavily influenced by Rob Napier's comments below.

<div class="related-posts">
  <p>
    You might also enjoy
  </p>
  
  <ul>
    <li>
      <a title="Clean Coding in Swift – Functions" href="http://www.andrewcbancroft.com/2014/08/07/clean-coding-in-swift-functions/" target="_blank">Clean Coding in Swift – Functions</a>
    </li>
    <li>
      <a title="Expanded Thoughts on Swift’s Type Inference" href="http://www.andrewcbancroft.com/2014/08/20/expanded-thoughts-on-swifts-type-inference/" target="_blank">Expanded Thoughts on Swift's Type Inference</a>
    </li>
    <li>
      <a title="Pick a Delegate… Any Delegate… On Clean View Controllers in Swift" href="http://www.andrewcbancroft.com/2014/08/26/pick-a-delegate-clean-view-controllers-in-swift/" target="_blank">Pick a Delegate… Any Delegate… On Clean View Controllers in Swift</a>
    </li>
  </ul>
</div>