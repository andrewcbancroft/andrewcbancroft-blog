---
title: Swift Functions as Types
author: Andrew
type: blog
date: 2016-03-18T18:11:02+00:00
aliases:
  - /2016/03/18/swift-functions-as-types/
dsq_thread_id:
  - "4673938189"
categories:
  - Swift
tags:
  - Functional Programming
  - Functions
  - Swift

---
For the well-versed functional programmer, the fact that [functions in Swift are _Types_][1] is no surprise. But I'm relatively new to the game on that front, so when I first encountered the idea of thinking of a function as a Type back when Swift was announced in 2014, it was a real eye-opener for me.


<a name="swift-types-general" class="jump-target"></a>

# Swift Types (in general)

In order to understand _functions_ as Types, it's probably a good idea to know what folks are talking about when they use the term "Type&#8221; in a general sense.

In Swift, we've got two kinds of Types when we talk about them generally:

  * Named Types
  * Compound Types

<a name="named-types" class="jump-target"></a>

## Named Types

Named Types are those which are defined and identified by the _name_ that they're given. Classes, structs, enums, and protocols fit this category of Type.

To define a Named Type, you'd do something like this:

```swift
class SomeNewClassType {}

struct SomeNewStructType {}

enum SomeNewEnumType {}

protocol SomeNewProtocolType {}
```

Initializing instances of Types and using their properties and methods, passing them around to functions that require parameters of those Types, or setting them as values to properties of other Types are all pretty standard thoughts that come to mind when using named Types.

<a name="compound-types" class="jump-target"></a>

## Compound Types

_Compound_ Types, on the other hand, don't have names. Rather, they have "signatures&#8221; that define and identify them as Types. Swift has two compound Types: functions and tuples.

Now I know what you might be thinking: "Functions have names!&#8221;

Indeed many do. But when we're thinking about them in terms of their _Type-ness_, we've got to go beyond the name to the function's "signature&#8221; characteristics.

The _name_ of a function (or tuple, since they can be type-aliased) is simply how we _refer_ to the function in code to execute it or pass it around as an argument.

The "signature&#8221; of the function, however, is the part that characterizes the function as a _Type_.

I want to analyze what I'm talking about when I refer to a function's "signature&#8221;, because that really is as the heart of my goal for this blog entry&#8230;

<a name="function-types" class="jump-target"></a>

# Function Types

What exactly makes up a function's _Type-ness_ or "signature&#8221; as I've been calling it? Two things:

  * The Type(s) of its **parameters**
  * The Type that the function **returns**

Combining the Type(s) that the function receives as inputs, and the Type that it returns composes to give the function _its_ Type / "signature&#8221;.

# Reading a function's Type

It always helps me to visualize, so take apart an example.

If you've lived long on the Internet, you're bound to have run across a Star Wars name generator&#8230; Plug in your name, and maybe a birth year, and out comes some crazy "Star Wars name&#8221; for you.

The function definition (minus the body) might look like this:

```swift
func generateStarWarsName(firstName: String, lastName: String, birthYear: Int) -&gt; String { 
    // ... 
}
```

If someone were to ask you, "What is the `generateStarWarsName` function's Type?&#8221;, you could answer: "`generateStarWarsName` is a function Type that has three parameters, the first two of Type String, the last of Type Int, and that returns a value of Type String.&#8221;

Wordy? Yes. But it does explain in precise terms what the function's Type is.

<a name="function-type-notation" class="jump-target"></a>

# Function Type notation

Rather than write out the paragraph describing the function's Type, it's far more convenient to indicate a the Type of a function using a standard notation. This notation is also the syntax that the Swift compiler uses when it's trying to work with function Types.

Essentially, it boils down to stripping away the function's name and the parameter names to leave behind the raw Type information that composes to give the function _its_ Type.

Given the above `generateStarWarsName` function, we could notate its Type as follows:

`(String, String, Int) -> String`

See how that works?

Remove "generateStarWarsName&#8221;, "firstName: ", "lastName: ", and "birthYear: &#8221; and you're left with that raw Type information. What remains is the function's Type notation.

It tells you (and the Swift compiler) everything you need to know to be able identify the Type of that function&#8230; it's "signature&#8221;, if you will.

<a name="gotchas" class="jump-target"></a>

## Gotchas

A couple of gotchas when it comes to notating a function's Type:

1 – If a function takes no parameters, the "parameter portion&#8221; of the Type notation will simply be `()` with nothing between the parentheses.

So for example, the Type notation of  
`func returnHelloString() -> String {}`  
is `() -> String`.

2 – If a function has no return type (ie, it doesn't return anything), the "return type portion&#8221; of the Type notation will be `-> Void`.

So for example, the Type notation of  
`func sayHello() {}`  
is `() -> Void`, since it takes no parameters, _and_ returns nothing.

<a name="practice" class="jump-target"></a>

# Practice

Here are a few more examples for you to practice function Type identification. Can you write out the correct notation for each function's Type?

```swift
func complimentMe(name: String) -&gt; String { 
    // ... 
}
```

<a id="show-answer-1" style="cursor: pointer;">Show answer</a>

<div id="answer-1" style="display: none;">
  `(String) -> String`
</div>

```swift
func countToTen() { 
    // ... prints 1 to 10 to the console ...
}
```

<a id="show-answer-2" style="cursor: pointer;">Show answer</a>

<div id="answer-2" style="display: none;">
  `() -> Void`</p> 
  
  <p>
    Notice that while `countToTen` doesn't have the "-> Void&#8221; in its definition, it <em>is</em> listed in the function's Type notation for clarity.
  </p>
  
  <p>
    When you read this function's Type, you'd say, "This is a function Type which takes no parameters and returns Void.&#8221;
  </p>
</div>

```swift
func addInts(first: Int, second: Int) -&gt; Int { 
    // ... 
}
```

<a id="show-answer-3" style="cursor: pointer;">Show answer</a>

<div id="answer-3" style="display: none;">
  `(Int, Int) -> Int`
</div>

```swift
func fadeIn(duration: NSTimeInterval, delay: NSTimeInterval, completion: (Bool) -> Void){ 
    // ... 
}
```

<a id="show-answer-4" style="cursor: pointer;">Show answer</a>

<div id="answer-4" style="display: none;">
  `(NSTimeInterval, NSTimeInterval, (Bool) -> Void)) -> Void`</p> 
  
  <p>
    This one's actually a more complicated "compound Type&#8221; – note the third parameter which indicates that `fadeIn` receives a function Type <em>as one of its inputs</em>. Remember that since functions are Types, they carry the characteristic of being able to be passed around to other functions as parameters, or stored in variables/constants! </div> 
    
    <p>
    </p>
    
    ```swift
func increment(input: Int) -&gt; Int {
    return input + 1
}

func decrement(input: Int) -&gt; Int {
    return input - 1
}

func chooseAdjustmentFunction(increase: Bool) -&gt; (Int) -&gt; Int {
    return increase ? increment : decrement
}
```
    
    <p>
      <a id="show-answer-5" style="cursor: pointer;">Show answer</a>
    </p>
    
    <div id="answer-5" style="display: none;">
      increment: `(Int) -> Int`<br /> decrement: `(Int) -> Int`</p> 
      
      <p>
        chooseAdjustmentFunction(_:): `(Bool) -> (Int) -> Int`
      </p>
      
      <p>
        This one's complicated in a slightly different way. This time, it's the return Type of the function that's kind of crazy.
      </p>
      
      <p>
        Read this as, "A function Type which takes as Bool as a parameter and returns a function Type which takes an Int as a parameter and returns an Int.&#8221;
      </p>
      
      <p>
        You can see how the Types of the `increment` and `decrement` functions <em>match</em> the return Type of the `chooseAdjustmentFunction` function. </div> 
        
        <h1>
          Wrapping up
        </h1>
        
        <p>
          Knowing that functions are Types in Swift is a powerful thing. Being able to correctly articulate the Type of a function, and produce its notation in valid Swift syntax is even <em>more</em> powerful, because it's at that point when you'll be able to recognize which kinds of functions are valid to pass as parameters to <em>other</em> functions, or to assign as properties of other Types. It can also play a role in Swift's pattern matching features. But alas, those topics for another day!
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