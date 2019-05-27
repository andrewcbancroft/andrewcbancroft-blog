---
title: Working with Unwind Segues Programmatically in Swift
author: Andrew
type: blog
date: 2015-12-18T18:22:55+00:00
url: /2015/12/18/working-with-unwind-segues-programmatically-in-swift/
dsq_thread_id:
  - "4415335596"
categories:
  - Swift
tags:
  - Swift
  - Unwind Segue

---
<small>Updated on September 20, 2016 – Xcode 8 & Swift 3.0</small>

Navigating between screens is a critical component to building iOS applications. The mechanism for navigation in Storyboard-based applications is the _segue_. Using segues, we can travel ahead to the next screen, which is extremely common. We can also travel _backward_ in the screen "navigation stack&#8221; by programming a special kind of segue called an _unwind_ segue.

Embedding a view controller inside a navigation controller gives us some built-in forward and backward navigation, so you may be asking, "What's the need for an unwind segue??&#8221;

Well, suppose that we need to programmatically _trigger_ the backward navigation, based on an interaction with something other than the default "back&#8221; button on the navigation bar. How would you do it? Yep – you've got it: by using an unwind segue.

This is a walk-through of how to work with unwind segues programmatically in Swift.

**Note:** Code in the main article below is written in Swift 3.0, but code examples for Swift 2.3 are found in the [example project][1].


<a name="example" class="jump-target"></a>

### Example

An example app called "Roasters on the Go&#8221; has been created for this walk-through to help give you some context. It's a mock mobile order system for purchasing green, un-roasted coffee beans (so that you can roast them yourself)!

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> RoasterOnTheGo Example Project (<a href="https://github.com/andrewcbancroft/RoasterOnTheGo/tree/swift-2.3" title="RoasterOnTheGo - Swift 2.3">Swift 2.3</a> | <a href="https://github.com/andrewcbancroft/RoasterOnTheGo/tree/master" title="RoasterOnTheGo - Swift 3.0">Swift 3.0</a>)
    </li>
  </ul>
</div>

  * We'll start at a list of coffees categorized by region
  * Tapping an coffee origin country will take you to the order screen
  * Pressing the &#8216;Order Now' button will simulate the placement of an order
  * **Tapping "OK&#8221; on the alert will trigger the unwind segue** (which is the goal of this walk-through)

Here's a sample of what the fake app does:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/12/demo.gif" alt="Unwind Segue Demo" width="366" height="663" class="alignnone size-full wp-image-12483" />][2]

The goal is to go back to the list of coffee origins after &#8216;OK' is pressed on the alert. Let's look at the steps to make this happen.

<a name="create-action" class="jump-target"></a>

### 1 – Create an unwindTo\___ IBAction

The first step is to create an IBAction that we can wire up the unwind segue to.

Supposing that you've got two view controller: The MenuViewController which lists out the menu of coffees to purchase, and the OrderViewController which allows your app users to buy that particular coffee.

If we're wanting to go _from_ OrderViewController _to_ MenuViewController, we need to _create the IBAction in the **MenuViewController**_:

```swift
class MenuViewController: UITableViewController {
    
    // ...
    
    @IBAction func unwindToMenu(segue: UIStoryboardSegue) {}
    
    // ...
}
```

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/12/01_unwind_action-1024x534.png" alt="Create an Unwind Action" width="1024" height="534" class="alignnone size-large wp-image-12474" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/12/01_unwind_action-1024x534.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/12/01_unwind_action-300x156.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/12/01_unwind_action.png 1218w" sizes="(max-width: 1024px) 100vw, 1024px" />][3]

Placing the IBAction code in the right spot is critical to the functioning of the unwind segue. In this example where we want to go from Order to Menu, if you place the IBAction in the OrderViewController, the Storyboard will let you wire it up just fine, but the transition back to the menu screen will never happen at runtime.

Therefore, it's important to remember: Place the "unwindTo\___&#8221; IBAction function in the view controller source file for the screen you're unwinding back to.

<a name="wire-unwind" class="jump-target"></a>

### 2 – Wire up the unwind segue

Next up is to wire connect the view controller to the unwind segue IBAction that we just created.

Here, you're going to be looking at the screen that you're going to unwind _from_. In the running example, this will be the Order View Controller's scene in the Storyboard.

To wire up the OrderViewController to its unwind segue, you need to right-click and drag (or control + drag) from the View Controller icon to the Exit icon in the Storyboard Scene:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/12/02_drag_to_create_segue-1024x542.png" alt="Drag to Create Segue" width="1024" height="542" class="alignnone size-large wp-image-12473" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/12/02_drag_to_create_segue-1024x542.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/12/02_drag_to_create_segue-300x159.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/12/02_drag_to_create_segue.png 1199w" sizes="(max-width: 1024px) 100vw, 1024px" />][4]

You'll be presented with list of IBActions to connect to. You'll choose the unwind segue action that was created in step 1:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/12/03_create_segue-1024x542.png" alt="Create Segue" width="1024" height="542" class="alignnone size-large wp-image-12472" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/12/03_create_segue-1024x542.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/12/03_create_segue-300x159.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/12/03_create_segue.png 1201w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]

<a name="identifier" class="jump-target"></a>

### 3 – Specify a segue identifier

For this step, you'll want to make sure that the Document Outline of the Storyboard is expanded. This will allow you to easily select the unwind segue in the outline, and specify its identifier in the Attributes Inspector of the Utilities Pane:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/12/04_specify_segue_id-1024x566.png" alt="Specify Segue Identifier" width="1024" height="566" class="alignnone size-large wp-image-12471" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/12/04_specify_segue_id-1024x566.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/12/04_specify_segue_id-300x166.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/12/04_specify_segue_id.png 1200w" sizes="(max-width: 1024px) 100vw, 1024px" />][6]

Since we want to take the user back to the menu when placing an order is finished, we'll give it the identifier of "unwindToMenu&#8221;.

<a name="trigger" class="jump-target"></a>

### 4 – Trigger unwind segue programmatically

The final step is to write a bit of code to trigger the unwind segue at the appropriate time.

In our example, we want to trigger it when the user taps on the &#8216;OK' button of the alert. Here's a snippet of code that will accomplish that task:

```swift
@IBAction func orderButtonTapped(_ sender: UIButton) {
    let alert = UIAlertController(title: "Order Placed!", message: "Thank you for your order.\nWe'll ship it to you soon!", preferredStyle: .alert)
    let OKAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: {
        (_)in
        self.performSegue(withIdentifier: "unwindToMenu", sender: self)
    })
    
    alert.addAction(OKAction)
    self.present(alert, animated: true, completion: nil)
}
```

### Wrapping up

Whenever you need to programmatically trigger backward navigation in your app, using an unwind segue can be a great feature to take advantage of. This walk-through took you step-by-step through working with unwind segues in Swift.

<a name="share" class="jump-target"></a>

 [1]: https://github.com/andrewcbancroft/RoasterOnTheGo/tree/swift-2.3
 [2]: https://www.andrewcbancroft.com/wp-content/uploads/2015/12/demo.gif
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2015/12/01_unwind_action.png
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2015/12/02_drag_to_create_segue.png
 [5]: https://www.andrewcbancroft.com/wp-content/uploads/2015/12/03_create_segue.png
 [6]: https://www.andrewcbancroft.com/wp-content/uploads/2015/12/04_specify_segue_id.png