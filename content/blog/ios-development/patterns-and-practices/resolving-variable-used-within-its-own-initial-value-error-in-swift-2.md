---
title: Resolving “Variable used within its own initial value” Error in Swift
author: Andrew
type: blog
date: 2014-10-20T13:50:52+00:00
url: /2014/10/20/resolving-variable-used-within-its-own-initial-value-error-in-swift-2/
dsq_thread_id:
  - "3138185634"
categories:
  - Swift
tags:
  - Closures
  - Experiment
  - Factorial
  - Functional Programming
  - Recursion
  - Swift
dispiosgettingstartedbadge: true

---
While experimenting with a few things today, I experienced this compiler error:

> Variable used within its own initial value

Let me describe the situation I was in&#8230;

I was playing (in a playground, no less) with closures, trying to mimic some behavior that I've recently learned about in Scala.  Essentially, I was trying to implement a factorial function as a _closure_, and I was trying to do it _recursively_ (that is, without using a for/while loop).  Here's what I wanted to do:

```swift
let factorial = {
    (n: Int) -> Int in
    if (n == 0) {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}
```

If you've seen factorial before, the above implementation isn't new.  The "base case&#8221; that will let the recursion stop is the expression `if (n == 0)`, and the recursive case is in the `else` block, where `factorial` gets called _again_ within its own body's definition.  Only problem is&#8230; this doesn't work in Swift 1.0.

Apparently, the closure (which is being initialized and assigned to the constant named "factorial&#8221;) hasn't had a chance to fully initialize itself before the name `factorial` is used within the body.

The frustrating part is that <a title="Rob Napier on Immutability and Swift" href="http://robnapier.net/llama-calculus" target="_blank">I <em>really</em> didn't want to type the letters v-a-r</a> to implement my solution.  But alas, as <a title="Stack Overflow - Handle Closure Recursively" href="http://stackoverflow.com/questions/25103534/how-to-handle-closure-recursivity" target="_blank">Stack Overflow</a> says, the following solution to the "initial value&#8221; error works:

```swift
var factorial: (Int) -> Int
factorial = {
    (n: Int) -> Int in
    if (n == 0) {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}

factorial(5)
// Produces the correct result of 120
```

Of course, there's absolutely no reason for the implementation to be a closure – I was simply experimenting.  Here's the solution that I actually prefer&#8230; a good ole named function definition:

```swift
func factorial(n: Int) -> Int {
    if (n == 0) {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}

factorial(5)
// Produces the correct result of 120
```

&nbsp;