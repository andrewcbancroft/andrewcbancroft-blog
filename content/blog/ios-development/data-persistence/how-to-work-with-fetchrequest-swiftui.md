---
title: "How to work with @FetchRequest in SwiftUI"
description: "Breaks down how to use the @FetchRequest property wrapper in your SwiftUI Views."
author: Andrew
type: blog
draft: true
date: 2019-08-02T03:11:48+00:00
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
* The remainder of this how-to assumes that you've already got a way to initialize the Core Data stack.

  * Ticking the 'Use Core Data' checkbox when you start a new app will place some boilerplate code in `AppDelegate`.

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

## Breaking Down the Code

**SceneDelegate.swift**
{{< highlight swift "linenos=table" >}}
func scene(_ scene: UIScene, 
            willConnectTo session: UISceneSession, 
            options connectionOptions: UIScene.ConnectionOptions) {

    if let windowScene = scene as? UIWindowScene {
        let window = UIWindow(windowScene: windowScene)
        
        // ❇️ Get the managedObjectContext from the persistent container
        // ❇️ This assumes you've left the Core Data stack creation code within AppDelegate
        let managedObjectContext = (UIApplication.shared.delegate as! AppDelegate).persistentContainer.viewContext
        
        // ❇️ Pass it to the ContentView through the 
        // ❇️ managedObjectContext @Environment variable
        let contentView = ContentView()
                            .environment(\.managedObjectContext, managedObjectContext)
        
        window.rootViewController = UIHostingController(rootView: contentView)
        
        self.window = window
        window.makeKeyAndVisible()
    }
}
{{< / highlight >}}

**ContentView.swift**

{{< highlight swift "linenos=table" >}}
import SwiftUI

struct SwiftUIView: View {
    // ❇️ Access the @Environment's managedObjectContext variable
    // ❇️ and keep a reference to use later
    @Environment(\.managedObjectContext) var managedObjectContext

    var body: some View {
        // ❇️ Use self.managedObjectContext however you need within your SwiftUI view!
    }
}
{{< / highlight >}}

For a more complete guide to using Core Data with SwiftUI, you can refer to the [introduction I published](/blog/ios-development/data-persistence/using-core-data-with-swiftui-introduction/).  It includes an example project with all of the pieces stitched together!