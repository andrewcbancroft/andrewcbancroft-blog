---
title: UITableView Swipe to Delete Workflow in Swift
author: Andrew
type: blog
date: 2015-07-17T04:00:18+00:00
url: /2015/07/16/uitableview-swipe-to-delete-workflow-in-swift/
dsq_thread_id:
  - "3942084245"
categories:
  - Swift
tags:
  - Swift
  - Swipe to Delete
  - UITableView

---
Data management applications, by which I mean an app where you're allowing users to add, edit, and delete bits of data as part of your app's core function, very likely use a table view (or two) to visualize lists of information that users of the app can interact with.

Making _changes_ to the information listed in the table view and signaling those changes in a fluent way becomes a top concern for these types of apps. How do we allow users to add or remove "records&#8221; to the system? Furthermore, how do we signal that those changes were effective and refresh the view of the data in the UI?

The primary concern I want to focus in on in this article is the ever-common paradigm of "swipe to delete&#8221; when using a table view. What could the workflow of deleting a row from the table view (and its data source) look like? How could it be implemented in Swift? Let's explore&#8230;


<a name="workflow" class="jump-target"></a>

### Workflow

The workflow of "swipe to delete&#8221; that I typically use in my own applications is this:

  * **Swipe** a table view row and have the Delete button appear.
  * Press the delete button, which triggers a **confirmation**: "Do you really want to delete this?&#8221;
  * Based on the user's response to the confirmation, **delete the object** from the data source and remove it from the table view, **or cancel**.

The confirmation step is atypical for iOS it seems. Swiping to delete an e-mail or a reminder or just about anything else in Apple's own apps simply deletes the item right away.

There may be a good reason for this, but I like to give folks an out if they didn't mean to do it. It's fair enough to say, "Well, they went to the effort of swiping the row _and_ pressing the button&#8230; surely they mean to do it!&#8221;. I still feel more comfortable if I get the opportunity to cancel something like a delete operation. Feel free to disagree there – for this article, I'll assume you want to include that into your delete workflow, and will demonstrate a simple way to implement all three steps of the strategy.

<a name="implementation" class="jump-target"></a>

### Implementation

To demonstrate the implementation of this workflow, suppose that we've got a table view listing out all of the planets in our solar system (all of the news on Pluto this week has me thinking in this direction, so I just went with it). Feel free to grab the example project over at GitHub:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/SwipeToDeleteExample" title="Swipe to Delete Example">Swipe to Delete Example</a>
    </li>
  </ul>
</div>

The table view looks like this once its data source is all configured:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.06-PM-576x1024.png" alt="Table View with Planets" width="576" height="1024" class="alignnone size-large wp-image-12096" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.06-PM-576x1024.png 576w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.06-PM-169x300.png 169w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.06-PM.png 750w" sizes="(max-width: 576px) 100vw, 576px" />][1]

<a name="swipe" class="jump-target"></a>

#### Swipe

What we want is to be able to swipe one of the rows and delete the planet from the data source and, consequently, remove it from the table view in a nice, fluid way:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.11-PM-576x1024.png" alt="Table View - Delete Button Revealed" width="576" height="1024" class="alignnone size-large wp-image-12097" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.11-PM-576x1024.png 576w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.11-PM-169x300.png 169w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.11-PM.png 750w" sizes="(max-width: 576px) 100vw, 576px" />][2]

To accomplish this, we need to do a couple of things.

First, your view controller needs to conform to the `UITableViewDelegate` protocol, because the swipe to delete functionality is encapsulated by one of the table view delegate methods. It's a simple change at the class declaration:

`class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate { ... }`

The delegate method that causes the buttons to appear on swipe is called `tableView(_:commitEditingStyle:forRowAtIndexPath`

Its implementation for the example I'm working through looks like this:

```swift
class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    // ...

    var deletePlanetIndexPath: NSIndexPath? = nil

    // ...

    func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        if editingStyle == .Delete {
            deletePlanetIndexPath = indexPath
            let planetToDelete = planets[indexPath.row]
            confirmDelete(planetToDelete)
        }
    }

    // ...
}
```

So what's happening here? The primary thing to notice is that we're evaluating the editingStyle from the method's parameter list. Comparing it to the `.Delete` `UITableViewCellEditingStyle` value is what allows us to know that the Delete button was tapped.

Since I have a confirmation step to take care of, I've chosen to store the `indexPath` of the row we're wanting to delete in a class-viewable variable so that I can use it later on when we handle the deletion (if the user confirms it).

The final step of this function is to call `confirmDelete()`, which has its own explanation coming up&#8230;

<a name="confirm" class="jump-target"></a>

#### Confirm

The next step is confirming that the user really wants to delete the particular planet they've initiated the delete action on:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.15-PM-576x1024.png" alt="Delete Confirmation" width="576" height="1024" class="alignnone size-large wp-image-12098" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.15-PM-576x1024.png 576w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.15-PM-169x300.png 169w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.15-PM.png 750w" sizes="(max-width: 576px) 100vw, 576px" />][3]

How is this implemented? It all boils down to using iOS 8's new `UIAlertController`:

```swift
class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    // ...

    func confirmDelete(planet: String) {
        let alert = UIAlertController(title: "Delete Planet", message: "Are you sure you want to permanently delete \(planet)?", preferredStyle: .ActionSheet)
        
        let DeleteAction = UIAlertAction(title: "Delete", style: .Destructive, handler: handleDeletePlanet)
        let CancelAction = UIAlertAction(title: "Cancel", style: .Cancel, handler: cancelDeletePlanet)
        
        alert.addAction(DeleteAction)
        alert.addAction(CancelAction)
        
        // Support display in iPad
        alert.popoverPresentationController?.sourceView = self.view
        alert.popoverPresentationController?.sourceRect = CGRectMake(self.view.bounds.size.width / 2.0, self.view.bounds.size.height / 2.0, 1.0, 1.0)
        
        self.presentViewController(alert, animated: true, completion: nil)
    }

    // ...
}
```

We're asking the user if they're sure they want to permanently delete the planet using the `.ActionSheet` style.

The next step of the function is to create a couple of `UIAlertAction` buttons: one for Delete and one for Cancel, with the appropriate style (`.Destructive` and `.Cancel`, respectively).

Finally, we provide a function to each `UIAlertAction` instance. The handlers, of course, could have been implemented with closures, but I chose to built out a couple of named functions, just to be able to step through it with you, and to separate out the logic of the steps a little more. Feel free to do whichever seems most natural to you.

<a name="delete-cancel" class="jump-target"></a>

#### Delete or cancel

This is the final step! The following code snippet is an implementation of the two handlers specified for the initialization step of the `UIAlertAction` buttons, which were `handleDeletePlanet` and `cancelDeletePlanet`:

```swift
class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    // ...

    var deletePlanetIndexPath: NSIndexPath? = nil

    // ...

    func handleDeletePlanet(alertAction: UIAlertAction!) -> Void {
        if let indexPath = deletePlanetIndexPath {
            tableView.beginUpdates()
            
            planets.removeAtIndex(indexPath.row)
            
            // Note that indexPath is wrapped in an array:  [indexPath]
            tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Automatic)
            
            deletePlanetIndexPath = nil
            
            tableView.endUpdates()
        }
    }
    
    func cancelDeletePlanet(alertAction: UIAlertAction!) {
        deletePlanetIndexPath = nil
    }

    // ...
}
```

Clearly, `handleDeletePlanet()` is the most involved. The essential process is this:

  * Call `beginUpdates()` on the table view instance to signal the start of UI updates to the table view.
  * Remove the planet from the data source using the `deletePlanetIndexPath` we set in the alert controller step.
  * Call `deleteRowsAtIndexPaths()` on the table view to remove the planet from the UI.
  * Reset the class-viewable `deletePlanetIndexPath` to nil.
  * Call `endUpdates()` on the table view instance to complete the UI updates.

There's one gotcha, that I've tried to highlight by way of comment in the code snippet: Notice that within the call to `deleteRowsAtIndexPaths` (plural), I've wrapped the `indexPath` we're removing in an array. It's subtle, but this delegate method expects an array of `indexPath` instances, not a single index path instance. It's simple enough, but it can catch you off guard if you're in the mindset of removing a single row and come across this method, which is flexible enough to allow you to delete several at a time.

### Wrapping up

Swipe -> confirm -> delete or cancel. Those are the steps we analyzed in this commonly needed workflow in data management applications.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/05/18/swift-how-to-setting-up-a-table-view/" title="Swift How-To: Setting up a Table View">Swift How-To: Setting up a Table View</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/11/24/swift-uitableviewdatasource-cheat-sheet/" title="Swift UITableViewDataSource Cheat Sheet">Swift UITableViewDataSource Cheat Sheet</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/05/28/sync-table-view-data-nsfetchedresultscontroller-swift/" title="Sync Table View Data: NSFetchedResultsController and Swift">Sync Table View Data: NSFetchedResultsController and Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/02/12/custom-uitableviewcell-text-input-swift/" title="Custom UITableViewCell for Text Input in Swift">Custom UITableViewCell for Text Input in Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.06-PM.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.11-PM.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/iOS-Simulator-Screen-Shot-Jul-16-2015-1.07.15-PM.png