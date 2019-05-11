---
title: 3 Nuances of Swift Extensions
author: Andrew
type: blog
date: 2015-04-22T17:52:36+00:00
url: /2015/04/22/3-nuances-of-swift-extensions/
dsq_thread_id:
  - "3703791006"
categories:
  - Swift
tags:
  - Extensions
  - Swift

---
How often do we take an initial cursory look at some documentation, shake our heads and say, &#8220;Ok, sure! Got it!&#8221;, and then some time later get to the actual usage of that perceived understanding only to find out, &#8220;Woah &#8211; this is behaving differently than I expected! I wonder if the documentation says anything about this?!&#8221;

A few discussions I&#8217;ve had recently have prompted me to question what I thought I knew about Swift extensions. I have read documentation about extensions and I _thought_ I understood them pretty thoroughly. However, these conversations, along with some experimentation done on my own revealed a few nuances that I didn&#8217;t pick up on before.

**Update:** Almost immediately after publishing this article, the Swift community chimed in and helped me figure out my fundamental hiccup which prompted the aforementioned experimentation in the first place. I&#8217;ve written a follow-up article called [&#8220;Clarifying Swift Access Control&#8221;][1], describing that misunderstanding. I recommend giving that one a read to avoid making the same mistake I did!

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#3-nuances">Three nuances of extensions</a>
    </li>
    <li>
      <a href="#extension-visibility">Extensions and visibility into extended Type</a>
    </li>
    <ul>
      <li>
        <a href="#defined-same-file">Defined within same file</a>
      </li>
      <li>
        <a href="#defined-separate-file">Defined in a separate file</a>
      </li>
    </ul>
    
    <li>
      <a href="#default-acces-control">Default extension access control</a>
    </li>
    <ul>
      <li>
        <a href="#no-explicit-access-control">Default access when no explicit access modifiers specified</a>
      </li>
      <li>
        <a href="#default-declaration-public-implementation">Default access when using default extension declaration, but specify public for implementation</a>
      </li>
    </ul>
    
    <li>
      <a href="#related">You might also enjoy…</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="3-nuances" class="jump-target"></a>

### Three nuances of extensions

In particular, the following three nuances challenged what I thought I knew about Swift extensions:

  1. The visibility Swift extensions have into the Type they&#8217;re extending. Can they see things marked `private`, for example?
  2. How that visibility is affected by where the extension is defined. If I have the source for a Type that I&#8217;m writing an extension for, does defining it within that same source file vs defining it in a separate file affect what it can &#8220;see&#8221;?
  3. The default access modifiers of the extension&#8217;s &#8220;members&#8221; and how specifying them or _not_ specifying them affect what an extension exposes as public API for the Type it&#8217;s extending.

Before I begin, suppose that I have a public struct called `Person`. It has some private properties, `name`, `gender`, and `age`. An enum encapsulates the idea of `Gender`. The struct looks something like this:

<pre class="lang:swift decode:true " >public struct Person {
    private var name: String
    private var gender: Gender
    private var age: Int
    
    public init(name: String, gender: Gender, age: Int) {
        self.name = name
        self.gender = gender
        self.age = age
    }
    
    public func howOldAreYou() -> String {
        return formattedAge()
    }
    
    // private func, simply to show extension visibility traits in the analysis below...
    private func formattedAge() -> String {
        switch self.gender {
        case .Male:
            return "I'm \(self.age)."
        case .Female:
            return "Not telling."
        }
    }
    
    public enum Gender {
        case Male
        case Female
    }
}</pre>

Now, suppose that I wanted to extend `Person` and inspect the three nuances about the extension&#8217;s capabilities and behaviors that I introduced at the beginning of this article&#8230;

<a name="extension-visibility" class="jump-target"></a>

### Extensions and visibility into extended Type

When I introduced that first nuance about visibility into the extended Type, I asked the question, &#8220;Can they see things marked `private`?&#8221; The answer surprised me at first: _Yes_&#8230;they _can_.

However, here&#8217;s where the second nuance comes in: It absolutely does matter _where_ the extension is defined.

<a name="defined-same-file" class="jump-target"></a>

#### Defined within same file

Extensions defined within the same file as the Type they&#8217;re extending have access to `private` members of that Type.

For example, defining an extension to `Person` _within_ Person.swift allows the extension to access `private` properties and functions! Who knew?!

<pre class="lang:swift decode:true " >extension Person {
    func getAge() -&gt; Int {
        return age // compiles, even though age is --private--
    }
    
    func getFormattedAge() -&gt; String {
        return formattedAge() // compiles, even though formattedAge is --private--
    }
}</pre>

&#8220;What?? Why?&#8221;, I thought to myself&#8230;

My reasoning as to why extensions defined within the same file behave this way is because when it comes down to it, I could have just written the extension&#8217;s implementation as part of the Type itself and it would have had the same effect.

I&#8217;m _in the source file_ of the Type I&#8217;m &#8220;extending&#8221;. So whether I write the additional functionality as an extension for the Type, or just define what would have been in the extension _inside the Type, itself_, the net effect is the same.

Therefore, the compiler essentially says, &#8220;I see this extension being defined, but there&#8217;s really no point. It&#8217;s in the same file that the Type is defined in&#8230; so the developer _could have_ just written all this code within the Type itself&#8230; so I&#8217;ll let him/her refer to `private` code blocks.&#8221;

**Update:** My reasoning above reveals that I truly didn&#8217;t have an understanding of Swift access control. I recommend giving my followup article titled [&#8220;Clarifying Swift Access Control&#8221;][1] a read for more details!

<a name="defined-separate-file" class="jump-target"></a>

#### Defined in a separate file

Moving the extension definition into a separate file, however, causes the extension to lose that visibility into the Type it&#8217;s extending.

Following the inverse of my previous reasoning about `private` visibility when the extension is defined within the same file, this behavior actually makes sense to me.

Most of the time, you&#8217;d be writing an extension for Types that you _don&#8217;t_ have the source to. In that scenario, extensions would have the same visibility that any client of the Type&#8217;s exposed API would have, namely, the things marked `public`.

[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/04/PersonExtensions_swift.png" alt="PersonExtensions.swift" width="506" height="159" class="alignnone size-full wp-image-11731" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/04/PersonExtensions_swift.png 506w, https://www.andrewcbancroft.com/wp-content/uploads/2015/04/PersonExtensions_swift-300x94.png 300w" sizes="(max-width: 506px) 100vw, 506px" />][2]

<a name="default-acces-control" class="jump-target"></a>

### Default extension access control

The final nuance also yielded some semi-surprising results for me. [Apple&#8217;s documentation][3] says it, but until I experimented and saw it in action, I didn&#8217;t catch the nuance around the default access control modifiers applied to extensions.

<a name="no-explicit-access-control" class="jump-target"></a>

#### Default access when no explicit access modifiers specified

In short, when you declare an extension but specify no explicit access modifiers (ie, you just use the default), the extension&#8217;s default access level depends on the access level of the Type it&#8217;s extending.

  * If the Type is `public` or `internal`, the extension&#8217;s implementation &#8220;members&#8221; will be `internal` by default. The &#8220;surprise&#8221; for me I think is that extensions for `public` Types have `internal` members by default, unless you specify otherwise.
  * If the Type is `private`, the extension&#8217;s implementation &#8220;members&#8221; will be `private` by default.

Here&#8217;s what the extension looks like if we analyze it from the perspective of using no explicitly declared access modifiers (note that to gain access to private properties and functions, I&#8217;m declaring the extension within Person.swift):

<pre class="lang:swift decode:true " title="Person.swift" >public struct Person {
    // ...
    
    // ...
}

extension Person {
    func getAge() -&gt; Int {
        return age
    }
    
    func getFormattedAge() -&gt; String {
        return formattedAge()
    }
}</pre>

Using the default access modifiers as shown in the code snippet above exposes access to the extension&#8217;s new API to instances within the same module. However, it does _not_ expose additional public API for the Type it&#8217;s extending to a client of that Type that&#8217;s in another _module_ (for example, the unit test target, which is another Swift module).

**Same Module**  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/04/SameModule.png" alt="Extended API within the same module" width="505" height="264" class="alignnone size-full wp-image-11733" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/04/SameModule.png 505w, https://www.andrewcbancroft.com/wp-content/uploads/2015/04/SameModule-300x157.png 300w" sizes="(max-width: 505px) 100vw, 505px" />][4]

**Different Module (test target)**  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/04/DifferentModule.png" alt="Extended API in a different module" width="507" height="171" class="alignnone size-full wp-image-11734" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/04/DifferentModule.png 507w, https://www.andrewcbancroft.com/wp-content/uploads/2015/04/DifferentModule-300x101.png 300w" sizes="(max-width: 507px) 100vw, 507px" />][5]

For some reason, I had it in my head that if a Type that I&#8217;m extending is `public`, the extension&#8217;s members would default to `public`. I don&#8217;t know _why_ I thought that, but thankfully my experimentation cleared up!

<a name="default-declaration-public-implementation" class="jump-target"></a>

#### Default access when using default extension declaration, but specify public for implementation

Adding `public` access control modifiers to the extension implementation&#8217;s members makes those members visible everywhere (that is, both within the same module, and within the test target).

The location of the extension&#8217;s declaration, be it within the same source file as the Type it&#8217;s extending, or in a separate source file, does not matter in terms of what the extension exposes when adding `public` members&#8230; But only extensions declared within the same source file as the Type it&#8217;s extending can see `private` members of that Type, as we discovered previously.

**Extensions declared in same _and_ separate source files**  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/04/public_extension_members-1024x645.png" alt="Public extension members defined within the same source file, and in separate source files..." width="1024" height="645" class="alignnone size-large wp-image-11752" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/04/public_extension_members-1024x645.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/04/public_extension_members-300x189.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/04/public_extension_members.png 1061w" sizes="(max-width: 1024px) 100vw, 1024px" />][6]

**Public extension members visible in different module (test target)**  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/04/public_member_visibility.png" alt="Regardless of where the extension is declared, all public members are visible to  other modules (such as the test target)." width="533" height="353" class="alignnone size-full wp-image-11753" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/04/public_member_visibility.png 533w, https://www.andrewcbancroft.com/wp-content/uploads/2015/04/public_member_visibility-300x199.png 300w" sizes="(max-width: 533px) 100vw, 533px" />][7]

But notice that on the line where I&#8217;ve written `extension Person { ... }` that I haven&#8217;t specified an access control modifier for the extension, itself. I&#8217;ve only added `public` to its _members_. Even still, the new functions are visible to the test target which is a different module.

In other words, there&#8217;s no need to write `public extension Person { ... }`. Since `Person` is `public`, the extension just uses the Type&#8217;s access level for its own declaration.

### Wrapping up

The three nuances about Swift extensions that were analyzed here were &#8220;surprising&#8221; enough to me to warrant some experimentation. My hope is that the analysis that was done will help clear up these subtleties for others who are struggling with understanding how Swift extensions behave!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/11/03/the-5-ws-of-swift-extensions/" title="The 5 W’s of Swift Extensions">The 5 W’s of Swift Extensions</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/12/02/send-a-type-to-obedience-school-using-swift-extensions-for-additional-protocol-conformance/" title="Send a Type to Obedience School – Using Swift Extensions for Additional Protocol Conformance">Send a Type to Obedience School – Using Swift Extensions for Additional Protocol Conformance</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.andrewcbancroft.com/2015/04/24/clarifying-swift-access-control-hint-swift-isnt-c-sharp/ "Clarifying Swift Access Control (Hint:  Swift Isn’t C#)"
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2015/04/PersonExtensions_swift.png
 [3]: https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/AccessControl.html#//apple_ref/doc/uid/TP40014097-CH41-ID25
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2015/04/SameModule.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2015/04/DifferentModule.png
 [6]: http://www.andrewcbancroft.com/wp-content/uploads/2015/04/public_extension_members.png
 [7]: http://www.andrewcbancroft.com/wp-content/uploads/2015/04/public_member_visibility.png