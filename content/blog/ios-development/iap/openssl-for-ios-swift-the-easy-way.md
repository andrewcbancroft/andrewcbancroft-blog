---
title: 'OpenSSL for iOS and Swift the Easy Way'
description: "Shows how to obtain OpenSSL for use with Swift."
author: Andrew
type: blog
date: 2015-09-22T04:39:28+00:00
lastmod: 2019-06-27T00:00:00+00:00
url: /2015/09/21/openssl-for-ios-swift-the-easy-way/
dsq_thread_id:
  - "4153083561"
categories:
  - Swift
tags:
  - Cocoapods
  - OpenSSL
  - Swift

---
I'm currently working on outfitting an app I'm working on to be able to [validate receipts][1] to verify purchases of the app.

Little did I know, this adventure would introduce the need to understand how to use cryptography in order to work with the receipt.

<a name="cryptography-library-needed" class="jump-target"></a>

### Cryptography library needed

In order to even "open" the receipt itself, we've got to work with something called a "PKCS #7 container". Once we get the container open, we need to be able to validate Apple's certificate that they use to sign every purchase of every app.

All of this requires the use of a cryptography library, and OpenSSL seems to be the common choice, due to its being open source.

I found that figuring out what to do to get OpenSSL into my project was harder than I wanted it to be. It turns out that there are a few to do this, but I wanted the easiest to implement (and the easiest to maintain). The options I was able to identify are:

  * Build the binaries for each platform yourself. To do this you've got to make sure you build for both the simulator and the device by running special config routines and using makefiles and what-not. It seemed error-prone, and I'm not confident enough in my ability to know whether or not I've done it right.
  * Download a pre-built static library – however, this introduces a risk that I wasn't really willing to take. How do I trust that pre-built library? If there's a vulnerability there, how do I easily upgrade the library to the patched version? Every recommendation I've seen thus far says, "Always build your own static library, rather than download it already-built from somewhere".
  * Cocoapods. Simply put, this was the easiest route for me.

<a name="cocoapods" class="jump-target"></a>

### OpenSSL for iOS with Cocoapods

How easy is it to get started with OpenSSL for iOS with Cocoapods?

Pretty easy.

If you don't have Cocoapods yet, you can head over to [Cocoapods.org][2] and follow their instructions for installing. It's literally one command at the terminal:

`sudo gem install cocoapods`

Once Cocoapods is installed, open your project in Xcode and add a new empty file (File -> New File -> Other -> Empty) called Podfile.

In its contents, you simply add a reference to the OpenSSL library:

<pre class="lang:sh decode:true " title="Podfile" >target 'NameOfYourApp' do
    pod 'OpenSSL', '~> 1.0'
end
```

Note that there are several &#8216;OpenSSL' Cocoapod specs out there to choose from. I originally tried one that looked like it was for iOS (OpenSSL-iOS), but I was never able to get Swift code to recognize the C functions and types.

The one that seemed to still pull the source from openssl.org and build it when the pod is installed was simply named &#8216;OpenSSL' and I've verified that my Swift code can &#8216;see' the C code without running into &#8216;unresolved identifier' compiler errors.

Once the Podfile is created and configured, save it and close Xcode. Then head to the Terminal.

Navigate to your Xcode project folder where the Podfile is located and run `pod install`.

Once it's finished doing its thing (be patient&#8230; it took several minutes for me), you can open the new .xcworkspace file that Cocoapods created for you. You'll have everything in your project configured to depend on the OpenSSL library through the new Pods project that's been added to your Workspace.

<a name="bridging-header" class="jump-target"></a>

### Bridging header

In order to use OpenSSL with Swift, you're going to need to create an Objective-C bridging header to access the functionality provided in the OpenSSL libraries.

If you don't already have an Objective-C bridging header, it's simple to get one added automatically by Xcode for you:

  * Choose File -> New -> File
  * Choose Source under iOS (on the left
  * Choose Objective-C File
  * Name it "bridge" (or anything, really – it's a dummy file that you'll delete after Xcode generates the bridging header)
  * Choose Next, and then Create

Xcode will prompt you to create the bridging header – you should let it. Once it's created, you can delete "bridge.m" (the Objective-C .m file that you just created in the steps above).

Within the bridging header, you can insert some `#import` statements to make the OpenSSL library components visible to your Swift project. For example, to start off, you could flesh out the bridging header with a couple of OpenSSL header files:

<pre class="lang:objc decode:true " title="Bridging header" >#import &lt;openssl/pkcs7.h&gt;
#import &lt;openssl/objects.h&gt;
// Others that you may need in your Swift project
```

<a name="xcode-7-bitcode" class="jump-target"></a>

### Xcode 7 & Bitcode

When you build and run your newly configured project in the Simulator, things are going to work fine.

When you build it for your device, however, it will fail.

> &#8230;Pods/OpenSSL/lib/libcrypto.a(bio\_lib.o)' does not contain bitcode. You must rebuild it with bitcode enabled (Xcode setting ENABLE\_BITCODE), obtain an updated library from the vendor, or disable bitcode for this target. for architecture arm64 

At the time of this writing, there is somthing in OpenSSL that doesn't support Xcode 7's Bitcode feature. Eventually (hopefully) they'll fix it, but for now, if you want to use OpenSSL in a Swift project using Xcode 7, you'll have to turn off Bitcode.

Click on your project, and then click on your app target under &#8216;Targets' in the project settings window.

Find Build Options and set Enable Bitcode to &#8216;No'

If you try re-building against the device with this setting set to &#8216;No', it should build and run without issue.

### Wrapping up

That's all there is to getting OpenSSL built and added as a reference in your app. _Now_ will come the fun part of using it with Swift, but I will save that for another entry.

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/10/05/preparing-to-test-receipt-validation-for-ios/" title="Preparing to Test Receipt Validation for iOS">Preparing to Test Receipt Validation for iOS</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2015/10/13/loading-a-receipt-for-validation-with-swift/" title="Loading a Receipt for Validation with Swift">Loading a Receipt for Validation with Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2016/06/09/extracting-a-pkcs7-container-for-receipt-validation-with-swift/" title="Extracting a PKCS7 Container for Receipt Validation with Swift">Extracting a PKCS7 Container for Receipt Validation with Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/16/receipt-validation-verifying-a-receipt-signature-in-swift/" title="Receipt Validation – Verifying a Receipt Signature in Swift">Receipt Validation – Verifying a Receipt Signature in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/27/receipt-validation-parsing-a-receipt-with-swift/" title="Receipt Validation – Parse and Decode a Receipt with Swift">Receipt Validation – Parse and Decode a Receipt with Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="https://www.andrewcbancroft.com/2017/07/31/finalizing-receipt-validation-in-swift-computing-a-guid-hash/" title="Finalizing Receipt Validation in Swift – Computing a GUID Hash">Finalizing Receipt Validation in Swift – Computing a GUID Hash</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: https://developer.apple.com/library/ios/releasenotes/General/ValidateAppStoreReceipt/Chapters/ValidateLocally.html#//apple_ref/doc/uid/TP40010573-CH1-SW2
 [2]: http://cocoapods.org