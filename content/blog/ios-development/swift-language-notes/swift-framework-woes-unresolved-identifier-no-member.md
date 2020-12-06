---
title: Swift Framework Woes – Unresolved Identifier? No Member?
author: Andrew
type: blog
date: 2016-01-08T18:40:55+00:00
url: /2016/01/08/swift-framework-woes-unresolved-identifier-no-member/
dsq_thread_id:
  - "4474007861"
categories:
  - Swift
tags:
  - Access Control
  - Framework
  - Swift
dispiosgettingstartedbadge: true

---
It's the simple things that get us, isn't it?

I was working on a simple little framework the other day, and I'd gotten things just how I wanted&#8230; or so I thought.

I was ready to test things out and import the framework into my real app.

`import MyShinyNewFramework`

Sweet! No build errors!

`// attempt to use things defined in the framework`

Not so sweet&#8230;

> Use of unresolved identifier &#8216;&#8230;'
> 
> Value of type &#8216;&#8230;' has no member &#8216;&#8230;' 

I scrunched my forehead, puzzled, and immediately it came to me.

`public` `public` `public` all the things! Or at least, the things that others need to use from the framework. :]

_Of course_ a framework's usable API needs to be public, but I write far more code that doesn't require thought of access control modifiers than code that _does_, so there's always that initial head-scratching that happens when you're to the point of testing and go, "WHAT?? Why is this not working??!&#8221;

#### Key Takeaway

Whenever you're developing code (such as a framework) that's intended to be used from the perspective of another Swift module, you need to include `public` before Types and functions that are intended to be "seen&#8221; and called from that other module. Otherwise, you'll get those same fun compiler errors and join me in saying to yourself, "Doh! Yep&#8230; public&#8230; _again_.&#8221;