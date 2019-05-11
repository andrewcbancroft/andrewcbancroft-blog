---
title: Every Swift Value Type Should Be Equatable
author: Andrew
type: blog
date: 2015-07-01T18:07:35+00:00
aliases:
  - /2015/07/01/every-swift-value-type-should-be-equatable/
dsq_thread_id:
  - "3895788341"
categories:
  - Swift
tags:
  - Equatable
  - Swift
  - Value Types

---
As I listened to the WWDC15 talk on [Building Better Apps with Value Types in Swift][1] I was struck by a sentence that I had never dawned on me before:

> Every Value Type should be Equatable. 

That is, every Value Type should conform to the `Equatable` protocol.

Talk about a sweeping statement! Wow &#8211; _every_ Value Type should be `Equatable`? Hmm&#8230; Let&#8217;s unpack the &#8220;why&#8217;s&#8221; and &#8220;how&#8217;s&#8221; of this statement.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#why">Why?</a>
    </li>
    <li>
      <a href="#how">How?</a>
    </li>
    <ul>
      <li>
        <a href="#equality-properties">Properties of equality</a>
      </li>
      <ul>
        <li>
          <a href="#reflexive">Reflexive</a>
        </li>
        <li>
          <a href="#symmetric">Symmetric</a>
        </li>
        <li>
          <a href="#transitive">Transitive</a>
        </li>
      </ul>
      
      <li>
        <a href="#implementation">Implementation</a>
      </li>
      <ul>
        <li>
          <a href="#reference-types">Dealing with reference types</a>
        </li>
      </ul>
    </ul>
    
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="why" class="jump-target"></a>

### Why?

I&#8217;d never thought about why I might want my Value Types in Swift to be Equatable. Not that I thought it&#8217;d be a terrible idea to implement the `==` operator for a Type&#8230; I just never realized that this was actually _expected_ behavior of Value Types!

The reasoning in the talk was that Values are intuitively _meant_ to be compared for equality. _Because_ they&#8217;re _Values_, there is inherent expectation from clients of the Type to be able to ask and know if one Value is equal to another Value of the same Type.

We naturally expect to be able to ask two variables/constants, each holding `Int` Values (because in Swift, `Int` is a Value Type), if they equal each other. And we naturally expect the comparison to compare the actual _numbers_&#8230; the _Values themlselves_.

<pre class="lang:swift decode:true " title="Int comparison" >let a = 10
let b = 5 + 2 + 3
a == b // true

let x = 1
let y = 2
x == y // false</pre>

Likewise, we naturally expect to ask two Strings if _they&#8217;re_ equal:

<pre class="lang:swift decode:true " title="String comparison" >let str1 = "I love Swift!"
let str2 = "I love Swift!"
str1 == str2 // true


let str3 = "i love swift!"
str1 == str3 // false - case-sensitive comparison</pre>

In fact, we naturally expect to ask these kinds of equality questions about _any_ of the Swift standard library Value Types, don&#8217;t we?

<a name="how" class="jump-target"></a>

### How?

We _do_ expect to test for equality between two Value Types. It just makes sense.

So now the question is, &#8220;_How_?&#8221;

The simple answer is that our Value Types need to implement an `==` operator. But there&#8217;s something really important to consider:

<a name="equality-properties" class="jump-target"></a>

#### Properties of equality

To be truly equal, the `==` operator not only needs to be implemented, but it needs to be implemented in such a way that it _behaves_ as we&#8217;d expect when doing our comparisons. During the talk, Doug mentioned three important properties of equality that need to hold for our Value Types:

  1. The comparison must be **reflexive**
  2. The comparison must be **symmetric**
  3. The comparison must be **transitive**

That sounds awfully &#8220;math-y&#8221;. In fact, it&#8217;s the exact same terminology used in mathematics. But don&#8217;t worry, the terminology is simple and natural to understand.

<a name="reflexive" class="jump-target"></a>

##### Reflexive

To be reflexive, the Type&#8217;s `==` operator needs to make sure that the expression `x == x` returns `true`.

So if I have `let x = 1` and I write the expression `x == x`, I do in fact get `true` because `Int`&#8216;s equality operator is reflexive (as expected).

<a name="symmetric" class="jump-target"></a>

##### Symmetric

To be symmetric, the Type&#8217;s `==` operator needs to compute things in such a way that the expression `x == y` and `y == x` return the same value.

Here&#8217;s an example of symmetry:

<pre class="lang:swift decode:true " title="Symmetric" >let x = 1
let y = 1

x == y // true
y == x // true

let str1 = "Hi"
let str2 = "Hello"

x == y // false
y == x // false</pre>

<a name="transitive" class="jump-target"></a>

##### Transitive

Finally, to be transitive, the Type&#8217;s `==` operator needs to compute things in such a way that when `x == y` is `true`, and `y == z` is `true`, then `x == z` is also `true`.

Here&#8217;s an example of transitivity:

<pre class="lang:swift decode:true " title="Transitive" >let x = 100
let y = 50 + 50
let z = 50 * 2

x == y // true
y == z // true
x == z // true</pre>

<a name="implementation" class="jump-target"></a>

#### Implementation

_Most_ of the time, the implementation of `==` is very simple. If your Value Type is comprised of other Value Types that have an `==` operator that&#8217;s correctly implemented with the semantics I just described, then the implementation for your Type is straight-forward.

An example might help to set things up for understanding. Suppose that we&#8217;re building a sight-seeing app for a local tourism company. We&#8217;ve got a struct called `Place` to help us encapsulate the idea of&#8230; well&#8230; a &#8220;place&#8221; to visit. It looks something like this:

<pre class="lang:swift decode:true " title="Place.swift" >struct Place {
    let name: String
    let latitude: Double
    let longitude: Double

    // init is auto-generated by the compiler in this case
}</pre>

Since `Place` is a Value Type (Struct) which is comprised of other Value Types, you&#8217;d simply need to do something like the following to make it `Equatable`:

<pre class="lang:swift decode:true mark:1,4-6" title="Implement ==" >extension Place: Equatable {}

func ==(lhs: Place, rhs: Place) -> Bool {
    let areEqual = lhs.name == rhs.name &&
        lhs.latitude == rhs.latitude &&
        lhs.longitude == rhs.longitude
    
    return areEqual
}</pre>

One of the first things to notice is that the `==` operator has to be implemented as a stand-alone _global_ function, rather than as part of the Type definition.

Notice also that even though we have the source for the Type that we want to make `Equatable`, I chose to signal the `Equatable` protocol adoption through an _extension_ on the Type, rather than at the Type declaration itself. Both are acceptable, but it&#8217;s become convention to use the extension strategy for this particular protocol.

The implementation of `==` uses the intuitive semantics that one `Place` isn&#8217;t the same as another `Place` unless the `name`s, `latidude`s, and `longitude`s are all the same.

`lhs` and `rhs` simply mean &#8220;left-hand side&#8221; and &#8220;right-hand side&#8221;, respectively. Since there&#8217;s a `Place` instance on the left-hand side of the `==` operator, and a `Place` instance on the right-hand side of the `==` operator when we use it in practice, it makes sense to label these parameters according to that pattern.

The implementation could literally be read as, &#8220;If the `Place` on the left-hand side&#8217;s `name` is equal to the `Place` on the right-hand side&#8217;s `name`, AND &#8230; the `latitude` &#8230; AND &#8230; the `longitude`, then the two `Place` instances are equal.&#8221;

<a name="reference-types" class="jump-target"></a>

##### Dealing with reference types

If Reference Types are involved with your Value Type implementation, things could get a little more complicated. &#8220;Complicated&#8221; probably isn&#8217;t the right word&#8230; but you do have to _think_ a little more about your Type&#8217;s equality semantics.

Let&#8217;s modify the example just a little bit:

Supposing that `Place` had an additional property called `featureImage` which held a reference to a `UIImage` instance (a Reference Type), we&#8217;d need to test for equality a little bit differently. And _how_ we test for equality depends on the particulars of our Type&#8217;s equality semantics:

  * Are the two `Place`s equal if both of them point to the same `featureImage` (ie, should we just use `===` to check and see if the references are the same)?
  * OR, are the two `Place`s equal if both of their `featureImage` instances contain the same underlying bitmap (ie, they&#8217;re the same picture in _essence_)?

As you can see, the phrase &#8220;it depends&#8221; applies here. Certainly we need to test for _some_ kind of equality on the `featureImage` in order to have a complete `==` implementation. But how we go about it really comes down to the semantics that you and others would expect from asking the question, &#8220;Is this `Place` equivalent to that `Place`?&#8221;

For this example, I&#8217;m going to go with the latter statement: that two `Places` are equal if both of their `featureImage` instances contain the same underlying bitmap.

<pre class="lang:swift decode:true mark:7" title="Implement ==" >extension Place: Equatable {}

func ==(lhs: Place, rhs: Place) -&gt; Bool {
    let areEqual = lhs.name == rhs.name && 
            lhs.latitude == rhs.latitude &&
            lhs.longitude == rhs.longitude &&
            lhs.featureImage.isEqual(rhs.featureImage) // depends on your Type's equality semantics

    return areEqual
}</pre>

### Wrapping up

Every Value Type should conform to the `Equatable` protocol. In this article, we unpacked the &#8220;why&#8217;s&#8221; and the &#8220;how&#8217;s&#8221; of this fundamental characteristic of Value Types. From here, we&#8217;ve all got to jump on board and ensure that we meet this expectation in our code!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/12/02/send-a-type-to-obedience-school-using-swift-extensions-for-additional-protocol-conformance/" title="Send a Type to Obedience School – Using Swift Extensions for Additional Protocol Conformance">Send a Type to Obedience School – Using Swift Extensions for Additional Protocol Conformance</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://developer.apple.com/videos/wwdc/2015/?id=414