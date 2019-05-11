---
title: Strong, Weak, and Unowned – Sorting out ARC and Swift
author: Andrew
type: blog
date: 2015-05-08T18:01:09+00:00
aliases:
  - /2015/05/08/strong-weak-and-unowned-sorting-out-arc-and-swift/
dsq_thread_id:
  - "3747856978"
categories:
  - Swift
tags:
  - ARC
  - Strong
  - Swift
  - Unowned
  - Weak

---
I'm willing to bet that a good number of Swift developers struggle with the particulars of how `strong`, `weak`, and `unowned` affect the run-time behavior of their code. I, myself, wouldn't want to have to give an explanation of the finer points of Automatic Reference Counting (ARC) if my life depended on it.

I wanted to stop being unsure about the implications of typing one of those three words before variable / constant declarations, so I finally pulled up the [Apple Documentation on ARC][1] and began trying to digest the semantics. This article is an attempt to share what got sorted out in my brain as it regards ARC and Swift.

This article is long enough that I thought, &#8220;Why don't I summarize my conclusions up front and then let folks read about how I got there if they so-desire&#8221;. So here you go: Conclusions first!

### Conclusions

  * To determine if you even need to worry about `strong`, `weak`, or `unowned`, ask, &#8220;Am I dealing with _reference_ types&#8221;. If you're working with Structs or Enums, ARC isn't managing the memory for those Types and you don't even need to worry about specifying `weak` or `unowned` for those constants or variables.
  * `Strong` references are fine in hierarchical relationships where the parent references the child, but not vice-versa. In fact, `strong` references are the most appropraite kind of reference most of the time.
  * When two instances are _optionally_ related to one another, make sure that one of those instances holds a `weak` reference to the other.
  * When two instances are related in such a way that one of the instances can't exist without the other, the instance with the mandatory dependency needs to hold an `unowned` reference to the other instance.

To see how I arrived at this set of conclusions, read on or jump around!


<a name="arc-and-memory-management" class="jump-target"></a>

### ARC and memory management

For many, much of &#8220;memory management&#8221; feels like a huge black box.

The mystical nature of memory management is exaggerated by the fact that many of the languages we're familiar with abstract it away. For the most part, we can simply write code and not think too hard about the number of bytes our object instances are using or how they get cleaned up when they're done being used. It just works.

Automatic Reference Counting (ARC) is one of those abstractions over managing memory. It's the methodology Apple employs to free up memory when class instances are finished using it.

ARC _only_ applies to classes (so not structs or enums), because Automatic _Reference_ Counting applies only to _reference Types_. Structs & enums are _value_ Types, so ARC does not manage the memory associated with instances of those Types.

The question that begins the discussion of our featured keywords is, &#8220;How does ARC know when an instance is &#8220;finished using&#8221; the memory it borrowed?&#8221;

<a name="strong-references" class="jump-target"></a>

### Strong references

`Strong`, `weak`, and `unowned` are keywords that describe the nature of a reference in the ARC paradigm.

All references are `strong` references by default unless otherwise specified. _Most_ of the time, this is the right thing to do. `Strong` is always implied when you declare a variable or constant. You don't need to type `strong` in Swift.

So what does the &#8220;strength&#8221; of a reference have to do with how ARC manages memory?

ARC doesn't free up the memory being used by a class instance until _all_ `strong` references to that instance are broken. How are `strong` references broken?

`Strong` references can be broken&#8230;

  * When a variable that references an instance of something is set to `nil`
  * When a parent variable that holds a reference to a child class instance is to `nil` it will break the reference to the parent _and_ the child
  * When a variable or constant goes out of scope – for example, if something gets initialized inside a control-flow code segment like an `if`/`else` or inside a `for` loop, when execution moves past that code segment, the reference is broken and the memory is freed by ARC

Everything in ARC's memory management model hinges on the number of `strong` references are connected to an instance. The moment that the number of `strong` references counts down to zero, the memory where that instance was stored is freed.

So where does `weak` and `unowned` come in?

<a name="weak-unowned-references" class="jump-target"></a>

### Weak and unowned references

`Weak` and `unowned` references come into the picture when we start talking about the relationships that emerge between class instances.

<a name="relationships-between-instances" class="jump-target"></a>

#### Relationships between instances

Relationships between classes are core to the Object-Oriented paradigm. Whether you plan them or not, these relationships exist, and they affect the ARC memory management model.

So which kinds of relationships exist? Which ones warrant the use of `weak` and `unowned`?

<a name="hierarchical" class="jump-target"></a>

##### Hierarchical relationships

Much of our programming in Swift involves hierarchical relationships. Things are often modeled in such a way that one class instance holds `strong` references to one or more child class instances, and those child class instances hold one or more `strong` references to _other_ child class instances, and so on. The `strong` reference relationship in this type of situation flows in one direction: from parent to child.

In this arrangement, `strong` references are normal and fine. But what happens if, say, a _child_ class were to hold a reference back to its _parent_? This is where we can get into trouble with ARC.

<a name="optional-mutually-dependent" class="jump-target"></a>

##### Optional, mutually dependent relationships

By the end of this section, my goal is to demonstrate the role of `weak` references.

When class instances depend on each other, that is, they both hold a reference to one another, it can be said that the instances are mutually dependent. Sometimes, the dependence isn't required – in these cases, it makes sense for one instance to exist without a reference to the other, and vice-versa.

If we were talking database cardinality, we might say that the relationship is 0:1 both ways.

An example is always nice to have before us – This past week, a tornado hit a zoo here in Oklahoma, and a few exotic animals escaped, so the theme is on my mind.

In a zoo, an `Animal` lives in an `Exhibit`. Sometimes `Exhibits` may be vacant. They could be cleaning it, or the `Animal` that lived there is sick or being moved, or a tornado hits it, etc.

Likewise, an `Animal` may not live in an `Exhibit`. It could be held in a temporary location while its `Exhibit` is being cleaned, or be in the process of being treated or transferred to another location, or it could have escaped the zoo due to a tornado, etc.

We could model this example as follows:

```swift
class Animal {
    let name: String
    let species: String
    init(name: String, species: String) { 
        self.name = name
        self.species = species
    }

    var exhibit: Exhibit?  // notice the optional nature of exhibit
}
 
class Exhibit {
    let title: String
    init(title: String) { self.title = title }

    var animal: Animal? // notice the optional nature of animal
}
```

Let's consider the situation where an `Animal` _is_ living in an `Exhibit`. It might be nice to traverse a relationship between them to get information about one or the other. So as we instantiate an `Animal` and an `Exhibit`, the next immediate step would be to assign the instances to each other's corresponding property.

Now consider the situation that happened this week – a tornado hits the zoo and the `Animal` escapes from its `Exhibit`. Say that _unlike_ this week, the `Animal` isn't recovered (they actually got the animals that escaped back). Suppose that it roams the plains of Oklahoma in freedom. The zoo, in turn, has to close the `Exhibit`. To model this, we may simply set the `Animal` instance to nil and the `Exhibit` instance to nil.

<a name="memory-leak-warning" class="jump-target"></a>

###### Memory leak warning

The example just given is one that shows how it is possible to create a memory leak in your application. How?

It all has to do with ARC – remember that it _only_ frees up memory for a class instance when there are _zero_ references to it.

In our `Animal` – `Exhibit` example, both instances referenced _each other_. When we set the `Animal` instance to nil, the `Exhibit` instance still held a reference to it through its `animal` property.

In turn, since that `Animal` instance is still around, it holds a reference to the `Exhibit` instance through its `exhibit` property. So when we set the `Exhibit` instance to nil, the `Animal` still holds on to it.

_Now_ we have a dilemma. While the `Animal` and the `Exhibit` continue to reference each other (so neither instance's memory can be freed), _nothing else does_ – there's no way to access either instance any more. Thus, a memory leak is created.

But there's hope! In this &#8220;Optional, mutually dependent relationship&#8221; scenario, this is where the keyword `weak` comes into play.

<a name="breaking-strong-reference-cycle" class="jump-target"></a>

###### Breaking strong reference cycle

The situation just described is what's known as a &#8220;strong reference cycle&#8221;.

Thankfully, there's a way to break those cycles and avoid memory leaks.

In the situation where that optional mutually dependent relationship exists, such as between an `Animal` and an `Exhibit`, changing one of those instances reference to the other from `strong` to `weak` will break the cycle.

It doesn't really matter which class holds the weak reference, just as long as one of them does.

```swift
class Animal {
    let name: String
    let species: String
    init(name: String, species: String) { 
        self.name = name
        self.species = species
    }

    var exhibit: Exhibit?  // we'll hold a strong reference to the exhibit
}
 
class Exhibit {
    let title: String
    init(title: String) { self.title = title }

    weak var animal: Animal? // but notice - we're holding a _weak_ reference to the animal
}
```

Making the `Exhibit's` `animal` property hold a `weak` reference to an `Animal` instance eliminates the possibility of a strong reference cycle.

So what about `unowned`?

<a name="mandatory-one-way-dependent" class="jump-target"></a>

##### Mandatory, one-way dependent relationships

By the end of this section, my goal is to demonstrate the role of `unowned` references.

There is one final category of relationship that pertains most immediately to the topic of ARC. There are times when two class instances are related to one another, but _one_ of those instance _cannot_ exist without the other.

Let's continue with the zoo theme. Suppose that our zoo issues `AnnualPasses` to `Visitors`. A `Visitor` can come to the zoo _without_ an `AnnualPass`, of course, and can thus exist on its own and happily enjoy the exhibits. An `AnnualPass`, however, is _always_ issued to a `Visitor` and cannot exist without being associated with one.

To model this kind of relationship, we may define some classes as follows:

<pre class="lang:default decode:true " title="AnnualPass, Visitor" >class Visitor {
    let name: String
    var annualPass: AnnualPass?
    init(name: String) {
        self.name = name
    }
}
 
class AnnualPass {
    let number: UInt64
    unowned let passholder: Visitor // notice the use of an _unowned_ reference
    init(number: UInt64, passholder: Visitor) {
        self.number = number
        self.passholder = passholder
    }
}
```

Notice a couple of things:

  1. The `Visitor` holds an optional `strong` reference to an `AnnualPass` instance
  2. The `AnnualPass` holds a _non_-optional `unowned` reference to a `Visitor` instance

Modeling things this way also eliminates the possibility of a strong reference cycle by allowing the `strong` reference count to reach zero when a `Visitor` variable is set to nil.

<a name="conclusions-2" class="jump-target"></a>

### Conclusions

I know I stated these at the beginning, but I'll restate them here just for completeness&#8230;

  * To determine if you even need to worry about `strong`, `weak`, or `unowned`, ask, &#8220;Am I dealing with _reference_ types&#8221;. If you're working with Structs or Enums, ARC isn't managing the memory for those Types and you don't even need to worry about specifying `weak` or `unowned` for those constants or variables.
  * `Strong` references are fine in hierarchical relationships where the parent references the child, but not vice-versa. In fact, `strong` references are the most appropraite kind of reference most of the time.
  * When two instances are _optionally_ related to one another, make sure that one of those instances holds a `weak` reference to the other.
  * When two instances are related in such a way that one of the instances can't exist without the other, the instance with the mandatory dependency needs to hold an `unowned` reference to the other instance.

<a name="share" class="jump-target"></a>

 [1]: https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/AutomaticReferenceCounting.html