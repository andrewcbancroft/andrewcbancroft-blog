---
title: Swift UITableViewDataSource Cheat Sheet
author: Andrew
type: blog
date: 2014-11-24T22:04:28+00:00
url: /2014/11/24/swift-uitableviewdatasource-cheat-sheet/
dsq_thread_id:
  - "3259408694"
categories:
  - iOS / Mac
  - Swift
tags:
  - Cheat Sheet
  - Swift
  - UITableView
  - UITableViewDataSource

---
iOS developers will quickly recognize that there are a set of methods that always tend to get implemented when dealing with `UITableViews` . The problem I consistently face is _remembering_ that set of methods that belong to the `UITableViewDataSource` (and `UITableViewDelegate` ) protocols. I find myself option-clicking the protocol name to remember the method signatures I need, since Xcode doesn't have a way to stub out the methods involved with a protocol (C# developers working in Visual Studio like myself are spoiled!).

I'm sure cheat sheets like this already exist, but I thought, "Why not have one that I can reference from my _own_ blog?&#8221;&#8230; In fact, I've gone ahead and turned the code below into a snippet in Xcode, but just in case I ever lose that, I've got this post, which stubs out dummy implementations of the three most common `UITableViewDataSource` protocol methods.

I'd be delighted if it helped my readers as well, so without further ado, here's my `UITableViewDataSource` cheat sheet, which should allow you (and me) to copy and paste directly into our `UITableViewDataSource` class for a quick start:

```swift
func numberOfSectionsInTableView(tableView: UITableView) -> Int {
    return 1 // This was put in mainly for my own unit testing
}

func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return dataSourceArray.count // Most of the time my data source is an array of something...  will replace with the actual name of the data source
}

func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
    // Note:  Be sure to replace the argument to dequeueReusableCellWithIdentifier with the actual identifier string!
    let cell = tableView.dequeueReusableCellWithIdentifier("ReplaceWithCellIdentifier") as! UITableViewCell
    
    // set cell's textLabel.text property
    // set cell's detailTextLabel.text property
    return cell
}
```