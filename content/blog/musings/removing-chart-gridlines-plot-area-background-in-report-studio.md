---
title: 'Removing Chart Gridlines & Plot Area Background in Report Studio'
author: Andrew
type: blog
date: 2013-03-05T16:48:20+00:00
url: /2013/03/05/removing-chart-gridlines-plot-area-background-in-report-studio/
dsq_thread_id:
  - "2684500156"
categories:
  - Cognos 10
tags:
  - Grid Lines
  - IBM
  - Plot Area
  - Report Studio

---
The steps from IBM’s <a href="http://pic.dhe.ibm.com/infocenter/cbi/v10r1m0/index.jsp?topic=%2Fcom.ibm.swg.im.cognos.ug_cr_rptstd.10.1.0.doc%2Fug_cr_rptstd_id6040custom_axes.html" target="_blank">official documentation</a>, while they attempt to lead you in the direction of changing these properties of a chart, did not register with my brain for about an hour or so of clicking around, frustrated that I could not find the properties they were describing in the articl.&nbsp; Just in case I could spare anyone else the frustration of trying to remove gridlines in Report Studio’s current default charts, I thought I’d post this quick article on how I solved my problem.

The documentation states, “Step 1.&nbsp; Select the Y-axis or the X-axis of the chart”.

Easy enough, right?&nbsp; Well as it turns out, Step 1 is where I was going wrong…

Where was I clicking?&nbsp; Not the Y-axis apparently.&nbsp; I was clicking the _label_ for the Y-axis: 

[<img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="image" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb.png" width="725" height="280" />][1]

Once I was clicking the right thing, the solution to remove the grid lines from my chart was simple.&nbsp; So where did I _need_ to click?

[<img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="image" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb1.png" width="725" height="314" />][2]

The correct properties show up in the property inspector once you’re actually clicking the axis and not the axis label.&nbsp; To remove the grid lines and the alternating colors in the plot area, simply redefine the Gridlines property:

[<img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="image" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb2.png" width="380" height="486" />][3]

Clear the checkboxes for “Show alternating color bands” and “Show major gridlines” to get rid of them on the chart:

[<img style="background-image: none; border-right-width: 0px; padding-left: 0px; padding-right: 0px; display: inline; border-top-width: 0px; border-bottom-width: 0px; border-left-width: 0px; padding-top: 0px" title="image" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image_thumb3.png" width="288" height="393" />][4]

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image1.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image2.png
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2013/03/image3.png