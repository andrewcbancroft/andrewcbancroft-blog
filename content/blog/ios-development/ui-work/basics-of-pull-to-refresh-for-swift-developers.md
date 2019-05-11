---
title: Basics of Pull to Refresh for Swift Developers
author: Andrew
type: blog
date: 2015-03-17T17:55:52+00:00
aliases:
  - /2015/03/17/basics-of-pull-to-refresh-for-swift-developers/
dsq_thread_id:
  - "3603461764"
categories:
  - Swift
tags:
  - Pull to Refresh
  - Swift
  - UIRefreshControl

---
<small>Updated on September 21, 2016 – Swift 3.0</small>

Implementing &#8220;pull to refresh&#8221; is a common need that arises when working with table views. There are typically two scenarios that folks find themselves in when attempting to implement this feature:

  1. They're working with a UITableViewController
  2. They're working with a non-UITableViewController, but their view incorporates a regular UITableView, either taking up the whole screen, or a smaller portion of it

This entry will explore both scenarios to help you get up and running quickly with implementing pull to refresh for your Swift iOS app.

<a name="example-scenario" class="jump-target"></a>

### Example scenario

For this guide, suppose that we have a list of movies that we'd like to display in a table view. Pulling to refresh will fetch more movies and update the table view to show the new ones.

If you're the type that likes to simply dive into a working example, both implementations are available to download from GitHub:

<div class="resources">
  <div class="resources-header">
    Example projects
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-github fa-lg"></i> Example implemented with UITableViewController <div>
        (<a href="https://github.com/andrewcbancroft/PullToRefreshExample_UITableViewController/tree/swift-2.3">Swift 2.3</a> | <a href="https://github.com/andrewcbancroft/PullToRefreshExample_UITableViewController/tree/master">Swift 3.0</a>)
      </div>
    </li>
    
    <li>
      <i class="fa fa-github fa-lg"></i> Example implemented with regular view controller + UITableView <div>
        (<a href="https://github.com/andrewcbancroft/PullToRefreshExample_RegularViewController/tree/swift-2.3">Swift 2.3</a> | <a href="https://github.com/andrewcbancroft/PullToRefreshExample_RegularViewController/tree/master">Swift 3.0</a>)
      </div>
    </li>
  </ul>
</div>

**Note:** Code in the main article below is written in Swift 3.0, but code examples for Swift 2.3 are found in the example projects above.

`Movies` are represented by a simple struct:

<pre class="lang:swift decode:true " title="Movie" >struct Movie {
    let title: String
    let genre: String
}</pre>

The table view (regardless of whether we use a `UITableViewController` or a regular `UIViewController`) has the following setup&#8230;

Initial data source values:

<pre class="lang:swift decode:true " title="Initial data source" >var movies = [
    Movie(title: "Lion King", genre: "Animation"),
    Movie(title: "Star Wars", genre: "Sci-fi")
]</pre>

Setting up the table view's data source protocol methods depends on whether you're using a [UITableViewController][1] or a [regular UIViewController][2] with a table view as one of its content views, so we'll cover those in the individual examples.

<a name="table-view-controller" class="jump-target"></a>

### Implementing with UITableViewController

<a name="tvc-example-setup" class="jump-target"></a>

#### Finish example setup

When working with a `UITableViewController`, we simply override the data source method implementations. The following is how I've chosen to do it for this example:

<pre class="lang:swift decode:true " title="UITableView data source methods" >override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return movies.count
}

override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "cell")!
    
    cell.textLabel?.text = movies[(indexPath as NSIndexPath).row].title
    cell.detailTextLabel?.text = movies[(indexPath as NSIndexPath).row].genre
    
    return cell
}</pre>

<a name="enable-refreshing-storyboard" class="jump-target"></a>

#### Enable refreshing in Storyboard

When you're working with a `UITableViewController`, the solution is fairly simple: First, Select the table view controller in your storyboard, open the attributes inspector, and enable refreshing:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/03/TableView_EnableRefreshing-1024x740.png" alt="Table View Controller - Enable Refreshing" width="1024" height="740" class="alignnone size-large wp-image-11511" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/03/TableView_EnableRefreshing-1024x740.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/03/TableView_EnableRefreshing-300x217.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/03/TableView_EnableRefreshing.png 1083w" sizes="(max-width: 1024px) 100vw, 1024px" />][3]

A `UITableViewController` comes outfitted with a reference to a `UIRefreshControl` out of the box. You simply need to wire up a few things to initiate and complete the refresh when the user pulls down.

<a name="override-viewdidload" class="jump-target"></a>

#### Override viewDidLoad()

In your override of `viewDidLoad()`, add a target to handle the refresh as follows:

<pre class="lang:swift decode:true mark:5" title="viewDidLoad()" >override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view, typically from a nib.
    
    self.refreshControl?.addTarget(self, action: #selector(ViewController.handleRefresh(_:)), for: UIControlEvents.valueChanged)
}</pre>

Here are a couple of things to observe about the code above:

  1. Swift's new #selector feature helps with specifying which action will handle the refresh. Since I've specified `ViewController.handleRefresh(_:)` (note the underscore and the colon!) as the action argument, I need to define a function in this `UITableViewController` class with the same name. Additionally, the function should take one argument.
  2. We'd like this action to be called for the `UIControlEvent` called `ValueChanged`.

<a name="tvc-handle-refresh-function" class="jump-target"></a>

#### Implement handleRefresh function

The `handleRefresh:` function may look something like the following:

<pre class="lang:swift decode:true mark:11,12" title="handleRefresh" >func handleRefresh(refreshControl: UIRefreshControl) {
    // Do some reloading of data and update the table view's data source
    // Fetch more objects from a web service, for example...
    
    // Simply adding an object to the data source for this example
    let newMovie = Movie(title: "Serenity", genre: "Sci-fi")
    movies.append(newMovie)
    
    movies.sort() { $0.title &lt; $1.title }
    
    self.tableView.reloadData()
    refreshControl.endRefreshing()
}</pre>

That should complete the pull to refresh implementation when you're working with a `UITableViewController`!

<a name="regular-view-controller" class="jump-target"></a>

### Implementing with regular view controller + UITableView

<a name="reg-tv-example-setup" class="jump-target"></a>

#### Finish example setup

When working with a _regular_ `UIViewController`, there are a few extra steps involved in getting things set up:

  1. Create an IBOutlet from the storyboard to the view controller
  2. Wire up the table view's data source and delegate from the storyboard
  3. Implement the [required table view data source methods][4]

Creating the IBOutlet is a matter of control+clicking and dragging from the table view in the Storyboard to the view controller code to create the outlet.

To wire up the table view's data source and delegate in the Storyboard, control+click the table view and drag up to the yellow view controller icon:

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/04/WireTableViewDataSource.png" alt="Wire up table view&#039;s data source and delegate" width="789" height="746" class="alignnone size-full wp-image-11681" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/04/WireTableViewDataSource.png 789w, https://www.andrewcbancroft.com/wp-content/uploads/2015/04/WireTableViewDataSource-300x284.png 300w" sizes="(max-width: 789px) 100vw, 789px" />][5]

The data source protocol method implementations may look something like this:

<pre class="lang:swift decode:true " title="UITableView data source methods">func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return movies.count
}

func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    let cell = tableView.dequeueReusableCell(withIdentifier: "cell")!
    
    cell.textLabel?.text = movies[(indexPath as NSIndexPath).row].title
    cell.detailTextLabel?.text = movies[(indexPath as NSIndexPath).row].genre
    
    return cell
}</pre>

<a name="setup-refresh-control" class="jump-target"></a>

#### Set up UIRefreshControl

Whereas a `UITableViewController` comes pre-fit with a `UIRefreshControl`, a regular `UIViewController` does not. It's simple enough to set one up though. Here is a snippet defining a lazily instantiated variable which creates and configures a `UIRefreshControl`:

<pre class="lang:swift decode:true mark:3" title="Set up UIRefreshControl" >lazy var refreshControl: UIRefreshControl = {
    let refreshControl = UIRefreshControl()
    refreshControl.addTarget(self, action: #selector(ViewController.handleRefresh(_:)), for: UIControlEvents.valueChanged)
    
    return refreshControl
}()</pre>

The most complicated thing about the code I just proposed is how the `UIRefreshControl` instance is assigned lazily by means of the closure expression denoted by `= { // ...closure body with setup code... }()` in the above snippet. Using this approach allows me to complete the setup all in one spot without the use of optionals. You may prefer doing this another way. The bottom line goal is to have a `UIRefreshControl` instance that we can add to the table view (coming up).

As for the body of the closure expression, we're adding a target-action to the `UIRefreshControl` instance, [just like we did when we were dealing with a UITableViewController][6].

As with the `UITableViewController` example, note:  
1. Since I've specified &#8220;handleRefresh:&#8221; (note the colon!) as the action argument, I need to define a function in this `UITableViewController` class with the same name. Additionally, the function should take one argument.  
2. We'd like this action to be called for the `UIControlEvent` called `ValueChanged`.

<a name="regvc-override-viewdidload" class="jump-target"></a>

#### Override viewDidLoad

Assuming that [there is an outlet to the table view in the Storyboard][7], the next step is to add the `UIRefreshControl` as a subview to the table view:

<pre class="lang:swift decode:true mark:5" title="viewDidLoad" >override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view, typically from a nib.
    
    self.tableView.addSubview(self.refreshControl)
}</pre>

<a name="regvc-handle-refresh-function" class="jump-target"></a>

#### Implement handleRefresh function

The `handleRefresh` function is implemented exactly as it was when we were dealing with a `UITableViewController`:

<pre class="lang:swift decode:true mark:11,12" title="handleRefresh" >func handleRefresh(refreshControl: UIRefreshControl) {
    // Do some reloading of data and update the table view's data source
    // Fetch more objects from a web service, for example...
    
    // Simply adding an object to the data source for this example
    let newMovie = Movie(title: "Serenity", genre: "Sci-fi")
    movies.append(newMovie)
    
    movies.sort() { $0.title &lt; $1.title }
    
    self.tableView.reloadData()
    refreshControl.endRefreshing()
}</pre>

### Wrapping up

Implementing &#8220;pull to refresh&#8221; is a common need that arises when working with table views. Here we've explored how to implement this feature using both a `UITableViewController` _and_ with a regular view controller and a table view.

<a name="share" class="jump-target"></a>

 [1]: #table-view-controller
 [2]: #regular-view-controller
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2015/03/TableView_EnableRefreshing.png
 [4]: http://www.andrewcbancroft.com/2014/11/24/swift-uitableviewdatasource-cheat-sheet/
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2015/04/WireTableViewDataSource.png
 [6]: #override-viewdidload
 [7]: #reg-tv-example-setup