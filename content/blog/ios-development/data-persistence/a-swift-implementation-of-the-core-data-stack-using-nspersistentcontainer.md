---
title: A Swift Implementation of the Core Data Stack Using NSPersistentContainer
description: Provides a walk through of using NSPersistentContainer to set up the Core Data stack.
author: Andrew
type: blog
date: 2017-05-15T18:19:46+00:00
lastmod: 2019-06-26T00:00:00+00:00
url: /2017/05/15/a-swift-implementation-of-the-core-data-stack-using-nspersistentcontainer/
dsq_thread_id:
  - "5820192783"
categories:
  - Swift
tags:
  - Core Data
  - NSPersistentContainer
  - Swift
toc: true
disppsbadge: true
---
If you're targeting **iOS 10 and above**, you've got the opportunity to pick your poison when it comes to creating the Core Data stack.

You could opt for the process I described in [Creating the Core Data Stack with Backwards Compatibility in Swift][1] &#8212; that process still works perfectly fine in iOS 10+.

Alternatively, you could use the new `NSPersistentContainer` class if you want to write a few less lines of code and keep up-to-date with the latest framework enhancements!

<a name="the-point" class="jump-target"></a>

## What's the point of the "Core Data stack"?

It's important to keep in mind the fundamental goal with creating the "Core Data stack". At the end of the day, we're all just trying to get our hands on an instance of `NSManagedObjectContext`.

Nearly every Core Data framework Type that we interact with requires an instance of `NSManagedObjectContext` to do its work. Whether it's `NSEntityDescription` to initialize new `NSManagedObject` instances, an `NSFetchRequest` to retrieve data, or an `NSFetchedResultsController` to keep our UIs in sync, we're always depending on `NSManagedObjectContext`.

So the bottom-line goal of setting up the "stack" is to configure all the plumbing necessary for our apps to work with the "under the hood" stuff of Core Data. The *thing* we interact with constantly is that all-valuable `NSManagedObjectContext` instance.

<a name="create" class="jump-target"></a>

## Creating the stack with NSPersistentContainer

`NSPersistentContainer` saves a few keystrokes and abstracts away a few of the moving parts when it comes to setting up the Core Data stack. Compare my [Backwards Compatibility][1] post if you're curious about what's being simplified.

So... how's it done?

**First**: Make sure you're targeting **iOS 10+, macOS Sierra (10.12)+, watchOS 3+, or tvOS 10+**

`NSPersistentContainer` is only available in Apple's latest platform versions (latest as of May, 2017).

Once you've ticked the build target prerequisite above, check out this code example:

{{< highlight swift "linenos=table" >}}
//Step 1
let container = NSPersistentContainer(name: "NameOfModel")

// Step 2
// Happens asynchronously!
container.loadPersistentStores(completionHandler: {
    persistentStoreDescription, error in
    // Step 3
    guard error == nil else { fatalError("Failed to load store: \(error)") }

    let mainContext = container.viewContext
    // Use the context to do Core Data stuff in your app
})
{{< / highlight >}}
<a name="step-by-step" class="jump-target"></a>

### Step-by-step through the code

Using `NSPersistentContainer` can be seen as a 3 step process.

1 -- Initialize an `NSPersistentContainer` instance. Its only parameter is the `name` of the model (look at your .xcdatamodeld file for this)  
2 -- Call `loadPersistentStores` on the container instance. This function _executes asynchronously_, so to hook back in and continue doing things when the function is finished with its work, you supply a completionHandler.  
3 -- Guard against errors and use the container's `viewContext` property, which is the `NSManagedObjectContext` instance you need. I haven't written in detail about this (yet), but in my [Pluralsight course on Core Data in Swift][2], I go over how to take the managed object context and follow a dependency injection pattern so that you isolate where it's created, and use the single instance throughout your app in a way that's testable.

One consideration that I would encourage you to think about is the `guard` statement. Ask: "Is `fatalError` really the best thing for me to do?"

A lot of apps that use Core Data really _can't_ continue past this point if the persistent store can't be loaded. In that case, the `guard` may not be so bad. If you _can_ fall back to an alternate screen that doesn't rely on Core Data though, that might be a more pleasant experience for your users than simply crashing with a fatal error.

<a name="wrap-up" class="jump-target"></a>

## Wrap up

This is the simplest way to use `NSPersistentContainer` to create your Core Data stack, and that's where I want to leave it for today!

Thank you, as always, for your interest in the content I'm creating!

And yes, if you're learning Core Data, I would love to contribute to your understanding of the framework. That's why I built [Core Data Fundamentals with Swift][2] for Pluralsight! If you're a subscriber, I'd be thrilled to engage with you on the course!

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/2017/04/16/creating-the-core-data-stack-with-backwards-compatibility-in-swift/
 [2]: http://bit.ly/ps-core-data-swift