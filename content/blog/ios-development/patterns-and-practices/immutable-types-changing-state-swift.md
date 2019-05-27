---
title: Immutable Types with Changing State in Swift
author: Andrew
type: blog
date: 2015-01-06T12:00:50+00:00
url: /2015/01/06/immutable-types-changing-state-swift/
dsq_thread_id:
  - "3395120634"
categories:
  - iOS / Mac
  - Swift
tags:
  - Functional Programming
  - Immutability
  - Swift

---
Dabble in Swift for long and the functional programming paradigm will most certainly appear on your radar. From conferences to books to blog posts, I've seen a lot in the functional programming arena as it relates to Swift.

As I seek to improve my functional programming thought processes and to practice what I'm learning, I found myself struggling with a fundamental concept: **immutability**. _Especially_ when I'm designing something that, at the very least, _appears_ to require the ability to change state at some point in time.

### Immutable changes – A contradiction in terms?

Immutability and changing state was a real struggle for me. The two seemed contradictory actually. How am I supposed to handle changes with things that _can't change_??!

And then, with the help of Stack Overflow, a lightbulb came on. As I was perusing FP topics, I ran across a question that expressed exactly what I was feeling. ["How can you do anything useful without mutable state?&#8221;][1], the questioner asked. The answer is what illuminated things for me. The key quote from the Stack Overflow answer:

> In functional languages, rather than mutating the state of objects, we simply return a new object with the changes we want. 

So&#8230; instead of thinking about state changes as _mutations_, think of them as reasons to create something _new_.

### Getting practical with Swift

If I'm going to get pragmatic with this, I have some design decisions to make if I'm going to try and avoid mutating the state of my objects. Rather than design my Types with the intent to update stored properties in-place, I should think about designing them so that the state-change process would actually produce a whole _new_ instance with the transformed (updated) value.

### See it in action

I'm a visual person, so for those of you who need to see it in action like me, here's a short example: Suppose that you're designing a class that stores a counter (or a score or a total&#8230; something like that), and provides a function to let you increment that count.

### The mutating way

We could design this class in one of two ways: declare a variable stored property to hold the count. The method would then reassign incremented values to it. This is the _opposite_ of immutable changes:

    class Scorekeeper {
        var runningScore: Int
        
        init (score: Int = 0) {
            self.runningScore = score
        }
        
        func incrementScoreBy(points: Int) {
            runningScore += points
        }
    }
    
    let scoreKeeper = Scorekeeper()
    scoreKeeper.incrementScoreBy(5)
    println(scoreKeeper.runningScore)
    // prints 5
    
```
    <p></p>
    
    
    ### The immutable way
    
    
    OR, rather than mutating the existing variable, we could go an alternate route:  The second way to design the class is to declare a constant stored property.  The method would then produce _new_ instance that stored the new state:
    
    
        class Scorekeeper {
            let runningScore: Int
            
            init (score: Int = 0) {
                self.runningScore = score
            }
            
            func incrementScoreBy(points: Int) -> Scorekeeper {
                return Scorekeeper(score: self.runningScore + points)
            }
        }
        
        let scorekeeper = Scorekeeper()
        let scorekeeperWithIncreasedScore = scorekeeper.incrementScoreBy(5)
        println(scorekeeperWithIncreasedScore.runningScore)
        // prints 5
        
```
        <p></p>
        
        
        ### Observations
        
        
        As I look at the code I've just presented, I notice a few things as I contrast the two examples:
        
        
        
        
        
          * The first example uses var to declare the stored property of my Scorekeeper class.  It _has_ to be var so that the value of the property can be changed (mutated).
        
        
          * The second example uses let exclusively.  No in-place mutations occur, so constants are perfectly reasonable to use.
        
        
        
        * * *
        
        
        
        
        
          * The first example's design lends itself to produce interesting and unpredictable side-effects.  If multiple clients hold a reference to my scorekeeper instance, there are two ways for the runningScore to change out from underneath any of those clients:  First, I could simply reassign a value to the runningScore directly.  Second, I could call incrementScoreBy().  Either way, unintended consequences may arise because of the mutation.
        
        
          * In the second example, it's _impossible_ to cause those unintended consequences.  runningScore can't be changed directly (it's a constant), and incrementScoreBy() returns a whole _new_ instance, so all clients would be dealing with the instance that they expect to be dealing with.  No values can be changed out from underneath them.
        
        
        
        * * *
        
        
        
        
        
          * The first example's incrementScoreBy method has no return value.  While I can envision writing a unit test for this, it's not obvious at first glance what I should do.  The method produces a side-effect in my existing instance that I need to know about in order to get the XCTAssert right.
        
        
          * The second example's incrementScoreBy method returns a new Scorekeeper instance.  The unit test for this (to me) is a little more clear.  I simply inspect the value of runningScore of the new instance, and assert that it is [x] points higher than the old instance.  I still have both the old scorekeeper instance _and_ the new scorekeeperWithIncreasedScore, so everything I'd need to ensure the correct point increase occurred is at my disposal.
        
        
        
        ### Conclusion
        
        
        I hear so much benefit that comes from avoiding mutable state, so it was satisfying to finally let my mind reconcile how to manage the state of my own Types immutably.  With the iOS frameworks we have to work with, immutability is a challenge, and _total_ immutable state is not possible (think of the user interface layer where state is stored and updated out of necessity because of how _Apple's_ frameworks and tools are designed). Nonetheless, I found this discovery to be really exciting all the same.

 [1]: http://stackoverflow.com/questions/1020653/how-can-you-do-anything-useful-without-mutable-state