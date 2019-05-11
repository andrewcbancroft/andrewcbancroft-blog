---
title: DataStage Range Lookup Failure – What Gives?
author: Andrew
type: blog
date: 2013-03-25T17:52:13+00:00
url: /2013/03/25/datastage-range-lookup-failure-what-gives/
dsq_thread_id:
  - "2683953782"
categories:
  - DataStage
tags:
  - DataStage
  - Job aborting due to lookup failure on link
  - Range Lookup
  - Range Lookup Failure
  - Troubleshooting

---
I just spent the majority of my morning trying to figure out why in the world my range lookup kept failing.&nbsp; Hopefully this will save you some time in troubleshooting _your_ range lookup failures.&nbsp; To cut right to the chase, **my resolution involved _sorting_ my reference source prior to doing the lookup**.&nbsp; Adding a sort stage with the appropriate sort keys prior to doing the lookup solved my problem.&nbsp; I probably learned this in a training at some point, but I just didn’t retain it.&nbsp; So I learned it again the hard way.

For those who’d like to see a bit more of the details involved, feel free to have a look below.

### Scenario:

I have a list of funding transactions in my data pipeline that lack some information, namely, the student’s major at the time he/she was funded.&nbsp; They key phrase there is “_at the time he/she was funded”._&nbsp; 

To assist in supplementing my fact record (the funding transaction) with this student demographic information, I have constructed a snapshot table in the data warehouse that captures a student’s major as a sort of “slowly changing dimension”.&nbsp; Each time a change in the student’s major is detected, new records are inserted and effective and expiration dates are adjusted.&nbsp; I’d like to supplement my funding record with this student major information by doing a lookup.&nbsp; Here is the information I have to work with, just to be clear:

My source data pipeline starts with my funding transactions.&nbsp; It contains

  * Student ID (Key) 
      * Transaction Date (will help me with my lookup) 
          * Other columns that aren’t relevant to this particular task</ul> 
        I also have a slowly changing dimension that tracks a historical record of each student’s major for various time intervals.&nbsp; It contains
        
          * Student ID (Key) 
              * Effective Date of the student’s major (will help with lookup) 
                  * Expiration Date of the student’s major (will help with lookup) 
                      * Student’s major (the information I want to use to supplement my fact row)</ul> 
                    ### Range Lookup (My [failing] Setup):
                    
                    To accomplish my goal of supplementing the fact record with the student’s major, I needed to do a range lookup.&nbsp; Below are sample screenshots of how I was attempting to set things up:
                    
                    **View of the job design surface:**
                    
                    [<img title="image" style="border-left-width: 0px; border-right-width: 0px; background-image: none; border-bottom-width: 0px; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border-top-width: 0px" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb9.png" width="523" height="478" />][1]
                    
                    **View of Lookup Stage:**
                    
                    [<img title="image" style="border-left-width: 0px; border-right-width: 0px; background-image: none; border-bottom-width: 0px; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border-top-width: 0px" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb10.png" width="702" height="326" />][2]
                    
                    Notice that I use StudentID as a key so that I match the funding row to a particular student.&nbsp; Now, to get his/her major at the time they were funded, I do a range lookup on the DateFunded column…
                    
                    **View of Range Lookup on DateFunded:**
                    
                    [<img title="image" style="border-left-width: 0px; border-right-width: 0px; background-image: none; border-bottom-width: 0px; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border-top-width: 0px" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb11.png" width="725" height="517" />][3]
                    
                    After compiling the job and running it, I would receive this error message:&nbsp; 
                    
                    Lookup_StudentFieldOfStudy,0: Job aborting due to **lookup failure** on link: List_StudentFieldOfStudy
                    
                    [<img title="image" style="border-left-width: 0px; border-right-width: 0px; background-image: none; border-bottom-width: 0px; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border-top-width: 0px" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb12.png" width="725" height="121" />][4]
                    
                    ### Problem Solved:
                    
                    As stated in the introduction, to fix this problem, I simply added a sort stage prior to the lookup stage on the link serving as my reference (that is, on the link containing the value I’m trying to look up, which in my case was the student’s major/field of study).&nbsp; Here are some screen shots of how my job looked after I fixed it:
                    
                    **View of the job design surface:**
                    
                    [<img title="image" style="border-left-width: 0px; border-right-width: 0px; background-image: none; border-bottom-width: 0px; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border-top-width: 0px" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb13.png" width="691" height="462" />][5]
                    
                    **View of Sort Stage:**
                    
                    [<img title="SNAGHTML100fd47" style="border-left-width: 0px; border-right-width: 0px; background-image: none; border-bottom-width: 0px; padding-top: 0px; padding-left: 0px; display: inline; padding-right: 0px; border-top-width: 0px" border="0" alt="SNAGHTML100fd47" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/SNAGHTML100fd47_thumb.png" width="517" height="397" />][6]
                    
                    An important note about the sort stage.&nbsp; I needed to include **two sort keys** – one to sort the students, and another to sort the effective dates of each student’s major(s).
                    
                    Everything else in the job remained exactly the same.&nbsp; The results were a successfully running job with no lookup failures.

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image9.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image10.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image11.png
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image12.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image13.png
 [6]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/SNAGHTML100fd47.png