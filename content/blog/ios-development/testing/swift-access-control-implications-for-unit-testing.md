---
title: Swift Access Control – Implications for Unit Testing
author: Andrew
type: blog
date: 2014-07-23T04:04:43+00:00
aliases:
  - /2014/07/22/swift-access-control-implications-for-unit-testing/
spacious_page_layout:
  - default_layout
dsq_thread_id:
  - "2865870655"
categories:
  - iOS / Mac
  - Swift
tags:
  - Access Control
  - Swift
  - Unit Test
  - Use of unresolved identifier
  - XCode 6 Beta 4

---
If you find yourself with broken unit tests, failing to build with the error, “Use of unresolved identifier&#8230;”, you&#8217;re not alone!

### Unit Tests and Swift Access Control

When Swift access control came into the picture, we suddenly had a little more to consider. From the Apple docs:

Swift access control has three access levels:

  * private entities can only be accessed from within the source file where they are defined.
  * internal entities can be accessed anywhere within the target where they are defined.
  * public entities can be accessed from anywhere within the target and from any other context  
    that imports the current target’s module.

By default, most entities in a source file have internal access.  
So given the following&#8230;

  * Out of the box, your unit tests are part of a separate test target
  * The default access control for a class is _internal_, (meaning that if you do not explicitly specify an access control on the class / properties / functions, they&#8217;re marked internal behind the scenes)

&#8230; we now know why the unit tests break, unless we make a few tweaks:  classes marked internal are only seen _within a set of specified targets_ and our unit tests are in a separate target that our class is not a part of by default.

### Options

It seems to me that we have two options:

  1. Change the access control on our class to _public_.  Additionally, mark any methods we intend to test with _public_ also.
  2. Add the class(es) you want to be able to write unit tests for to the tests target.

### Solution

I found option #2 to be the easiest to implement at first. _However_, it turns out that this can lead to some [really obscure issues][1]. An [enlightening Twitter conversation][2] also shed some light on the subject, and pointed to the solution of testing only publicly accessible behavior that your Types expose, rather than trying to test internal implementation. That probably deserves a blog entry of its own, but for now, I’ll leave it to say that I’d recommend not adding your .swift source files to your test target, but rather to adjust the access control modifiers of the things you want to test to public (ie, Option # 1).

<div class="related-posts">
  You might also enjoy</p> 
  
  <ul>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/12/10/dont-write-legacy-swift/" title="Don’t Write Legacy Swift">Don&#8217;t Write Legacy Swift</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/12/29/getting-started-unit-testing-swift/" title="Getting Started with Unit Testing in Swift">Getting Started with Unit Testing in Swift</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/12/19/swift-unit-testing-resources/" title="Swift Unit Testing Resources">Swift Unit Testing Resources</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/12/16/tdd-ios-swift-whats-goal/" title="TDD for iOS in Swift – What’s the Goal?">TDD for iOS in Swift – What’s the Goal?</a>
    </li>
  </ul>
</div>

 [1]: https://github.com/Quick/Quick/issues/91
 [2]: https://twitter.com/modocache/status/549042409838219264