---
title: Distinguishing Between Multiple UIActionSheets with Swift
author: Andrew
type: blog
date: 2014-11-17T04:17:39+00:00
aliases:
  - /2014/11/16/distinguishing-between-multiple-uiactionsheets-with-swift/
dsq_thread_id:
  - "3232665050"
categories:
  - Software Development
  - Swift
tags:
  - Enumerations
  - Swift
  - UIActionSheet
  - UIView Tag Property

---
The challenge when dealing with the presentation and handling of more than one <span class="lang:swift decode:true  crayon-inline " >UIActionSheet</span> in a single View Controller is made clear by asking, &#8220;How am I going to tell which action sheet I&#8217;m dealing with so that I can handle the user&#8217;s choice appropriately?&#8221;

Presumably, the user&#8217;s interaction with one of the action sheets will be different than the other(s), so you&#8217;ll need to think through how to distinguish between them, in order to respond to that interaction appropriately.

I faced such a scenario in a recent project, and I thought I&#8217;d share my solution. Check out my [GitHub example][1] to dive in if you prefer learning by exploration!

### Using UIView Tags

Essentially, I chose to make use of the <span class="lang:swift decode:true  crayon-inline " >tag</span> property, which all UIView subclasses inherit. The [UIView Class Reference documentation specifies][2] that the <span class="lang:swift decode:true  crayon-inline " >tag</span> property can be used to identify the view at runtime:

> You can set the value of this tag and use that value to identify the view later.

### Example

Here&#8217;s a quick example showing the setting of this property so that the action sheet can be differentiated when it comes time to handle the user&#8217;s choice:

<pre class="lang:swift decode:true " title="Set tag property" >let actionSheet1 = UIActionSheet()
        actionSheet1.tag = 0
        // set other properties, such as delegate, as well as buttons...
        
        let actionSheet2 = UIActionSheet()
        actionSheet2.tag = 1
        // set other properties, such as delegate, as well as buttons...</pre>

### Better Solution in Swift?

Simple enough, right? Here&#8217;s my only problem with the above implementation if I&#8217;m using Swift: We have language features available to us that allow us to avoid setting the tag property to the integer value in-line like I did in this code snippet.

Here, instead of assigning in-line, I&#8217;m going to refactor and employ a Swift enumeration to help _name_ the tag. Underneath, there will still be integers involved, but my goal in using an enumeration is two-fold:

  * Identify the action sheet in code with a name. This should help my code be more coherent and readable.
  * Encapsulate a single source of truth for the tag values and avoid &#8220;magic integers&#8221; in my code. While the integers assigned to the tags can be arbitrary, if they ever _do_ need to be changed, I change the enumeration, rather than changing each place where the tag is set or checked to perform branching logic.

The arguments are fundamentally the same as those I made when I [wrote about replacing magic strings in Swift][3] and implement precisely the same strategy.

### Refactored Example

The refactored version of the code snippet previously presented could look like this, then:

<pre class="lang:swift decode:true " title="Set tag property with Enumeration Value" >enum ActionSheetTag: Int {
            // Integer values will be implicitly supplied; you could optionally set your own values
            case ActionSheet1
            case ActionSheet2
        }
        
        let actionSheet1 = UIActionSheet()
        actionSheet1.tag = ActionSheetTag.ActionSheet1.toRaw()
        // set other properties, such as delegate, as well as buttons...
        
        let actionSheet2 = UIActionSheet()
        actionSheet2.tag = ActionSheetTag.ActionSheet2.toRaw()
        // set other properties, such as delegate, as well as buttons...</pre>

It&#8217;s worth noting that rather than using an enumeration, I could have chosen to define a couple of constants at a scope visible to both my setting of the tag, and the conditional logic I&#8217;d use in my UIActionSheetDelegate callback. The end goal and result would be the same: Clarity, achieved by assigning _names_ to the tags, and the avoidance of &#8220;magic integers&#8221; appearing in my code.

### Wrapping Up &#8211; UIActionSheetDelegate Implementation

To see how to perform the conditional logic needed in the UIActionSheetDelegate callback method, take a look at this final code snippet:

<pre class="lang:swift decode:true " title="UIActionSheetDelegate" >func actionSheet(actionSheet: UIActionSheet, clickedButtonAtIndex buttonIndex: Int) {
        if let tag = ActionSheetTag.fromRaw(actionSheet.tag) {
            switch tag {
            case .ActionSheet1:
                handleActionSheet1Interaction() // Function definition omitted for brevity, but ideally you'd implement a function to do something in response to the user's interaction with ActionSheet 1
            case .ActionSheet2:
                handleActionSheet2Interaction() // // Function definition omitted for brevity, but ideally you'd implement a function to do something in response to the user's interaction with ActionSheet 2
            default:
                println("Unknown action sheet.")
            }
        }
    }</pre>

### Summary

I&#8217;ve done it before, but by using Swift enumerations again in a new context, I was able to provide better clarity to the intention of my code when I had multiple UIActionSheet instances that I needed to handle in a single view controller. In addition to this clarity, I also encapsulated a single source of truth for identifying my UIActionSheet instances, rather than placing &#8220;magic integers&#8221; throughout my code. Have a look at (and play with) [the example I&#8217;ve put up on GitHub][1] for further study and improvement!

<div class="related-posts">
  You might also enjoy</p> 
  
  <ul>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/09/02/replace-magic-strings-with-enumerations-in-swift/" title="Replace Magic Strings with Enumerations in Swift">Replace Magic Strings with Enumerations in Swift</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/10/01/swift-alternative-to-objective-c-macros/" title="Swift Alternative to Objective-C Macros">Swift Alternative to Objective-C Macros</a>
    </li>
  </ul>
</div>

 [1]: https://github.com/andrewcbancroft/DistinguishingActionSheetsExample "GitHub Example"
 [2]: https://developer.apple.com/library/iOS//documentation/UIKit/Reference/UIView_Class/index.html#//apple_ref/occ/instp/UIView/tag "UIView Class Reference - Tag Property"
 [3]: http://www.andrewcbancroft.com/2014/09/02/replace-magic-strings-with-enumerations-in-swift/ "Replace Magic Strings with Enumerations in Swift"