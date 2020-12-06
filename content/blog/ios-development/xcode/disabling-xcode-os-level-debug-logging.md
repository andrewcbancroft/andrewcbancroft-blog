---
title: Disabling Xcode’s OS-Level Debug Logging
author: Andrew
type: blog
date: 2016-10-28T05:06:19+00:00
url: /2016/10/28/disabling-xcode-os-level-debug-logging/
dsq_thread_id:
  - "5259438419"
categories:
  - iOS / Mac
tags:
  - Debug
  - Logging
  - Xcode 8
dispiosgettingstartedbadge: true
---
Full credit to [Russell Ivanovic][1] for his [tweet][2] for figuring out how to disable Xcode 8's extremely chatty debug console logging. I just wanted this here for my own reference, but perhaps it's helpful to you as well.

If you're tired of sifting through operating system-level logging to the debug console while you're debugging your app, it's actually fairly easy to silence.


<a name="edit-scheme" class="jump-target"></a>  
1. Edit the scheme for your app:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-2.png" alt="Edit Scheme" width="529" height="182" class="alignnone size-full wp-image-13064" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-2.png 529w, https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-2-300x103.png 300w" sizes="(max-width: 529px) 100vw, 529px" />][3]

<a name="new-environment-variable" class="jump-target"></a>  
2. In the &#8216;Run' section, click on &#8216;Arguments' tab, and add a new Environment Variable. Use `OS_ACTIVITY_MODE` for the name, and `disable` for the value:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-4.png" alt="New Environment Variable" width="895" height="506" class="alignnone size-full wp-image-13068" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-4.png 895w, https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-4-300x170.png 300w" sizes="(max-width: 895px) 100vw, 895px" />][4]

That's it! Closing the Scheme editor and re-running your app will produce a beautifully silent console window, leaving you free to see what you wanted to see with `print()`, or other app-specific info (such as runtime exceptions) without having to sift through all that OS-level logging.

<a name="share" class="jump-target"></a>

 [1]: https://twitter.com/rustyshelf
 [2]: https://twitter.com/rustyshelf/status/775505191160328194
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-2.png
 [4]: https://www.andrewcbancroft.com/wp-content/uploads/2016/10/DataHelper_swift-4.png