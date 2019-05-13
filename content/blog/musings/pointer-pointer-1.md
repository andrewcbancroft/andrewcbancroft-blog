---
title: 'Pointer Pointer #1'
author: Andrew
type: blog
date: 2012-06-17T19:45:05+00:00
aliases:
  - /2012/06/17/pointer-pointer-1/
dsq_thread_id:
  - "2683481316"
categories:
  - C
tags:
  - C
  - Pointers

---
Part of my confusion with the C family of languages has been how the * symbol worked in the various places it's used in relation to pointers. A key insight helped de-mystify a lot for me:

The * symbol is used as both a _type_ declaration _and_ as an _operator_ (the de-reference operator).

<div>
  Example:
</div>

<pre class="brush: c">// * used as a type declaration
    int *intPointer;

    // declare a regular integer variable named i
    int i = 10;

    // set where intPointer points to by assigning it the address of i
    intPointer = &i;

    // * used as the de-reference operator
    printf("Value returned when intPointer is de-referenced: %dn", *intPointer);
```

On line 2 the variable intPointer is declared to be a variable of _type_ pointer to an integer.

On line 8 I tell intPointer where to point to, namely the address of i in memory.  It's like intPointer is asking, "Which integer do I point to?&#8221; and the answer comes, "This one&#8230;the one at the address of i&#8221;, which is expressed in C as &i.

After intPointer is set to point to some spot (address) in memory, the _value_ of whatever it points to can be accessed by applying the de-reference operator, which just so happens to use the same * that was used to declare the variable intPointer on line 2. And that's precisely where my brain went cross-eyed.

Since * is used to declare a variable of type pointer to <span style="text-decoration: underline;">[some type of data]</span> _and_ as the de-reference operator which gets at the value that a pointer variable points to, my mind had a hard time separating what was happening.

Line 11 is where intPointer is "de-referenced&#8221; to get the value stored at the location in memory where intPointer points to. It says, "Follow intPointer to where it's pointing to in memory (which in this case is the address of the variable i), open the box there, and let me see the value that's at that spot.&#8221;  When I run this code, the number 10 is printed to the console as expected.

In summary:  Pointer pointer #1 attempts to make clear that the * symbol's meaning is overloaded.  Not only is it used for multiplication, but when dealing with pointers it's used to declare a variable of type pointer to <span style="text-decoration: underline;">[some type of data]</span> _and_ as the de-reference operator which gets at the value that a pointer variable points to.

[A second pointer pointer can be found here.][1]  It deals with the difference between the address the pointer holds and the address that holds the pointer.

 [1]: http://andrewcbancroft.com/2012/06/24/pointer-pointer-2/ "Pointer Pointer #2"