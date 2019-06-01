---
title: Displaying and Updating Currency in a UILabel
description: "Provides an example of how to display and upate currency values in a UILabel."
author: Andrew
type: blog
date: 2019-06-01T04:31:49+00:00
wip: false
---

<a name="resources" class="jump-target"></a>
<div class="resources">
<div class="resources-header">
Resources
</div>
<div class="resources-download-instructions">
Right-click -> Save as...
</div>
<ul class="resources-content">
<li>
<i class="fas fa-file"></i> <a href="https://github.com/andrewcbancroft/andrewcbancroft-blog/tree/master/content/blog/ios-development/swift-how-tos/displaying-updating-currench-in-uilabel.playground" download>Swift Playground</a>
</li>
</ul>
</div>

## Setup
```swift
import UIKit
import PlaygroundSupport

class MyViewController : UIViewController {
    
    var currencyLabel = UILabel()
    override func loadView() {
        let view = UIView()
        view.backgroundColor = .white

        currencyLabel.frame = CGRect(x: 150, y: 200, width: 200, height: 20)
        currencyLabel.text = "$0.00"
        currencyLabel.textColor = .black
        
        view.addSubview(currencyLabel)
        self.view = view
    }
}

let viewController = MyViewController()
PlaygroundPage.current.liveView = viewController
```

**Live View**
![Starting Label Value](starting-label-value.png)

## Exract the current currency value from the label
Chances are, you're displaying whatever currency value you're displaying as a `String` in your user interface.
Therefore, you need to extract it out of whatever UI element you're displaying it in, and get it ready to do "number stuff" with...
```swift
let currentTotalString = viewController.currencyLabel.text?.replacingOccurrences(of: "$", with: "", options: String.CompareOptions.literal, range: nil)

var currentTotal = NSDecimalNumber(string: currentTotalString)
```

0

## Make a random currency amount to add to the current total
For this example, create a random number to between 0 and 5 to test out adding some amount to the current total.
```swift
let randomRange = Range<Double>(uncheckedBounds: (0.0,5.0))
let randomAmount = Double.random(in: randomRange)
let amountToAdd = NSDecimalNumber(floatLiteral: randomAmount)
```

2.095023084295587 `// Output from my Playground run`

## Add to the current total
```swift
currentTotal = currentTotal.adding(amountToAdd)
```

2.095023084295587 `// Output from my Playground run`

## Make a currency formatter, format as currency, and update the UI
The way to format numbers as currency is with a [NumberFormatter](https://developer.apple.com/documentation/foundation/numberformatter).
I'm keeping it simple in this example, but there are various customization points available to you.
```swift
let currencyFormatter = NumberFormatter()
currencyFormatter.locale = Locale.current
currencyFormatter.usesGroupingSeparator = true
currencyFormatter.numberStyle = NumberFormatter.Style.currency

viewController.currencyLabel.text = currencyFormatter.string(from: currentTotal)
```

**Live View**
![Ending Label Value](ending-label-value.png)
