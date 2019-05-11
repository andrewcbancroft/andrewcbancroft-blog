---
title: Swift Unit Testing – Verifying Method Calls
author: Andrew
type: blog
date: 2014-12-22T13:09:28+00:00
aliases:
  - /2014/12/22/swift-unit-testing-verifying-method-calls/
dsq_thread_id:
  - "3348967866"
categories:
  - Featured
  - iOS / Mac
  - Swift
tags:
  - Swift
  - Unit Testing

---
In this unit testing screencast for Swift developers, we explore how to use Test Driven Development to verify method calls.

### Getting Started Guide

If you&#8217;re new to unit testing or are trying to get set up with unit testing in a Swift project, you might [check out my getting started guide][1] before jumping into the screencast.

### Screencast



<span class="text-center"><a href="http://youtu.be/hC2Dni9SAWY" target="_blank">Large / Full-Screen Viewing</a></span>

### GitHub Example

[GitHub repo][2] of the example developed in the screencast.

### Screencast Transcript

#### [0:01]

Hi, I&#8217;m Andrew from andrewcbancroft.com, and I&#8217;m bringing you a test driven development example for iOS in Swift.

The goal of this video is to teach you how to write a unit test to verify that a method was called.

#### [0:21]

I&#8217;ll begin in XCode 6.1.1 with a side-by-side view of my TestCase class, and my primary View Controller class. This is what XCode generated for me when I chose to create a new Single View Application.

#### [0:38]

Imagine a scenario with me: Suppose that as part of your application&#8217;s requirements, you mush show an Alert View after your primary view loads. How would we go about using Test Driven Development to implement this &#8220;feature&#8221;?

#### [0:53]

Well, we&#8217;d write a test, of course &#8211; I&#8217;ll name it something appropriate like &#8220;testUIAlertViewShowsAfterViewLoads&#8221;

#### [1:04]

Next, I need to create an instance of my ViewController class so that I can test it.  
But immediately, I run into trouble. It seems that my TestCase class can&#8217;t &#8220;see&#8221; my View Controller class.

#### [1:17]

Thankfully, it&#8217;s a simple fix: Simply add the View Controller class to your Test target.

#### [1:26]

With everything compiling now, we can move to the next line of test code.

#### [1:32]

First off, in order to test my View Controller&#8217;s Alert View functionality, the Alert View has got to be visible to my test. The easiest thing for me to do at this point is to assume that there will be a property on my View Controller that I can set. This allows me to perform a kind of dependency injection known as &#8220;setter injection&#8221;. All it really means is that the property is dual-purpose. When the app runs on my iPhone, it&#8217;ll use a real UIAlertView. But when I run it in my tests, I can plug in a UIAlertView that I control the behavior of, so that I can verify what I need to in my tests.

#### [2:16]

The ability to swap in a kind of Alert View that I control really is the &#8220;magic sauce&#8221; to this whole test-driven operation. In order to know whether or not a UI element was &#8220;shown&#8221; in a unit test without actually showing something on the screen in a simulator or device, I need to invent something known as a test-double. A fake object, if you will.

#### [2:44]

My Fake Alert View will have some special capabilities that allow me to know whether the &#8220;show()&#8221; method was called on it. At the same time, it needs to be able to be substituted in my View Controller for a real UIAlertView.

#### [3:00]

Since Swift supports object-oriented design, we have inheritance at our disposal here.

#### [3:07]

I&#8217;ll create a nested class inside my test function called FakeAlertView. Notice that it&#8217;s a subclass of UIAlertView. What&#8217;s great about this is that it meets both of my testing requirements: I can control it&#8217;s behavior, and it can be substituted anywhere a UIAlertView is needed.

#### [3:28]

I&#8217;ll finish fleshing out this fake object in a minute. Now that XCode isn&#8217;t complaining about not knowing what a FakeAlertView is, I&#8217;ll turn my attention to a new compiler complaint: I don&#8217;t have an alertView property on my View Controller yet, so I&#8217;ll add one.

#### [3:50]

There&#8217;s just a little more setup that&#8217;s needed in order to be able to verify that the show method was called. Since show() doesn&#8217;t return anything, we need some way to know that its logic was executed. I&#8217;ll do two things to expose this:

#### [4:06]

  1. I&#8217;ll have a boolean property called showWasCalled on my FakeAlertView that is initially set to false.
  2. I&#8217;ll override the show() method in this fake UIAlertView subclass. Inside the method body, I&#8217;ll reassign the value of showWasCalled to true. That will be enough for me to use inside an XCTAssert, which is coming up.

#### [4:35]

We&#8217;re nearing the finish line here. All that&#8217;s left is to call my View Controller&#8217;s viewDidLoad method, and write my assertion.

#### [4:44]

The only thing I&#8217;d tell you to make note of is that we need to cast the View Controller&#8217;s UIAlertView instance to a FakeAlertView so that we can access the showWasCalled property.

#### [4:57]

Running the test at this point should produce a failing test, which is exactly what we want (because there&#8217;s no code that calls the alertView&#8217;s show() method in viewDidLoad()).

#### [5:08]

The last step to this adventure is to write the production code to pass the test. In viewDidLoad, I call my alertView&#8217;s show method and re-run the tests.

#### [5:19]

And we&#8217;re green! Which means we&#8217;ve managed to successfully verify that a method was called.

#### [5:27]

Thanks for watching &#8211; I have other resources related to Swift and iOS development at andrewcbancroft.com.

 [1]: http://www.andrewcbancroft.com/2014/12/29/getting-started-unit-testing-swift/
 [2]: https://github.com/andrewcbancroft/SwiftTDDVerifyMethodCalls