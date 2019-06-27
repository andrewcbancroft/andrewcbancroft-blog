---
title: Using a Core Data Model in Swift Playgrounds
author: Andrew
type: blog
date: 2016-07-10T20:48:54+00:00
url: /2016/07/10/using-a-core-data-model-in-swift-playgrounds/
dsq_thread_id:
  - "4975351771"
categories:
  - Swift
tags:
  - Core Data
  - Playground
  - Swift
disppsbadge: true
---

Did you know that you can tinker with Core Data inside of Swift playgrounds in Xcode? You can!

[Jeremiah Jessel][1], author at <http://www.learncoredata.com>, wrote up an article in 2015 [detailing how you can use the Core Data framework inside a playground][2]. He shows how you can do everything from setting up the Core Data stack, to creating NSManagedObjects programmatically in code. Great stuff!

After I read his guide, I got to thinking: _I wonder_ if you can take an .xcdatamodeld file created with Xcode's Data Model designer and use _it_ in a Playground&#8230;.

The short answer is, **kinda**. You can't use the .xcdatamodeld file (at least, I couldn't find a way), BUT, you _can_ use the _compiled_ "momd&#8221; file that gets created when you build your app.


<a name="limitations" class="jump-target"></a>

# Limitations

There's at least two limitations / caveats I've come across as I've been playing with this concept:

## No NSManagedObject subclasses

While you can create instances of the Entities in the model, if you've created `NSManagedObject` subclasses for your Entities, you won't be able to use those in the playground. You'd have to resort back to setting properties on your `NSManagedObject` instances using `setValue(_: forKey:)`.

But this is a minor drawback, especially if you're just wanting to tinker.

## Model updates

After you read the [walkthrough][3], you'll know how to get the model into your playground.

Here's the deal though: If you ever make _changes_ to your model, you'll need to go through the steps necessary to _re_-add a freshly-compiled model to the playground's Resources folder that includes the changes. This is because resources that are added to a playground are _copied_, not referenced.

I don't think that's a terrible draw-back, especially once you know how to do it.

So how do you do it? Here's how:

<a name="walkthrough" class="jump-target"></a>

# Walkthrough

Get started by adding a Data Model to your project. If you've got a project already going that uses Core Data, you probably already have a .xcdatamodeld file in your project. If you don't, though, one is easily add-able from the File menu:

<a name="add-data-model" class="jump-target"></a>

## Add Data Model file (unless you already have one)

File -> New -> File&#8230;  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/new-model.png" alt="New Data Model" width="728" height="516" class="alignnone size-full wp-image-12999" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/new-model.png 728w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/new-model-300x213.png 300w" sizes="(max-width: 728px) 100vw, 728px" />][4]

For my "smoke test&#8221;, just to see if it was possible, I left the default value for the model name as "Model.xcdatamodeld&#8221;.

<a name="add-entity" class="jump-target"></a>

## Add entity with attribute

Once I had the data model added to the project, I went in and added an entity (named "Entity&#8221;) with an attribute (named "attribute&#8221; of type Integer 16):

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/add-entity-and-attributes-1024x653.png" alt="Add an entity with an attribute." width="1024" height="653" class="alignnone size-large wp-image-13003" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/add-entity-and-attributes-1024x653.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/add-entity-and-attributes-300x191.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/add-entity-and-attributes.png 1129w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]

<a name="add-playground" class="jump-target"></a>

## Add a playground

Next up, I added a new playground to my project:

File -> New -> Playground&#8230;  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/new-playground.png" alt="Add new playground" width="877" height="396" class="alignnone size-full wp-image-13006" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/new-playground.png 877w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/new-playground-300x135.png 300w" sizes="(max-width: 877px) 100vw, 877px" />][6]

<a name="build-project" class="jump-target"></a>

## Build project; Locate "momd&#8221; file

With a playground and a data model has some structure to it, I built the project (CMD + B) so that the .xcdatamodeld file would be compiled into an "momd&#8221; file. It's the _momd_ file that needs to be added to the playground as a resource.

To find the "momd&#8221; file, expand "Products&#8221; in your project navigator, right-click the .app file, and click "Show in Finder&#8221;:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/show-product-in-finder.png" alt="Show product in finder" width="620" height="515" class="alignnone size-full wp-image-13008" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/show-product-in-finder.png 620w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/show-product-in-finder-300x249.png 300w" sizes="(max-width: 620px) 100vw, 620px" />][7]

<a name="show-app-contents" class="jump-target"></a>

## Show .app package contents

In the finder window, right-click the .app file, and click "Show package contents&#8221;:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/show-package-contents.png" alt="Show package contents" width="749" height="488" class="alignnone size-full wp-image-13010" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/show-package-contents.png 749w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/show-package-contents-300x195.png 300w" sizes="(max-width: 749px) 100vw, 749px" />][8]

<a name="drag-to-resources" class="jump-target"></a>

## Drag "momd&#8221; file from Finder to playground Resources folder

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/locate-momd-file.png" alt="Locate &quot;momd&quot; file" width="549" height="304" class="alignnone size-full wp-image-13013" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/locate-momd-file.png 549w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/locate-momd-file-300x166.png 300w" sizes="(max-width: 549px) 100vw, 549px" />][9]

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/drag-momd-to-resources-1024x447.png" alt="Drag &quot;momd&quot; to Resources" width="1024" height="447" class="alignnone size-large wp-image-13012" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/drag-momd-to-resources-1024x447.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/drag-momd-to-resources-300x131.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/drag-momd-to-resources.png 1029w" sizes="(max-width: 1024px) 100vw, 1024px" />][10]

<a name="write-code" class="jump-target"></a>

## Write Core Data code to use model

That's it! Now that the "momd&#8221; file is in the playground's Resources folder, you're set to write code against it. You can insert `NSManagedObject` instances, perform fetch requests, etc. Here's an example that I wrote up:

{{< highlight swift "linenos=table" >}}
import UIKit
import CoreData

// Core Data Stack Setup for In-Memory Store
public func createMainContext() -> NSManagedObjectContext {
    
    // Replace "Model" with the name of your model
    let modelUrl = NSBundle.mainBundle().URLForResource("Model", withExtension: "momd")
    guard let model = NSManagedObjectModel.init(contentsOfurl: modelUrl!) else { fatalError("model not found") }
    
    let psc = NSPersistentStoreCoordinator(managedObjectModel: model)
    try! psc.addPersistentStoreWithType(NSInMemoryStoreType, configuration: nil, URL: nil, options: nil)
    
    let context = NSManagedObjectContext(concurrencyType: .MainQueueConcurrencyType)
    context.persistentStoreCoordinator = psc
    
    return context
}

let context = createMainContext()

// Insert a new Entity
let ent = NSEntityDescription.insertNewObjectForEntityForName("Entity", inManagedObjectContext: context)
ent.setValue(42, forKey: "attribute")

try! context.save()

// Perform a fetch request
let fr = NSFetchRequest(entityName: "Entity")
let result = try! context.executeFetchRequest(fr)

print(result)
{{< / highlight >}}
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/printed-result.png" alt="Fetch request result" width="968" height="73" class="alignnone size-full wp-image-13018" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/07/printed-result.png 968w, https://www.andrewcbancroft.com/wp-content/uploads/2016/07/printed-result-300x23.png 300w" sizes="(max-width: 968px) 100vw, 968px" />][11]

Woohoo! I thought this was pretty cool.

**Don't forget**: If you make updates to your model, you need to re-build your app, delete the "momd&#8221; folder from your playground's resources, re-drag the freshly-compiled "momd&#8221; file to your playground again to work with the latest version of the model.

<a name="potential-usefulness" class="jump-target"></a>

# Potential usefulness

The other important question to ask, besides "I wonder if this is possible?&#8221; is "How is this useful?&#8221;

  * Learning. Playgrounds in and of themselves make sense as a learning tool. How cool is it to be able to build the model you're thinking of in the Xcode designer, import that into a playground, and tinker with it as a learning exercise??
  * This could also be useful when you need to try out your data model but don't really want to wire it up to an actual user interface yet. Strip away all the UI complexity and just work with the data model&#8230; in a playground! It just seems like a more elegant solution to the "print it out to the console&#8221; method of experimenting with the model.
  * There might be situations when you're building semi-complicated `NSPredicate` instances for a fetch request – why not get it working in a playground first, then migrate it over to your app? Just an idea!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/18/core-data-cheat-sheet-for-swift-ios-developers/" title="Core Data Cheat Sheet for Swift iOS Developers"</a>Core Data Cheat Sheet for Swift iOS Developers
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/25/using-swift-to-seed-a-core-data-database/" title="Using Swift to Seed a Core Data Database"</a>Using Swift to Seed a Core Data Database
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/03/05/displaying-data-with-nsfetchedresultscontroller-and-swift/" title="Displaying Data With NSFetchedResultsController and Swift"</a>Displaying Data With NSFetchedResultsController and Swift
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/05/28/sync-table-view-data-nsfetchedresultscontroller-swift/" title="Sync Table View Data: NSFetchedResultsController and Swift"</a>Sync Table View Data: NSFetchedResultsController and Swift
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

 [1]: https://twitter.com/JCubedApps
 [2]: http://www.learncoredata.com/core-data-and-playgrounds/
 [3]: #walkthrough
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2016/07/new-model.png
 [5]: https://www.andrewcbancroft.com/wp-content/uploads/2016/07/add-entity-and-attributes.png
 [6]: https://www.andrewcbancroft.com/wp-content/uploads/2016/07/new-playground.png
 [7]: https://www.andrewcbancroft.com/wp-content/uploads/2016/07/show-product-in-finder.png
 [8]: https://www.andrewcbancroft.com/wp-content/uploads/2016/07/show-package-contents.png
 [9]: https://www.andrewcbancroft.com/wp-content/uploads/2016/07/locate-momd-file.png
 [10]: https://www.andrewcbancroft.com/wp-content/uploads/2016/07/drag-momd-to-resources.png
 [11]: https://www.andrewcbancroft.com/wp-content/uploads/2016/07/printed-result.png