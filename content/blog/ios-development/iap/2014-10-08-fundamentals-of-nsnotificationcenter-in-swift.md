---
title: Fundamentals of NSNotificationCenter in Swift
author: Andrew
type: blog
date: 2014-10-08T18:27:47+00:00
url: /2014/10/08/fundamentals-of-nsnotificationcenter-in-swift/
dsq_thread_id:
  - "3096832645"
categories:
  - iOS / Mac
  - Swift
tags:
  - NSNotificationCenter
  - Swift
  - Tutorial
  - Walkthrough

---
<small>Updated on September 19, 2016 &#8211; Xcode 8 & Swift 3.0</small>

The goal of this post is to help you grasp the fundamentals of using `NSNotificationCenter` in your Swift iOS app. The topic isn&#8217;t necessarily new, and there&#8217;s no difference except syntax between Objective-C and Swift implementations involving `NSNotificationCenter`. Even still, I&#8217;m hoping to add to the understanding of this useful tool by giving a fully-working example on GitHub (<a title="GitHub - Swift NSNotificationCenter Example" href="https://github.com/andrewcbancroft/SwiftNSNotificationCenter/tree/swift-2.3" target="_blank">Swift 2.3</a> and <a title="GitHub - Swift NSNotificationCenter Example" href="https://github.com/andrewcbancroft/SwiftNSNotificationCenter" target="_blank">Swift 3.0</a>), and by sharing the insight that&#8217;s clicked in my own brain as I explain the example.

**Note:** Code in the main article below is written in Swift 3.0, but code examples for Swift 2.3 are found in the [example project][1].

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#what-is-it">First things first: What is this thing?</a>
    </li>
    <li>
      <a href="#should-i-use-it">Should I use it?</a>
    </li>
    <li>
      <a href="#basic-workflow">Basic Workflow</a>
    </li>
    <li>
      <a href="#visualize">Visualizing NSNotificationCenter by Example</a>
    </li>
    <ul>
      <li>
        <a href="#steps1-2">Steps 1 and 2</a>
      </li>
      <li>
        <a href="#steps3-4">Steps 3 and 4</a>
      </li>
    </ul>
    
    <li>
      <a href="#remove-observer">Removing an observer</a>
    </li>
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="what-is-it" class="jump-target"></a>

### First things first: What _is_ this thing?

When I first heard `NSNotificationCenter`, I thought &#8220;push notifications&#8221;. However, `NSNotificationCenter` has nothing to do with sending or receiving push notifications in iOS. Rather, it is a communication tool internal to your app. It provides a way for one instance of a class/struct to notify one or more _other_ class/struct instances about something. The goal in doing this is to enable those 1+ other class or struct instances to take appropriate action based the communication they receive. An common analogy comes to mind: think &#8220;radio tower&#8221;. `NSNotificationCenter` is the central hub that acts as a _broadcaster_ of notifications. If that still seems vague, hang tight &#8211; seeing the example below should help it all come together for you.

<a name="should-i-use-it" class="jump-target"></a>

### Should I use it?

Before diving into the basic workflow, it&#8217;s worth asking, &#8220;Should I use `NSNotificationCenter`, or is there some other option that&#8217;s more appropriate for my app&#8217;s internal communication needs?&#8221;

It is often the case that there is more than one way to solve a problem in software development, and it&#8217;s no different with `NSNotificationCenter`. There is more than one way to accomplish instance-to-instance communication at run-time. I&#8217;ve written about two such forms of communication in my post titled [NSNotificationCenter vs Delegation – An Analysis][2]. It may be worth reading up on, just to make sure you&#8217;re using the right tool for the right kind of communication.

<a name="basic-workflow" class="jump-target"></a>

### Basic Workflow

`NSNotificationCenter.default` is at the center of it all when it comes to this discussion.

The basic workflow of using `NSNotificationCenter` goes something like this:

  1. Since \`NSNotificationCenter\` is in the business of broadcasting notifications, the first thing to do is to specify a way to uniquely identify a notification. This is most easily accomplished by defining a constant string value (using \`let\` syntax in Swift) at a globally-visible scope. The string constant you define here will serve as a &#8220;notification key&#8221;. If you have several notification keys that you need to define, perhaps creating a new .swift file called &#8220;NSNotificationCenterKeys.swift&#8221; is a clean way to do this.
  2. Steps 2 and 3 of the workflow go hand-in-hand. Without implementing the one, implementing the other doesn&#8217;t make much sense&#8230; Step 2 is to _post_ a notification to \`NSNotificationCenter.default\` identified by the key that was created in step 1. In radio terms, the class or struct instance desiring to post a notification asks the default notification center to broadcast the notification key defined in step 1&#8230; this class or struct instance chooses the right situations to request that the notification key be sent out based on business logic specific to the project&#8217;s requirements.
  3. Step 3 is to set up 1+ class or struct instances to be _listeners_, or more properly, _observers_ of a particular notification. Such an observer will be able to tell that it&#8217;s &#8220;heard&#8221; the notification, because it will be &#8220;listening for&#8221; a notification that uses the same key that was created in step 1, which is the key used in step 2 to _post_ the notification. In radio terms, the listener is tuned in to the default notification center&#8217;s station that&#8217;s identified by that special key defined in step 1 and posted in step 2. So you see now why steps 2 and 3 go hand-in-hand. With no posts to the notification center on that station, tuning in will do no good. Likewise, posting a notification but having no listeners accomplishes nothing.
  4. Finally, what should the observing instance _do_ once it&#8217;s detected the notification? Well, when signing up to be an observer, the instance must also specify the name of a function that will be called upon receipt of the notification it&#8217;s listening for. Whatever action or routine is appropriate to perform at that time is what that function&#8217;s implementation should contain.

<a name="visualize" class="jump-target"></a>

### Visualizing NSNotificationCenter by Example

If you&#8217;re like me, you need less talk and more example, so I&#8217;ve created a simple XCode project that you can grab over at GitHub (<a title="GitHub - Swift NSNotificationCenter Example" href="https://github.com/andrewcbancroft/SwiftNSNotificationCenter" target="_blank">Swift 2.3</a> and <a title="GitHub - Swift NSNotificationCenter Example" href="https://github.com/andrewcbancroft/SwiftNSNotificationCenter/tree/swift-3.0" target="_blank">Swift 3.0</a>). Running the project will allow you to click through a series of tabs in a tab view controller, post a notification, and see the results. It looks much like this:

[<img class="size-full wp-image-5461 aligncenter" src="https://www.andrewcbancroft.com/wp-content/uploads/2014/10/NSNotificationCenterExample.gif" alt="NS Notification Center Example" width="356" height="636" />][3]

Working back through the basic workflow with this example you can find the following key aspects of implementing a `NSNotificationCenter` solution (lines of code to pay special attention to will be highlighted).

<a name="steps1-2" class="jump-target"></a>

#### Steps 1 and 2:

I&#8217;ve chosen my `FirstViewController` class to be the one that defines the global constant with a unique notification key and tells the default notification center to post that notification when the &#8220;Notify!&#8221; button is tapped:

<pre class="lang:swift mark:2,13-15 decode:true" title="FirstViewController.swift">// 1. Globally define a "special notification key" constant that can be broadcast / tuned in to...
let mySpecialNotificationKey = "com.andrewcbancroft.specialNotificationKey"

class FirstViewController: UIViewController {
    @IBOutlet weak var sentNotificationLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        NotificationCenter.default.addObserver(self, selector: #selector(FirstViewController.updateNotificationSentLabel), name: NSNotification.Name(rawValue: mySpecialNotificationKey), object: nil)
    }

    // 2. Post notification using "special notification key"
    @IBAction func notify() {
        NotificationCenter.default.post(name: Notification.Name(rawValue: mySpecialNotificationKey), object: self)
    }
    
    func updateNotificationSentLabel() {
        self.sentNotificationLabel.text = "Notification sent!"
    }
}
</pre>

<a name="steps3-4" class="jump-target"></a>

#### Steps 3 and 4:

Both of these steps are implemented in very similar ways in my `SecondViewController` and `ThirdViewController` classes. The code should speak for itself:

<pre class="lang:swift mark:8,13-15,24,27-29 decode:true" title="Observer View Controllers">class SecondViewController: UIViewController {
    @IBOutlet weak var notificationLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // 3.  Observe (listen for) "special notification key"
        NotificationCenter.default.addObserver(self, selector: #selector(SecondViewController.actOnSpecialNotification), name: NSNotification.Name(rawValue: mySpecialNotificationKey), object: nil)
    }

    // 4.  Implement function to act on that notification
    // The name of this function must match the selector argument you specified when you called addObserver()
    func actOnSpecialNotification() {
        self.notificationLabel.text = "I heard the notification!"
    }
}


class ThirdViewController: UIViewController {
    @IBOutlet weak var notificationLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        NotificationCenter.default.addObserver(self, selector: #selector(ThirdViewController.actOnSpecialNotification), name: NSNotification.Name(rawValue: mySpecialNotificationKey), object: nil)
    }
    
    func actOnSpecialNotification() {
        self.notificationLabel.text = "I heard the notification, too!"
    }
}</pre>

Finally, to reiterate the explanation in visual form and for easy reference, I&#8217;ve annotated a screen shot taken from the project&#8217;s code:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2014/10/NSNotificationCenterExplanation_Swift3-1024x825.png" alt="NSNotificationCenter Explanation" width="1024" height="825" class="alignnone size-large wp-image-13039" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/10/NSNotificationCenterExplanation_Swift3-1024x825.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/10/NSNotificationCenterExplanation_Swift3-300x242.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/10/NSNotificationCenterExplanation_Swift3.png 1100w" sizes="(max-width: 1024px) 100vw, 1024px" />][4]

<a name="remove-observer" class="jump-target"></a>

### Removing an observer

One final requirement for working with `NSNotificationCenter` is to remove an observer when it no longer needs to listen for notifications. When might this situation arise?

  * When the observer is no longer referenced and thus deallocated from memory, it should tell the default notification center that it can be removed
  * When some condition occurs in your application that renders it no longer relevant for an instance to listen for notifications

The first situation is the most common, and is for sure the scenario that we want to protect against, so that the default notification center doesn&#8217;t continue to manage observers that are no longer capable of actively listening. To satisfy the requirement of removing an observer when an instance is deallocated, we could provide something like the following `deinit` method:

<pre class="lang:swift mark:2 decode:true " title="Removing an Observer" >deinit {
    NSNotificationCenter.default.removeObserver(self)
}</pre>

For the second bullet point, you can simply write the same line of code that&#8217;s highlighted in the above snippet, wherever it makes sense for you to tell the default notification center when it&#8217;s appropriate to stop sending messages to the instance in question.

### Summary

`NSNotificationCenter` is particularly useful when there are multiple class or struct instances that need to take action based on something that happens elsewhere in your application. For this type of scenario, `NSNotificationCenter` can be a great tool to wield as you develop apps in Swift for iOS.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/02/05/nsnotificationcenter-vs-delegation-analysis/" title="NSNotificationCenter vs Delegation – An Analysis">NSNotificationCenter vs Delegation – An Analysis</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://github.com/andrewcbancroft/SwiftNSNotificationCenter/tree/swift-2.3
 [2]: https://www.andrewcbancroft.com/2015/02/05/nsnotificationcenter-vs-delegation-analysis/
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2014/10/NSNotificationCenterExample.gif
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2014/10/NSNotificationCenterExplanation_Swift3.png