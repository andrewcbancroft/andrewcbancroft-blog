---
title: Creating Trust-able Unit Tests in Swift
author: Andrew
type: blog
date: 2015-11-04T02:42:08+00:00
aliases:
  - /2015/11/03/creating-trust-able-unit-tests-in-swift/
dsq_thread_id:
  - "4287714074"
categories:
  - Swift
tags:
  - Swift
  - Unit Testing

---
It may come as a surprise to you, but a green-lit passing unit test is not _always_ a sign that all is well with our software. Our apps and their corresponding unit test suites always start off clean and basic and simple.

But they don't stay that way for long.

Cycles of code changes and additions and re-writes take place throughout the days, weeks, and months of the application development cycle. The app's code-base and unit tests become more complex as the end-product progresses along its asymptotic approach to completion.

Unit tests are only as good as they are _trust-able_. As our products navigate their way through development iterations, how can we keep a handle on the trustworthiness of our unit tests? How can we be assured that they're testing the right thing? How can we know that changing a unit test because a fundamental requirement has changed is still accurate when it lights up green? After all, we're writing _code_ to test our code!

Here, I explore several categories of thought that will help you think about creating trust-able unit tests.


<a name="organization" class="jump-target"></a>

### Test Organization

How you organize the code within a single unit test can make all the difference in understanding it when you return to it later.

Having a consistent strategy for organizing the body of a test function will save you time and effort in trying to understand what's happening. Keeping things consistent across a team of developers will make everyone more productive as well.

Two of the most common organizational structures for unit tests are the &#8220;Arrange-Act-Assert (AAA)&#8221; and the &#8220;Given-When-Then&#8221; structures:

```swift
func testAppFeatureBehavior() {
    // Arrange
    let sut = SystemUnderTest()
    // configure properties as necessary to prepare the system for the next step

    // Act
    sut.functionProducingObservableBehavior()

    // Assert
    XCTAssert(...expectations are met...)
}
```

A similar pattern is the &#8220;Given-When-Then&#8221; structure:

```swift
func testAppFeatureBehavior() {
    // Given
    let sut = SystemUnderTest()
    // configure properties as necessary to prepare the system for the next step

    // When
    sut.functionProducingObservableBehavior()

    // Then
    XCTAssert(...expectations are met...)
}
```

They're exactly the same structures with different descriptive comments outlining the three phases of the test.

The outline itself can help you look at the test and verify its trustworthiness as it pertains to its logical, clear order and organization.

<a name="length" class="jump-target"></a>

### Test Length

Another contributor to the trustworthiness of a given unit test is the number of lines of code it has.

It's been said that a 100% guaranteed bug-free line of code is the line of code that was never written in the first place!

It makes sense that if we can keep our unit tests short and to the point, there will be a smaller chance for error than if the test body is extremely long.

Small (**<20ish** lines of code) tests are more-trusted than large tests.

20 lines of code is sort of arbitrary, but can help alert you to when you might need to re-look at the test and apply DRY (Don't Repeat Yourself) principles. Large test bodies may be a sign that there's a possible opportunity to factor out common, repeated test code.

Extracting out larger portions of code into smaller named functions may also help with the clarity of your unit test code, leading you to say with greater confidence, &#8220;I trust that this test is correct&#8221;.

<a name="complexity" class="jump-target"></a>

### Test Complexity

Unit tests should be as simple as possible. Reducing the complexity of a unit test results in clarity.

Make sure there's a clear path through the test case.

Avoid branching logic (if-else statements) or looping constructs in your tests if at all possible. If you find the need to test two code paths of your system under test, write two tests for that, rather than applying if-else logic inside of a single unit test.

If you're using analytics, such as [cyclomatic complexity][1], absolutely make sure your unit tests have as low of a cyclomatic complexity as possible.

<a name="semantics" class="jump-target"></a>

### Test Semantics

Applying simple clean coding practices to your unit tests can also go a long way in terms of being able to trust your tests.

Use descriptive and meaningful phrases (DAMP) in your test names and variables. Be sure to update them as the semantics of your system under test change. This will provide a consistency and accuracy to the _names_ of things that will lead to a greater confidence that your tests are giving you an accurate picture of the health of your system.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2014/12/10/dont-write-legacy-swift/" title="Don’t Write Legacy Swift">Don’t Write Legacy Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/tag/unit-testing/" title="Unit Testing @ andrewcbancroft.com">Unit Testing @ andrewcbancroft.com</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2014/12/29/getting-started-unit-testing-swift/" title="Getting Started with Unit Testing in Swift">Getting Started with Unit Testing in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2014/12/19/swift-unit-testing-resources/" title="Swift Unit Testing Resources">Swift Unit Testing Resources</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://en.wikipedia.org/wiki/Cyclomatic_complexity