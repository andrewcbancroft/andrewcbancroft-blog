---
title: Implement NSManagedObject Subclass in Swift
author: Andrew
type: blog
date: 2014-07-18T04:08:12+00:00
aliases:
  - /2014/07/17/implement-nsmanagedobject-subclass-in-swift/
spacious_page_layout:
  - default_layout
dsq_thread_id:
  - "2852779447"
categories:
  - iOS / Mac
  - Swift
tags:
  - Core Data
  - NSManagedObject Subclass
  - Swift
  - Swift Namespace
---

<small>Updated on July 8, 2016 – Xcode 7</small>

My goal with this blog entry is to help get you set up to create NSManagedObject subclasses in Swift for the Entities in your Core Data model.

<a name="example" class="jump-target"></a>

# Example

Let's look at a fabricated example: Say that you've got a Core Data project and you're creating Entities.  For my simple project, I'll create an Entity called &#8220;MyEntity&#8221; with an attribute called &#8220;myAttribute&#8221;.

After you create an NSManagedObject subclass for the Entity and come back to the data model screen to specify the &#8220;Class&#8221; in the inspector area, you _must_ prefix the name of the class with &#8220;YourProjectName.&#8221; (don't forget the dot).  Forgetting to do this will lead to run-time errors when you start interacting with instances of your NSManagedObject subclass.

<a title="Documentation specifying module name prefix requirement" href="https://developer.apple.com/library/prerelease/mac/documentation/Swift/Conceptual/BuildingCocoaApps/WritingSwiftClassesWithObjective-CBehavior.html" target="_blank">Apple specifies this in their documentation page</a>, but it was a subtle mention at the end of the document and I just happened upon it as I was troubleshooting this:

> <span style="color: #414141;">Swift classes are namespaced—they’re scoped to the module (typically, the project) they are compiled in. To use a Swift subclass of the </span>`NSManagedObject`<span style="color: #414141;"> class with your Core Data model, prefix the class name in the Class field in the model entity inspector with the name of your module.</span>

<a name="walkthrough" class="jump-target"></a>

# Walk-through

<a name="create-entity" class="jump-target"></a>

## Create an Entity

In your .xcdatamodeld file, create an Entity to your liking.  In my example, I named the Entity &#8220;MyEntity&#8221; and I gave it an attribute called &#8220;myAttribute&#8221; with a data type of String.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManagedObjectSubclassExample-1024x783.png" alt="Create Entity and Attribute" width="730" height="558" class="alignnone size-large wp-image-1901" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManagedObjectSubclassExample-1024x783.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManagedObjectSubclassExample-300x229.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManagedObjectSubclassExample.png 1202w" sizes="(max-width: 730px) 100vw, 730px" />][1]

<a name="create-nsmanagedobject-subclass" class="jump-target"></a>

## Create an NSManagedObject Subclass for that Entity

On the Menu, click Editor, then &#8220;Create NSManagedObject Subclass&#8230;&#8221;  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2014/07/Fullscreen_7_17_14__9_59_PM-1024x700.png" alt="Create NSManagedObject Subclass" width="730" height="499" class="alignnone size-large wp-image-1961" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/07/Fullscreen_7_17_14__9_59_PM-1024x700.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/Fullscreen_7_17_14__9_59_PM-300x205.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/Fullscreen_7_17_14__9_59_PM.png 1524w" sizes="(max-width: 730px) 100vw, 730px" />][2]

Make sure you choose &#8220;Swift&#8221; as your language of choice as you click Next through the wizard and Xcode will generate you a file that is appropriate for your Entity.  The files it created for me (Xcode 7.1.1) look like this:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_1-1024x298.png" alt="NSManagedObject Class file" width="1024" height="298" class="alignnone size-large wp-image-12993" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_1-1024x298.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_1-300x87.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_1.png 1390w" sizes="(max-width: 1024px) 100vw, 1024px" />][3]

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_2-1024x274.png" alt="NSManagedObject Properties file" width="1024" height="274" class="alignnone size-large wp-image-12992" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_2-1024x274.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_2-300x80.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_2.png 1395w" sizes="(max-width: 1024px) 100vw, 1024px" />][4]

<a name="verify-class-module" class="jump-target"></a>

## Verify NSManagedObject class in the &#8220;Data Model Inspector&#8221;

Make sure that you have your .xcdatamodeld file selected in the Navigator panel.  Then make sure your Utilities panel is visible.

Click the &#8220;Data Model Inspector&#8221; icon.  This will be the last icon in the inspector of Xcode.  You should see a section for &#8220;Entity&#8221; and within this section, two textboxes:  one for Name and one for Class. You should also see a drop-down for the Module that the NSManagedObject subclass is found in.

You'll be verifying the _Class_ and the _Module_ values:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_verify_class-1024x674.png" alt="Verify class and module" width="1024" height="674" class="alignnone size-large wp-image-12991" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_verify_class-1024x674.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_verify_class-300x197.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_verify_class.png 1393w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]

According to the <a title="Documentation specifying module name prefix requirement" href="https://developer.apple.com/library/prerelease/mac/documentation/Swift/Conceptual/BuildingCocoaApps/WritingSwiftClassesWithObjective-CBehavior.html" target="_blank">Swift documentation</a>, Swift class namespaces are scoped to the module they're compiled in (usually the project you're working in).  

To use the NSManagedObject subclass in your project, you just need to verify that the Module setting is set to &#8220;Current Product Module&#8221;, assuming that the NSManagedObject subclass you're wiring this Entity to is found in that module. If it's in _another_ module, you'll need to adjust the Module value in the inspector appropriately.

Once the Class and Module values are verified (or set), you'll be able to use this NSManagedObject subclass anywhere in your project.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/18/core-data-cheat-sheet-for-swift-ios-developers/" title="Core Data Cheat Sheet for Swift iOS Developers"</a>Core Data Cheat Sheet for Swift iOS Developers
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/25/using-swift-to-seed-a-core-data-database/" title="Using Swift to Seed a Core Data Database"</a>Using Swift to Seed a Core Data Database
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/03/05/displaying-data-with-nsfetchedresultscontroller-and-swift/" title="Displaying Data With NSFetchedResultsController and Swift"</a>Displaying Data With NSFetchedResultsController and Swift
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/05/28/sync-table-view-data-nsfetchedresultscontroller-swift/" title="Sync Table View Data: NSFetchedResultsController and Swift"</a>Sync Table View Data: NSFetchedResultsController and Swift
    </li>
  </ul>
</div>

<a name="course" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fas fa-video"></i> <a href="http://bit.ly/ps-core-data-swift" target="_blank">Core Data Fundamentals with Swift</a><br /> <a href="http://bit.ly/ps-core-data-swift" target="_blank"><img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png" alt="Core Data Fundamentals with Swift" width="1024" height="576" class="alignnone size-large wp-image-13163" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-300x169.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-768x432.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift.png 1539w" sizes="(max-width: 1024px) 100vw, 1024px" /></a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManagedObjectSubclassExample.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2014/07/Fullscreen_7_17_14__9_59_PM.png
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_1.png
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_2.png
 [5]: https://www.andrewcbancroft.com/wp-content/uploads/2014/07/NSManaged_verify_class.png