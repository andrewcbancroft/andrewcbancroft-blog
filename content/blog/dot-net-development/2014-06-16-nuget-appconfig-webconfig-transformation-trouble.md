---
title: NuGet app.config / web.config Transformation Trouble
author: Andrew
type: blog
date: 2014-06-16T17:57:20+00:00
url: /2014/06/16/nuget-appconfig-webconfig-transformation-trouble/
spacious_page_layout:
  - default_layout
dsq_thread_id:
  - "2809822327"
categories:
  - .Net Development
tags:
  - app.config
  - NuGet
  - NuGet Transformations
  - web.config

---
I recently hit a road bump when developing a NuGet package. Mid-way through making the package, I decided I wanted to include couple of transforms to add some default connection strings to an app.config or a web.config file.  Try as I may, I couldn&#8217;t get NuGet to apply the transforms to my project&#8217;s web.config file even though I was following <a title="NuGet Configuration File and Source Code Transformations Documentation" href="http://docs.nuget.org/docs/creating-packages/configuration-file-and-source-code-transformations" target="_blank">NuGet documentation&#8217;s</a> instructions to a tee.

It turns out that my problem was related to about 3 things all working together in tandem to defeat me:

**First**, the project I was testing the installation of this NuGet package on was already checked into source control (TFS).  To test out the package, I would install it and when things didn&#8217;t work how I wanted, I&#8217;d just &#8220;undo pending changes&#8221; to get everything back to the last stable state.  Or so I thought (more on this in a moment)&#8230;

**Second**, I had the idea to add app.config.transform and web.config.transform files to my NuGet package Content folder _after_ I&#8217;d already installed &#8220;version 1&#8221; of the package in my project, and rather than bump the version of the package with the transforms in it _up_, I left it the same because I was still technically editing and troubleshooting the first version of the package (in my mind anyways).

**Third**, my solution was configured for &#8220;NuGet Package Restore&#8221;:

[<img class="alignnone wp-image-1201 size-full" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/06/Enable-NuGet-Package-Restore.png" alt="Enable NuGet Package Restore" width="632" height="514" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/06/Enable-NuGet-Package-Restore.png 632w, https://www.andrewcbancroft.com/wp-content/uploads/2014/06/Enable-NuGet-Package-Restore-300x243.png 300w" sizes="(max-width: 632px) 100vw, 632px" />][1]

#### So what was going on?

Choosing &#8220;Enable NuGet Package Restore&#8221; keeps your NuGet packages folder contents from being checked into source control by adding a NuGet config file with a setting disabling source control integration.  We&#8217;d rather just let NuGet restore them if they&#8217;re missing when we build, rather than check in the packages folder to source control.

What this meant for me, however, is that all my &#8220;undo pending changes&#8221; actions were doing absolutely nothing to undo the installation of the NuGet package I was developing and troubleshooting.  My troubleshooting workflow of [Install package -> Check web.config -> :[ _Still_ missing connection strings -> Undo pending changes -> Fiddle with NuGet Package -> Rinse and repeat] could have been infinite, because the &#8220;undo pending changes&#8221; step wasn&#8217;t undoing the NuGet package installation, because _the NuGet package files weren&#8217;t part of the pending change set _due to my &#8220;Enable NuGet Package Restore&#8221; setting.  The NuGet package was still in the packages folder on my hard disk, which had another hidden consequence: each subsequent &#8220;installation&#8221; of the NuGet package effectively did nothing because it was already there.  Remember, I didn&#8217;t bump the version number of the package, so I&#8217;m guessing NuGet already saw the files there and just updated the config file and called it good.  None of the updates I was making to the package were ever updated.

#### Solution?

I went back to the last stable checked-in state for my solution.  
Next, I navigated to my solution folder by right-clicking my solution and choosing &#8220;Open Folder in File Explorer&#8221;:

[<img class="alignnone wp-image-1271 " src="http://www.andrewcbancroft.com/wp-content/uploads/2014/06/Open-Folder-in-File-Explorer.png" alt="Open Folder in File Explorer" width="381" height="407" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/06/Open-Folder-in-File-Explorer.png 500w, https://www.andrewcbancroft.com/wp-content/uploads/2014/06/Open-Folder-in-File-Explorer-280x300.png 280w" sizes="(max-width: 381px) 100vw, 381px" />][2]

I double-clicked on the packages folder:

[<img class="alignnone  wp-image-1281" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/06/Packages-Folder.png" alt="Packages Folder" width="586" height="199" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/06/Packages-Folder.png 727w, https://www.andrewcbancroft.com/wp-content/uploads/2014/06/Packages-Folder-300x101.png 300w" sizes="(max-width: 586px) 100vw, 586px" />][3]

Finally, I deleted the folder for the package I was developing.

After these steps were performed, installing the NuGet package again worked perfectly &#8211; the config transforms were applied and life was good.

Alternatively, I suppose I could have upped the version number of my package and things would have been fine as well.  But I always tend to make things more complicated than they need to be. :]

&nbsp;

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2014/06/Enable-NuGet-Package-Restore.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2014/06/Open-Folder-in-File-Explorer.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2014/06/Packages-Folder.png