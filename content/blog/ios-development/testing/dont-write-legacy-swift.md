---
title: Don’t Write Legacy Swift
author: Andrew
type: blog
date: 2014-12-10T12:00:51+00:00
url: /2014/12/10/dont-write-legacy-swift/
dsq_thread_id:
  - "3309389611"
categories:
  - iOS / Mac
  - Swift
tags:
  - Swift
  - Unit Testing

---
“Legacy Swift”.&nbsp; Is that an odd phrase to you, too?

“Legacy” has connotations such as “old”, “difficult-to-change”, “outdated”, etc. Juxtaposing “legacy” and “Swift” would never have crossed my mind until I read Michael Feathers’, [Working Effectively With Legacy Code][1], where he asserts,

> <font face="Thread-00004318-Id-00000000">Legacy code is simply code without tests.</font>

What an impact those words had on me as I’ve transitioned over to Swift from Objective-C.&nbsp; If it’s true that legacy code is code without tests, it’s easy to see how you and I could be writing legacy Swift, even though Swift is a brand new language!

And whether you agree with Feathers’ definition of “legacy code” or not (he readily admits the potential for controversy with the definition), I think we can _all_ concede that unit testing our code has many benefits and leads to the ability to _consistently,_&nbsp;_objectively_ _verify_&nbsp; the quality of our code at the end of the day.

### Legacy Swift == Bad Swift

Unashamedly, Feathers writes,

> <font face="Thread-00004318-Id-00000000">Code without tests is bad code…With tests, we can change the behavior of our code quickly and verifiably. Without them, we really don’t know if our code is getting better or worse.</font>

<font size="6" face="Thread-00004318-Id-00000001">My take-away from that quote is this:&nbsp; The <em>only</em>&nbsp; way to consistently, objectively verify whether my code is getting better or worse is to execute it and see if the results are what I expected.&nbsp; I can do this in the Simulator / on my device, over and <em>over</em> <strong><em>and over</em></strong>, opening myself up to a never-ending, time-consuming, error-prone testing cycle, OR I can write automated unit tests and run them every time as I make incremental changes to my software.</font>

### Testing is hard (for me)

I have not always been the most successful at writing unit tests.&nbsp; Test-driven development (TDD) is difficult for me at times.&nbsp; I often find myself sitting, staring at the screen as if looking into an abyss, unsure of what I’m supposed to do next.&nbsp; (Any of you TDD-ers who’ve figured out how to imagine the structure of your production code _prior to it being written_ so that a test can be crafted _first_, let me know your tricks!)

I’m growing in this area of writing testable code, and the tests that go along with it.&nbsp; Admittedly, I’m still in the stages of “this is hard”, sometimes.&nbsp; 

I _have_ noticed, though, that coding and testing patterns are emerging in my toolbox that are making this process more and more fluid for me.

### Testing is worth it

However difficult it is for me, I’m on board with believing that the effort put in to writing tests is worth it in the end.&nbsp; I wrestle with my code to tame it with tests _from the start_.

If I’m unable to figure out test-first development on a particular problem, I strive to write the tests as jointly with my production code as possible.&nbsp; At all costs, I try to avoid writing the code and saying to myself, “I’ll come back to the tests later”, because I don’t trust myself to keep that promise.

With every product I’ve written and tested, I can testify to the fact that I feel good about that code.&nbsp; I know it works how I intended it to work.&nbsp; I rest assured that when I make changes, I haven’t broken anything I programmed in another session.&nbsp; The tests help me remember what I intended for my software to do.&nbsp; I’m confident that the patterns that evolved out of the tested code are better than what I’d have implemented if I did without the tests.&nbsp; It’s worth it.

### What kind of Swift will you write?

The main goal of this post was to get you thinking.&nbsp; Feathers got _me_ thinking, so I thought I’d pass along the challenge:&nbsp; Don’t write legacy Swift!&nbsp; 

The good news is that, as Feathers writes, 

> [Legacy code is code without tests] is a good working definition, and it points to a solution.

And that solution is straightforward:&nbsp; Begin writing tests for your code, and you’ll avoid writing legacy Swift.

<div class="related-posts">
  You might also enjoy</p> 
  
  <ul>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/07/15/how-to-create-mocks-and-stubs-in-swift/" title="How to Create Mocks and Stubs in Swift">How to Create Mocks and Stubs in Swift</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/07/22/swift-access-control-implications-for-unit-testing/" title="Swift Access Control – Implications for Unit Testing">Swift Access Control – Implications for Unit Testing</a>
    </li>
  </ul>
</div>

 [1]: http://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052 "Working Effectively With Legacy Code"