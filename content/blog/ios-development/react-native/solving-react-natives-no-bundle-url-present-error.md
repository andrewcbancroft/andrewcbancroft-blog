---
title: Solving React Native’s “No bundle url present” Error
author: Andrew
type: blog
date: 2017-04-22T17:49:11+00:00
url: /2017/04/22/solving-react-natives-no-bundle-url-present-error/
dsq_thread_id:
  - "5750304253"
categories:
  - iOS / Mac
tags:
  - React Native

---
I hit the "No bundle url present.&#8221; roadblock today and had to dig a bit to find the solution. I'm going to describe how I encountered the problem, and provide the solution that's worked more than once for me, ever since I found the suggestion in the React Native GitHub repository.

<a name="problem" class="jump-target"></a>

# The Problem

  * You've got a React Native app.
  * In the terminal, you run `react-native run-ios`.

In the simulator, you hit a roadblock with the following error in a bright red screen:

> No bundle url present. Make sure you're running a packager server or have included a .jsbundle file in your application bundle. 

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/Glass.png" alt="No bundle URL present" width="370" height="666" class="alignnone size-full wp-image-13258" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/04/Glass.png 370w, https://www.andrewcbancroft.com/wp-content/uploads/2017/04/Glass-167x300.png 167w" sizes="(max-width: 370px) 100vw, 370px" />][1]

<a name="solution" class="jump-target"></a>

# The Solution

Buried [in the comments][2] of one of the React Native repo's issues on GitHub, I found a solution that worked for me&#8230;

  * Open a terminal window
  * `cd` into `YOUR_PROJECT/ios`
  * Remove the build folder with `rm -r build`
  * Run `react-native run-ios` again

Alternatively, you could open Finder, navigate to `YOUR_PROJECT/ios` and delete the `build` folder. Then run `react-native run-ios` again.

I'm not sure what causes this (that bothers me), but but at least I've found something to get me going again.

<a name="share" class="jump-target"></a>

 [1]: https://www.andrewcbancroft.com/wp-content/uploads/2017/04/Glass.png
 [2]: https://github.com/facebook/react-native/issues/12754