---
title: Using SwiftUI in a Playground
description: What if you could iterate on SwiftUI views more quickly, even if you lack macOS Cataline? Try it out in a Swift Playground!
author: Andrew
type: blog
date: 2019-06-13T04:00:18+00:00
showrecent: true
categories:
  - SwiftUI
tags:
  - Swift
  - SwiftUI
  - Playground
images:
  - images/social-assets/Twitter - Using SwiftUI in a Playground.png
---

If you're looking for a quicker way to iterate while you're building SwiftUI views, and you don't have macOS Catalina installed, you might enjoy the Playground experience more than you enjoy pressing `command + R` every time you make a change and want to see it in the user interface.

How do you do it?  Here's a code snippet to copy-paste into a Playground to get you going.

{{< highlight swift "hl_lines=2 3 13 16" >}}
import UIKit
import PlaygroundSupport
import SwiftUI

// Make a SwiftUI view
struct ContentView: View {
    var body: some View {
        Text("SwiftUI in a Playground!")
    }
}

// Make a UIHostingController
let viewController = UIHostingController(rootView: ContentView())

// Assign it to the playground's liveView
PlaygroundPage.current.liveView = viewController

// RUN!
{{< /highlight >}}

![Result](result.png)