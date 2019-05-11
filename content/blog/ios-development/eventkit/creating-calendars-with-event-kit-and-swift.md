---
title: Creating Calendars with Event Kit and Swift
author: Andrew
type: blog
date: 2015-06-17T17:46:29+00:00
aliases:
  - /2015/06/17/creating-calendars-with-event-kit-and-swift/
dsq_thread_id:
  - "3856563355"
categories:
  - Swift
tags:
  - Calendars
  - Event Kit
  - Swift

---
<small>Updated on April 19, 2016 – Swift 2.1 | Added example project</small>

Apple’s Event Kit framework empowers developers to interact with an iOS device’s calendar database. Not only can we read calendars and events from the database, we can also _create_ calendars.

In a previous article, we looked at [how to handle asking the user for permission to access their calendars][1]. Now my goal is to show you how to create local calendars on the user's device programmatically with Swift using the Event Kit framework.


Here's a demo of what we're going for by the time I'm finished with this article:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/06/CreateCalendarDemo.gif" alt="Create Calendar Demo" width="473" height="845" class="alignnone size-full wp-image-12814" />][2]

If you'd like to tinker with the code for yourself, you can download the example project:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/EventTracker/tree/create-calendar" title="Event Tracker - Create Calendar">Event Tracker – Create Calendar</a>
    </li>
  </ul>
</div>

<a name="import-eventkit" class="jump-target"></a>

### Import EventKit

Step 1 in this whole process will be to import EventKit at the top of your Swift file:

```swift
import UIKit
import EventKit

// ...
```

Importing EventKit gives us access to everything we need to work with calendars.

<a name="general-outline" class="jump-target"></a>

### General outline for creating a local calendar

Now, we'll proceed with creating a local calendar on the user's device. It's important to note that there are other kinds of calendars that you can create. For example, you can create calendars that sync with iCloud. For now though, we're going to narrow the focus down to just creating the calendar on the user's local device.

Here's the general outline (and then some code):

  * Create an `EKEventStore` instance
  * Create a new `EKCalendar` instance using that event store instance
  * Configure the new calendar's `title`
  * Wire up the new calendar's source 
      * Obtain a list of the available sources from the event store instance
      * Filter that list down to the `EKSourceTypeLocal` source type
      * Assign it to the calendar's `source` property
  * Save the calendar using the event store instance
  * Handle any problems that might have occurred

<a name="code-example" class="jump-target"></a>

### Code example

That's the general outline&#8230; Now for the code!

```swift
// Create an Event Store instance
let eventStore = EKEventStore();

// Use Event Store to create a new calendar instance
// Configure its title
let newCalendar = EKCalendar(forEntityType: .Event, eventStore: eventStore)

// Probably want to prevent someone from saving a calendar
// if they don't type in a name...
newCalendar.title = "Some Calendar Name"

// Access list of available sources from the Event Store
let sourcesInEventStore = eventStore.sources 

// Filter the available sources and select the "Local" source to assign to the new calendar's
// source property
newCalendar.source = sourcesInEventStore.filter{
    (source: EKSource) -> Bool in
    source.sourceType.rawValue == EKSourceType.Local.rawValue
}.first!

// Save the calendar using the Event Store instance
do {
    try eventStore.saveCalendar(newCalendar, commit: true)
    NSUserDefaults.standardUserDefaults().setObject(newCalendar.calendarIdentifier, forKey: "EventTrackerPrimaryCalendar")
} catch {
    let alert = UIAlertController(title: "Calendar could not save", message: (error as NSError).localizedDescription, preferredStyle: .Alert)
    let OKAction = UIAlertAction(title: "OK", style: .Default, handler: nil)
    alert.addAction(OKAction)
    
    self.presentViewController(alert, animated: true, completion: nil)
}
```

The most confusing part of the code above for me was obtaining the right source to assign to the new calendar's `source` property. Let's unpack that for a second&#8230;

<a name="assign-source" class="jump-target"></a>

#### Obtaining and assigning the calendar's source

The `eventStore` instance gives us the ability to query for a listing of its relevant calendar source types. But why are we going to the event store just to get a list of all the sources so that we can filter it down to just the one we want? Well, because this is the only way to get `EKSource` instances! Take a look at this quote from the [Apple Documentation][3]:

> **You do not create instances of `EKSource`**. You _retrieve_ EKSource objects from an `EKEventStore` object. Use the sources property to get all the `EKSource` objects for an event store, and use the methods in this class to access properties of the source object. (emphasis added) 

So that answers the question of why we query the event store for that list of source types. But now, how do we narrow that list down to the one we want? That's where the call to `filter` comes in&#8230;

First let's isolate that code segment from the rest so it's clear what we're analyzing:

```swift
newCalendar.source = sourcesInEventStore.filter{
    (source: EKSource) -> Bool in
    source.sourceType.rawValue == EKSourceType.Local.rawValue
}.first!
```

The goal of this code is to take the list of sources in the event store, and filter them so that only the one matching the value of `EKSourceTypeLocal` is returned. This is easily accomplished using the `filter` function on the array of `EKSources` that's returned by the event store.

But `filter` _also_ returns an array, so to get the single source we're looking for, we'll simply grab the `first` element out of the array `filter` returns, and assign it to the new calendar's `source` property. There are no duplicated `EKSourceTypes` in the list returned by the event store, so our filter expression should only return one match wrapped in an array.

That's it for configuring the calendar. The remainder of the code uses the event store instance to save the calendar, and handle any errors that might occur with the save process.

<a name="save-identifier" class="jump-target"></a>

### Saving the calendar identifier

One last thing to note is that if you're creating a calendar for your app to store events in, you probably want to stash the calendar's identifier value somewhere, so that you can query the event store for the calendar directly, at a later point in time.

Using `NSUserDefaults.standardUserDefaults()` is a convenient way to store this calendar identifier value. The code to pay attention to is highlighted in this snippet:

```swift
// ...

// Save the calendar using the Event Store instance
do {
    try eventStore.saveCalendar(newCalendar, commit: true)
    NSUserDefaults.standardUserDefaults().setObject(newCalendar.calendarIdentifier, forKey: "EventTrackerPrimaryCalendar")
} catch {
    let alert = UIAlertController(title: "Calendar could not save", message: (error as NSError).localizedDescription, preferredStyle: .Alert)
    let OKAction = UIAlertAction(title: "OK", style: .Default, handler: nil)
    alert.addAction(OKAction)
    
    self.presentViewController(alert, animated: true, completion: nil)
}
```

So assuming that the calendar was saved successfully without error, we'll simply access the standard user defaults, and insert a new object (our calendar's identifier) for a key that we'll use to retrieve the identifier again later.

### Wrapping up

Having the ability to create a calendar for an iOS application using Event Kit is a powerful thing if you're wanting to take advantage of some of the built-in event-related features of the iOS platform. In this article we saw how to create a calendar using Event Kit and Swift. Additionally we analyzed some of the less-than-intuitive pieces of accessing the event store for a list of sources. We concluded by saving the new calendar's identifier to `NSUserDefaults` so that we could easily retrieve the calendar from the event store at a later time.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/05/14/beginners-guide-to-eventkit-in-swift-requesting-permission/" title="Beginner’s Guide to EventKit in Swift – Requesting Permission">Beginner’s Guide to EventKit in Swift – Requesting Permission</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/04/28/listing-calendar-events-with-event-kit-and-swift/" title="Listing Calendar Events with Event Kit and Swift">Listing Calendar Events with Event Kit and Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/06/02/creating-calendar-events-with-event-kit-and-swift/" title="Creating Calendar Events with Event Kit and Swift">Creating Calendar Events with Event Kit and Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/2015/05/14/beginners-guide-to-eventkit-in-swift-requesting-permission/ "Beginner’s Guide to EventKit in Swift – Requesting Permission"
 [2]: https://www.andrewcbancroft.com/wp-content/uploads/2015/06/CreateCalendarDemo.gif
 [3]: https://developer.apple.com/library/prerelease/mac/documentation/EventKit/Reference/EKSourceClassRef/index.html