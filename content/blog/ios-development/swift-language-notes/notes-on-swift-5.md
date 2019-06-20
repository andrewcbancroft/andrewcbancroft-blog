---
title: "What is an ABI and Why is Swift ABI Stability a Big Deal?"
description: "Explains the concept of an ABI and why Swift 5.0 and ABI Stability are great!"
author: Andrew
type: blog
date: 2019-06-20T04:40:54+00:00
categories:
  - Swift Language
  - ABI
wip: true
showrecent: false
sol: false
images:
toc: true
disppsbadge: false
---

## What is an ABI?

"ABI" stands for "Application Binary Interface".

The word "interface" means the same as it does in other places where you hear the word.

It's the point where two things can interact.

A **user** interface is the point where humans and apps can interact.

An **Application Programming** Interface is the point where code interacts with other code.  And since the code doesn't write itself (yet!), it's the point where developers like you and I stitch together pieces of code so that they can interact without us.

So what's an **Application Binary** Interface?

It's the point where *compiled code* interacts with *other compiled code* while your app is running.

ABI's are one level deeper than **AP**I's.  They're *two* levels deeper than **U**I's.

## Why is ABI Stability a Big Deal?

Imagine writing some Swift code.  You want to share it across multiple apps, so you put it in a framework.  You compile it with the Swift 4.0 compiler.

Now imagine Apple announces Swift 4.1.  Sweet!  You decide to build a new app and compile it with the Swift 4.1 compiler.

Ah, but your apps needs some of that "shared feature" code from your framework.

Will it work?  I'll give you one guess. (the answer's "nope")

Prior to "ABI stability" being a feature of Swift, the only guarantee we had that two pieces of compiled code could talk to one another is if the two pieces of code were compiled with the **same compiler**.

A framework could be compiled with the Swift 4.0 compiler. *You* can build an app with the Swift 4.1 compiler.  **BUT. The two cannot communicate.**  Either the framework or your app needed to be **re**compiled using the same version of the compiler for it to work.

Now, "ABI stability" *is* a feature of Swift Proper.  A framework could be compiled with the Swift 5.0 compiler. *You* can build an app with the Swift 5.1 compiler.  **The two can communicate!**