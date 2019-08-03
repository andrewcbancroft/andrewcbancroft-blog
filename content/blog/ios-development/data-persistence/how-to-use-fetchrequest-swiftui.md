---
title: "How to Use @FetchRequest in SwiftUI"
description: "Breaks down how to use the @FetchRequest property wrapper in your SwiftUI Views."
author: Andrew
type: blog
draft: false
date: 2019-08-03T03:11:48+00:00
wip: false
showrecent: false
disppsbadge: true
tags:
  - Core Data
  - SwiftUI
images:
---

Once you've [passed an NSManagedObjectContext instance to your SwiftUI View](/blog/ios-development/data-persistence/using-core-data-with-swiftui-introduction/), you'll need to pull data out of your Core Data persistent store with a fetch request.

## First Things First
* The remainder of this how-to assumes that you've already got a way to initialize the Core Data stack. Ticking the 'Use Core Data' checkbox when you start a new app will place some boilerplate code in `AppDelegate`.
* `@Environment(\.managedobjectcontext)` must [be assigned](/blog/ios-development/data-persistence/passing-nsmanagedobjectcontext-to-swiftui-view/) before the View is initialized for `@FetchRequest` to work.
* Code examples are taken from my "Blog Idea List" sample project that includes a single Core Data Entity named `BlogIdea`:

![Blog Idea Entity](/blog/ios-development/data-persistence/using-core-data-with-swiftui-introduction/blog-idea-entity.png)

<a name="resources" class="jump-target"></a>
<div class="resources">
<div class="resources-header">
Resources
</div>
<ul class="resources-content">
<li>
<i class="fas fa-file-code"></i> <a href="https://github.com/andrewcbancroft/BlogIdeaList-SwiftUI"> Blog Idea List SwiftUI Example Xcode Project</a>
</li>
</ul>
</div>

You can refer to my [introduction to using Core Data with SwiftUI](/blog/ios-development/data-persistence/using-core-data-with-swiftui-introduction/) to review all of the steps in one spot.  It includes an example project with all of the pieces stitched together!

## Breaking Down the Code
There are three key components to this:

1. A way to configure an `NSFetchRequest` *with* an `NSSortDescriptor` added. Your app will blow up 💥 if you don't have one added to your fetch request.
2. The `@FetchRequest` property wrapper in your SwiftUI view.
3. A SwiftUI View that displays the results of the executed fetch request.

The following code snippets provide you an example of how to weave all three components together.

Comments with ❇️ symbols will explain the details inline.

**BlogIdea.swift**
{{< highlight swift "linenos=table" >}}
import Foundation
import CoreData

// ❇️ BlogIdea code generation is turned OFF in the xcdatamodeld file
public class BlogIdea: NSManagedObject, Identifiable {
    @NSManaged public var ideaTitle: String?
    @NSManaged public var ideaDescription: String?
}

extension BlogIdea {
    // ❇️ The @FetchRequest property wrapper in the ContentView will call this function
    static func allIdeasFetchRequest() -> NSFetchRequest<BlogIdea> {
        let request: NSFetchRequest<BlogIdea> = BlogIdea.fetchRequest() as! NSFetchRequest<BlogIdea>
        
        // ❇️ The @FetchRequest property wrapper in the ContentView requires a sort descriptor
        request.sortDescriptors = [NSSortDescriptor(key: "ideaTitle", ascending: true)]
          
        return request
    }
}
{{< / highlight >}}

**ContentView.swift**

{{< highlight swift "linenos=table" >}}
import SwiftUI

struct SwiftUIView: View {
    // ❇️ The BlogIdea class has an `allIdeasFetchRequest` function that can be used here
    @FetchRequest(fetchRequest: BlogIdea.allIdeasFetchRequest()) var blogIdeas: FetchedResults<BlogIdea>

    var body: some View {
        List(self.blogIdeas) { blogIdea in
            Text(blogIdea.ideaTitle ?? "")
        }
    }
}
{{< / highlight >}}

 Note that you don't actually need to hold a reference to the `@Environment`'s `managedObjectContext`.

 `@Environment`'s `managedObjectContext` must be set! But you don't have to "call" it or use it directly to make the fetch request "go".


## Where's the Call to Perform the Fetch Request?
With most Core Data apps, you're going to see a call to `fetch(_:)` somewhere in your code.

This happens "behind the scenes" when you use the `@FetchRequest` property wrapper in your SwiftUI view. No need to use your managed object context to perform the fetch request manually.

For a more complete guide to using Core Data with SwiftUI, you can refer to the [introduction I published](/blog/ios-development/data-persistence/using-core-data-with-swiftui-introduction/).  It includes an example project with all of the pieces stitched together!