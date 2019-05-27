---
title: Access Sub-Controllers from a UINavigationController in Swift
author: Andrew
type: blog
date: 2015-06-02T17:37:44+00:00
url: /2015/06/02/access-sub-controllers-from-a-uinavigationcontroller-in-swift/
dsq_thread_id:
  - "3815502904"
categories:
  - Swift
tags:
  - AppDelegate
  - Swift
  - UINavigationController

---
The sequence of accessing a `UINavigationController's` first child from within the `AppDelegate` or within `prepareForSegue(_:sender:)` always gets me. Here are a few quick snippets to help you and I quickly get up and running when working with navigation controllers in our Swift applications:

<a name="app-delegate" class="jump-target"></a>

### AppDelegate

Every iOS application has one root view controller that's presented when the app finishes its launch process. Suppose we're building a navigation controller-based app&#8230; that is, we're building an app where the first (root) view controller is a UINavigationController. In our Storyboard, we've set up a Scene with some UI controls with a view controller and some properties, and we've embedded that view controller in a navigation controller.

What if we want to set some of the view controller's properties after the app launches? How could we go about doing that?

I tend to always think of the "first view controller&#8221; as the first Scene in the Storyboard where I've set up UI components. To iOS, however, the _navigation controller_ is actually the first (or _root_) view controller.

When an app incorporates a navigation controller as its first (root) view controller, we end up needing to do a little digging into the view controller hierarchy to get access what we might perceive as the true "first view controller&#8221;.

<a name="dig-first-view-controller" class="jump-target"></a>

#### Digging for the first view controller

Here is a snippet of how to dig into the `UINavigationController's` view controller hierarchy to grab the first one and set some fictitious properties on it, all from within the `AppDelegate`:

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?


    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -&gt; Bool {
        // Override point for customization after application launch.
        
        let navigationController = window?.rootViewController as! UINavigationController
        let firstVC = navigationController.viewControllers[0] as! NameOfFirstViewController
        // set whatever properties you might want to set
        // such as an NSmanagedObjectContext reference

        return true
    }

    // ...
}
```

So the workflow goes like this:

  * Get the window's root view controller (which is the navigation controller in our case)
  * Get the navigation controller's first view controller from its array of view controllers (which is what I always think of as the "first&#8221; view controller)
  * Set whatever properties you need to set

You may be worried about the usage of implicitly unwrapped optionals in this snippet. I tend to avoid them wherever possible too, but I used them here because I reasoned that my navigation controller-based app _hinges_ on the fact that the root view controller of the application is a `UINavigationController`. Something so fundamental to the app warranted my usage of the implicitly unwrapped optionals, since changing the navigation paradigm of the app would probably break things anyway.

If you're not convinced by that line of reasoning, no worries – you can switch out some of the `!` operators for `?` operators and add in some `if-let` syntax to protect against encountering nil. For example:

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {

    // ...
    if let navigationController = window?.rootViewController as? UINavigationController {
        if let firstVC = navigationController.viewControllers[0] as? NameOfFirstViewController {
            firstVC.someProperty = someValue
        }
    }
    // ...
}
```

<a name="prepare-for-segue" class="jump-target"></a>

### Prepare for segue

What about in `prepareForSegue(_:sender:)`? When would this even be necessary?

Well, suppose that we have an app which segues _into_ a navigation controller. We may need to pass some data off the next view controller, but that "next view controller&#8221; is technically the navigation controller, not the controller where our properties are declared.

In similar fashion to the `AppDelegate` situation, we want to dig into the navigation controller's view controller hierarchy to access the first child so that we can pass the data along. Here's an example implementation:

```swift
public class ViewController: UIViewController {

    // ...
    override public func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        
        let destinationVC = segue.destinationViewController as! UINavigationController
        let nextViewController = destinationVC.viewControllers[0] as! SecondViewController
        
        nextViewController.someProperty = someValue
    }
    // ...
}
```

The only thing that really changes between the `AppDelegate` example and the `prepareForSegue` example is where we obtain the `UINavigationController` from. In `AppDelegate`, the navigation controller comes from the window's root view controller. In `prepareForSegue` it comes from the segue's destination view controller.

After that, though, the process for grabbing the first child of the navigation controller is the same.

### Wrapping up

Accessing a navigation controller's view controller hierarchy was just vague enough for me to write this little reference for myself, but I hope you benefited from it as well!

<a name="share" class="jump-target"></a>