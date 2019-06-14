---
title: "On Core Data Object Fetching and Display Strategies"
description: "Offers thoughts on a strategy question from my inbox for fetching Core Data objects and displaying them in a table view."
author: Andrew
type: blog
date: 2019-06-14T04:40:54+00:00
categories:
  - Core Data
wip: true
showrecent: false
sol: true
images:
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
    func fetchBlogIdeas() -> BlogIdea {
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
        // assenble an array for the titles, 
        // return the array
    }
}
{{< /highlight >}}
