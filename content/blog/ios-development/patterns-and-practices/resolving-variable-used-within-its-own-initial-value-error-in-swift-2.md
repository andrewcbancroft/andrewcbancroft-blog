---
title: Resolving “Variable used within its own initial value” Error in Swift
author: Andrew
type: blog
date: 2014-10-20T13:50:52+00:00
aliases:
  - /2014/10/20/resolving-variable-used-within-its-own-initial-value-error-in-swift-2/
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

---
While experimenting with a few things today, I experienced this compiler error:

> Variable used within its own initial value

Let me describe the situation I was in&#8230;

I was playing (in a playground, no less) with closures, trying to mimic some behavior that I&#8217;ve recently learned about in Scala.  Essentially, I was trying to implement a factorial function as a _closure_, and I was trying to do it _recursively_ (that is, without using a for/while loop).  Here&#8217;s what I wanted to do:

<pre class="lang:swift decode:true " title="Factorial Closure">let factorial = {
    (n: Int) -&gt; Int in
    if (n == 0) {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}</pre>

If you&#8217;ve seen factorial before, the above implementation isn&#8217;t new.  The &#8220;base case&#8221; that will let the recursion stop is the expression <span class="lang:swift decode:true  crayon-inline">if (n == 0)</span>, and the recursive case is in the <span class="lang:swift decode:true  crayon-inline ">else</span> block, where <span class="lang:swift decode:true  crayon-inline ">factorial</span> gets called _again_ within its own body&#8217;s definition.  Only problem is&#8230; this doesn&#8217;t work in Swift 1.0.

Apparently, the closure (which is being initialized and assigned to the constant named &#8220;factorial&#8221;) hasn&#8217;t had a chance to fully initialize itself before the name <span class="lang:swift decode:true  crayon-inline ">factorial</span> is used within the body.

The frustrating part is that <a title="Rob Napier on Immutability and Swift" href="http://robnapier.net/llama-calculus" target="_blank">I <em>really</em> didn&#8217;t want to type the letters v-a-r</a> to implement my solution.  But alas, as <a title="Stack Overflow - Handle Closure Recursively" href="http://stackoverflow.com/questions/25103534/how-to-handle-closure-recursivity" target="_blank">Stack Overflow</a> says, the following solution to the &#8220;initial value&#8221; error works:

<pre class="lang:swift decode:true " title="Factorial Closure - No Error">var factorial: (Int) -&gt; Int
factorial = {
    (n: Int) -&gt; Int in
    if (n == 0) {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}

factorial(5)
// Produces the correct result of 120</pre>

Of course, there&#8217;s absolutely no reason for the implementation to be a closure &#8211; I was simply experimenting.  Here&#8217;s the solution that I actually prefer&#8230; a good ole named function definition:

<pre class="lang:swift decode:true " title="Factorial Function">func factorial(n: Int) -&gt; Int {
    if (n == 0) {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}

factorial(5)
// Produces the correct result of 120
</pre>

&nbsp;