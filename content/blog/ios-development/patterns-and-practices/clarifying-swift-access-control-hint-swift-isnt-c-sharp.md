---
title: 'Clarifying Swift Access Control (Hint:  Swift Isn’t C#)'
author: Andrew
type: blog
date: 2015-04-24T18:02:34+00:00
url: /2015/04/24/clarifying-swift-access-control-hint-swift-isnt-c-sharp/
dsq_thread_id:
  - "3709614701"
categories:
  - Swift
tags:
  - Access Control
  - Swift
dispiosgettingstartedbadge: true

---
As it turns out, Swift isn't C# (or Java or VB.Net or&#8230;)! My day job keeps me busy writing C#, so I'll reference it as my go-to comparison language for this article. The conclusion, however, carries over to other languages that have access control modifiers.

I just spent the greater part of a week experimenting with Swift extensions. I was trying to figure out some seemingly strange behavior that they were exhibiting.

After publishing ["3 Nuances of Swift Extensions&#8221;][1], I quickly learned that I had a fundamental misunderstanding of Swift access control, thanks to some observant folks in the Swift community.

What was the hiccup? Read on to find out where I went wrong&#8230;



<a name="how-private-is-private" class="jump-target"></a>

### How private is private?

One of the most surprising "nuances&#8221; from ["3 Nuances of Swift Extensions&#8221;][1] that I discovered was that if you define an extension within the same source file as another Type, the extension's members can see the _other_ Type's `private` properties and functions! "Whaaat?? How is this possible?!&#8221;, I reacted.

Well&#8230; To restate the obvious, Swift isn't C#&#8230; and it isn't C# in more ways than just syntax.

Ever since access control modifiers were introduced in Xcode 6 Beta 4, I had it in my mind that `public`, `private`, and `internal` worked just like they do in C#. Sure, I read [the blog article on access control published by the Swift team][2], but it was a mere cursory look. I basically saw the three key words and thought, "Ah, I got this&#8230; moving on!&#8221;

This was a fundamental mistake for me to make, and it goes to show that just because there are _similarities_ between languages, it doesn't mean the _semantics_ of those similarities carry over.

<a name="semantics-of-private" class="jump-target"></a>

### Semantics of private

`Private` is the access modifier that got me all confused. The concept of `public` and `internal` carry over fairly nicely, but `private` is the one that's fundamentally different between C# and Swift, so that's where I'll focus.

In addition to this article, recommend giving [the Swift team's original article on access control][2] a very close read, just to make sure all the semantics of `public` and `internal` in Swift are clear as well.

<a name="private-and-c-sharp" class="jump-target"></a>

#### Private and C#

In C#, `private` members of a Type are "truly&#8221; private. They are only visible _within that Type_. The member's visibility is limited to the curly braces enclosing the Type's implementation. That's it. No subclass can see `private` members. No other Types can see those members, no matter which file those Types are defined in. `Private` is private.

<a name="private-and-swift" class="jump-target"></a>

#### Private and Swift

And then there's Swift. `Private` takes on _entirely different_ semantics in Swift, and herein lay my fundamental misunderstanding. It was obvious that I just didn't "get it&#8221; if you read through the [Nuances Article][1]. [sigh]

In Swift, a `private` Type, or a `public`/`internal` Type's `private` _members_ are visible to _anything else_ defined within the same **file**.

This isn't a characteristic that's limited to extensions. _Anything_ defined in the same source file as something else can see everything. This is a shocker if you're coming from C# or a similar language where the semantics of access control are used for encapsulation purposes.

<a name="proof-by-example" class="jump-target"></a>

#### Proof by example

So suppose you have a file named Types.swift, and within you have the following:

```swift
private struct Person {
    private let name: String
}

private struct Greeter {
    private func greet(person: Person) {
        println("Hi, I'm \(person.name)")
    }
}
```

If you're a C# developer, you look at that code and immediately go, "Yeah, that's not gonna work&#8230; `name` is `private` to `Person` and can't be referenced outside that Type&#8221;.

But in Swift, this is totally legitimate. Even though `Person` is `private`, `Greeter` can see `Person` and initialize one, _and_ it can see `Person`&#8216;s `private` property, `name`.

`Private` in Swift simply limits visibility to Types and members within the same _source file_. Multiple Types defined in the same source file can see other `private` Types, as well as other Types' `private` properties and functions. In other words, "`private` isn't `private`", if you're thinking of private like a C# developer (or a developer familiar with other languages with access control modifiers similar to C#).

### Wrapping up

There is a fundamental difference in the semantics of access control between C# and Swift.

In C#, we typically think of access control in terms of inheritance characteristics. The modifiers affect the Type and revolve around the Type and its interaction with other Types.

Swift, controls access to members in terms of _source file_ and _module_. Types defined within the same source file see everything about each other, including `private` members. `Internal` Types and members expand visibility to anywhere within the same module. Finally, `public` access makes Types and their members visible _everywhere_, even to Types defined in other modules.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/04/22/3-nuances-of-swift-extensions/" title="3 Nuances of Swift Extensions">3 Nuances of Swift Extensions</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/07/22/swift-access-control-implications-for-unit-testing/" title="Swift Access Control – Implications for Unit Testing">Swift Access Control – Implications for Unit Testing</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/2015/04/22/3-nuances-of-swift-extensions/ "3 Nuances of Swift Extensions"
 [2]: https://developer.apple.com/swift/blog/?id=5