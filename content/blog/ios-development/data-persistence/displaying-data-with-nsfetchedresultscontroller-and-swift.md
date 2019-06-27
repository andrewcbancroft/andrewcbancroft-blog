---
title: Displaying Data With NSFetchedResultsController and Swift
author: Andrew
type: blog
date: 2015-03-05T15:14:53+00:00
url: /2015/03/05/displaying-data-with-nsfetchedresultscontroller-and-swift/
dsq_thread_id:
  - "3569834766"
dsq_needs_sync:
  - "1"
categories:
  - Swift
tags:
  - Core Data
  - NSFetchedResultsController
  - Swift
  - UITableView
toc: true
disppsbadge: true
---

The combination of an `NSFetchedResultsController` and a `UITableView` provides a powerful way to integrate Core Data with a user interface. The greatest benefits of using `NSFetchedResultsController` come when we use it to automatically update a table view when objects are added, updated, or removed from a Core Data data store. First things first, though&#8230;

[With a Core Data data store seeded with data][1], the next logical step is to _display_ that data somewhere other than the console. This post will be devoted to figuring out how to set up an `NSFetchedResultsController` to display data inside a `UITableView`.

A follow-up post has been published to help you [keep the table view in sync][2] with the data as it changes in your persistent store, so once you're finished here, you might check out that next step!

<a name="final-goal" class="jump-target"></a>

### Final goal

`NSFetchedResultsController` will help us accomplish two things:  
1) It will fetch data from the Core Data data store  
2) It will use some of the data we fetch to populate various pieces of the UI (table view section headers, cell "title&#8221; and "subtitle&#8221; text. Here's what we're going for:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_TableView_FinalDisplay.png" alt="Zootastic TableView FinalDisplay" width="479" height="871" class="alignnone size-full wp-image-11450" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_TableView_FinalDisplay.png 479w, https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_TableView_FinalDisplay-165x300.png 165w" sizes="(max-width: 479px) 100vw, 479px" />][3]

<a name="scenario-setup" class="jump-target"></a>

### Setup and resources

I'm continuing my "Zootastic&#8221; example that I used to write about [using Swift to seed a Core Data database][1]. In fact, I've simply branched the project on GibHub and added the things we're exploring in this post.

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/Zootastic/tree/NSFetchedResultsController_DisplayInTableView" title="Zootastic">Example Xcode Project</a>
    </li>
  </ul>
</div>

For this entry, we'll still be dealing with our three primary `NSManagedObject` subclasses: Zoo, Animal, And Classification:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_xcdatamodel.png" alt="Zootastic XCdatamodel" width="361" height="310" class="alignnone size-full wp-image-11463" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_xcdatamodel.png 361w, https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_xcdatamodel-300x258.png 300w" sizes="(max-width: 361px) 100vw, 361px" />][4]

<a name="storyboard" class="jump-target"></a>

### Storyboard

Zootastic is a single view application. The Storyboard contains one view controller with a table view filling the Scene.

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableView-1024x773.png" alt="Zootastic Storyboard TableView" width="1024" height="773" class="alignnone size-large wp-image-11445" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableView-1024x773.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableView-300x226.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableView.png 1379w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]

The table view is using one prototype cell with an **Identifier** of **"Cell&#8221;** (for simplicity). The **Style** of the prototype cell is set to **Subtitle**.

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableViewCell-1024x770.png" alt="Zootastic Storyboard TableViewCell" width="1024" height="770" class="alignnone size-large wp-image-11446" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableViewCell-1024x770.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableViewCell-300x225.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableViewCell.png 1381w" sizes="(max-width: 1024px) 100vw, 1024px" />][6]

<a name="main-view-controller" class="jump-target"></a>

### MainViewController.swift

MainViewController.swift is where the action is happening. Here's a quick outline of what we need to accomplish in this class:

{{< highlight swift "linenos=table" >}}
public class MainViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, NSFetchedResultsControllerDelegate {

    // maintain a reference to NSManagedObjectContext instance

    // create and configure an NSFetchedResultsController instance

    // Implement UITableViewDataSource methods
}
{{< / highlight >}}
As you can see, `MainViewController` is a class concerned with being the table view's data source and delegate. Additionally, it will serve as the `NSFetchedResultsControllerDelegate`. For this post, we won't actually need the fetched results controller delegate functionality to display data. Those methods are particularly useful for synchronizing things when data _changes_.

With the class declaration out of the way, we'll investigate the class implementation one section at a time.

<a name="nsmanagedobjectcontext-reference" class="jump-target"></a>

#### Maintain NSManagedObjectContext instance reference

{{< highlight swift "linenos=table" >}}
public class MainViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, NSFetchedResultsControllerDelegate {
    
    public var context: NSManagedObjectContext!

    // ...
}
{{< / highlight >}}
You may be asking, "Where will you set this NSManagedObjectContext reference?&#8221;. I'm employing a pattern that I've found successful in the past: I assign it when the finishes launching through the AppDelegate's `application:didFinishLaunchingWithOptions` method. [More on this, shortly][7]&#8230;

For now, know that we're counting on that [later step][7] to take place, since `context` is defined as an implicitly unwrapped optional.

<a name="create-nsfetchedresultscontroller" class="jump-target"></a>

#### Create and configure NSFetchedResultsController instance

Next, we need to create and configure an `NSFetchedResultsController` instance. Here's a bit of code with comments to follow:

{{< highlight swift "linenos=table" >}}
public class MainViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, NSFetchedResultsControllerDelegate {
    
    // ...
    
    lazy var fetchedResultsController: NSFetchedResultsController = {
        let animalsFetchRequest = NSFetchRequest(entityName: "Animal")
        let primarySortDescriptor = NSSortDescriptor(key: "classification.order", ascending: true)
        let secondarySortDescriptor = NSSortDescriptor(key: "commonName", ascending: true)
        animalsFetchRequest.sortDescriptors = [primarySortDescriptor, secondarySortDescriptor]
        
        let frc = NSFetchedResultsController(
            fetchRequest: animalsFetchRequest,
            managedObjectContext: self.context,
            sectionNameKeyPath: "classification.order",
            cacheName: nil)
        
        frc.delegate = self
        
        return frc
        }()
    
    // ...

}
{{< / highlight >}}
If you've not read [Colin Eberhardt's][8] [Swift Initialization and the Pain of Optionals][9] post, I highly recommend it. His post is a fantastic analysis, and the final option of using lazy stored properties initialized by a closure expression is what I've chosen to do here. I won't repeat his analysis here, so feel free to jump over to his post to figure out what's going on there.

Within the closure expression, I'm setting up a fetch request with some sorting applied. All that's left is to initialize the `NSFetchedResultsController`, set its delegate and return it.

<a name="view-did-load" class="jump-target"></a>

#### viewDidLoad()

Once the view has loaded, the idea is to perform the `NSFetchedResultsController` instance's fetch request so that it has data to use in our `UITableViewDataSource` methods. This is how to do it:

{{< highlight swift "linenos=table" >}}
public class MainViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, NSFetchedResultsControllerDelegate {

    // ...

    override public func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.

            do {
                try fetchedResultsController.performFetch()
            } catch {
                print("An error occurred")
            }
    }

    // ...

}
{{< / highlight >}}
<a name="uitableviewdatasource-methods" class="jump-target"></a>

#### UITableViewDataSource methods

The final step in implementing `MainViewController` is to set up the table view so that it pulls data from `fetchedResultsController`. I'm implementing the [standard UITableViewDataSource methods][10] here, along with `tableView:titleForHeaderInSection`. Take a look:

{{< highlight swift "hl_lines=7 15 34 linenos=table" >}}
public class MainViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, NSFetchedResultsControllerDelegate {

    // ...

    // MARK: TableView Data Source
    public func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        if let sections = fetchedResultsController.sections {
            return sections.count
        }
        
        return 0
    }
    
    public func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if let sections = fetchedResultsController.sections {
            let currentSection = sections[section] 
            return currentSection.numberOfObjects
        }
        
        return 0
    }
    
    public func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) 
        let animal = fetchedResultsController.objectAtIndexPath(indexPath) as! Animal
        
        cell.textLabel?.text = animal.commonName
        cell.detailTextLabel?.text = animal.habitat
        
        return cell
    }
    
    public func tableView(tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        if let sections = fetchedResultsController.sections {
            let currentSection = sections[section] 
            return currentSection.name
        }
        
        return nil
    }

    // ...

}
{{< /highlight >}}

Apart from a bit of `if let ___ = ___` syntax, there's not an awful lot of surprising code here if you're familiar with working with table views. I've highlighted the relevant code related to `fetchedResultsController`. Without using `NSFetchedResultsController`, you'd probably supply data to the table view from an array or a dictionary or both. The `fetchedResultsController` code simplifies the data display dilemma when you're using Core Data.

Once the `UITableViewDataSource` methods are implemented, the implementation of `MainViewController` is complete for this example.

<a name="app-delegate" class="jump-target"></a>

### AppDelegate.swift

There's one final thing we need to do in order to get things rolling. In the ["maintain NSManagedObjectContext instance reference&#8221;][11] section of this post, I mentioned the strategy for assigning the `NSManagedObjectContext` instance in the `MainViewController`. Here's how I do it:

{{< highlight swift "hl_lines=16-17 linenos=table" >}}
class AppDelegate: UIResponder, UIApplicationDelegate {

    // ...


    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // Override point for customization after application launch.
        
        let dataHelper = DataHelper(context: self.managedObjectContext)
        dataHelper.seedDataStore()
        
        dataHelper.printAllZoos()
        dataHelper.printAllClassifications()
        dataHelper.printAllAnimals()
        
        let rootViewController = self.window!.rootViewController as! MainViewController
        rootViewController.context = self.managedObjectContext;
        
        return true
    }

    // ...

}
{{< /highlight >}}

**Note:** With iOS 13, the code to assign the `managedObjectContext` to the root view controller needs to go [in your app's SceneDelegate](https://www.andrewcbancroft.com/blog/ios-development/ui-work/accessing-root-view-controller-ios13-scenedelegate/).


The portion new to "injecting&#8221; the `managedObjectContext` into `MainViewController` is highlighted. I simply grab a reference to the `rootViewController` (which in our example is the `MainViewController`) and cast it to the appropriate type. Then I set the `context` property to the `managedObjectContext` that's created in the `AppDelegate` via Xcode's auto-generated Core Data stack setup.

### Wrapping up

If you're using Core Data in your iOS application, the combination of an `NSFetchedResultsController` and a `UITableView` provides a powerful way to integrate data from your data store into your UI. We've explored how to display data in a table view using `NSFetchedResultsController`. Feel free to [grab the GibHub project][12] for further investigation and to see Zootastic in action.

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
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/02/25/using-swift-to-seed-a-core-data-database/" title="Using Swift to Seed a Core Data Database">Using Swift to Seed a Core Data Database</a>
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

 [1]: http://www.andrewcbancroft.com/2015/02/25/using-swift-to-seed-a-core-data-database/
 [2]: http://www.andrewcbancroft.com/2015/05/28/sync-table-view-data-nsfetchedresultscontroller-swift/
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_TableView_FinalDisplay.png
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_xcdatamodel.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableView.png
 [6]: http://www.andrewcbancroft.com/wp-content/uploads/2015/03/Zootastic_Storyboard_TableViewCell.png
 [7]: #app-delegate
 [8]: https://twitter.com/ColinEberhardt
 [9]: http://blog.scottlogic.com/2014/11/20/swift-initialisation.html
 [10]: http://www.andrewcbancroft.com/2014/11/24/swift-uitableviewdatasource-cheat-sheet/
 [11]: #nsmanagedobjectcontext-reference
 [12]: https://github.com/andrewcbancroft/Zootastic/tree/NSFetchedResultsController_DisplayInTableView