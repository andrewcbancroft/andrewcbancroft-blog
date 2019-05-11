---
title: Improvements to Unit Testing in Swift with Xcode 7
author: Andrew
type: blog
date: 2015-06-10T17:43:09+00:00
url: /2015/06/10/improvements-to-unit-testing-in-swift-with-xcode-7/
dsq_thread_id:
  - "3837810473"
categories:
  - Swift
tags:
  - Swift
  - Unit Testing
  - Xcode 7

---
One of the most exciting things that&#8217;s come out of WWDC 2015 is the fact that unit testing in Swift has been greatly simplified. The latest announcements have actually rendered a few of my articles on the subject obsolete, once Xcode 7 is in full circulation among the Swift developer community.

If you&#8217;re using Xcode 6.x, you may still find use in a couple of my previous articles:

  * [Swift Access Control – Implications for Unit Testing][1]
  * [Testability Tip for Swift Developers – Public Over Private][2]

If you&#8217;re jumping headlong into Xcode 7 world, setting yourself up for unit testing is incredibly simple. Essentially, all `internal` and `public` Types (and members of those Types) are visible to your unit test project when you import the module using the `@testable` keyword in front of the import. With Xcode 7, there&#8217;s no reason to change any of the access modifiers on your Types/members to support testing.

[@natashatherobot][3] has an [excellent 3-step write-up][4] that I won&#8217;t repeat here. To summarize though, you&#8217;ll simply&#8230;

  * Code your Types (classes/structs/enums) using the default `internal` access.
  * Add an import statement to the file containing your `XCTestCases`. There&#8217;s special syntax for this now: `@testable import AppName/ModuleName`
  * Begin unit testing with access to all `public` and `internal` Types and members!

 [1]: http://www.andrewcbancroft.com/2014/07/22/swift-access-control-implications-for-unit-testing/
 [2]: http://www.andrewcbancroft.com/2015/04/15/testability-tip-for-swift-developers-public-over-private/
 [3]: https://twitter.com/NatashaTheRobot
 [4]: http://natashatherobot.com/swift-2-xcode-7-unit-testing-access/