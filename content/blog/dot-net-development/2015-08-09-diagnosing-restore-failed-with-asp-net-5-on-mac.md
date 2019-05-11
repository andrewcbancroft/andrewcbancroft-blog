---
title: Diagnosing “Restore failed” with ASP.NET 5 on Mac
author: Andrew
type: blog
date: 2015-08-09T20:57:02+00:00
url: /2015/08/09/diagnosing-restore-failed-with-asp-net-5-on-mac/
dsq_thread_id:
  - "4017913045"
categories:
  - .Net Development
tags:
  - ASP.Net MVC
  - Mac
  - Mono

---
Following along with Steve Smith&#8217;s [&#8220;Your First ASP.NET 5 Application on a Mac&#8221;][1], I found myself frustrated that, despite all my efforts, the simple little sample project I was trying to get running just wouldn&#8217;t work due to a problem with restoring the project&#8217;s dependencies.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#retracing-steps">Retracing my steps</a>
    </li>
    <li>
      <a href="#mis-matched-mono">Mis-matched Mono versions</a>
    </li>
    <li>
      <a href="#resolved">Resolved</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="retracing-steps" class="jump-target"></a>

### Retracing my steps

I [got ASP.NET installed on my Mac][2], and I even got a cool little template going using [Yeoman][3].

I opened up my scaffolded project using Visual Studio Code, and began the dependency restore process. But it failed. So I troubleshooted (troubleshot?), and it failed some more.

&#8220;Restore failed Unknown header: 3208085783&#8221;.

I found David Fowler&#8217;s [&#8220;Diagnosing Dependency Issues with ASP.NET 5&#8221;][4], but none of the things he mentioned helped resolve my exact issue. But something he said, caused me to think:

> Make sure your DNX and packages are on the same version &#8220;train&#8221; 

My issue wasn&#8217;t with DNX, but with **Mono**.

<a name="mis-matched-mono" class="jump-target"></a>

### Mis-matched Mono versions

When I followed the instructions for installing ASP.NET, I distinctly remember installing Mono using the installer package available at their website.

What I _failed_ to realize, however, was that a while back (long enough ago to where it didn&#8217;t hit me until just a few minutes ago), I installed Mono using Homebrew.

So despite my efforts to install Mono using the installer package, the Mono that everything in my system was using was the one installed by Homebrew, which was version 3.10.

<a name="resolved" class="jump-target"></a>

### Resolved

To resolve the issue, I went ahead and just ran `brew upgrade mono`.

Verifying that Mono was successfully upgraded via a `mono --version` command, I retried the dependency restoration in my scaffolded ASP.NET 5 application.

The result?

`dnu restore` produced a wonderfully green, &#8220;Restore complete&#8221;!

<a name="share" class="jump-target"></a>

 [1]: http://docs.asp.net/en/latest/tutorials/your-first-mac-aspnet.html
 [2]: http://docs.asp.net/en/latest/getting-started/installing-on-mac.html
 [3]: http://yeoman.io/
 [4]: http://davidfowl.com/diagnosing-dependency-issues-with-asp-net-5/