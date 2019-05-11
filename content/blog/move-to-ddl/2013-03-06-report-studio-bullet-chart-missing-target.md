---
title: Report Studio Bullet Chart – Missing Target
author: Andrew
type: blog
date: 2013-03-06T16:34:36+00:00
url: /2013/03/06/report-studio-bullet-chart-missing-target/
dsq_thread_id:
  - "2706422548"
categories:
  - Cognos 10
tags:
  - Bullet Chart
  - Bullet Chart Issue
  - Missing Target
  - No Target
  - Report Studio

---
Today I was working on a bullet chart in Cognos Report Studio.  The chart was rendering, but the target bar would never appear.  Here’s the scenario I was in and how I resolved my issue:

# My Goal:

My goal was to show the average time to process an application against a target processing time for the current fiscal year.

# My Situation:

My “actual” value was being returned in my query to the data warehouse – It is an average of the days to process an application (defined in Framework Manager).

My “target” value does not exist in the data warehouse, so I created a calculated item in my Report Studio query to hold the target value:

[<img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border: 0px;" title="SNAGHTML6c0eff" alt="SNAGHTML6c0eff" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/SNAGHTML6c0eff_thumb.png" width="722" height="452" border="0" />][1]

# My Problem:

I created a bullet chart and dragged the appropriate items to the appropriate place in the chart:

[<img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border: 0px;" title="image" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb4.png" width="515" height="464" border="0" />][2]

The result of this when I ran the report, however, was a chart with a bullet but no target:

[<img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border: 0px;" title="image" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb5.png" width="434" height="124" border="0" />][3]

# My Solution:

As it turns out, the Aggregation Function of my “Target Completion Time” was throwing things off for the chart.  This property’s default value is “Automatic”.

**Changing the Aggregation Function from “Automatic” to “Calculated” fixed the issue**:

[<img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border: 0px;" title="image" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb6.png" width="725" height="329" border="0" />][4][<img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border: 0px;" title="image" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb7.png" width="351" height="284" border="0" />][5]

# The Result:

The bullet _and_ the target now appear on my chart:

[<img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border: 0px;" title="image" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb8.png" width="406" height="114" border="0" />][6]

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/SNAGHTML6c0eff.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image4.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image5.png
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image6.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image7.png
 [6]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image8.png