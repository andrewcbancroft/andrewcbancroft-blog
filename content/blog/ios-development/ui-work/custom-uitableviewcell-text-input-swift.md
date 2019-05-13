---
title: Custom UITableViewCell for Text Input in Swift
author: Andrew
type: blog
date: 2015-02-12T13:00:50+00:00
aliases:
  - /2015/02/12/custom-uitableviewcell-text-input-swift/
dsq_thread_id:
  - "3509273318"
categories:
  - Swift
tags:
  - Swift
  - UITableView
  - UITableViewCell

---
The need to collect data via text input is a common in many applications. This walk-through showcases how to create a custom `UITableViewCell` for accepting text input within a `UITableView`.

<a name="tableview-data-entry" class="jump-target"></a>

### Table Views for Data Entry?

Table views provide nice, built-in styles that present a form-like view for collecting data from your users. They also have inherent scrolling capabilities. Finally, there is some handy keyboard handling, such as auto-scrolling to avoid covering up a data entry cell, or hiding the keyboard when the user scrolls the Table View. Both of those are challenging to get right if you were to do implement a data entry form some other way.

Many of Apple's own UIs utilize table views to collect data from the user (think Settings, Calendar, Reminders).

For those reasons, I think a table view is a really convenient choice for collecting data from a user.

<a name="step-by-step" class="jump-target"></a>

### Step by Step Walkthrough

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/CustomTextInputTableViewCell"title="Custom Text Input TableView Cell Example">Example Xcode Project</a>
    </li>
  </ul>
</div>

<a name="drag-tableview" class="jump-target"></a>

#### Drag a table view to Storyboard

Assuming that you have a View Controller already on the Storyboard design surface, drag a table view onto the Storyboard scene.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Edit_Post_‹_Andrew_Bancroft_—_WordPress_and_AddVerseControllerTests_swift-1024x569.png" alt="Drag Table View to Storyboard" width="1024" height="569" class="alignnone size-large wp-image-11324" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Edit_Post_‹_Andrew_Bancroft_—_WordPress_and_AddVerseControllerTests_swift-1024x569.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Edit_Post_‹_Andrew_Bancroft_—_WordPress_and_AddVerseControllerTests_swift-300x167.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][1]

<a name="data-source-delegate" class="jump-target"></a>

#### Wire up table view data source and delegate

For this step it's helpful to have the document outline pane visible. Selecting the Table View from the document outline and subsequently Control + Click + Dragging to the View Controller icon on the Storyboard scene will allow you to link the table view's dataSource and delegate properties to the View Controller.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Ctrl-Click-Drag-to-set-DataSource-and-Delegate-1024x507.png" alt="Ctrl+Click-Drag to set DataSource and Delegate" width="1024" height="507" class="alignnone size-large wp-image-11683" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Ctrl-Click-Drag-to-set-DataSource-and-Delegate-1024x507.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Ctrl-Click-Drag-to-set-DataSource-and-Delegate-300x148.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][2]

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Set-DataSource-and-Delegate-1024x508.png" alt="Set DataSource and Delegate" width="1024" height="508" class="alignnone size-large wp-image-11354" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Set-DataSource-and-Delegate-1024x508.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Set-DataSource-and-Delegate-300x149.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][3]  
Note that you'll need to perform the Control + Click + Drag maneuver twice to set both the dataSource and the delegate.

<a name="dismiss-keyboard" class="jump-target"></a>

#### Configure keyboard dismissal for table view

With the attributes inspector selected in the utilities pane, scroll down to the Keyboard option and set it to "Dismiss on drag&#8221;.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Configure-Keyboard-Dismissal1-1024x509.png" alt="Configure Keyboard Dismissal" width="1024" height="509" class="alignnone size-large wp-image-11357" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Configure-Keyboard-Dismissal1-1024x509.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Configure-Keyboard-Dismissal1-300x149.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][4]  
This can be helpful if you'd like the keyboard to automatically hide itself when the user scrolls the table view.

<a name="constraints" class="jump-target"></a>

#### Set constraints, increase prototype cells count

Use the document outline to set constraints. With the attributes inspector selected in the utilities pane, select "Dynamic Prototypes&#8221; for the Content property, and set the Prototype Count property to 1 (or more, depending on your needs).  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Set-Constraints-and-Prototype-Cells1-1024x508.png" alt="Set Constraints and Prototype Cells" width="1024" height="508" class="alignnone size-large wp-image-11352" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Set-Constraints-and-Prototype-Cells1-1024x508.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Set-Constraints-and-Prototype-Cells1-300x149.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]  
Configuring constraints on the table view will ensure that it displays properly on all device sizes and orientations.

In this particular example, there's only one kind of prototype cell that I want the table view to display. If I had multiple prototypes, I'd increase the prototype cells count to match the number of prototypes I had.

<a name="drag-text-field" class="jump-target"></a>

#### Drag text field to cell, increase text field width

Drag a text field into the cell's contents and use Xcode's blue guides to adjust the width so that it takes up the whole cell.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Main_storyboard_1-1024x622.png" alt="Drag Text Field to Cell" width="1024" height="622" class="alignnone size-large wp-image-11325" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Main_storyboard_1-1024x622.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Main_storyboard_1-300x182.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Main_storyboard_1.png 1488w" sizes="(max-width: 1024px) 100vw, 1024px" />][6]  
Now comes the customization of the prototype cell itself. Since we're designing it for text input, we'll use a text field as the contents of the table view cell prototype.

<a name="configure-text-field-constraints" class="jump-target"></a>

#### Configure Text Field Constraints and Border

Use the document outline to set constraints for the text field. With the text field selected, and the attributes inspector selected in the utilities pane, set the Border Style property to the style you prefer.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Configure-Text-Field-Constraints-and-Border-1024x508.png" alt="Configure Text Field Constraints and Border" width="1024" height="508" class="alignnone size-large wp-image-11350" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Configure-Text-Field-Constraints-and-Border-1024x508.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Configure-Text-Field-Constraints-and-Border-300x149.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][7]  
Configuring constraints on the text field will ensure that it displays properly on all device sizes and orientations.

Depending on your taste / needs, you can change the border style from rounded to none, or whichever other border style is most appealing for your app.

<a name="text-input-cell-class" class="jump-target"></a>

#### Create new TextInputTableViewCell class

Add a new .swift file named TextInputTableViewCell to your project. Create a new class in that file called `TextInputTableViewCell` which inherits from `UITableViewCell`.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_and_Main_storyboard-1024x567.png" alt="Create new class - TextInputTableViewCell" width="1024" height="567" class="alignnone size-large wp-image-11330" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_and_Main_storyboard-1024x567.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_and_Main_storyboard-300x166.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][8]

<a name="ib-outlet" class="jump-target"></a>

#### Create an IBOutlet between the text field and the TextInputTableViewCell class

Use the document outline to Control + Click + Drag and IBOutlet to the `TextInputTableViewCell` class.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Create-IBOutlet1-1024x512.png" alt="Create IBOutlet" width="1024" height="512" class="alignnone size-large wp-image-11684" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Create-IBOutlet1-1024x512.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Create-IBOutlet1-300x150.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][9]

<a name="implement-class" class="jump-target"></a>

#### Implement TextInputTableViewCell class

An example implementation with a function for configuring the text field's properties might look something like this:

```swift
import UIKit

public class TextInputTableViewCell: UITableViewCell {
    @IBOutlet weak var textField: UITextField!
    
    public func configure(#text: String?, placeholder: String) {
        textField.text = text
        textField.placeholder = placeholder
        
        textField.accessibilityValue = text
        textField.accessibilityLabel = placeholder
    }
}
```

<a name="storyboard-setup" class="jump-target"></a>

#### Change cell class in Storyboard to TextInputTableViewCell

Use the document outline to select the Table View Cell. With the identity inspector selected in the utilities pane, change the Class property to your TextInputTableViewCell class.  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Main_storyboard-1024x513.png" alt="Change Cell Class to TextInputCell" width="1024" height="513" class="alignnone size-large wp-image-11328" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Main_storyboard-1024x513.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Main_storyboard-300x150.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][10]

<a name="reuse-identifier" class="jump-target"></a>

#### Set reuse identifier

With the Table View Cell still selected in the document outline, select the attribute inspector in the utilities pane and change the Identifier property to "TextInputCell&#8221; (or some other string that's easily remembered).  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_2-1024x511.png" alt="Set Reuse Identifier" width="1024" height="511" class="alignnone size-large wp-image-11323" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_2-1024x511.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_2-300x150.png 300w" sizes="(max-width: 1024px) 100vw, 1024px" />][11]

<a name="implement-datasource-delegate" class="jump-target"></a>

#### Implement table view data source and delegate methods

In the View Controller, specify that it adopts the `UITableViewDataSource` and `UITableViewDelegate` protocols. Implement the appropriate protocol methods.  
I've written a [cheat sheet][12] for this, but I'll also provide the following sample implementation of the mai `ViewController` class:

```swift
import UIKit

public class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    public func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -&gt; Int {
        return 1 // Create 1 row as an example
    }
 
    public func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -&gt; UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("TextInputCell") as TextInputTableViewCell
        
        cell.configure(text: "", placeholder: "Enter some text!")
        return cell
    }
}
```

Lines 9 and 11 are of most importance. Notice that I'm dequeueing a TextInputCell, which is what I set the reuse identifier of my cell to be. I'm also casting the dequeued cell as a TextInputTableViewCell so that it can be configured (line 11)

<a name="run-in-simulator" class="jump-target"></a>

#### Run in simulator

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Simulator-Output.png" alt="Simulator Output" width="473" height="869" class="alignnone size-full wp-image-11365" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Simulator-Output.png 473w, https://www.andrewcbancroft.com/wp-content/uploads/2015/02/Simulator-Output-163x300.png 163w" sizes="(max-width: 473px) 100vw, 473px" />][13]

### Wrapping up

In this walkthrough, my goal was to show how to take advantage of a table view's inherent styles, scrolling capabilities, and keyboard handling to make form-like text input easier. We created a custom subclass of UITableViewCell to accomplish this task. Take a look at the [example published to GitHub][14] to dive in further and explore the walkthrough in more depth.

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Edit_Post_‹_Andrew_Bancroft_—_WordPress_and_AddVerseControllerTests_swift.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Ctrl-Click-Drag-to-set-DataSource-and-Delegate.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Set-DataSource-and-Delegate.png
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Configure-Keyboard-Dismissal1.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Set-Constraints-and-Prototype-Cells1.png
 [6]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Main_storyboard_1.png
 [7]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Configure-Text-Field-Constraints-and-Border.png
 [8]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_and_Main_storyboard.png
 [9]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Create-IBOutlet1.png
 [10]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_and_Main_storyboard.png
 [11]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Main_storyboard_—_Edited_2.png
 [12]: http://www.andrewcbancroft.com/2014/11/24/swift-uitableviewdatasource-cheat-sheet/
 [13]: http://www.andrewcbancroft.com/wp-content/uploads/2015/02/Simulator-Output.png
 [14]: https://github.com/andrewcbancroft/CustomTextInputTableViewCell