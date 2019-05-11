---
title: The Case for CloudKit
author: Andrew
type: blog
date: 2018-08-06T11:58:32+00:00
aliases:
  - /2018/08/06/case-for-cloudkit/
categories:
  - Swift
tags:
  - CloudKit

---

When it comes to remote backend services for mobile apps, you’ve got options. What's the case for CloudKit? Where does Apple's remote data storage and sharing solution fit into the Apple Developer's toolbox?

I recently put out a survey on Twitter, just to get a feel for what folks are using.<figure class="wp-block-embed-twitter wp-block-embed is-type-rich is-provider-twitter"> 

<blockquote class="twitter-tweet" data-width="500" data-dnt="true">
  <p lang="en" dir="ltr">
    <a href="https://twitter.com/hashtag/iosdev?src=hash&ref_src=twsrc%5Etfw">#iosdev</a> folks: When your app needs a backend (ie, a remote server / remote database), what do you use?
  </p>
  
  <p>
    I’m also interested in the “why” – reply with a tweet if you care to share! Thanks! 🙌🏻
  </p>
  
  <p>
    &mdash; Andrew Bancroft (@andrewcbancroft) <a href="https://twitter.com/andrewcbancroft/status/1020265988561022976?ref_src=twsrc%5Etfw">July 20, 2018</a>
  </p>
</blockquote>
  
</figure> 

The clear winer was Firebase, followed by folks implementing their own backend server architecture. Dead last? A tie between Realm and CloudKit.

”Hmm&#8230;”, I thought, “What’s up? Why no love for CloudKit?&#8221;

Of the options on my own survey, I’ve had experience building apps using three of the four: CloudKit, Firebase, and “rolling my own backend” with an app built for my employer.

So I asked myself, “When would _you_ use CloudKit, Andrew?”

Here’s how I tend break it down. The more of these that apply to you and your app development experience, the stronger the case for using CloudKit (in my opinion):

<a class="jump-target" name="apple-platforms-only"></a>

# Apple Platforms Only? CloudKit.

If you're developing _solely_ for Apple's platforms, CloudKit is the natural choice.

One of the other CloudKit alternatives mentioned in the survey might have the upper hand if you're developing for Android as well, but if you're sticking to the Apple ecosystem, it makes sense to use their remote data storage and sharing service (ie, CloudKit).

<a class="jump-target" name="cloudkit-js"></a>

# Expand Beyond Apple Platforms with CloudKit JS

Even if you're _not_ developing solely for Apple's platforms, CloudKit might still be a viable choice for you!

Apple designed [CloudKit JS][1] to create companion web apps to your iOS and macOS apps. You must have an existing CloudKit app and enable web services to use CloudKit JS, but once you've got an Apple app configured, you can leverage CloudKit in the web version of your app if you have one.

As I engaged with folks on Twitter about this, I learned that some were even leveraging CloudKit in an Android app using CloudKit JS as a bridge into the Apple ecosystem.

This opens up the audience for your app tremendously!

<a class="jump-target" name="authentication"></a>

# Built-in Authentication: CloudKit.

If you're tired of creating sign up and login screens, look no further than CloudKit.

This is especially true if you're only worrying with developing for Apple's Platforms.

Users signed in with an Apple ID are automatically authenticated when your app uses CloudKit.

Kiss the sign up/login screens goodbye!

<a class="jump-target" name="free-longer"></a>

# CloudKit is Free for Longer

All of the backend as a service providers offer a free tier or a free trial, and while I don't have personal experience with these services' payment threshholds, it's my observation that CloudKit's free tier might &#8220;last longer&#8221;. What do I mean by that?

  1. Data of any kind stored in a user's _private_ database doesn't count against your app's storage alotment&#8230; it counts against the _user's_ iCloud storage plan. This extends the mileage of your _app's_ storage alotment.
  2. CloudKit distinguishes between storage for _non-binary data_ and storage for _media_ (binary data like images, videos, audio, etc). You [start off with][2] 100 MB of non-binary data storage, but **10 GB** of image/video/audio/etc. storage. In contrast&#8230; 
      * Firebase [starts to charge you][3] $25/mo after **5 GB** of media storage
      * Realm Platform [offers a 30 day free trial][4], but is $30/month after that, and acts primarily as a remote data store for non-binary data.
  3. As the number of users for your app grows, your storage and transfer limits scale with your app's user base. I don't have personal experience here, but I wonder&#8230; by the time your app grows to 100,000 users (the tipping point for Apple to scale your app's alotments up), how probable is it that you'd already be paying to use Firebase?

<a class="jump-target" name="own-backend"></a>

# Rolling Your Own Backend? Consider CloudKit.

Folks already invested in Realm or Firebase are already leveraging a backend as a service platform. It's those that are maintaining backend server infrastructure _themselves_ that I might suggest consider CloudKit.

I've been in the shoes of those who have to roll their own backend server and maintain those VMs, databases, web servers&#8230; the works.

Many times this is because there's a need to connect a mobile app to an organization's on-premise/public cloud ecosystem, and for that, I can totally empathize.

CloudKit offers a reliable alternative that organizations developing for Apple's platforms should consider. It's a huge weight off the shoulders to abstract the backend and let Apple maintain those servers and storage components. Data stored in the **public** cloud database _is_ accessible programmatically, so your organization _can_ get at data stored there for incorporation into its internal ecosystem.

<a class="jump-target" name="first-party-only"></a>

# Company Requirement: 1st Party Frameworks and Services Only? CloudKit.

This requirement is most likely to be seen within companies and organizations that have an aversion to bringing in a lot of 3rd party dependencies.

Those of us who have an employer or who work for clients that have a say in what our app development toolkit can consist of may need to consider options within the Apple ecosystem.

CloudKit is a dependable choice for risk-averse companies.

Speaking of risk aversion&#8230;

<a class="jump-target" name="third-party-risk-aversion"></a>

# Personal 3rd Party Risk Aversion&#8230; CloudKit.

This one hits close to home for me, because I've experienced the pain of having a 3rd party service I depended on for _multiple apps_ be discontinued. &#42;Cough&#42; **[Parse][5]** &#42;Cough&#42;

I'm usually okay with 3rd party libraries, but 3rd party _services_ are another story altogether for me.

When you're using a library that ends up fading away, it may take a little reworking to get your code to compile with an alternative.

But when you've got data that your app depends on living on a remote server hosted by a 3rd party, and that service goes away&#8230; Oy! Talk about the pain, frustration, and hassle of having to do a _migration_ **on top of** rewriting code.

<a class="jump-target" name="only-need-data-store"></a>

# Only Need a Remote Data Store? Keep it Simple. CloudKit.

There is a _ton_ that can be done on-device these days. If all you're in the market for is a remote data store to facilitate data sharing across devices or with other users and have no need of remote cloud functions or analytics or remote machine learning services, etc., you might opt to keep it simple and leverage CloudKit.

<a class="jump-target" name="apple-uses"></a>

# Depend On What Apple Depends On: CloudKit.

What does Apple depend on for their own apps' remote data storage and sharing needs?

Answer: CloudKit.

Clearly, Apple is in a unique situation: Apple neither needs nor cares to develop any of its apps for Android. Naturally, they'd depend on the very framework they created. Otherwise, we could argue, &#8220;What a bunch of hypocrites!&#8221;, right?

CloudKit serves the needs of apps like Photos, iCloud Drive, Notes, News, and more.

It's almost as if Apple developed CloudKit for Apple, and decided, &#8220;Hey, let's open this up to our developers and let them tap in to what works awesome for us!&#8221;

I like that. I like the security of knowing that Apple depends on the framework they're delivering to us.

<a class="jump-target" name="tradeoffs"></a>

# Tradeoffs

In fairness, I would point out a few trade-offs if you were to go with CloudKit.

<a class="jump-target" name="no-android-support"></a>

## No Native Android support

This tradeoff is qualified with the words &#8220;no _native_ Android support&#8221; for a reason. CloudKit JS may actually open the door for folks developing cross platform apps, though it may take some hacking.

Expect some challenges on the Android side of things, but don't completely count CloudKit out.

<a class="jump-target" name="data-storage-only"></a>

## Data storage and sharing _only_ with CloudKit

With CloudKit, you get a fully-functional remote data storage and sharing service. If you're wanting to leverage some advanced functionality like &#8220;cloud functions&#8221;, analytics for your app, non-Apple ID authentication, remote machine learning services, and the like, you won't find those features in CloudKit.

This doesn't mean that Apple leaves you nanging when it comes to authentication, analytics, machine learning, etc.

Don't forget that you'll have built-in Apple ID authentication as I mentioned above, and analytics are provided through iTunes Connect.

On-device machine learning with CoreML might also alleviate the need to seek remote ML services.

If, after considering Apple's component solutions, you're looking for alternatives, Firebase offers all of the above as sort of an all-in-one package.

As I mentioned above though&#8230; if all you really _need_ is a remote data store for cross-device data syncing, don't over-complicate things. CloudKit can still serve you well.

Another alternative is to use a public cloud provider like Azure or AWS for &#8220;cloud functions&#8221; or remote machine learning. If you prefer to component-ize these kinds of services, this is a viable alternative to Firebase, or Apple's own solutions to these kinds of problems.

<a class="jump-target" name="feedback"></a>

# What do you use? Why?

I'm a pragmatist. I don't always use CloudKit. But I do like CloudKit when I can use it.

What do _you_ use? Why? What's your experience with backend as a service providers? What else would you consider in the case for CloudKit? What other tradeoffs do you recognize?

<a class="jump-target" name="share"></a>

 [1]: https://developer.apple.com/documentation/cloudkitjs
 [2]: https://developer.apple.com/icloud/cloudkit/
 [3]: https://firebase.google.com/pricing/
 [4]: https://realm.io/pricing
 [5]: https://blog.parseplatform.org/announcements/moving-on/