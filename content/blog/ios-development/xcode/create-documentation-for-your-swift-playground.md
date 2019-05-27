---
title: Create Documentation for your Swift Playground
author: Andrew
type: blog
date: 2014-09-10T03:44:16+00:00
url: /2014/09/09/create-documentation-for-your-swift-playground/
dsq_thread_id:
  - "3003965697"
categories:
  - iOS / Mac
  - Swift
tags:
  - Documentation
  - Playground
  - Swift

---
As I opened Apple's latest <a title="Apple Swift Developer Blog - Patterns Playground" href="https://developer.apple.com/swift/blog/?id=13" target="_blank">"Patterns Playground&#8221; blog post</a>, I was impressed with the look and feel.  Rather than create the documentation as comment blocks, they managed to put in sharp-looking notes and explanations before each code example / experiment.  It's like an interactive book, reminiscent of the Swift Programming Language iBook!  Here's a snippet of what their Playground looks like:

[<img class="alignnone size-large wp-image-4771" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Patterns_playground-1024x511.png" alt="Apple's Patterns Playground" width="730" height="364" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Patterns_playground-1024x511.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Patterns_playground-300x149.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/Patterns_playground.png 1080w" sizes="(max-width: 730px) 100vw, 730px" />][1]

Of course, my immediate question / thought was, "How'd they _do_ that?!  Can _I_ do that?  I want to do that!&#8221;.  I didn't know it at the time of this publication, but apparently Apple has some <a title="Apple Developer Documentation - Interactive Learning Playgrounds" href="https://developer.apple.com/library/prerelease/ios/documentation/Swift/Reference/Playground_Ref/Chapters/InteractiveLearning.html" target="_blank">pre-release documentation out on developer.apple.com</a>, detailing how all this is done.  I (as usual) did it the hard way and hacked my way through it.  I figured I'd go ahead and share my discoveries alongside the official documentation from Apple.

I'm already a believer in using Playgrounds for teaching.  The read-example-experiment loop is so easy in the Playground environment.  I think using this documentation technique has the potential to enhance the Playground experience _even more_ to create professional, sharp-looking educational material_.  _

For this post, I wanted to take a simple example (the File -> New Playground playground) and convert the comment-style documentation into "fancy&#8221; documentation.

### Before:

[<img class="alignnone size-large wp-image-4751" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_before-1024x108.png" alt="Before view of Playground" width="730" height="76" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_before-1024x108.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_before-300x31.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_before.png 1142w" sizes="(max-width: 730px) 100vw, 730px" />][2]

### After:

[<img class="alignnone size-large wp-image-4761" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_after-1024x239.png" alt="After view of Playground" width="730" height="170" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_after-1024x239.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_after-300x70.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_after.png 1139w" sizes="(max-width: 730px) 100vw, 730px" />][3]

Let's explore.

## The Gist

  1. Create yourself a playground (and note where you save it).
  2. Navigate to where the .playground file is saved in Finder.
  3. Right-click the .playground file, and choose "Show Package Contents&#8221;.
  4. Add a new folder named "Documentation&#8221;.
  5. Create a new HTML file in the Documentation folder.  It should contain the HTML markup and the text explanation that you'd like to enhance your playground with.  Make sure it is a well-formed HTML document by the time you're finished creating it. I describe a quick way to jumpstart your documentation process at the end of this article&#8230;
  6. Although optional, I'd recommend styling your HTML file with appropriate CSS.  Adding a CSS file and referencing it within the HTML file you created is probably a good idea (and this is allowed for Playground documentation).
  7. Open contents.xcplayground with the text editor of your choice by right-clicking and choosing "Open With&#8221;.
  8. Modify the XML so that the <sections> element contains a <span class="lang:default decode:true  crayon-inline "><documentation></span> node as shown in the highlighted code lines in the example below.  Be sure to replace the relative-path value with the name of the HTML file you created in step 5 (I named mine "doc-fragment-0.html&#8221;): <pre class="lang:xhtml mark:2-3 decode:true " title="contents.xcplayground Snippet">&lt;sections&gt;
        &lt;documentation relative-path='doc-fragment-0.html'&gt;
        &lt;/documentation&gt;
        &lt;code source-file-name='section-2.swift'/&gt;
&lt;/sections&gt;
```

  9.  Save, and open the playground in Xcode 6.  Your Playground should now contain documentation!

As a way to jump-start my own Playground documentation, I simply borrowed one of the HTML files and the CSS file from Apple's Patterns Playground.  Then I modified the markup to contain the educational material I wanted for _my_ playground, customized the styles to what I wanted, added the <span class="lang:default decode:true  crayon-inline "><documentation></span> node to the contents.xcplayground file, saved, and voila:  Fancy documentation!

&nbsp;

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2014/09/Patterns_playground.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_before.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2014/09/MyPlayground_WithDocumentation_playground_after.png