---
title: How to Unwrap Multiple Optionals with One If-Let in Swift
author: Andrew
type: blog
date: 2017-04-19T17:25:41+00:00
aliases:
  - /2017/04/19/how-to-unwrap-multiple-optionals-with-one-if-let-in-swift/
dsq_thread_id:
  - "5741025689"
categories:
  - Swift
tags:
  - Swift
  - Swift Optionals

---
What do you do when you&#8217;ve got two (or more) optionals that you need to safely unwrap and work with?

# Code examples

Suppose that you&#8217;ve got two arrays, both of which are optional. What I want to do right now is walk through a couple of scenarios where I unwrap them at the same time and print them to the console with a single `if-let` statement.

First, watch _how_ it&#8217;s done to accomplish the goal of this article&#8217;s title. :]

Then, compare what you expected to be the print output, to the _actual_ output to make sure your understanding of how the syntax works is complete.

Ready?

## Scenario 1: Both arrays are initialized (non-nil)

<pre class="lang:swift decode:true " title="Set up optional arrays" >var greetings: [String]? = ["Howdy!", "Hello!"]
var salutations: [String]? = ["Hi!", "Hey!"]</pre>

<pre class="lang:swift decode:true " >if let g = greetings, let s = salutations {
    print(g)
    print(s)
}</pre>

**Output:**  
[&#8220;Howdy!&#8221;, &#8220;Hello!&#8221;]  
[&#8220;Hi!&#8221;, &#8220;Hey!&#8221;]

### Breaking it down

The syntax for unwrapping multiple optionals with a single if-let block is straightforward. It&#8217;s `if` followed by a series of `let [constantName] = [optionalName]` statements, separated by commas.

The output of this one is pretty much what you&#8217;d expect, too. The string form of the arrays is printed to the console window in Xcode or in your Playground.

## Scenario 2: One array is initialized (non-nil), and the other is nil

Now suppose that the arrays looked like this:

<pre class="lang:swift decode:true " title="Set up optional arrays" >var greetings: [String]? = ["Howdy!", "Hello!"]
var salutations: nil</pre>

<pre class="lang:swift decode:true " >if let g = greetings, let s = salutations {
    print(g)
    print(s)
}</pre>

Question: What do you think will be printed?

1) [&#8220;Howdy!&#8221;, &#8220;Hello!&#8221;] and &#8220;nil&#8221;  
2) Just [&#8220;Howdy!&#8221;, &#8220;Hello!&#8221;]  
3) Nothing will be printed

If you chose door number **3**, you&#8217;d be correct.

The if-let block between the {}&#8217;s is only executed if **both** `greetings` and `salutations` are non-nil.

# Takeaway

Unwrapping multiple optionals with a single if-let statement is pretty easy: `if` followed by a series of `let [constantName] = [optionalName]` statements, separated by commas.

The behavior is similar to using the `&&` operator in a normal `if` condition. It&#8217;s like saying &#8220;if this optional is non-nil AND this optional is non-nil, then do this&#8221;

If you expect to work with one of the optionals in the list even if the other is nil, you&#8217;re going to need to split that up into multiple if-lets:

<pre class="lang:swift decode:true " >if let g = greetings {
    print(g)
}

if let s = salutations {
    print(s)
}</pre>