---
title: "Pre-populate a SwiftData Persistent Store"
description: "Learn how to pre-populte your SwiftData persistent store in a variety of scenarios."
author: Andrew
type: blog
date: 2023-06-15T00:00:00+00:00
categories:
  - SwiftData
tags:
  - SwiftData
wip: false
showrecent: true
images:
  - /images/social-assets/Twitter - Pre-populate a SwiftData Persistent Store.png
  - /images/social-assets/Facebook - Pre-populate a SwiftData Persistent Store.png
toc: true
introtext: "Pre-populating a SwiftData persistent store can be helpful if you want to provide your users with some initial data to work with when they launch your app for the first time. You might also need to seed a persistent store with test data for your unit tests or provide your Xcode preview with some initial data. The question is: How do you do it?"
disppsdatabadge: true
---

## Building Blocks

These three building blocks will get you there:

1. A `ModelContainer` instance
2. One or more instances of your `@Model` class(es)
3. Inserting those model instances into your `ModelContainer`'s `mainContext`

Let’s take those building blocks one at a time.

### Initialize a `ModelContainer`

Suppose that you’ve got a SwiftData model called `Item` that looks something like this:

```swift {linenos=table}
@Model
final class Item {
    var timestamp: Date
    
    init(timestamp: Date) {
        self.timestamp = timestamp
    }
}
```

To pre-populate your SwiftData persistent store with instances of `Item`, you need to initialize a `ModelContainer`. A `ModelContainer` manages everything about *where* SwiftData will store instances of your `Item` class.

This code will initialize a `ModelContainer` that tells SwiftData to persist instances of `Item` to permanent storage:

```swift {linenos=table}
do {
    let container = try ModelContainer(
        for: Item.self)
		//...more code to come
} catch {
    fatalError("Failed to create container")
}
```

If you’d like SwiftData to persist instances of `Item` in memory instead, this code will do it:

```swift {linenos=table,hl_lines=[3]}
do {
    let container = try ModelContainer(
        for: Item.self, ModelConfiguration(inMemory: true)
    )
		//...more code to come
} catch {
    fatalError("Failed to create container")
}
```

A `ModelContainer` with an in-memory `ModelConfiguration` will not retain any `Item` instances that you save whenever someone re-launches your app. That being the case, using an in-memory `ModelConfiguration` is more suited for unit testing, or for supplying data to your Xcode previews.

### Initialize instances of your `@Model` class(es)

Once you configure a `ModelContainer`, you need some instances of your `@Model` class to insert into the SwiftData persistent store.

If you just need a few instances to seed your persistent store with, you can initialize them manually like this:

```swift {linenos=table}
let items = [
    Item(timestamp: Date()),
    Item(timestamp: Date()),
	Item(timestamp: Date())
]
```

If you need *more* than a few instances, you may opt to decode instances of your `@Model` class from something like a CSV file, a JSON file, or a property list that you include with your application’s main bundle.

### Insert those model instances into your `ModelContainer`'s `mainContext`

The last step is to insert those instances of your model into your `ModelContainer`'s `mainContext`.

This code loops over an array of `Item` instances and inserts them into your SwiftData persistent store:

```swift {linenos=table}
for item in items {
    container.mainContext.insert(object: item)
}
```

## Where do you write all this code?

You may be reading the building block code above and think, “Wait…where do I *write* all this code?”

The answer depends on what you’re trying to do.

- Are you trying to pre-populate your SwiftData persistent store for your production app?
- Are you trying to pre-populate the persistent store for an Xcode preview?
- Are you trying to pre-populate it for your unit tests?

### For your production app

In this scenario, you can create a new Swift file to put your code in. A name like **SwiftDataAppContainer** could work just fine. It’s also fine to add the code to your **“AppName”App.swift** file where you initialize your SwiftUI `App` instance.

`ModelContainer`'s initializer can throw, but you can’t just write a `do-catch` statement globally. You may consider wrapping the container creation code in a closure, and running that closure immediately by adding `()` to the end of the closure expression: 

```swift {linenos=table,hl_lines=[1, 10]}
@MainActor
let appContainer: ModelContainer = {
    do {
        let container = try ModelContainer(for: Item.self)
        //...
				return container // this line wasn't in any of the examples above
    } catch {
        fatalError("Failed to create container")
    }
}() // The "()" here runs the closure immediately
```

You need to the `appContainer` declaration with the `@MainActor` attribute because `container`'s `mainContext` is annotated with the `@MainActor` attribute. You’ll get a compiler error like this if you don’t:

> Main actor-isolated property 'mainContext' can not be referenced from a non-isolated context


Once you have the `appContainer` instance, you can modify your SwiftUI view, or one of your app instance’s `WindowGroup`s to have a model container:

```swift {linenos=table,hl_lines=[7]}
@main
struct TrySwiftDataApp: App {    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(appContainer)
    }
}
```

Pre-populating your SwiftData persistent store for an app that you plan to publish to the App Store comes with a special consideration: You’ve got to handle the case where someone has already launched your app and the data store pre-population code has already done its work.

In other words, you probably only want to pre-populate your persistent store on “first launch”.

To prevent the persistent store from being pre-populated over and over again, do a check to make sure the store is empty before you start inserting model instances into the `mainContext`:

```swift {linenos=table}
// Make sure the persistent store is empty. If it's not, return the non-empty container.
var itemFetchDescriptor = FetchDescriptor<Item>()
itemFetchDescriptor.fetchLimit = 1

guard try container.mainContext.fetch(itemFetchDescriptor).count == 0 else { return container }
```

You can keep things efficient by setting the `FetchDescriptor` instance’s `fetchLimit` to `1`. In other words, you don’t need to fetch every `Item` instance from the persistent store to decide whether the store is empty or not.

As long as the `count` of items that `fetch` returns is `0`, you can rest assured that the persistent store is empty and pre-populate it. If that’s not the case, the `guard`'s `else` branch will run and return the non-empty `ModelContainer` instance.

Here’s the full code example with that check included:

```swift {linenos=table}
@MainActor
let appContainer: ModelContainer = {
    do {
        let container = try ModelContainer(for: Item.self)
        
        // Make sure the persistent store is empty. If it's not, return the non-empty container.
        var itemFetchDescriptor = FetchDescriptor<Item>()
        itemFetchDescriptor.fetchLimit = 1
        
        guard try container.mainContext.fetch(itemFetchDescriptor).count == 0 else { return container }
        
        // This code will only run if the persistent store is empty.
        let items = [
            Item(timestamp: Date()),
            Item(timestamp: Date()),
            Item(timestamp: Date())
        ]
        
        for item in items {
            container.mainContext.insert(object: item)
        }
        
        return container
    } catch {
        fatalError("Failed to create container")
    }
}()
```

### For an Xcode preview

If you’re trying to pre-populate a SwiftData persistent store for an Xcode preview of your SwiftUI view, you can create a new Swift file to put your code in and name it something like **SwiftDataPreviewContainer**.

In this file, you can write code that’s similar to the code you’d write for your production app but with a couple of changes:

1. You don’t need to check for an empty store, because
2. You’re going to initialize the `ModelContainer` with an in-memory store

Here’s the full code example of what the preview container could look like:

```swift {linenos=table,hl_lines=[1,5]}
@MainActor
let previewContainer: ModelContainer = {
    do {
        let container = try ModelContainer(
            for: Item.self, ModelConfiguration(inMemory: true)
        )
        
        let items = [
            Item(timestamp: Date()),
            Item(timestamp: Date()),
            Item(timestamp: Date())
        ]
        
        for item in items {
            container.mainContext.insert(object: item)
        }
        
        return container
    } catch {
        fatalError("Failed to create container")
    }
}()
```

Then you can (in theory) use the new `#Preview` macro if you’re using Xcode 15 or above:

```swift {linenos=table,hl_lines=[1,3]}
#Preview {
    ContentView()
        .modelContainer(previewContainer)
}
```

I wrote, “in theory” because there’s a bug (as of June 14, 2023) with Xcode that causes the preview to crash when you use this macro.

As a workaround — or if you’re not using Xcode 15 — you can embed this model creation code inside of a custom `PreviewProvider` type:

```swift {linenos=table,hl_lines=[1,2,"24-27"]}
struct ContentView_Previews: PreviewProvider {
    static let previewContainer: ModelContainer = {
        do {
            let container = try ModelContainer(
                for: Item.self, ModelConfiguration(inMemory: true)
            )
            
            let items = [
                Item(timestamp: Date()),
                Item(timestamp: Date()),
                Item(timestamp: Date())
            ]
            
            for item in items {
                container.mainContext.insert(object: item)
            }
            
            return container
        } catch {
            fatalError("Failed to create container")
        }
    }()
    
    static var previews: some View {
        ContentView()
            .modelContainer(previewContainer)
    }
}
```

### For your unit tests

Pre-populating your SwiftData persistent store for your unit tests is similar to doing so for your Xcode previews, in that (depending on what you’re testing), you probably don’t need to check for an empty persistent store before pre-populating it, and you’ll likely benefit from using an in-memory store.

Here’s what you need to do:

1. Mark your `XCTestCase` class as a `@MainActor`:

```swift {linenos=table,hl_lines=[1]}
@MainActor
final class TrySwiftDataTests: XCTestCase { ... }
```

2. Add a stored property to your `XCTestCase` that will hold your `ModelContainer`:

```swift {linenos=table}
var testContainer: ModelContainer?
```

3. Set the `testContainer` property inside the `setUpWithError` function:

```swift {linenos=table}
override func setUpWithError() throws {
// Put setup code here. This method is called before the invocation of each test method in the class.

    self.testContainer = {
        do {
            let container = try ModelContainer(
                for: Item.self, ModelConfiguration(inMemory: true)
            )
            
            let items = [
                Item(timestamp: Date()),
                Item(timestamp: Date()),
                Item(timestamp: Date())
            ]
            
            for item in items {
                container.mainContext.insert(object: item)
            }
            
            return container
        } catch {
            fatalError("Failed to create container")
        }
    }()
}
```

4. Use the `testContainer` in any tests that need it:

```swift {linenos=table}
func testExample() throws {        
    let fetchDescriptor = FetchDescriptor<Item>()
    
    let result = try testContainer?.mainContext.fetch(fetchDescriptor)
    
    XCTAssertEqual(result?.count, 3)
}
```