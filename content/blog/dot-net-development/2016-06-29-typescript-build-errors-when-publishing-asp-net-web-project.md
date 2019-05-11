---
title: TypeScript Build Errors When Publishing ASP.Net Web Project
author: Andrew
type: blog
date: 2016-06-29T18:41:59+00:00
url: /2016/06/29/typescript-build-errors-when-publishing-asp-net-web-project/
dsq_thread_id:
  - "4948701286"
categories:
  - .Net Development
tags:
  - TypeScript

---
I had TypeScript files building and running perfectly when I&#8217;d debug locally, but when I changed over to publish the project, I got build errors galore:

> Cannot find module \___
> 
> TS6053 &#8211; File \___ not found 

I had forgotten that I set up my TypeScript Build configuration for _Debug_, but I hadn&#8217;t changed anything for the _Release_ configuration in Visual Studio.

Obviously, that would produce different build results, right? It was just a little mysterious to me until I noticed the configuration differences.

If you&#8217;re running into similar errors when building / publishing your project using the Release configuration, right-click your ASP.Net web project, go down to TypeScript Build, and make sure that your configuration settings are the same between Debug and Release. In particular, my &#8220;Module System&#8221; settings were different until I adjusted things.

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2016/06/2016-06-29_13-39-22.png" alt="TypeScript Configuration" width="830" height="714" class="alignnone size-full wp-image-12988" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2016/06/2016-06-29_13-39-22.png 830w, https://www.andrewcbancroft.com/wp-content/uploads/2016/06/2016-06-29_13-39-22-300x258.png 300w" sizes="(max-width: 830px) 100vw, 830px" />][1]

 [1]: https://www.andrewcbancroft.com/wp-content/uploads/2016/06/2016-06-29_13-39-22.png