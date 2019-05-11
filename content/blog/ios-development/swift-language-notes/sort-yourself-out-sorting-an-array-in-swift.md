---
title: Sort It Out – Sorting an Array in Swift
author: Andrew
type: blog
date: 2014-08-16T18:06:26+00:00
aliases:
  - /2014/08/16/sort-yourself-out-sorting-an-array-in-swift/
dsq_thread_id:
  - "2932793065"
categories:
  - iOS / Mac
  - Swift
tags:
  - Sort Array
  - Sorted Function
  - Swift

---
I had a question come to me today&nbsp;regarding sorting an array of integers that are actually&nbsp;_encoded_ as strings in the array. &nbsp;Data comes to is in a variety of encodings/types, so it's quite common to need to adjust things to the right state for working with. &nbsp;Let's take a look at how to solve this one.

## The Dilemma

Given an array like this&#8230;

```swift
let arrayOfIntsAsStrings = ["103", "2", "1", "50", "55", "98"]
```

&#8230; the question arises: &nbsp;&#8220;How do I sort this in numerical order so that my output array is still an array of strings, but sorted like this&nbsp;`[&#8220;1&#8221;, &#8220;2&#8221;, &#8220;50&#8221;, &#8220;55&#8221;, &#8220;98&#8221;, &#8220;103&#8221;, &#8220;1000&#8221;]` (integer comparison), not this `[&#8220;1&#8221;, &#8220;1000&#8221;, &#8220;103&#8221;, &#8220;2&#8221;, &#8220;50&#8221;, &#8220;55&#8221;, &#8220;98&#8221;]`&nbsp;&nbsp;(string comparison)?&#8221; Enter Swift's `sorted`&nbsp;function:

> “Swift’s standard library provides a function called sorted, which sorts an array of values of a known type, based on the output of a sorting closure that you provide. Once it completes the sorting process, the sorted function returns a new array of the same type and size as the old one, with its elements in the correct sorted order. The original array is not modified by the sorted function.” Excerpt From: Apple Inc. “The Swift Programming Language.” iBooks. <a title="Swift iBook" href="https://itun.es/us/jEUH0.l" target="_blank">https://itun.es/us/jEUH0.l</a>

This is exactly what we need to do the job here.

## The Gist

Given the original array outlined above, we can create a new_&nbsp;sorted_ array like this:

```swift
let sortedArray = sorted(arrayOfIntsAsStrings, {
    (str1: String, str2: String) -&gt; Bool in
    return str1.toInt() &lt; str2.toInt()
})
```

This code produces our desired output: &nbsp;`[&#8220;1&#8221;, &#8220;2&#8221;, &#8220;50&#8221;, &#8220;55&#8221;, &#8220;98&#8221;, &#8220;103&#8221;, &#8220;1000&#8221;]`

## The&nbsp;Details

Swift's&nbsp;sorted function takes two arguments: &nbsp;an Array, and a Closure. &nbsp;The part that may be confusing is the closure argument. &nbsp;Isolated it looks like this:

```swift
{
    (str1: String, str2: String) -&gt; Bool in
    return str1.toInt() &lt; str2.toInt()
}
```

Swift&nbsp;provides several <a title="Apple Developer Documentation - Swift Closures" href="https://developer.apple.com/library/prerelease/mac/documentation/Swift/Conceptual/Swift_Programming_Language/Closures.html" target="_blank">shorthand forms of the closure syntax</a>, but I've chosen the longest-form here just for full exposure and clarity. &nbsp;The closure I've written simply needs to compute a&nbsp;Bool value representing the result of a comparison between two values&nbsp;– in this case, I'm wanting to do _integer_ comparison, so I write this: &nbsp;`str1.toInt()`&nbsp;and `str2.toInt()`.

You can choose whatever parameter names you'd like, and you can actually&nbsp;rely on Type Inference in the parameter section&nbsp;&#8212; the compiler can work out what Types your parameters are. &nbsp;But if it helps clue you in to what the code is doing, you can <a title="Clean Coding in Swift – Type Inference" href="http://www.andrewcbancroft.com/2014/08/12/clean-coding-in-swift-type-inference/" target="_blank"><em>specify</em> the Types in the closure's parameter section, as I wrote about recently</a>, and as I did in my example when I wrote `str1: String, str2: String`&nbsp;(I could have left off the `: String`).

Within the closure's body, you can put in as many lines of logic as are necessary in order to produce an appropriate comparison result to get your Array in the right order. &nbsp;If it gets _too_ complicated to do it in-line, think about encapsulating that logic inside one or more functions in the spirit of writing <a title="Clean Coding in Swift – Functions" href="http://www.andrewcbancroft.com/2014/08/07/clean-coding-in-swift-functions/" target="_blank">clean code</a>.

To produce an appropriate comparison result, you'll have to consider the Types of the data you're working with within the closure and consider any casting or manipulation you'll need to do to produce the correct result like we did in our example. Other than that, it's pretty straightforward to sort it&nbsp;out!