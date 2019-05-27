---
title: TDD for iOS in Swift – What’s the Goal?
author: Andrew
type: blog
date: 2014-12-16T12:00:10+00:00
url: /2014/12/16/tdd-ios-swift-whats-goal/
dsq_thread_id:
  - "3329630156"
categories:
  - iOS / Mac
  - Swift
tags:
  - Swift
  - TDD
  - Unit Testing

---
Before actually _doing_ Test Driven Development (TDD) for your iOS / Mac app, it's really important to ask a very fundamental question: What's the goal? What am I aiming for when I say I want to drive my iOS development with tests?

## 2 Goals of TDD in iOS

A recent course I watched on [Pluralsight][1] called [TDD as a Design Tool][2] gave me some insight on two goals for doing Test Driven Development:

  * Make sure my code is in the right place
  * Make sure my logic is correct

Let's take them one at a time&#8230;

### A place for everything, and everything in its place

Believe it or not, Test Driven Development is an extremely powerful tool for ensuring that code is written in the right place. But what do I mean by "the right place&#8221;?

In the object-oriented world, "places&#8221; are data structures, such as classes and structs, and their publicly accessible methods.

When I employ TDD in a project, I will tend to be driven to making sure my code ends up in the right place. I'll give you an example:

#### Starting Places

When I create a new iOS project, Xcode sets me up with a Storyboard, a blank Scene, and a View Controller. Xcode also generates a Test target for me&#8230; BUT a what am I most aware of right from the onset? The Storyboard and the View Controller.

The natural inclination, then is to start dragging things onto the design surface and wiring them up to the controller as Outlets and Actions, and off I go!

It's like I'm lead to the ever-common temptation to put _all_ my code for a given screen in the application inside its corresponding View Controller.

#### TDD Tension

While I may be led there, and while it may seem convenient, it would seem that TDD wants to start me off in a different "place&#8221; altogether. Since TDD asserts that I should not write any code unless there's a test requiring it to be written, I'd be driven away from my main project into my Test project. My canvas at that point is a fresh XCTestCase class.

UI at this point is not on my mind. Here, I care more about the _foundations_ of the app itself. I begin to consider the application's domain, and its behavior _apart_ from its user interface. This is very important if I want to truly write decoupled, modular, maintainable code.

Rather than weigh down my View Controller with tons of responsibility, TDD drives me to try and build _separate_ classes to steward _small_ bits of my application. Those small classes can be tested **much** more easily than trying to get an enormous View Controller instantiated and configured in my test suite.

This is just one small example of how TDD can get you off on the right track to putting code in its proper place.

### Your logic was impeccable, Captain

The second goal of TDD in iOS is making sure my logic is correct, or, as Spock would say, "impeccable&#8221;.

Does my application's code do what it _should_ do? Can I write my code in such a way that I can easily verify it? TDD, by nature, pushes me in the direction of being able to verify the accuracy of my code's logical outcomes&#8230; that is, how it behaves.

#### Fascinating is a word I use for the unexpected

Testing has this way of setting expectations. One thing I've really enjoyed about TDD's notorious red-green-refactor cycle is that I know certainly and immediately when I've messed up (ie, run across a "fascinating&#8221; situation in Spock terms).

  * When I write the test, it should fail the first time. If it doesn't, I've messed up.
  * When I write the code to pass the test and the test fails, I _also_ know I've messed up.

## Next Steps

With the fundamental goals of TDD in place, I feel more prepared from a foundational standpoint to venture into actuall test-driven practices for iOS.

I am learning so much in the area of testing – it's a technique I'm practicing regularly, both in Swift and in C# (for fun and for work, respectively), so as I grow and discover ways to optimize the TDD experience in Xcode / Swift, I'll be sharing them. Stay tuned!

<div class="related-posts">
  You might also enjoy</p> 
  
  <ul>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/12/19/swift-unit-testing-resources/" title="Swift Unit Testing Resources">Swift Unit Testing Resources</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/12/22/swift-unit-testing-verifying-method-calls/" title="Swift Unit Testing – Verifying Method Calls">Swift Unit Testing – Verifying Method Calls</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/07/15/how-to-create-mocks-and-stubs-in-swift/" title="How to Create Mocks and Stubs in Swift">How to Create Mocks and Stubs in Swift</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/07/22/swift-access-control-implications-for-unit-testing/" title="Swift Access Control – Implications for Unit Testing">Swift Access Control – Implications for Unit Testing</a>
    </li>
  </ul>
</div>

 [1]: http://www.pluralsight.com "Pluralsight"
 [2]: http://www.pluralsight.com/courses/tdd-as-design-tool "Pluralsight - TDD as a Design Tool"