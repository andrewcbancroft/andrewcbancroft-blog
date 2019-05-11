---
title: Swift iOS Version Checking
author: Andrew
type: blog
date: 2014-09-18T04:44:36+00:00
aliases:
  - /2014/09/17/swift-ios-version-check/
dsq_thread_id:
  - "3028778485"
categories:
  - iOS / Mac
  - Swift
tags:
  - Check iOS Version
  - iOS 7
  - iOS 8
  - Swift

---
While iOS 8 is now officially in the wild, it may take a bit of time to reach the level of user adoption that iOS 7 had accumulated over the past year.  If you plan to target the widest number of users for your app (at least in these early days of the iOS 8 roll-out), it'd probably be wise to include iOS 7 in your target audience.

When accommodating iOS 7 users, you'll inevitably run into instances where you need to check which iOS version the device is running, so that you can implement a fall-back plan for older versions of iOS.

In Objective-C, I've seen this accomplished by using pre-processor directives, or with introspection.  Swift, however, <a title="Apple Developer Documentation - No Swift Preprocessor Directives" href="https://developer.apple.com/library/ios/documentation/Swift/Conceptual/BuildingCocoaApps/InteractingWithCAPIs.html#//apple_ref/doc/uid/TP40014216-CH8-XID_20" target="_blank">has no pre-processor directives in v1.0</a>, and <a title="Apple Developer Documentation - NSObject Protocol" href="https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Protocols/NSObject_Protocol/index.html" target="_blank">only objects which conform to the NSObject protocol</a> can utilize the <span class="lang:swift decode:true  crayon-inline ">respondsToSelector:</span> method call.  What to do?

As it turns out, <a title="Apple Developer Documentation - Conditionally Load Resources" href="https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/TransitionGuide/SupportingEarlieriOS.html#//apple_ref/doc/uid/TP40013174-CH14-SW1" target="_blank">Apple has guidance</a> that would actually work for both Objective-C _and_ Swift – It involves simply checking the <span class="lang:swift decode:true  crayon-inline ">NSFoundationVersionNumber</span> of the device against one of the pre-defined values defined in NSObjCRuntime.h.

To accomplish this in Swift, you can create a new Swift file (I called mine &#8220;iOSVersions.swift&#8221;) to hold the following code:

<pre class="lang:swift decode:true " title="iOSVersions.swift">let iOS7 = floor(NSFoundationVersionNumber) &lt;= floor(NSFoundationVersionNumber_iOS_7_1)
let iOS8 = floor(NSFoundationVersionNumber) &gt; floor(NSFoundationVersionNumber_iOS_7_1)</pre>

Whenever you need to check which iOS version the device is running, you can simply use the iOS8 / iOS7 constants that you just defined – they're accessible in other Swift files throughout your project:

<pre class="lang:swift decode:true" title="Elsewhere in your code">if iOS8 {
  //Do some iOS 8-specific things that may not be supported in older versions
} else {
  //Implement your fall-back plan for older versions of iOS
}</pre>

With these little snippets, you should be empowered to support iOS 7 while taking advantage of new iOS 8-only features and APIs.  You can also begin to move away from deprecated ways of doing things, while not breaking your app for iOS 7 users, so long as iOS 7 retains a significant slice of the iOS version pie.