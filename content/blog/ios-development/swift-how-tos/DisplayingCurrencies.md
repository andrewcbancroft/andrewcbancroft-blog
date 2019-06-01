---
title: Displaying Currencies
author: Andrew
type: blog
date: 2019-05-31T04:31:49+00:00
wip: true
---

## Setup
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

## Exract the current currency value from the label
Chances are, you're displaying whatever currency value you're displaying as a `String` in your user interface.
Therefore, you need to extract it out of whatever UI element you're displaying it in, and get it ready to do "number stuff" with...
let currentTotalString = viewController.currencyLabel.text?.replacingOccurrences(of: "$", with: "", options: String.CompareOptions.literal, range: nil)

var currentTotal = NSDecimalNumber(string: currentTotalString)

## Make a random currency amount to add to the current total
For this example, create a random number to between 0 and 5 to test out adding some amount to the current total.
let randomRange = Range<Double>(uncheckedBounds: (0.0,5.0))
let randomAmount = Double.random(in: randomRange)
let amountToAdd = NSDecimalNumber(floatLiteral: randomAmount)

## Add to the current total
currentTotal = currentTotal.adding(amountToAdd)

## Make a currency formatter, format as currency, and update the UI
The way to format numbers as currency is with a [NumberFormatter](https://developer.apple.com/documentation/foundation/numberformatter).
I'm keeping it simple in this example, but there are various customization points available to you.
let currencyFormatter = NumberFormatter()
currencyFormatter.locale = Locale.current
currencyFormatter.usesGroupingSeparator = true
currencyFormatter.numberStyle = NumberFormatter.Style.currency

viewController.currencyLabel.text = currencyFormatter.string(from: currentTotal)
