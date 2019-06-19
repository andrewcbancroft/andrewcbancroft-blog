---
title: "On Core Data Object Fetching and Display Strategies"
description: "Offers thoughts on a strategy question from my inbox for fetching Core Data objects and displaying them in a table view."
author: Andrew
type: blog
date: 2019-06-14T04:40:54+00:00
categories:
  - Core Data
wip: false
showrecent: false
sol: false
images:
aliases:
  - /blog/ios-development/swifting-out-loud/on-core-data-object-fetching-and-display-strategies/
disppsbadge: true
---

## Setting the Stage
Suppose one of the `NSManagedObject` subclasses from your Core Data data model looked like this:

```swift
public class BlogIdea: NSManagedObject {

    @NSManaged public var ideaTitle: String?
    @NSManaged public var ideaDescription: String?

}
```

Suppose that you also have a class that will provide `BlogIdeas` to your view controller:

```swift
class BlogIdeaProvider {
    // fetches BlogIdea instances to use in your view controller
}
```

**Requirement:** Say that you need to list all of the `ideaTitle`s you have inside of a table view (note that you *don't* need to display the `ideaDescription` at this time).

**Question:**  Which of the following strategies would you recommend for this requirement?

1) Fetch all the `BlogIdea` objects, return them, and then use those returned `NSManagedObject` instances to display the `ideaTitle` in the table view.

{{< highlight swift "hl_lines=2" >}}
class BlogIdeaProvider {
    func fetchBlogIdeas() -> [BlogIdea] {
        // fetch BlogIdea instances

        // return the BlogIdea NSManagedObject subclass for the view controller to use
    }
}
{{< /highlight >}}

2) Fetch all of the `BlogIdea` objects, but make a `fetchBlogIdeaTitles` function instead. Just return the `ideaTitle`s, say, in an array of strings to display in the table view.

{{< highlight swift "hl_lines=2" >}}
class BlogIdeaProvider {
    func fetchBlogIdeaTitles() -> [String] {
        // fetch BlogIdea instances

        // pull out ONLY the ideaTitle, 
        // assemble an array for the titles, 
        // return the array
    }
}
{{< /highlight >}}

## Swifting Out Loud
I'll give my recommendation and then walk through my reasoning.

In nearly all situations, I would go with option number 1: fetch the `NSManagedObject` instances that I need to display, and work with those fully-featured objects, rather than go through the effort to return only the `String`s that I need for display.

**Why?**

To that, I'd ask the question:  "What are you planning to do *next*, once the `ideaTitle`s are displayed in the table view?

Presumably, you're displaying them *so that* a user can tap on a cell and...do something with them.  And that "do something with them" part almost always means

* Show *more* details (in which case, you need the `ideaDescription` property as well now)
* *Edit* the object (in which case you get all your saving features only **if** it's in `NSManagedObject` form)
* *Delete* the object (again...needs to be a full `NSManagedObject` to easily delete)

## Efficiency Trade-offs
One might be concerned about efficiency -- "Why return a full object when you only need one of its properties?"

That's true. You only need one property...*for now*.  Again, I think it goes back to "what happens next?"  

### Fetching Efficiency
Will you display the `ideaTitle` and then have to go fetch *again* to get the rest of what you need from your persistent store?  That's almost guaranteed to be less efficient than holding the full `NSManagedObject` in memory from the start.

### Memory Efficiency
If you're trying to stay memory-efficient, perhaps another idea is to fetch only a subset of the `BlogIdea`s... You could limit the number of results that come back (after all, only so many can be shown in a table view at a time, anyway, right?).

### Code Efficiency
When you say "Core Data" and "table view" in the same sentence, it should also trigger the word `NSFetchedResultsController`.  This class is a huuuuge help because it was designed specifically for displaying data from `NSManagedObject`s in table or collection views.  If you only return an array of `String`s, you'll have to write a bunch of boiler plate code yourself to keep your table view in sync with your persistent store, but you get all of that for free with `NSFetchedResultsController`.

Using `NSFetchedResultsController` would change the code a bit.  Instead of returning an array of blog ideas (`[BlogIdea]`), you could hold a reference to a `NSFetchedResultsController<BlogIdea>` and configure it to fetch:

{{< highlight swift "hl_lines=21" >}}
// MARK: - Concept
// If you give a `Provider` a persistent container, and a fetched results controller delegate to talk back to,
// a `Provider` Type can act as a liaison between the view controller and the pieces of Core Data that are needed
// to initialize a fetched results controller, perform fetches, and other Core Data related actions on behalf of your
// view controller (instead of you putting all this code in the view controller itself)...

class BlogIdeaProvider {
    private var persistentContainer: NSPersistentContainer
    private weak var fetchedResultsControllerDelegate: NSFetchedResultsControllerDelegate?
    
    // MARK: - Initializers
    init(with persistentContainer: NSPersistentContainer, 
              fetchedResultsControllerDelegate: NSFetchedResultsControllerDelegate?) {

        self.persistentContainer = persistentContainer
        self.fetchedResultsControllerDelegate = fetchedResultsControllerDelegate

    }
    
    // use this in your view controller to display BlogIdea instances
    lazy var fetchedResultsController : NSFetchedResultsController<BlogIdea> = {
        // Configure a fetched results controller and perform an initial fetch
        let blogIdeasFetchRequest = NSFetchRequest<BlogIdea>(entityName: "BlogIdea")
        
        let controller = NSFetchedResultsController<BlogIdea>(  fetchRequest: blogIdeasFetchRequest,
                                                                managedObjectContext: self.persistentContainer.viewContext,
                                                                sectionNameKeyPath: nil,
                                                                cacheName: nil)
        
        controller.delegate = self.fetchedResultsControllerDelegate
        
        do {
            try controller.performFetch()
        } catch {
            fatalError("\(#function): Failed to performFetch: \(error)")
        }
        
        return controller
    }()
}
{{< /highlight >}}

## Concluding Thoughts
I know I keep going back to it, but I think it's what will help make the decision.  

What's the next thing you're expecting to happen after you fetch the objects and display them?  

Let that be your guiding principle for your fetching and displaying strategy.

With Core Data, it's almost always going to be more convenient to be working with `NSManagedObject`s.  Start there, and handle efficiency problems as they arise. 🙌🏻


