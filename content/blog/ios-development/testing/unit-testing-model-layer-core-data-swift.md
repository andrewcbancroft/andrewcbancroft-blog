---
title: Unit Testing Model Layer with Core Data and Swift
author: Andrew
type: blog
date: 2015-01-13T13:00:37+00:00
aliases:
  - /2015/01/13/unit-testing-model-layer-core-data-swift/
dsq_thread_id:
  - "3415489454"
categories:
  - iOS / Mac
  - Swift
tags:
  - Core Data
  - Model
  - Swift
  - Unit Testing

---
<small>Updated on November 19, 2015 – Swift 2.0</small>

As I approached testing my Core Data model, I have to admit I was apprehensive. How in the world was I going to write unit tests for my model layer that depended on a database. Past experience with trying to write tests with databases was painful. I feared the same would be the case with Core Data.

To my surprise, unit testing my Core Data model layer has been… well… amazing. With little effort, I’ve been able to write the unit tests I’ve wanted. The process went something like this for me:

  1. [Create an `NSManagedObject` subclass][1] of the Core Data entity that I need in my unit test. (This just makes things easier from an Xcode code-completion standpoint)
  2. Write a helper function to set up an in-memory `NSManagedObjectContext`. Avoiding the need to use an actual sqlite database is pretty handy. It allows for quick-running tests and easy iterations over the data model itself.
  3. Write unit tests using the in-memory `NSManagedObjectContext`.

[I’ve already written about creating an `NSManagedObject` subclass][1], so I will unpack steps 2 and 3 in this blog entry.

### Set up an in-memory NSManagedObjectContext

A [Stack Overflow][2] question+answer sparked some thoughts. The idea and the code both came from there. The answer uses Objective-C, so my contribution is that I've written it in Swift. In my project, I created a new Swift file called "CoreDataHelpers.swift&#8221; in my tests target. Here's a look at the helper function:

```swift
import CoreData

func setUpInMemoryManagedObjectContext() -> NSManagedObjectContext {
    let managedObjectModel = NSManagedObjectModel.mergedModelFromBundles([NSBundle.mainBundle()])!
    
    let persistentStoreCoordinator = NSPersistentStoreCoordinator(managedObjectModel: managedObjectModel)

    do {
        try persistentStoreCoordinator.addPersistentStoreWithType(NSInMemoryStoreType, configuration: nil, url: nil, options: nil)
    } catch {
        print("Adding in-memory persistent store failed")
    }
    
    let managedObjectContext = NSManagedObjectContext()
    managedObjectContext.persistentStoreCoordinator = persistentStoreCoordinator
    
    return managedObjectContext
}
```

#### Observations

I'll be honest, I'm only starting to put together the pieces involved in setting up the Core Data stack. Working through these unit testing techniques has solidified a _lot_. Analyzing the helper method from the bottom up has made some sense out of how to configure everything:

  * I need an `NSManagedObjectContext` whose `NSPersistentStoreCoordinator` property uses an in-memory store.
  * To get such an `NSManagedObjectContext`, I need to add a persistent store with a type of `NSInMemoryStoreType` to an `NSPersistentStoreCoordinator` instance. (note the line that's highlighted)
  * Of course, in order to do _that_, I need an `NSPersistentStoreCoordinator` _instance_, and I can't get one of _those_ unless I initialize it with an `NSManagedObjectModel`.
  * To get an `NSManagedObjectModel`, I use the class method, `mergedModelFromBundles()` to grab it from my main bundle.
  * Fast-forwarding now: With a proper `NSManagedObjectModel` instance, I can create an `NSPersistentStoreCoordinator` instance with it and add an `NSInMemoryStoreType` to that `persistentStoreCoordinator`. Finally, I can initialize an `NSManagedObjectContext`, assign the configured `persistentStoreCoordinator` to the context, and return it.

Whew! This whole process felt a lot like reading [If You Give a Mouse a Cookie][3], but that may be because I've read it a few hundred times to my 2 year old. :]

### Writing the unit test(s)

With the ability to get an `NSManagedObjectContext` instance that's using an in-memory store, the unit tests using Entities from my Core Data model are quite easy.

Here's a sample test:

```swift
import CoreData

class TestsUsingModelFromCoreData: XCTestCase {
    func testSomethingUsingCoreData() {
        let managedObjectContext = setUpInMemoryManagedObjectContext()
        let entity = NSEntityDescription.insertNewObjectForEntityForName("EntityName", inManagedObjectContext: managedObjectContext)
        
        // model setup
        
        // XCTAssert    
    }
}
```

### Conclusion

I was so surprised at how straightforward the test was. The helper function makes a world of difference for me. I hope it does for you, too!

<div class="resources-header">
  You might also enjoy&#8230;
</div>

<ul class="resources-content">
  <li>
    <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/07/10/using-a-core-data-model-in-swift-playgrounds/" title="Using a Core Data Model in Swift Playgrounds">Using a Core Data Model in Swift Playgrounds</a>
  </li>
  <li>
    <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/08/25/sharing-a-core-data-model-with-a-swift-framework/" title="Sharing a Core Data Model with a Swift Framework">Sharing a Core Data Model with a Swift Framework</a>
  </li>
  <li>
    <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/18/core-data-cheat-sheet-for-swift-ios-developers/" title="Core Data Cheat Sheet for Swift iOS Developers">Core Data Cheat Sheet for Swift iOS Developers</a>
  </li>
</ul></div> 

<a name="course" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fas fa-video"></i> <a href="http://bit.ly/ps-core-data-swift" target="_blank">Core Data Fundamentals with Swift</a><br /> <a href="http://bit.ly/ps-core-data-swift" target="_blank"><img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png" alt="Core Data Fundamentals with Swift" width="1024" height="576" class="alignnone size-large wp-image-13163" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-300x169.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-768x432.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift.png 1539w" sizes="(max-width: 1024px) 100vw, 1024px" /></a>
    </li>
  </ul>
</div>

 [1]: http://www.andrewcbancroft.com/2014/07/17/implement-nsmanagedobject-subclass-in-swift/
 [2]: http://stackoverflow.com/questions/1849802/how-to-unit-test-my-models-now-that-i-am-using-core-data
 [3]: http://en.wikipedia.org/wiki/If_You_Give_a_Mouse_a_Cookie