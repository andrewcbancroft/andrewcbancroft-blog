---
title: Parse PFCloud – “JSON text did not start with array or object”
author: Andrew
type: blog
date: 2016-05-20T03:33:03+00:00
url: /2016/05/19/parse-pfcloud-json-text-did-not-start-with-array-or-object/
dsq_thread_id:
  - "4842254669"
categories:
  - Swift
tags:
  - Parse
  - Parse Migration
  - Swift

---
It&#8217;s always the little things that lead to flatter foreheads (or at least it is for me).

Banging my head against the desk this evening working on a Parse migration, I finally figured out what was causing an error condition in a `PFCloud` function call.

The request to the server succeeded, but the response was malformed somehow:

> Error Domain=NSCocoaErrorDomain Code=3840 &#8220;JSON text did not start with array or object and option to allow fragments not set.&#8221; UserInfo={NSDebugDescription=JSON text did not start with array or object and option to allow fragments not set.} 

&#8220;What?? I _know_ the response is supposed to be JSON &#8211; I can even test it out and it works great in [Postman][1].&#8221;

Weeeelll, it turns out that if you don&#8217;t get the URL to your self-hosted Parse Server correct, you&#8217;re going to get a response that&#8217;s not JSON. Doh!

I had left off the &#8220;/parse&#8221; portion of the URL to my self-hosted parse server:

<pre class="lang:swift mark:6 decode:true " title="AppDelegate.swift" >func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject : AnyObject]?) -&gt; Bool {
    // Override point for customization after application launch.
    let configuration = ParseClientConfiguration {
        $0.applicationId = "YourAppId"
        $0.clientKey = "YourClientKey"
        $0.server = "https://your-self-hosted-parse-server/parse"
    }
    Parse.initializeWithConfiguration(configuration)
    
    return true
}</pre>

So, the bottom-line take-away? Make sure you get the _full_ URL to your self-hosted Parse Server set to the `server` property of your `ParseClientConfiguration` instance. That endpoint could vary based on how you deployed the server to your cloud host of choice. For me, it was my goofy mistake of leaving off &#8220;/parse&#8221;.

Go forth and may your forehead be ever-more round than mine.

 [1]: https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en