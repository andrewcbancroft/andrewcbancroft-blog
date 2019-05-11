---
title: What is Delegation? – A Swift Developer’s Guide
author: Andrew
type: blog
date: 2015-03-27T03:29:01+00:00
aliases:
  - /2015/03/26/what-is-delegation-a-swift-developers-guide/
dsq_thread_id:
  - "3630506788"
categories:
  - Swift
tags:
  - Delegate
  - Delegation
  - Swift

---
Of the major design patterns that are prevalent in iOS development, delegation is one that appears quite often. For many developers entering app development for the iOS platform, dealing with delegates is a new concept. It certainly was for me.

In my analysis of [NSNotificationCenter vs Delegation][1], I wrote some about delegation, but only in comparison to how `NSNotificationCenter` works. I haven't yet given delegation dedicated time and analysis, but I intend to do so now.

My aim in this blog entry is to try and make some sense out of the question, &#8220;What is delegation?&#8221;. Explore with me&#8230;


<a name="what-is-delegation" class="jump-target"></a>

### What is the delegation design pattern?

To read that &#8220;delegation is a design pattern that [insert explanation here]&#8221; never really clicked with me. Many who are new to programming have not dealt extensively with &#8220;design patterns&#8221;, so it doesn't always suffice to define delegation in those terms.

I suspect that since Swift has lowered the barrier to entry for iOS development, many who are new to the platform are also new to coding in general, so here's my attempt to explain what clicked for me regarding what delegation _is_:

<a name="design-pattern" class="jump-target"></a>

#### Design pattern

First, take the phrase &#8220;design pattern&#8221;.

**Design** implies architecture. It connotes a strategy for organizing something. Design conveys the method by which components will work together to accomplish an end.

**Pattern** implies that there is some repeatable process that has honed in around a common thread&#8230; a common practice&#8230; a predictable method for doing something. &#8220;Pattern&#8221; gives the impression that such a practice has converged over time into something that is now well-known, well-understood, and commonly used. I imagine a sort of &#8220;survival of the fittest&#8221; approach to process and practice. Things that didn't converge or that were weaker in the real world fell away and the strongest survived into this thing we call &#8220;pattern&#8221;.

A **design pattern** in software terms, then, is a method for architecting, strategizing about, and organizing an application's code in such a way that has been found to be commonplace, repeatable, and practically sound over time.

<a name="delegation" class="jump-target"></a>

#### Delegation

Now take the word delegation. Three things come to my mind:

  1. The verb, &#8220;to delegate&#8221;, meaning &#8220;to give control&#8221;
  2. The noun, &#8220;a delegate&#8221;, meaning &#8220;a person acting for another&#8221;
  3. The made-up noun, &#8220;a delegat_or_&#8220;, or more properly, a _principal_, meaning &#8220;a person who delegates to another&#8221;

In the real world, the word delegation encapsulates relationship and responsibility. A delegator/principal (noun) would delegate (verb) control or responsibility to another person called a delegate.

How could we map this to software? Well, it actually falls in line quite nicely.

Rather than _people_, we're dealing with instances of _classes_ (or other data structures like structs, but I'm just going to keep it simple and say &#8220;class&#8221; to encapsulate the idea). For delegation to occur in software, you'd have a situation where one class (a delegator/principal class) would delegate control or responsibility, here meaning behavioral logic, to another class called a delegate.

<a name="how-used" class="jump-target"></a>

### How is delegation used?

So yes&#8230; delegation is a design pattern. It's a design pattern that exists on other platforms, but it is one that has been heavily adopted by Apple and is ubiquitous throughout the iOS APIs. It's a design pattern that shifts responsibility from one class to another, thereby creating a separation of responsibilities and concerns. But what _kinds_ of responsibilities and concerns? How is delegation used in practice?

<a name="communication" class="jump-target"></a>

#### Communication

In practice, delegation is most often used as a way for one class to _communicate_ to another class. Observing some of the actions that delegates perform from Apple's own APIs give us clues about this. Take the following samples from `UITableViewDelegate` as an example:

  * tableView(_:**_will_SelectRow**AtIndexPath:)
  * tableView(_:**_did_SelectRow**AtIndexPath:)
  * tableView(_:**_did_HighlightRow**AtIndexPath:)

Or how about a sampling from `UIScrollViewDelegate`:

  * scrollView**_Did_Scroll**(_:)
  * scrollView**_WillBegin_Dragging**(_:)
  * scrollView**_WillEnd_Dragging**(_:withVelocity:targetContentOffset:)
  * scrollView**_DidEnd_Dragging**(_:willDecelerate:)

My observation of Apple's APIs indicates to me that one of the intended uses for delegation is to allow one instance to communicate back to some _other_ instance that something will/did happen. The table view or scroll view _delegates_ the opportunity to perform some action in response to some lifecycle event to another class, namely, its delegate.

It's also worth noting the scope of the communication that delegation is intended to be used for. Whereas `NSNotificationCenter` fits the need for one instance to broadcast a message intended for more than one listening instance, delegation fits the scenario where an instance only needs to send a message to a single listener (the delegate).

<a name="customization" class="jump-target"></a>

#### Customization

Another common usage for delegation is to provide a delegate instance the opportunity to customize certain aspects of the delegat_ing_ instance's internal state. Once again, clues from a few of Apple's APIs shed some light on this usage scenario. Let's look at `UITableViewDelegate` first:

  * tableView(_:**height**ForRowAtIndexPath:)
  * tableView(_:**editActions**ForRowAtIndexPath:)
  * tableView(_:**indentationLevel**ForRowAtIndexPath:)
  * tableView(_:**shouldHighlight**RowAtIndexPath:)

These are all customization-points that a `UITableView` allows its delegate to have a say in. _Some_ of the methods are so important that the table view can't display itself unless it gets this information from its delegate. The point here is that the table view is shifting responsibility for the implementation of that logic off to its delegate, allowing for greater controlled flexibility and customization.

### Wrapping up

With delegation being such a heavily utilized strategy for organizing an iOS application's logic, understanding what it is becomes key concern. In this article we unpacked the terms &#8220;design pattern&#8221; and &#8220;delegation&#8221; to get a grasp of why those words were chosen to describe the strategy. Finally, we looked at how the delegation pattern is used in practice, observing that two common use-cases for delegation: class-to-class communication and customization.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/04/08/how-delegation-works-a-swift-developer-guide/" title="How Delegation Works – A Swift Developer’s Guide">How Delegation Works – A Swift Developer’s Guide</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/10/08/fundamentals-of-nsnotificationcenter-in-swift/" title="Fundamentals of NSNotificationCenter in Swift">Fundamentals of NSNotificationCenter in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/02/05/nsnotificationcenter-vs-delegation-analysis/" title="NSNotificationCenter vs Delegation – An Analysis">NSNotificationCenter vs Delegation – An Analysis</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/02/15/fundamentals-of-callbacks-for-swift-developers/" title="Fundamentals of Callbacks for Swift Developers">Fundamentals of Callbacks for Swift Developers</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/2015/02/05/nsnotificationcenter-vs-delegation-analysis/ "NSNotificationCenter vs Delegation – An Analysis"