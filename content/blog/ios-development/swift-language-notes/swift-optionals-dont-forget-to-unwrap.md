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
  - XCode Compiler Error

---
There is a compiler error that throws me off every time I see it.  It takes the form,

> &#8216;ClassName?&#8217; does not have a member named &#8216;memberName&#8217;

This can happen when you&#8217;ve declared a variable as an optional, but forget to _unwrap_ that optional when you attempt to call a method on it.

For example, given this class definition:

<pre class="lang:swift decode:true" title="Bird class definition">class Bird {
	var family: String
	var color: String
 
	init(family: String, color: String) {
		self.family = family
		self.color = color
	}
 
	func isSwift() -&gt; Bool {
		return self.family == "Apodidae" ? true : false
	}
}</pre>

If, say in a ViewController, I declare a variable that I intend to reference an _optional_ <span class="lang:swift decode:true  crayon-inline">Bird</span> instance like this:

<pre class="lang:swift decode:true">var birdInstance: Bird?</pre>

And then I later initialize this variable with a <span class="lang:swift decode:true  crayon-inline">Bird</span> instance, perhaps in <span class="lang:swift decode:true  crayon-inline ">viewDidLoad()</span> :

<pre class="lang:swift decode:true">birdInstance = Bird(family: "Apodidae", color: "Black")</pre>

If I attempt to invoke the <span class="lang:swift decode:true  crayon-inline">isSwift</span> method on the <span class="lang:swift decode:true  crayon-inline">birdInstance</span> later  on, I&#8217;ll get a compiler error:

<pre class="lang:swift decode:true">println(birdInstance.isSwift())
</pre>

> error: &#8216;Bird?&#8217; does not have a member named &#8216;isSwift&#8217;

This may seem pretty basic &#8212; after all, I declared the <span class="lang:swift decode:true  crayon-inline ">birdInstance</span> as an optional and I know optionals need special treatment.  How could I make this mistake??  Perhaps this is just a consequence of my current stage in life, trying to code in 15-30 minute spurts with my 1 1/2 year old running around, haha.

We all deal with this though:  it&#8217;s fairly easy to write some code and come back to it later and not remember how you declared your variable in an earlier coding session.  Then when you&#8217;re presented a message saying that your class doesn&#8217;t have a member named &#8220;\___&#8221;, you immediately go to the class definition and see the function there, plain as day.  It&#8217;s easy to spend 3-5 minutes scratching your head thinking, &#8220;What in the world??!&#8221; &#8230; And then you realize &#8211; it&#8217;s that _optional declaration_ that you forgot to handle.

To fix this, of course, you can do any number of things, depending on your situation.

##### Force unwrap the optional and invoke the method:

<pre class="lang:swift decode:true">birdInstance!.isSwift() // Force unwrapped -- **CAUTION** make sure that birdInstance gets instantiated before you do this,&nbsp;or you'll get a runtime error</pre>

##### Employ optional chaining and invoke the method:

<pre class="lang:swift decode:true  ">birdInstance?.isSwift()</pre>

##### Declare the variable as implicitly unwrapped optional, then invoke the method later without extra exclamation or question marks:

<pre class="lang:swift decode:true ">var birdInstance: Bird! // Implicitly unwrapped -- **CAUTION** make sure that birdInstance gets instantiated before you use it, or you'll get a runtime error
birdInstance = Bird(family: "Apodidae", color: "Black")

// Some time later, invoke isSwift

println(birdInstance.isSwift())</pre>

<a title="CompileSwift - Optionals" href="http://www.compileswift.com/intermediate/optionals/?utm_content=bufferfba01&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer" target="_blank">A blog post by Peter Witham over at CompileSwift</a> was the article that caused me to think, &#8220;OH!  I haven&#8217;t done anything with my optional&#8230;_that&#8217;s_ the problem&#8221;.  Credit to you, sir, for your post!