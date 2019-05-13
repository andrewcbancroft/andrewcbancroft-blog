---
title: Why is it called a “Closure” anyway? A Swift Conceptual Look.
author: Andrew
type: blog
date: 2017-06-06T04:00:41+00:00
aliases:
  - /2017/06/05/why-is-it-called-a-closure-anyway-a-swift-conceptual-look/
featured_image: /wp-content/uploads/2017/06/closure-cork-feature.jpg
dsq_thread_id:
  - "5884094444"
categories:
  - Swift
tags:
  - Closures
  - Swift

---
<a name="whats-in-a-name" class="jump-target"></a>

# What's in a name?

If a programming language comes with a named feature, you can be pretty sure it was named that way for a reason. It's a safe bet that the language designers were _purposeful_ in their naming, so if you can figure out that essential "Why'd they name it that?&#8221; question, you might be that much closer to understanding the feature or concept.


<a name="why-closure" class="jump-target"></a>

# Why "closure&#8221;?

Now the challenge: Actually figuring out the answer to that "Why?&#8221; question.

Swift is being developed in the open, and often times that gives curious minds insight into things like naming decisions. But closures in Swift have been around for longer than Swift has been open sourced.

That being the case, I really couldn't find much in terms of the conversation around why closures are named "closures&#8221;.

Closures exist in other languages, so maybe Swift just _borrowed_ the name. But that doesn't help us answer the _bottom line_ reason for naming closures "closures&#8221;.

<a name="unpacking" class="jump-target"></a>

## Unpacking "closure&#8221; (thanks, thesaurus.com!)

So&#8230; I set out on a word adventure to help shed some light on what meaning is to be conveyed by the term "closure&#8221;.

It's one thing to know that "closures are self-contained blocks of functionality that can be passed around and used in your code.&#8221; ([Apple Developer Docs][1]), but seriously &#8212; why not just call them "functions&#8221;??

Let's unpack the word if we can. I put "closure&#8221; into thesaurus.com, and among the synonyms that I think best clarify the term "closure&#8221; in programming languages are these:

  * Plug
  * Seal
  * Cork

In this sense, "closure&#8221; seems to convey the idea of keeping something in&#8230; _enclosing_ it.

Okay, so what is a closure enclosing? **Great question!**

Short answer? **Variables**.

Inevitably, if you peruse the Internet for what closures are, you'll come across similar definitions to Apple's, quoted above. Often, intermingled in the various definitions I've found, are phrases like "capturing **variables**&#8221; or "closing over **variables**".

These phrases always seemed to muddy the water (for me, anyways). It wasn't entirely clear what "capturing variables&#8221; or "closing over variables&#8221; meant. _Until_ I saw the synonyms, "plug&#8221;, "seal&#8221;, "cork&#8221;.

Then it clicked&#8230;

<a name="example" class="jump-target"></a>

## An example for your imagination

I want you to take a function in Swift, and I want you to imagine the function as an empty swimming pool. Got it in your mind's eye? Swimming pool. Empty (for now).

It's runtime, and your Swift program is happily executing along. Then there's a moment in your program where your function gets called. It begins executing, and suddenly, water comes rushing in filling the pool. A dozen diving coins get tossed into the water as well!

The coins represent the local variables and constants that your function creates to do its work.

Your function executes all the way to the `return` keyword, and at the precise moment that your function returns, the drain kicks in. Within _milliseconds_ and with _tremendous_ force, all the water is sucked out of the pool.

**What do you think will happen to all the coins in the pool?**

For this example, let's just say the answer is, "they'll go down the drain&#8221;. That would correlate pretty well with what normally happens to variables and constants that had been declared within your function when it returns.

Any variables and constants that are created inside a function are purged from memory whenever the function returns&#8230; down the drain, if you will.

### Unleeeees&#8230;

What if, at some point while there's still water in the pool, you were able to dive in, grab a few of the coins, and bottle them up?

What if you could stick them in a container and **plug** it with a **cork** or some other kind of **seal**?

If you could do that, the coins would _survive_ the torrential drainage of the pool when the plug is pulled (i.e. the function returns). And that's what I want you to take away from the example.

A closure acts as a mechanism for diving into the pool, scooping up the coins (i.e. variables and constants) it needs, and **sealing** itself, such that whenever its parent function (the pool) drains, it and the coins inside **survive**.

<a name="in-practice" class="jump-target"></a>

# Closures in practice

When you hear that closures are "self-contained blocks of functionality that can be passed around and used in your code.&#8221;, you may not realize that they can go grab variables from their environment, package them up, and seal themselves tight, thus safeguarding those variables.

As it turns out, every closure you create has this capability built in.

Not all closures _need_ to go out and capture variables, but all closures in Swift _can_ do so if it's relevant.

And _that_ is what makes closures "closures&#8221;.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/04/26/what-in-the-world-is-an-escaping-closure-in-swift/" title="What in the World is an “Escaping Closure” in Swift?">What in the World is an “Escaping Closure” in Swift?</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/05/11/why-do-we-need-to-annotate-escaping-closures-in-swift/" title="Why Do We Need to Annotate Escaping Closures in Swift?">Why Do We Need to Annotate Escaping Closures in Swift?</a>
    </li></div> 
    
    <p>
      <a name="share" class="jump-target"></a>
    </p>

 [1]: https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Closures.html