---
title: Listing Calendar Events with Event Kit and Swift
author: Andrew
type: blog
date: 2016-04-28T17:50:22+00:00
url: /2016/04/28/listing-calendar-events-with-event-kit-and-swift/
dsq_thread_id:
  - "4784680501"
categories:
  - Swift
tags:
  - Calendars
  - EventKit
  - Swift

---
This is the continuation of a series of articles I've writing for Swift developers working with Event Kit.

Supposing that after [asking the user for permission][1] to use their calendars, and even allowing users to [create _new_ calendars][2] from within your iOS app, one possible next step could be to list out all of the events for a calendar that they tap on.

<a name="demo" class="jump-target"></a>

# Demo

Here's what we're going for by the end of this:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/list-events-demo.gif" alt="List Events Demo" width="468" height="844" class="alignnone size-full wp-image-12819" />][3]

In this walk-through, I'll explore the Event Kit API that allows us to query the user's device to find and list out events for a calendar that match a date range.

<a name="example-project" class="jump-target"></a>

# Example project

I've got an example project up on GitHub that contains all the code necessary to list out events for a calendar inside of a table view. You can download that project here:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/EventTracker/tree/list-events-for-calendar" title="Event Tracker Example Project">Event Tracker Example Project</a>
    </li>
  </ul>
</div>

<a name="querying-for-events" class="jump-target"></a>

# Querying for events

The primary thing you'll need to do in order to display a list of events from a calendar is to query the event store for events matching a properly configured `NSPredicate`.

Here's a snippet of code, followed by an analysis of what's going on:

```swift
class EventsViewController: UIViewController, UITableViewDataSource {
    var calendar: EKCalendar! // Passed in from previous view controller
    var events: [EKEvent]?

    // ...

    func loadEvents() {
        // Create a date formatter instance to use for converting a string to a date
        let dateFormatter = NSDateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        
        // Create start and end date NSDate instances to build a predicate for which events to select
        let startDate = dateFormatter.dateFromString("2016-01-01")
        let endDate = dateFormatter.dateFromString("2016-12-31")
        
        if let startDate = startDate, endDate = endDate {
            let eventStore = EKEventStore()
            
            // Use an event store instance to create and properly configure an NSPredicate
            let eventsPredicate = eventStore.predicateForEventsWithStartDate(startDate, endDate: endDate, calendars: [calendar])
            
            // Use the configured NSPredicate to find and return events in the store that match
            self.events = eventStore.eventsMatchingPredicate(eventsPredicate).sort(){
                (e1: EKEvent, e2: EKEvent) -> Bool in
                return e1.startDate.compare(e2.startDate) == NSComparisonResult.OrderedAscending
            }
        }
    }
    // ...
}
```

<a name="context-view-controller" class="jump-target"></a>

## Context: View controller

The context of the above snippet is a view controller. Inside the view controller class, there's a calendar instance that is presumably set in the previous view controller's `prepareForSegue` method. There's also an optional array of `EKEvent` instances that acts as the data source for a table view, and a function called `loadEvents` in this view controller.

<a name="configure-start-end-dates" class="jump-target"></a>

## Configure start and end dates

The first few lines of code within the `loadEvents` function are to facilitate configuring a start and end date to use for querying the event store.

<a name="generate-nspredicate" class="jump-target"></a>

## Use the event store to generate NSPredicate

To actually query the store, you need to create an `NSPredicate` instance. However, rather than calling `NSPredicate's` initializer, you will use an `EKEventStore` instance to _generate_ a predicate. Apparently there's some under-the-hood work that goes on to get a properly configured `NSPredicate` instance to use in your query.

So assuming you've got a valid start date, end date (both `NSDate` instances), and one or more calendars to search for events within, you'll use the event store's `predicateForEventsWithStartDate(_: endDate: calendars:)` method to get an `NSPredicate` instance.

<a name="query-with-nspredicate" class="jump-target"></a>

## Query the event store with generated NSPredicate

The last step is to call `eventsMatchingPredicate(_:)` on the event store, and use the predicate you just generated. You can optionally sort them, as I've done in the snippet.

# Wrapping up

That's the meat of querying the event store for a list of events. To learn how display them in a table view, I would recommend going ahead and [grabbing the example project that I've provided][4]. I've also got a couple of guides on working with table views if you need assistance with that part:

<div class="resources">
  <div class="resources-header">
    Table View Guides
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-link"></i> <a href="https://www.andrewcbancroft.com/2015/05/18/swift-how-to-setting-up-a-table-view/" title="Swift How-To: Setting up a Table View">Swift How-To: Setting up a Table View</a>
    </li>
    <li>
      <i class="fab fa-link"></i> <a href="https://www.andrewcbancroft.com/2014/11/24/swift-uitableviewdatasource-cheat-sheet/" title="Swift UITableViewDataSource Cheat Sheet">Swift UITableViewDataSource Cheat Sheet</a>
    </li>
  </ul>
</div>

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/05/14/beginners-guide-to-eventkit-in-swift-requesting-permission/" title="Beginner’s Guide to Event Kit in Swift – Requesting Permission">Beginner’s Guide to Event Kit in Swift – Requesting Permission</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/06/17/creating-calendars-with-event-kit-and-swift/" title="Creating Calendars with Event Kit and Swift">Creating Calendars with Event Kit and Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/06/02/creating-calendar-events-with-event-kit-and-swift/" title="Creating Calendar Events with Event Kit and Swift">Creating Calendar Events with Event Kit and Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/2015/05/14/beginners-guide-to-eventkit-in-swift-requesting-permission/
 [2]: https://www.andrewcbancroft.com/2015/06/17/creating-calendars-with-event-kit-and-swift/
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/list-events-demo.gif
 [4]: https://github.com/andrewcbancroft/EventTracker/tree/list-events-for-calendar