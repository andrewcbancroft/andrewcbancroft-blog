---
title: 'Pointer Pointer #2'
author: Andrew
type: blog
date: 2012-06-24T14:23:33+00:00
aliases:
  - /2012/06/24/pointer-pointer-2/
dsq_thread_id:
  - "2683480102"
categories:
  - C
tags:
  - C
  - Pointers

---
[Pointer Pointer #1 can be found here][1] &#8211; it deals with how the &#8220;*&#8221; symbol is used in different places when dealing with pointers.

A second pointer I have on pointers that helped me is this:

A pointer stores an address of where some piece of data &#8220;lives&#8221; (begins its bit pattern) in memory.  What recently became clear to me is that a pointer, itself,_ _is _also_ stored as a bit pattern in memory.

Here some example code and its output to help visualize what I&#8217;m saying:

[cpp wraplines=&#8221;true&#8221;]  
#include <stdio.h>

int main(int argc, char *argv[])  
{  
int *intPointer;

int i = 10;

intPointer = &i;

printf("intPointer stores the address of i, which is: %pn", intPointer);  
printf("intPointer, itself, is stored at an address, which is different than the address intPointer stores: %pn", &intPointer);

return 0;  
}  
[/cpp]

Output (on my machine):

<p class="note">
  intPointer stores the address of i, which is: <strong>0x7fff6bacab9c</strong><br /> intPointer, itself, is stored at an address, which is different than the address intPointer stores: <strong>0x7fff6bacaba0</strong>
</p>

This may or may not be obvious to you (it wasn&#8217;t to me until I understood a tiny bit of what&#8217;s happening a little further down in the computer&#8217;s layers of abstraction).  When it comes down to it, all of our C code is an abstraction.  C, and any high-level programming language removes the complexity of having to figure out how to lay down bit patterns in memory (among other things).

The key insight I gained from this discovery is that _any_ type of variable, including pointers, that we declare and use in C code eventually translates to some bit pattern in memory that our computers use to do work with.  It took realizing that pointers, themselves were stored in memory to see this, but I&#8217;m glad it finally came to light because it&#8217;s helped de-mystify some of the mystery world of pointers.

 [1]: http://andrewcbancroft.com/2012/06/17/pointer-pointer-1/ "Pointer Pointer #1"