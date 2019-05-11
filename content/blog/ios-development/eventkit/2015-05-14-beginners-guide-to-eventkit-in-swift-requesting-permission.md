---
title: Beginner’s Guide to Event Kit in Swift – Requesting Permission
author: Andrew
type: blog
date: 2015-05-14T20:37:52+00:00
url: /2015/05/14/beginners-guide-to-eventkit-in-swift-requesting-permission/
dsq_thread_id:
  - "3764410960"
categories:
  - Swift
tags:
  - Event Kit
  - Swift
  - Tutorial

---
<small>Updated on October 26, 2016 – Swift 3.0</small>

EventKit provides a set of classes for accessing and manipulating a user&#8217;s calendar events and reminders. In the tutorial that follows, my goal is to walk you through the first steps of setting up an app that utilizes EventKit. I will demonstrate how to request permission to the user&#8217;s calendar and show a couple of examples for how to handle the user&#8217;s response (for when they grant access, or _deny_ it).

**Note:** Code in the main article below is written in Swift 3.0, but code examples for Swift 2.3 are found in the [example project][1].

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#example-scenario">Example scenario</a>
    </li>
    <li>
      <a href="#storyboard-setup">Storyboard setup</a>
    </li>
    <ul>
      <li>
        <a href="#table-view-setup">Tableview for the calendar list for when access is granted</a>
      </li>
      <li>
        <a href="#needs-permission-view-setup">&#8220;Need permission&#8221; view for when access is denied</a>
      </li>
    </ul>
    
    <li>
      <a href="#role-of-event-store">The role of the Event Store</a>
    </li>
    <li>
      <a href="#checking-calendar-authorization">Checking for calendar authorization</a>
    </li>
    <ul>
      <li>
        <a href="#info-plist">Update Info.plist for iOS 10 support</a>
      </li>
      <li>
        <a href="#request-access-to-calendars">Requesting access to calendars</a>
      </li>
      <ul>
        <li>
          <a href="#access-granted">Access granted! Load calendars and refresh table view</a>
        </li>
        <li>
          <a href="#access-denied">Access denied &#8211; Show needs permission view</a>
        </li>
      </ul>
    </ul>
    
    <li>
      <a href="#wrapping-up">Wrapping up</a>
    </li>
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="example-scenario" class="jump-target"></a>

### Example scenario

Let&#8217;s start by proposing a basic scenario to serve as this tutorial&#8217;s example.

Suppose that we&#8217;re building an app that, for now, has a single View Controller. We&#8217;d like this View Controller to display a list of calendars if the user grants us permission to do so. If they _deny_ permission, we&#8217;d like to show a message to them that indicates that our app can&#8217;t function without this permission, and we&#8217;ll allow them to click a button to grant us permission in the Settings of their device.

I&#8217;ve created such an app as an example &#8211; [jump over to GitHub][2] to grab the code and explore. Read on for an explanation of some of the finer points of the setup and code.

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-github fa-lg"></i> Example Xcode Project (<a href="https://github.com/andrewcbancroft/EventTracker/tree/ask-for-permission-swift-2.3" title="EventTracker - Swift 2.3">Swift 2.3</a> | <a href="https://github.com/andrewcbancroft/EventTracker/tree/ask-for-permission" title="EventTracker - Swift 3.0">Swift 3.0</a>)</a>
    </li>
  </ul>
</div>

<a name="storyboard-setup" class="jump-target"></a>

### Storyboard setup

One of the first things you&#8217;ll deal with in EventKit is the need to set yourself up with a UI to handle the different responses that the user can give you on that first application launch when you ask, &#8220;Can we access your calendar?&#8221;. We&#8217;ll get to the particulars of [how request that permission][3] shortly. But first, let&#8217;s dissect how we might arrange a Storyboard with some views that do the right thing for a given response to that permission prompt.

The user can either grant permission, or deny permission to interact with their calendar or reminders. We need to be prepared for either scenario.

<a name="table-view-setup" class="jump-target"></a>

#### Tableview for the calendar list for when access is granted

I&#8217;m feeling optimistic today, so let&#8217;s begin with the case where the user grants us permission to their calendar from the get-go.

When the user grants us permission, we&#8217;d like to list out their calendars inside a table view. We&#8217;ll worry with setting up the data source later in the tutorial. For now, we&#8217;ll drag over a table view from the Utilities pane.

To get the table view to fill the whole screen, I do a couple of things. Usually, when you drag one out from the Utilities pane, the table view will fill the whole scene in the Storyboard. From that layout, I drag the top edge down until it &#8220;snaps&#8221; to the line where I&#8217;d expect the bottom of the status bar to be positioned. Then I set the following constraints:

  * Center X
  * Center Y
  * Equal width to Superview
  * Top space to Top Layout Guide for height.

I&#8217;ve created a short screencast on setting up a table view if you&#8217;d like a complete walkthrough:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-video-camera fa"></i> <a href="http://bit.ly/WatchSetUpTVFromACB" title="Setting Up a Table View" target="_blank">Screencast: Setting Up a Table View</a>
    </li>
    <li>
      <i class="fa fa-file-text-o fa"></i> <a href="http://www.andrewcbancroft.com/2015/05/18/swift-how-to-setting-up-a-table-view/" title="Setting Up a Table View - Transcript">Full transcript</a>
    </li>
  </ul>
</div>

Here&#8217;s a detailed view of the constraints, along with a visual of what the Storyboard Scene looks like with the table view installed:  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/05/Detailed_Constraints.png" alt="Detailed view of constraints" width="293" height="450" class="alignnone size-full wp-image-11872" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/05/Detailed_Constraints.png 293w, https://www.andrewcbancroft.com/wp-content/uploads/2015/05/Detailed_Constraints-195x300.png 195w" sizes="(max-width: 293px) 100vw, 293px" />][4]

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/05/TableView-1024x657.png" alt="Table view in Storyboard" width="1024" height="657" class="alignnone size-large wp-image-11873" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/05/TableView-1024x657.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/05/TableView-300x192.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/05/TableView.png 1398w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]

As a final note, I&#8217;ve set the `hidden` property of the table view to `true` in the Storyboard. I&#8217;ll toggle the table&#8217;s visibility based on the user&#8217;s granting or denying of the calendar access later, but I thought it was worth pointing out that the initial state of my table view in the example is hidden.

<a name="needs-permission-view-setup" class="jump-target"></a>

#### &#8220;Need permission&#8221; view for when access is denied

There _will_ be times when a user denies access to the calendar before realizing that doing so essentially stops all the functionality provided by your app. If your entire app, or even just a portion of it requires access to function, you need a way to inform the user of this, and provide them a way to navigate to settings and grant access manually if possible.

The way I did this in the sample project was to organize a new View onto the Storyboard Scene which contains a label with some instructions, and a button that takes the user to the Settings page for our app when they tap on it.

Once again, some constraints are involved in getting things to appear correctly at run-time. I won&#8217;t go into the details of this here, since it&#8217;s likely that every implementation of this will be slightly different.

One thing I _will_ point out though, is that the View&#8217;s alpha has been set to 0 so that I can perform a nice [fade in transition][6] if the user denies access. Here&#8217;s a look at the Scene with the invisible &#8220;NeedPermissionsView&#8221; installed:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/05/NeedPermissionView-1024x625.png" alt="Need permission view" width="1024" height="625" class="alignnone size-large wp-image-11874" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/05/NeedPermissionView-1024x625.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/05/NeedPermissionView-300x183.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/05/NeedPermissionView.png 1465w" sizes="(max-width: 1024px) 100vw, 1024px" />][7]

<a name="role-of-event-store" class="jump-target"></a>

### The role of the Event Store

At the heart of EventKit is the `EKEventStore`. `EKEventStore` is the central &#8220;thing&#8221;. Creating an instance of `EKEventStore` provides developers with an API for performing various read/write operations on the user&#8217;s calendars and reminder lists.

A View Controller that interacts with the calendar should hold a reference to an `EKEventStore` instance. It&#8217;s easy to create one &#8211; here&#8217;s an example:

<pre class="lang:swift decode:true " title="ViewController.swift" >class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    let eventStore = EKEventStore()

    // ...    
}</pre>

<a name="checking-calendar-authorization" class="jump-target"></a>

### Checking for calendar authorization

Once we have a reference to an `EKEventStore` instance, we can use it to do things like check whether or not the user has granted us permission to use their calendar. From there, we can make decisions about whether or not we need to request permission, and subsequently figure out which view to show (the table view or the need permission view).

Where we check for calendar authorization is important. My recommendation is to check each time the view appears (ie, in `viewWillAppear()`, because it&#8217;s completely possible that the user could grant access at first, switch to settings, and deny access. Our app would need to respond appropriately.

In the example project provided with this article, I&#8217;ve created a function named `checkCalendarAuthorizationStatus()`. Here a peek at what it does:

<pre class="lang:swift decode:true mark:5-7,10" title="ViewController.swift" >class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    // ...
    
    override func viewWillAppear(animated: Bool) {
        checkCalendarAuthorizationStatus()
    }
    
    func checkCalendarAuthorizationStatus() {
        let status = EKEventStore.authorizationStatus(for: EKEntityType.event)
        
        switch (status) {
        case EKAuthorizationStatus.notDetermined:
            // This happens on first-run
            requestAccessToCalendar()
        case EKAuthorizationStatus.authorized:
            // Things are in line with being able to show the calendars in the table view
            loadCalendars()
            refreshTableView()
        case EKAuthorizationStatus.restricted, EKAuthorizationStatus.denied:
            // We need to help them give us permission
            needPermissionView.fadeIn()
        }
    }

    // ...
}</pre>

The key function here is `EKEventStore's` `authorizationStatus(for:)` function. Passing in `EKEntityType.event` is what corresponds to the user&#8217;s _calendar_. If we wanted to check for access to their reminders, we&#8217;d use `EKEntityTypeReminder`.

The possible `EKAuthorizationStatus` enumeration values are simply switched over &#8211; the logic to be performed is encapsulated in separate functions for ease of readability.

Let&#8217;s step through each of those functions one by one&#8230;

<a name="info-plist" class="jump-target"></a>

#### Update Info.plist for iOS 10 support

Apple now requires us to have a key/value pair in Info.plist that provides a description to the user as to why our apps need access to their calendar.

To set this value, open your Info.plist file, and add a new key for &#8220;Privacy &#8211; Calendars Usage Description&#8221;:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/05/info-plist-calendar-usage-description-1024x346.png" alt="Info.plist Calendar Usage Description" width="1024" height="346" class="alignnone size-large wp-image-13055" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/05/info-plist-calendar-usage-description-1024x346.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/05/info-plist-calendar-usage-description-300x101.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/05/info-plist-calendar-usage-description.png 1100w" sizes="(max-width: 1024px) 100vw, 1024px" />][8]

The value that you provide for this plist key ends up being displayed in the alert that&#8217;s displayed when you request access.

<a name="request-access-to-calendars" class="jump-target"></a>

#### Requesting access to calendars

As the title of this tutorial suggests, all things start here. Whenever our application loads and we call `authorizationStatus(for:)`, the status that will be returned is `notDetermined`. It&#8217;s at this point that we&#8217;d like to request access to the calendar.

To do so, let&#8217;s dissect the `requestAccessToCalendar` function:

<pre class="lang:swift decode:true mark:6,10,16" title="requestAccessToCalendar()" >class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

   // ...
   
    func requestAccessToCalendar() {
        eventStore.requestAccess(to: EKEntityType.event, completion: {
            (accessGranted: Bool, error: Error?) in
            
            if accessGranted == true {
                DispatchQueue.main.async(execute: {
                    self.loadCalendars()
                    self.refreshTableView()
                })
            } else {
                DispatchQueue.main.async(execute: {
                    self.needPermissionView.fadeIn()
                })
            }
        })
    }

    // ...
}</pre>

Our `EKEventStore` instance provides a function called `requestAccess(to:)`. Once again, passing in `EKEntityType.event` is what signals that we&#8217;re requesting access to the _calendar_. The rest of the interesting parts are found in the completion closure that we provide.

There are three main things to note with this portion of the implementation:

  1. The two parameters that are passed in to the closure is a `Bool` indicating access was granted (`true`) or denied (`false`). The second is an `NSError`.
  2. We need to call `dispatch_async()` and indicate that we want to jump back over to the main queue to execute our UI refreshes.
  3. `self.needPermissionView.fadeIn()` utilizes a `UIView` extension from my post, [Fade In / Out Animations as Class Extensions in Swift][9].

<a name="access-granted" class="jump-target"></a>

##### Access granted! Load calendars and refresh table view

When access is granted, we can call the `eventStore` instance&#8217;s `calendarsForEntityType` function and pass it `EKEntityType.event` to grab an array of the user&#8217;s calendars to display in our table view. Here&#8217;s a look:

<pre class="lang:swift decode:true " title="loadCalendars()" >class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    // ...

    var calendars: [EKCalendar]?

    // ...
    
    func loadCalendars() {
        self.calendars = eventStore.calendars(for: EKEntityType.event)
    }
    
    func refreshTableView() {
        calendarsTableView.isHidden = false
        calendarsTableView.reloadData()
    }

    // ...
}</pre>

<a name="access-denied" class="jump-target"></a>

##### Access denied &#8211; Show needs permission view

When access is _denied_, we need to unveil the &#8220;Needs Permission View&#8221; we created in our Storyboard Scene.

Recall that in that view, there&#8217;s a button to direct the user to the Settings page for our app so that they can easily grant access to the calendar from there. That button is wired up to an IBAction. Here&#8217;s an example implementation of that IBAction:

<pre class="lang:swift decode:true mark:6-7" title="goToSettingsButtonTapped()" >class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {

    // ...

    @IBAction func goToSettingsButtonTapped(_ sender: UIButton) {
        let openSettingsUrl = URL(string: UIApplicationOpenSettingsURLString)
        UIApplication.shared.openURL(openSettingsUrl!)
    }

    // ...
}</pre>

<a name="wrapping-up" class="jump-target"></a>

### Wrapping up

That pretty much completes the setup process for working with Event Kit! The remaining cases for the `checkCalendarAuthorizationStatus()` function simply re-use the functions I just dissected when exploring the requesting permission process.

I encourage you to [head over to GitHub][2] and dive into the code for yourself as you get started with utilizing Event Kit in your app!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/06/17/creating-calendars-with-event-kit-and-swift/" title="Creating Calendars with Event Kit and Swift">Creating Calendars with Event Kit and Swift</a>
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

 [1]: https://github.com/andrewcbancroft/EventTracker/tree/swift-2.3
 [2]: https://github.com/andrewcbancroft/EventTracker/tree/ask-for-permission
 [3]: #request-access-to-calendars
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2015/05/Detailed_Constraints.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2015/05/TableView.png
 [6]: http://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/ "Fade In / Out Animations as Class Extensions in Swift"
 [7]: http://www.andrewcbancroft.com/wp-content/uploads/2015/05/NeedPermissionView.png
 [8]: https://www.andrewcbancroft.com/wp-content/uploads/2015/05/info-plist-calendar-usage-description.png
 [9]: http://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/