---
title: "Getting Started With NSPersistentCloudKitContainer"
description: "Provides an example project and walkthrough for saving and syncing a single Core Data Entity with CloudKit using NSPersistentCloudKitContainer"
author: Andrew
type: blog
date: 2019-06-11T04:40:54+00:00
categories:
  - Core Data
  - CloudKit
tags:
  - NSPersistentCloudKitContainer
wip: false
showrecent: true
images:
  - images/social-assets/Twitter - Getting Started With NSPersistentCloudKitContainer.png
  - images/social-assets/Facebook - Getting Started With NSPersistentCloudKitContainer.png
toc: true
introtext: "What is it like to sync data from Core Cata to iCloud using Apple's new NSPersistentCloudKitContainer?  Here I provide an example project and walkthrough for saving and syncing a single Core Data Entity with CloudKit using this new class."
disppsdatabadge: true
---

## First Things First

* In order to use `NSPersistentCloudKitContainer` in your app, you need to be targeting iOS 13+.
* The CloudKit syncing portion only works on physical devices (not in the simulator).  That being the case, you'll need two or more devices running the app and using the same iCloud account to fully test things out and make sure syncing and data merging behavior works as you'd expect it to.

The goal of this walkthrough is to provide you with a fully-working example of performing and synchronizing create, read, update, and delete operations using `NSPersistentCloudKitContainer`.  

It's the project I wish I had for referencing the basics...something **beyond** the out-of-the-box, saving a list of timestamps that comes pre-implemented with a Master-Detail app, but something **less complicated** than <a href="https://developer.apple.com/documentation/coredata/synchronizing_a_local_store_to_the_cloud" rel="nofollow">Apple's example project</a> which ends up having several relationships involved in the data model, extra features configured on the persistent container, etc.

I offer it to you as reference as well -- I hope it helps!

<a name="resources" class="jump-target"></a>
<div class="resources">
<div class="resources-header">
Resources
</div>
<ul class="resources-content">
<li>
<i class="fas fa-file-code"></i> <a href="https://github.com/andrewcbancroft/BlogIdeaList"> Blog Idea List Example Xcode Project</a>
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

### What About Existing Apps?
If you've got an existing app that's using a "regular" `NSPersistentContainer`, you can change it to `NSPersistentCloudKitContainer` and continue on from there!

If you're not using `NSPersistentContainer` with your app yet, [my guide on how to migrate](/2017/07/10/using-an-existing-sqlite-store-with-nspersistentcontainer/) may be of help!

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

### What About My Data Model in iCloud?
When you enable the iCloud capability for your app, Xcode automatically creates a container for your app in the CloudKit Dashboard.

It does *not*, however, create a schema that matches your Core Data model...yet.  This is a setting you can toggle, but the default behavior is to ["lazily" create the schema](#revisiting-the-icloud-schema) as people create objects and save them to your persistent store.

![Empty Schema](empty-schema.gif)

## Walking Through the Example Project
WWDC always gets the blog ideas flowing through my brain, so this little app's theme is "saving a list of blog ideas", both locally, and *across* my devices using `NSPersistentCloudKitContainer`.

### User Interface

The user interfacde allows you to perform the essential operations of a data-driven app:  create, read, update, and delete objects.

![User Interface](user-interface.png)

### Data Model

The data model for this is basic:  a single `BlogIdea` Entity with two `String` properties: `ideaTitle` and `ideaDescription`.

![BlogIdea Data Model](data-model.png)

No relationships or extra configuration options... just one Entity to keep it a basic reference-able project.

The `BlogIdea` NSManagedObject subclass is implemented like this:

{{< highlight swift "linenos=table" >}}
public class BlogIdea: NSManagedObject {

    @NSManaged public var ideaTitle: String?
    @NSManaged public var ideaDescription: String?

    static var entityName: String { return "BlogIdea" }
}
{{< / highlight >}}
### View Controllers
There are two view controllers that come with this example:

**MainViewController**
{{< highlight swift "linenos=table" >}}
class MainViewController:   UIViewController, 
                            NSFetchedResultsControllerDelegate, 
                            UITableViewDataSource, 
                            UITableViewDelegate {
    // Responsible for listing out BlogIdeas in a table view

    // Holds a reference to an NSManagedObjectContext instance
    // which gets initialized in the SceneDelegate.swift file
    // and passed to this view controller when the scene gets "connected"

    // Uses NSFetchedResultsController to keep the table view in sync
    // with the Core Data managed object context

    // Implements swipe-to-delete with delete confirmation

    // Navigates to editor when someone taps on a table view row
    // and passes its NSManagedObjectContext instance along
}
{{< / highlight >}}
**BlogIdeaEditorViewController**
{{< highlight swift "linenos=table" >}}
class BlogIdeaEditorViewController: UIViewController {
    // Responsible for creating new BlogIdeas

    // Holds a reference to an NSManagedObjectContext instance
    // which gets passed along in MainViewController's prepare for segue method

    // Able to edit existing BlogIdeas
}
{{< / highlight >}}
## Understanding the Default Sync Behavior
At this point no additional configuration has happened. The Core Data stack is the unmodified Xcode generated code, and the fetched results controller is hooked up to the managed object context for your app, ready to fetch Blog Ideas and help get them into the table view.

If you open the project, build and run on two devices, and begin adding Blog Ideas, updating them, deleting them, etc. what happens?

The first observation is that...things...don't...seem to be working...

{{< youtube DLAwrSCl3Cc >}}

...At least not how I thought they would.

I *expected* my Blog List view to automatically update in response to changes made on my other device, buuut... nope.  Thankfully it's an "easy" fix.

## Reflecting Changes in the UI
Wherever you access your app's persistent CloudKit container to grab the `viewContext`, you need to set the `automaticallyMergesChangesFromParent` property to `true`.

I initialize the container in the `SceneDelegate`, so check out the code exerpt below to see where that gets set.

**SceneDelegate.swift**
{{< highlight swift "hl_lines=11,linenos=table" >}}
func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
    // Use this method to optionally configure and attach the UIWindow `window` to the provided UIWindowScene `scene`.
    // If using a storyboard, the `window` property will automatically be initialized and attached to the scene.
    // This delegate does not imply the connecting scene or session are new (see `application:configurationForConnectingSceneSession` instead).
    guard let _ = (scene as? UIWindowScene) else { return }
    
    let navigationController = self.window?.rootViewController as! UINavigationController
    let mainVC = navigationController.viewControllers[0] as! MainViewController
    
    let viewContext = (UIApplication.shared.delegate as! AppDelegate).persistentContainer.viewContext
    viewContext.automaticallyMergesChangesFromParent = true

    mainVC.managedObjectContext = viewContext
}
{{< /highlight >}}

Making this one-line change will enable the app (which is supported by `NSFetchedResultsController`) to update the UI in response to remote data changes...

**eventually**

It can be slow (anywhere from 5 to 15 seconds).  But it will eventually update.

## Revisiting the iCloud Schema
Once you save an object, the schema within the iCloud Dashboard will update to reflect the properties you designed in your Core Data Model.

![Revisiting the Schema](revisit-schema.png)

## Where's My Data?
If you attempt to query for BlogIdea records in any of the iCloud databases provisioned for your app, you won't find any.


Why?

That's because Apple fully manages a hidden Zone for your Core Data + CloudKit data. It was veeeery briefly mentioned in the <a href="https://developer.apple.com/videos/play/wwdc2019/202" rel="nofollow">WWDC 2019 presentation</a> (right about 10:50 if you're watching).

## Wrapping Up
My hope was to provide you with a fully-working example of performing and synchronizing create, read, update, and delete operations using `NSPersistentCloudKitContainer`.

Check out the [GitHub repo](https://github.com/andrewcbancroft/BlogIdeaList), leave a comment, or [@ me on Twitter](https://twitter.com/andrewcbancroft) to continue the conversation from here!