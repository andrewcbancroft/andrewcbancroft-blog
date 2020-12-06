---
title: 'Working with Swift:  Adopt a Protocol or Pass a Function?'
author: Andrew
type: blog
date: 2016-05-05T17:59:16+00:00
url: /2016/05/05/working-with-swift-adopt-a-protocol-or-pass-a-function/
dsq_thread_id:
  - "4802920353"
categories:
  - Swift
tags:
  - Functions
  - Protocols
  - Swift
dispiosgettingstartedbadge: true

---
Without fail, any time [Rob Napier][1] ([@cocoaphony][2]) speaks or writes, I gain insight into new and deeper ways to solve problems with Swift.

In January 2016, he [gave a talk at dotSwift][3], and I wanted to record my thoughts on something he said that made a lot of sense when it comes to the topic of, "Should I create and adopt a protocol for this Type I'm creating, or should I just pass it a function instead?&#8221;



<a name="two-insights" class="jump-target"></a>

# Two insights

During the talk, he compared some scenarios that were meant to help determine when to create a protocol, or when doing so would be overly complex, and passing a function might be the simpler thing to do instead.

Two phrases caught my attention:

> A protocol is really just a _promise_ to implement some functions, and a struct is mostly just a bundle of functions that implement the promise. 

and

> I can pass you an object that _promises_ a function, **or**, I could just pass you the function. 

**[mind blown]**

So in other words, there are times when, rather than going through the formality of&#8230;

  * Creating a protocol defining one or more functions that should be implemented
  * Creating a Type that _adopts_ that protocol to promise that "I (as a class/struct/enum) will implement this/these function(s)&#8221;
  * Creating an instance of that Type
  * Passing off the instance to _another_ Type that needs to _call_ that promised function

&#8230;life might be simpler and code might be more clear and more concise when you just&#8230; **pass the function** instead!

<a name="when-to-pass-a-function" class="jump-target"></a>

# When to pass a function

Rob gave us a couple or three **rules of thumb**. Not hard-and-fast, "It should always be this way&#8221;, but just some guiding thoughts to filter our decision-making about our architecture.

When it comes to finding opportunities that lend themselves to going the "just pass the function&#8221; route, consider the following:

  * If you're creating a Type that depends on a single piece of functionality (a single function), maybe try depending on / passing just the function, rather than creating a protocol.
  * If you're creating a Type that depends on more than a single function, but the nature of the dependent relationship is short-lived, maybe try depending on / passing just the function. How do you know if it's short-lived? Ask, "How many times am I going to call the function(s) that I depend on? Once, and then I'm done? Or multiple times throughout the application life-cycle?&#8221; If it's a once and done kind of relationship, much like a [callback][4], then perhaps just depending on and passing the function, rather than creating a protocol, is the simpler route.

<a name="when-to-use-a-protocol" class="jump-target"></a>

# When to use a protocol

For some rules of thumb when it comes to choosing a protocol over just passing a function, you might consider:

  * If you're creating a Type that depends on 3 or more related functions, wrapping those functions up in a protocol might be cleaner and more clear.
  * If you're creating a Type that depends on some functions for a long period of time, consider a protocol. Long-lived relationships are better-described in a protocol. Think of something like a table view's data source. This is a good example of when to use a protocol to describe the dependency and the relationship, because as data changes, the table view will need to constantly call into those protocol methods to refresh itself.

<a name="how-to-depend-on-a-function" class="jump-target"></a>

# How to depend on a function

In order to fully grasp how to go the "just depend on / pass the function&#8221; route, you need to have an understanding of how [function Types are described in Swift][5]. With this knowledge, you're set to do a couple of things:

1 – Create a property on the Type you're implementing that is of some function Type. For example:

```swift
struct Vehicle<Fuel> {
    let move: (Fuel) -> Void
}

// Fuel Types
struct Gas {}
struct RocketFuel {}

let car = Vehicle<Gas>(move: { _ in print("use gasoline to move") })

let rocket = Vehicle<RocketFuel>(move: { _ in print("use rocket fuel to move") })

car.move(Gas())
rocket.move(RocketFuel())
```

A full explanation of indicating function Types can be found by reviewing my guide on [Swift Functions as Types][5]

2 – Declare that such-and-such parameter on a function within your Type must be a function Type. For example:

```swift
func getData(completion: (NSData) -> Void) {
    let data: NSData = // do something to go get data

    // call completion handler when getting data is done
    completion(data)
}
```

The above is an example of a callback scenario, which I give full treatment in [Fundamentals of Callbacks for Swift Developers][4]

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/03/18/swift-functions-as-types/" title="Swift Functions as Types">Swift Functions as Types</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/02/15/fundamentals-of-callbacks-for-swift-developers/" title="Fundamentals of Callbacks for Swift Developers">Fundamentals of Callbacks for Swift Developers</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://robnapier.net/
 [2]: https://twitter.com/cocoaphony
 [3]: http://www.thedotpost.com/2016/01/rob-napier-beyond-crusty-real-world-protocols
 [4]: https://www.andrewcbancroft.com/2016/02/15/fundamentals-of-callbacks-for-swift-developers/
 [5]: https://www.andrewcbancroft.com/2016/03/18/swift-functions-as-types/