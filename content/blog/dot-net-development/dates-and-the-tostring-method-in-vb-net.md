---
title: Date, Date?, and the ToString Method in VB.Net
author: Andrew
type: blog
date: 2014-10-03T17:28:05+00:00
aliases:
  - /2014/10/03/dates-and-the-tostring-method-in-vb-net/
dsq_thread_id:
  - "3079867169"
categories:
  - .Net Development
  - VB.Net
tags:
  - Date
  - Date Format
  - Nullable Date
  - VB.Net

---
I just spent the last 45 minutes frustrated as to why I was getting the following exception

[<img class="alignnone size-large wp-image-5421" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/10/Input-string-was-not-in-the-correct-format-1024x351.png" alt="Input string was not in the correct format" width="730" height="250" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2014/10/Input-string-was-not-in-the-correct-format-1024x351.png 1024w, https://www.andrewcbancroft.com/wp-content/uploads/2014/10/Input-string-was-not-in-the-correct-format-300x102.png 300w, https://www.andrewcbancroft.com/wp-content/uploads/2014/10/Input-string-was-not-in-the-correct-format-1200x411.png 1200w, https://www.andrewcbancroft.com/wp-content/uploads/2014/10/Input-string-was-not-in-the-correct-format.png 1440w" sizes="(max-width: 730px) 100vw, 730px" />][1]

&#8220;Input string was not in a correct format.&#8221; and &#8220;[InvalidCastException: Conversion from string &#8220;MMMM dd, yyyy&#8221; to type &#8216;Integer' is not valid.]

I kept thinking to myself, &#8220;How hard can this possibly be?!!  I've done this a thousand times &#8212; Why is it wanting to convert my format string into an Integer??!  AAHHH!!&#8221;.  Consulting <a title="MSDN - Custom Date and Time Format Strings" href="http://msdn.microsoft.com/en-us/library/8kb3ddd4(v=vs.110).aspx?cs-save-lang=1&cs-lang=vb#code-snippet-1" target="_blank">MSDN on the matter</a> only confirmed that I knew what I was doing with the string formatter.

What got me in the end is that it turns out I _didn't_ know what I was doing with my _Date_ object.  In fact, I wasn't dealing with a <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline">Date</span> object at all.  I was dealing with a <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline ">Date?</span> object (that is, a <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline">Nullable(of Date)</span>. <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline">Date</span> and <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline">Date?</span>  are not the same. And it _matters_, because the <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline ">ToString()</span> method of <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline">Date</span> has _different overloads _than the <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline ">ToString()</span> method of <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline">Date?</span>.  Only the <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline">Date</span> type allows you to put in a format string to fancy up how the date is displayed when it's converted to a string.

### My solution:

1.  Wrap my <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline ">Date?</span> object instance in a <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline">CType</span>, converting to type <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline">Date</span>.

2.  Call <span class="theme:vs2012 lang:vbnet decode:true  crayon-inline ">ToString()</span> on the _converted_ value:

```
CType(someObject.dateInstance, Date).ToString("MMMM dd, yyyy")
```

Sanity&#8230; _recovered._

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2014/10/Input-string-was-not-in-the-correct-format.png