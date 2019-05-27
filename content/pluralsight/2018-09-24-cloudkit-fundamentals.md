---
title: CloudKit Fundamentals
author: Andrew
type: blog
date: 2018-09-24T17:58:49+00:00
url: /2018/09/24/cloudkit-fundamentals/
categories:
  - Pluralsight
  - Swift
tags:
  - CloudKit

---

At the core of developing a seamless and collaborative data sharing experience for Apple’s platforms is a thorough knowledge of CloudKit.

In this course, you’ll learn to leverage Apple’s flagship framework to achieve your app’s remote data storage and data sharing requirements.

First, you’ll learn how to configure CloudKit in your Xcode project and how to save, query, update, and delete data that your users store in iCloud.

Next, you’ll explore how to synchronize data across a user’s devices.

Finally, you’ll discover how to handle CloudKit errors, test your app on physical devices, and deploy to production.

When you’re finished with this course, you’ll have a foundational knowledge of CloudKit that will help you provide a fluid, interactive data sharing experience.

# Course Trailer

You can check out a trailer of the course over at Pluralsight completely free.

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fas fa-video"></i> <a href="http://bit.ly/cloudkit-fundamentals" target="_blank">CloudKit Fundamentals</a><br /> <a href="http://bit.ly/cloudkit-fundamentals" target="_blank"><a href="https://www.andrewcbancroft.com/wp-content/uploads/2018/09/cloudkit-fundamentals-title-screen.png"><img src="https://www.andrewcbancroft.com/wp-content/uploads/2018/09/cloudkit-fundamentals-title-screen-1024x576.png" alt="CloudKit Fundamentals" width="1024" height="576" class="alignnone size-large wp-image-13708" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2018/09/cloudkit-fundamentals-title-screen-1024x576.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2018/09/cloudkit-fundamentals-title-screen-300x169.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2018/09/cloudkit-fundamentals-title-screen-768x432.png 768w, https://www.andrewcbancroft.com/wp-content/uploads/2018/09/cloudkit-fundamentals-title-screen.png 1560w" sizes="(max-width: 1024px) 100vw, 1024px" /></a> </li> </ul> </div> 
      
<h1>
  Course Outline
</h1>

<h2>
  1 – Setting up CloudKit
</h2>

<p>
  Module 1 is the introduction to the course with discussion of the motivating factors for using CloudKit, course prerequisites, storyline overview, and a demo of the end product of the course.
</p>

<p>
  The demo app for this course is a fun one! I put you in the scenario where we team up to build a hazard reporting app for our company’s Safety Department.
</p>

<p>
  The final product will come complete with the ability to save, query, update, and delete text, images, and location information into iCloud using the CloudKit framework.
</p>

<h2>
  2 – Modeling and Saving Data
</h2>

<p>
  Working with CloudKit begins with an understanding of the framework Types that are used to model and save data.
</p>

<p>
  You'll learn about <code>CKRecords</code> and <code>CKAssets</code>, and save your first bits of data up to iCloud in this module.
</p>

<h2>
  3 – Querying, Displaying, Updating, and Deleting Data
</h2>

<p>
  Once data has been saved into an iCloud database, the next logical step is to query it and display it within the app.
</p>

<p>
  I will teach about the <code>CKQuery</code> class for querying the CloudKit database for records and/or assets, so that data can be retrieved and displayed in the UI.
</p>

<p>
  And of course, once data is retrieved and displayed, it's fair game for updating and deleting.
</p>

<h2>
  4 – Synchronizing Data Across Devices
</h2>

<p>
  The whole point of CloudKit is to make sure that data is accessible from more than one device.
</p>

<p>
  One of the primary features still glaringly missing from our Hazard Reporter app at this point in the course is the fact that it doesn’t automatically update when data changes in the CloudKit database.
</p>

<p>
  In this module, I'll teach you about how CloudKit uses subscriptions and push notifications to alert other users’ devices to changes that have occurred in the CloudKit database, so that appropriate action can be taken in code to respond to those changes.
</p>

<p>
  I'll also simulate hazard reports coming in from another user by adding data through the CloudKit Dashboard and watching the screen update with the new data in the iOS app.
</p>

<h2>
  5 – Modeling Relationships Between Record Types
</h2>

<p>
  Modeling relationships between Record Types is important for many scenarios. In this module I will teach how to work with <code>CKReferences</code> in order to represent hierarchical relationships or to represent ownership between model objects.
</p>

<h2>
  6 – Planning for Production
</h2>

<p>
  Apple engineers repeatedly warn that CloudKit error handling isn’t the difference between a good app and a bad app… it’s the difference between a functional app and a non-functional app. To that end, I cover some of the most common CloudKit errors and how to handle them.
</p>

<p>
  And alas, once a version of the app is ready enough to put into users’ hands, it’s crucial to test it and then put it into Production. I will discuss creating an Ad-Hoc deployment of the app so that it can be installed on other users’ devices via iTunes. I will also discuss deploying the CloudKit database schema to Production in preparation for deployment to the App Store.
</p>

<h1>
  Course Resources
</h1>

<p>
  Demos of technology in action are <em>super</em> important to me. That being the case, I tried to pack as much demo content into the course as possible. You'll get to see the full array of dev-time experiences, not just the final "it works perfectly&#8221; outcomes.
</p>

<p>
  The course also comes complete with working Xcode projects that gradually build you up to the final version of the app, one step at a time through each module.
</p>

<h1>
  Feedback Welcome!
</h1>

<p>
  I welcome feedback on this course, and on other iOS development courses you might be interested in seeing in the Pluralsight library. Happy learning!
</p>

 [1]: http://bit.ly/cloudkit-fundamentals