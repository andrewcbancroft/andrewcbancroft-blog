---
title: Setting Up Carthage for the Terminal-Timid
author: Andrew
type: blog
date: 2015-07-30T04:05:05+00:00
url: /2015/07/29/setting-up-carthage-for-the-terminal-timid/
dsq_thread_id:
  - "3985208106"
categories:
  - Swift
tags:
  - Carthage
  - Homebrew
  - Swift

---
The old adage "Don't go reinventing the wheel&#8221; comes into play _often_ when developing software, doesn't it? Why build this [thing] ourselves when someone else has invented it already?

Fantastic libraries and frameworks exist out there to assist developers with common and sometimes even difficult problems. Whether it be an easier-to-use abstraction over the networking stack with [AFNetworking][1] or [AlamoFire][2], or adding a popular behavior-driven development testing framework like [Quick][3] to our workflow, we find ourselves constantly wanting to be able to take advantage of the things that others are doing in the community so we don't have to invent that wheel again ourselves.


<a name="need-dependency-management" class="jump-target"></a>

### The need for dependency management

With that comes the need for an easy way to manage external dependencies in our projects. We find the need to make sure that our projects have the right versions of whatever libraries or frameworks we're bringing in. We want to ensure that if we move to another machine or add folks to our teams that they can go and restore all those same external dependencies without a lot of hassle. Therein lies at least partial justification for the usage of dependency managers.

The long-running "king of the hill&#8221; of dependency management for iOS developers has been the ever-popular [CocoaPods][4]. However, there's a new kid on the block, and its picking up popularity. This "new&#8221; dependency manager is called [Carthage][5].

<a name="what-is-carthage" class="jump-target"></a>

### What is Carthage?

From the GitHub repository's main page for Carthage (emphasis mine):

> Carthage is intended to be the simplest way to add frameworks to your Cocoa application&#8230; Ultimately, we created Carthage because we wanted the **simplest tool possible**—a dependency manager that gets the job done **without taking over the responsibility of Xcode**, and **without creating extra work for framework authors**. 

I've used Carthage for simple tasks like bringing in Quick for unit testing. It delivers on the promise of being simple, but even in its simplicity, installing and using Carthage requires the use of the Terminal.

<a name="terminal-tension" class="jump-target"></a>

### Terminal tension

If you'll withhold judgement of this confession, I'll openly share that I'm not a whiz on the command line. I _have_ found that the more I spend time in the Terminal, the less timid I become. It's been a gradual transition into spending intentional time on the command line, but I share this to simply relate to those of you who, like me, find themselves thinking, "Really? All of this involves running commands in the Terminal? Ugh&#8230;&#8221;

Hang in there. Becoming proficient at this will take practice, but it's worth it. Carthage really does make your dependency management simpler and more shareable with your team. Even if you're working alone, I recommend investing the time to overcoming any anxiety you may have around the Terminal.

<a name="installing-carthage" class="jump-target"></a>

### Installing Carthage

So here's the deal: The folks on the Carthage team have actually made it pretty easy to install Carthage _without_ the Terminal. If you go to their [releases page on GitHub][6] and download + run the Carthage.pkg file for the latest release, you'll be set up. BUT, **Carthage is a command-line tool**, so to use it, you'll still need the Terminal.

With that in mind, I've decided to get used to working with this tool _totally_ from the command-line from the start, which means installing it from the Terminal window. There's a couple more steps involved, but I'd argue that it's good practice. If you're wanting to overcome your anxiety around the Terminal, skip the .pkg installation method and continue on.

<a name="terminal-installation" class="jump-target"></a>

### Terminal installation

Installing Carthage from the command line assumes that you have a package manager for OSX called ["Homebrew&#8221;][7] installed on your Mac. If you don't, you need it. And yes, _it_ involves the Terminal too, but don't worry – I've got you covered in the steps to follow. We'll use Homebrew to install Carthage which will be used to manage the external dependencies in our app.

<a name="installing-homebrew" class="jump-target"></a>

#### First things first – installing Homebrew

Installing Homebrew isn't complicated. It just involves knowing the command to run in the Terminal to get it downloaded and registered in your machine.

From the [Homebrew homepage][7] we learn that the installation simply requires us to type in the following in the Terminal:

`ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

Pasting in the command and pressing enter will immediately produce a _lot_ of stuff in the terminal window. It's okay. Don't panic.

It's simply letting you know what's about to happen if you agree to continue:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/homebrew_install_command.png" alt="Homebrew Install Command" width="580" height="364" class="alignnone size-full wp-image-12168" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/homebrew_install_command.png 580w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/homebrew_install_command-300x188.png 300w" sizes="(max-width: 580px) 100vw, 580px" />][8]

So it's going to&#8230;

  * Install some files into some directories on your computer.
  * Change the read-write permissions on some directories to be _group_ writable. This allows Homebrew to do its thing when you tell it to.
  * Change those same directories' group to **admin**. So these last two bullet points go together.

You're prompted to press &#8216;RETURN' to continue (or anything else to stop the installation). If you're good with the changes it describes to you, press &#8216;RETURN'.

Yikes! What's all this now?  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/sudo_permissions.png" alt="Elevate permissions using sudo" width="580" height="365" class="alignnone size-full wp-image-12169" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/sudo_permissions.png 580w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/sudo_permissions-300x189.png 300w" sizes="(max-width: 580px) 100vw, 580px" />][9]

Well, for the installation to continue, Homebrew needs to elevate the level of permissions it has in order write all the files it needs to write and to set all the permissions it needs to set. Under the hood, it's run a `sudo` command. It requires your password to authorize this elevation. Go ahead and type your password, and press &#8216;RETURN' to continue.

The installation will continue by downloading all of the necessary files and performing all the changes it said it'd make. When it's done, you'll get an "Installation Successful&#8221; message:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/install_successful.png" alt="Homebrew Installation Successful" width="586" height="367" class="alignnone size-full wp-image-12177" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/install_successful.png 586w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/install_successful-300x188.png 300w" sizes="(max-width: 586px) 100vw, 586px" />][10]

Sweet! To test it out, you can simply type `brew help` like it suggests in the line below the "Installation successful!&#8221; message. It should print out a bunch of stuff to the Terminal window, explaining how to use Homebrew:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/it_works.png" alt="It works!" width="581" height="366" class="alignnone size-full wp-image-12172" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/it_works.png 581w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/it_works-300x189.png 300w" sizes="(max-width: 581px) 100vw, 581px" />][11]

Well done! We can now use Homebrew to install Carthage. You can use it to install all kinds of other fantastic utilities as well, but for now we'll focus on the Carthage installation&#8230;

<a name="now-install-carthage" class="jump-target"></a>

#### Now to install Carthage

With Homebrew installed, we're almost there. From the [Carthage GitHub repository page][5], we learn what commands to run on the command line to get Carthage installed.

First, we run `brew update` to make sure that Homebrew is totally up-to-date. If you just installed Homebrew for the first time, you're probably good to go. Just to be safe though, go ahead and run it.  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Brew_Update.png" alt="Brew Update" width="582" height="363" class="alignnone size-full wp-image-12189" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Brew_Update.png 582w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Brew_Update-300x187.png 300w" sizes="(max-width: 582px) 100vw, 582px" />][12]

The last step is to run `brew install carthage`. Yes. It's that simple. Homebrew will take care of everything else for you! Here's the final result:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Brew_Install_Carthage.png" alt="Brew Install Carthage" width="580" height="362" class="alignnone size-full wp-image-12188" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Brew_Install_Carthage.png 580w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Brew_Install_Carthage-300x187.png 300w" sizes="(max-width: 580px) 100vw, 580px" />][13]

<a name="cartfiles" class="jump-target"></a>

### Cartfiles

Once Carthage is installed, it's time to create your Cartfile file. After I read [the documentation][5] on how to set this up, I found myself doubting whether I'd done it right, so again, to alleviate any fears our there around the mystery of what's going on I'll share what I've discovered.

First of all, the documentation merely says, "Create a Cartfile that lists the frameworks you’d like to use in your project.&#8221; I scratched my head and asked, "Okay – well, where? And should it have a file extension?&#8221;

The answers that worked for me were, "Somewhere in your Xcode project (I put it under Supporting Files)&#8221; and "No file extension&#8230;just the name Cartfile works&#8221;.

To demonstrate, here's a couple of screenshots depicting how to add a Cartfile to your Xcode project&#8230;

Simply add a new Empty file, found under iOS -> Other:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/New-empty-file-1024x409.png" alt="New empty file" width="1024" height="409" class="alignnone size-large wp-image-12191" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/New-empty-file-1024x409.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/New-empty-file-300x120.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/New-empty-file.png 1394w" sizes="(max-width: 1024px) 100vw, 1024px" />][14]

In the new file dialog, simply type in "Cartfile&#8221;, and press Create:  
[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Cartfile-create.png" alt="Cartfile -> Create" width="783" height="298" class="alignnone size-full wp-image-12192" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Cartfile-create.png 783w, https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Cartfile-create-300x114.png 300w" sizes="(max-width: 783px) 100vw, 783px" />][15]

### Wrapping up

This is where I'm going to stop for now and defer to the [Carthage GitHub documentation][5] to explain more about what exactly to put into the Cartfile and how to run the subsequent commands to grab the libraries and frameworks you list, and build them so that they can be added to your Xcode project. I may pick this back up again, but this guide was starting to get lengthy, and I felt that actually building the frameworks from a Cartfile could very well deserve isolated treatment for the sake of clarity. If you're interested in reading more on Carthage, sound off in the comments or shoot me an e-mail! Thanks for reading.

<a name="share" class="jump-target"></a>

 [1]: https://github.com/AFNetworking/AFNetworking
 [2]: https://github.com/Alamofire/Alamofire
 [3]: https://github.com/Quick/Quick
 [4]: https://cocoapods.org/
 [5]: https://github.com/Carthage/Carthage
 [6]: https://github.com/Carthage/Carthage/releases
 [7]: http://brew.sh/
 [8]: https://www.andrewcbancroft.com/wp-content/uploads/2015/07/homebrew_install_command.png
 [9]: https://www.andrewcbancroft.com/wp-content/uploads/2015/07/sudo_permissions.png
 [10]: https://www.andrewcbancroft.com/wp-content/uploads/2015/07/install_successful.png
 [11]: https://www.andrewcbancroft.com/wp-content/uploads/2015/07/it_works.png
 [12]: https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Brew_Update.png
 [13]: https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Brew_Install_Carthage.png
 [14]: https://www.andrewcbancroft.com/wp-content/uploads/2015/07/New-empty-file.png
 [15]: https://www.andrewcbancroft.com/wp-content/uploads/2015/07/Cartfile-create.png