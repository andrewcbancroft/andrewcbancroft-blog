---
title: DotNetZip – Solving Mac Decompression Issues
author: Andrew
type: blog
date: 2013-12-28T20:55:27+00:00
aliases:
  - /2013/12/28/dotnetzip-solving-mac-decompression-issues/
dsq_thread_id:
  - "2698608455"
categories:
  - .Net Development
tags:
  - DotNetZip
  - Mac
  - Troubleshooting

---
As part of a ASP.Net Web API service that I'm co-developing, I have gotten familiar with the <a title="DotNetZip Codeplex Page" href="http://dotnetzip.codeplex.com/" target="_blank">DotNetZip Library</a>.&nbsp; It's fantastic.&nbsp; We're using it to gather up a set of requested files from network storage, package them in a zip archive, and stream them back to a client via a web application.

During testing, things worked great on Windows machines, but the moment we tested using a Mac, we ran into issues.

## Synopsis:

Problem:&nbsp; On a Mac, a zip file would be downloaded, but it could not be extracted.&nbsp; Double-clicking the zip file resulted in the creation of a .cpgz file.

Solution:&nbsp; In ASP.Net code, change

HttpContext.Current.Response.ContentType = &#8220;application/zip&#8221;

to

HttpContext.Current.Response.ContentType = &#8220;application/octet-stream&#8221;

## Problem Details:

A zip archive would download as normal, but as things were wrapping up, Safari would try to decompress the file and it would fail.

Error from Safari's download manager area:

[<img class="alignnone size-medium wp-image-585" style="src=&quot;http://andrewcbancroft.azurewebsites.net/wp-content/uploads/2013/10/DecompressionFailed-300x43.png&quot;" width="300" height="43" />][1]

Furthermore, when attempting to simply extract the files directly using the built in Mac Archive Utility (by double-clicking the zip file), the utility would actually re-archive the file, rather than extract it.&nbsp; The end result was the creation of a .cpgz file.&nbsp; Attempting to decompress _that_ file would result in creating another .zip file, which, when double-clicked, created another .cpgz file, and so on, and so on.

Archive Utility re-archiving the zip file when double-clicked (rather than _un_-archiving it)

[<img class="alignnone size-medium wp-image-586" alt="Screen Shot 2013-10-10 at 4.13.48 PM" src="http://andrewcbancroft.azurewebsites.net/wp-content/uploads/2013/10/Screen-Shot-2013-10-10-at-4.13.48-PM-300x106.png" width="300" height="106" />][2]

Creation of .cpgz file:

[<img class="alignnone size-full wp-image-584" alt="Created_cpgz_file" src="http://andrewcbancroft.azurewebsites.net/wp-content/uploads/2013/10/Created_cpgz_file.png" width="280" height="22" />][3]

Needless to say, the solution to this problem, though somewhat mysterious, was quite simple for me.

In my ASP.Net code, I was writing the zip file to the Response OutputStream.&nbsp; I had added a content type of &#8220;application/zip&#8221; to the response.&nbsp; This is what was breaking the zip files on a Mac.&nbsp; Buried <a title="DotNetZip Library Forum" href="http://dotnetzip.codeplex.com/discussions/59740" target="_blank">in the DotNetZip Library's forum was a post</a> recommending changing the content type to &#8220;application/octet-stream&#8221; instead.&nbsp; That single changed fixed the issue for standard zip files!

## Solution Details:

Change

HttpContext.Current.Response.ContentType = &#8220;application/zip&#8221;

to

HttpContext.Current.Response.ContentType = &#8220;application/octet-stream&#8221;

 [1]: http://andrewcbancroft.azurewebsites.net/wp-content/uploads/2013/10/DecompressionFailed.png
 [2]: http://andrewcbancroft.azurewebsites.net/wp-content/uploads/2013/10/Screen-Shot-2013-10-10-at-4.13.48-PM.png
 [3]: http://andrewcbancroft.azurewebsites.net/wp-content/uploads/2013/10/Created_cpgz_file.png