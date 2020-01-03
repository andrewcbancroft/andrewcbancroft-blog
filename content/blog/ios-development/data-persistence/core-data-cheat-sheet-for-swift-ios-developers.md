---
title: Core Data Cheat Sheet for Swift iOS Developers
author: Andrew
type: blog
date: 2015-02-18T18:20:59+00:00
url: /2015/02/18/core-data-cheat-sheet-for-swift-ios-developers/
dsq_thread_id:
  - "3527252048"
categories:
  - Swift
tags:
  - Cheat Sheet
  - Core Data
  - Swift
disppsdatabadge: true
---
<small>Updated on July 27, 2016 &#8211; Additional Cheats</small>

Having trouble recalling how to perform basic Core Data operations? This cheat sheet is a handy reference to keep you productive with Core Data and Swift!

The code snippets below are here to help jog your memory when it's been a while since you've worked in Core Data. They could also be helpful for newcomers to iOS development, Core Data, and Swift.

One assumption I'm making in this post is that you've created NSManagedObject subclasses for your entities to make them easier to work with in a type-safe way. If you need help getting started with that, I've [written a walk-through][1] to guide you through that process.


<a name="querying" class="jump-target"></a>

## Querying

<a name="fetch-all" class="jump-target"></a>

#### Fetch all entities

{{< highlight swift "linenos=table" >}}
// Assuming type has a reference to managed object context

let fetchRequest = NSFetchRequest(entityName: "MyEntity")
do {
    let fetchedEntities = try self.managedObjectContext.executeFetchRequest(fetchRequest) as! [MyEntity]
    // Do something with fetchedEntities
} catch {
    // Do something in response to error condition
}
{{< / highlight >}}
<a name="fetch-max-n" class="jump-target"></a>

#### Fetch maximum of N entities

{{< highlight swift "linenos=table" >}}
// Assuming type has a reference to managed object context

let fetchRequest = NSFetchRequest(entityName: "MyEntity")
fetchRequest.fetchLimit = 10
do {
    let fetchedEntities = try self.managedObjectContext.executeFetchRequest(fetchRequest) as! [MyEntity]
    // Do something with fetchedEntities
} catch {
    // Do something in response to error condition
}   
{{< / highlight >}}
<a name="insert" class="jump-target"></a>

## Insert a new entity

{{< highlight swift "linenos=table" >}}
// Assuming encapsulating Type has a reference to managed object context

let newEntity = NSEntityDescription.insertNewObjectForEntityForName("MyEntity", inManagedObjectContext: self.managedObjectContext) as! MyEntity
// Set properties

do {
    try self.managedObjectContext.save()
} catch {
    // Do something in response to error condition
}
{{< / highlight >}}
<a name="update-single-entity" class="jump-target"></a>

## Update a single entity

{{< highlight swift "linenos=table" >}}
// Assuming type has a reference to managed object context

// Assuming that a specific NSManagedObject's objectID property is accessible
// Alternatively, could supply a predicate expression that's precise enough
// to select only a _single_ entity
let predicate = NSPredicate(format: "objectID == %@", objectIDFromNSManagedObject)

let fetchRequest = NSFetchRequest(entityName: "MyEntity")
fetchRequest.predicate = predicate

do {
    let fetchedEntities = try self.managedObjectContext.executeFetchRequest(fetchRequest) as! [MyEntity]
    fetchedEntities.first?.FirstPropertyToUpdate = NewValue
    fetchedEntities.first?.SecondPropertyToUpdate = NewValue
    // ... Update additional properties with new values
} catch {
    // Do something in response to error condition
}

do {
    try self.managedObjectContext.save()
} catch {
    // Do something in response to error condition
}
{{< / highlight >}}
<a name="update-multiple-entities" class="jump-target"></a>

## Update multiple-entities

{{< highlight swift "linenos=table" >}}
// Assuming type has a reference to managed object context

let predicate = NSPredicate(format: "MyEntityAttribute == %@", "Matching Value")

let fetchRequest = NSFetchRequest(entityName: "MyEntity")
fetchRequest.predicate = predicate

do {
    let fetchedEntities = try self.managedObjectContext.executeFetchRequest(fetchRequest) as! [MyEntity]
    
    for entity in fetchedEntities {
        entity.FirstPropertyToUpdate = NewValue
        entity.SecondPropertyToUpdate = NewValue
        // ... Update additional properties with new values
    }
} catch {
    // Do something in response to error condition
}

do {
    try self.managedObjectContext.save()
} catch {
    // Do something in response to error condition
}
{{< / highlight >}}
<a name="delete-single-entity" class="jump-target"></a>

## Delete a single entity

{{< highlight swift "linenos=table" >}}
// Assuming type has a reference to managed object context

// Assuming that a specific NSManagedObject's objectID property is accessible
// Alternatively, could supply a predicate expression that's precise enough
// to select only a _single_ entity
let predicate = NSPredicate(format: "objectID == %@", objectIDFromNSManagedObject)

let fetchRequest = NSFetchRequest(entityName: "MyEntity")
fetchRequest.predicate = predicate

do {
    let fetchedEntities = try self.managedObjectContext.executeFetchRequest(fetchRequest) as! [MyEntity]
    if let entityToDelete = fetchedEntities.first {
        self.managedObjectContext.deleteObject(entityToDelete)
    }
} catch {
    // Do something in response to error condition
}

do {
    try self.managedObjectContext.save()
} catch {
    // Do something in response to error condition
}
{{< / highlight >}}
<a name="delete-multiple-entities" class="jump-target"></a>

## Delete multiple-entities

{{< highlight swift "linenos=table" >}}
// Assuming type has a reference to managed object context

let predicate = NSPredicate(format: "MyEntityAttribute == %@", "Matching Value")

let fetchRequest = NSFetchRequest(entityName: "MyEntity")
fetchRequest.predicate = predicate

do {
    let fetchedEntities = try self.managedObjectContext.executeFetchRequest(fetchRequest) as! [MyEntity]
    
    for entity in fetchedEntities {
        self.managedObjectContext.deleteObject(entity)
    }
} catch {
    // Do something in response to error condition
}

do {
    try self.managedObjectContext.save()
} catch {
    // Do something in response to error condition
}
{{< / highlight >}}
<a name="migrate-automatically" class="jump-target"></a>

## Migrate Core Data Model with Automatic Migrations

{{< highlight swift "linenos=table" >}}
let model = // set up model

let pscOptions = [NSMigratePersistentStoresAutomaticallyOption : true, NSInferMappingModelAutomaticallyOption : true]
    
let psc = NSPersistentStoreCoordinator(managedObjectModel: model)
try! psc.addPersistentStore(ofType: NSSQLiteStoreType, configurationName: nil, at: storeURL, options: pscOptions)
{{< / highlight >}}
<a name="related" class="jump-target"></a>

<div class="resources">
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
  </ul>
</div>

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

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/2014/07/17/implement-nsmanagedobject-subclass-in-swift/