---
title: Creating the Core Data Stack with Backwards Compatibility in Swift
author: Andrew
type: blog
date: 2017-04-16T21:23:46+00:00
aliases:
  - /2017/04/16/creating-the-core-data-stack-with-backwards-compatibility-in-swift/
dsq_thread_id:
  - "5732120089"
categories:
  - Swift
tags:
  - Core Data
  - Swift

---
In 2017, we live in a world where there are still non-iOS 10 devices out in the wild. If your app is targeting an iOS version earlier than iOS 10, or macOS Sierra (10.12), you'll be unable to take advantage of Core Data's latest &#8220;stack creation&#8221; class called `NSPersistentContainer`. So what can you do?

While `NSPersistentContainer` _does_ aim to simplify the stack creation process, at the end of the day, it's not terrible to have to mess with some of this Core Data plumbing.



<a name="end-goal" class="jump-target"></a>

# End goal of creating the Core Data stack

The end goal of Creating the Core Data stack is to get an instance of `NSManagedObjectContext`. That's it.

Most apps that rely on Core Data will end up making fetch requests to obtain data, or wire up other classes like `NSFetchedResultsController`. To make these things work, you've got to provide an instance of `NSManagedObjectContext`.

`NSManagedObjectContext` is sort of that central gear in the whole system that makes the other gears turn.

So. Bottom line: Once you have an instance of `NSManagedObjectContext`, you're golden. That's what creating the Core Data stack gives you in the end.

<a name="3-steps" class="jump-target"></a>

# 3 steps to creating the Core Data stack

The Core Data stack can be created in about 3 steps:

<a name="managed-object-model" class="jump-target"></a>

## 1) Initialize an instance of NSManagedObjectModel

This corresponds to your .xcdatamodeld file. You'll want to glance over to the project navigator on the left and locate the .xcdatamodeld file to record its name for this step.

```swift
// Initialize NSManagedObjectModel
let modelURL = Bundle.main.url(forResource: "NameOfDataModel", withExtension: "momd")
guard let model = NSManagedObjectModel(contentsOf: modelURL!) else { fatalError("model not found") }
```

<a name="persistent-store-coordinator" class="jump-target"></a>

## 2) Initialize and configure an instance of NSPersistentStoreCoordinator with the NSManagedObjectModel instance and an NSPersistentStoreType

The reason you create the `NSManagedObjectModel` instance first is because the _next_ step depends on it. `NSPersistentStoreCoordinator` will use your `NSManagedObjectModel` instance to configure itself and prepare to create the correct kind of persistent store based on what `NSPersistentStoreType` you tell it to use.

In the code example that follows, I used `NSSQLiteStoreType` to create a SQLite persistent store. Regardless of what kind of persistent store you use though, `NSPersistentStoreCoordinator` needs your managed object model instance.

```swift
// Configure NSPersistentStoreCoordinator with an NSPersistentStore
let psc = NSPersistentStoreCoordinator(managedObjectModel: model)

let storeURL = try! FileManager
        .default
        .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
        .appendingPathComponent("NameOfDataModel.sqlite")

try! psc.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: nil, at: storeURL, options: nil)
```

<a name="managed-object-context" class="jump-target"></a>

## 3) Initialize an instance of NSManagedObjectcontext and assign it the NSPersistentStoreCoordinator instance

The last step is to initialize an instance of `NSManagedObjectContext` and assign it the `NSPersistentStoreCoordinator` instance.

```swift
// Create and return NSManagedObjectContext
let context = NSManagedObjectContext(concurrencyType: .mainQueueConcurrencyType)
context.persistentStoreCoordinator = psc
```

<a name="code-example" class="jump-target"></a>

# Putting it all together – creating the Core Data stack in code

When I create the Core Data stack, I like to encapsulate the code in a stand-alone function that returns an instance of `NSManagedObjectContext`.

Here are all three steps put together:

```swift
func createMainContext() -&gt; NSManagedObjectContext {
    
    // Initialize NSManagedObjectModel
    let modelURL = Bundle.main.url(forResource: "NameOfDataModel", withExtension: "momd")
    guard let model = NSManagedObjectModel(contentsOf: modelURL!) else { fatalError("model not found") }
    
    // Configure NSPersistentStoreCoordinator with an NSPersistentStore
    let psc = NSPersistentStoreCoordinator(managedObjectModel: model)

    let storeURL = try! FileManager
            .default
            .url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
            .appendingPathComponent("NameOfDataModel.sqlite")
    
    try! psc.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: nil, at: storeURL, options: nil)
    
    // Create and return NSManagedObjectContext
    let context = NSManagedObjectContext(concurrencyType: .mainQueueConcurrencyType)
    context.persistentStoreCoordinator = psc
    
    return context
}
```

Once you've got a function like `createMainContext()`, you'll be able to call it to obtain a fully-configured `NSManagedObjectContext` instance.

I _highly_ recommend you avoid calling it inside any of your view controllers. Instead, my recommendation is to call it to obtain your `NSManagedObjectContext` instance inside of the `AppDelegate's` `application(_:didFinishLaunchingWithOptions:)` function. From there, you can pass it _to_ your first view controller, and from that first view controller on to _other_ view controllers that need it through `prepare(for segue:sender:)`.

For more on this &#8220;dependency injection&#8221; strategy, or if you're more of a visual learner, check out my Pluralsight course, [Core Data Fundamentals with Swift][1]!  
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

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/18/core-data-cheat-sheet-for-swift-ios-developers/" title="Core Data Cheat Sheet for Swift iOS Developers">Core Data Cheat Sheet for Swift iOS Developers</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/03/05/displaying-data-with-nsfetchedresultscontroller-and-swift/" title="Displaying Data With NSFetchedResultsController and Swift">Displaying Data With NSFetchedResultsController and Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/01/13/unit-testing-model-layer-core-data-swift/" title="Unit Testing Model Layer with Core Data and Swift">Unit Testing Model Layer with Core Data and Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2014/07/17/implement-nsmanagedobject-subclass-in-swift/" title="Implement NSManagedObject Subclass in Swift">Implement NSManagedObject Subclass in Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://bit.ly/ps-core-data-swift