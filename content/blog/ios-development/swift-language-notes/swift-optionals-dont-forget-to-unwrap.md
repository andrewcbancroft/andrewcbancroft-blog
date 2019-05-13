---
title: 'Swift Optionals?  Don’t Forget to Unwrap!'
author: Andrew
type: blog
date: 2014-07-26T02:23:53+00:00
aliases:
  - /2014/07/25/swift-optionals-dont-forget-to-unwrap/
spacious_page_layout:
  - default_layout
dsq_thread_id:
  - "2873985271"
categories:
  - iOS / Mac
  - Swift
tags:
  - Swift
  - Swift Optionals
  - Xcode Compiler Error

---
There is a compiler error that throws me off every time I see it.  It takes the form,

> &#8216;ClassName?' does not have a member named &#8216;memberName'

This can happen when you've declared a variable as an optional, but forget to _unwrap_ that optional when you attempt to call a method on it.

For example, given this class definition:

```swift
class Bird {
	var family: String
	var color: String
 
	init(family: String, color: String) {
		self.family = family
		self.color = color
	}
 
	func isSwift() -&gt; Bool {
		return self.family == "Apodidae" ? true : false
	}
}
```

If, say in a ViewController, I declare a variable that I intend to reference an _optional_ `Bird` instance like this:

```swift
var birdInstance: Bird?
```

And then I later initialize this variable with a `Bird` instance, perhaps in `viewDidLoad()` :

```swift
birdInstance = Bird(family: "Apodidae", color: "Black")
```

If I attempt to invoke the `isSwift` method on the `birdInstance` later  on, I'll get a compiler error:

```swift
println(birdInstance.isSwift())
```

> error: &#8216;Bird?' does not have a member named &#8216;isSwift'

This may seem pretty basic &#8212; after all, I declared the `birdInstance` as an optional and I know optionals need special treatment.  How could I make this mistake??  Perhaps this is just a consequence of my current stage in life, trying to code in 15-30 minute spurts with my 1 1/2 year old running around, haha.

We all deal with this though:  it's fairly easy to write some code and come back to it later and not remember how you declared your variable in an earlier coding session.  Then when you're presented a message saying that your class doesn't have a member named "\___&#8221;, you immediately go to the class definition and see the function there, plain as day.  It's easy to spend 3-5 minutes scratching your head thinking, "What in the world??!&#8221; &#8230; And then you realize – it's that _optional declaration_ that you forgot to handle.

To fix this, of course, you can do any number of things, depending on your situation.

##### Force unwrap the optional and invoke the method:

```swift
birdInstance!.isSwift() // Force unwrapped -- **CAUTION** make sure that birdInstance gets instantiated before you do this,&nbsp;or you'll get a runtime error
```

##### Employ optional chaining and invoke the method:

```swift
birdInstance?.isSwift()
```

##### Declare the variable as implicitly unwrapped optional, then invoke the method later without extra exclamation or question marks:

```swift
var birdInstance: Bird! // Implicitly unwrapped -- **CAUTION** make sure that birdInstance gets instantiated before you use it, or you'll get a runtime error
birdInstance = Bird(family: "Apodidae", color: "Black")

// Some time later, invoke isSwift

println(birdInstance.isSwift())
```

<a title="CompileSwift - Optionals" href="http://www.compileswift.com/intermediate/optionals/?utm_content=bufferfba01&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer" target="_blank">A blog post by Peter Witham over at CompileSwift</a> was the article that caused me to think, "OH!  I haven't done anything with my optional&#8230;_that's_ the problem&#8221;.  Credit to you, sir, for your post!