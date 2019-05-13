---
title: Why Do We Need to Annotate Escaping Closures in Swift?
author: Andrew
type: blog
date: 2017-05-11T17:58:46+00:00
aliases:
  - /2017/05/11/why-do-we-need-to-annotate-escaping-closures-in-swift/
featured_image: /wp-content/uploads/2017/05/WhyAnnotateEscapingClosures.jpg
dsq_thread_id:
  - "5808061893"
categories:
  - Swift
tags:
  - Closures
  - Swift

---
My last entry on [escaping closures][1] ended up having way more interaction than I anticipated! It goes to show that you never know what the impact of a piece of writing will have. But that's a different story&#8230; :]

Several readers commented here and on Medium with the question, "Why? Why do we need to mark escaping closures with `@escaping`?&#8221;



<a name="do-it-self" class="jump-target"></a>

# Do it yourself, compiler!

Observant minds looked at the compiler's ability to say, "Hey! This closure can escape – Annotate it with `@escaping`!&#8221; and asked, "Well&#8230; _why_?? If you, compiler, are smart enough to figure out that I need to annotate it, why can't you just deal with it automatically and let me go about my business?&#8221;

Good. Question.

And one that I didn't know the answer to. So I researched!

<a name="insight" class="jump-target"></a>

# Insight from the Swift gurus

As I dug around in the [Swift GitHub repository][2] and the [Swift Evolution list][3] I found [a quote from Chris Lattner][4] that stuck out:

> The compiler has enough logic in it to provide a great QoI (Quality of Implementation) experience when a developer doesn’t think about escaping, and tries to escape a closure – it can provide a fixit that suggests adding @escaping.&#8221; 

Did you catch that?

When the Swift compiler requires us to annotate our APIs with `@escaping`, that's its way of doing "quality of implementation&#8221;.

Essentially, it's a red flag saying, "You really ought to think about this whole escaping thing that you just introduced (whether you knew you were doing it or not)&#8230; it has significant impact on your implementation _and_ on the caller of your function!&#8221;

<a name="help" class="jump-target"></a>

# I see what you did there&#8230; Let me help you out&#8230;

The Swift compiler, for better or worse, wants to be very&#8230; "helpful&#8221;&#8230;

Some people hate it. I love it.

I _want_ to be told, "Hey, Andrew&#8230; you're about to break stuff – don't do that.&#8221;

I'd rather head off issues during development than at run-time.

<a name="how-helpful" class="jump-target"></a>

# How helpful is it, really?

But really&#8230; How helpful is this particular compiler error? What value does this fix-it option provide?

Try this: Think about what would happen if the compiler _didn't_ tell you about the possibility of your function's closure escaping.

I was working the other day, cruising along writing what I thought was perfectly normal code when I hit this "annotate your function's closure parameter with `@escaping`&#8221; error, myself.

"`@escaping`, Huh? What's that?!&#8221;

1 – I wasn't thinking about escaping closures because  
2 – I had no idea that I _could_ think about escaping closures!!

It turns out that this could have been really bad, agreed? Asynchronous behavior in software requires a little more thought than your normal top-down procedural approach.

If the compiler hadn't stopped me, I could have inadvertently imposed the need to think in terms of dispatch queues or asynchronous callbacks on the users of my API.

Is this only something that "newbies&#8221; need to have the compiler's help with though?

One could argue that I probably should have been aware of this particular feature of Swift &#8212; had I been a better developer, maybe I wouldn't need the compiler to hold my hand so much.

Okay – Fair point. That leads me to one last gleaning from Lattner's Swift Evolution entry that I'll comment on before wrapping up.

<a name="resilience" class="jump-target"></a>

# Writing resilient code

Let me reflect really quickly on one more quote from the [Swift Evolution entry][4] before I end for today.

> John McCall pointed out that resilience in the type system is different than resilience in practice: **An API changing to capture a closure and use it long after it was originally passed** is **likely to break the clients** regardless of whether the type system captures this as an issue. He argues (and the argument is strong IMO) it is _better_ for resilient APIs to default to @noescape, **since that forces the author of V2 to think about whether they are breaking their clients**. <small>(emphasis mine)</small> 

Resilience is all about how clients are affected when you _change_ the API or its implementation.

Suppose that a team mate of mine writes a function&#8230; [She's just created an API][5], true?

Suppose that the function asks for a closure, but for now it's just a regular old closure. No escaping or anything.

Others on my team are going to start coding against that function's signature. If the function is honest, it allows me and my team to have expectations about what it'll do when it executes.

Now suppose that I'm going to work on version 2 of that same API. Only _now_, I'm going to introduce the opportunity for that closure to [escape][1] (maybe intentionally, or maybe accidentally out of ignorance).

Thaaaat's gonna break my team. For sure.

They're using the API as it is expecting normal synchronous behavior from the function. Now _I've_ gone in and fundamentally changed what their expectations should be.

In other words, I haven't been very resilient.

The default behavior of closures passed to functions is to be `@noescape`. If I introduce the possibility for that closure to escape, I need to be red-flag warned about that, because I need to come up with some way to communicate this breaking change to the clients of the API. And/or provide an alternative so that clients of API v1 can still use it as expected.

Most of all, I need to **think** about the implications of what I'm doing, and sometimes (a lot of the times) that takes prompting.

<a name="bottom-line" class="jump-target"></a>

# The bottom line – The compiler is making you think

All of this to say: The compiler is making you think. Not only that, it's forcing you to conform.

From what I've found, that's the idea behind "why&#8221; we need to mark escaping closures with `@escaping` in Swift.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/04/26/what-in-the-world-is-an-escaping-closure-in-swift/" title="What in the World is an “Escaping Closure” in Swift?"</a>What in the World is an “Escaping Closure” in Swift?
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/2017/04/26/what-in-the-world-is-an-escaping-closure-in-swift/
 [2]: https://github.com/apple/swift
 [3]: https://lists.swift.org/mailman/listinfo
 [4]: https://lists.swift.org/pipermail/swift-evolution/Week-of-Mon-20160530/019880.html
 [5]: https://www.andrewcbancroft.com/2017/04/25/every-developer-api-designer/