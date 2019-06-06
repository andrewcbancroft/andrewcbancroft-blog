---
title: "First Impressions of NSPersistentCloudKitContainer"
description: "Outlines my initial impressions of NSPersistentCloudKitContainer and what excites me about building Core Data and CloudKit apps moving forward."
author: Andrew
type: blog
date: 2019-06-06T04:40:54+00:00
categories:
  - Core Data
  - CloudKit
wip: false
showrecent: true
---

<a name="resources" class="jump-target"></a>
<div class="resources">
<div class="resources-header">
Resources
</div>
<ul class="resources-content">
<li>
<i class="fas fa-link"></i> <a href="https://developer.apple.com/videos/play/wwdc2019/202" rel="nofollow">Using Core Data With CloudKit - WWDC 2019 Session 202</a>
</li>
<li>
<i class="fas fa-file-code"></i> <a href="https://developer.apple.com/documentation/coredata/synchronizing_a_local_store_to_the_cloud" rel="nofollow">Sample Project from Apple</a>
</li>
</ul>
</div>

## How NSPersistentCloudKitContainer Helps
I suppose the first question everyone should ask is, "What's the big deal?  How does `NSPersistentCloudKitContainer` even help me?"

I noted at least **three huge wins** from the <a href="https://developer.apple.com/videos/play/wwdc2019/202" rel="nofollow">WWDC 2019 session</a>.  Ask yourself...

1) "Do I want to figure out how to retrieve data from CloudKit and merge it with my local Core Data persistent store on my own?" -- No?  Me either. 😃

`NSPersistentCloudKitContainer` handles making a local replica of your app's CloudKit data.

2) "Do I want to implement synchronization schedluing and all the error handling that comes with CloudKit?" -- I *definitely* don't...  

`NSPersistentCloudKitContainer` handles scheduling CloudKit operations, and takes your `// handle errors` placeholder code (👀) and actually implements it the right way internally. #sweet

3) "Do I want to map between `NSManagedObjects` and `CKRecords` by hand?" -- Not if that could be automagic!

`NSPersistentCloudKitContainer` handles transforming your `NSManagedObjects` into `CKRecords` as well.

## Exciting Times
Apple did a lot of work to **encapsulate a very common set of code patterns** that were necessary for implementing an app with Core Data and CloudKit.

They claim to be able to **save us thousands of lines of code** (and I believe it!).

I have an app that uses Core Data locally. I've been wanting to enable CloudKit on, so that data is synced across my users' devices.  Every time I think about what it'll take to get the Core Data pieces talking the on the same wavelength as the CloudKit pieces, I just dread the inevitable headache that would ensue.  So I run away.  😬

My hope is to see what it's like to enable `NSPersistentCloudKitContainer` with that existing app.  I'll be sure to document the journey!

# Dipping a Toe In
Just a couple of tidbits about the setup process for getting started with this new class...

## Enabling Core Data + CloudKit
While it's not *absolutely* required to check these checkboxes, Xcode will provide you with some of the boilerplate code necessary for working with Core Data and CloudKit **together**.

![Check Use Core Data + CloudKit](enable-coredata-cloudkit.png)

## Starting Point
Xcode generates some code in your AppDelegate.swift file to initialize the Core Data Stack, only this time, instead of a standard `NSPersistentContainer`, it initializes the new `NSPersistentCloudKitContainer`:

{{< highlight swift "hl_lines=1-2" >}}

lazy var persistentContainer: NSPersistentCloudKitContainer = {
        let container = NSPersistentCloudKitContainer(name: "NSPersistentCloudKitContainer_First_Steps")
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                // Replace this implementation with code to handle the error appropriately.
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
        })
        return container
    }()
{{< / highlight >}}

## Not Ready Yet (more to enable)

#### Enable CloudKit Capability
Since you're working with CloudKit in this scenario, you still need to *enable* CloudKit so that your app has the appropriate **entitlements**, and so that your app's **CloudKit container** gets created in iCloud.

![Enable iCloud](enable-icloud.gif)

#### Enable Remote Notifications
CloudKit also uses Push Notifications to alert your app to data changes coming in from other devices.  To get these notifications, you need to enable the Remote Notifications capability for your app as well.

![Enable Remote Notifications](enable-remote-notifications.gif)

## Next Steps

When it comes to learning what to do next, <a href="https://developer.apple.com/documentation/coredata/synchronizing_a_local_store_to_the_cloud" rel="nofollow">Apple has provided a sample project</a> that I hope to examine and take apart.

More to come!