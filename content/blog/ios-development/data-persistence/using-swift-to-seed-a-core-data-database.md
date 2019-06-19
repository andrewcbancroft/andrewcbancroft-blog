---
title: Using Swift to Seed a Core Data Database
author: Andrew
type: blog
date: 2015-02-26T03:44:53+00:00
url: /2015/02/25/using-swift-to-seed-a-core-data-database/
dsq_thread_id:
  - "3549029163"
categories:
  - Swift
tags:
  - Core Data
  - Seed Database
  - Swift
disppsbadge: true
---

Designing an application's UI can be difficult without actual data to present. Early on in the design process, data sourced from something like an array can suffice. Later on, however, our data sources become more dependent on actual data stores, such as what Core Data provides us.

During development, I've found that it's often convenient to seed a Core Data database with sample data so that I can preview how it'll look in my application. Along with that, it's nice to start with a fresh copy of the data each time I run the app. Let's explore how to accomplish this task in Swift!

<a name="scenario-setup" class="jump-target"></a>

### Scenario setup

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/Zootastic/tree/BaseProject_SeedDataStore" title="Zootastic">Example Xcode Project</a>
    </li>
  </ul>
</div>

I've created a fictitious Core Data app called "Zootastic&#8221;, which is intended to model zoos, and the animals that each zoo cares for. (I'll give you one guess as to what kinds of shows and activities my two year old and I have been in to lately). :]

Specifically, I have the following Entities:

  * Zoo 
      * name
      * location
      * animals (relationship)
  * Animal 
      * commonName
      * habitat
      * classification (relationship)
      * zoos (relationship)
  * Classification 
      * scientificClassification
      * family
      * order
      * animals (relationship)

I've [created NSManagedObject subclasses][1] for each of my entities, to make it easier to set properties.

<a name="data-helper" class="jump-target"></a>

### DataHelper.swift

Once a Core Data data model is set up, we're ready to create what I called `DataHelper`. It serves the purpose of seeding the data store, and logging the data store's contents back out to the console. It violates the single-responsibility principle, but wait! Don't lynch me!

Knowing that this class is intended to be used _solely_ for development, I didn't put a lot of effort into separating concerns. I opted for a "here's where I go to do all my seeding for manual testing purposes&#8221; approach.

Here are a few snippets from the class ([grab the full Xcode project][2] over at GitHub):

<a name="data-helper-initialization" class="jump-target"></a>

#### Initialization

```swift
public class DataHelper {
    let context: NSManagedObjectContext
    
    init(context: NSManagedObjectContext) {
        self.context = context
    }
    
// ...

}
```

The primary thing to take away from the initialization routine is that instead of calling out to the AppDelegate to get an instance of the `NSManagedObjectContext`, I'm choosing to require it to be passed in during the initialization of `DataHelper`. It's a pattern I like to practice because it allows me to do unit tests in real-world applications that use Core Data.

<a name="data-helper-seed-zoos" class="jump-target"></a>

#### seedZoos()

```swift
public class DataHelper {

// ...

    private func seedZoos() {
        let zoos = [
            (name: "Oklahoma City Zoo", location: "Oklahoma City, OK"),
            (name: "Lowry Park Zoo", location: "Tampa, FL"),
            (name: "San Diego Zoo", location: "San Diego, CA")
        ]
        
        for zoo in zoos {
            let newZoo = NSEntityDescription.insertNewObjectForEntityForName("Zoo", inManagedObjectContext: context) as! Zoo
            newZoo.name = zoo.name
            newZoo.location = zoo.location
        }
        
        do {
            try context.save()
        } catch _ {
        }
    }

// ...

}
```

A few observations on the code above:

  * This function may look a bit interesting. I've chosen to create an array of _tuples_ that I loop over and use to extract actual `Zoo` information when I call `NSEntityDescription.insertNewObjectForEntityForName()`. It just looked nice to me to have two chunks of code to analyze inside the function: One (the array of tuples) to see all of the zoo information I plan to insert, and another (the for-loop) to do the actual inserting into the data store. Adding more `Zoo`s in the future would mean simply adding another tuple to the array. Convenient!
  * Since I've [created NSManagedObject subclasses][1] for my entities, I can cast the result of `NSEntityDescription.insertNewObjectForEntityForName()` to an actual `Zoo`, to work with the properties directly.

<a name="data-helper-print-all-zoos" class="jump-target"></a>

#### printAllZoos()

```swift
public class DataHelper {

// ...

    public func printAllZoos() {
        let zooFetchRequest = NSFetchRequest(entityName: "Zoo")
        let primarySortDescriptor = NSSortDescriptor(key: "name", ascending: true)
        
        zooFetchRequest.sortDescriptors = [primarySortDescriptor]
        
        let allZoos = (try! context.executeFetchRequest(zooFetchRequest)) as! [Zoo]
        
        for zoo in allZoos {
            print("Zoo Name: \(zoo.name)\nLocation: \(zoo.location) \n-------\n", terminator: "")
        }
    }

// ...

}
```

`printAllZoos()` function utilizes a standard `NSFetchRequest`, along with an `NSSortDescriptor`. Check out my [cheat sheet][3] for more examples of common Core Data operations.

Once again, having the `NSManagedObject` subclass in place allows me to cast the result of the fetch request to a `[Zoo]`.

<a name="data-helper-seed-animals" class="jump-target"></a>

#### seedAnimals()

```swift
public class DataHelper {

// ...

    private func seedAnimals() {
        // Grab Classifications
        let classificationFetchRequest = NSFetchRequest(entityName: "Classification")
        let allClassifications = (try! context.executeFetchRequest(classificationFetchRequest)) as! [Classification]

        let manatee = allClassifications.filter({(c: Classification) -> Bool in
            return c.family == "Trichechidae"
        }).first
        
        // Same pattern for monkey and bat
        
        // Grab Zoos
        let zooFetchRequest = NSFetchRequest(entityName: "Zoo")
        let allZoos = (try! context.executeFetchRequest(zooFetchRequest)) as! [Zoo]
        
        let oklahomaCityZoo = allZoos.filter({ (z: Zoo) -> Bool in
            return z.name == "Oklahoma City Zoo"
        }).first
        
        // Same pattern for San Diego Zoo and Lowry Park Zoo
        
        // Create an array of "animal" tuples, assigning
        // whatever Classification and Zoo make sense
        let animals = [
            (commonName: "Pygmy Fruit-eating Bat", habitat: "Flying Mamals Exhibit", classification: bat!, zoos: NSSet(array: [lowryParkZoo!, oklahomaCityZoo!, sanDiegoZoo!])),
            (commonName: "Mantled Howler", habitat: "Primate Exhibit", classification: monkey!, zoos: NSSet(array: [sanDiegoZoo!, lowryParkZoo!])),
            (commonName: "Geoffroy’s Spider Monkey", habitat: "Primate Exhibit", classification: monkey!, zoos: NSSet(array: [sanDiegoZoo!])),
            (commonName: "West Indian Manatee", habitat: "Aquatic Mamals Exhibit", classification: manatee!, zoos: NSSet(array: [lowryParkZoo!]))
        ]
        
        // Create -actual- Animal instances and insert them
        for animal in animals {
            let newAnimal = NSEntityDescription.insertNewObjectForEntityForName("Animal", inManagedObjectContext: context) as! Animal
            newAnimal.commonName = animal.commonName
            newAnimal.habitat = animal.habitat
            newAnimal.classification = animal.classification
            newAnimal.zoos = animal.zoos
        }
        
        do {
            try context.save()
        } catch _ {
        }
    }

// ...

}
```

`seedAnimals()` is the most complicated piece of the whole scenario because it depends on entities that have been previously inserted into the data store. An `Animal`, which is a member of some `Classification` lives in some habitat at a `Zoo`. So in order to get a complete `Animal` into the data store, we need to have a `Classification` and one or more `Zoo` to assign it.

I've chosen to go ahead and execute fetch requests for the entities I made in previous `seed___()` functions. Additionally, rather than deal with `NSPredicate`, I just grab _all_ `Classifications` and _all_ `Zoos`, and use array's `filter` function to get the exact Entity I want.

The last thing I'll mention / warn against, is that I _am_ using explicitly unwrapped optionals in this function. I've gone ahead and "risked it&#8221;, trusting that I'm only using this technique during development time to help me see how things will look in my UI. In other words, this isn't code that will end up in Production. It's simply meant to help me while I'm developing, so I've gone ahead and done things the quick way here.

The rest of the function follows the same patterns that have already been used in this example.

<a name="app-delegate" class="jump-target"></a>

### AppDelegate.swift

```swift
func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        
        let dataHelper = DataHelper(context: self.managedObjectContext)
        dataHelper.seedDataStore()
        
        dataHelper.printAllZoos()
        dataHelper.printAllClassifications()
        dataHelper.printAllAnimals()
        
        return true
    }
```

Above is a peek at what my AppDelegate.swift file's `application:didFinishLaunchingWithOptions:` function looks like. Nothing fancy going on here. I'm simply initializing a `DataHelper` instance with the `NSManagedObjectContext` instance that's created in this class, and calling the seed and print functions I defined earlier.

<a name="starting-fresh" class="jump-target"></a>

### Starting fresh every time

I've found that sometimes it helps to have a freshly seeded data store every time I the app while I'm in development mode. When I'm testing the UI, I may create new entities during my manual testing, but one of the convenient things about seeding the data store is that I don't _have_ to. And even if I did, it's often quite nice to start fresh each run. To do this we'll dive into some of the boilerplate code that Xcode generates for us when we choose to use Core Data when we create the project. Specifically, we'll target the `persistentStoreCoordinator` closure:

{{< highlight swift "hl_lines=5-10" >}}
lazy var persistentStoreCoordinator: NSPersistentStoreCoordinator = {
        // The persistent store coordinator for the application. This implementation creates and returns a coordinator, having added the store for the application to it. This property is optional since there are legitimate error conditions that could cause the creation of the store to fail.
        // Create the coordinator and store
        let coordinator = NSPersistentStoreCoordinator(managedObjectModel: self.managedObjectModel)
        let url = self.applicationDocumentsDirectory.URLByAppendingPathComponent("Zootastic.sqlite")
        
        do {
            try NSFileManager.defaultManager().removeItemAtURL(url)
        } catch _ {
        }

        
        var failureReason = "There was an error creating or loading the application's saved data."
        do {
            try coordinator.addPersistentStoreWithType(NSSQLiteStoreType, configuration: nil, URL: url, options: nil)
        } catch {
            // Report any error we got.
            var dict = [String: AnyObject]()
            dict[NSLocalizedDescriptionKey] = "Failed to initialize the application's saved data"
            dict[NSLocalizedFailureReasonErrorKey] = failureReason
            
            dict[NSUnderlyingErrorKey] = error as NSError
            let wrappedError = NSError(domain: "YOUR_ERROR_DOMAIN", code: 9999, userInfo: dict)
            // Replace this with code to handle the error appropriately.
            // abort() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
            NSLog("Unresolved error \(wrappedError), \(wrappedError.userInfo)")
            abort()
        }
        
        return coordinator
        }()
{{< /highlight >}}

I've highlighted the key line that I added (everything else was already in place, generated for me by Xcode). Adding that line removes the sqlite database. The lines that follow add it back in a fresh state.

### Wrapping up

Designing an application's UI can be difficult without actual data to present. During development, it's often convenient to seed a Core Data database with sample data so that we can preview how it'll look in our application. Along with that, it's nice to start with a fresh copy of the data each time we run the app. We explored how to accomplish this task in Swift!

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
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/03/05/displaying-data-with-nsfetchedresultscontroller-and-swift/" title="Displaying Data With NSFetchedResultsController and Swift">Displaying Data With NSFetchedResultsController and Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/05/28/sync-table-view-data-nsfetchedresultscontroller-swift/" title="Sync Table View Data: NSFetchedResultsController and Swift">Sync Table View Data: NSFetchedResultsController and Swift</a>
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
 [2]: https://github.com/andrewcbancroft/Zootastic/tree/BaseProject_SeedDataStore
 [3]: http://www.andrewcbancroft.com/2015/02/18/core-data-cheat-sheet-for-swift-ios-developers/