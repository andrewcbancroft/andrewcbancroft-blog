---
title: Clean Coding in Swift – Functions
author: Andrew
type: blog
date: 2014-08-07T18:16:23+00:00
aliases:
  - /2014/08/07/clean-coding-in-swift-functions/
spacious_page_layout:
  - default_layout
dsq_thread_id:
  - "2908573524"
categories:
  - iOS / Mac
  - Op-Ed
  - Swift
tags:
  - Clean Code
  - Functions
  - Swift

---
I've been thinking a lot about how the principles of clean coding (Bob Martin's &#8220;<a title="Amazon - Clean Code" href="http://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882" target="_blank">Clean Code</a>&#8220;) apply in Swift. How do I express clean code in this language? Conversely, how do I _avoid_ writing _cryptic_ code in Swift? What language features help me write clear and self-explanatory code and what language features present the potential for tempting me to write obscure code in Swift?

I am beginning a commentary series that I hope will encourage clean coding practice in myself and in the Swift developer community. Dialog on these topics is welcomed – I have not &#8220;arrived&#8221;, so please – help me help the Swift community for the better!

The first in the series is on writing clean functions in Swift. As it turns out, Swift provides some really great mechanisms for defining self-explanatory, clear-purposed functions. We'll start by analyzing the features around naming functions and their parameters, and will conclude on thinking through function decomposition.

##### Function Names

Something that I really enjoyed about Objective-C was that while method names were often long and verbose, they were extremely descriptive. My code often read like a narrative, and I enjoyed that. Some may have hated it, but I found it extremely helpful in facilitating my recollection of a method's intended purpose and the expectations around its argument requirements.

I do my best to think hard about the names that I give my functions, ascribing to them a name that is specific, targeted, and focused on the single &#8220;thing&#8221; that each one does. Nothing in Swift mandates that we leave the verbosity of Objective-C naming conventions behind. In fact, the exact opposite is true!  One example is that swift intentionally provides us with the ability to add external parameter names _so that_ we can be as descriptive as we need to be about the names of our functions.

##### Parameter Names

<a title="Apple Developer Documentation - External Parameter Names" href="https://developer.apple.com/library/prerelease/mac/documentation/Swift/Conceptual/Swift_Programming_Language/Functions.html#//apple_ref/doc/uid/TP40014097-CH10-XID_255" target="_blank">Swift's external parameter names</a>, in my opinion, are wonderful for helping write self-documenting code. They simply help guide my mind back to what a given function does and needs in order to do its job. Anything to help me get back in the zone is worth spending a few extra keystrokes on, especially since XCode's auto-completion assists me so well when calling functions with long signatures.

Apple recommends the following:

> <span style="color: #414141;">Consider using external parameter names whenever the purpose of a function’s arguments would be unclear to someone reading your code for the first time.</span>

I would only add that sometimes, that _someone_ &#8220;reading your code for the first time&#8221; is _you_. Not technically, of course, but think about this: Write some code, leave it, and come back to it some time later. Will it make sense? Will you immediately go, &#8220;Ah, I know what I meant there&#8221;, or will you do like I've often done and say, &#8220;_WHAT_ in the _WORLD_ was I _THINKING_??!?&#8221;.

Spending a few seconds on typing a few more words to save brain power and potentially _more_ seconds/minutes some time later is a worthy investment. And if you work on a team, your teammates will appreciate the extra care you put in to providing as many hints as possible through inventing good names. Good naming includes parameter names. Why _not_ take advantage of the fact that Swift provides you this opportunity to write self-documenting code?

##### Function Decomposition

> In order to make sure our functions are doing &#8220;one thing&#8221;, we need to make sure that the statements within our function are all at the same level of abstraction. -Bob Martin, Clean Code pg. 36

This is just general advice without respect to a specific language. A couple of things to think about:

  1.  Watch out for key words like &#8220;and&#8221; / &#8220;or&#8221; in your function names. These red-flag words often indicate that your function is doing more than one thing and can be further decomposed. Consider:

<pre class="lang:swift decode:true">func washAndDryCar() {
    // Logic to wash and dry a car
}</pre>

A preferred decomposition could look something like this:

<pre class="lang:swift decode:true">func washCar() {
    // Logic to wash a car
}

func dryCar() {
    // Logic to dry a car
}</pre>

  1.  Doing one thing can still involve multiple steps. But if each step takes a few steps of its own, that group of steps can be extracted out into another function. Consider:

<pre class="lang:swift decode:true">func washCar() {
    // Pre-rinse code (example implementation - 4 lines)
    // Soap code (example implementation - 5 lines)
    // Rinse code (exmple implementation - 4 lines)
}</pre>

A preferred decomposition might look something like this:

<pre class="lang:swift decode:true ">func washCar() {
    rinse(durationInSeconds: 25.0)
    soapCar()
    rinse(durationInSeconds: 60.0)
}</pre>

What's neat about the final result of the decomposition is that not only is my <span class="lang:swift decode:true  crayon-inline">washCar</span> function shorter and more readable (from 13 lines to 3 lines), but I got code re-use by making the <span class="lang:swift decode:true  crayon-inline ">rinse</span> function take a duration argument.

Hopefully these thoughts spark a few ideas in you.  Constructive feedback is welcome!  How are _you_ thinking about writing clean code in Swift?

<div class="related-posts">
  <p>
    You might also enjoy
  </p>
  
  <ul>
    <li>
      <a title="Clean Coding in Swift – Type Inference" href="http://www.andrewcbancroft.com/2014/08/12/clean-coding-in-swift-type-inference/" target="_blank">Clean Coding in Swift Type Inference</a>
    </li>
    <li>
      <a title="Expanded Thoughts on Swift’s Type Inference" href="http://www.andrewcbancroft.com/2014/08/20/expanded-thoughts-on-swifts-type-inference/" target="_blank">Expanded Thoughts on Swift's Type Inference</a>
    </li>
    <li>
      <a title="Pick a Delegate… Any Delegate… On Clean View Controllers in Swift" href="http://www.andrewcbancroft.com/2014/08/26/pick-a-delegate-clean-view-controllers-in-swift/" target="_blank">Pick a Delegate… Any Delegate… On Clean View Controllers in Swift</a>
    </li>
  </ul>
</div>