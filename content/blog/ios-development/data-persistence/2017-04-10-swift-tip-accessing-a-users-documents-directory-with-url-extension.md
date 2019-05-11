---
title: Swift Tip – Accessing a User’s Documents Directory with URL Extension
author: Andrew
type: blog
date: 2017-04-10T18:01:23+00:00
url: /2017/04/10/swift-tip-accessing-a-users-documents-directory-with-url-extension/
dsq_thread_id:
  - "5713730623"
categories:
  - Swift
tags:
  - Swift Extension

---
When you need to access the documents directory on a user&#8217;s device, what do you do?

In the past, I know I&#8217;ve gotten used to typing out the same set of code over and over throughout my apps. I know, I know &#8211; DRY &#8211; _don&#8217;t repeat yourself_.

One way to simplify this is to use a Swift extension to `URL`. Doing this will help you centralize where this code is located in your app, and keep your code DRY. If you need to access the documents directory in more than one spot, you&#8217;re just a `URL` property call away from it.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#implementation">Extension implementation</a>
    </li>
    <li>
      <a href="#usage">Extension usage</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="implementation" class="jump-target"></a>

# Extension implementation

<pre class="lang:swift decode:true " title="Documents Directory Snippet" >extension URL {
    static var documentsURL: URL {
        return try! FileManager
            .default
            .url(for: .documentDirectory, 
                 in: .userDomainMask, 
                 appropriateFor: nil, 
                 create: true)
    }
}</pre>

<a name="usage" class="jump-target"></a>

# Extension usage

Here&#8217;s an example of using the extension during the routine to create the Core Data stack. For that process, you need to grab a URL to where your SQLite database file will be located. Take a look:

<pre class="lang:swift decode:true " >// ...

let storeURL = URL.documentsURL.appendingPathComponent("AppDatabase.sqlite")

// use the URL
</pre>

You could be needing to access the directory for saving files or retrieving files totally unrelated to Core Data. No matter what you&#8217;re doing, being able to write `URL.documentsURL` is pretty convenient!

<a name="share" class="jump-target"></a>