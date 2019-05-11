---
title: Testability Tip for Swift Developers – Parameterize and Push
author: Andrew
type: blog
date: 2015-09-04T18:36:52+00:00
url: /2015/09/04/testability-tip-for-swift-developers-parameterize-and-push/
dsq_thread_id:
  - "4097946261"
categories:
  - Swift
tags:
  - Swift
  - Unit Testing

---
In a previous &#8220;Testability Tip for Swift Developers&#8221;, [I discussed the principle of observability][1]. &#8220;If it&#8217;s observable, it&#8217;s testable&#8221; was the primary conclusion of the article, and I pointed toward using the `public` access control modifier for parts of your app that you intend to test.

In this edition, I&#8217;d like to introduce a new principle that I try to adhere to when I&#8217;m unit testing, namely, &#8220;If it&#8217;s controllable, it&#8217;s testable&#8221;. Here&#8217;s what I mean by &#8220;controllable&#8221;&#8230;

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#controllability">Controllability</a>
    </li>
    <li>
      <a href="#parameterize-push">Parameterize and push</a>
    </li>
    <li>
      <a href="#forms">Forms of parameterization</a>
    </li>
    <li>
      <a href="#usefulness">Usefulness and examples of parameterization</a>
    </li>
    <li>
      <a href="#di">Parameterization or &#8220;Dependency Injection&#8221;?</a>
    </li>
    <li>
      <a href="#related">You might also enjoy&#8230;</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="controllability" class="jump-target"></a>

### Controllability

In [Testing is to Software as Experiment is to Science][2], I analyzed how testing software mirrors scientific experimentation. Good scientific experiments are controllable. That is, they are set up such that everything stays as constant as possible except the thing you&#8217;re poking at.

Changing multiple things at a time in an experiment clouds the ability to verify that [tweak x] produced [y outcome]. So a scientist will do his/her best to _control_ the environment by holding as many variables constant as possible, so that he/she can make accurate conclusions about the outcome.

The same goes for testing software. If I&#8217;m going to automate a test, I want to set up my &#8220;experiment&#8221; such that I control as much of the system as possible so that I can set up valid expectations and verify results coming from the system under test. Note that I&#8217;m using the term &#8220;system&#8221; in a very broad sense &#8211; it could be referring to an entire app, a single &#8220;object&#8221;, or a function.

<a name="parameterize-push" class="jump-target"></a>

### Parameterize and push

So where does &#8220;parameterize and push&#8221; come into play?

Parameterizing sets us up with the ability to provide _inputs_ into the system we&#8217;re testing. Anytime you have an input, you have the ability to supply a value of your choosing.

Serving as inputs to the system, you can view parameters as entry points for _controls_. They&#8217;re &#8220;controls&#8221; because _we_ decide what those values should be before we pass them off as arguments _to_ those parameters. So long as the system we&#8217;re testing only gets the data it uses from its inputs (its parameters), we can be guaranteed predictable, controlled outputs on the other end.

<a name="forms" class="jump-target"></a>

### Forms of parameterization

Three forms of parameterization are common:

  1. At the instance level through initializers
  2. At the instance level through property setters
  3. At the function level through function parameters

Using an initializer, or a `public` variable property, or by adding parameters to your functions and using only those parameters for the function&#8217;s computation and output production, you give yourself the ability to control the system in various ways that are appropriate on a test-by-test basis.

<a name="usefulness" class="jump-target"></a>

### Usefulness and examples of parameterization

Setting up your instance definitions to use a set of inputs from the very start through initialization gives you the ability to provide real &#8220;production-ready&#8221; values in your app, but fake &#8220;test-customized&#8221; values for testing. [Creating fake objects][3] for testing is outside the scope of this article, but providing public initializers with parameters is a really great way to set yourself up for being able to test that particular instance.

<pre class="lang:swift decode:true " >// Prefer
public class DatabaseCommunicator {
    let database: Database
    
    public init (database: Database) {
        self.database = database
        // able to supply a controlled input via parameter, such as supplying a 
        // customized "fake" database to use for testing but still supply a "real" database in real life
    }
}

// over
public class DatabaseCommunicator {
    let database = Database()
    // stuck with talking to a real database...
}</pre>

Another viable option is to provide public variable properties that can be set after the instance is initialized. This is a little more round-about, but I would still call it a form of &#8220;parameterization&#8221; because the strategy still provides you with the same control point that an initializer with parameters does.

<pre class="lang:swift decode:true " >// prefer
public class DatabaseCommunicator {
    public var database: Database
    // able to supply a controlled input via property setter, such as supplying a 
    // customized "fake" database to use for testing but still supply a "real" database in real life
    public init() { self.database = Database()}
}

// over
public class DatabaseCommunicator {
    let database = Database()
    // stuck with talking to a real database
}</pre>

At the function level, the usefulness of parameters is that you can supply inputs and examine outputs with ease. If you pull in data from the encapsulating instance inside the function body, say by referencing `self.somePropertyValue`, you&#8217;ve got a bit more setup to do to be able to accurately verify results. `somePropertyValue` needs to actually have a value before the function will produce accurate results. If you&#8217;d opted to simply define parameters for everything the function needs in order to produce its output, you can test that function in isolation far more easily and be guaranteed that your results are correct and accurate.

<pre class="lang:swift decode:true " >// prefer
func getNameFromDatabase(database: Database) -&gt; String {
    return database.getName()
    // able to supply a controlled input via parameter, such as supplying a 
    // customized "fake" database to use for testing but still supply a "real" database in real life
   
}

// over
func getNameFromDatabase() -&gt; String {
    let database = Database()
    // stuck with talking to a real database
    return database.getName()
}

// and over
func getNameFromDatabase() -&gt; String {
    return self.database.getName()
    // requires additional setting of the database property on 'self'
    // before you're able to get results from this function
}
</pre>

<a name="di" class="jump-target"></a>

### Parameterization or &#8220;Dependency Injection&#8221;?

Yes.

What I&#8217;m calling &#8220;parameterization&#8221; is really just &#8220;dependency injection&#8221;. But the term &#8220;dependency injection&#8221; can sound really daunting, while we&#8217;re used to working with parameters. I intend for the meaning of each term for the purpose of this article to be equivalent.

### Wrapping up

Parameterizing, your instance definitions and functions provides you an immense amount of leverage when it comes to controlling your system under test. I encourage you to try this out and do your best to shift to a more parameterized approach to writing your code for improved testability. Remember, &#8220;Controllable is testable&#8221;!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/04/15/testability-tip-for-swift-developers-public-over-private/" title="Testability Tip for Swift Developers – Public Over Private">Testability Tip for Swift Developers – Public Over Private</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/2015/04/15/testability-tip-for-swift-developers-public-over-private/
 [2]: https://www.andrewcbancroft.com/2015/04/29/testing-is-to-software-as-experiment-is-to-science/
 [3]: https://www.andrewcbancroft.com/2014/07/15/how-to-create-mocks-and-stubs-in-swift/