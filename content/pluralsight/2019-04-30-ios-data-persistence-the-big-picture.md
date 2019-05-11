---
title: 'iOS Data Persistence: The Big Picture'
author: Andrew
type: blog
date: 2019-04-30T10:03:33+00:00
url: /2019/04/30/ios-data-persistence-the-big-picture/
categories:
  - Pluralsight
  - Swift
tags:
  - CloudKit
  - Codable
  - Core Data
  - Firebase
  - iOS
  - Property Lists
  - Realm
  - UIDocument
  - UserDefaults

---
We&#8217;ve all been there. Do a search on the topic of &#8220;saving data in iOS&#8221; and you&#8217;ll get _dozens_ of search results mentioning at least six different frameworks and platforms, and a month’s worth of reading.

Wouldn&#8217;t it be nice to distill the possibilities down into _just what you need_ in order to start down a path for persisting data in your app?

&#8220;[iOS Data Persistence: The Big Picture][1]&#8221; will be worth the hour of your time.

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-video-camera"></i> <a href="http://bit.ly/ios-data-persistence-bp" target="_blank">iOS Data Persistence: The Big Picture</a><a href="http://bit.ly/ios-data-persistence-bp" target="_blank"><br /> <img src="https://www.andrewcbancroft.com/wp-content/uploads/2019/04/ios-data-persistence-big-picture.001-1024x576.png" alt="iOS Data Persistence: The Big Picture" width="1024" height="576" class="alignnone size-large wp-image-13737" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2019/04/ios-data-persistence-big-picture.001-1024x576.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2019/04/ios-data-persistence-big-picture.001-300x169.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2019/04/ios-data-persistence-big-picture.001-768x432.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2019/04/ios-data-persistence-big-picture.001.png 1280w" sizes="(max-width: 1024px) 100vw, 1024px" /></a>
    </li>
  </ul>
</div>

# Course Outline

During this one hour course, you will learn the _reasons_ for saving data to help ground you as you begin to traverse the data persistence landscape.

You will discover how to use technologies like **User Defaults** and **Property Lists**, and I will guide you on how to work with Swift’s **Encodable** and **Decodable** protocols.

You will understand what you’re getting into if you choose to work with **SQLite**, **Core Data**, or **Realm Database** for local data persistence.

You will know how it feels to reach for a remote data storage option like **CloudKit**, **Realm Platform**, or **Firebase**.

Finally, you will see a clear picture of what it’s like to design a **document-based application** and integrate your app’s data with the **iOS Files app**.

When you’re finished with this course, you will have the skills and knowledge you need to make an informed decision about putting a reliable data storage plan for your iOS app into action.

## 1 &#8211; Establishing the Data Persistence Landscape

During the course, you will have the opportunity to experience a variety of data persistence scenarios and technologies.

You’ll get general feel for setup requirements and a taste of what it’s like to work with each solution in code.

  * To start you off on the right footing, this module will establish the data persistence possibilities and focus in on the _reasons_ for saving data so that you&#8217;re persisting with a purpose.
  * You will be introduced to a player profile matrix to help you analyze your data persistence options from a number of angles.
  * Finally, you will get the feel for working with the Swift `Encodable` and `Decodable` protocols.

## 2 &#8211; Saving Settings and Configuration

Users are picky, aren’t they? Everybody has preferences though, so it’s no wonder that you as a developer are often tasked with letting your users to customize their experience within your app.

  * You will learn how to manage user preferences with the `UserDefaults` system that&#8217;s built in to iOS
  * Next, you will explore synchronizing settings with iCloud Key-Value Store
  * Finally, you will understand how to ship configuration for your app with Property Lists that are included in your application bundle

## 4 &#8211; Saving Objects and Object Graphs

What if you only wanted to load a subset of the data into memory instead of being locked in to an all-or-nothing situation with `UserDefaults` or Property Lists?

What if you needed to save a more complex data model that includes relationships?

For that, you’ll need to know about saving and sharing objects and object graphs&#8230;

**Six Technologies/Frameworks** will be featured in this module:

  * SQLite
  * Core Data
  * Realm Database
  * CloudKit
  * Realm Platform
  * Firebase

The goal is to help you answer **two questions**:

  * “What am I getting myself into if I pick one persistence technology over another?”
  * “How does it feel to work with this persistence technology in code?”

You will answer these questions by&#8230;

  * Scanning the arena of persistence options and explore what sets these technologies apart from `UserDefaults` and Property Lists.
  * Surveying the setup process to see what it takes to get up and running with each technology in the list
  * Exploring the data modeling process to wrap your head around what the data structure design process is like for each technology in the list
  * Getting the feel for working with data so that you understand what it&#8217;s like to create objects, update them, delete them, query and filter them, and watch for data changes so that you can update your user interface appropriately

## 5 &#8211; Saving Data as Documents and Files

What if you need to encapsulate chunks of content together and save it all as a packaged up file…as a single unit with a custom file extension?

For that, you need to know about saving data as documents and files.

  * You will explore the use-case for building a &#8220;document-based application&#8221;
  * Next you will walk through designing a document as a subclass of `UIDocument`
  * You will learn to create and load documents from a Document Browser
  * Customizing your app&#8217;s file extension is a key step that you will work through
  * You will spend some time understanding how to interact with document data in code as _users_ interact with the user interface
  * Finally, you will answer the question, “How do I get my app’s files to show up in the iOS Files app?” 

# Feedback Welcome!

My goal is to help you filter the noise… to help you distill an overwhelming amount of information down into the big picture possibilities so that you’re on a trajectory for being able to make an informed decision about putting a reliable data storage plan for your iOS app into action.

I welcome feedback on this course, and on other iOS development courses you might be interested in seeing in the Pluralsight library. Happy learning!

 [1]: http://bit.ly/ios-data-persistence-bp