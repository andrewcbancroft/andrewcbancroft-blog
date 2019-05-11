---
title: 'Force Unwrapping Swift Optionals:  Code Smell!'
author: Andrew
type: blog
date: 2016-06-14T03:54:57+00:00
aliases:
  - /2016/06/13/force-unwrapping-swift-optionals-code-smell/
dsq_thread_id:
  - "4908529277"
categories:
  - Swift
tags:
  - Swift
  - Swift Optionals

---
Do you find your Swift code riddled with `!`&#8216;s?

I'm becoming more and more uncomfortable with seeing `!` throughout my Swift code. It's just a matter of time before it's going to bite me.

Often, I do it because it's the &#8220;easy thing&#8221; to do at the time. But it's _dangerous_.

Swift optionals are trying to _help_ us. They force us to deal with the possibility of something not having a value.

By force unwrapping an optional with the `!` operator, we're declaring, &#8220;This will _never_ be without a value&#8221;. Really? Never? Are you sure? Only a Sith deals in those kinds of absolutes.

When a function returns an optional, or a property is declared as optional, we are, _at the very least_, meant to assume that there is a _possibility_ of `nil` lying underneath.

Therefore, I'm considering it a sort of &#8220;code smell&#8221; when I see it in my own code. It's not too much to throw an `if let` or a `guard let` in there to handle the possibility of `nil`.

# Two exceptions

Two exceptions to the code smell rule:

## 1 – IBOutlet and IBAction

IBOutlets and IBActions are force-unwrapped, but that's because they get injected when the Storyboard is loaded at run-time. It's assumed that these are connected and will be supplied when the scene is loaded. If they get unwired somehow, we _want_ an instant crash so we know to go back to the Storyboard and re-wire things to the view controller.

## 2 – Required properties to be set in prepareForSegue

Along those same lines, I consider properties that _must_ be set when navigating to a new view controller to be in the same category as an IBOutlet or an IBAction. I want to know right away if I forget to set those in `prepareForSegue` in the parent view controller. So I'll often force unwrap the optional in the declaration so that there's an as-immediate-as-possible crash if it's not set.

Hopefully when you're working with optionals from here on, you'll take a second sniff when you see the `!` operator.