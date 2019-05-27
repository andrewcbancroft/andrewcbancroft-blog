---
title: Considerations for Choosing 3rd Party Swift Libraries
author: Andrew
type: blog
date: 2015-10-27T18:04:09+00:00
url: /2015/10/27/considerations-for-choosing-3rd-party-swift-libraries/
dsq_thread_id:
  - "4265154671"
categories:
  - Swift
tags:
  - Cocoapods
  - Dependencies
  - Swift

---
While relying on 3rd party dependencies can provide you the benefit of not having to spend time implementing a portion of your app, realize that you’re essentially giving away little pieces of your app when you bring in a dependency.

You’re delegating away a certain level of control off to someone else who has no knowledge of or interest in the final outcome of your team’s app.

Adding dependencies to your project doesn’t come without cost, so it’s best to count that cost up front in order to make sure it’s a good idea to pursue this option.

If you are going to seek out modules of code from a 3rd party, what are some key assessment factors that could help you in this important decision?

Josh Brown wrote a [_really_ comprehensive list of questions][1] that guided me a lot in my own considerations of choosing a 3rd party library. I'm really grateful for his article – if you' haven't read it, go check it out!

My own list that follows takes a more categorical approach for those of us who think in box-like structures. I thought of at least four broad categories that we should think about and ask questions about when it comes to choosing our dependencies.

How can you avoid depending on bad Swift libraries? What are some markers of good ones? Let's find out!


<a name="community" class="jump-target"></a>

### Community matters

  * A good library has a good community surrounding it. Try using your favorite search engine to see what kind of content comes up for the dependency you’re thinking about. Search on StackOverflow to see what questions are being asked and what issues folks are running into, and what kinds of answers (if any) are being given.</p> 
  * Take a look at the GitHub stars and forks counts. Stars are a good way for developers to flag repositories that are interesting to them. Forks indicate potential contributors to the repository, since the typical flow is to fork the project, branch, publish the branch, and submit a pull request.

  * “Buzz” and “popularity” can come and go, but if folks are talking about the dependency you’re considering, that’s not a terrible sign. Unless what they’re talking about all the problems the library has, haha. In all seriousness, though, utilize social media and observe / ask around to see what other developers are saying about it before bringing it into your app.

<a name="maintenance" class="jump-target"></a>

### Maintenance matters

  * When was the last commit to the repository? If it was 5 years ago, this could be a red flag. Sure, it could just mean that the library is “done” and works great. But you and I both know that as the world of software moves forward, change is inevitable, and a library that doesn’t change with the times is more than likely doomed to failure. Checking the pulse of the repository on GitHub is one way to determine how well-maintained the library is.</p> 
  * How many issues are open? How many are being closed as resolved? Repositories with a lot of issues open could indicate an active community… unless those issues never get closed. In which case the indicator is a less positive one. Once again, GitHub’s Pulse feature will be a good guide even on figuring out how the repository owner is responding to issues that come their way.

<a name="documentation" class="jump-target"></a>

### Documentation matters

  * If a library has no documentation to speak of, how are we as developers supposed to figure out how to use it? The better and more exhaustive the documentation, the better the chances are that the library is worth surviving the candidate list to incorporate into your project</p> 
  * Even better is when the repository owner provides examples of how to use their library. Seeing examples will give you an idea of what’s possible, how nice the API is, and is overall a good reference point for integrating it with your own app. Documentation without examples is less valuable than documentation _with_ examples.

<a name="quality" class="jump-target"></a>

### Quality matters

  * If you're using CocoaPods, know that each CocoaPod that’s submitted to the central ‘Trunk’, as they call it, receives a quality index that is based on various pieces of analysis that can be done on the repository and on the code within the pod itself. Some of the analysis that’s done is based on some of the things I just discussed, such as GitHub stars, documentation, etc. A full list of how the CocoaPods quality index is assessed and assigned can be found at <https://guides.cocoapods.org/making/quality-indexes>

### Wrapping up

So there you have it – a few broad categories to think in terms of when trying to get direction on whether or not you should bring a given 3rd party library into your own Swift project.

Do you have other "box-like&#8221; categories that you use to guide your dependency decisions? Feel free to sound off in the comments with your thoughts!

<a name="share" class="jump-target"></a>

 [1]: http://roadfiresoftware.com/2015/08/save-your-future-self-from-broken-apps/