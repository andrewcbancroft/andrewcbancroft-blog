---
title: Swift Unit Testing Resources
author: Andrew
type: blog
date: 2014-12-19T12:00:33+00:00
url: /2014/12/19/swift-unit-testing-resources/
dsq_thread_id:
  - "3339968447"
categories:
  - Featured
  - iOS / Mac
  - Swift
tags:
  - Swift
  - Unit Testing

---
As I've researched Test Driven Development practices in general, and for iOS / Mac applications, I've been helped by several sources. I've also discovered a few things the hard way, so I'm combining and maintaining this list of resources to help point you in some helpful directions as you adventure in unit testing your iOS apps.


<a name="pluralsight" class="jump-target"></a>

### Pluralsight Courses

  * [Play by Play: TDD with Brad Wilson][1] – Awesome, awesome course. I learned some really great techniques from this one. The course is geared toward .Net development using Visual Studio, C#, and Moq, but you should still watch it if you've got a subscription – the techniques used can be done on other platforms. I've been practicing the techniques in Swift (minus the mocking framework).
  * [TDD as a Design Tool][2] – Geared toward web development with JavaScript / AngularJS, but has some useful patterns.

<a name="blogs" class="jump-target"></a>

### Blogs

  * [How to write unit tests in Swift with XCTest][3] – Josh Brown gives a nice overview of the unit testing capabilities offered in Xcode and how Swift can be used as the testing language of choice.
  * [Swift: Unit Testing Tips and Tricks][4] – [@NatashaTheRobot][5] offers some practical advice in a tips and tricks style blog post.
  * [iOS Unit Testing][6] – Some good introductory articles to browse. Offers a few things in Swift, but much of his content is in Objective-C.
  * [Write your first Unit Test in Swift][7] – Learn how to write the most basic, but still useful, Unit Tests in Swift with XCTest.

<a name="user-group" class="jump-target"></a>

### User Group Talks

  * [Adam Leonard – Test-Driven Development in Swift using Quick (July 2014)][8] – Talk given by [@adamjleonard][9] at a Brooklyn Swift Developers Meetup in July.

<a name="at-acb" class="jump-target"></a>

### At andrewcbancroft.com

  * [Don't Write Legacy Swift][10] – Motivations for testing your code.
  * [TDD for iOS in Swift – What’s the Goal?][11] – Before actually doing Test Driven Development (TDD) for your iOS / Mac app, it’s really important to ask a very fundamental question: What’s the goal? I discuss two goals for testing your iOS / Mac apps.
  * [Improvements to Unit Testing in Swift with Xcode 7][12] Much of the pain involved in getting set up to write unit tests in Swift has been alleviated by improvements in Xcode 7. This article analyzes these improvements to ease your unit testing workflow.
  * [Getting Started with Unit Testing in Swift][13] – While getting set up to write unit tests in Swift isn't _difficult_, it isn't exactly _intuitive_. This 5-step guide will get your project set up to write unit tests in Swift.
  * [An (Almost) TDD Workflow in Swift][14] – When I find myself staring at the screen, paralyzed because I’m “not supposed to write actual production code until the test is written”, I often turn to the workflow that describe in this post, to help me break through to being productive.
  * [Unit Testing Model Layer with Core Data and Swift][15] – Exploration of testing when your project uses Core Data. This post provides a walk-through of setting up an in-memory data store to test with NSManagedObjects.
  * [Swift Unit Testing – Verifying Method Calls][16] – Screencast showing how to verify method calls in Swift unit tests.
  * [Swift Access Control – Implications for Unit Testing][17] – Pointer on how to make code from your main project visible in your Test project.
  * [Creating "Mocks&#8221; and "Stubs&#8221; in Swift][18] – Essentially a discovery I made about how to create fake objects and override those objects' methods. You'd do this to isolate and control the object's behavior in order to enable or ease the testing process.

<a name="share" class="jump-target"></a>

 [1]: http://www.pluralsight.com/courses/play-by-play-wilson-tdd
 [2]: http://www.pluralsight.com/courses/tdd-as-design-tool
 [3]: http://roadfiresoftware.com/2014/06/unit-testing-with-swift/
 [4]: http://natashatherobot.com/swift-unit-testing-tips-and-tricks/
 [5]: https://twitter.com/NatashaTheRobot
 [6]: http://iosunittesting.com/
 [7]: https://swiftcast.tv/articles/introduction-to-xctest
 [8]: http://vimeo.com/102163542
 [9]: https://twitter.com/adamjleonard
 [10]: http://www.andrewcbancroft.com/2014/12/10/dont-write-legacy-swift/
 [11]: http://www.andrewcbancroft.com/2014/12/16/tdd-ios-swift-whats-goal/
 [12]: http://www.andrewcbancroft.com/2015/06/10/improvements-to-unit-testing-in-swift-with-xcode-7/ "Improvements to Unit Testing in Swift with Xcode 7"
 [13]: http://www.andrewcbancroft.com/2014/12/29/getting-started-unit-testing-swift
 [14]: http://www.andrewcbancroft.com/2015/03/10/an-almost-tdd-workflow-in-swift/ "An (Almost) TDD Workflow in Swift"
 [15]: http://www.andrewcbancroft.com/2015/01/13/unit-testing-model-layer-core-data-swift/ "Unit Testing Model Layer with Core Data and Swift"
 [16]: http://www.andrewcbancroft.com/2014/12/22/swift-unit-testing-verifying-method-calls/
 [17]: http://www.andrewcbancroft.com/2014/07/22/swift-access-control-implications-for-unit-testing/
 [18]: http://www.andrewcbancroft.com/2014/07/15/how-to-create-mocks-and-stubs-in-swift/