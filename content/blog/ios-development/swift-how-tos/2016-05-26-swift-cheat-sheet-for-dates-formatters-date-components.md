---
title: 'Swift Cheat Sheet for Dates, Formatters, & Date Components'
author: Andrew
type: blog
date: 2016-05-26T18:04:01+00:00
url: /2016/05/26/swift-cheat-sheet-for-dates-formatters-date-components/
dsq_thread_id:
  - "4860023591"
categories:
  - Swift
tags:
  - Date
  - DateComponent
  - DateFormat
  - Swift

---
Working with `NSDate`, `NSDateFormatter`, and `NSDateComponents` can be a little convoluted, so I&#8217;ve created myself a cheat sheet that will be updated as I discover new tips and tricks in this realm.

The new cheat sheet can be found over at GitHub in the form of an Xcode Playground:

<div class="resources">
  <div class="resources-header">
    Resources
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-github fa-lg"></i> <a href="https://github.com/andrewcbancroft/SwiftDatesCheatSheet" title="Swift Dates Cheat Sheet Playground" target="_blank">Swift Dates Cheat Sheet Playground</a>
    </li>
  </ul>
</div>

Topics that are included in the Playground are as follows:

  * Getting today&#8217;s date
  * Converting `NSDate` to `String`
  * Converting `String` to `NSDate`
  * Getting components of an `NSDate`
  * Setting components of an `NSDate`
  * Creating new `NSDate` instances from `NSDateComponent` instances

The best way to view this cheat sheet is by <a href="https://github.com/andrewcbancroft/SwiftDatesCheatSheet" target="_blank">downloading the playground from GitHub</a>, but here&#8217;s a straight copy-paste from the repo in case you just want to copy and paste it into a playground of your own from here:

<pre class="lang:swift decode:true " title="SwiftDateCheatSheet.playground" >import UIKit

/*: 
# Overview
This is a cheat sheet for working with dates, date formatters, and date components.

*/

//: # Today's Date

let today = NSDate()
let thisTimeTomrrow = NSDate(timeIntervalSinceNow: 86400)
let thisTimeYesterday = NSDate(timeIntervalSinceNow: -86400)

/*: 
# Date Formatting
Working with NSDateFormatter to convert dates to stings and vice-versa
*/

//: ## Converting dates to strings
let dateFormatter = NSDateFormatter()
dateFormatter.dateFormat = "yyyy-MM-dd"

print(dateFormatter.stringFromDate(today))

dateFormatter.dateFormat = "MMM dd, yyyy"

print(dateFormatter.stringFromDate(today))


//: ## Converting strings to dates

// Consider what might potentially come back from an API of some sort and set a dateFormatter's dateFormat property appropriately...

dateFormatter.dateFormat = "yyyy-MM-dd"
var stringFromApi = "2016-01-01"
var date = dateFormatter.dateFromString(stringFromApi)

stringFromApi = "May 26, 2016"
date = dateFormatter.dateFromString(stringFromApi)

/* Notice how the format set to the date formatter (yyyy-MM-dd) differs from the format that came back from the API (MMM dd, yyyy), which resulted in `date` being nil.
*/

/*:
# Date Components
Working with NSCalendar and NSCalendarUnit to work with components of dates.
*/

//: ## Getting date components
var calendarUnitFlags: NSCalendarUnit = [.Year, .Month, .Day, .Hour, .Minute, .Second]
var dateComponents = NSCalendar.currentCalendar().components(calendarUnitFlags, fromDate: NSDate())
dateComponents.year
dateComponents.month
dateComponents.day
dateComponents.hour
dateComponents.minute
dateComponents.second

// Observe how leaving out .Hour, .Minute, and .Second affects the values of those components of a date:
calendarUnitFlags = [.Year, .Month, .Day]
dateComponents = NSCalendar.currentCalendar().components(calendarUnitFlags, fromDate: NSDate())
dateComponents.year
dateComponents.month
dateComponents.day
dateComponents.hour
dateComponents.minute
dateComponents.second

//: ## Setting date component values

dateComponents.year = dateComponents.year + 1
dateComponents.month = 1
dateComponents.day = 1
dateComponents.hour = 0
dateComponents.minute = 0
dateComponents.second = 0

//: ## Creating dates from components
let newDate = NSCalendar.currentCalendar().dateFromComponents(dateComponents)


</pre>