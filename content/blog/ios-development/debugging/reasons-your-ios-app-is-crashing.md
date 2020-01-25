---
title: "4 Reasons Your iOS App Is Crashing"
description: "Wondering why your app is crashing? When it comes down to it, there are four possible reasons..."
author: Andrew
type: blog
draft: false
date: 2020-01-25T00:00:00+00:00
wip: false
showrecent: true
disppsdebugbadge: true
toc: true
tags:
  - Debugging
  - Xcode
  - Crash
introtext: "App crashes can feel so... abrupt, can't they? When you experience a crash, it might calm your nerves to know that there are a finite number of reasons for your app to crash. Four, in fact. Here they are... "
images:
  - /images/social-assets/Twitter - 4 Reasons Your iOS App Is Crashing.png
  - /images/social-assets/Facebook - 4 Reasons Your iOS App Is Crashing.png
---

## CPU cannot execute an instruction
Sometimes we developers don't play fair with the CPU.

Suppose that I wrote some code that ended up telling the CPU to divide by zero.

That's... impossible... for you *and* the CPU.

## iOS is ensuring its own stability
iOS may be enforcing a fundamental requirement or policy for its own stability.

Apple isn't going to let developers wreck the overall user experience of iOS.

Examples:

- Your app takes forever to launch
- Your app is using too much memory

iOS will opt for killing your app to protect the user’s overall iOS experience.

## Swift runtime is preventing failure
There are certain protections within the Swift runtime that may cause your app to crash.

For example, if you’ve got an array with 5 elements inside (indexed from 0 to 4), and you attempt to access the 6th one by referencing index 5, the Swift runtime will kill your app when it sees this kind of instruction.

Force-unwrapping optionals using the `!` operator is another classic app crasher.

## Another developer is preventing failure
Finally, it may be that the developer of a framework or function you’re using is preventing you from misusing his/her API.

Some developers will use `assert` in a function to test that a condition is met before their function proceeds.

Guard statements mixed with a `fatalError` in the Else block could also be a failure protection strategy.

In both cases your app would crash when the assert or guard conditions are not met.

While it would be nicer to see an `Error` instead of a crash, knowing that these are posssible "under the hood" reasons for the crash you're seeing can be helpful.

## Summing Up
It's true: a crash can feel like it comes out of nowhere. Scoping the problem into four "big picture" reasons for a crash has helped me think rationally and probabilistically about what's going on.

If you're getting your bearings when it comes to debugging iOS apps, I'd love to impact your learning experience. Perhaps my [iOS Debugging Fudamentals](http://bit.ly/ios-debugging-fundamentals) course on Pluralsight will guide you to more efficient debugging experiences!

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fas fa-video"></i> <a href="http://bit.ly/ios-debugging-fundamentals" target="_blank">iOS Debugging Fundamentals</a><a href="http://bit.ly/ios-debugging-fundamentals" target="_blank"><br /> <img src="/images/social-assets/ios-debugging-fundamentals-title.png" alt="iOS Debugging Fundamentals" width="1024" height="576" class="alignnone size-large wp-image-13737"/></a>
    </li>
  </ul>
</div>