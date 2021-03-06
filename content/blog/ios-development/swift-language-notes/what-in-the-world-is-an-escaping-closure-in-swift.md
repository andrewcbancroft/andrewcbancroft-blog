---
title: What in the World is an “Escaping Closure” in Swift?
author: Andrew
type: blog
date: 2017-04-26T14:41:07+00:00
url: /2017/04/26/what-in-the-world-is-an-escaping-closure-in-swift/
featured_image: /wp-content/uploads/2017/04/Escape.jpg
dsq_thread_id:
  - "5761561384"
categories:
  - Swift
tags:
  - Closures
  - Swift
dispiosgettingstartedbadge: true

---
If you're mostly in the business of coding up closures to pass off to other functions as [callbacks][1], you may not have run into the concept of an "escaping closure&#8221; yet.

When you step out of the role of consuming other peoples' APIs in to the realm of creating your own (and [you do this all the time][2]!), _this_ is where you'll likely run into the concept of an "escaping closure&#8221; in certain scenarios.

I want to start off by defining the term. Then I'll throw out a couple of usage scenarios that cause us to need to think in terms of a closure "escaping&#8221;.

<a name="definition" class="jump-target"></a>

# Definition

First, a definition, shall we?

> A closure is said to escape a function when the closure is passed as an argument to the function, but is called after the function returns.  
> –[Apple Developer Documentation][3] 

So apparently, you can get yourself into the situation where you're designing a function that takes in a closure as one of its parameters:

`func doSomething(completion: () -> Void) { ... }`

Furthermore, it appears that it's possible to find yourself in a situation where the closure will execute, but _somehow_, it doesn't get executed until _after_ the function it got passed into returns. So it would go something like this:

  1. Call `doSomething` and pass it a closure [of Type][4] `() -> Void`
  2. `doSomething` performs its work and _returns_
  3. The closure you passed (the one of Type `() -> Void`) gets executed

Weird, huh? How in the world can that happen? [I'll talk about that in a second][5].

The point for now is this: whenever you're in a situation like this where the closure that you pass to a function gets executed _after_ the function you passed it _to_ returns, you've got an "escaping closure&#8221; on your hands.

As an API _consumer_, you might not know or care about the escap-y-ness of the closure.

As an API _designer_ (which again, [could be _yourself_][2], if you're the one writing the definition of `doSomething(completion:)`), you _have_ to care, because the Swift compiler will be angry with errors if you don't.

So how do "escaping closure&#8221; scenarios happen?

<a name="usage" class="jump-target"></a>

# Escaping closure scenarios

Here are a few scenarios that give rise to escaping closures.

<a name="store-as-state" class="jump-target"></a>

## Storing the closure as _state_

[Apple's docs][3] give an example of appending a closure that's passed into a function to a mutable array of closures within your class/struct:

```swift
var completionHandlers: [() -> Void] = []

func doSomething(completion: () -> Void) {
    completionHandlers.append(completion)
}
```

Presumabley then, at some later time after `doSomething` returns, all of the completion handlers in the array will be looped over and executed (or something like that)&#8230;

As you can see, this follows the 1. Pass closure, 2. `doSomething` returns, 3. Closure executed pattern we had before, doesn't it?

So this is one scenario that could give rise to an escaping closure, IF you designed your system this way.

**Whenever you take the closure, store it as state, and then execute it at a later time, the closure is "escaping&#8221; the function it got passed into.**

<a name="async-callbacks" class="jump-target"></a>

## Asynchronous asynchronous callbacks

No, I didn't get repetitively redundant there. Well&#8230; I did, but it was on purpose. :]

Supposing that you're working on your `doSomething(completion:)` function.

Within it, you make a call to _another_ function that performs an asynchronous action and asks for a completion closure of its own.

What if you only want to call the completion handler that was passed into `doSomething` _after_ the asynchronous action of the _other_ function completes. That is, what if you only want the two completion handlers to be executed _together_:

```swift
func doSomething(completion: () -> Void) {
    doSomeOtherAsynchronousThing(completion: {
    () -> Void in
    // code that executes after the other asynchronous thing is done
    completion()
    })
}
```

Here, you've got this nested asynchronous behavior going on, don't you? Asynchronous asynchrony is happening.

**Whenever you _defer the execution of a closure_ to a time that's _after_ the "parent&#8221; function returns, you've got an "escaping closure&#8221; on your hands.**

<a name="declaring-escaping" class="jump-target"></a>

# Declaring "this is an escaping closure!&#8221; in code

Whenever you're implementing a function that introduces the possibility for a closure passed to it to escape, you'll know it.

The Swift compiler will complain, and your app won't build:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/escaping-closure.png" alt="Compiler error - Closure use of non-escaping parameter &#039;completion&#039; may allow it to escape" width="891" height="33" class="alignnone size-full wp-image-13321" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/escaping-closure.png 891w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/escaping-closure-300x11.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/escaping-closure-768x28.png 768w" sizes="(max-width: 891px) 100vw, 891px" />][6]

What do you do to fix it?

It's pretty simple. In the declaration line of your function, you need to add the `@escaping` attribute right before the closure's Type declaration:

`doSomething(completion: @escaping () -> Void)`

# Wrapping up

My goal was to shed some light on the concept of "escaping closures&#8221;. With the definition and the example scenarios that give rise to escaping closures, my hope is that things are a little more clear for you. Sound off in the comments if you're still struggling, or if you've run across other scenarios requiring you to use the `@escaping` attribute!

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/2016/02/15/fundamentals-of-callbacks-for-swift-developers/
 [2]: https://www.andrewcbancroft.com/2017/04/25/every-developer-api-designer/
 [3]: https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Closures.html#//apple_ref/doc/uid/TP40014097-CH11-ID546
 [4]: https://www.andrewcbancroft.com/2016/03/18/swift-functions-as-types/
 [5]: #usage
 [6]: https://www.andrewcbancroft.com/wp-content/uploads/2017/04/escaping-closure.png