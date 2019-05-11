---
title: Disabling Xcode’s OS-Level Debug Logging
author: Andrew
type: blog
date: 2016-10-28T05:06:19+00:00
aliases:
  - /2016/10/28/disabling-xcode-os-level-debug-logging/
dsq_thread_id:
  - "5259438419"
categories:
  - iOS / Mac
tags:
  - Debug
  - Logging
  - Xcode 8

---
Full credit to [Russell Ivanovic][1] for his [tweet][2] for figuring out how to disable Xcode 8&#8217;s extremely chatty debug console logging. I just wanted this here for my own reference, but perhaps it&#8217;s helpful to you as well.

If you&#8217;re tired of sifting through operating system-level logging to the debug console while you&#8217;re debugging your app, it&#8217;s actually fairly easy to silence.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#edit-scheme">Edit the scheme for your app</a>
    </li>
    <li>
      <a href="#new-environment-variable">Add a new environment variable for OS_ACTIVITY_MODE</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="edit-scheme" class="jump-target"></a>  
1. Edit the scheme for your app:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-2.png" alt="Edit Scheme" width="529" height="182" class="alignnone size-full wp-image-13064" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-2.png 529w, https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-2-300x103.png 300w" sizes="(max-width: 529px) 100vw, 529px" />][3]

<a name="new-environment-variable" class="jump-target"></a>  
2. In the &#8216;Run&#8217; section, click on &#8216;Arguments&#8217; tab, and add a new Environment Variable. Use `OS_ACTIVITY_MODE` for the name, and `disable` for the value:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-4.png" alt="New Environment Variable" width="895" height="506" class="alignnone size-full wp-image-13068" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-4.png 895w, https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-4-300x170.png 300w" sizes="(max-width: 895px) 100vw, 895px" />][4]

That&#8217;s it! Closing the Scheme editor and re-running your app will produce a beautifully silent console window, leaving you free to see what you wanted to see with `print()`, or other app-specific info (such as runtime exceptions) without having to sift through all that OS-level logging.

<a name="share" class="jump-target"></a>

 [1]: https://twitter.com/rustyshelf
 [2]: https://twitter.com/rustyshelf/status/775505191160328194
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-2.png
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-4.png