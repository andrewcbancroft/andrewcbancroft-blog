---
title: "StoreKit Testing Swift Start"
description: "What if you could test your StoreKit functionality 100% locally while developing?  With StoreKit testing, now you can!"
author: Andrew
type: blog
disppsiapbadge: true
draft: false
date: 2020-06-25T00:00:00+00:00
wip: false
showrecent: true
toc: true
tags:
  - In-App Purchases
  - Receipt Validation
  - StoreKit
images:
  - /images/social-assets/Twitter - StoreKit Testing Swift Start.png
  - /images/social-assets/Facebook - StoreKit Testing Swift Start.png
---

# Manually Testing StoreKit Code
## Development Workflow Changes

The previous workflow for setting up in-app purchases was a bit disjointed.

You'd have to create your app in Xcode... then jump out to App Store Connect to define your app *there*... set up your digital products *there* (in App Store Connect)... and then jump *back* to Xcode to write your StoreKit code.

**Now**, you can get started in Xcode, and *stay* in Xcode.  Here's how:

* Go to the File menu
* Click New ➡️ File
* Type "storekit" into the filter
* Click Next to add a StoreKit Configuration File ✅



![Add StoreKit Configuration File](add-storekit-configuration.gif)

From there, you get to add the digital products you intend to offer in your app, all without leaving Xcode!

Xcode offers support for configuring all three product types:

* Consumable
* Non-Consumable
* Auto-Renewable Subscription

>‼️Note: It appears that Non-Renewing Subscriptions are no longer encouraged

![Set Up Products](set-up-products.png)

Once you have all of your products configured and your Store view written, you'll want to *use* your configuration for testing.

To do it, you need to edit your app's scheme:

* Click your app target in the toolbar
* Click Edit Scheme...
* Click Options
* Find StoreKit Configuration, and select the configuration you've added for your project in the dropdown ✅

![Edit Scheme](edit-scheme.gif)

## Making Test Purchases
Now to actually test things!

To test things locally, you don't need to create a sandbox tester account first (something *else* you used to have to do before testing in-app purchases).

Everything happens locally.  

All of your code that would be communicating with the App Store itself in Production, is "taken care of" by Xcode.  

So you may be wondering... 

❓"Do my SKPaymentTransactionObserver functions get executed when they're supposed to?"

👉**Yes**.

❓"Do I get a receipt for the purchase?"

👉**Yes**.

❓"Can I use that receipt to validate successfully?"

👉**Kinda**. Receipts from the local Xcode environment are not signed with the same signature as the Sandbox and Production environments are, so they cannot be used if you're implementing server-side receipt validation.

## Development Workflow Enhancements

### StoreKit Transaction Manager
How often does your implementation work perfectly **the first time**?  

Rarely?  

Yeah... I'm with you.  

With the new **StoreKit Transaction Manager**, it's easy to "clear things out" so that previous test purchases that didn't go so well can be tried again fresh, as if a purchase never happened.

![StoreKit Transaction Manager](storekit-transaction-manager.gif)

>Note: If you don't see the StoreKit Transaction Manager icon in the debug console, make sure you've added the In-App Purchasing capability to your app.  Then try again.

### Test Edge Cases
To support testing out what could be considered "edge cases" in the in-app purchasing experience, Xcode 12 also has the ability to simulate things like:

* Time Rate for Auto-Renewable Subscription expiration
* Interrupted purchases
* Failed transactions
* Ask To Buy

![Edge Cases](edge-cases.png)

### Auto-Renewable Subscription Testing Enhancements
Testing subscription expiration is important for preserving the revenue you intend to generate from auto-renewable subscriptions.

The challenge is that you and I don't have time to wait!

Previously, you could update your product in App Store Connect to have a shorter duration, and the Sandbox environment would interpret, say, a six month subscription to be "30 minutes" worth of time.

But that's still a long time to wait between making a subscription purchase, and trying out expiration logic, isn't it?

Problem. Solved.  Now you can select even shorter durations for testing subscription expiration using the Time Rate menu option in Xcode's editor menu **when you're on the StoreKit configuration page**.

![Time Rate](time-rate.png)

>Remember: To see this editor menu, you have to be in the StoreKit configuration file of your app.

If a second equals a day, and there's 30ish days in a month, a six month subscription should expire and auto-renew in **three-ish** minutes now.

A huge help for impatient types like myself!

# Automated Testing for StoreKit Code
Tired of launching your app and clicking around manually to test things out?

Not only is that tedious, you and I are bound to either miss something, or test inconsistently, leading to a potentially sub-par end-user experience.

Apple has given us a new **StoreKitTest framework** that you can use within XCTest!

Everything that you can point-and-click on is fully testable with unit and UI tests with zero human interaction.

To get started using this new framework, it's `import StoreKitTest`.

# Is the Sandbox Environment Still Useful?
Super useful.

Testing things out locally is amazingly powerful for getting you started, but before you deploy your app to the App Store and send it into review, you still have to...

* Set up your products in App Store Connect ... right now the Xcode configuration doesn't get "pushed up" to App Store Connect, so it's a double-entry world right now.
* Set up a Sandbox tester account in App Store Connect so that you can...
* Test out your in-app purchasing workflow and receipt validation logic with receipts signed by a "real" App Store environment (just like your TestFlight testers and your **App Reviewer** will use)

And if you're using App Store server notifications to detect changes to auto-renewable subscriptions, you need to test those out as well.

So for all of these reasons, the Sandbox environment is still there, and is still useful.

Alas, *some* manual testing is still required, but can you imagine some of the possibilities for getting started with implementing in-app purchases, right in Xcode, on day zero of your project?