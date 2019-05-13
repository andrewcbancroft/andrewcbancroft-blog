---
title: NSNotificationCenter vs Delegation – An Analysis
author: Andrew
type: blog
date: 2015-02-05T13:00:26+00:00
aliases:
  - /2015/02/05/nsnotificationcenter-vs-delegation-analysis/
dsq_thread_id:
  - "3487883394"
categories:
  - iOS / Mac
  - Swift
tags:
  - Delegate
  - NSNotificationCenter
  - Swift

---
In [Fundamentals of NSNotificationCenter in Swift][1], a [commenter asked][2] me to elaborate on a response I'd given to a dialog going on below the blog post. I had stated:

> If you need a more structured environment around your [instance]-to-[instance] communication, delegates &#8230; are probably a better choice [than NSNotificationCenter].

I've been thinking for some time since I responded with that comment. What _do_ I mean when I say "if you need a more structured environment&#8221;&#8230; What does that even look like? Why are delegates a better choice when I need such "structure&#8221;?

### Structured environment? What's that?

"Structured environment&#8221; may be a bit vague. Here's what I was thinking when I wrote it: At the time of the comment, I was imagining what a solution implemented with NSNotificationCenter, and a solution implemented with a delegate look like&#8230;.

### Questions

First, I tried to step into the role of each instance, and in a role-playing sort of way, ask:

  * As a **notifier** / **delegator** instance: "What do I expect to happen as I send this notification or invoke this method on my delegate? What clues from my execution context inform that expectation?&#8221;
  * As a **notifier** / **delegator** instance: "What control do I appear to have over the sequence of events that happen as a result of sending this notification or invoking this method on my delegate?&#8221;
  * As a **listener** / **delegate** instance: "What impact does acting on this notification or executing this delegate method have on the system as a whole?&#8221;

And then shifting out of the role-playing mentality, stepping back and asking a question of clarity:

  * "Which strategy seems to provide greater clarity and structure to the _entire application environment_?&#8221;
  * "Which strategy would most help another developer who might see this code and try to trace the logic and impact of the code?&#8221;

The measurement of a more or less "structured environment&#8221;, then, would be influenced by the answers to the questions of **expectations**, **perceived control**, **impact**, and **clarity**.

Let's explore some of those answers from the perspective of each communication strategy, starting with NSNotificationCenter.

### Answers from the NSNotificationCenter Perspective

With NSNotificationCenter as an instance-to-instance communication strategy, we have the following environment:  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Notification_Center_Environment.png" alt="Notification Center Environment" width="945" height="374" class="alignnone size-full wp-image-11252" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Notification_Center_Environment.png 945w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Notification_Center_Environment-300x119.png 300w" sizes="(max-width: 945px) 100vw, 945px" />][3]

Note that Listeners 1 to n may or may not exist. The graphic is assuming that 1+ Listener instances have "tuned in&#8221; to a particular notification key.

##### Expectations

What do I expect to happen? Well, the most reasonable thing I (as a "notifier instance&#8221;) can expect is for some other "listener instance&#8221; somewhere to tune in to the notification key I'm broadcasting. I have no way of knowing what would happen after that. It's up to the listener to do something intelligent with the notification that [x event] occurred. I, as a notifier, can expect nothing more.

##### Perceived Control

It appears that I, as a notifier, have no control over the sequence of events that would occur as a result of my broadcast. That's by design – the interaction between me and any listener is weak at best.

This can be a fantastic thing! There's freedom in saying "Hey! This happened!&#8221; and then being done. But it's also "less structured&#8221;, as I'm terming it.

##### Impact

The impact on the system as a whole has the potential to be significant. With NSNotificationCenter, it depends on how many listener instances there are and what each of them does in response to the notification. One could design the system to localize the impacts to the context of the listening instance. I've heard of and seen ugly situations that trigger cascading effects that make deciphering the impact of a notification much harder.

##### Clarity

We lose a good deal of clarity when heavy usage of NSNotificationCenter occurs in an application. There may be appropriate times to use NSNotificationCenter in your app. Keep in mind that it becomes much more difficult to sort out various interactions when more and more listener instances are responding a notification. Trying to reason about how the system as a whole arrived at its current state isn't as easy when NSNotificationCenter enters the picture. Other developers with less knowledge of the app as a whole would suffer from this loss of clarity.

### Answers from the Delegate Perspective

With a delegate, we have a significantly different strategy at hand. To put it before us:  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Delegate_Environment.png" alt="Delegate Environment" width="948" height="497" class="alignnone size-full wp-image-11251" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Delegate_Environment.png 948w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Delegate_Environment-300x157.png 300w" sizes="(max-width: 948px) 100vw, 948px" />][4]

##### Expectations

The delegation strategy deals with protocols. Protocols by nature give us reliable a way to&#8230;

1) Count on the implementation of needed/expected behavior, and  
2) Predict what the behavior of the adopter of that protocol will be. By practicing good naming conventions, I, as a delegator, find it reasonable to expect that invoking a method on my delegate will do whatever the name of that method implies.

##### Perceived Control

It would appear that as a delegator, I can control the sequence of events that need to take place by choosing when to invoke methods on my delegate. A strategy using NSNotificationCenter can only send out a notification into the ether, and hope that something acts on it. A strategy using delegation has a _delegate_ which adopts a protocol. Every method is at my disposal to call in whatever order makes sense.

##### Impact

The impact on the system as a whole still has the potential to be significant. Since there's one-to-one communication going on between a delegator and its delegate, the determining factor on how broad the impact is tends to lean on the design of the system as a whole. Design patterns that minimize or eliminate global state reduce this potentially broad impact.

One advantage that the delegation pattern has is that the delegate conforms to a protocol and a protocol, along with its specified methods, have _names_. However small that knowledge is, it could give us clues about what impact of executing the delegate's methods might have on the system.

##### Clarity

With the advantage of dealing with intelligently named protocols and clearly outlined method names, the delegation strategy would win the battle of clarity in my opinion. I can look at the delegator instance and say, "When execution of this instance's logic gets to this point, reliance on the delegate kicks in and [x, y, and z] happens. I can jump over to the delegate's implementation and say, "[x] does this, [y] does that, and [z] does this other thing.&#8221; Other developers with less knowledge of the app as a whole would enjoy this added clarity quite readily.

### In Summary

Here, I've analyzed NSNotificationCenter, side by side with the delegation pattern, by imagining myself in the role of each instance (notifier, listener | delegator, delegate). I assessed each strategy in terms of expectations, perceived control, impact, and clarity, attempting to shed light on what it means for an environment to be "more structured&#8221; or "less structured&#8221;. My hope was to shed light on my use of the term "structured environment&#8221;, and to share my thoughts on some of the implications of using each strategy.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/03/26/what-is-delegation-a-swift-developers-guide/" title="What is Delegation? – A Swift Developer’s Guide">What is Delegation? – A Swift Developer’s Guide</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/04/08/how-delegation-works-a-swift-developer-guide/" title="How Delegation Works – A Swift Developer’s Guide">How Delegation Works – A Swift Developer’s Guide</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/10/08/fundamentals-of-nsnotificationcenter-in-swift/" title="Fundamentals of NSNotificationCenter in Swift">Fundamentals of NSNotificationCenter in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/02/15/fundamentals-of-callbacks-for-swift-developers/" title="Fundamentals of Callbacks for Swift Developers">Fundamentals of Callbacks for Swift Developers</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/2014/10/08/fundamentals-of-nsnotificationcenter-in-swift/
 [2]: http://www.andrewcbancroft.com/2014/10/08/fundamentals-of-nsnotificationcenter-in-swift/#comment-1762533966
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Notification_Center_Environment.png
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Delegate_Environment.png