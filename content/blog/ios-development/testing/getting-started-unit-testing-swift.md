---
title: Getting Started with Unit Testing in Swift
author: Andrew
type: blog
date: 2014-12-29T12:00:50+00:00
aliases:
  - /2014/12/29/getting-started-unit-testing-swift/
dsq_thread_id:
  - "3369835519"
categories:
  - iOS / Mac
  - Swift
tags:
  - Swift
  - Unit Testing

---
Getting set up to write unit tests in Swift, while not _difficult_, isn't exactly _intuitive_. I've written [several posts and gathered a few resources on unit testing in Swift][1], but I haven't yet published a "getting started&#8221; guide until now.

Where does one get started with unit testing in Swift when they've never gotten started before? Here are 5 steps to help you successfully begin unit testing in Swift:

### 1 – Create your project

The obvious first step. If you don't already have a project going, create a new one to organize the code for your app idea. Xcode 6 will automatically generate two "targets&#8221; for you. One will be your app's main module and contains all the code which, when compiled, is meant to be run in the iOS simulator / on an iOS device.

The other will be your test target, which, as the name implies, is where you write your unit test code.

It's important to note that there are _two compilation targets_ that you'll be working with as you unit test. Source code that's part of one compilation target isn't part of the other by default. This is important to at least _know_ as we move forward in this walkthrough.

### 2 – Framework considerations: toggle "Defines Module&#8221; in your build settings

This step becomes especially critical if you're using or plan to use a [unit testing framework like Quick][2]. It's not required to use something like Quick, but it can enhance your testing experience if you prefer something other than the out-of-the-box `XCTestCase` setup.

When you’re working with frameworks, [Apple recommends][3] that you make sure the "Defines Module&#8221; build setting, found under Packaging, is set to Yes.

If you are relying on, or _could_ be relying on "non-standard&#8221; .framework files for your app, make sure you toggle this flag in your Xcode build settings:  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_Swift_xcodeproj-1024x679.png" alt="Build Settings - Defines Module" width="730" height="484" class="alignnone size-large wp-image-10371" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_Swift_xcodeproj-1024x679.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_Swift_xcodeproj-300x199.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_Swift_xcodeproj-1200x796.png 1200w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_Swift_xcodeproj.png 1387w" sizes="(max-width: 730px) 100vw, 730px" />][4]

### 3 – Import your main project (module) into your test file(s)

In your test target, at the top of each of your .swift files that contain your XCTestCase classes, write an import statement to bring in your main project's module. In normal scenarios, your app's module is named the same as your Xcode project file.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_SwiftTests_swift-1024x671.png" alt="Import Module for Testing" width="730" height="478" class="alignnone size-large wp-image-10381" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_SwiftTests_swift-1024x671.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_SwiftTests_swift-300x196.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_SwiftTests_swift-1200x786.png 1200w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_SwiftTests_swift.png 1393w" sizes="(max-width: 730px) 100vw, 730px" />][5]

<a id="public-testable"></a>

### 4 – Access control: Public == Testable

Any classes/structs/enums/methods that you need to use in your tests must have a `public` access control modifier. `Internal` (default) and `private` Types and functions can't be "seen&#8221; by your unit tests, so you need to go the `public` route if you want to test those things.

Previously I'd written on [Swift access control and its implications for unit testing][6]. There, I proposed simply adding your main project's .swift source files to your test target, but it turns out that this can lead to some [really obscure issues][7]. An enlightening [Twitter conversation][8] also shed some light on the subject, and pointed to the solution of testing only publicly accessible _behavior_ that your Types expose, rather than trying to test internal implementation. That probably deserves a blog entry of its own, but for now, I'll leave it to say that I'd recommend _not_ adding your .swift source files to your test target, but rather to adjust the access control modifiers of the things you want to test to `public`.

### 5 – Write tests!

With your main project imported into a test file, and your Types and functions declared with appropriate `public` accessibility, you're all set to begin writing tests in Swift!

### Summary

We've gone from 0 to ready-to-test in this getting started guide to unit testing in Swift. From here, you may be interested in pursuing other topics related to unit testing in Swift. [Check out my ever-growing unit testing resource list for more information][1]!

 [1]: http://www.andrewcbancroft.com/2014/12/19/swift-unit-testing-resources/
 [2]: https://github.com/Quick/Quick
 [3]: https://developer.apple.com/library/ios/documentation/Swift/Conceptual/BuildingCocoaApps/MixandMatch.html#//apple_ref/doc/uid/TP40014216-CH10-XID_88
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_Swift_xcodeproj.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2014/12/GetStartedWithUnitTesting_SwiftTests_swift.png
 [6]: http://www.andrewcbancroft.com/2014/07/22/swift-access-control-implications-for-unit-testing/
 [7]: https://github.com/Quick/Quick/issues/91
 [8]: https://twitter.com/modocache/status/549042409838219264