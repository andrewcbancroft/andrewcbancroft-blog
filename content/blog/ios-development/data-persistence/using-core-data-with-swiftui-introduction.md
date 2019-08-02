---
title: "Using Core Data With SwiftUI - An Introduction"
description: "Example of how to use Core Data with SwiftUI."
author: Andrew
type: blog
date: 2019-07-31T04:40:54+00:00
categories:
  - Core Data
  - SwiftUI
wip: false
showrecent: true
images:
  - images/social-assets/Twitter - Using Core Data With SwiftUI.png
  - images/social-assets/Facebook - Using Core Data With SwiftUI.png
disppsbadge: true
toc: true
---

How does Apple intend for us to use Core Data with SwiftUI?

They gave us a path forward with the most recent beta release of iOS 13 (Beta 5 at the time of this writing)!

<a name="resources" class="jump-target"></a>
<div class="resources">
<div class="resources-header">
Resources
</div>
<ul class="resources-content">
<li>
<i class="fas fa-file-code"></i> <a href="https://github.com/andrewcbancroft/BlogIdeaList-SwiftUI"> Blog Idea List SwiftUI Example Xcode Project</a>
</li>
<li>
<i class="fas fa-link"></i> <a href="https://developer.apple.com/videos/play/wwdc2019/226/" rel="nofollow">Data Flow Through SwiftUI - WWDC 2019 Session 226</a>
</li>
</ul>
</div>

## First Things First

* To work effectively with Core Data in SwiftUI, the [Data Flow Through SwiftUI](https://developer.apple.com/videos/play/wwdc2019/226/) WWDC session is a huge help.

* With this talk under your belt, you'll have at least been introduced to key words like `@State`, `@Binding`, `@ObservableObject` (which replaces `@BindableObject` as of Beta 5), and `@Environment`.

## On the Right Path
Even prior to Beta 5, the "right path" for using Core Data with SwiftUI seemed to be through the `@Environment`.

In the release notes for iOS Beta 5, Apple seems to be leading us there:

> * `NSManagedObject` now conforms to `ObservableObject`. 

> * The new `@FetchRequest` property wrapper can drive views from the results of a fetch request

> * `managedObjectContext` is now **included in the environment**.

With these three pieces in place, Apple has given us out-of-the-box support for using Core Data with SwiftUI.

So...

## How Do You Get Started?

I decided to create a basic, single-view app that can

* Persist a list of `BlogIdea`s to a Core Data persistent store
* Use the new `@FetchRequest` property wrapper to fetch `BlogIdea`s
* Use the `@Environment`'s `managedObjectContext` to create, update, and delete `BlogIdea`s

Grab the project [over at GitHub](https://github.com/andrewcbancroft/BlogIdeaList-SwiftUI) and explore!

The sample project that includes a single Core Data Entity named `BlogIdea`:

![Blog Idea Entity](/blog/ios-development/data-persistence/using-core-data-with-swiftui-introduction/blog-idea-entity.png)

I kept as much out-of-the-box stuff as I could.

## How Does It Work?
Throughout the project, you'll notice emoji symbols to help draw your eye to the Core Data pieces.

❇️ Alerts you to Core Data pieces

ℹ️ Alerts you to general info about what my brain was thinking when I wrote the code

More on improving the architecture and features soon!