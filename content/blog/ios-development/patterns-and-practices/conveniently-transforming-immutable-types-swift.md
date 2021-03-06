---
title: Conveniently Transforming Immutable Types in Swift
author: Andrew
type: blog
date: 2015-01-20T12:30:51+00:00
url: /2015/01/20/conveniently-transforming-immutable-types-swift/
dsq_thread_id:
  - "3436977855"
categories:
  - Swift
tags:
  - Functional Programming
  - Immutability
  - Swift
dispiosgettingstartedbadge: true

---
A few weeks ago I wrote about [Immutable Types and Changing State in Swift][1], where I hoped to convey an "aha!-moment&#8221; that happened for me.

Since then, I've learned a bit more. For example, the technique I presented for transforming instances of a Type immutably actually come for free when you use a value Type, such as a Struct! Check out [@NatashaTheRobot's][2] writeup on the subject, titled ["Mutating Functions in Swift Structs&#8221;][3], for more information.

But let's say, for whatever reason, you'd like to use a _reference_ Type, such as a Class. In that case, the technique I presented in the aforementioned blog entry works out quite nicely. _Until&#8230;._

### Many init parameters == Pain

&#8230; It works great right up until you have more than a few immutable properties that you need to transform.

I want to thank [@Jarsen][4] for his [comment][5]. He pointed out the exact pain point I was feeling, since I was actually using my own advice in a personal project. Not only that, he offers a solution in the form of a [GitHub gist][6]!

I'm bringing in his example so that we have it before us with a few minor modifications to make it relevant for this blog entry. However, I want to give 100% credit to Jarsen for his insight.

### It's all about convenience

The gist of Jarsen's solution was to create a second helper initializer which would help setting the values for all the properties easier. Take a look:

```swift
class Scorekeeper {
    let runningScore: Int
    let climbingScore: Int
    // potentially more properties
    
    init(runningScore: Int = 0, climbingScore: Int = 0) {
        self.runningScore = runningScore
        self.climbingScore = climbingScore
    }
    
    // second helper initializer
    init(scoreKeeper: Scorekeeper, runningScore: Int? = nil, climbingScore: Int? = nil) {
        self.runningScore = runningScore ?? scoreKeeper.runningScore
        self.climbingScore = climbingScore ?? scoreKeeper.climbingScore
    }
    
    func incrementRunningScoreBy(points: Int) -> Scorekeeper {
        return Scorekeeper(scoreKeeper: self, runningScore: self.runningScore + points)
    }
    
    // other functions to transform Scorekeeper by incrementing other score properties
}
```

Note the use of optionals, and the corresponding nil-coalescing operator (`??`) in the helper initializer's implementation. It's simple, _and_ it's concise. I like it!

The bottom line is that I couldn't help but share Jarsen's tip. I thought it deserved a little more attention than to be stuck down in the comment section where folks may or may not find it and be helped.

 [1]: http://www.andrewcbancroft.com/2015/01/06/immutable-types-changing-state-swift/
 [2]: https://twitter.com/NatashaTheRobot
 [3]: http://natashatherobot.com/mutating-functions-swift-structs/
 [4]: https://twitter.com/Jarsen
 [5]: http://www.andrewcbancroft.com/2015/01/06/immutable-types-changing-state-swift/#comment-1788688298
 [6]: https://gist.github.com/jarsen/41de7401d49cd2348e5f