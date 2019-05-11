---
title: An (Almost) TDD Workflow in Swift
author: Andrew
type: blog
date: 2015-03-11T01:46:59+00:00
aliases:
  - /2015/03/10/an-almost-tdd-workflow-in-swift/
dsq_thread_id:
  - "3585019292"
categories:
  - Swift
tags:
  - Swift
  - TDD
  - Unit Test

---
There are times when it feels paralyzing to write tests _first_ before any production code is written. Even with good requirements documentation, I often find myself asking, &#8220;How am I supposed to write a test to verify **_x_** about some **_thing_** that doesn't exist in actual code yet?&#8221; It can be crippling.

The following is a workflow that's helped me grow in my test-first development skills. When I find myself staring at the screen, paralyzed because I'm &#8220;not supposed to write actual production code until the test is written&#8221;, I often turn to the workflow that I'm about to describe to help me break through to being productive. With practice and experience, I find myself needing this strategy less and less, but I've found it helpful to use this (almost) TDD workflow as a gateway into full test-first development.


<a name="setup" class="jump-target"></a>

### Set up side-by-side view: Test on left | Code on right

My starting place is to always have a test file open on the left, and the actual production code file that I want to write tests for on the right. This does a couple of things for me:

  1. It helps me avoid a lot of switching back and forth between tests and production code.
  2. It helps me keep tests at the forefront of my mind. Without seeing them in front of me, I could more easily forget about them. Having the split IDE keeps me conscious of the need to prioritize testing.

I recently [wrote about a technique to seed a Core Data database][1], and with that post, I [included a project called &#8220;Zootastic&#8221;][2] – a contrived app that modeled the storage and display of `Zoos` (along with `Animals` and their `Classifications`). I created a class called `DataHelper` which had several `seed()` methods. For the purposes of having an example before us, suppose that I wanted to test `DataHelper`. My screen might look something like this, with my tests on the left, and my `DataHelper` class on the right:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/12/TestsLeft_CodeRight-1024x208.png" alt="Test on the left | Code on the right" width="1024" height="208" class="alignnone size-large wp-image-11495" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/12/TestsLeft_CodeRight-1024x208.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/TestsLeft_CodeRight-300x61.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][3]

<a name="write-code" class="jump-target"></a>

### Write the actual production code

What I want is to insert 3 Zoo objects into the Core Data data store. But without the actual code before me, it's hard to imagine what the test(s) for that code might look like.

When I get stuck in this way, I'll go ahead and write the actual production code:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/12/WriteProductionCode-1024x264.png" alt="Write the production code" width="1024" height="264" class="alignnone size-large wp-image-11497" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/12/WriteProductionCode-1024x264.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/WriteProductionCode-300x77.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][4]

One important thing to remember is that you don't want to write a _ton_ of code in this step&#8230; just enough to spark your brain into figuring out what kinds of tests you can write. Write small increments of code. The more you write, the harder it will be to ensure you've covered the code and the various edge cases that may exist. Your goal is not to write the _app_. Your goal is to write a function, or a _part_ of the function – just enough to get you going with tests.

<a name="write-test" class="jump-target"></a>

### Write a test that will exercise the code

Having some real code with real class names and real function names usually helps me see what I need to do in terms of testing.

In the example I have going, I'd like my `seedZoos()` function to insert 3 `Zoo` objects into my CoreData data store.

At this point, it's pretty easy for me to think of the name of my first test. How about, `testSeedZoosInserts3ZooObjectsIntoDataStore()`:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/12/WriteTest-1024x385.png" alt="Write a test" width="1024" height="385" class="alignnone size-large wp-image-11498" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/12/WriteTest-1024x385.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/WriteTest-300x113.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]

<a name="comment-code" class="jump-target"></a>

### Comment out the production code so that the test will fail

Running the tests right now would produce a passing test. &#8220;Great!&#8221;, you say – but here's my issue with simply running the test, seeing it pass, and moving on _without_ ever having seen it fail:

There are _many_ ways to produce passing tests without actually verifying the results of executing the app's code.

  * I could write a test with no assert. That'd be silly, but forgetting that at the end would produce a green test – and it's easier to do than you think as you get rolling with these things. _Expecting_ the first time you run the test to produce a _failing_ test would alert you if you ran it the first time and saw a passing one. 
  * I could write a test that asserts the wrong thing and produces a false positive. Again, expecting &#8220;fail&#8221; at first would alert me if I saw &#8220;pass&#8221; at first.
  * Suppose I copied and pasted a test and intended to replace the implementation to test my new code. But I get distracted between when I pasted it and when I ran it for the first time. If I ran it, saw &#8220;pass&#8221; and moved on, the test wouldn't be doing its job – it'd be testing something that I already tested, and not these new lines of code I just produced!

The point is this: There are too many ways to write a test that doesn't truly test your code. Suffice it to say, you should _always_ make the test fail so that you know it's wired up to the right production code. Thus, this crucial step: **comment out the production code**. It'll ensure you get a failing test on the first run (if you're truly testing the right thing).

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/12/CommentProductionCode-1024x379.png" alt="Comment out the production code" width="1024" height="379" class="alignnone size-large wp-image-11492" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/12/CommentProductionCode-1024x379.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/CommentProductionCode-300x111.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][6]

<a name="run-test-fail" class="jump-target"></a>

### Run the test and verify that it fails

With the production code I just wrote commented out, I run the test. My expectation at this point is that it will _fail_, because the `seedZoos()` function does _not_ currently insert any `Zoo` objects into the data store.

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/12/RunTest_Fail-1024x380.png" alt="Run test - the test should fail" width="1024" height="380" class="alignnone size-large wp-image-11493" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/12/RunTest_Fail-1024x380.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/RunTest_Fail-300x111.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][7]

**If the test doesn't fail, something is wrong.** Check the basics: Did you include an assert at the end of the test? Are you exercising the right production code? Continue troubleshooting and re-running the test until it fails.

<a name="uncomment-code" class="jump-target"></a>

### Uncomment the production code so that the test will pass

Once I've been able to make the test fail, I uncomment the production code.

The idea here is that once the production code is now &#8220;live&#8221;, the test that's currently failing should _pass_, now that production code is performing appropriate logic to meet the test's assertion requirements. We know that the test currently fails, so if it passes _after_ we uncomment the production code, the only reason it could pass is because the production code is doing the right thing for that particular test's assertion. Nothing else about our work environment changed, so nothing else except the uncommented production code could have been the cause of the passing test.

Here's a view of the IDE in the state right before I run the test again to watch it pass:  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/12/UncommentProductionCode-1024x380.png" alt="Uncomment the production code" width="1024" height="380" class="alignnone size-large wp-image-11496" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/12/UncommentProductionCode-1024x380.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/UncommentProductionCode-300x111.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][8]

<a name="run-test-pass" class="jump-target"></a>

### Run the test and verify that it passes

The last step in this (almost) TDD workflow is to run the test one more time. This time it should pass:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/12/RunTest_Pass-1024x382.png" alt="Run test - the test should pass" width="1024" height="382" class="alignnone size-large wp-image-11494" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/12/RunTest_Pass-1024x382.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/12/RunTest_Pass-300x112.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][9]

**If the test _doesn't_ pass, then something is wrong.** Check the basics: Does the test assert the right thing? Does the production code perform correct logic that would satisfy the test's assertion? Continue troubleshooting and revise the necessary code until you have a passing test.

<a name="rinse-repeat" class="jump-target"></a>

### Rinse and repeat

You can perform this workflow as my times as you need. This is a stepping stone, so the hope is that eventually you'll be able to write the tests _first_. It takes a little practice, but using this technique has, in my experience, been a gateway to true Test Driven Development.

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/2015/02/25/using-swift-to-seed-a-core-data-database/
 [2]: https://github.com/andrewcbancroft/Zootastic
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2014/12/TestsLeft_CodeRight.png
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2014/12/WriteProductionCode.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2014/12/WriteTest.png
 [6]: http://www.andrewcbancroft.com/wp-content/uploads/2014/12/CommentProductionCode.png
 [7]: http://www.andrewcbancroft.com/wp-content/uploads/2014/12/RunTest_Fail.png
 [8]: http://www.andrewcbancroft.com/wp-content/uploads/2014/12/UncommentProductionCode.png
 [9]: http://www.andrewcbancroft.com/wp-content/uploads/2014/12/RunTest_Pass.png