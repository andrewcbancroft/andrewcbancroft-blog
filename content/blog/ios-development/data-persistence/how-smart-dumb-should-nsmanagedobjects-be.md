---
title: "How Smart (Or Dumb?) Should NSManagedObjects Be?"
description: "Offers thoughts on what to implement in an NSManagedObject subclass."
author: Andrew
type: blog
date: 2019-06-19T04:40:54+00:00
categories:
  - Core Data
wip: false
showrecent: false
sol: false
images:
  - images/social-assets/Twitter - How Smart Or Dumb Should NSManagedObjects Be.png
  - images/social-assets/Facebook - How Smart Or Dumb Should NSManagedObjects Be.png
toc: true
disppsbadge: true
---

Apps aren't "dumb".  Apps do things.  *Smart* things.  The question is:  Where do the "smart parts" go?

So how you smart or how dumb should `NSManagedObject` subclasses be?

What code should you write in one of these? What should you *not*?

## TLDR;
Keep `NSManagedObject`s about Core Data-y things.  

Ask, "Does this help my `NSManagedObject` subclass work with Core Data-related functionality?"  

Let the answer to that question guide your decision about whether to extend your `NSManagedObject` subclass with additional features.

## Designed Overrides
Apple has designed some spots for you to customize an `NSManagedObject`'s default behavior.

### Managed Object "Life Cycle" Events
`NSManagedObject` comes with several overridable methods that you can implement in order to "hook in" to the life cycle of the object.  What do I mean?  Check out this sampling of overrideable methods:

`awakeFromFetch()`: Provides an opportunity to add code into the life cycle of the managed object when Core Data is bringing the object from the persistent store into memory.

`awakeFromInsert()`: Provides an opportunity to add code into the life cycle of the managed object when it is initially created.

`willSave()`: Provides an opportunity to add code into the life cycle of the managed object when it is about to be saved.

`didSave()`: Provides an opportunity to add code into the life cycle of the managed object after the managed object’s context completes a save operation.

These methods can be overwritten to add code that should be strategically executed at these pre-determined-by-Apple points in time.

### Validation Code
You an implement custom validation logic in an `NSManagedSubclass`.  Don't override `validateValue(_:forKey:)` though.

Instead, implement a custom method with a signature that matches the signature of `validatePropertyName:error:`.

For example, if your `NSManagedObject` subclass has an `age` property and you wanted to implement special validation logic, you could do this:

```swift
func validateAge(value: AutoreleasingUnsafeMutablePointer<AnyObject?>) throws {
    guard let valueNumber = value.pointee as? NSNumber else { return }
    
    if valueNumber.floatValue > 0.0 {
        return
    }
    
    let errorStr = NSLocalizedString("Age must be greater than zero", tableName: "Employee", comment: "validation: zero age error")
    let userInfoDict = [NSLocalizedDescriptionKey: errorStr]
    let error = NSError(domain: "EMPLOYEE_ERROR_DOMAIN", code: 1123, userInfo: userInfoDict)
    throw error
}
```

You could also override one of these methods to add advanced validation:

* `validateForInsert()`
* `validateForUpdate()`
* `validateForDelete()`

### Key-Value Observing
`NSManagedObject` subclasses inherit methods related to key-value observing that could be appropriate to override.

### Summarizing Designed Overrides
Have you noticed a pattern in each of these sections?

Key word:  **override**

Apple designed `NSManagedObject` with intentional, overrideable methods.  

"Should I implement `this code` here?"  

Take a look at the method names and let that be a guiding factor in your decision-making.  

## On Fetching Behavior

Xcode adds a `fetchRequest` method when it auto-generates code for you.  So...I'd say it's probably okay to put some *basic* fetching behavior with an `NSManagedObject` subclass.  Keep it simple though:

```swift
  @nonobjc public class func fetchRequest() -> NSFetchRequest<EntityName> {
      return NSFetchRequest<EntityName>(entityName: "EntityName")
  }
```

My personal preference is to put object fetching behavior in a separate Type.

You might make a `DataProvider` Type and let *it* handle setting up `NSFetchRequest`(s) with appropriate predicates and sort descriptors.

Avoid putting *all* data-providing code in a catch-all `DataProvider`.  If you're fetching `Note`s, make a `NoteProvider`.  If you're fetching `Tag`s, make a `TagProvider`.

## On Convenience Properties & Functions

One piece of convenience code that I extend my `NSManagedObject` subclasses with is an `entityName` property.

This helps me avoid sprinkling the name of an Entity in `String` form throughout my code.

```swift
extension EntityName {
    static let entityName = "EntityName"
}
```

When it comes to other types of functionality, my recommendation is to put that code elsewhere.

Keep `NSManagedObject`s about Core Data-y things.  

Ask, "Does this help my `NSManagedObject` subclass work with Core Data-related functionality?"  

Let the answer to that question guide your decision about whether to extend your `NSManagedObject` subclass with additional features.

"Additional features" often translates to "additional responsibility". Single responsibility is the name of the game if you can achieve it.

https://developer.apple.com/documentation/coredata/nsmanagedobject