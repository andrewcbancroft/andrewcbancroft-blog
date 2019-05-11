---
title: “Unexpected System Error” in DataStage Sequence Job
author: Andrew
type: blog
date: 2013-04-16T14:15:54+00:00
aliases:
  - /2013/04/16/unexpected-system-error-in-datastage-sequence-job/
dsq_thread_id:
  - "2696877773"
categories:
  - DataStage
tags:
  - An unexpected system error occurred
  - DataStage Sequence Job
  - SQL1042C
  - SQLSTATE=58004

---
Today I was running into a mysterious error in DataStage as I was running a sequence job.&nbsp; Things seemed to be going well until one of my Fact jobs at the end of the sequence reported “Aborted” in DataStage Director.&nbsp; Looking into the log for this job revealed a rather vague error message:

\[StageName] DB2 function SQLFetch failed:&nbsp; SQLSTATE = HY000: Native Error Code = -1,042: Msg = [IBM\]\[CLI Driver\][DB2/LINUXX8664] SQL1042C&nbsp; An unexpected system error occurred.&nbsp; SQLSTATE=58004 (CC\_DB2Connection::queryServerHostName, file CC\_DB2Connection.cpp, line 3,256)

What’s strange is that the job, when re-compiled and run on its own, executes without error.&nbsp; So it only fails when its run in the context of the sequence job.

To fix the issue, I simply rearranged the order of the sequence at the end.&nbsp; Here is a before and after look at the sequence:

### Before:

[<img title="image" style="border-left-width: 0px; border-right-width: 0px; background-image: none; border-bottom-width: 0px; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border-top-width: 0px" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/04/image_thumb.png" width="515" height="496" />][1]

### After:

[<img title="image" style="border-left-width: 0px; border-right-width: 0px; background-image: none; border-bottom-width: 0px; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border-top-width: 0px" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/04/image_thumb1.png" width="609" height="208" />][2]

The sequence job runs every job now without error.&nbsp; Now I only wish I knew _why_ this works – perhaps it’s an issue with server resources getting tied up if both Fact jobs are running at the same time?&nbsp; I’ve decided to go with the above as my solution and move on, since neither Fact job takes an enormous amount of time to run.&nbsp; Hopefully this solution will work for others as well!

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2013/04/image.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2013/04/image1.png