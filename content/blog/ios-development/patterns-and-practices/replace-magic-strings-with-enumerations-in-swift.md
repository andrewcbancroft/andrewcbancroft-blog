---
title: Replace Magic Strings with Enumerations in Swift
author: Andrew
type: blog
date: 2014-09-03T01:55:54+00:00
aliases:
  - /2014/09/02/replace-magic-strings-with-enumerations-in-swift/
dsq_thread_id:
  - "2982987981"
categories:
  - iOS / Mac
  - Op-Ed
  - Swift
tags:
  - Clean Code
  - Enumerations
  - Swift

---
&#8220;What can I do to avoid these &#8216;magic strings' in my code?&#8221; – This was the question I asked myself recently as I found myself in `prepareForSegue` comparing `segue.segueIdentifier` to in-line hard-coded Strings.  This kind of in-line hard-coding of a String for comparison purposes is what I mean by &#8220;magic strings&#8221; in this article.  I knew this felt like a bad idea, but the solution to a cleaner option wasn't readily apparent to me.

I _used_ to do things like create static string constants, or `#define` expressions so that I could easily change these values if I ever needed to update them for some reason.  You know&#8230; back in a former Objective-C developer life when these tactics were available to me.  But these options don't exist in Swift.  What to do??

## Enumerations to the rescue!

Specifically, <a title="Apple Developer Documentation - Enumerations with Raw Values" href="https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Enumerations.html#//apple_ref/doc/uid/TP40014097-CH12-XID_228" target="_blank">Enumerations with pre-populated default values (called <em>raw values</em>)</a>.

By creating an Enumeration that stores raw String values, I was able to encapsulate what would otherwise be &#8220;magic strings&#8221; in a type-safe construct for easier, cleaner use in my code.

## The Gist

Consider this fabricated example:

I have a storyboard with one main View Controller that connects to three other View Controllers through three segues:  &#8220;otherScreenSegue1&#8221;, &#8220;otherScreenSegue2&#8221;, and &#8220;otherScreenSegue3&#8221; as defined in the utilities panel in XCode.

An Enumeration encapsulating those segue identifiers might look something like this:

```swift
enum SegueIdentifier: String {
    case OtherScreenSegue1 = "otherScreenSegue1"
    case OtherScreenSegue2 = "otherScreenSegue2"
    case OtherScreenSegue3 = "otherScreenSegue3"
}
```

With this Enumeration defined (perhaps in its own .swift file – wherever you deem would be strategic and findable again), the `prepareForSegue` override can become &#8220;magic string&#8221;-free:

```swift
override func prepareForSegue(segue: UIStoryboardSegue!, sender: AnyObject!) {
    switch segue.identifier {
    case SegueIdentifier.OtherScreenSegue1.toRaw():
        println("Going to other screen 1")
    case SegueIdentifier.OtherScreenSegue2.toRaw():
        println("Going to other screen 2")
    case SegueIdentifier.OtherScreenSegue3.toRaw():
        println("Going to other screen 3")
    default:
        println("Going somewhere else")
    }
}
```

Alternatively, if you prefer to compare the enum values themselves, you could do the following (thank you to <a title="Twitter - Brandon Knope" href="https://twitter.com/bknope" target="_blank">Brandon Knope</a> for pointing this out – I think it looks even cleaner than my original code above!):

```swift
override func prepareForSegue(segue: UIStoryboardSegue!, sender: AnyObject!) {
    if let identifier = SegueIdentifier.fromRaw(segue.identifier) {
        switch identifier {
        case .OtherScreenSegue1:
            println("Going to other screen 1")
        case .OtherScreenSegue2:
            println("Going to other screen 2")
        case .OtherScreenSegue3:
            println("Going to other screen 3")
        default:
            println("Going somewhere else")
        }
    }
}
```

This strategy of encapsulating my various segue identifiers in an Enumeration provides me a one-stop-shop for reviewing, and if need-be, updating the String values to match what I've set up in my storyboard.

## The Details

I've chosen an <a title="Apple Developer Documentation - Enumerations with Raw Values" href="https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Enumerations.html#//apple_ref/doc/uid/TP40014097-CH12-XID_228" target="_blank">Enumeration with Raw Values</a>, because the other two kinds (<a title="Apple Developer Documentation - Enumerations as Inherent Types" href="https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Enumerations.html#//apple_ref/doc/uid/TP40014097-CH12-XID_224" target="_blank">Enumerations as Inherent Types</a>, or <a title="Apple Developer Documentation - Enumerations with Associated Values" href="https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/Enumerations.html#//apple_ref/doc/uid/TP40014097-CH12-XID_227" target="_blank">Enumerations with Associated Values</a>) don't allow me to do String comparison, or don't allow me to define a value at declaration-time, respectively.

Notice one critical aspect of the Enumeration:  because default raw values are defined, _all_ of the raw values must be of the same Type, as explicitly specified in the declaration line:  `enum SegueIdentifier: String // All of the enum cases must be Strings`

The next important thing to understand is that in order to do actual comparisons with the raw value itself (see the `switch` statement in my code example above), I needed to call `toRaw()` on the Enumeration value being used (first code example), or call `fromRaw()` to convert the `segue.identifier` string to an Enumeration value (second code example):

```swift
SegueIdentifier.OtherScreenSegue1 // Enum value of type SegueIdentifier
SegueIdentifier.OtherScreenSegue1.toRaw() // String value, "otherScreen1Segue"
SegueIdentifier.fromRaw("otherScreenSegue1")! // Unwrapped Enum value of type SegueIdentifier
```

## Conclusion

In addition to segue identifiers, I'm considering using raw value Enumerations to wrap `NSNotificationCenter` keys as well.  Share if you find other nice uses of raw value Enumerations!

So far, this solution has provided me a nice, straight-forward, type-safe way to encapsulate groups of Strings where the urge to fall back to &#8220;magic strings&#8221; would otherwise be high.

&nbsp;