---
title: "What Is Debugging (And What Isn't)?"
description: "All kinds of problems can happen when you’re building an iOS app. But are all problems debugging problems?  Which ones are and which ones aren't?"
author: Andrew
type: blog
draft: false
date: 2019-12-30T03:11:48+00:00
wip: false
showrecent: false
disppsdebugbadge: true
toc: true
tags:
  - Debugging
  - Xcode
images:
  - /images/social-assets/Twitter - What Is Debugging (And What Isn't)_.png
  - /images/social-assets/Facebook - What Is Debugging (And What Isn't)_.png
---

Does it ever help you to narrow the scope of overwhelming topics like "debugging"?

It helps *me*.

When you're new to something like iOS development, you may find yourself stepping into a world of problems.  Everyone around you is always fixing something it seems!

All kinds of problems can happen when you’re building an iOS app.

But are all problems... *debugging* problems?

TLDR; Answer: Not necessarily. 

My brain appreciates focused definitions.  It lightens the the mental load a bit to "bucket" problems into categories.

Which problems don't fit into the "debugging problems" category?  Which ones do?

## Non-Debugging Problems
This list of common problem areas definitely take up a developer's time. But rather than lump them all in with "debugging", I prefer to treat them as problem sets of their own.

### Build Problems
If your app won’t build, that’s definitely a must-solve problem.  However, buildtime errors are not debugging problems.

### Learning Curves
When you’re learning a new framework or trying something you’ve never done before, it can take some time to clear the hurdle of the Swift complier as you're coding.  Even still, this isn't debugging.

### Xcode Warnings
If Xcode is issuing warnings, you should probably take heed and resolve them before shipping to the App Store.  But I still wouldn't call this debugging.

### Design Dilemmas
Design can get controversial, but overcoming these often-subjective dilemmas is not debugging.

### User Experience Debates
As with design dilemmas, user experience debates are also trouble spots for many developers.  The debates themselves, however, are not debugging.

### Performance Optimization
Sometimes, you get your app built and running, but you’re struggling with performance-related issues.  Even though it works (in a technical sense), it could be faster, more responsive, use less memory, etc.

Optimization, however, is big enough to be in a category of its own for me.

## Debugging Problems
So... what *is* debugging then?

This is how I define it in [iOS Debugging Fundamentals](http://bit.ly/ios-debugging-fundamentals):

Debugging is...

> **Investigating** and **fixing flaws** that you and your users experience **while your app is running**.

> **Thinking about** and **correcting defects** that happen at **runtime**.

Debugging is a two-part problem solving exercise: It involves thinking skills and fixing skills.  Debugging involves reasoning about the probable causes of flaws and defects in your apps. When you debug, you spend time trying to figure out the root cause of an issue you're noticing. 

Once you find the source of the problem, your job shifts to applying your programming skills and your knowledge of the app's purpose (domain knowledge) to fix the problem.

But just as I started off this discussion by asking, "Are all problems... *debugging* problems?", I'm able to answer "no" by emphasizing *when* the problems occur, namely, at runtime.

That's why build problems, learnig curves, Xcode warnings, design dilemmas, and UX debates aren't considered debugging activites (in my view).

I grant that performance problems are typically noticed at runtime, *but*, I believe this to be a separate activity, primarily because the app *works* (even if it could work *better*).

## Summing Up
Narrowing the scope of debugging to reasoning about, inspecting, and repairing runtime problems lifts some cognitive weight for me.  

It allows me to enjoy programming a *lot* more when I know that I'm not actually spending 99% of my time "debugging". 😂

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