---
title: Sharing a Core Data Model with a Swift Framework
author: Andrew
type: blog
date: 2015-08-26T04:04:05+00:00
aliases:
  - /2015/08/25/sharing-a-core-data-model-with-a-swift-framework/
dsq_thread_id:
  - "4067462005"
categories:
  - Swift
tags:
  - Core Data
  - Framework
  - Swift

---

<small>Updated on June 13, 2017 – Swift 3.0, Xcode 8</small>

Code re-use is a powerful thing, but it's not always easy to pull off. We strive for it though, because in the long run, it makes maintaining the code far, far easier than if we just settled for copying and pasting.

With the introduction of dynamic frameworks in iOS 8, a world of possibility opened up for iOS developers to achieve some pretty cool re-use scenarios, one of which we're going to dive into today.

Not only can we share _code_ between projects, we can also share Core Data _models_ between projects by utilizing frameworks!

Perhaps you're working on an iOS + Mac app combination and the data model for each is identical. Maybe you're building several iOS apps that have different user interfaces but share some underlying persistence-layer models. Whatever the case may be, wouldn't it be awesome to design the Core Data model once and share it between your projects?


<a name="example-scenario" class="jump-target"></a>

### Example scenario

Our working example for this walkthrough will be the following:

Our team is building an **iOS app** and a **Mac app** and the **underlying data model will be exactly the same** between them. The only difference between the apps will be the target platform.

The app will target car enthusiasts everywhere – we will empower car fanatics to manage of a list of their favorite cars.

We'll be creating two Xcode projects during this walkthrough: One will be the framework and will be called &#8220;CarKit&#8221;. The other will be a single view iOS application. We won't actually dive into the Mac project, but one could imagine the process being very similar for importing CarKit into the Mac application when it came time to build that one.

I'm providing a completed CarKit + Carz package for you to look at over at GitHub:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/CoreDataFrameworkExample" title="Core Data Framework Example">CarKit + Carz Core Data Framework Example</a>
    </li>
  </ul>
</div>

Let's get started!

<a name="create-swift-framework-project" class="jump-target"></a>

### Creating a Swift framework project

To get started with creating a Swift framework, begin with Xcode's New Project dialog (File -> New -> Project&#8230;). Typically we stay in the realm of the &#8220;iOS Application&#8221; project templates, but if you click &#8220;Framework & library&#8221;, you'll see the option to create a new Cocoa Touch Framework:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/01-New-Project-Framework.png" alt="01 - New Project - Framework" width="778" height="490" class="alignnone size-full wp-image-12239" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/01-New-Project-Framework.png 778w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/01-New-Project-Framework-300x189.png 300w" sizes="(max-width: 778px) 100vw, 778px" />][1]

In keeping with Apple's &#8220;\___Kit&#8221; theme, we'll name our framework &#8220;CarKit&#8221;:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/02-Project-Name.png" alt="02 - Project Name" width="760" height="467" class="alignnone size-full wp-image-12240" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/02-Project-Name.png 760w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/02-Project-Name-300x184.png 300w" sizes="(max-width: 760px) 100vw, 760px" />][2]

<a name="add-data-model-file" class="jump-target"></a>

#### Add a data model file

Once the framework project has been created, we're set to drop in a new Data Model file from Xcode's new file dialog (File -> New -> File&#8230;). Choose Core Data, and then Data Model:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/03-New-File-Core-Data-Data-Model.png" alt="03 - New File - Core Data - Data Model" width="750" height="444" class="alignnone size-full wp-image-12241" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/03-New-File-Core-Data-Data-Model.png 750w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/03-New-File-Core-Data-Data-Model-300x178.png 300w" sizes="(max-width: 750px) 100vw, 750px" />][3]

Give the data model file a name that seems to fit your situation. For our example, let's name it &#8220;CarModel&#8221;:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/04-Model-Name.png" alt="04 - Model Name" width="748" height="740" class="alignnone size-full wp-image-12242" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/04-Model-Name.png 748w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/04-Model-Name-300x297.png 300w" sizes="(max-width: 748px) 100vw, 748px" />][4]

<a name="add-model-attributes" class="jump-target"></a>

#### Add model attributes

Next it's time to actually add attributes to the model. Since our theme is cars here, we'll stick with three simple attributes: `year`, `make`, and `model`:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/05-Complete-Model-1024x656.png" alt="05 - Complete Model" width="1024" height="656" class="alignnone size-large wp-image-12243" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/05-Complete-Model-1024x656.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/05-Complete-Model-300x192.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/05-Complete-Model.png 1399w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]

<a name="create-nsmanagedobject-subclass" class="jump-target"></a>

#### Create NSManagedObject subclass

With the model attributes all configured, it's time to create an `NSManagedObject` subclass. This will make consuming the model much easier in client applications. I've actually [written up a full walk through on creating an NSManagedObject subclass in Swift][6] as there are some nuances. Feel free to read up on that if you so desire!  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/06-NSManagedObject-Subclass.png" alt="06 - NSManagedObject Subclass" width="517" height="490" class="alignnone size-full wp-image-12244" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/06-NSManagedObject-Subclass.png 517w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/06-NSManagedObject-Subclass-300x284.png 300w" sizes="(max-width: 517px) 100vw, 517px" />][7]

Be absolutely sure to mark your `NSManagedObject` subclass and its properties `public` – otherwise, the client app won't be able to see the class or its properties:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/061-NSManagedObjectSubclass-Public.png" alt="061 - NSManagedObjectSubclass Public" width="671" height="351" class="alignnone size-full wp-image-12255" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/061-NSManagedObjectSubclass-Public.png 671w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/061-NSManagedObjectSubclass-Public-300x157.png 300w" sizes="(max-width: 671px) 100vw, 671px" />][8]

As I point out in [Implement NSManagedObject Subclass in Swift][6], you need to set the Module property in the Data Model Inspector to be CarKit (which is the same as the &#8220;Current Project Module&#8221; option for this example):  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/07-Change-Entity-Class-1024x213.png" alt="07 - Change Entity Class" width="1024" height="213" class="alignnone size-large wp-image-12245" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/07-Change-Entity-Class-1024x213.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/07-Change-Entity-Class-300x62.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/07-Change-Entity-Class-768x160.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/07-Change-Entity-Class.png 1404w" sizes="(max-width: 1024px) 100vw, 1024px" />][9]

<a name="build-inspect-outputs" class="jump-target"></a>

#### Build and inspect outputs

We've got a framework, and we've got a Data Model with attributes and an `NSManagedObject` subclass all appropriately implemented. Now it's time to build the project and inspect the output of the build!

Command + B to build, and then head up to the File menu and choose Project Settings:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/08-Window-Projects.png" alt="08 - Window - Projects" width="292" height="492" class="alignnone size-full wp-image-12246" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/08-Window-Projects.png 292w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/08-Window-Projects-178x300.png 178w" sizes="(max-width: 292px) 100vw, 292px" />][10]

In the Project Settings area that appears, click the small gray arrow under the &#8220;Derived Data&#8221; section:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/09-CarKit-Projects-Window.png" alt="09 - CarKit - Projects Window" width="612" height="374" class="alignnone size-full wp-image-12247" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/09-CarKit-Projects-Window.png 612w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/09-CarKit-Projects-Window-300x183.png 300w" sizes="(max-width: 612px) 100vw, 612px" />][11]

Next, find the derived data folder for your project. It should be named the same as your project with a set of random characters after. Sometimes there will be multiple folders that could be your project. You can look at the last modified date to help figure you figure out which one was most recently built and choose that one.

Expand the Build folder down to Build -> Products -> Debug-iphonesimulator. There you should see the CarKit.framework artifact, and within it, everything that's needed to be able to utilize the data model in a client application. Awesome!  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/10-CarKit-Finder-Includes-momd-1024x733.png" alt="10 - CarKit - Finder - Includes momd" width="1024" height="733" class="alignnone size-large wp-image-12248" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/10-CarKit-Finder-Includes-momd-1024x733.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/10-CarKit-Finder-Includes-momd-300x215.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/10-CarKit-Finder-Includes-momd-768x550.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/10-CarKit-Finder-Includes-momd.png 1064w" sizes="(max-width: 1024px) 100vw, 1024px" />][12]

**Note:** This framework is not production-ready. It's a little more involved to create a framework that one can run on a device / pass validation when submitting to the app store. The development of the framework remains the same, but the _build_ phases and procedures must be modified to make it &#8220;universal&#8221;. Rather than overly complicate this walkthrough, I recommend reviewing &#8220;[Universal Cocoa Touch Frameworks for iOS 8 – (Remix)][13] by [@kodmunki][14] to create a &#8220;universal&#8221; framework capable of being run in the simulator and on iOS devices.

<a name="create-framework-dependent-app" class="jump-target"></a>

### Creating the framework-dependent app

With the framework built, it's time to create the iOS app that will utilize that framework and its packaged assets! Begin a new project from File -> New -> Project and select &#8220;Single View Application&#8221;. I'll name our example app &#8220;Carz&#8221;. **Ensure that &#8220;Use Core Data&#8221; is selected** so that you get the boilerplate Core Data code put into your project by Xcode:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/11-New-Single-View-App-Carz.png" alt="11 - New Single View App - Carz" width="755" height="492" class="alignnone size-full wp-image-12249" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/11-New-Single-View-App-Carz.png 755w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/11-New-Single-View-App-Carz-300x195.png 300w" sizes="(max-width: 755px) 100vw, 755px" />][15]

<a name="remove-xcode-generated-xcdatamodeld" class="jump-target"></a>

#### Remove Xcode-generated .xcdatamodeld file

When you select &#8220;Use Core Data&#8221; in the project creation window, Xcode automatically generates some boilerplate code, which we want. But it also gives us a &#8220;Carz.xcdatamodeld&#8221; file, which we will not need because we'll use the model that's found in CarKit. Remove the &#8220;Carz.xcdatamodeld&#8221; file that Xcode provides for you:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/12-Remove-default-data-model-from-new-project-1024x475.png" alt="12 - Remove default data model from new project" width="1024" height="475" class="alignnone size-large wp-image-12250" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/12-Remove-default-data-model-from-new-project-1024x475.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/12-Remove-default-data-model-from-new-project-300x139.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/12-Remove-default-data-model-from-new-project.png 1394w" sizes="(max-width: 1024px) 100vw, 1024px" />][16]

<a name="obtain-framework-bundle-identifier" class="jump-target"></a>

#### Obtain framework Bundle Identifier

Speaking of using the CarKit Core Data model, we're now ready to configure that piece of the app. To do this part, you will need to know the Bundle Identifier from your framework project. To find out what it is, jump back over to the framework project, click the top-level node in the project navigator, click on the framework target name, and look under the General tab of the project configuration. There you'll find the Bundle Identifier, which you can copy to your clipboard:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/13-CarKit-Bundle-Identifier-1024x301.png" alt="13 - CarKit Bundle Identifier" width="1024" height="301" class="alignnone size-large wp-image-12251" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/13-CarKit-Bundle-Identifier-1024x301.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/13-CarKit-Bundle-Identifier-300x88.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/13-CarKit-Bundle-Identifier.png 1137w" sizes="(max-width: 1024px) 100vw, 1024px" />][17]

<a name="replace-managed-object-model-property" class="jump-target"></a>

#### Replace managedObjectModel property initialization

Out of the box, Xcode generates some code to help locate your Core Data model file. The boilerplate `managedObjectModel` property looks like this:

```swift
lazy var managedObjectModel: NSManagedObjectModel = {
    // The managed object model for the application. This property is not optional. It is a fatal error for the application not to be able to find and load its model.
    let modelURL = NSBundle.mainBundle().URLForResource("DataModelFileName", withExtension: "momd")!
    return NSManagedObjectModel(contentsOfURL: modelURL)!
}()
```

However, this won't work for us, because we're going to use the data model from CarKit, and CarKit is not in the `mainBundle()`. This is why we jumped over and copied the Bundle Identifier for CarKit in the previous step. To locate the data model file in _that_ bundle, you'll replace the `managedObjectModel` initialization step to the following (for CarKit):

```swift
lazy var managedObjectModel: NSManagedObjectModel = {
        // The managed object model for the application. This property is not optional. It is a fatal error for the application not to be able to find and load its model.
        let carKitBundle = Bundle(identifier: "com.andrewcbancroft.CarKit")
        
        let modelURL = carKitBundle!.url(forResource: "CarModel", withExtension: "momd")!
        return NSManagedObjectModel(contentsOf: modelURL)!
}()
```

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/16-AppDelegate-1024x394.png" alt="16 - AppDelegate" width="1024" height="394" class="alignnone size-large wp-image-12253" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/16-AppDelegate-1024x394.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/16-AppDelegate-300x115.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/16-AppDelegate-768x296.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/16-AppDelegate.png 1213w" sizes="(max-width: 1024px) 100vw, 1024px" />][18]

Recall that &#8220;CarModel&#8221; is the name of the Core Data model we created for the framework in CarKit. We simply look for that artifact by calling `URLForResource:withExtension:` on the `carKitBundle` to initialize an `NSManagedObjectModel` instance.

<a name="add-carkit-framework" class="jump-target"></a>

#### Add CarKit framework to project and embed binary

Now it's time to actually bring in the framework for use within our app. I typically open up a Finder window and drag over a copy of the framework (in this case, the CarKit.framework file) into my project. Feel free to organize it into a &#8220;lib&#8221; folder.

Assuming that you go through all the necessary steps to make the framework production-ready, you'll want to embed the binary and ensure that it's referenced in the &#8220;Linked Frameworks and Libraries&#8221; portion of your project configuration:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/15-Embed-CarKit-and-Link-CarKit-1024x634.png" alt="15 - Embed CarKit and Link CarKit" width="1024" height="634" class="alignnone size-large wp-image-12252" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/15-Embed-CarKit-and-Link-CarKit-1024x634.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/15-Embed-CarKit-and-Link-CarKit-300x186.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/15-Embed-CarKit-and-Link-CarKit.png 1399w" sizes="(max-width: 1024px) 100vw, 1024px" />][19]

<a name="take-for-test-drive" class="jump-target"></a>

#### Taking the model out for a test drive (pun intended)

It's simple enough to try things out by writing a simple little snippet of code in the `AppDelegate`:

```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
    // Override point for customization after application launch.
    
    let newCar = NSEntityDescription.insertNewObject(forEntityName: "Car", into: self.managedObjectContext!) as! Car
    newCar.year = 2015
    newCar.make = "Tesla"
    newCar.model = "S"
    
    do {
        try self.managedObjectContext?.save()
    } catch _ {
    }
    
    let fetchRequest = NSFetchRequest&lt;NSFetchRequestResult>(entityName: "Car")
    let cars = (try! self.managedObjectContext?.fetch(fetchRequest)) as! [Car]
    
    print(cars, terminator: "")
    
    return true
}
```

This code simply obtains a new Car object, sets some properties, and saves it all with the `managedObjectContext` instance that's configured in the `AppDelegate`.

Then it goes and performs a fetch request to grab all the `Car` objects and prints them. The results? See for yourself:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/17-Final-Result-1024x592.png" alt="17 - Final Result" width="1024" height="592" class="alignnone size-large wp-image-12254" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/08/17-Final-Result-1024x592.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/17-Final-Result-300x173.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/17-Final-Result-768x444.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2015/08/17-Final-Result.png 1470w" sizes="(max-width: 1024px) 100vw, 1024px" />][20]

### Wrapping up

This walkthrough guided you through the process of creating a framework for the purpose of sharing a Core Data model with multiple projects. My hope is that you're now empowered to make use of _re_use by utilizing Swift frameworks to share even portions of your persistence layer!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/07/10/using-a-core-data-model-in-swift-playgrounds/" title="Using a Core Data Model in Swift Playgrounds">Using a Core Data Model in Swift Playgrounds</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/25/using-swift-to-seed-a-core-data-database/" title="Using Swift to Seed a Core Data Database">Using Swift to Seed a Core Data Database</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/18/core-data-cheat-sheet-for-swift-ios-developers/" title="Core Data Cheat Sheet for Swift iOS Developers">Core Data Cheat Sheet for Swift iOS Developers</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/01/13/unit-testing-model-layer-core-data-swift/" title="Unit Testing Model Layer with Core Data and Swift">Unit Testing Model Layer with Core Data and Swift</a>
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
      <i class="fa fa-video-camera"></i> <a href="http://bit.ly/ps-core-data-swift" target="_blank">Core Data Fundamentals with Swift</a><br /> <a href="http://bit.ly/ps-core-data-swift" target="_blank"><img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png" alt="Core Data Fundamentals with Swift" width="1024" height="576" class="alignnone size-large wp-image-13163" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-1024x576.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-300x169.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift-768x432.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/ps-core-data-fundamentals-swift.png 1539w" sizes="(max-width: 1024px) 100vw, 1024px" /></a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/01-New-Project-Framework.png
 [2]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/02-Project-Name.png
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/03-New-File-Core-Data-Data-Model.png
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/04-Model-Name.png
 [5]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/05-Complete-Model.png
 [6]: http://www.andrewcbancroft.com/2014/07/17/implement-nsmanagedobject-subclass-in-swift/
 [7]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/06-NSManagedObject-Subclass.png
 [8]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/061-NSManagedObjectSubclass-Public.png
 [9]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/07-Change-Entity-Class.png
 [10]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/08-Window-Projects.png
 [11]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/09-CarKit-Projects-Window.png
 [12]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/10-CarKit-Finder-Includes-momd.png
 [13]: https://kodmunki.wordpress.com/2015/03/04/cocoa-touch-frameworks-for-ios8-remix/
 [14]: https://twitter.com/kodmunki
 [15]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/11-New-Single-View-App-Carz.png
 [16]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/12-Remove-default-data-model-from-new-project.png
 [17]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/13-CarKit-Bundle-Identifier.png
 [18]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/16-AppDelegate.png
 [19]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/15-Embed-CarKit-and-Link-CarKit.png
 [20]: https://www.andrewcbancroft.com/wp-content/uploads/2015/08/17-Final-Result.png