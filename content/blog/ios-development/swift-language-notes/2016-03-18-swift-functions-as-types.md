---
title: Swift Functions as Types
author: Andrew
type: blog
date: 2016-03-18T18:11:02+00:00
url: /2016/03/18/swift-functions-as-types/
dsq_thread_id:
  - "4673938189"
categories:
  - Swift
tags:
  - Functional Programming
  - Functions
  - Swift

---
For the well-versed functional programmer, the fact that [functions in Swift are _Types_][1] is no surprise. But I&#8217;m relatively new to the game on that front, so when I first encountered the idea of thinking of a function as a Type back when Swift was announced in 2014, it was a real eye-opener for me.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#swift-types-general">Swift Types (in general)</a>
    </li>
    <ul>
      <li>
        <a href="#named-types">Named Types</a>
      </li>
      <li>
        <a href="#compound-types">Compound Types</a>
      </li>
    </ul>
    
    <li>
      <a href="#function-types">Function Types</a>
    </li>
    <li>
      <a href="#function-type-notation">Function Type notation</a>
    </li>
    <ul>
      <li>
        <a href="#gotchas">Gotchas</a>
      </li>
    </ul>
    
    <li>
      <a href="#practice">Practice</a>
    </li>
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="swift-types-general" class="jump-target"></a>

# Swift Types (in general)

In order to understand _functions_ as Types, it&#8217;s probably a good idea to know what folks are talking about when they use the term &#8220;Type&#8221; in a general sense.

In Swift, we&#8217;ve got two kinds of Types when we talk about them generally:

  * Named Types
  * Compound Types

<a name="named-types" class="jump-target"></a>

## Named Types

Named Types are those which are defined and identified by the _name_ that they&#8217;re given. Classes, structs, enums, and protocols fit this category of Type.

To define a Named Type, you&#8217;d do something like this:

<pre class="lang:swift decode:true " title="Type declarations" >class SomeNewClassType {}

struct SomeNewStructType {}

enum SomeNewEnumType {}

protocol SomeNewProtocolType {}</pre>

Initializing instances of Types and using their properties and methods, passing them around to functions that require parameters of those Types, or setting them as values to properties of other Types are all pretty standard thoughts that come to mind when using named Types.

<a name="compound-types" class="jump-target"></a>

## Compound Types

_Compound_ Types, on the other hand, don&#8217;t have names. Rather, they have &#8220;signatures&#8221; that define and identify them as Types. Swift has two compound Types: functions and tuples.

Now I know what you might be thinking: &#8220;Functions have names!&#8221;

Indeed many do. But when we&#8217;re thinking about them in terms of their _Type-ness_, we&#8217;ve got to go beyond the name to the function&#8217;s &#8220;signature&#8221; characteristics.

The _name_ of a function (or tuple, since they can be type-aliased) is simply how we _refer_ to the function in code to execute it or pass it around as an argument.

The &#8220;signature&#8221; of the function, however, is the part that characterizes the function as a _Type_.

I want to analyze what I&#8217;m talking about when I refer to a function&#8217;s &#8220;signature&#8221;, because that really is as the heart of my goal for this blog entry&#8230;

<a name="function-types" class="jump-target"></a>

# Function Types

What exactly makes up a function&#8217;s _Type-ness_ or &#8220;signature&#8221; as I&#8217;ve been calling it? Two things:

  * The Type(s) of its **parameters**
  * The Type that the function **returns**

Combining the Type(s) that the function receives as inputs, and the Type that it returns composes to give the function _its_ Type / &#8220;signature&#8221;.

# Reading a function&#8217;s Type

It always helps me to visualize, so take apart an example.

If you&#8217;ve lived long on the Internet, you&#8217;re bound to have run across a Star Wars name generator&#8230; Plug in your name, and maybe a birth year, and out comes some crazy &#8220;Star Wars name&#8221; for you.

The function definition (minus the body) might look like this:

<pre class="lang:swift decode:true " title="Function Type Example" >func generateStarWarsName(firstName: String, lastName: String, birthYear: Int) -&gt; String { 
    // ... 
}</pre>

If someone were to ask you, &#8220;What is the `generateStarWarsName` function&#8217;s Type?&#8221;, you could answer: &#8220;`generateStarWarsName` is a function Type that has three parameters, the first two of Type String, the last of Type Int, and that returns a value of Type String.&#8221;

Wordy? Yes. But it does explain in precise terms what the function&#8217;s Type is.

<a name="function-type-notation" class="jump-target"></a>

# Function Type notation

Rather than write out the paragraph describing the function&#8217;s Type, it&#8217;s far more convenient to indicate a the Type of a function using a standard notation. This notation is also the syntax that the Swift compiler uses when it&#8217;s trying to work with function Types.

Essentially, it boils down to stripping away the function&#8217;s name and the parameter names to leave behind the raw Type information that composes to give the function _its_ Type.

Given the above `generateStarWarsName` function, we could notate its Type as follows:

`(String, String, Int) -> String`

See how that works?

Remove &#8220;generateStarWarsName&#8221;, &#8220;firstName: &#8220;, &#8220;lastName: &#8220;, and &#8220;birthYear: &#8221; and you&#8217;re left with that raw Type information. What remains is the function&#8217;s Type notation.

It tells you (and the Swift compiler) everything you need to know to be able identify the Type of that function&#8230; it&#8217;s &#8220;signature&#8221;, if you will.

<a name="gotchas" class="jump-target"></a>

## Gotchas

A couple of gotchas when it comes to notating a function&#8217;s Type:

1 &#8211; If a function takes no parameters, the &#8220;parameter portion&#8221; of the Type notation will simply be `()` with nothing between the parentheses.

So for example, the Type notation of  
`func returnHelloString() -> String {}`  
is `() -> String`.

2 &#8211; If a function has no return type (ie, it doesn&#8217;t return anything), the &#8220;return type portion&#8221; of the Type notation will be `-> Void`.

So for example, the Type notation of  
`func sayHello() {}`  
is `() -> Void`, since it takes no parameters, _and_ returns nothing.

<a name="practice" class="jump-target"></a>

# Practice

Here are a few more examples for you to practice function Type identification. Can you write out the correct notation for each function&#8217;s Type?

<pre class="lang:swift decode:true " title="Function Type Example" >func complimentMe(name: String) -&gt; String { 
    // ... 
}</pre>

<a id="show-answer-1" style="cursor: pointer;">Show answer</a>

<div id="answer-1" style="display: none;">
  `(String) -> String`
</div>

<pre class="lang:swift decode:true " title="Function Type Example" >func countToTen() { 
    // ... prints 1 to 10 to the console ...
}</pre>

<a id="show-answer-2" style="cursor: pointer;">Show answer</a>

<div id="answer-2" style="display: none;">
  `() -> Void`</p> 
  
  <p>
    Notice that while `countToTen` doesn&#8217;t have the &#8220;-> Void&#8221; in its definition, it <em>is</em> listed in the function&#8217;s Type notation for clarity.
  </p>
  
  <p>
    When you read this function&#8217;s Type, you&#8217;d say, &#8220;This is a function Type which takes no parameters and returns Void.&#8221;
  </p>
</div>

<pre class="lang:swift decode:true " title="Function Type Example" >func addInts(first: Int, second: Int) -&gt; Int { 
    // ... 
}</pre>

<a id="show-answer-3" style="cursor: pointer;">Show answer</a>

<div id="answer-3" style="display: none;">
  `(Int, Int) -> Int`
</div>

<pre class="lang:swift decode:true " title="Function Type Example" >func fadeIn(duration: NSTimeInterval, delay: NSTimeInterval, completion: (Bool) -> Void){ 
    // ... 
}</pre>

<a id="show-answer-4" style="cursor: pointer;">Show answer</a>

<div id="answer-4" style="display: none;">
  `(NSTimeInterval, NSTimeInterval, (Bool) -> Void)) -> Void`</p> 
  
  <p>
    This one&#8217;s actually a more complicated &#8220;compound Type&#8221; &#8211; note the third parameter which indicates that `fadeIn` receives a function Type <em>as one of its inputs</em>. Remember that since functions are Types, they carry the characteristic of being able to be passed around to other functions as parameters, or stored in variables/constants! </div> 
    
    <p>
    </p>
    
    <pre class="lang:swift decode:true " title="Function Type Example">func increment(input: Int) -&gt; Int {
    return input + 1
}

func decrement(input: Int) -&gt; Int {
    return input - 1
}

func chooseAdjustmentFunction(increase: Bool) -&gt; (Int) -&gt; Int {
    return increase ? increment : decrement
}</pre>
    
    <p>
      <a id="show-answer-5" style="cursor: pointer;">Show answer</a>
    </p>
    
    <div id="answer-5" style="display: none;">
      increment: `(Int) -> Int`<br /> decrement: `(Int) -> Int`</p> 
      
      <p>
        chooseAdjustmentFunction(_:): `(Bool) -> (Int) -> Int`
      </p>
      
      <p>
        This one&#8217;s complicated in a slightly different way. This time, it&#8217;s the return Type of the function that&#8217;s kind of crazy.
      </p>
      
      <p>
        Read this as, &#8220;A function Type which takes as Bool as a parameter and returns a function Type which takes an Int as a parameter and returns an Int.&#8221;
      </p>
      
      <p>
        You can see how the Types of the `increment` and `decrement` functions <em>match</em> the return Type of the `chooseAdjustmentFunction` function. </div> 
        
        <h1>
          Wrapping up
        </h1>
        
        <p>
          Knowing that functions are Types in Swift is a powerful thing. Being able to correctly articulate the Type of a function, and produce its notation in valid Swift syntax is even <em>more</em> powerful, because it&#8217;s at that point when you&#8217;ll be able to recognize which kinds of functions are valid to pass as parameters to <em>other</em> functions, or to assign as properties of other Types. It can also play a role in Swift&#8217;s pattern matching features. But alas, those topics for another day!
        </p>
        
        <p>
          <a name="related" class="jump-target"></a>
        </p>
        
        <div class="resources">
          <div class="resources-header">
            You might also enjoy&#8230;
          </div>
          
          <ul class="resources-content">
            <li>
              <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/01/06/immutable-types-changing-state-swift/" title="Immutable Types with Changing State in Swift">Immutable Types with Changing State in Swift</a>
            </li>
            <li>
              <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/01/20/conveniently-transforming-immutable-types-swift/" title="Conveniently Transforming Immutable Types in Swift">Conveniently Transforming Immutable Types in Swift</a>
            </li>
          </ul>
        </div>
        
        <p>
          <a name="share" class="jump-target"></a>
        </p>
        
        <p>
        </p>

 [1]: https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Functions.html#//apple_ref/doc/uid/TP40014097-CH10-ID158