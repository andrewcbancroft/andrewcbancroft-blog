---
title: Dissecting 10 Read 10 Said – My New Swift iOS App
author: Andrew
type: blog
date: 2015-07-23T03:57:33+00:00
aliases:
  - /2015/07/22/dissecting-10-read-10-said-my-new-swift-ios-app/
dsq_thread_id:
  - "3961573890"
categories:
  - Swift
tags:
  - 10 Read 10 Said
  - Bible Memorization
  - Swift

---
I&#8217;m very excited to announce that my new app, 10 Read 10 Said, is now available for [iOS][1] and [Android][2]!

While the goal of the app is to help you implement the [&#8220;10 Read 10 Said&#8221; strategy for memorizing Bible verses][3], my goal in this _article_ is to dissect the app, and share with you how some of the major features were implemented.

As it turns out, _most_ of the major features of the app are things that I&#8217;ve already written about over the [past year of producing Swift content][4]! The approach I&#8217;ll take, then, is to walk through each screen and point out which articles I&#8217;ve written might pertain to the particular feature implementations that are visible from that screen.

I hope this tour satisfies the curiosity of many like myself who ask, &#8220;I wonder how they did that!&#8221;

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#demo">App Demo</a>
    </li>
    <li>
      <a href="#verse-list">Verse List</a>
    </li>
    <ul>
      <li>
        <a href="#navigation-controller">Navigation Controller</a>
      </li>
      <li>
        <a href="#table-view">Table View</a>
      </li>
      <li>
        <a href="#data-source">Data Source</a>
      </li>
      <ul>
        <li>
          <a href="#core-data">Core Data</a>
        </li>
        <li>
          <a href="#ns-fetched-results-controller">NSFetchedResultsController</a>
        </li>
      </ul>
    </ul>
    
    <li>
      <a href="#add-verse">Add Verse</a>
    </li>
    <li>
      <a href="#memorize">Memorize</a>
    </li>
    <ul>
      <li>
        <a href="#read-it-said-it">Read It, Said It</a>
      </li>
    </ul>
    
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="demo" class="jump-target"></a>

### App Demo

To demonstrate the major functionality of the app, I&#8217;ve created a short (50 second) YouTube video. Take a look, and then I&#8217;ll break down each screen:



<a name="verse-list" class="jump-target"></a>

### Verse List

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Verse-List-576x1024.png" alt="Verse List" width="326" height="774" class="alignnone size-large wp-image-12126" />][5]

<a name="navigation-controller" class="jump-target"></a>

#### Navigation Controller

To begin, the Verse List scene has been embedded in a `UINavigationController`. This caused me to have to make a few changes in `AppDelegate` to properly dig in to access the verse list controller and set some properties on it.

I&#8217;ve covered the details of how to &#8220;unpack&#8221; a `UINavigationController` and access its first _child_ view controller in my article titled [&#8220;Access Sub-Controllers from a UINavigationController in Swift&#8221;][6].

<a name="table-view" class="jump-target"></a>

#### Table View

The next most obvious thing to notice about the verse list is that it&#8217;s been implemented with a `UITableView`. Additionally, each cell is a &#8220;custom&#8221; cell, rather than one of the default cell styles that Xcode gives you out of the box. I&#8217;ve written an article or three on these:

<div class="resources">
  <div class="resources-header">
    UITableView Articles
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/05/18/swift-how-to-setting-up-a-table-view/" title="Swift How-To: Setting up a Table View">Swift How-To: Setting up a Table View</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/02/12/custom-uitableviewcell-text-input-swift/" title="Custom UITableViewCell for Text Input in Swift">Custom UITableViewCell for Text Input in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/07/16/uitableview-swipe-to-delete-workflow-in-swift/" title="UITableView Swipe to Delete Workflow in Swift">UITableView Swipe to Delete Workflow in Swift</a>
    </li>
  </ul>
</div>

<a name="data-source" class="jump-target"></a>

#### Data Soure

The verse list&#8217;s data source is an `NSFetchedResultsController`. This, of course, implies that my underlying data framework for the app is Core Data. Here are some of the articles I&#8217;ve written on these subjects:

<a name="core-data" class="jump-target"></a>

##### Core Data

<div class="resources">
  <div class="resources-header">
    Core Data Articles
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/02/18/core-data-cheat-sheet-for-swift-ios-developers/" title="Core Data Cheat Sheet for Swift iOS Developers">Core Data Cheat Sheet for Swift iOS Developers</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/07/17/implement-nsmanagedobject-subclass-in-swift/" title="Implement NSManagedObject Subclass in Swift">Implement NSManagedObject Subclass in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/01/13/unit-testing-model-layer-core-data-swift/" title="Unit Testing Model Layer with Core Data and Swift">Unit Testing Model Layer with Core Data and Swift</a>
    </li>
  </ul>
</div>

<a name="ns-fetched-results-controller" class="jump-target"></a>

##### NSFetchedResultsController

<div class="resources">
  <div class="resources-header">
    NSFetchedResultsController Articles
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/03/05/displaying-data-with-nsfetchedresultscontroller-and-swift/" title="Displaying Data With NSFetchedResultsController and Swift">Displaying Data With NSFetchedResultsController and Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/05/28/sync-table-view-data-nsfetchedresultscontroller-swift/" title="Sync Table View Data: NSFetchedResultsController and Swift">Sync Table View Data: NSFetchedResultsController and Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/02/25/using-swift-to-seed-a-core-data-database/" title="Using Swift to Seed a Core Data Database">Using Swift to Seed a Core Data Database</a>
    </li>
  </ul>
</div>

<a name="add-verse" class="jump-target"></a>

### Add Verse

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Add-Verse-576x1024.png" alt="Add Verse" width="326" height="774" class="alignnone size-large wp-image-12124" />][7]

Adding a verse and synchronizing things to the table view (and the persistent data store) involves all-things Core Data and `NSFetchedResultsController`. Using the combination of these two made things super easy to keep up-to-date in the UI.

When you press &#8216;Save&#8217;, your verse gets sent to the managed object context for the app. Once it&#8217;s saved using the context, the verse list gets automatically updated using its `NSFetchedResultsController` data source. I really liked the results!

<a name="memorize" class="jump-target"></a>

### Memorize

The memorization screen brings into play a few UI elements that I&#8217;ve experimented with and written on in the past. First, let&#8217;s take a look at these two screen layouts to have the visual before us:

<a name="read-it-said-it" class="jump-target"></a>

#### Read It, Said It

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Memorize-Read-It-576x1024.png" alt="Memorize - Read It" width="326" height="774" class="alignnone size-large wp-image-12123" />][8]

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Memorize-Said-It-576x1024.png" alt="Memorize - Said It" width="326" height="774" class="alignnone size-large wp-image-12122" />][9]

The most notable thing I can think of on this scene is the circular progress indicator to help visualize how close you are to completing the read / said goal.

A few other subtle notes are the fade in/out animations that happen when you complete the read goal, the said goal, and the peek/hide action. Check out the related articles for those pieces:

<div class="resources">
  <div class="resources-header">
    UI Articles
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/07/09/circular-progress-indicator-in-swift/" title="Circular Progress Indicator in Swift">Circular Progress Indicator in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2014/07/27/fade-in-out-animations-as-class-extensions-with-swift/" title="Fade In / Out Animations as Class Extensions in Swift">Fade In / Out Animations as Class Extensions in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/06/25/swift-uicolor-extension-create-using-rgb-values-not/" title="Swift UIColor Extension – Create using RGB Values (Not %)">Swift UIColor Extension – Create using RGB Values (Not %)</a>
    </li>
  </ul>
</div>

### Wrapping up

While this isn&#8217;t the first app I&#8217;ve worked on and published to the App Store, it _is_ my first _personal_ project idea that&#8217;s out there. I had a lot of fun building it as a utility for myself in my own Scripture memorization efforts. My hope is that the tool (and more importantly, [the strategy][10]) is helpful to others as well!

My goal in this article was to give you a &#8220;behind the scenes&#8221; look at 10 Read 10 Said. I hope your curiosity has been satisfied by some of these inside looks into the app!

<a name="share" class="jump-target"></a>

 [1]: https://itunes.apple.com/us/app/10-read-10-said/id1018662429?mt=8 "10 Read 10 Said iOS App Store"
 [2]: https://play.google.com/store/apps/details?id=com.gibcroft.tenreadtensaid "10 Read 10 Said Google Play Store"
 [3]: http://10read10said.andrewcbancroft.com/ "10 Read 10 Said Strategy"
 [4]: http://www.andrewcbancroft.com/category/software-development/ios-mac/swift/ "Swift Content at andrewcbancroft.com"
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Verse-List.png
 [6]: http://www.andrewcbancroft.com/2015/06/02/access-sub-controllers-from-a-uinavigationcontroller-in-swift/
 [7]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Add-Verse.png
 [8]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Memorize-Read-It.png
 [9]: http://www.andrewcbancroft.com/wp-content/uploads/2015/07/Memorize-Said-It.png
 [10]: http://10read10said.andrewcbancroft.com/