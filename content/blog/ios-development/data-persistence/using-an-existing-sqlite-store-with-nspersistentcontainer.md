---
title: Using an Existing SQLite Store with NSPersistentContainer
author: Andrew
type: blog
date: 2017-07-10T18:02:05+00:00
aliases:
  - /2017/07/10/using-an-existing-sqlite-store-with-nspersistentcontainer/
dsq_thread_id:
  - "5978624063"
categories:
  - Swift
tags:
  - Core Data
  - NSPersistentContainer
  - Swift

---

If you've been creating the Core Data Stack [without NSPersistentContainer][1] and you're thinking about switching things up to _use_ `NSPersistentContainer`, you need to think about your existing SQLite persistent store.

[Creating the stack with NSPersistentContainer][2] handles the creation of SQLite stores internally, so brand new setups using `NSPersistentContainer` are pretty easy.

But how do you go about telling `NSPersistentContainer` about your _existing_ SQLite store?

Let's take a look now at how you can configure the container to use your previously-created persistent store.

<a name="before" class="jump-target"></a>

# Before NSPersistentContainer

Supposing that your **previous** Core Data stack creation step pointed to a .sqlite file somewhere in your user's documents directory:

```swift
// Configure NSPersistentStoreCoordinator with an NSPersistentStore
let psc = NSPersistentStoreCoordinator(managedObjectModel: model) // model instance creation not shown here...

let storeURL = try! FileManager
        .default
        .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
        .appendingPathComponent("NameOfDataModel.sqlite")

try! psc.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: nil, at: storeURL, options: nil)
```

<a name="after" class="jump-target"></a>

# After NSPersistentContainer

The key to migrating to `NSPersistentStore` with an existing SQLite persistent store is the `NSPersistentStoreDescription` class. Take a look at the following code to see how to configure an instance of `NSPersistentStoreDescription` and assign it to the `NSPersistentContainer` instance's `persistentStoreDescriptions` property:

```swift
let container = NSPersistentContainer(name: "NameOfDataModel")

let storeURL = try! FileManager
        .default
        .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
        .appendingPathComponent("NameOfDataModel.sqlite")

let storeDescription = NSPersistentStoreDescription(url: storeURL)
container.persistentStoreDescriptions = [storeDescription]

// Remaining setup for NSPersistentContainer
```

<a name="breakdown" class="jump-target"></a>

## Breaking it down

The `let storeURL =` portion of the code is identical in both snippets.

The difference is how you tell the Stack where the persistent store is located. In times past, you'd tell the NSPersistentStore**Coordinator** this information through its `addPersistentStore` method.

With NSPersistent**Container**, you need to do two things:  
**1** – Initialize an `NSPersistentStoreDescription` instance with the `storeURL` (i.e. the URL to where your existing persistent store is located).

**2** – Assign the `NSPersistentStoreDescription` instance to the `NSPersistentContainer's` `persistentStoreDescriptions` property.

One subtlety to note is that the property's name is _plural_: persistentStoreDescription**s**.

Even though may only a single persistent store description instance to assign, such as in the example code above, **you still need to wrap it in an array** before you assign it, since it's possible to add more than one description to the container.

With that adjustment to the [`NSPersistentContainer` stack creation process][1], your app will once again use the persistent store it used to use!

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
 [2]: https://www.andrewcbancroft.com/2017/05/15/a-swift-implementation-of-the-core-data-stack-using-nspersistentcontainer/