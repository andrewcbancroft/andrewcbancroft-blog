---
title: 'SSRS: Which server sent my e-mail subscription?'
author: Andrew
type: blog
date: 2012-07-25T13:56:24+00:00
aliases:
  - /2012/07/25/ssrs-which-server-sent-my-e-mail-subscription/
suf_meta_description:
  - 'SSRS: Which server sent my e-mail subscription?'
suf_meta_keywords:
  - SSRS, SSRS Subscriptions, SSRS E-mail, SSRS E-mail subscription
dsq_thread_id:
  - "3334945577"
categories:
  - Reporting Services
tags:
  - SSRS

---
I was recently troubleshooting a seemingly bizarre issue I was having with one of our report subscriptions – the production version was running normally, but our customer suddenly began receiving a very old version of the same report subscription.  After disabling the subscription from all non-production servers that I knew about, the customer continued to receive the rogue e-mail.  I needed to figure out which “mystery” report server was sending the e-mail subscription.

The answer was simple once I stepped back from the problem and remembered that there’s such a thing as a header to an e-mail that gives details about where the e-mail is coming from.

Outlook 2010 provides a way for you to view an e-mail’s header by clicking File –> Info –> Properties:

[<img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border-width: 0px;" title="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2012/07/image_thumb.png" alt="image" width="576" height="566" border="0" />][1]

The Internet headers section is where to look – it’ll tell you which server was involved at the very beginning.

[<img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border-width: 0px;" title="SNAGHTML1d27d81" src="http://www.andrewcbancroft.com/wp-content/uploads/2012/07/SNAGHTML1d27d81_thumb.png" alt="SNAGHTML1d27d81" width="577" height="518" border="0" />][2]

This turned out to be the key – after identifying the report server that was sending the e-mail to Exchange for delivery, I was able to disable the report subscription once and for all.

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2012/07/image.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2012/07/SNAGHTML1d27d81.png