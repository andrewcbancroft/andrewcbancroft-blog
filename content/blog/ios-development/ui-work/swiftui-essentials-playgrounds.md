---
title: "Apple's SwiftUI Essentials Tutorial Series as Playgrounds"
description: "Provides Swift Playgrounds for the Essentials series of Apple's SwiftUI tutorials."
author: Andrew
type: blog
date: 2019-07-06T03:11:48+00:00
wip: false
showrecent: true
toc: true
tags:
  - SwiftUI
  - Playground
images:
---

<a name="resources" class="jump-target"></a>
<div class="resources">
<div class="resources-header">
Resources
</div>
<ul class="resources-content">
<li>
<i class="fas fa-file-code"></i> <a href="https://github.com/andrewcbancroft/swiftui-essentials-playgrounds">SwiftUI Essentials Tutorials as Playgrounds</a>
</li>
<li>
<i class="fas fa-link"></i> <a href="https://developer.apple.com/tutorials/swiftui" rel="nofollow">Apple's SwiftUI tutorials</a>
</li>
</ul>
</div>

## Why Playgrounds?
I've been making my way through <a href="https://developer.apple.com/tutorials/swiftui" rel="nofollow">Apple's SwiftUI tutorials</a>.

If you're anything like me, you learn by tinkering with things. Change the modifiers, reposition `Text`, use a different `Image`, and see what happens.

BUT.

Without macOS Catalina, iterating quickly on these tinker sessions involves starting and stopping a simulator to see the changes.

#annoying, right?

*However*... since you can [use SwiftUI in a Playground](https://www.andrewcbancroft.com/blog/ios-development/ui-work/using-swiftui-in-playground/), I decided to take my learning experience out of the sample Xcode projects that Apple provides, and turn them into Playgrounds.

I've [pushed them to GitHub](https://github.com/andrewcbancroft/swiftui-essentials-playgrounds), *just in case* they'd be useful to you.

## Repository Structure
Each tutorial in the Essentials series has its own completed Playground.

[Download or clone](https://www.andrewcbancroft.com/blog/ios-development/ui-work/using-swiftui-in-playground/) the repository to experiment with the SwiftUI tutorials individually in a Playground environment.

Run the playground, and [show the live preview](https://www.andrewcbancroft.com/blog/ios-development/xcode/showing-live-view-in-swift-playground/) to see it in action.

![Run and Preview](run-preview.gif)

### Creating and Combining Views
All resources required for generating the SwiftUI preview have been added under the Resources folder.

![Creating and Combining Views](creating-combining-views.png)

### Building Lists and Navigation
All resources required for generating the SwiftUI preview have been added under the Resources folder.

Helper code for loading the JSON data file and generating images in the UI at different sizes has been placed in the `Data Helpers.swift` file.

`Model Objects.swift` contains the code for the `Landmark` and `Coordinates` types.

![Building Lists and Navigation](building-lists-and-navigation.gif)

### Handling User Input
All resources required for generating the SwiftUI preview have been added under the Resources folder.

Helper code for loading the JSON data file **including the new isFavorite property**, and generating images in the UI at different sizes has been placed in the `Data Helpers.swift` file.

`Model Objects.swift` contains the code for the `Landmark` and `Coordinates` types.  It also adds the `UserData` bindable object.

![Handling User Input](handling-user-input.gif)
