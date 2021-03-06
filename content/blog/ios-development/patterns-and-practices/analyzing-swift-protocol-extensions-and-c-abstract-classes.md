---
title: 'Analyzing Swift Protocol Extensions and C# Abstract Classes'
author: Andrew
type: blog
date: 2015-08-07T03:52:25+00:00
url: /2015/08/06/analyzing-swift-protocol-extensions-and-c-abstract-classes/
dsq_thread_id:
  - "4010525374"
categories:
  - 'C#'
  - Swift
tags:
  - Abstract Class
  - Protocols
  - Swift
dispiosgettingstartedbadge: true
---
Being a C# developer by day and a Swift developer by night has me constantly thinking about the similarities and differences between these two languages. I genuinely enjoy programming with each, and I love it when I can take a strategy that works well in one language, and see where that might cross over to the other. One of the areas I've been pondering as of late is the idea of how Swift and C# compare in terms of protocol extensions and abstract classes.

Swift doesn't have the notion of [abstract classes][1] like C# does. However, it _does_ now have an amazingly powerful feature called protocol extensions, which were explained and demonstrated in the popular WWDC15 talk on [Protocol Oriented Programming][2]. Why am I comparing protocol extensions with C# abstract classes? What are the similarities? What are the differences? Which one do I like best? The analysis of and concluding answers to these questions is the goal of this article.

<a name="why" class="jump-target"></a>

### Why the comparison?

What got me thinking about this? Well, I was re-watching [Protocol Oriented Programming][2] the other day and was digesting some of the arguments for why protocols often serve as better abstractions than classes. When classes are used to model a generalized abstraction, the only way they do it is through inheritance. Subclasses of some other, more generalized, base class will automatically be able to behave the same and store the same state as that base class by virtue of inheritance.

Protocols on the other hand, model abstraction through composable template-like descriptions: "Adopters of this protocol will do [x, y, and z] by implementing [function x, function y, and function z] and will have [property a, and property b]&#8221;, etc&#8230; But they define a template only – no implementations are defined within a protocol.

In C#, we have a similar mechanism to protocols called interfaces. The same paradigm of defining a template with no implementations exists in C# when we use an interface to model some abstraction. C#, of course, also has classes and can pass along behavior and state to subclasses through inheritance.

<a name="understanding-cs-abstract-classes" class="jump-target"></a>

#### Understanding C# abstract classes

But C# has one _other_ mechanism for abstraction: **abstract classes**. These special types of abstractions have the ability to behave like interfaces (or protocols) in that they can strictly define a template with no implementation, requiring all _subclasses_ to supply that implementation. But abstract classes are unique in that they aren't _required_ to define a template _only_ – they can actually provide a default implementation that may or may not be overridden in a subclass, depending on what the implementer of the subclass wants to do.

We still can't make instances of an abstract class, just like we can't make instances of an interface or protocol. But with abstract classes, we can provide some default implementation that can be a customization point for concrete subclasses, should the implementer of the subclass desire to override this default behavior.

<a name="back-to-swift" class="jump-target"></a>

#### Bringing it back to Swift

So&#8230; what does this have to do with Swift? Well, it seemed to me that there's a _little_ overlap between Swift 2.0's new protocol extensions, and C# abstract classes. How?

With Swift protocol extensions, we can now provide default implementation for a protocol requirement, such that any adopter of the protocol _automatically_ uses that implementation and satisfies that particular requirement of the protocol.

A given Type implementing the extended protocol could choose to provide its own implementation to customize the behavior as it needs. But if it chooses not to, it gets that default behavior for free.

Therein lies the overlap I see between Swift protocol extensions and C# abstractions. But let's explore a little more in terms of similarities and differences between the two by analyzing an example.

<a name="example" class="jump-target"></a>

### Working example: Modeling athletes

Suppose for a moment that we're working on an app that models athletic competition (such as marathons, triathlons, and other sporting events). Now, athletic competition implies _athletes_, does it not?

How then, could we model an `Athlete` in an abstract way? That is, how can we provide just the blueprint for what an `Athlete` does, so that such a Type can be entered into one of the athletic competitions and perform in it?

<a name="model-with-cs" class="jump-target"></a>

#### Modeling the Athlete abstraction with C\#

In C#, we've got two possibilities: Create an interface, or create an abstract class.

Using an interface may look something like this:

```swift
public interface Athlete
{
    public void Run();
    public void Swim();
    public void Cycle();
    // Other things that an Athlete may be able to do
}
```

Using an abstract class may look very similar. The primary difference is in the declaration of each method, where we mark each of them `virtual`, so that they can be overridden in a subclass to provide that customization point I talked about earlier:

{{< highlight csharp >}}
public abstract class Athlete
{
    public abstract void Run();
    public abstract void Swim();
    public abstract void Cycle();
    // Other things that an Athlete may be able to do
}
{{< /highlight >}}

Right off, you might be asking, "Should a marathon runner have to be able to swim and cycle??&#8221;. It's a great question, and I'll address it further down in the article when I discuss ["refactoring for enhanced composability with Swift protocol extensions&#8221;][3].

<a name="model-with-swift" class="jump-target"></a>

#### Modeling the Athlete abstraction with Swift

In Swift, we essentially have one possibility that compares with C# for a pure abstraction, that is, just the blueprint describing an `Athlete's` capabilities: Create a protocol.

The `Athlete` protocol might look something like this:

```swift
protocol Athlete {
    func run()
    func swim()
    func cycle()
    // Other things that an Athlete may be able to do
}
```

We still don't avoid the necessity of a marathon runner being required to be able to swim and cycle. And having read [David Owens' recent recommendations on Protocols][4], I'm even more uncomfortable with modeling an `Athlete` this way, because it feels like we're treating a protocol as a Type here, which he identifies as a less powerful usage of protocols.

I want to refactor this, but for this moment in time, we'll stick with the code as-is, just to keep it as similar to the C# code as possible. I'll discuss [an option for refactoring this shortly][3].

<a name="default-implementation" class="jump-target"></a>

#### Default implementation for athletic abilities

As the example stands right now in both C# and Swift, we've got a situation where any Type wishing to be an `Athlete`, whether it be by implementing the C# interface, subclassing the C# abstract class, or adopting the Swift protocol, _must_ provide implementations of each of those athletic abilities (run, swim, and cycle). The Type can't _not_ implement one of those requirements and have the code still compile. They're requirements of what it means to be an `Athlete`, so the Type must conform.

Suppose that in our scenario, any given `Athlete` has one _primary_ ability which he/she is amazing at, but when it comes to his/her non-primary abilities, the `Athlete` is only able to perform at "average&#8221; skill.

This sounds like a case where it might be nice to have overridable default implementation provided. Any _specific_ type of `Athlete` could override that default implementation to perform the ability better or worse, depending on what kind of `Athlete` he/she is. But if the specific `Athlete` Type didn't provide an customized override, the Type would get the "average&#8221; behavior for free.

How could we make this happen?

<a name="default-implementation-with-cs" class="jump-target"></a>

##### Default implementation with C\#

In C#, abstract classes allow us to do just that. Here's how a default implementation might be written:

{{< highlight csharp >}}
{
    public virtual void Run()
    {
        // run with average speed and endurance
    }

    public virtual void Swim()
    {
        // swim with average speed and endurance
    }

    public virtual void Cycle()
    {
        // cycle with average speed and endurance
    }
}
{{< /highlight >}}

So now, when we want to model a `MarathonRunner`, we can override his/her ability to run, swim, and cycle as appropriate:

{{< highlight csharp >}}
{
    public override void Run()
    {
        // run with average speed and __insane__ endurance
    }
}
{{< /highlight >}}

It's not terrible – At least here we can rely on the default implementation if we just want to give a `MarathonRunner` "average&#8221; abilities in all areas but running.

We might prefer that a `MarathonRunner` not be required to have _any_ ability to swim or cycle, but that's always the struggle with inheritance-based modeling. You only get to choose one base class to inherit from, and you're bound to get some behavior that you don't need, simply because it's hard to model abstractions using inheritance that avoid giving you more than you need.

<a name="default-implementation-with-swift" class="jump-target"></a>

##### Default implementation with Swift

The default implementation story with Swift was non-existent until Swift 2.0 entered the scene. The approach is similar, but as we'll see shortly, provides far more power in terms of composability. Take a look at the implementation that compares most closely with C# for now:

```swift
extension Athlete {
    func run() { // run with average speed and endurance 
    }

    func swim() { // swim with average speed and endurance 
    }

    func cycle() { // cycle with average speed and endurance 
    }
}
```

Now when we want to model a `MarathonRunner` in Swift, we can adopt the `Athlete` protocol, and provide "override&#8221; implementations for any of the protocol's requirements that we'd like. Anything we don't provide a custom implementation for falls back to the protocol extension's implementation, just like in C#:

```swift
class MarathonRunner: Athlete
{
    func run() {
        // run with average speed and __insane__ endurance
    }
}
```

<a name="similarities" class="jump-target"></a>

### Similarities

Here's a list of the similarities I see between C# abstract classes and Swift protocol extensions:

  * Both outline a set of requirements that either a subclass or a protocol adopter _must_ implement.
  * Both provide a means to _automatically_ satisfy some (or _all_) of the requirements by providing a default implementation. With C#, we simply mark the method `virtual` to allow overriding in the subclass, and provide then an implementation. With Swift, we define a protocol extension that implements one or more of the protocol's requirements.
  * Both ease the burden of subclasses (C#) or protocol adopters (Swift) to implement all of the requirements when reasonable default implementations could suffice.
  * Both are used to provide customization points in subclasses (C#) or protocol adopters (Swift), when the default implementation is inadequate.

<a name="differences" class="jump-target"></a>

### Differences

So there are some similarities that I hope you can see and appreciate between C# abstract classes and Swift protocol extensions. But there are some major differences that should also be recognized:

  * Fundamentally, C# abstract classes are a "behavior by inheritance&#8221; tool, while Swift protocol extension are a "behavior by composition&#8221; tool.
  * Consequently, C# abstract classes impose a significant limitation: subclasses can inherit from one and only one base class. Swift protocols, on the other hand, can be decomposed into fine-grained, specific requirements that can later be re-combined and composed into more robust and dynamic Type specifications. While C# interfaces provide this same composability, they _don't_ have the ability to provide default implementation, which is a significant difference between the Swift counterpart.
  * As a consequence of _that_, subclasses of a C# abstract class get _all_ of the behavior, whether they need (or want) it or not. Swift protocols, being composable, allow a Type to conform to _just_ the pieces it needs. The protocol extension can still exist to provide default behavior when it's appropriate. But if a certain Type needs no ability to [do some thing], it simply drops conforming to that protocol and no superfluous behavior is imposed upon the Type.

<a name="preference" class="jump-target"></a>

### Preferring one over the other

Needless to say, I prefer Swift protocol extensions over C# abstract classes (shocker). I love the composability they offer, while at the same time allowing me to provide default implementations where it's appropriate. In my opinion, Swift protocol extensions are the perfect blend of interface and abstract class in C#. If only C# had "interface extensions&#8221;. :]

Since we can apply multiple protocols to a Type to signify what the Type can do, and essentially compose its behavior, how might we diverge from the constraints we had previously when we tried to stick closely with the C# abstract class paradigm?

Recall that I was uncomfortable with making a `MarathonRunner` have ability to swim and cycle, however "average&#8221; that ability may be. What I really want is to break things out a bit more, but still be able to provide that default implementation when I want it.

How might I refactor this by leveraging even more of the power of Swift protocol extensions?

<a name="refactoring" class="jump-target"></a>

### Refactoring for enhanced composability with Swift protocol extensions

I think I might like to define 3 protocols instead of 1. Rather than modeling things as `Athletes`, I'd much rather model some athletic _behavior_, and let the specific _kinds_ of athletes adopt whatever behavior is most appropriate for each athlete type.

So I'll ditch the `Athlete` protocol, and define these three instead:

```swift
protocol Runnable {
    func run()
}

protocol Swimmable {
    func swim()
}

protocol Cycleable {
    func cycle()
}
```

Alright&#8230; now&#8230; how about some default implementation?

```swift
extension Runnable {
    func run() {
        // run with average speed and endurance
    }
}

extension Swimmable {
    func swim() {
        // swim with average speed and endurance
    }
}

extension Cycleable {
    func cycle() {
        // cycle with average speed and endurance
    }
}
```

Excellent. Now to cap things off, I'll define some Types that adopt _just the protocols that are needed_:

```swift
struct MarathonRunner: Runnable {
    func run() {
        // run with average speed and __insane__ endurance
    }
}

struct Triathlete: Runnable, Swimmable, Cycleable {
    func swim() {
        // swim with lightning speed and crazy endurance
    }

    // fall back to protocol extension's average run speed & endurance
    // fall back to protocol extension's average cycle speed and endurance
}

struct Andrew {
    // Let's not impose the re-definition of any of the athletic terms, shall we?
}
```

Notice how the different types of athletes only pick up the behavior that's relevant to their ability. Nothing more, and nothing less.

I also enjoy being able to look at a Type declaration like `Triathlete` and see that he/she is able to run, swim, and cycle. It feels right to compose abilities this way. And it's even more convenient that some of the `Triathlete's` behavior is already implemented for me by virtue of the protocol extension.

### Wrapping up

I hope this analysis helped you see some of the same things I saw when it comes to how abstractions can be modeled with Swift, and how that compares with others languages like C#.

<a name="share" class="jump-target"></a>

 [1]: https://msdn.microsoft.com/en-us/library/sf985hc5.aspx
 [2]: https://developer.apple.com/videos/wwdc/2015/?id=408
 [3]: #refactoring
 [4]: http://owensd.io/2015/08/06/protocols.html