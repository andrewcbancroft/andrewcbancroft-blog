---
title: 'Sync Table View Data: NSFetchedResultsController and Swift'
author: Andrew
type: blog
date: 2015-05-29T03:20:54+00:00
aliases:
  - /2015/05/28/sync-table-view-data-nsfetchedresultscontroller-swift/
dsq_thread_id:
  - "3802811324"
categories:
  - Swift
tags:
  - NSFetchedResultsController
  - Swift
  - UITableView

---
<small>Updated on September 23, 2015 – Swift 2.0</small>

My goal with this article is to help you utilize the full power of `NSFetchedResultsController`.

This is a continuation on a series of articles I've written on Core Data and `NSFetchedResultsController`, so you may want to check out those previous posts to get an idea of where I'm picking up in this walk-through. Previously I touched on [how to seed a Core Data database][1], and [how to take that data and display it in a table view with an NSFetchedResultsController][2].

As with the previous posts, I'm providing an example XCode project over at GitHub, so feel free to follow along with the live working example:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa"></i> <a href="https://github.com/andrewcbancroft/Zootastic/tree/NSFetchedResultsController_SyncTableView" title="GitHub - Sync Table View Example Project" target="_blank">Sync Table View Example Project</a>
    </li>
  </ul>
</div>

In this installment to the series, I want to answer the question, &#8220;How do I update the rows in a table view when I add or remove objects from the Core Data database?&#8221; I will show how to implement the `NSFetchedResultsControllerDelegate` protocol, which is the key to automatically synchronizing changes made to your Core Data persistent store with a table view.


<a name="examine-delegate-protocol" class="jump-target"></a>

### Examining the NSFetchedResultsControllerDelegate protocol

The `NSFetchedResultsControllerDelegate` protocol is the piece of the puzzle that helps us update a table view with changes made to the Core Data persistent store. There are five methods that we'll be taking a look at:

  * `controllerWillChangeContent(_:)`
  * `controller(_:didChangeObject:atIndexPath:forChangeType:newIndexPath:)`
  * `controller(_:didChangeSection:atIndex:forChangeType:)`
  * `controller(_:sectionIndexTitleForSectionName:)`
  * `controllerDidChangeContent(_:)`

The two methods that are responsible for doing the actual updates to the table view's structure are `controller(_:didChangeSection:atIndex:forChangeType:)` and `controller(_:didChangeObject:atIndexPath:forChangeType:newIndexPath:)`. If some of the changes to the table view result in new sections being created, `controller(_:sectionIndexTitleForSectionName:)` will help give it an appropriate title (and make sure the _other_ sections keep their appropriate titles as well).

`controllerWillChangeContent(_:)` and `controllerDidChangeContent(_:)` help inform the table view that changes are about to happen / just finished happening. Sandwiching the primary &#8220;didChangeObject&#8221; and &#8220;didChangeSection&#8221; protocol methods with these two methods allows the table view to animate in all of the changes to its structure in one batch.

So, the general structure of the `NSFetchedResultsControllerDelegate` section of your source file might look like this:

```swift
// MARK: NSFetchedResultsControllerDelegate methods
public func controllerWillChangeContent(controller: NSFetchedResultsController) {
    self.tableView.beginUpdates()
}

public func controller(
    controller: NSFetchedResultsController,
    didChangeObject anObject: AnyObject,
    atIndexPath indexPath: NSIndexPath?,
    forChangeType type: NSFetchedResultsChangeType,
    newIndexPath: NSIndexPath?) {
        
        // implementation to follow...
}

public func controller(
    controller: NSFetchedResultsController,
    didChangeSection sectionInfo: NSFetchedResultsSectionInfo,
    atIndex sectionIndex: Int,
    forChangeType type: NSFetchedResultsChangeType) {
    
        // implementation to follow...
}

public func controller(controller: NSFetchedResultsController, sectionIndexTitleForSectionName sectionName: String) -> String? {
    return sectionName
}

public func controllerDidChangeContent(controller: NSFetchedResultsController) {
    self.tableView.endUpdates()
}
```

<a name="did-change-object" class="jump-target"></a>

### controller(_:didChangeObject:atIndexPath:forChangeType:newIndexPath:)

This is the method that governs how we want to handle the rows in a table view when the synchronization would require inserting rows, updating existing ones, removing them, or reordering them.

I'll give you the implementation and then point out a couple of &#8220;gotchas&#8221; and expound a little more. Recall that we're working with a sample app named &#8220;Zootastic&#8221;, so if you see references to `Animals` in the example, you'll know why. :]

```swift
public func controller(
        controller: NSFetchedResultsController,
        didChangeObject anObject: AnyObject,
        atIndexPath indexPath: NSIndexPath?,
        forChangeType type: NSFetchedResultsChangeType,
        newIndexPath: NSIndexPath?) {
            
            switch type {
            case NSFetchedResultsChangeType.Insert:
                // Note that for Insert, we insert a row at the __newIndexPath__
                if let insertIndexPath = newIndexPath {
                    self.tableView.insertRowsAtIndexPaths([insertIndexPath], withRowAnimation: UITableViewRowAnimation.Fade)
                }
            case NSFetchedResultsChangeType.Delete:
                // Note that for Delete, we delete the row at __indexPath__
                if let deleteIndexPath = indexPath {
                    self.tableView.deleteRowsAtIndexPaths([deleteIndexPath], withRowAnimation: UITableViewRowAnimation.Fade)
                }
            case NSFetchedResultsChangeType.Update:
                if let updateIndexPath = indexPath {
                    // Note that for Update, we update the row at __indexPath__
                    let cell = self.tableView.cellForRowAtIndexPath(updateIndexPath)
                    let animal = self.fetchedResultsController.objectAtIndexPath(updateIndexPath) as? Animal
                    
                    cell?.textLabel?.text = animal?.commonName
                    cell?.detailTextLabel?.text = animal?.habitat
                }
            case NSFetchedResultsChangeType.Move:
                // Note that for Move, we delete the row at __indexPath__
                if let deleteIndexPath = indexPath {
                    self.tableView.deleteRowsAtIndexPaths([deleteIndexPath], withRowAnimation: UITableViewRowAnimation.Fade)
                }
                
                // Note that for Move, we insert a row at the __newIndexPath__
                if let insertIndexPath = newIndexPath {
                    self.tableView.insertRowsAtIndexPaths([insertIndexPath], withRowAnimation: UITableViewRowAnimation.Fade)
                }
            }
}
```

Right away you'll notice we enter a switch on the `type` parameter of the method. There are four options possible in the `NSFetchedResultsChangeType` enum: Insert, Delete, Update, and Move.

Beware of a few common gotchas with each case of the switch:

  1. First of all, notice that first argument of the majority of the `tableView` methods takes an _array_ of `NSIndexPaths`. Be sure to wrap your argument in `[` and `]` to create an array.
  2. Pay extra attention to which index path parameter you're referencing in each case. For insert, the goal is to add a row at the `newIndexPath`. For Delete, the goal is to remove the row at `indexPath`. Move will require a deletion of the `indexPath` and an insertion at the `newIndexPath`. Getting these mixed up will cause runtime errors, so pay close attention here!

<a name="did-change-section" class="jump-target"></a>

### controller(_:didChangeSection:atIndex:forChangeType:)

If your table view only has one section, you don't need to worry with this one.

If your table view has multiple sections, you want to make sure and implement this protocol method – if you fail to do so and the change to the persistent store results in adjustments to the table view that can't be handled, runtime errors can occur. For example, deleting all rows in a section would result in the section needing to be deleted as well, but without this protocol method being implemented, the update to the table view can't be made and the app crashes.

Once again, I'll throw the code your way and follow up with commentary:

```swift
public func controller(
    controller: NSFetchedResultsController,
    didChangeSection sectionInfo: NSFetchedResultsSectionInfo,
    atIndex sectionIndex: Int,
    forChangeType type: NSFetchedResultsChangeType) {
    
        switch type {
        case .Insert:
            let sectionIndexSet = NSIndexSet(index: sectionIndex)
            self.tableView.insertSections(sectionIndexSet, withRowAnimation: UITableViewRowAnimation.Fade)
        case .Delete:
            let sectionIndexSet = NSIndexSet(index: sectionIndex)
            self.tableView.deleteSections(sectionIndexSet, withRowAnimation: UITableViewRowAnimation.Fade)
        default:
            ""
        }
}

public func controller(controller: NSFetchedResultsController, sectionIndexTitleForSectionName sectionName: String?) -> String? {
    return sectionName
}
```

For this one, we're only implementing code for Insert and Delete. The necessary information to insert a section or remove a section (ie, the `sectionIndex`) comes as a parameter to the method.

We utilize an `NSIndexSet` to wrap up the section that needs to be inserted or deleted and pass it to the table view's `insertSections()` and `deleteSections()` methods, respectively.

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
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/03/05/displaying-data-with-nsfetchedresultscontroller-and-swift/" title="Displaying Data With NSFetchedResultsController and Swift">Displaying Data With NSFetchedResultsController and Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/2015/02/25/using-swift-to-seed-a-core-data-database/ "Using Swift to Seed a Core Data Database"
 [2]: http://www.andrewcbancroft.com/2015/03/05/displaying-data-with-nsfetchedresultscontroller-and-swift/ "Displaying Data With NSFetchedResultsController and Swift"