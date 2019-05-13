---
title: Is Protocol Oriented Swift Better than Object Oriented Swift?
author: Andrew
type: blog
date: 2016-06-12T20:59:48+00:00
aliases:
  - /2016/06/12/is-protocol-oriented-swift-better-than-object-oriented-swift/
dsq_thread_id:
  - "4905232005"
categories:
  - Swift
tags:
  - Protocol Oriented Programming
  - Swift

---
A [question was asked on Reddit][1] and showed up in my feed as I was browsing this weekend:

> What does protocol oriented programming mean, and why is it better than OOP? 

I really like a few things that were said in [one of the top "Explain Like I'm 5&#8221; comments][2] that was posted in response to the question by [CodaFi][3].

# "Explain Like I'm Five&#8221; – A laundry service example

First, the example provided was very understandable. I highly recommend you [jump over][2] and just read through what the commenter wrote.

The theme was "laundry service&#8221;. Supposing that there was a `Laundry` object that encapsulated certain laundry-related functions&#8230; "Launder my clothes, please&#8221; &#8212; "Okay, here's your clothes!&#8221;. You as a client simply interact with `Laundry` by saying "Launder, please!&#8221;. The `Laundry` object goes off and does its thing, which could range from simple to incredibly complex – the beauty is that as a client, as a person needing laundry done, you don't care. As long as the laundry gets done and you get your clothes back, life is great!

# "Problems&#8221; with Object Orientation

In my guide on [the Fundamentals of Callbacks for Swift Developers][4], I describe the scenario that we're all in as developers:

When we’re building software, we’re either _using_ code built by others, or _creating_ code for others to use, are we not? We’re either using code that “hooks into” what other developers have designed and made available to us, or we’re creating code that other code will “hook into” and interact with, even if the “other code” is written by us in our own app.

We wear two hats at once, when it comes to being clients and creators of code.

But what if we're working with a `Laundry` object as a _developer/creator_, and not as a _client_ (ie, someone who needs laundry done). What if we, as developers, get handed a `Laundry` object in a library and we want to customize its behavior&#8230; maybe improve the performance of `launderClothes()`, or override the implementation it to use some amazing new laundry service.

The way we'd do that is by crating a _subclass_. Here's the beef with Object Orientation, according to the commenter:

> [Object Orientation] encourages "encapsulating complexity&#8221; by exposing state and internals through inheritance. 

Unpacking that: Software has innate complexity. Objects are "things&#8221; that encapsulate that complexity. They do it in a certain _way_ though: They expose certain pieces of state and pieces of functionality. The way those abstractions over complexity get propagated and customized through the system is through this mechanism called inheritance.

But the commenter cites this methodology as "trouble&#8221; though. Why? Well&#8230;

"I may not want to know how my dry cleaning got done, but if I wanted to design a better route to go from dirty clothes to clean clothes, I would necessarily _have_ to know every last detail of the steps that were performed so I can try to refine them in my subclass.&#8221;

So the commenter is coming at it from the point of a developer/creator. It's pointed out that to truly be able to improve performance or refine algorithms in a subclass, we necessarily have to know every detail of the steps that were performed in the superclass. And it's not always the case that we can discover that superclass implementation to improve upon it.

# Shifting to Protocol Orientation

So&#8230; Protocol Orientation? If it's better, how is it better?

I love how the commenter takes the object oriented example of laundry service, and refines it with nuances that come out of thinking in terms of protocols rather than just objects. Really. [Have a look][2].

The primary difference we see is that rather than having a `Laundry` object&#8230; a single one&#8230; that does laundry in its own particular way, a shift occurs: We begin to deal in terms of describing _ways_ to get laundry done.

> If I want my laundry done one particular way by _one particular guy_ I go Object-Oriented and stop caring about how things get done. But if I want to generalize over the _ways_ to get laundry done I need to go Protocol-Oriented and stop caring about everything else. 

In Protocol Orientation, the only thing that matters is the _interface_&#8230; the things that clients will interact with. Describe that to the best of your ability with a protocol, and let something else come along and worry about the _how_.

In the end, the only thing that a person needing laundry done needs to know is what interface is available for them to accomplish the laundering they have need of completing.

> Being able to sit down and think about how something would look if you removed state and inheritance from the picture and just thought about the bare minimum required interface to that particular task is a far more powerful and simple approach to programming that enables reuse far easier than OO ever did. 

# Takeaways

The take-away point for me in this thread on Protocol Orientation is this: Protocols are about _generalizing_. They're about the _interface_. It's about a mindset and a focus (an _orientation_) toward thinking of _ways_ to do certain things, and describing them clearly in the form of a Type in Swift.

Once the _way to do_ something is described, other things, concrete _Types_, can come along and implement those in an infinite variety of ways.

 [1]: https://www.reddit.com/r/swift/comments/4nme0c/eli5_what_does_protocol_oriented_programming_mean/
 [2]: https://www.reddit.com/r/swift/comments/4nme0c/eli5_what_does_protocol_oriented_programming_mean/d453ryv
 [3]: https://www.reddit.com/user/CodaFi
 [4]: https://www.andrewcbancroft.com/2016/02/15/fundamentals-of-callbacks-for-swift-developers/