---
title: 'Core Data: Solving Ambiguous Type / Redeclaration of Type'
author: Andrew
type: blog
date: 2017-03-29T02:57:05+00:00
aliases:
  - /2017/03/28/core-data-solving-ambiguous-type-redeclaration-of-type/
dsq_thread_id:
  - "5675799604"
categories:
  - Swift
tags:
  - Core Data
  - NSManagedObject Subclass

---
I just finished roasting some coffee from Peru. I&#8217;ve never had it before, but it got me thinking about my [Roaster On the Go][1] &#8220;app&#8221; as I thought about the context that I could use to show you the solution to the compiler error described in the title. I used this to demonstrate [Working with Unwind Segues Programmatically in Swift][2], but now I&#8217;m going to use it to show you how to resolve these errors that can crop up when you&#8217;re implementing `NSManagedObject` subclasses for your Core Data Entities.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#scenario">Scenario</a>
    </li>
    <li>
      <a href="#solution">Solution</a>
    </li>
    <ul>
      <li>
        <a href="#step1">1 &#8211; Turn off automatic code generation for NSManagedObject subclasses</a>
      </li>
      <li>
        <a href="#step2">2 &#8211; Choose module</a>
      </li>
      <li>
        <a href="#step3">3 &#8211; Clear derived data</a>
      </li>
      <li>
        <a href="#step4">4 &#8211; Rebuild</a>
      </li>
    </ul>
    
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
    <li>
      <a href="#course">Learning Core Data? Watch my course, Core Data Fundamentals with Swift!</a>
    </li>
  </ul>
</div>

<a name="scenario" class="jump-target"></a>

# Scenario &#8211; Adding a data model

The &#8220;app&#8221; doesn&#8217;t currently use Core Data, but for this article, I&#8217;ve created a rudimentary data model that includes a single Entity called `Product`:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/RoasterOnTheGo_xcdatamodel.png" alt="RoasterOnTheGo_xcdatamodel" width="529" height="148" class="alignnone size-full wp-image-13091" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/RoasterOnTheGo_xcdatamodel.png 529w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/RoasterOnTheGo_xcdatamodel-300x84.png 300w" sizes="(max-width: 529px) 100vw, 529px" />][3]

Now suppose that I&#8217;m ready to [implement a subclass of NSManagedObject][4] for the `Product` Entity.

Doing so right now using Xcode 8&#8217;s default settings is going to give me all kinds of issues.

To be clear, I&#8217;m using **Xcode 8.2** for this scenario.

The error that I&#8217;m getting when I attempt to build after creating a subclass of `NSManagedObject` for the `Product` Entity is one of the following (depending on how you choose to create the `NSManagedObject` subclass):

> Invalid redeclaration of &#8216;Product&#8217; 

or

> &#8216;Product&#8217; is ambiguous for type lookup in this context 

or in the compiler output

> filename &#8220;Product+CoreDataClass.swift&#8221; used twice 

What&#8217;s happening??

**This is a conflict with Xcode 8&#8217;s auto codegen for `NSManagedObject` subclasses.** In some versions of Xcode 8 (version 8.2, for example), this auto codegen is turned **on by default**. This can present a problem if you intend to manually create `NSManagedObjectSubclasses` for your Entities.

<a name="solution" class="jump-target"></a>

# Solution

To solve this problem, or to avoid it before it occurs, you essentially need to turn off Xcode 8&#8217;s auto code generation feature for `NSManagedObject` subclasses if you intend to implement your `NSManagedObject` subclasses manually (my personal preference).

Take a look at the steps below to get your project building again:

<a name="step1" class="jump-target"></a>

## 1 &#8211; Turn off automatic code generation for NSManagedObject subclasses

Open your data model (the .xcdatamodeld file in your project).

Click on each Entity in your data model and in the Data Model Inspector of the Utilities Pane, change the Codegen property from &#8220;Class Definition&#8221; or &#8220;Category/Extension&#8221; to **&#8220;Manual/None&#8221;**:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/CodeGenOff-1024x297.png" alt="Turn code generation off" width="1024" height="297" class="alignnone size-large wp-image-13107" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/CodeGenOff-1024x297.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/CodeGenOff-300x87.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/CodeGenOff.png 1284w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]

<a name="step2" class="jump-target"></a>

## 2 &#8211; Choose module

You also need to tell Xcode where it can look to find a definition for the `NSManagedObject` subclass that you will implement for this Entity by choosing &#8220;Current Product Module&#8221; for the Module value:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/Module_CurrentProject-1024x312.png" alt="Choose &quot;Current Product Module&quot; as module value" width="1024" height="312" class="alignnone size-large wp-image-13109" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/Module_CurrentProject-1024x312.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/Module_CurrentProject-300x91.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/Module_CurrentProject.png 1284w" sizes="(max-width: 1024px) 100vw, 1024px" />][6]

**Save** your .xcdatamodeld file.

<a name="step3" class="jump-target"></a>

## 3 &#8211; Clear derived data

Behind the scenes, Xcode creates files and implements Types for the Entities in your data model. It puts them in your derived data folder and automatically traverses this folder to look for Type definitions for Core Data Entities. So in order to get your project building again, you need to get rid of those files that Xcode created automatically.

The &#8220;big hammer&#8221; for this is to simply clear all of your project&#8217;s derived data. To do this, click on the Products menu, hold down the Option key, and click &#8220;Clean build folder&#8230;&#8221;:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/CleanBuildFolder.png" alt="Product -> Press Option Key -> Clean Build Folder..." width="224" height="321" class="alignnone size-full wp-image-13118" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/CleanBuildFolder.png 224w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/CleanBuildFolder-209x300.png 209w" sizes="(max-width: 224px) 100vw, 224px" />][7]

_Alternatively_, you could opt to go in and delete the _only_ auto-generated Swift files, but you&#8217;ve got to do some digging.

Click on File -> Project Settings:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/ProjectSettings1.png" alt="File -> Project Settings" width="353" height="495" class="alignnone size-full wp-image-13121" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/ProjectSettings1.png 353w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/ProjectSettings1-214x300.png 214w" sizes="(max-width: 353px) 100vw, 353px" />][8]

Next, click on the arrow next to the path leading to your default derived data folder:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/DerivedData.png" alt="Click derived data folder arrow" width="534" height="320" class="alignnone size-full wp-image-13122" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/DerivedData.png 534w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/DerivedData-300x180.png 300w" sizes="(max-width: 534px) 100vw, 534px" />][9]

Next, find the folder for your project at the root of your default derived data directory (where you were taken in Finder when you clicked the arrow in Project Settings). Then get ready to dig&#8230;

Click Build -> Intermediates -> ProjectName.build -> Debug-iphonesimulator -> ProjectName.build -> DerivedSources -> CoreDataGenerated -> ProjectName

**Delete the .swift files** in this folder.  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/PathToAutoGeneratedFiles-1024x198.png" alt="Path to auto-generated Entities" width="1024" height="198" class="alignnone size-large wp-image-13123" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/PathToAutoGeneratedFiles-1024x198.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/PathToAutoGeneratedFiles-300x58.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][10]

<a name="step4" class="jump-target"></a>

## 4 &#8211; Rebuild

After you rebuild, any compiler errors you previously had, related to &#8220;ambiguous Type&#8221; or &#8220;redeclaration of Type&#8221; should be resolved!

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

 [1]: https://github.com/andrewcbancroft/RoasterOnTheGo
 [2]: https://www.andrewcbancroft.com/2015/12/18/working-with-unwind-segues-programmatically-in-swift/
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2017/03/RoasterOnTheGo_xcdatamodel.png
 [4]: https://www.andrewcbancroft.com/2014/07/17/implement-nsmanagedobject-subclass-in-swift/
 [5]: https://www.andrewcbancroft.com/wp-content/uploads/2017/03/CodeGenOff.png
 [6]: https://www.andrewcbancroft.com/wp-content/uploads/2017/03/Module_CurrentProject.png
 [7]: https://www.andrewcbancroft.com/wp-content/uploads/2017/03/CleanBuildFolder.png
 [8]: https://www.andrewcbancroft.com/wp-content/uploads/2017/03/ProjectSettings1.png
 [9]: https://www.andrewcbancroft.com/wp-content/uploads/2017/03/DerivedData.png
 [10]: https://www.andrewcbancroft.com/wp-content/uploads/2017/03/PathToAutoGeneratedFiles.png