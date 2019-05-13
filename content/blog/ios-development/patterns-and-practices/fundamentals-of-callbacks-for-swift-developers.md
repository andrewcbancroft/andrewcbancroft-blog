---
title: Fundamentals of Callbacks for Swift Developers
author: Andrew
type: blog
date: 2016-02-15T18:21:33+00:00
aliases:
  - /2016/02/15/fundamentals-of-callbacks-for-swift-developers/
dsq_thread_id:
  - "4581936498"
categories:
  - Swift
tags:
  - Callbacks
  - Swift

---
<small>Updated on October 12, 2016 – Swift 3.0</small>

Callbacks: What are they? How do they work? What are they used for in practice?

My goal in this article is to provide answers to these questions so that you have a foundational understanding of this common programming pattern in iOS development.



<a name="what-are-callbacks" class="jump-target"></a>

### What are callbacks?

Let's approach the definition from a "big picture&#8221; scenario:

When we're building software, we're either _using_ APIs, or _building_ APIs, are we not? We're either _using_ code that "hooks into&#8221; what other developers have designed and made available to us, or we're _creating_ code that other code will "hook into&#8221; and interact with, even if the "other code&#8221; is written by us in our own app.

<a name="design-api-callbacks" class="jump-target"></a>

#### Learn by example: Designing an API for callbacks

Since this is the case, let's put on the "API Designer&#8221; hat for a moment and suppose that we're working to create a hypothetical Type called an `ImageSketcher`. One of the functions of `ImageSketcher` is called `sketch()` (parameters omitted for the moment). It will allow developers to pass it an image resource, such as a JPEG or a PNG, as one of its arguments. The function will then proceed to generate an animated sketch of that PNG for the user to view.

In order to do the work of generating the animated sketch, `sketch()` needs to do a lot of crunching. I have no idea what it'd take to do this in real life, honestly – let's just work on the premise that it'll take a few seconds to generate the animation so the end-user can watch it when it's finished.

In situations like this, it'd be nice to design `ImageSketcher` where the start and end of the process are decoupled:

Pass off the image. Let it do its thing to generate the animation. When it's finished, "hook back in&#8221; and respond to the knowledge that the animation generation is complete. At that point, we could ask the end-user, "Hey, your sketch is done! Want to watch it now?&#8221;

This particular example centers on a strategy that uses "asynchronous programming&#8221; techniques. It's often done to boost app performance and/or responsiveness.

During that middle part where we're "disconnected&#8221; from the `ImageSketcher's` `sketch()` function, control of the app wouldn't be tied up. Folks could continue to interact with the app.

From a developer's point of view, he/she can program against the API by calling the function, knowing that at [some unknown point in the future], it will finish, **and that he/she will have the opportunity at that time to "hook back in&#8221; and respond to that completion event**.

That last bit is critical. Giving other developers the opportunity to re-insert themselves with custom application logic when the asynchronous task ends is very important as an API designer.

Exactly what you as an API designer communicate back to the caller of your API is up to you, but put yourself in the _client_ developer's shoes for a moment:

Wouldn't it be nice to know if something went wrong, or if data (the completed animation, for example) came out of that `sketch()'s` work? That's exactly the kind of information that we'd expect an API designer would provide us with this completion event.

So&#8230; just what are the options could we give callers of this method to "hook-in&#8221; and know that the work is done?

<a name="hook-in-options" class="jump-target"></a>

##### "Hook-in&#8221; options

In scenarios like this, Swift developers have about 3 options to choose from:

  * Use [NSNotificationCenter][1] to alert "subscribers&#8221; that the `sketch()` function has completed its job. I wrote about this option in [Fundamentals of NSNotificationCenter in Swift][1]</p> 
  * Use the [delegate pattern][2] to create a contract between the `ImageSketcher` and the caller of the `sketch()` function. When `sketch()` has completed its task, the appropriate _delegate_ method will be called. I wrote about this works in [How Delegation Works – A Swift Developer’s Guide][2]

  * **Use a callback**

So callbacks are used as another way for one piece of code to communicate with another piece of code somewhere else in the app.

<a name="how-callbacks-work" class="jump-target"></a>

### How do callbacks work?

Here is a brief overview of the communication interaction using our hypothetical `ImageSketcher` as a working example:

1) An API designer has created the `sketch(image:completion:)` function, and has chosen to accept a completion "callback&#8221; as the means of communicating the fact that the animation has been generated and is ready to show the end-user.

2) **Data**, such as the completed sketch animation instance will be delivered through the completion callback's parameter(s). The `completion` parameter of our `sketch()` function will have a signature that client developers must adhere to in order to facilitate the delivery of that data.

3) A client developer writes up a routine (a function or closure) and passes it as the completion parameter's argument. The function/closure that he/she writes will have a list of parameters that matches up to what the API designer required.

4) When `sketch()` is finished generating the sketch, the designer of the API has programmed _his/her function_ to call the callback that _you pass in_. The API designer will pass along any data that was generated as arguments to the callback function's parameters.

5) The client developer's callback logic executes.

Callbacks are functions that often take the form of a [closure][3] (basically an in-line function with no name that's passed as a parameter to _another_ function), but they could technically be a named function.

Perhaps it's easiest to see in code itself. Here's a skeleton view of what that looks like:

```swift
// API Designer World
struct SketchAnimation {
    // represents some fully-generated animation that's ready to play by the end user
}

struct ImageSketcher {
    func sketch(image: UIImage, completion: (_ sketchAnimation: SketchAnimation) -> Void) {
        // do some crunching to create the SketchAnimation instance...
        let animation = SketchAnimation()
        
        // invoke the completion callback
        // pass along the completed sketch animation instance
        completion(animation)
    }
}

// ---------------------------------------------------------------------

// Client Developer World
class MainViewController: UIViewController {
    // ...
    
    // end-user interacts with the app somehow to create an image sketch animation
    // when they do, this function is called...
    func createSketchAnimation(imageToSketch: UIImage) {
        let sketcher = ImageSketcher()
        
        sketcher.sketch(image: imageToSketch, completion: {(animation: SketchAnimation) -> Void in
            // This is the callback.  It's a closure, passed as the argument to the sketch function's completion parameter
            
            // Ask the end-user if they'd like to view the completed animation now...
            // You as a develoepr have access to the completed animation through the animation parameter to this closure
        })
    }
    
    // ...
}
```

You'll notice a couple of things&#8230;

**First**, I've separated the two "worlds&#8221; that exist: "API Designer World&#8221; and "Client Developer World&#8221;. Hopefully seeing both in action can give you the most complete picture of what's going on with callbacks.

In "API Designer World&#8221;, we've got the `ImageSketcher` and its implementation.

In "Client Developer World&#8221;, we've got someone _using_ an instance of `ImageSketcher`.

**Second**, notice the interaction. As an API designer, I was thinking, "Hey, when my sketching process is complete, I want to let the caller know that it's finished and hand them the completed `SketchAnimation` instance. To do that, I'll need them to pass me a function that I can hand it off to via a parameter&#8221;.

As a client developer, I'm thinking, "Okay, I'm going to call `sketch()`, but how am I going to know when it's done and how will I get the animation? Oh! I see – I need to give it a completion closure (a callback), and they'll hand me the completed `SketchAnimation` instance through my closure's parameter. Sweet!&#8221;

I'm hoping the "thinking out loud&#8221; here helps you piece it together.

<a name="examples-ios-sdk" class="jump-target"></a>

### Examples from the iOS SDK

So how about a few _real_ examples, say, from the iOS SDK. Where are callbacks used there?

<a name="uialertcontroller" class="jump-target"></a>

#### UIAlertController

A really simple example of callbacks being used in the wild is when we work with [`UIAlertControllers`][4]. Take a look at this example:

```swift
let alertController = UIAlertController(title: "My Alert", message: "A Message", preferredStyle: UIAlertControllerStyle.alert)

let OKAction = UIAlertAction(title: "OK", style: UIAlertActionStyle.default, handler: {(action: UIAlertAction) -> Void in
    // Do something based on the user tapping this action button
    
    // Notice that we get an instance of the UIAlertAction that was tapped if we need it
})

alertController.addAction(OKAction)

self.present(alertController, animated: true, completion: nil)
// We could have provided a completion callback here, too,
// but we didn't need to respond to the view controller's presentation, so we passed nil
```

So the `UIAlertAction` is actually the thing that takes the callback (the `handler` parameter). There's also an example on a View Controller's `present()` function. Both are intended to communicate something back to the caller.

In the case of the `UIAlertAction`, the `handler` will be the logic to handle the user's tapping on that specific alert button.

In the case of the `present` call, Apple has given us the opportunity to "hook in&#8221; to the presentation event and know when it's complete, in case we need to perform additional logic at that moment.

<a name="urlsession" class="jump-target"></a>

#### URLSession

The world of HTTP is inherently asynchronous, so you'd expect to see some kind of pattern employed to deal with the "disconnectedness&#8221; of the start and finish of a process, such as making an HTTP request.

`URLSession` encapsulates certain HTTP actions, such as retrieving the contents of a URL, in instances called `URLSessionDataTask`. How does it communicate the fact that the HTTP request is complete, along with the data contained in the response? You guessed it: A callback.

Take a look at this function signature from the [Apple Developer Documentation on URLSession][5]:

```swift
func dataTask(with url: URL, 
              completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void) -> URLSessionDataTask
```

The `completionHandler` parameter of this function is the interface that the API designers have created for delivering the resulting payload of the HTTP request when it's finished and ready to hand off for further processing.

Client developers of this API will be expected to make the call to `dataTask(with:completionHandler:)` and supply it a completion callback to know when things are complete.

<a name="animations" class="jump-target"></a>

#### Animations

You'll see _all kinds_ of `completion` callbacks sprinkled throughout some of the simpler iOS animation APIs.

If you take a look at the following function signatures from the [Apple Developer Documentation on UIViews][6], you'll see the `completion` parameters to many of these functions:

```swift
transition(with:duration:options:animations:completion:)
transition(from:to:duration:options:completion:)
animateKeyframes(withDuration:delay:options:animations:completion:)
addKeyframe(withRelativeStartTime:relativeDuration:animations:)
perform(_:on:options:animations:completion:)
animate(withDuration:delay:usingSpringWithDamping:initialSpringVelocity:options:animations:completion:)
```

### Wrapping Up

Believe it or not, the usage of callbacks is one of the less-complicated ways of communicating between parts of code.

My goal in this article was to show all of the sides and perspectives and players to give you insight into how this communication takes place.

Now that the foundations are laid, it is my hope that you'll be able to more confidently use callbacks and know what's happening as you encounter them in your Swift code!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/03/26/what-is-delegation-a-swift-developers-guide/" title="What is Delegation? – A Swift Developer’s Guide">What is Delegation? – A Swift Developer’s Guide</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2015/04/08/how-delegation-works-a-swift-developer-guide/" title="How Delegation Works – A Swift Developer’s Guide">How Delegation Works – A Swift Developer’s Guide</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2014/10/08/fundamentals-of-nsnotificationcenter-in-swift/" title="Fundamentals of NSNotificationCenter in Swift">Fundamentals of NSNotificationCenter in Swift</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/2014/10/08/fundamentals-of-nsnotificationcenter-in-swift/
 [2]: https://www.andrewcbancroft.com/2015/04/08/how-delegation-works-a-swift-developer-guide/
 [3]: https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Closures.html#//apple_ref/doc/uid/TP40014097-CH11-ID94
 [4]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIAlertController_class/
 [5]: https://developer.apple.com/reference/foundation/urlsession/1410330-datatask
 [6]: https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIView_Class/#//apple_ref/occ/clm/UIView/animateWithDuration:animations: