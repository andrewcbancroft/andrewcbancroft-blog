---
title: Creating Calendar Events with Event Kit and Swift
author: Andrew
type: blog
date: 2016-06-02T17:37:15+00:00
aliases:
  - /2016/06/02/creating-calendar-events-with-event-kit-and-swift/
dsq_thread_id:
  - "4878515902"
dsq_needs_sync:
  - "1"
categories:
  - Swift
tags:
  - Event Kit
  - Swift

---
Folks have asked more about working with Event Kit and Swift, so the series continues with this guide on how to create calendar events with Event Kit and Swift!

Previous guides in the series include the following:

<div class="resources">
  <div class="resources-header">
    Previous Guides
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-link"></i> <a href="https://www.andrewcbancroft.com/2015/05/14/beginners-guide-to-eventkit-in-swift-requesting-permission/" title="Beginner’s Guide to Event Kit in Swift – Requesting Permission">Beginner’s Guide to Event Kit in Swift – Requesting Permission</a>
    </li>
    <li>
      <i class="fab fa-link"></i> <a href="https://www.andrewcbancroft.com/2015/06/17/creating-calendars-with-event-kit-and-swift/" title="Creating Calendars with Event Kit and Swift">Creating Calendars with Event Kit and Swift</a>
    </li>
    <li>
      <i class="fab fa-link"></i> <a href="https://www.andrewcbancroft.com/2016/04/28/listing-calendar-events-with-event-kit-and-swift/" title="Listing Calendar Events with Event Kit and Swift">Listing Calendar Events with Event Kit and Swift</a>
    </li>
  </ul>
</div>

<a name="demo" class="jump-target"></a>

# Demo

Here's what we're going for by the end of this:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/05/create-events-demo.gif" alt="Create Events Demo" width="468" height="847" class="alignnone size-full wp-image-12890" />][1]

As with my other guides, I've included a working project on GitHub for you to peruse and tinker with:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/EventTracker/tree/create-events" title="Event Tracker - Create Events">Event Tracker – Create Events</a>
    </li>
  </ul>
</div>

<a name="code-example" class="jump-target"></a>

# Code Example

The majority of the work to create an event happens in the example project's AddEventViewController.swift file, so that's where I'll spend my time in this guide. First, let's put the relevant code before us:

```swift
class AddEventViewController: UIViewController {

    var calendar: EKCalendar! // Intended to be set in parent controller's prepareForSegue event

    @IBOutlet weak var eventNameTextField: UITextField!
    @IBOutlet weak var eventStartDatePicker: UIDatePicker!
    @IBOutlet weak var eventEndDatePicker: UIDatePicker!

    // ...

    @IBAction func addEventButtonTapped(sender: UIBarButtonItem) {
        // Create an Event Store instance
        let eventStore = EKEventStore();
        
        // Use Event Store to create a new calendar instance
        if let calendarForEvent = eventStore.calendarWithIdentifier(self.calendar.calendarIdentifier)
        {
            let newEvent = EKEvent(eventStore: eventStore)
            
            newEvent.calendar = calendarForEvent
            newEvent.title = self.eventNameTextField.text ?? "Some Event Name"
            newEvent.startDate = self.eventStartDatePicker.date
            newEvent.endDate = self.eventEndDatePicker.date
            
            // Save the calendar using the Event Store instance
            
            do {
                try eventStore.saveEvent(newEvent, span: .ThisEvent, commit: true)
                delegate?.eventDidAdd()
                
                self.dismissViewControllerAnimated(true, completion: nil)
            } catch {
                let alert = UIAlertController(title: "Event could not save", message: (error as NSError).localizedDescription, preferredStyle: .Alert)
                let OKAction = UIAlertAction(title: "OK", style: .Default, handler: nil)
                alert.addAction(OKAction)
                
                self.presentViewController(alert, animated: true, completion: nil)
            }
        }
     }

     // ...
}
```

<a name="code-walkthrough" class="jump-target"></a>

# Code Walkthrough

The general outline of the code is this:

  * Create an instance of `EKEventStore` – this will let you create `EKEvents` and save them.

```swift
let newEvent = EKEvent(eventStore: eventStore)
```

  * Pull an `EKCalendar` instance from the Event Store – this will let you associate an event with a calendar.

```swift
if let calendarForEvent = eventStore.calendarWithIdentifier(self.calendar.calendarIdentifier) { 
// ... 
}
```

  * Create a new `EKEvent` instance and set its properties.

```swift
let newEvent = EKEvent(eventStore: eventStore)
            
newEvent.calendar = calendarForEvent
newEvent.title = self.eventNameTextField.text ?? "Some Event Name"
newEvent.startDate = self.eventStartDatePicker.date
newEvent.endDate = self.eventEndDatePicker.date
```

  * Attempt to save the event with the `EKEventStore` instance that was created first.

```swift
do {
    try eventStore.saveEvent(newEvent, span: .ThisEvent, commit: true)
    delegate?.eventDidAdd()
    
    self.dismissViewControllerAnimated(true, completion: nil)
} catch {
    let alert = UIAlertController(title: "Event could not save", message: (error as NSError).localizedDescription, preferredStyle: .Alert)
    let OKAction = UIAlertAction(title: "OK", style: .Default, handler: nil)
    alert.addAction(OKAction)
    
    self.presentViewController(alert, animated: true, completion: nil)
}
```

<a name="gotchas" class="jump-target"></a>

# Gotchas

As I was working through this example, I was initially running into trouble when associating my `newEvent` with the `calendar` that was passed into `AddEventViewController` from the parent controller's `prepareForSegue` method.

It turns out that if you retrieve a calendar from one `EKEventStore` instance, say, in the previous view controller, and attempt to assign it to an `EKEvent` that is associated with a _different_ `EKEventStore` instance, things become really unhappy when it comes time to save the event.

Specifically, you'll get an error that says "Thread 1: signal SIGKILL&#8221; followed by "Thread 1: EXC\_BAD\_ACCESS&#8221;:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/06/SaveEventSigKillError.png" alt="Save Event Sig Kill Error" width="753" height="177" class="alignnone size-full wp-image-12898" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/06/SaveEventSigKillError.png 753w, https://www.andrewcbancroft.com/wp-content/uploads/2016/06/SaveEventSigKillError-300x71.png 300w" sizes="(max-width: 753px) 100vw, 753px" />][2]

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/06/SaveEventBadAccessError.png" alt="Save Event Bad Access Error" width="755" height="343" class="alignnone size-full wp-image-12899" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/06/SaveEventBadAccessError.png 755w, https://www.andrewcbancroft.com/wp-content/uploads/2016/06/SaveEventBadAccessError-300x136.png 300w" sizes="(max-width: 755px) 100vw, 755px" />][3]

The fix for this was easy, once I figured out what was going on: Simply re-retrieve a calendar instance using an appropriate `calendarIdentifier` _from the `EKEventStore` instance you're using to save the `EKEvent` with_:

```swift
if let calendarForEvent = eventStore.calendarWithIdentifier((self.calendar.calendarIdentifier))
{
    let newEvent = EKEvent(eventStore: eventStore)
    
    newEvent.calendar = calendarForEvent
    
    // ...
}
```

# Wrapping up

My focus in this guide was to demonstrate how to create and save and event to a user's calendar. I intentionally left out a lot of the navigation aspects and `prepareForSegue` calls in order to highlight the event creation process itself. Be sure to check out the [accompanying Xcode project on GitHub][4] for full details on the flow of the application.

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
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/04/28/listing-calendar-events-with-event-kit-and-swift/" title="Listing Calendar Events with Event Kit and Swift">Listing Calendar Events with Event Kit and Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/wp-content/uploads/2016/05/create-events-demo.gif
 [2]: https://www.andrewcbancroft.com/wp-content/uploads/2016/06/SaveEventSigKillError.png
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2016/06/SaveEventBadAccessError.png
 [4]: https://github.com/andrewcbancroft/EventTracker/tree/create-events