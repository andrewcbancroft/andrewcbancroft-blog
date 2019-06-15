---
title: "Resolving Failed to Load Model Named... with Core Data"
description: "Offers a few possibilities on how to resolve a Core Data error: Failed to load model named..."
author: Andrew
type: blog
date: 2019-06-06T04:40:54+00:00
categories:
  - Core Data
wip: false
showrecent: false
images:
  - /images/social-assets/Twitter - Resolving Failed to Load Model Named... with Core Data.png
  - /images/social-assets/Facebook - Resolving Failed to Load Model Named... with Core Data.png
---

You've done the work to get your Core Data model ready, but right when you hit run, *wham*.  Your debug output log shows:

> Failed to load model named **ModelName**

You you may experience one of these when you attempt to access your persistent container:

> Fatal error: Unexpectedly found nil while implicitly unwrapping an Optional value

What in the world is going on?

## Double-check Target Membership
This is particularly important if you happend to have copied and pasted and `.xcdatamodeld` file between projects.

![Check Target Membership](target-membership.png)

## Double-check Model Name
Your model name needs to match throughout the various places you refer to it.  Things can get out of sync if you ever rename your model.

Check to make sure that the following all match:

* **YourModelName**.xcdatamodeld
* let container = NSPersistentContainer(name: "**YourModelName**")

![Model Names Must Match](match-model-names.png)