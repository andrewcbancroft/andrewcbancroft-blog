---
title: Every Developer is an API Designer
author: Andrew
type: blog
date: 2017-04-25T13:35:04+00:00
url: /2017/04/25/every-developer-api-designer/
dsq_thread_id:
  - "5758158260"
categories:
  - .Net Development
  - iOS / Mac
tags:
  - API Design
  - System Architecture

---
Every function; every class; every struct and enum and protocol is an API.

# YOU &#8212; are an API designer

As developers, we move into and out of the role of "API Designer&#8221; _constantly_.

Have you ever thought about that? _You_ are an API designer! You create Application Programming Interfaces _all the time_.

I believe that everything we create has design built in, whether we've thought much about it or not.

I don't know why that thought changed my mindset so much, but it did. Maybe it's because I always associated APIs with massive frameworks, standard libraries, and 3rd party code modules. It's as if I thought there was a special class of developer that did that work, and all my job entailed was putting the jigsaw puzzle together.

But when you and I design and create Types of any kind, be they data structures or functions, we ourselves, as "regular developers&#8221;, are in the business of creating APIs. We're building ways for ourselves and others to "connect&#8221; to and interact with our code&#8230; to interface with it and _use_ it in order to perform work.

You may be building these things for your team to use, or you may be building them for the future [you] to use. The fact is, we slip in and out of consuming _and creating_ APIs all the time.

# Being mindful of shifting roles

It's been helpful for me to recognize when I shift in and out of each role, because creating an API applies a different aspect of the programming mind than consuming an API does.

When you _create_ an API, you've got to be super conscious of your decisions. Types matter. Names matter. Inputs, outputs, dependencies and the like all matter when you're creating an API. **Why?**

Because other people (or you!) will have to deal with what you create in a direct way. Sure, everyone might be concerned about the implementation and whether or not it has bugs or not. But they'll be _most_ concerned about how to use the thing&#8230; the API&#8230; to get work done.

When we drop out of the mode of designing and creating APIs into API _consumer_ mode, we experience the ramifications of our API designs directly.

  * "Why is this property named _that_??&#8221;
  * "Does this function really need _all these parameters_?&#8221;
  * "This function returns _what_?&#8221;
  * "I wish this concept was represented as a \___ instead of a \___&#8230;&#8221;

When you're cognizant of what you're doing with respect to creating and consuming APIs, it's a huge help to your team and to [future you].

# APIs and team mates

I was working with a teammate, and we were having a discussion about the Type of a property in a class we were building together.

The original API was a property of Type `String`, and the name of the property was `FieldNames`. I thought to myself, "Huh&#8230; FieldName**s**&#8230; plural&#8230; Why is this Typed as a `String`? Either the name should be singular, or the Type should be switched out.&#8221;

We ended up switching that out to a Type that conveyed the idea of being able to store multiple things in that property.

The point? Something as small as the letter `s` and the Type of a property made a head-scratching difference in my understanding of the API. I didn't know how to use it until I asked. And that's a tiny bit dangerous if the person who built it isn't there to ask, anymore, right?

# #1 Takeaway

The number one takeway I want you to glean is this: Whether you realize it or not, if you're in the software development business, you're in the API design business. For me that meant becoming super conscious of the kind of code I'm writing, depending on which role I'm in as the keystrokes flow. Maybe this realization will impact you as well!