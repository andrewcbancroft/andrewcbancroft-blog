---
title: How to Create Mocks and Stubs in Swift
author: Andrew
type: blog
date: 2014-07-15T05:12:16+00:00
aliases:
  - /2014/07/15/how-to-create-mocks-and-stubs-in-swift/
spacious_page_layout:
  - default_layout
dsq_thread_id:
  - "2844539804"
categories:
  - iOS / Mac
  - Swift
tags:
  - Mock
  - Stub
  - Swift
  - Unit Test

---
Without 100% support for a mocking framework like <a title="OCMock" href="http://ocmock.org/" target="_blank">OCMock</a>, I found myself needing to get creative when building&nbsp;mock objects and method stubs in Swift unit tests. &nbsp;The great thing about testing is that you&#8217;re&#8230;well&#8230;&nbsp;_testing things out_ to see if they&#8217;ll work, and I found a solution that I&#8217;m pretty happy&nbsp;with for now. &nbsp;I&#8217;m open to better ways, so leave a comment if you&#8217;ve had good results using a different design!

The process&nbsp;is essentially this (example to follow):

  1. Ensure that the&nbsp;class that you would like to test is designed so that you can substitute your mock for the real one that&#8217;s used in your class&#8217; implementation
  2. Create an <span class="lang:swift decode:true  crayon-inline ">XCTestCase</span>&nbsp;&nbsp;class with a test function in your unit test project
  3. Within the function body create&nbsp;a _nested_ class
  4. Make the nested class inherit from the real object you&#8217;re trying to mock / create a method stub for
  5. You can give the nested class a name such as Mock[ObjectName]
  6. Configure the mock object however you need by setting its properties or overriding its function implementations with stubbed implementations &#8211; no need to override every function&#8230; only the one(s) that your class calls during the test at hand
  7. Instantiate the class you&#8217;re testing and pass in an instance of the&nbsp;mock object you just nested in the test function to your&nbsp;class somehow (either through its initializer, by setting a property on the class, or by passing it into the method under test via parameter &#8212; however you intended to &#8216;inject&#8217; the mock from step 1 is what you should do)
  8. XCTAssert&#8230;

Let&#8217;s see those 8 steps in action for those of us who are more visually inclined.

EDIT: &nbsp;July 22, 2014 &#8211; I&#8217;ve added a simple XCode Project to GitHub for those interested in seeing the setup directly in XCode at &nbsp;<a title="GitHub - MocksAndStubs" href="https://github.com/andrewcbancroft/MocksAndStubs" target="_blank">https://github.com/andrewcbancroft/MocksAndStubs</a>

The scenario that I&#8217;d like to use a mock class in is this: &nbsp;I have a CoreData application and I&#8217;d like to be able to mock the <span class="lang:swift decode:true  crayon-inline ">NSManagedObjectContext</span>&nbsp;&nbsp;so that instead of making actual database fetch requests, I can just provide stubs of various sorts with the kinds of responses I&#8217;d expect from the real database calls to ensure my class will do the right thing based on predictable results. &nbsp;To do this I begin at step 1&#8230;

#### 1. &nbsp;Ensure that the&nbsp;class that you would like to test is designed so that you can substitute your mock for the real one that&#8217;s used in your class&#8217; implementation

In the&nbsp;example class below, I&nbsp;intend to provide the <span class="lang:swift decode:true  crayon-inline ">NSManagedObjectContext</span>&nbsp;&nbsp;dependency through&nbsp;the class&#8217; initializer which will set a property that is used by my class&#8217; methods later on, but you could easily use&nbsp;some other way of performing &#8220;dependency injection&#8221;. &nbsp;The initializer strategy just makes it super clear in _my_ mind what the class&#8217; dependencies are, so that&#8217;s what I&#8217;m going to do here. &nbsp;Have a look:

<pre class="lang:swift mark:5-9 decode:true">import Foundation
import CoreData

class MyClass {
    let context: NSManagedObjectContext
    
    init(managedObjectContext: NSManagedObjectContext) {
        self.context = managedObjectContext
    }
}</pre>

Now, let&#8217;s say that my example class has a member function called&nbsp;<span class="lang:swift decode:true  crayon-inline">databaseHasRecordsForSomeEntity</span>&nbsp; that returns a <span class="lang:swift decode:true  crayon-inline ">Bool</span>&nbsp;&nbsp;value of **true** if the resulting array of a fetch request contains objects, and a <span class="lang:swift decode:true  crayon-inline ">Bool</span>&nbsp;&nbsp;value of **false** if the result array of a fetch request is empty. &nbsp;The completed class looks like this:

<pre class="lang:swift mark:12-16 decode:true">import Foundation
import CoreData

class MyClass {
    let context: NSManagedObjectContext
    
    init(managedObjectContext: NSManagedObjectContext) {
        self.context = managedObjectContext
    }
    
    // If the array returned from executing a fetch request contains objects, return true; if empty, return false
    func databaseHasRecordsForSomeEntity() -&gt; Bool {
        let fetchRequest = NSFetchRequest(entityName: "SomeEntity")
        let fetchRequestResults = self.context.executeFetchRequest(fetchRequest, error: nil) // May want to do something with the error in real life...
        return (fetchRequestResults?.count &gt; 0)
    }
}</pre>

I want to test if&nbsp;<span class="lang:swift decode:true  crayon-inline ">databaseHasRecordsForSomeEntity</span>&nbsp;&nbsp;does what I intend it to do. So&#8230;

#### 2. &nbsp;Create an&nbsp;<span class="lang:swift decode:true  crayon-inline">XCTestCase</span>&nbsp;&nbsp;class with a test function in your unit test project

Just listing this for completeness

Next comes the way to make the mock. &nbsp;Read steps 3-5 and then look below for a code example of what the skeleton will look like.

#### 3. &nbsp;Within the function body create&nbsp;a&nbsp;_nested_&nbsp;class

#### 4. &nbsp;Make the nested class inherit from the real object you&#8217;re trying to mock / create a method stub for

#### 5. &nbsp;You can give the nested class a name such as Mock[ObjectName]

<pre class="lang:swift mark:3,18-22 decode:true">import UIKit
import XCTest
import CoreData // &lt;-- Make sure to import CoreData or you will get errors when you try to use NSManagedObjectContext

class MyClassTests: XCTestCase {

    override func setUp() {
        super.setUp()
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }

    // Yay for verbose test names!  :]
    func testDatabaseHasRecordsForSomeEntityReturnsTrueWhenFetchRequestReturnsNonEmptyArray() {
        class MockNSManagedObjectContext: NSManagedObjectContext {
            
        }
    }
}</pre>

#### &nbsp;6. &nbsp;Configure the mock object however you need by setting its properties or overriding its function implementations with stubbed implementations &#8211; no need to override every function&#8230; only the one(s) that your class calls during the test at hand

For my example, I&#8217;m going to stub out the <span class="lang:swift decode:true  crayon-inline">executeFetchRequest</span>&nbsp;&nbsp;method so that it returns an array with one object in it. &nbsp;This is really the part where you have to determine what you&#8217;re testing and what you expect the stubbed results to be. &nbsp;Whatever you decide, the way to stub a method is simply to override it in the mock you&#8217;re implementing. &nbsp;Here&#8217;s how I implemented the&nbsp;<span class="lang:swift decode:true  crayon-inline ">executeFetchRequest</span>&nbsp;&nbsp;stub for my example:

<pre class="lang:swift mark:4-5 decode:true">// Yay for verbose test names!  :]
    func testDatabaseHasRecordsForSomeEntityReturnsTrueWhenFetchRequestReturnsNonEmptyArray() {
        class MockNSManagedObjectContext: NSManagedObjectContext {
            override func executeFetchRequest(request: NSFetchRequest, error: NSErrorPointer) -> [AnyObject]? {
                return ["object 1"]
            }
        }
    }</pre>

We&#8217;re ready to perform the test and assert the results. &nbsp;Read steps 7-8 and take a look at the code example below step 8:

#### 7. &nbsp;Instantiate the class you&#8217;re testing and pass in an instance of the&nbsp;mock object you just nested in the test function to your&nbsp;class somehow (either through its initializer, by setting a property on the class, or by passing it into the method under test via parameter &#8212; however you intended to &#8216;inject&#8217; the mock from step 1 is what you should do)

#### 8. &nbsp;XCTAssert&#8230;

From step 1, I intended to pass an NSManagedObjectContext instance to the initializer of MyClass, so that&#8217;s what I&#8217;ll do in my test. &nbsp;I&#8217;ll then perform the XCTAssert on the return value of my method under test:

&nbsp;

<pre class="lang:swift mark:9-18 decode:true">// Yay for verbose test names!  :]
    func testDatabaseHasRecordsForSomeEntityReturnsTrueWhenFetchRequestReturnsNonEmptyArray() {
        class MockNSManagedObjectContext: NSManagedObjectContext {
            override func executeFetchRequest(request: NSFetchRequest, error: NSErrorPointer) -> [AnyObject]? {
                return ["object 1"]
            }
        }
        
        // Instantiate mock
        let mockContext = MockNSManagedObjectContext()
        
        // Instantiate class under test and pass it the mockContext object
        let myClassInstance = MyClass(managedObjectContext: mockContext)
        
        // Call the method under test and store its return value for XCTAssert
        let returnValue = myClassInstance.databaseHasRecordsForSomeEntity()
        
        XCTAssertTrue(returnValue == true, "The return value should be been true")
    }</pre>

Running the tests at this point should produce a passing test using the mock object in place of a real NSManagedObjectContext that calls a database!

Now, if I wanted to test the &#8220;false&#8221; branch of my class&#8217; method, I could simply create another test method following the same steps, only this time, I&#8217;d provide a new implementation for the overridden <span class="lang:swift decode:true  crayon-inline ">executeFetchRequest</span>&nbsp;&nbsp;method that&#8217;s appropriate:

<pre class="lang:default mark:4,17 decode:true">func testDatabaseHasRecordsForSomeEntityReturnsFalseWhenFetchRequestReturnsEMPTYArray() {
        class MockNSManagedObjectContext: NSManagedObjectContext {
            override func executeFetchRequest(request: NSFetchRequest, error: NSErrorPointer) -> [AnyObject]? {
                return [] // Provided a different stub implementation to test the "false" branch of my method under test
            }
        }
        
        // Instantiate mock
        let mockContext = MockNSManagedObjectContext()
        
        // Instantiate class under test
        let myClassInstance = MyClass(managedObjectContext: mockContext)
        
        // Call the method under test and store its return value for XCTAssert
        let returnValue = myClassInstance.databaseHasRecordsForSomeEntity()
        
        XCTAssertTrue(returnValue == false, "The return value should be been false")
    }</pre>

And that&#8217;s a wrap &#8211; happy mocking and stubbing in Swift!

EDIT: &nbsp;July 22, 2014 &#8211; I&#8217;ve added a simple XCode Project to GitHub for those interested in seeing the setup directly in XCode at &nbsp;<a title="GitHub - MocksAndStubs" href="https://github.com/andrewcbancroft/MocksAndStubs" target="_blank">https://github.com/andrewcbancroft/MocksAndStubs</a>

<div class="related-posts">
  You might also enjoy</p> 
  
  <ul>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/12/10/dont-write-legacy-swift/" title="Don’t Write Legacy Swift">Don&#8217;t Write Legacy Swift</a>
    </li>
    <li>
      <a href="http://www.andrewcbancroft.com/2014/07/22/swift-access-control-implications-for-unit-testing/" title="Swift Access Control – Implications for Unit Testing">Swift Access Control – Implications for Unit Testing</a>
    </li>
  </ul>
</div>