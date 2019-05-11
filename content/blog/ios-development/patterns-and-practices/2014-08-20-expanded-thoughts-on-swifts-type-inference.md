---
title: Expanded Thoughts on Swift’s Type Inference
author: Andrew
type: blog
date: 2014-08-21T02:19:45+00:00
url: /2014/08/20/expanded-thoughts-on-swifts-type-inference/
dsq_thread_id:
  - "2945282682"
categories:
  - iOS / Mac
  - Op-Ed
  - Swift
tags:
  - Clean Code
  - Swift
  - Type Inference

---
In my recent <a title="Clean Coding in Swift – Type Inference" href="http://www.andrewcbancroft.com/2014/08/12/clean-coding-in-swift-type-inference/" target="_blank">op-ed on clean coding in Swift focused on Type Inference</a>, I began by saying,

> Quick!  Tell me!  What is the Type of the <span class="lang:swift decode:true  crayon-inline">birdDetails</span> constant in this code example:
> 
> <pre class="toolbar:2 lang:swift decode:true">let birdDetails = birdDetailsFromStorage()</pre>
> 
> With no additional context to glean information from, the correct answer to the question is, &#8220;I have absolutely no clue&#8230;&#8221;

**But is that concluding assertion _true_?  Hmm&#8230;**

_I&#8217;m learning_, and as I&#8217;ve weighed a recent Twitter conversation and thought on a <a title="Rob Napier Comment" href="http://www.andrewcbancroft.com/2014/08/12/clean-coding-in-swift-type-inference/#comment-1551252721" target="_blank">comment thread that Rob Napier made</a> on the post quoted above, I&#8217;m compelled to expand a little on my first post on Type Inference as it relates to clean code in Swift.

Something struck me as I read <a title="Rob's Comment" href="http://www.andrewcbancroft.com/2014/08/12/clean-coding-in-swift-type-inference/#comment-1551252721" target="_blank">Rob&#8217;s comment</a>:  Why _wouldn&#8217;t_ I know the Type that would be inferred from what is returned by <span class="lang:swift decode:true  crayon-inline">birdDetailsFromStorage()</span> and assigned to <span class="lang:swift decode:true  crayon-inline">birdDetails</span>?  Presumably, I named the function what I named it intentionally.  The part I missed, was that if I had _designed_ well and created a Type called <span class="lang:swift decode:true  crayon-inline">BirdDetails</span> (say, a Struct as Rob proposed), then all of a sudden, an inference can be made by both the compiler _and_ a human that the <span class="lang:swift decode:true  crayon-inline">birdDetails</span> constant is&#8230; well&#8230; an instance of <span class="lang:swift decode:true  crayon-inline">BirdDetails</span>.  Imagine that!

To quote Rob (emphasis added):

> <span style="color: #3f4549;">Type inference should only be used when the result is unambiguous, but <strong>the best solution is to</strong> <strong>make the result unambiguous</strong>.</span>

Bingo.  The _best_ solution is to _make_ the result unambiguous.  You and I as code authors are in charge of the clarity or ambiguity of our code &#8211; it&#8217;s up to us to _make_ the results of our function evaluations unambiguous.

When I named the function <span class="lang:swift decode:true  crayon-inline">birdDetailsFromStorage()</span>, I heavily implied something about its return Type in the name.  I even implied it in the name of the _constant_.  I was expecting the return Type to be something that encapsulated whatever &#8220;bird details&#8221; are &#8211; I just didn&#8217;t realize it at the time (although it&#8217;s super obvious now)!

The very _name_ of a thing sets expectations for you and the readers of your code.  It&#8217;s our job to set ourselves up for that expectation to be _fulfilled_!  B<span style="color: #3f4549;">e predictable with the return Type of your functions for your own sake.  A function signature should be such that when you run across <span class="lang:swift decode:true  crayon-inline">birdDetailsFromStorage()</span> in some piece of code, you are able to legitimately expect it to return a <span class="lang:swift decode:true  crayon-inline">BirdDetails</span>.  </span>

<span style="color: #3f4549;">Using this predictable, </span>convention-based approach to give humans the right clues about what the compiler is going to compute a Type to be makes Type Inference a totally legitimate language feature to embrace for the sake of your code&#8217;s clarity and simplicity.

I&#8217;ll leave you with a final quote from Rob&#8217;s comments:

> <span style="color: #3f4549;">Don&#8217;t go implying that you&#8217;re returning one thing when you&#8217;re returning another. If you must, then yes, explicit types are your punishment. 😀</span>

Thank you Rob for your insight and feedback.  You can read more of Rob&#8217;s work at <a title="Rob Napier's Blog" href="http://robnapier.net" target="_blank">http://robnapier.net</a>.

<div class="related-posts">
  <p>
    You might also enjoy
  </p>
  
  <ul>
    <li>
      <a title="Clean Coding in Swift – Functions" href="http://www.andrewcbancroft.com/2014/08/07/clean-coding-in-swift-functions/" target="_blank">Clean Coding in Swift – Functions</a>
    </li>
    <li>
      <a title="Clean Coding in Swift – Type Inference" href="http://www.andrewcbancroft.com/2014/08/12/clean-coding-in-swift-type-inference/" target="_blank">Clean Coding in Swift – Type Inference</a>
    </li>
    <li>
      <a title="Pick a Delegate… Any Delegate… On Clean View Controllers in Swift" href="http://www.andrewcbancroft.com/2014/08/26/pick-a-delegate-clean-view-controllers-in-swift/" target="_blank">Pick a Delegate… Any Delegate… On Clean View Controllers in Swift</a>
    </li>
  </ul>
</div>