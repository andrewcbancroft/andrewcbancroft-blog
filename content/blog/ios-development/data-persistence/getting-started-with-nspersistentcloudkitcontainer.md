---
title: "Getting Started With NSPersistentCloudKitContainer"
description: "Provides a walkthrough and example project for saving and syncing a single Core Data Entity with CloudKit using NSPersistentCloudKitContainer"
author: Andrew
type: blog
date: 2019-06-11T04:40:54+00:00
categories:
  - Core Data
  - CloudKit
tags:
  - NSPersistentCloudKitContainer
wip: true
showrecent: true
images:
  - images/social-assets/Twitter - Getting Started With NSPersistentCloudKitContainer.png
  - images/social-assets/Facebook - Getting Started With NSPersistentCloudKitContainer.png
toc: true
introtext: "What is it like to sync data from Core Cata to iCloud using Apple's new NSPersistentCloudKitContainer?  Here I provide a walkthrough and example project for saving and syncing a single Core Data Entity with CloudKit using this new class."
---

## First Things First

* In order to use `NSPersistentCloudKitContainer` in your app, you need to be targeting iOS 13+.
* The CloudKit syncing portion only works on physical devices (not in the simulator).  That being the case, you'll need two devices running the app to fully test things out and make sure syncing and data merging behavior works as you'd expect it to.

The goal of this walkthrough is to provide you with a fully-working example of performing and synchronizing create, read, update, and delete operations using `NSPersistentCloudKitContainer`.  

I want you to have something between what was demonstrated in <a href="https://developer.apple.com/videos/play/wwdc2019/202" rel="nofollow">WWDC 2019 Session 202 - Using Core Data With CloudKit</a>... something beyond saving a list of timestamps, but something less complicated than <a href="https://developer.apple.com/documentation/coredata/synchronizing_a_local_store_to_the_cloud" rel="nofollow">Apple's example project</a> which ends up having you work with multiple managed object contexts.

<a name="resources" class="jump-target"></a>
<div class="resources">
<div class="resources-header">
Resources
</div>
<ul class="resources-content">
<li>
<i class="fas fa-file-code"></i> <a href="" rel="nofollow">Blog Idea List Example Xcode Project</a>
</li>
<li>
<i class="fas fa-link"></i> <a href="https://developer.apple.com/videos/play/wwdc2019/202" rel="nofollow">Using Core Data With CloudKit - WWDC 2019 Session 202</a>
</li>
</ul>
</div>

## Setup
The easiest way to get stareted with `NSPersistentCloudKitContainer` is to enable Core Data and CloudKit when you start your new project.

![Enable Core Data and CloudKit](enable-core-data-cloudkit.png)


### The Core Data + CloudKit Stack
Xcode provides the Core Data Stack code you need in the usual location: in the AppDelegate.swift file.

There's one notable difference though.  Instead of initializing a normal `NSPersistentContainer`, Xcode uses the new `NSPersistentCloudKitContainer` (this is why it's important to check the CloudKit box when you create your app).

![NSPersistentCloudKitContainer](nspersistentcloudkitcontainer-code.png)

### Adding Capabilities
While Xcode auto-generates the Core Data + CloudKit stack for you, it does *not* enable iCloud for you.

To enable full functionality, you need to go to your **Xcode project settings**.

Then click on the **Signing & Capabilities** section and add the **iCloud** and **Background Modes** capabilities.

Check the **CloudKit checkbox**, and the **Remote Notifications checkbox**.

#### Add iCloud + CloudKit
![Add iCloud with CloudKit](add-icloud.gif)

#### Add Background Modes + Remote Notifications
![Add Background Modes with Remote Notifications](add-background-modes.gif)

### What About Registering for Remote Notifications?
The beauty of `NSPersistentCloudKitContainer` is that it handles all the work required to listen for and respond to remote notifications.

This means that data saved locally on *one* device gets pushed up to iCloud synced back down to *another* device automatically.

## Reviewing the Data Model

The data model for this is basic:  a single `BlogIdea` Entity with two properties:

![BlogIdea Data Model](data-model.png)

## Reviewing the User Interface

The example project comes with a pre-set user interface to allow you to perform the essential operations of a data-driven app:  create, read, update, and delete objects.

![User Interface](user-interface.png)