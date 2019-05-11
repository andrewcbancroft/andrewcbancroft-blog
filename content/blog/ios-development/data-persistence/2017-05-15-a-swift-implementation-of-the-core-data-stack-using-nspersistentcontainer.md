---
title: A Swift Implementation of the Core Data Stack Using NSPersistentContainer
author: Andrew
type: blog
date: 2017-05-15T18:19:46+00:00
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
---
If you&#8217;re targeting **iOS 10 and above**, you&#8217;ve got the opportunity to pick your poison when it comes to creating the Core Data stack.

You could opt for the process I described in [Creating the Core Data Stack with Backwards Compatibility in Swift][1] &#8212; that process still works perfectly fine in iOS 10+.

Alternatively, you could use the new `NSPersistentContainer` class if you want to write a few less lines of code and keep up-to-date with the latest framework enhancements!

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#the-point">What&#8217;s the point of the &#8220;Core Data stack&#8221;</a>
    </li>
    <li>
      <a href="#create">Creating the stack with NSPersistentContainer</a>
    </li>
    <ul>
      <li>
        <a href="#step-by-step">Step-by-step through the code</a>
      </li>
    </ul>
    
    <li>
      <a href="#wrap-up">Wrap up</a>
    </li>
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
    <li>
      <a href="#course">Learning Core Data? Watch my course, Core Data Fundamentals with Swift!</a>
    </li>
  </ul>
</div>

<a name="the-point" class="jump-target"></a>

# What&#8217;s the point of the &#8220;Core Data stack&#8221;

It&#8217;s important to keep in mind the fundamental goal with creating the &#8220;Core Data stack&#8221;. At the end of the day, we&#8217;re all just trying to get our hands on an instance of `NSManagedObjectContext`.

Nearly every Core Data framework Type that we interact with requires an instance of `NSManagedObjectContext` to do its work. Whether it&#8217;s `NSEntityDescription` to initialize new `NSManagedObject` instances, an `NSFetchRequest` to retrieve data, or an `NSFetchedResultsController` to keep our UIs in sync, we&#8217;re always depending on `NSManagedObjectContext`.

So the bottom-line goal of setting up the &#8220;stack&#8221; is to configure all the plumbing necessary for our apps to work with the &#8220;under the hood&#8221; stuff of Core Data. The [thing] we interact with constantly is that all-valuable `NSManagedObjectContext` instance.

<a name="create" class="jump-target"></a>

# Creating the stack with NSPersistentContainer

`NSPersistentContainer` saves a few keystrokes and abstracts away a few of the moving parts when it comes to setting up the Core Data stack. Compare my [Backwards Compatibility][1] post if you&#8217;re curious about what&#8217;s being simplified.

So&#8230; how&#8217;s it done?

**First**: Make sure you&#8217;re targeting **iOS 10+, macOS Sierra (10.12)+, watchOS 3+, or tvOS 10+**

`NSPersistentContainer` is only available in Apple&#8217;s latest platform versions (latest as of May, 2017).

Once you&#8217;ve ticked the build target prerequisite above, check out this code example:

<pre class="lang:swift decode:true " title="NSPersistentContainer" >//Step 1
let container = NSPersistentContainer(name: "NameOfModel")

// Step 2
// Happens asynchronously!
container.loadPersistentStores(completionHandler: {
    persistentStoreDescription, error in
    // Step 3
    guard error == nil else { fatalError("Failed to load store: \(error)") }

    let mainContext = container.viewContext
    // Use the context to do Core Data stuff in your app
})</pre>

<a name="step-by-step" class="jump-target"></a>

## Step-by-step through the code

Using `NSPersistentContainer` can be seen as a 3 step process.

1 &#8212; Initialize an `NSPersistentContainer` instance. Its only parameter is the `name` of the model (look at your .xcdatamodeld file for this)  
2 &#8212; Call `loadPersistentStores` on the container instance. This function _executes asynchronously_, so to hook back in and continue doing things when the function is finished with its work, you supply a completionHandler.  
3 &#8212; Guard against errors and use the container&#8217;s `viewContext` property, which is the `NSManagedObjectContext` instance you need. I haven&#8217;t written in detail about this (yet), but in my [Pluralsight course on Core Data in Swift][2], I go over how to take the managed object context and follow a dependency injection pattern so that you isolate where it&#8217;s created, and use the single instance throughout your app in a way that&#8217;s testable.

One consideration that I would encourage you to think about is the `guard` statement. Ask: &#8220;Is `fatalError` really the best thing for me to do?&#8221;

A lot of apps that use Core Data really _can&#8217;t_ continue past this point if the persistent store can&#8217;t be loaded. In that case, the `guard` may not be so bad. If you _can_ fall back to an alternate screen that doesn&#8217;t rely on Core Data though, that might be a more pleasant experience for your users than simply crashing with a fatal error.

<a name="wrap-up" class="jump-target"></a>

# Wrap up

This is the simplest way to use `NSPersistentContainer` to create your Core Data stack, and that&#8217;s where I want to leave it for today!

Thank you, as always, for your interest in the content I&#8217;m creating!

And yes, if you&#8217;re learning Core Data, I would love to contribute to your understanding of the framework. That&#8217;s why I built [Core Data Fundamentals with Swift][2] for Pluralsight! If you&#8217;re a subscriber, I&#8217;d be thrilled to engage with you on the course!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/04/16/creating-the-core-data-stack-with-backwards-compatibility-in-swift/" title="Creating the Core Data Stack with Backwards Compatibility in Swift"</a>Creating the Core Data Stack with Backwards Compatibility in Swift
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/18/core-data-cheat-sheet-for-swift-ios-developers/" title="Core Data Cheat Sheet for Swift iOS Developers"</a>Core Data Cheat Sheet for Swift iOS Developers
    </li>
  </ul>
</div>

<a name="course" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-video-camera"></i> <a href="http://bit.ly/ps-core-data-swift" target="_blank">Core Data Fundamentals with Swift</a><br /> <a href="http://bit.ly/ps-core-data-swift" target="_blank"><img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png" alt="Core Data Fundamentals with Swift" width="1024" height="576" class="alignnone size-large wp-image-13163" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-300x169.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-768x432.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift.png 1539w" sizes="(max-width: 1024px) 100vw, 1024px" /></a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/2017/04/16/creating-the-core-data-stack-with-backwards-compatibility-in-swift/
 [2]: http://bit.ly/ps-core-data-swift