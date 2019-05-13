---
title: 'Swift How-To:  Setting up a Table View'
author: Andrew
type: blog
date: 2015-05-19T02:31:38+00:00
aliases:
  - /2015/05/18/swift-how-to-setting-up-a-table-view/
dsq_thread_id:
  - "3775546504"
categories:
  - Swift
tags:
  - Screencast
  - Swift
  - UITableView

---
Think of this screencast as the &#8220;Hello World&#8221; of creating a view controller with a table view. I cover organizing things in the Storyboard, Auto Layout constraints, and the implementation of the data source protocol methods for a table view.

### Screencast



### Screencast Transcript

#### [0:01]

Hi, I'm Andrew from andrewcbancroft.com.

I use table views fairly often in my examples, so I've decided to create a short walkthrough of how to set up a table view in Swift.

Think of this as the &#8220;Hello World&#8221; of creating a view controller with a table view.

#### [0:16]

In this walkthrough, I'm using Xcode 6.3.1, which has me writing Swift 1.2 syntax in a couple of spots.

#### [0:24]

To get started, I'm going to drop into the search bar of the Object Library, which is in the Utilities Pane to hunt for a table view.

Once I've narrowed the results and located the Table View control, I'll click and drag one onto my Storyboard scene.

#### [0:41]

With the table view in place, filling the entire scene, I'll control + click and drag up to the yellow View Controller icon to wire up my the table view's dataSource&#8230; and delegate properties.

#### [0:56]

Now I need to connect the table view to my View Controller source file. To bring up the assistant editor, I'll option+click the ViewController.swift file in the Project Navigator.

#### [1:06]

With the table view and the source side by side, once again, I'll control + click the table view, and drag over to the ViewController source file to create an IBOutlet property for my table view.

#### [1:21]

Next up is to specify that my ViewController class will conform to the UITableViewDataSource protocol&#8230; and the UITableViewDelegate protocols.

#### [1:31]

Of course, at this point, I haven't actually implemented any of the required protocol methods, so I get a compiler error saying so.

I've written up a handy UITableViewDataSource cheat sheet over at my website (andrewcbancroft.com). I'll go grab that code and paste it into my View Controller.

#### [1:51]

Here I am at andrewcbancroft.com – I've searched for &#8220;UITableViewDataSource&#8221; and located my cheet sheet.

#### [2:02]

Scrolling down, I find the code I need, switch the code snippet plugin to &#8220;raw&#8221; mode, select everything, and copy.

#### [2:12]

Switching back over to my Xcode window, I paste the code snippet in.

#### [2:16]

As I mentioned in the beginning, this walkthrough can be thought of as the &#8220;Hello World&#8221; of table view setup. With that in mind, for now, I'll create a dataSourceArray with some dummy data in it, just to get things compiling and displaying data.

#### [2:31]

Now that I've got the data source geared to go, I need some cells to display data in.

For this task, I'll close the assistant editor&#8230;

Next, I'll click to open the document outline. I find that working with the view hierarchy is _much_ easier to manipulate using this outline, rather than clicking to try and select the right thing in the Storyboard Scene.

#### [2:55]

I'll select the table view, and open the Utilities pane to get access to the Attributes inspector.

#### [3:01]

I'm going to configure this table view to have one kind of prototype cell.

#### [3:06]

Increasing the Prototype Cells count added a new node to the document outline's view hierarchy.

I'll expand the Table View and click on the Table View Cell to do a bit more configuration.

#### [3:19]

I'll set the Style to Basic&#8230;

Then I'll give it an identitifer of &#8220;BasicCell&#8221;.

I need this &#8220;BasicCell&#8221; string for one of my other data source proocol methods, so I'll select it, and copy it.

#### [3:37]

Back in my ViewController.swift source file, I'll paste that &#8220;BasicCell&#8221; string as the argument to dequeReusableCellWithIdentifier.

#### [3:48]

The last step to get things wired up is to set the cell's textLabel.text property.

I'll use the dataSourceArray's values here.

Simply indexing into the array at the indexPath.row value that's currently being rendered in the table view will grab the string out of the array and assign it to the textLabel.text property of the cell.

#### [4:13]

When I run the app and observe the table view's behavior, I'm not quite satisfied with it. The status bar overlaps the rows and makes the text hard to read.

Additionally, the table view doesn't extend all the way to the bottom when I run it in the iPhone 6 sized simulator.

#### [4:30]

I'll stop the app and make an adjustment in the Storyboard.

#### [4:34]

Selecting the table view from the document outline will allow me to grab the top edge and drag the hight downward slowly until it &#8220;snaps&#8221; into place where the bottom of the status bar would appear to be.

#### [4:48]

Next, I'll set some constraints. Within the document outline, I'll control + click from the Table View to the View and set constraints for &#8220;Top Space to Top Layout Guide&#8221;, Center Horizontally, Center Vertically, and Equal Widths.

#### [5:17]

Running the app one more time gives me the behavior I want!

#### [5:31]

Thanks for watching – I have other resources r elated to Swift and iOS development at andrewcbancroft.com, and you can find me on Twitter: [@andrewcbancroft][1]

 [1]: https://twitter.com/andrewcbancroft