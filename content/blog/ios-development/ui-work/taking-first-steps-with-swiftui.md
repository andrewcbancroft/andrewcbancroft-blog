---
title: "Taking First Steps With SwiftUI"
description: "A listing of learnings from the Apple SwiftUI Creating and Combining Views tutorial"
author: Andrew
type: blog
date: 2019-06-03T03:11:48+00:00
wip: false
showrecent: true
tags:
  - SwiftUI
images:
  - images/social-assets/Twitter - Taking First Steps With SwiftUI.png
  - images/social-assets/FB - Taking First Steps With SwiftUI.png
---

<a name="resources" class="jump-target"></a>
<div class="resources">
<div class="resources-header">
Resources
</div>
<ul class="resources-content">
<li>
<i class="fas fa-book"></i> <a href="https://developer.apple.com/tutorials/swiftui/creating-and-combining-views" rel="nofollow">Tutorial Reference</a>
</li>
</ul>
</div>

## Enabling SwiftUI
Opting in to using SwiftUI is as easy as creating a new project with Xcode 11 and clicking the "Use SwiftUI" checkbox.

![Check Use SwiftUI](enable-swiftui.png)

## Starting Point
Xcode will give you two structs to start with:

* One that describes the `View`'s content and layout
* One that declares a preview for that `View`

**View**

```swift
struct ContentView: View {
    var body: some View {
        // This is where you describe the view's content, layout, and behavior
    }
}
```

A view's content, layout, and behavior get described in the `body` property.

**Preview**

```swift
struct ContentView_Previews : PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
```

## Seeing What You're Doing
Xcode gives you a canvas so that you can visually see what your SwiftUI code is doing.

Open it by clicking `Editor > Editor and Canvas`

## Wait, Where's the Canvas?
If you don't have the option to view the canvas in Xcode, it's because this feature requires you to be running macOS Catalina.

Don't feel left out of the SwiftUI fun, though!  Just press `command` + `R` to see everything load up in the iOS 13 Simulator.

If you're learning, you might opt to use [SwiftUI in a Playground](/blog/ios-development/ui-work/using-swiftui-in-playground/) for a more convenient workflow!

## Syncing Changes Between SwiftUI Code and Xcode's Canvas
Changing and saving your SwiftUI view code automatically updates the canvas preview.

Changing the view using Xcode's view inspector automatically updates your SwiftUI code!

I love this quote:

> Your code is always the source of truth for the view. When you use the inspector to change or remove a modifier, Xcode updates your code immediately to match.

## Combining Views:  The Key is Stacks
```swift
struct ContentView: View {
    var body: some View {
        // This is where you describe the view's content, layout, and behavior
    }
}
```

A view's content, layout, and behavior get described in the `body` property.

`body` only returns a single view, though.

To combine multiple views together, you use a **stack**.

Stacks can be vertical (`VStack`), horizontal (`HStack`), or "back-to-front" (`ZStack`).

## Spacing Things Out

Use a `Spacer` to make a containing view expand out to use all of its parent view

```swift
struct ContentView : View {
    var body: some View {
        VStack(alignment: .leading, spacing: nil) {
            Text("Turtle Rock")
                .font(.title)
            
            HStack{
                Text("Joshua Tree National Park")
                    .font(.subheadline)
                
                Spacer() // Make the horizontal stack use up all the horizontal space of the parent VStack
                
                Text("California")
                    .font(.subheadline)
            }
        }
    }
}
```

## Giving Views Some Breathing Room
Use the `padding()` modifier to give a view some breathing room.