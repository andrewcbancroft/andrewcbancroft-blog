---
title: "Taking First Steps With SwiftUI"
description: "A listing of learnings from the Apple SwiftUI Creating and Combining Views tutorial"
author: Andrew
type: blog
date: 2019-06-03T03:11:48+00:00
wip: true
tags:
  - SwiftUI
---

## Enabling SwiftUI
Opting in to using SwiftUI is as easy as creating a new project with Xcode 11 and clicking the "Use SwiftUI" checkbox.

![Check Use SwiftUI](enable-swiftui.png)

## Starting Point
Xcode will give you two structs to start with:

* One that describes the `View`'s content and layout
* One that declares a preview for that `View`

## Seeing What You're Doing
Xcode gives you a canvas so that you can visually see what your SwiftUI code is doing.

Open it by clicking `Editor > Editor and Canvas`

## Wait, Where's the Canvas?
If you don't have the option to view the canvas in Xcode, it's because this feature requires you to be running macOS Catalina.

## Syncing Changes Between SwiftUI Code and Xcode's Canvas
Changing and saving your SwiftUI view code automatically updates the canvas preview.

Changing the view using Xcode's view inspector automatically updates your SwiftUI code!

I love this quote:

> Your code is always the source of truth for the view. When you use the inspector to change or remove a modifier, Xcode updates your code immediately to match.

Tutorial: [https://developer.apple.com/tutorials/swiftui/creating-and-combining-views](https://developer.apple.com/tutorials/swiftui/creating-and-combining-views)