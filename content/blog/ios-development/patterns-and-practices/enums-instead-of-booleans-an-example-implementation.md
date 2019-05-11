---
title: Enums Instead of Booleans – An Example Implementation
author: Andrew
type: blog
date: 2015-04-01T12:00:52+00:00
aliases:
  - /2015/04/01/enums-instead-of-booleans-an-example-implementation/
dsq_thread_id:
  - "3645855326"
categories:
  - Swift
tags:
  - Boolean
  - Clean Code
  - Enum
  - Swift

---
This blog entry was inspired by [Objc.io's snippet titled &#8220;Enums instead of Booleans&#8221;][1]. I really loved the clarity that using enumerations brought to even the simplest of examples that was presented in that snippet. If you haven't seen it, check it out before continuing on!

Objc.io's snippet focused primarily on the definition and _consumption_ of the enumeration values. What I'd like to focus on here is the implementation of the thing that _produces_ those values for the switch-case that will consume them later on.


<a name="example-scenario" class="jump-target"></a>

### Example scenario

To put an example before us, consider the following scenario:

  * Suppose that we're building an app that utilizes a subscription-style service to deliver premium content.
  * Special things, such as providing access to the premium content, need to happen in the app if the user is a Subscriber in good standing.
  * Other things need to happen, such as denial of access to the premium content, if the user _had_ a subscription, but it's expired.
  * Finally, if the user has never had a subscription, we'd still like to deny access to the content, but perhaps offer them the opportunity to subscribe.

Using Objc.io's idea as a springboard, we could program this in a couple of ways:

<a name="booleans" class="jump-target"></a>

### 1 – We could define a few boolean properties throughout that would indicate the user's subscription status:

  * `isSubscriber`
  * `isSubscriptionExpired`
  * `isNonSubscriber`

What I find interesting about this approach is that it's not clear, from looking at the properties, that they're all mutually exclusive. Can I be a **subscriber** whose **subscription has expired**? If my **subscription expired**, am I a **non-subscriber**?

It could be that I've chosen poor names for the properties, but if I wanted to make clear that the statuses are mutually exclusive, there's a better way to encapsulate them. Objc.io helpfully pointed us in the direction of that better encapsulation method. Yep&#8230; you got it: enumerations!

<a name="enums-instead" class="jump-target"></a>

### 2 – As the title of the blog entry signals, we could replace the booleans with an enumeration:

```swift
public enum SubscriberStatus {
    case CurrentSubscriber
    case ExpiredSubscriber
    case NonSubscriber
}
```

Immediately, this clarifies the mutually exclusive part. Enumerations, by definition, expose mutually exclusive values. By defining the `SubscriberStatus` enumeration, I've made clear that my intent is to have someone be _either_ a `CurrentSubscriber`, an `ExpiredSubscriber`, or a `NonSubscriber`, but not combinations of each.

Not only that, but rather than including complicated branching logic when I need to determine someone's subscription status, I can simply switch-case over the enumeration possibilities and perform the appropriate behavior.

```swift
func checkSubscriberStatusForRegistrant(registrant: Registrant) {
    // We're coming to the definition of Registrant...
    // In fact, Registrant's implementation is the goal of this blog entry!

    switch (registrant.subscriberStatus) {
    case .CurrentSubscriber:
        showPremiumContent()
    case .ExpiredSubscriber:
        alertExpiredSubscription()
    case .NonSubscriber:
        offerSubscription()
    }
    
}
```

<a name="produce-enum-values" class="jump-target"></a>

### Producing the enumeration values

The one thing that left me scratching my head on at first was the part of the whole scheme that would _produce_ the enumeration values. In my example above, I've left out what the implementation of `Registrant` looks like.

When I'm consuming the enumeration values, I'm riding on the fact that `registrant.subscriberStatus` has some way of producing a correct `SubscriberStatus` for the registrant. But what does that look like? Well&#8230; here's one possibility:

```swift
public struct Registrant {
    public var subscriberStatus: SubscriberStatus {
        get {
            if (noSubscriptionOnFile()) {
                return .NonSubscriber
            }
            
            if (subscriptionOverdueForPayment()) {
                return .ExpiredSubscriber
            }
            
            return .CurrentSubscriber
        }
    }
    
    private func noSubscriptionOnFile() -> Bool {
        // Do what needs to be done to check if the registrant has a subscription on file or not
    }
    
    private func subscriptionOverdueForPayment() -> Bool {
        // Do what needs to be done to check if the registrant's subscription is overdue for payment
    }
}
```

So as you can see, the thing that _produces_ the enumeration values _does_ have some `if`s and `Bool`s in it. I couldn't really think of another way to do this. To simplify the readability of the `subscriberStatus` property's implementation, I've abstracted the more complicated computational logic for figuring out whether or not a subscription is on file or if the registrant is overdue for payment into functions.

Even though we do still have some `Bool`s to deal with, what we've gained (in my opinion) is clarity on the consumption end. To me, it's worth it to have the `Bool` logic buried in one spot so that throughout the rest of my app, I can deal with clear, understandable, enumeration values.

<a name="share" class="jump-target"></a>

 [1]: http://www.objc.io/snippets/12.html