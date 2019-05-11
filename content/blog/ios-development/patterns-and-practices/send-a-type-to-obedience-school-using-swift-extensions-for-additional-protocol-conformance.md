---
title: Send a Type to Obedience School – Using Swift Extensions for Additional Protocol Conformance
author: Andrew
type: blog
date: 2014-12-02T19:15:33+00:00
aliases:
  - /2014/12/02/send-a-type-to-obedience-school-using-swift-extensions-for-additional-protocol-conformance/
dsq_thread_id:
  - "3153770842"
categories:
  - iOS / Mac
  - Swift
tags:
  - Extensions
  - Protocols
  - Swift

---
Did you know that you can make _any_ Type (here meaning Class, Enumeration, or Struct), even already-existing ones that you don't have the source code for, adopt a protocol that it doesn't normally conform to out of the box?

**You can** – _even if you don't have the original source code for that Type_! It's a powerful and intriguing proposition. Let's explore how this is possible.

### How, you ask?

Well, as the title of this article suggests, Swift extensions are the way to do it. To demonstrate this capability, consider the following scenario:

  * You're using a library that lets you create instances of `Bird` , and you don't have access to the source code for the library.
  * `Bird ` has a property called `species ` and a property called `commonName` .
  * You'd like `Bird ` to conform to the [Printable protocol, defined in the Swift standard library][1], so that you can call `println(_:)` on `Bird ` instances, and have it log something useful to the console.
  * When `println(_:)` is passed a `Bird ` instance, you'd like it to print out something like &#8220;\[species\] (ie, [commonName]).&#8221;, and have [species] and [commonName] be replaced by the `Bird`&#8216;s real values.

Remember that you don't have access to the original source code of `Bird` . Without Swift extensions, there would be no way for you to tell the compiler that you'd like `Bird ` to adopt and conform to the `Printable ` protocol.

Thankfully, extensions _do_ exist, and we can teach a `Bird ` new tricks, enabling its conformance to `Printable` .

### Protocol Conformance Extension

As stated in the [Printable protocol documentation][1], a Type adopting the `Printable ` protocol must implement a single, read-only property named `description` .

The extension, then would be implemented as follows:

```swift
// Explicitly specify protocol adoption
extension Bird: Printable {

    // Implement the required property to make Bird conform to the protocol
    var description: String {
        return "\(species) (ie, \(commonName))"
    }
}
```

The magic line in the code above is highlighted. This tells the compiler that `Bird` will be extended to adopt the `Printable` protocol.

Of course, the remaining requirement then, is to implement the specification of the protocol so that `Bird` conforms to it, which is what the body of the extension contains.

_Note that simply extending `Bird` to have a read-only `description` property will *not_ suffice for making the Type adopt the protocol. There is no &#8220;implicit&#8221; protocol adoption in Swift, so you must specify in the extension declaration that you intend for the Type to adopt the protocol.

### Conclusion

With this little example, you've seen how using an extension can enable a Class, Enumeration, or Struct to adopt and conform to a protocol that it normally wouldn't out of the box. It's especially neat that you can do this for _any_ such Type, whether you have control over its original source code or not.

 [1]: https://developer.apple.com/library/ios/documentation/General/Reference/SwiftStandardLibraryReference/Printable.html "Swift Standard Library Reference - Printable Protocol"