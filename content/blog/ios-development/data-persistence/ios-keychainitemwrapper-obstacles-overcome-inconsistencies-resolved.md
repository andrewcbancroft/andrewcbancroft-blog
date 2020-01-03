---
title: iOS KeychainItemWrapper – Obstacles Overcome, Inconsistencies Resolved
author: Andrew
type: blog
date: 2014-05-21T18:20:56+00:00
url: /2014/05/21/ios-keychainitemwrapper-obstacles-overcome-inconsistencies-resolved/
spacious_page_layout:
  - default_layout
dsq_thread_id:
  - "2702877518"
categories:
  - iOS / Mac
  - Objective C
tags:
  - ARC KeychainItemWrapper
  - error code -25299
  - errSecDuplicateItem
  - KeychainItemWrapper
  - Reset iOS Simulator
  - result code -25299
disppsdatabadge: true
---

I had a major case of "struggleface&#8221; when trying to work with the <span class="lang:default decode:true  crayon-inline">KeychainItemWrapper</span>  for iOS.  I wanted it to be simple – just take a username and password and put it in the iOS Keychain for secure retrieval later.  Turns out that I had to spend an entire work day and do a lot of Googling to get it working so I'm posting this to try and bring all the pieces together.

#### Obstacle #1:  Automatic Reference Counting (ARC)

My project uses ARC for its memory management.  As it turns out, the <span class="lang:default decode:true  crayon-inline">KeychainItemWrapper</span>  class from Apple does not support ARC out of the box.  Step one for me should have been to find an ARC-friendly version of the class, but I had no idea until I got in there.  I attempted to retrofit the one provided by Apple, but there are a few nuances with toll-free bridging that I don't fully understand, so I went in search of someone who's already invented the wheel.  There's a GitHub Gist repository that provided exactly what I needed:  <a title="KeychainItemWrapper ARCified" href="https://gist.github.com/dhoerl/1170641" target="_blank">KeychainItemWrapper ARCified</a>

#### Obstacle #2:  Error Message Obscurity

Somehow in my novice experimentation with storing credentials in the keychain I ended up getting a <span class="lang:default decode:true  crayon-inline ">keychainItem</span>  on the keychain for a particular test user that couldn't be updated or removed.  I kept getting a cryptic error code (–25299) as I debugged the app when attempting to sign in with that user's credentials.  I spent&#8230;well&#8230;too long trying to find what the keychain error codes meant.

While I started off reviewing the <a title="Keychain Services Developer Documentation" href="https://developer.apple.com/library/ios/documentation/Security/Reference/keychainservices/Reference/reference.html" target="_blank">Keychain Services developer documentation</a> page, I didn't see the section describing the result codes.  <a title="Keychain Services Result Codes Section" href="https://developer.apple.com/library/ios/documentation/Security/Reference/keychainservices/Reference/reference.html#jumpTo_124" target="_blank">This is the section</a> that was most helpful in determining what "-25299&#8221; meant:  <span class="lang:default decode:true  crayon-inline ">errSecDuplicateItem</span>  – The item already exists.  In my case, the item was in there but the keychain search method didn't find it, so it tried to add it again, causing a "duplicate keychain item&#8221; error message.

#### Inconsistent Behavior

Eventually I got things to store to the keychain fine for _some_ test user accounts but my primary test account (the one I started with at the beginning of the day) still ran into the "duplicate keychain item&#8221; error no matter what I tried.  Signing out of my app didn't work.  Sending a <span class="lang:default decode:true  crayon-inline ">resetKeychainItem</span>  message to my <span class="lang:default decode:true  crayon-inline ">KeychainItemWrapper</span>  instance didn't work.  Even deleting the app from the simulator didn't work.  I ended up just needing to reset my simulator completely.  This was simple to do:

iOS Simulator -> Reset Content and Settings&#8230;

[<img class="alignnone wp-image-1051 size-full" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-21-at-12.59.48-PM.png" alt="Reset iOS Simulator's Content and Settings" width="295" height="208" />][1]

Things began to work perfectly after the reset.  Unfortunately, I spent the majority of the day spinning over the error message trying to find ways to programmatically either remove the <span class="lang:default decode:true  crayon-inline ">keychainItem</span>  or reset it so that it would no longer be a duplicate.  I'd have been finished hours earlier if I would have just reset the simulator.  In fact, _since_ I reset the simulator, I've been unable to reproduce the scenario I'd gotten myself into.  Otherwise I would list the obstacles I was trying to work through for the rest of the day as well.

As far as I can tell, it was all stemming from whatever I did at the beginning of the day to get the malformed <span class="lang:default decode:true  crayon-inline ">keychainItem</span>  in the keychain.  The simulator reset did the trick.

Commit.  
Breathe.  
Go home happy.

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2014/05/Screen-Shot-2014-05-21-at-12.59.48-PM.png