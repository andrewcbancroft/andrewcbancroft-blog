---
title: "Why is Swift ABI Stability a Big Deal?"
description: "Explains why Swift 5.0 and ABI Stability are great!"
author: Andrew
type: blog
date: 2019-06-21T04:40:54+00:00
categories:
  - Swift Language
  - ABI
wip: true
showrecent: false
sol: false
images:
toc: false
disppsdatabadge: false
---

Imagine writing some Swift code.  You want to share it across multiple apps, so you build a framework.  You compile it with the Swift 4.0 compiler.

Now imagine Apple announces Swift 4.1.  Sweet!  You decide to build a new app and compile it with the Swift 4.1 compiler.

Ah, but your apps needs some of that "shared feature" code from your framework.

Will it work?  I'll give you one guess. (the answer's "nope")

Prior to "ABI stability" being a feature of Swift, the only guarantee we had that two pieces of compiled code could talk to one another is if the two pieces of code were compiled with the **same compiler**.

A framework could be compiled with the Swift 4.0 compiler. *You* can build an app with the Swift 4.1 compiler.  **BUT. The two cannot communicate.**  Either the framework or your app needed to be **re**compiled using the same version of the compiler for it to work.

Now, "ABI stability" *is* a feature of Swift Proper.  A framework could be compiled with the Swift 5.0 compiler. *You* can build an app with the Swift 5.1 compiler.  **The two can communicate!**