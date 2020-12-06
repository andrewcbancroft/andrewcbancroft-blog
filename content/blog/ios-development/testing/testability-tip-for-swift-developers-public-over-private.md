---
title: Testability Tip for Swift Developers – Public Over Private
author: Andrew
type: blog
date: 2015-04-15T18:52:11+00:00
url: /2015/04/15/testability-tip-for-swift-developers-public-over-private/
dsq_thread_id:
  - "3684435104"
categories:
  - Swift
tags:
  - Access Control
  - Swift
  - TDD
  - Unit Testing
dispiosgettingstartedbadge: true

---
Quite often in unit testing, especially when practicing Test-Driven Development, I find myself wanting to test every single line of code. When I run up against a `private` function, however, I often scratch my head and ask, "How am I supposed to test this??&#8221;.

Most experienced testers will tell you, "Don't test private implementation – only public API&#8221;.

"Okay&#8230; But how, does that private function get tested?&#8221;, I always asked.

In this article, I intend to share a testability tip catered to the Swift developer community that helps alleviate this issue with testing private functions.


<a name="testing-and-observability" class="jump-target"></a>

### Testing and observability

<a name="developers-as-clients-of-apis" class="jump-target"></a>

#### Developers as clients of APIs

As developers, we are "clients&#8221; of APIs on a daily basis. We interact with other developers' frameworks and libraries through the visible, observable, Application Programming Interface that they've exposed to us. It's the way they've designed for us to interact with their code.

Notice three words that I chose in that introductory paragraph:

  * Visible
  * Observable
  * Exposed

If we are going to use another developer's library, _all we have_ as developers is the public interface that they've made visible to us&#8230; It's the only observable thing we can look at and go, "Oh! Okay, to do this, I call _that_ function&#8221;. The only thing exposed are the functions and properties that the developer intends for us to see.

<a name="tests-as-clients-of-apis" class="jump-target"></a>

#### Tests as clients of APIs

Have you ever viewed your unit test suite as a "client&#8221; of your code? It is!

And just like a developer, the unit tests in your test target interacts with _your_ app's API through the same visible, observable, interface that you've exposed to them.

If you start to personify your test target and think of it in terms of "just another client of your code&#8221;, you begin to see that it really doesn't have any more visibility of your code than another developer would if he or she were consuming it.

All of this boils down to say, if it's observable, it's testable. Which means, the easiest and most natural code to test is `public` code.

<a name="public-over-private" class="jump-target"></a>

### Public over private (and internal)

So should _everything_ be `public` instead of `private` or `internal`? Certainly not.

Object-oriented programming strives for data-hiding and encapsulation, so there _are_ reasons to keep some things non-public.

Additionally, there are [certain Swift compiler optimizations][1] (which lead to run-time optimizations) that can be gained when you mark things in your Type as `final`. Using the `private` access modifier allows the compiler to _infer_ that it is `final` because it's narrowly scoped to the current Type _only_. These are handy things to know, but as is always the case with optimization, avoid _premature_ optimization by _measuring first_ to decide if you really need them.

Whenever possible, I prefer `public` over the other access modifiers to help enable testing for my apps.

So when is "whenever possible&#8221;?

<a name="reason-for-existence" class="jump-target"></a>

#### Public when part of a Type's reason for existence

Obviously, properties and functions that are part of a Type's core purpose can be marked `public`. My practice is to decide, "Is this function why this Type exists?&#8221;. If so, I mark it as `public`.

Note also that the Type itself needs to be marked public if it's going to be visible to your unit tests.

```swift
// Instead of this (default --internal-- access)...
class MyClass {
    func myFunc() {
        // Performs something essential to why MyClass exists
    }
}

// Make things public...
public class MyClass {
    public func myFunc() {
        // Performs something essential to why MyClass exists
    }
}
```

<a name="new-type" class="jump-target"></a>

#### Transition many private components to new Type

Having _many_ `private` properties and functions can be an indication that there needs to be a new Type created to encapsulate those components. I've heard developers talk about this situation as one that "screams, &#8216;New Type!'&#8221;.

If we extract out sets of related `private` properties and functions into a new Type, those pieces of code _are the reason that Type exists_, and thus should be marked `public`. Testing, then, becomes a matter of writing unit tests for the new Type and its public API!

Even if you just have a few `private` code blocks in the Type you're trying to test, it can sometimes make your testing life easier to transition them to a new Type as `public` components.

If I'm really uncomfortable marking functions `public` in the Type where they currently exist, creating a new Type and marking them `public` there is usually the better alternative, and it immediately enables testing for that set of code.

<a name="testing-non-public" class="jump-target"></a>

### Testing non-public code

As I mentioned in the beginning, it's not good to just haphazardly go through your code and "`public` all the things!!&#8221;. After _appropriately_ marking fundamental functions `public` and transitioning sets of `private` functions to new Types where they can happily live as part of _that_ Type's public API, there will likely be a few `private` or `internal` things left over.

How do these get tested?

Well, ideally, these are small, simple, helper functions that are only useful when called within the Type you're working on.

If these functions produce observable results in the places where they're called, you end up testing these non-public components _implicitly_, that is, by testing the things that _are_ `public`.

During the course of testing some `public` function which calls another non-public function, that non-public function's logic will be executed. If the outcome of that function's execution affects the Type's state, or the output of its `public` parent function, those are the things that you'd be able to write unit tests for, because those are the "observation points&#8221;, so to speak.

### Wrapping up

The bottom line is: observable == testable. Just like another developer, the suite of unit tests in your test target interacts with your app's API through the visible, observable, interface that you've exposed to them. The more observable your API components are, the more testable your code becomes. Which is why I prefer `public` over `private` whenever possible!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/tag/unit-testing/" title="Browse All Unit Testing Articles @ andrewcbancroft.com">Browse All Unit Testing Articles @ andrewcbancroft.com</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/12/19/swift-unit-testing-resources/" title="Swift Unit Testing Resources">Swift Unit Testing Resources</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/07/22/swift-access-control-implications-for-unit-testing/" title="Swift Access Control – Implications for Unit Testing">Swift Access Control – Implications for Unit Testing</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://developer.apple.com/swift/blog/?id=27