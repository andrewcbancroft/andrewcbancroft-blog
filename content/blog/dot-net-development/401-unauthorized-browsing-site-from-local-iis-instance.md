---
title: 401 Unauthorized Browsing Site From Local IIS Instance
author: Andrew
type: blog
date: 2016-01-21T17:16:23+00:00
aliases:
  - /2016/01/21/401-unauthorized-browsing-site-from-local-iis-instance/
dsq_thread_id:
  - "4511186774"
categories:
  - .Net Development
tags:
  - 401 Unauthorized
  - Authentication
  - IIS

---
I spent waaaaay way way way too long fighting this one, so I&#8217;m saving everything I found on the issue so that I never lose it.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#setup">Setup</a>
    </li>
    <li>
      <a href="#problem">Problem</a>
    </li>
    <li>
      <a href="#solution">Solution (with original sources)</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="setup" class="jump-target"></a>

### Setup

  * Running Internet Information Services (IIS) 8.5 on my laptop.
  * Set up a site with an ASP.Net MVC web application Windows Authentication.

<a name="problem" class="jump-target"></a>

### Problem

  * Browsing the site locally continually prompts for my domain username and password.
  * Credentials are never accepted / I&#8217;m never authenticated.
  * Cancelling the login prompt ultimately responds with 401 Unauthorized.

When accessing the site with Fiddler, IIS simply responds with 401 Unauthorized.

<a name="solution" class="jump-target"></a>

### Solution (with original sources)

An incredibly helpful StackOverflow titled [Unable to get windows authentication to work through local IIS][1] provided the solution.

_Its_ source was a KnowledgeBase article from Microsoft: <https://support.microsoft.com/en-us/kb/896861>

  1. Set the  
    DisableStrictNameChecking  
    registry entry to 1. For more information about how to do this, refer to article [281308][2] in the Microsoft Knowledge Base
  2. Click Start, click Run, type regedit, and then click OK.
  3. In Registry Editor, locate and then click the following registry key:  
    **HKEY\_LOCAL\_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\MSV1_0**
  4. Right-click **MSV1_0**, point to New, and then click Multi-String Value.
  5. Type **BackConnectionHostNames**, and then press ENTER.
  6. Right-click BackConnectionHostNames, and then click Modify.
  7. In the Value data box, type the host name or the host names for the sites that are on the local computer, and then click OK.
  8. Quit Registry Editor, and then restart the IISAdmin service. (to do this, I ran iisreset from a Powershell prompt)

<a name="share" class="jump-target"></a>

 [1]: http://stackoverflow.com/questions/7387156/unable-to-get-windows-authentication-to-work-through-local-iis
 [2]: http://support.microsoft.com/kb/281308