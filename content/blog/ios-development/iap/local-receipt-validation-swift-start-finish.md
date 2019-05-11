---
title: Local Receipt Validation for iOS in Swift From Start to Finish
author: Andrew
type: blog
date: 2017-08-01T17:55:09+00:00
aliases:
  - /2017/08/01/local-receipt-validation-swift-start-finish/
featured_image: /wp-content/uploads/2017/08/Graphic-Only-Local-Receipt-Validation-for-iOS-in-Swift-From-Start-to-Finish.png
dsq_thread_id:
  - "6033658886"
categories:
  - Swift
tags:
  - Receipt Validation
  - Swift

---
Local receipt validation in Swift doesn't seem to be widely written about. I've been able to find snippets of code scattered across the Internet, but nothing that brought everything together in one spot so that I could wrap my head around the whole process.

I've been working on some code for a while, and this post is my attempt to bring it all together from start to finish.

I've written seven guides that will take you from preparing to test receipt validation, all the way through to working with the result of the receipt validation process to enable/disable features of your app.

Additionally, I've put all of my code into a new GitHub repository for you to use and learn from!

Just want the code? Here you go!

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fab fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/SwiftyLocalReceiptValidator">Swifty Local Receipt Validator</a>
    </li>
  </ul>
</div>

# Seven guides taking you from start to finish

If you're interested in learning about each step along the way, here are the seven guides I've written on the topic of local receipt validation in Swift:

  * [Preparing to Test Receipt Validation for iOS][1]
  * [OpenSSL for iOS & Swift the Easy Way][2]
  * [Loading a Receipt for Validation with Swift][3]
  * [Extracting a PKCS7 Container for Receipt Validation with Swift][4]
  * [Receipt Validation – Verifying a Receipt Signature in Swift][5]
  * [Receipt Validation – Parse and Decode a Receipt with Swift][6]
  * [Finalizing Receipt Validation in Swift – Computing a GUID Hash][7]

# Disclaimer

Preventing software piracy is hard. The code presented in these guides and shared in the Git repository is not meant to protect you against unauthorized usage of your app or its features.

The guides and code are meant to be used for learning purposes, and _perhaps_ as a starting point for implementing local receipt validation on your own. If you use this code as-is in your app, you do it at your own risk.

You must take additional efforts to obfuscate the code presented here to thwart an attacker's attempt at circumventing the receipt validation logic contained within this repository.

 [1]: https://www.andrewcbancroft.com/2015/10/05/preparing-to-test-receipt-validation-for-ios/#build-run-on-device
 [2]: https://www.andrewcbancroft.com/2015/09/21/openssl-for-ios-swift-the-easy-way/
 [3]: https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/
 [4]: https://www.andrewcbancroft.com/2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/
 [5]: https://www.andrewcbancroft.com/2017/07/16/receipt-validation-verifying-a-receipt-signature-in-swift/
 [6]: https://www.andrewcbancroft.com/2017/07/27/receipt-validation-parsing-a-receipt-with-swift/
 [7]: https://www.andrewcbancroft.com/2017/07/31/finalizing-receipt-validation-in-swift-computing-a-guid-hash/