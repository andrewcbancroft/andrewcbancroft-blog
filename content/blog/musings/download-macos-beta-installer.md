---
title: "Download macOS Beta Installer"
description: "Having trouble finding a macOS Beta installer? Look no further than these three steps!"
author: Andrew
type: blog
date: 2024-06-16T00:00:00+00:00
showrecent: true
draft: false
categories:
  - WWDC
images:
  - /images/social-assets/Twitter - Download macOS Beta Installer.png
  - /images/social-assets/Facebook - Download macOS Beta Installer.png
---

When you log into the Apple Developer portal, you can easily download a restore image (ipsw file) for beta versions of macOS, but it’s not helpful if you want to install macOS on a separate volume on your existing Mac.

The actual macOS installer is much more useful. The only issue is that it’s not exactly intuitive to download.

Here's how to do it:

## Step 1: Turn on Beta Updates

- Open the Settings app on your mac
- Click General
- Click Software Update
- Turn on Beta Updates for macOS Sequoia

## Step 2: Use Terminal to download the installer

- Open a terminal window
- Run `softwareupdate --download --fetch-full-installer --full-installer-version 15.0`

When you run that command, you'll see a message in the console:
> Scanning for 15.0 installer

If you skipped Step 1 and didn't already opt in to receiving beta updates from Apple, you may get an error message:
>Install failed with error: Update not found

If you've got Beta updates turned on though, you should see the softwareupdate utility begin to download the installer.

Don't worry if you see the words "Installing xx%". It's not actually going to update your primary operating system. 
It's actually just downloading the installer to your Applications folder.

## Step 3: Find the installer in your Applications folder

- Open Finder and navigate to your Applications folder
- You should be able to find the `Install macOS 15 beta` application if the download was successful

Once you’ve got the installer, you can install macOS on a separate volume on the same Mac that you’re running the currently-released version of macOS!