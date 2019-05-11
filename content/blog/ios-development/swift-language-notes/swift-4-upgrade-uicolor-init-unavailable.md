---
title: 'Swift 4 Upgrade Error: ‘init(colorLiteralRed:green:blue:alpha:)’ is unavailable'
author: Andrew
type: blog
date: 2018-01-24T12:35:04+00:00
aliases:
  - /2018/01/24/swift-4-upgrade-uicolor-init-unavailable/
dsq_thread_id:
  - "6435046260"
categories:
  - Swift
tags:
  - Swift 4 Upgrade
  - UIColor

---
I upgraded a project to Swift 4 today and hit a compiler error:

> &#8216;init(colorLiteralRed:green:blue:alpha:)' is unavailable: This initializer is only meant to be used by color literals. 

The fix is pretty simple: **Don't use that initializer**! (thank you, Captain Obvious!)

The correct initializer to use for specifying a red, green, blue, and alpha to get a `UIColor` instance in Swift 4 is:

`UIColor(red:green:blue:alpha:)`

So essentially, just replace `colorLiteralRed:`, and replace it with just `red:`, and the compiler error will go away. Here's an example of how to call it:

`let color = UIColor(red: 204/255, green: 204/255, blue: 204/255, alpha: 1.0)`