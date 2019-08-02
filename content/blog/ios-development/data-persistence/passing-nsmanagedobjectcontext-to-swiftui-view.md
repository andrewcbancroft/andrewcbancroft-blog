---
title: "How to Pass NSManagedObjectContext to a SwiftUI View"
description: ""
author: Andrew
type: blog
draft: false
date: 2019-08-02T03:11:48+00:00
wip: false
showrecent: false
disppsbadge: true
tags:
  - Core Data
  - SwiftUI
images:
---

Step 1 to [using Core Data with SwiftUI](/blog/ios-development/data-persistence/using-core-data-with-swiftui-introduction/) is to initialize the Core Data stack and pass an instance of your `NSManagedObjectContext` to your view.

## First Things First
The remainder of this how-to assumes that you've already got a way to initialize the Core Data stack

Ticking the 'Use Core Data' checkbox when you start a new app will place some boilerplate code in `AppDelegate`

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

