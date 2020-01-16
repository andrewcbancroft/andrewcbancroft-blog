---
title: "4 Things You Should Never Do When Debugging iOS Apps"
description: "Don't make debugging harder than it needs to be. Here are four things you should avoid doing when debugging iOS Apps."
author: Andrew
type: blog
draft: false
date: 2020-01-16T00:00:00+00:00
wip: false
showrecent: true
disppsdebugbadge: true
toc: true
tags:
  - Debugging
  - Xcode
introtext: "iOS developers spend a significant amount of time debugging. Don't make debugging harder than it needs to be. Here are four things you should avoid doing when debugging iOS Apps."
images:
  - /images/social-assets/Twitter - 4 Things You Should Never Do When Debugging iOS Apps.png
  - /images/social-assets/Facebook - 4 Things You Should Never Do When Debugging iOS Apps.png
---

## Never change code without reproducing the problem first
Reproducing the problem is a critical first step in debugging.

Before you start scouring your code... 
Before you start setting breakpoints... 
Before you start using tools or changing things...

See if you can **cause the bug to happen again**.

The goal of this exercise is to **confirm that the problem is consistent**. Reproducing the problem helps you **clarify the conditions that are present when the bug happens.**

Do your best to clearly state what’s going on -- I even write it down sometimes to document the problem and make sure I've got it pinned down.

## Never bug hunt before hypothesizing
Having a plan sets you up to avoid haphazardly hoping to find the source of the problem you're experiencing.

Before you set off to track down what's going on, make an educated guess about what you *think* might be going on. 

Jot down a hypothesis or two (or three) and rank them in order of which feels more likely, based on your past debugging experiences.

Pair your hypothesis with possible Xcode tools to use and spots to look within your codebase to gather evidence to support or discredit the hypothesis.

*Then*, once you have a plan, head out into the code on a mission to investigate your hypothesis.

Take appropriate action based on your findings.

## Never make code changes without a new branch
When you're taking action though, make sure you've created a new code branch **first**.

Often, your investigation of a best-guess hypothesis about a bug's root cause means you need to change something about your app.

Without a branch, you won't be able to roll back to the original state of your code.

Set your self up to quickly iterate on evidence gathering.  

Make a branch -> attempt a fix -> Did it work? Great! Does the bug persist? Rollback! (rinse and repeat)

## Never change more than one "thing" at a time
Imagine experiencing a bug.

Now you go in and change a line of code here, toggle an Xcode project setting there, refactor a function, and then re-run your app.

The bug is fixed!  Buuut... which change from your list of changes was the actual fix?

Never change more than one thing at a time. 

Doing so not only makes the actual fix ambiguous, but could also inadvertently cause *different* bugs that you didn't anticipate.

Whatever you do, only change one thing at a time when you're attempting to fix a big.

Now...what does "one thing" mean?

"One thing" means "one fix strategy".

In order to attempt some bug fixes, you may have to change 2 or 3 lines of code.  That's okay.  You're changing them as a "unit", of sorts, as part of a single fix strategy.

Trying more than one fix strategy at a time is what I'm cautioning against.


## Summing Up
Debugging is challenging enough as it is. Don't make debugging harder than it needs to be. Avoid these four things and you should be a much happier developer.

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