---
title: "What is an ABI"
description: "Explains the concept of an ABI."
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
toc: false
dispiosgettingstartedbadge: true

---

"ABI" stands for "**A**pplication **B**inary **I**nterface".

The word "interface" means the same as it does in other places where you hear the word.  

If a *human* wants to interact with a computer, s/he needs a way to engage with it.  A **user** interface is the point where humans and computers communicate with one another.

If a *computer* wants to interact with a computer, it needs a way to engage as well.  An API...an **Application Programming** Interface is the point where computers interact with other computers.  It's also the point where a computer communicates with itself!  Computers are just instruction performers.  Developers plan out and write sets of instructions for computers to perform with code. Since the code doesn't write itself (yet!), APIs are *also* the point where developers like you and I stitch together chunks of code.  Every class, struct, property, function...all of them are some form of API.

So what's an **Application Binary** Interface?

If you stack all of these interfaces, one on top of the other, a **U**I would be on the top.  Underneath the UI are APIs.  And then... ABIs.

ABI's are one level deeper than **AP**Is. They're one step down from code that developers write.

Developers write instructions for computers to perform in a language. Say...Swift!

Computers perform instructions, but iPhones and Macs don't "speak" Swift.  They "speak" **binary**.

For a computer to *understand*, much less *perform* instructions that developers have written in Swift, those instructions have to be translated and packaged. Translating Swift code and packaging it up is called *compiling*.

When you launch an app, iOS begins to perform the instructions that a developer compiled.  A message is received by one piece of compiled code and performed by another piece of compiled code.  The result is sent over to another piece of compiled code.  And so on and so on...

If *compiled code* wants to interact with other *compiled code*, guess what?  It needs a way to do that.  It needs an interface.  A **binary** interface.

An ABI is the point where *compiled code* interacts with *other compiled code* while an app is running.