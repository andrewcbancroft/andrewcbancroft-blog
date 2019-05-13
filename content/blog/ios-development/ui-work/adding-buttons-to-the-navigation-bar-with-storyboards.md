---
title: Adding Buttons to the Navigation Bar with Storyboards
author: Andrew
type: blog
date: 2016-04-14T18:20:41+00:00
aliases:
  - /2016/04/14/adding-buttons-to-the-navigation-bar-with-storyboards/
dsq_thread_id:
  - "4747275624"
categories:
  - Swift
tags:
  - Storyboard
  - Swift
  - UINavigationController

---
<small>Updated on March 20, 2017 – Xcode 8 & Swift 3</small>

If you're having trouble figuring out how to add buttons to the navigation bar in your Storyboard-based iOS app, my goal in this article is to help you through the process. Knowing what to click and where to drag to get things wired up isn't entirely intuitive, so I want to be of help if I can.

Lots of StackOverflow posts point us to just adding the buttons in code, but for those who lean toward trying to do as much in the Storyboard designer as possible, this approach feels out of place.

The example I'm outlining here is done solely in the Storyboard.


<a name="example-scenario" class="jump-target"></a>

# Example scenario

The scenario is as follows:

  * We have a main screen with an add button in the top right of the navigation bar
  * Pressing Add will display a modal screen with two buttons in the navigation bar: Cancel, and Save

**The Goal**: Use only the Storyboard to add the &#8216;Add' button, and the Cancel and Save buttons to the navigation bar. The end result will be something like this:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/navigation-bar-buttons-demo.gif" alt="Navigation bar buttons demo" width="470" height="849" class="alignnone size-full wp-image-12753" />][1]

An example git repository has been created for this walk-through over at GitHub:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/StoryboardNavigationControllerExamples" title="Storyboard Navigation Controller Examples">Storyboard Navigation Controller Example</a>
    </li>
  </ul>
</div>

<a name="main-scene-setup" class="jump-target"></a>

# Main Storyboard scene setup

The very first thing you need to do in order to get the add button to show up in the navigation bar is to embed your view controller in a navigation controller.

Select your view controller and choose Editor > Embed In > Navigation Controller:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedInNavigationController-1024x560.png" alt="Embed in Navigation Controller" width="1024" height="560" class="alignnone size-large wp-image-12756" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedInNavigationController-1024x560.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedInNavigationController-300x164.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedInNavigationController.png 1043w" sizes="(max-width: 1024px) 100vw, 1024px" />][2]

Next, you need to search for a Bar Button Item from the Object Library in the Utilities Pane. Once you find it in the list, drag one up to the upper-right of the navigation bar:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/BarButtonItemToNavBar1-1024x788.png" alt="Bar Button Item to Navigation Bar" width="1024" height="788" class="alignnone size-large wp-image-12760" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/BarButtonItemToNavBar1-1024x788.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/BarButtonItemToNavBar1-300x231.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/BarButtonItemToNavBar1.png 1064w" sizes="(max-width: 1024px) 100vw, 1024px" />][3]

To turn it from an "Item&#8221; button into a "+&#8221; button, you need to adjust the Bar Button Item's attributes. Click on the button, either in the navigation bar itself or on the document outline for the Storyboard, and choose the Attributes Inspector for the control.

Then change the System Item property from "Custom&#8221; to "Add&#8221;:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/ChangeBarButtonItemAttributes-1024x292.png" alt="Change Bar Button Item Attributes" width="1024" height="292" class="alignnone size-large wp-image-12763" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/ChangeBarButtonItemAttributes-1024x292.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/ChangeBarButtonItemAttributes-300x86.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/ChangeBarButtonItemAttributes.png 1463w" sizes="(max-width: 1024px) 100vw, 1024px" />][4]

That's all there is to setting up that first scene. You'll wire up the add button to modally show the "Add&#8221; scene in the next section.

<a name="add-scene-setup" class="jump-target"></a>

# Add Storyboard scene setup

Next up, you need an "Add&#8221; scene. For that, another View Controller is required. Drag out a new View Controller onto the Storyboard design surface. While you're at it, go ahead and create a new `AddScreenViewController` class:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/NewVC-1024x703.png" alt="New View Controller" width="1024" height="703" class="alignnone size-large wp-image-12765" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/NewVC-1024x703.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/NewVC-300x206.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/NewVC.png 1158w" sizes="(max-width: 1024px) 100vw, 1024px" />][5]

Once you've created a new `AddScreenViewController` class from the File > New > File dialog, make sure you've wired it up appropriately:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/AddScreenVCMapped.png" alt="Add Screen View Controller Mapped" width="935" height="324" class="alignnone size-full wp-image-12767" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/AddScreenVCMapped.png 935w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/AddScreenVCMapped-300x104.png 300w" sizes="(max-width: 935px) 100vw, 935px" />][6]

Now, to get this "Add&#8221; screen to show modally, you need to control + drag from the "plus (+)&#8221; button on the first view controller, over to the new AddScreenViewController you just dragged onto the Storyboard. Select "Present Modally&#8221; from the popover:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/PresentModally.png" alt="Present Add Screen Modally" width="831" height="682" class="alignnone size-full wp-image-12768" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/PresentModally.png 831w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/PresentModally-300x246.png 300w" sizes="(max-width: 831px) 100vw, 831px" />][7]

Now, the problem you'll run into at this point if you run the app is that, while tapping the &#8216;Add' (+) button does in fact present the Add screen modally, 1) There's no way to dismiss the modal controller to go back to the main screen, and 2) There's no navigation bar to add buttons to!

So, the trick to get a navigation bar in place so that you can add our &#8216;Cancel' and &#8216;Save' buttons is to **embed the Add Screen View Controller in&#8230; you guessed it&#8230; a Navigation Controller**:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedAddScreen-1024x774.png" alt="Embed Add View Controller in Navigation Controller" width="1024" height="774" class="alignnone size-large wp-image-12770" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedAddScreen-1024x774.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedAddScreen-300x227.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedAddScreen.png 1047w" sizes="(max-width: 1024px) 100vw, 1024px" />][8]

Once this is done, your storyboard should look something like this:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/OverviewOfSetup-1024x312.png" alt="Storyboard Setup Overview" width="1024" height="312" class="alignnone size-large wp-image-12771" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/OverviewOfSetup-1024x312.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/OverviewOfSetup-300x91.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/OverviewOfSetup.png 1450w" sizes="(max-width: 1024px) 100vw, 1024px" />][9]

Now all that's left to do is to drag two Bar Button Items up to the navigation bar, just like we did for the "Plus&#8221; (+) button on the main screen:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/DragTwoBarButtonItems1-1024x847.png" alt="Drag Two Bar Button Items to Navigation Bar" width="1024" height="847" class="alignnone size-large wp-image-12774" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/DragTwoBarButtonItems1-1024x847.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/DragTwoBarButtonItems1-300x248.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/DragTwoBarButtonItems1.png 1113w" sizes="(max-width: 1024px) 100vw, 1024px" />][10]

Changing each of their System Item properties in the Attribute Inspector, just like we did before, will give them their "Cancel&#8221; and "Save&#8221; appearance:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/ChangeSystemItemProperties.png" alt="Change Bar Button Item System Item property to Cancel and Save" width="954" height="362" class="alignnone size-full wp-image-12775" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/04/ChangeSystemItemProperties.png 954w, https://www.andrewcbancroft.com/wp-content/uploads/2016/04/ChangeSystemItemProperties-300x114.png 300w" sizes="(max-width: 954px) 100vw, 954px" />][11]

If you control + drag the &#8216;Cancel' and &#8216;Save' buttons from the Storyboard scene to the .swift code file, you'll be able to wire up IBActions to dismiss the view controller and return to the main screen. I won't explain that step here, since the goal was to show you how to add the buttons themselves, but the [example project on GitHub][12] has the view controller dismissal implemented if you care to review it.

# Wrapping up

That's it! Buttons in the navigation bar, all done inside the Storyboard.

Hopefully this quick walk-through removes any stumbling blocks you might have in designing your Storyboard-based app with navigation controllers.

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/navigation-bar-buttons-demo.gif
 [2]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedInNavigationController.png
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/BarButtonItemToNavBar1.png
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/ChangeBarButtonItemAttributes.png
 [5]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/NewVC.png
 [6]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/AddScreenVCMapped.png
 [7]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/PresentModally.png
 [8]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/EmbedAddScreen.png
 [9]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/OverviewOfSetup.png
 [10]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/DragTwoBarButtonItems1.png
 [11]: https://www.andrewcbancroft.com/wp-content/uploads/2016/04/ChangeSystemItemProperties.png
 [12]: https://github.com/andrewcbancroft/StoryboardNavigationControllerExamples