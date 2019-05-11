---
title: Core Data Model Attributes and NSManagedObject Property Types Must Match!
author: Andrew
type: blog
date: 2017-04-23T20:03:34+00:00
url: /2017/04/23/core-data-model-attributes-and-nsmanagedobject-property-types-must-match/
dsq_thread_id:
  - "5753148229"
categories:
  - Swift
tags:
  - Core Data
  - Swift
  - Swift Optionals

---
<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#match">Data model Attributes and NSManagedObject property types &#8211; Match &#8217;em!</a>
    </li>
    <li>
      <a href="#optionals-types">Optionals are Types</a>
    </li>
    <li>
      <a href="#lessons-learned">Lessons learned</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
    <li>
      <a href="#course">Learning Core Data? Watch my course, Core Data Fundamentals with Swift!</a>
    </li>
  </ul>
</div>

I admit &#8211; it might have taken me less time to figure out my runtime exception if I hadn&#8217;t just migrated my project to Swift 3 when I encountered the bug.

That&#8217;s the problem isn&#8217;t it? You go in&#8230; you intend to do one thing. Before long, you&#8217;ve got 15 files with an `M` out to the right. The project builds (finally), but ah &#8211; then there&#8217;s _runtime_.

When the crash occurs, you&#8217;re never sure if it was an _existing_ problem, or if it was caused by the code conversion. Who knows &#8211; maybe it&#8217;s both?

Perhaps this is a story more about code conversion than it is about Core Data. In any case, perhaps it&#8217;ll help a poor soul struggling to figure out why [<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/EXC_BAD_INSTRUCTION.png" alt="EXC_BAD_INSTRUCTION" width="364" height="12" class="alignnone size-full wp-image-13265" style="display:inline-block;" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/EXC_BAD_INSTRUCTION.png 364w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/EXC_BAD_INSTRUCTION-300x10.png 300w" sizes="(max-width: 364px) 100vw, 364px" />][1] just happened.

<a name="match" class="jump-target"></a>

# Data model Attributes and NSManagedObject property types &#8211; Match &#8217;em!

Whenever you&#8217;re creating a subclass of `NSManagedObject` for the Entities in your data model, you&#8217;re in a mapping process.

Each Attribute on an Entity maps over to a _property_ on the `NSManagedObjectSubclass`.

Not only must the _names_ of those Attributes and properties match, but the _Types_ of each must match as well.

<a name="optionals-types" class="jump-target"></a>

# Optionals are Types

`String` isn&#8217;t the same as `String?`.

`Date` isn&#8217;t the same as `Date?`.

They&#8217;re different _Types_.

So what happens if you specify that a certain Attribute named, say, `createdOn` is a `Date` with the Optional checkbox checked in the data model designer like this:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/optional-attribute.png" alt="createdOn as Optional attribute" width="358" height="110" class="alignnone size-full wp-image-13268" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/optional-attribute.png 358w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/optional-attribute-300x92.png 300w" sizes="(max-width: 358px) 100vw, 358px" />][2]

And over in the implementation of your `NSManagedObject` subclass, you have code that&#8217;s written like this:

<pre class="lang:swift decode:true " >@NSManaged var createdOn: Date //instead of Date? (ie, the ? is missing)</pre>

What&#8217;ll happen? Well, I can tell you what&#8217;ll happen. :]

When you run the app and attempt to load objects from your persistent store that have been saved with `nil` for the `createdOn` value, your app will blow up:[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/EXC_BAD_INSTRUCTION.png" alt="EXC_BAD_INSTRUCTION" width="364" height="12" class="alignnone size-full wp-image-13265" style="display:inline-block;" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/EXC_BAD_INSTRUCTION.png 364w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/EXC_BAD_INSTRUCTION-300x10.png 300w" sizes="(max-width: 364px) 100vw, 364px" />][1]

Xcode isn&#8217;t entirely unhelpful. While the `EXC_BAD_INSTRUCTION` message in the text editor isn&#8217;t very illuminating, the Debug Navigator on the left ([<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/debug-nav.png" alt="Debug navigator - 6th icon from left in the left sidebar" width="251" height="30" class="alignnone size-full wp-image-13279" style="display:inline-block;" />][3]) provides some clues.

For me, it displayed just the breadcrumb that made me go, &#8220;Oh! Let me go check and see if I&#8217;ve got a Type mis-match between my data model and my `NSManagedObject` subclass&#8221;:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/TypeMismatch.png" alt="Unconditionally bridge from Objective C NSDate? to Date" width="452" height="88" class="alignnone size-full wp-image-13271" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/TypeMismatch.png 452w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/TypeMismatch-300x58.png 300w" sizes="(max-width: 452px) 100vw, 452px" />][4]

Interesting&#8230; It looks like there was an attempt to go from an `NSDate?` (_optional_) instance to a `Date` (_non_-optional).

The issue isn&#8217;t that I&#8217;ve got a mismatch between `NSDate` and `Date`. The runtime can swap those around and substitute them easily.

Rather, it&#8217;s that I&#8217;m trying to go from _optional_, where `nil` is fine, to _non_-optional, where `nil`&#8230;well&#8230;crashes things.

<a name="lessons-learned" class="jump-target"></a>

# Lessons learned

What have I learned?

1 &#8211; Map Attributes to `NSManagedObject` subclass properties carefully.  
2 &#8211; Don&#8217;t accidentally miss a `?` to indicate that a property is optional if I&#8217;ve got it marked as optional in the data model  
3 &#8211; Read the Debug Navigator. It&#8217;s not just a list of gibberish &#8211; it can actually provide helpful clues so you know where to go look to solve your problem!

<a name="course" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-video-camera"></i> <a href="http://bit.ly/ps-core-data-swift" target="_blank">Core Data Fundamentals with Swift</a><br /> <a href="http://bit.ly/ps-core-data-swift" target="_blank"><img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png" alt="Core Data Fundamentals with Swift" width="1024" height="576" class="alignnone size-large wp-image-13163" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-300x169.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-768x432.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift.png 1539w" sizes="(max-width: 1024px) 100vw, 1024px" /></a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/wp-content/uploads/2017/04/EXC_BAD_INSTRUCTION.png
 [2]: https://www.andrewcbancroft.com/wp-content/uploads/2017/04/optional-attribute.png
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2017/04/debug-nav.png
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2017/04/TypeMismatch.png