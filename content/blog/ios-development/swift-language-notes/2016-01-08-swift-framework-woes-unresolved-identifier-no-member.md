---
title: Swift Framework Woes – Unresolved Identifier? No Member?
author: Andrew
type: blog
date: 2016-01-08T18:40:55+00:00
aliases:
  - /2016/01/08/swift-framework-woes-unresolved-identifier-no-member/
dsq_thread_id:
  - "4474007861"
categories:
  - Swift
tags:
  - Access Control
  - Framework
  - Swift

---
It&#8217;s the simple things that get us, isn&#8217;t it?

I was working on a simple little framework the other day, and I&#8217;d gotten things just how I wanted&#8230; or so I thought.

I was ready to test things out and import the framework into my real app.

`import MyShinyNewFramework`

Sweet! No build errors!

`// attempt to use things defined in the framework`

Not so sweet&#8230;

> Use of unresolved identifier &#8216;&#8230;&#8217;
> 
> Value of type &#8216;&#8230;&#8217; has no member &#8216;&#8230;&#8217; 

I scrunched my forehead, puzzled, and immediately it came to me.

`public` `public` `public` all the things! Or at least, the things that others need to use from the framework. :]

_Of course_ a framework&#8217;s usable API needs to be public, but I write far more code that doesn&#8217;t require thought of access control modifiers than code that _does_, so there&#8217;s always that initial head-scratching that happens when you&#8217;re to the point of testing and go, &#8220;WHAT?? Why is this not working??!&#8221;

#### Key Takeaway

Whenever you&#8217;re developing code (such as a framework) that&#8217;s intended to be used from the perspective of another Swift module, you need to include `public` before Types and functions that are intended to be &#8220;seen&#8221; and called from that other module. Otherwise, you&#8217;ll get those same fun compiler errors and join me in saying to yourself, &#8220;Doh! Yep&#8230; public&#8230; _again_.&#8221;