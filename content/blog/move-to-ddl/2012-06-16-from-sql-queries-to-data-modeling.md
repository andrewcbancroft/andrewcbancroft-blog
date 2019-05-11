---
title: From SQL Queries to Data Modeling
author: Andrew
type: blog
date: 2012-06-16T19:25:15+00:00
aliases:
  - /2012/06/16/from-sql-queries-to-data-modeling/
dsq_thread_id:
  - "2705391121"
categories:
  - Business Intelligence
tags:
  - Data Modeling
  - SQL

---
This past week I had the opportunity to attend Microsoft TechEd 2012. Lots and lots of great material presented &#8211; I&#8217;m pretty stoked about some of the amazing features of SQL Server 2012&#8217;s BI stack.

During the course of the week I discovered something that has been emerging in my thought process for a while, but sort of hit the level of practicality as I saw one particular feature demonstrated: the BI Semantic Model. I walked away from session after session thinking, &#8220;Man, this is so doable now!!&#8221;. This was the single most impressive and perspective altering concept that flooded into my brain this week.

There comes a time in every organization that necessitates a paradigm shift: One that involves a move _toward_ data _modeling_ and a _away_ from SQL query writing for the purpose of supplying data sets to reports. By no means am I suggesting that writing SQL will disappear for database / BI Developers &#8211; but as a means to serving as the backbone of an organization&#8217;s reporting infrastructure, there will inevitably come a time that employing more and more people capable of writing SQL will be unsustainable.

The reasons for this are clear: As an enterprise continuously builds or purchases data collection systems, the users of those systems expect to be able to get _information_ back out. So they ask questions. Unpredictable combinations of questions. They are too numerous and too diverse for even a dedicated team of reporting people to write SQL to a database every time a business person has a question they want to ask of their data. For a while, parameterized reports suffice for most questions. But still the organization grows and evolves, and decision makers expect that they should be able to analyze information at their convenience, not at the mercy of the IT Department&#8217;s work schedule.

Microsoft has worked hard to give BI developers effective ways to build models so as to enable us to write less SQL (at least when it comes to supplying answers to the multitude of questions that come our way) and empower our business folks to create their own reports that are based on the model we build. In my view, this is the direction that we must inevitably go. Without this, IT becomes a significant bottleneck to the progress that could be made from timely data analysis.

I&#8217;m personally looking forward to using SQL Server 2012 to promote better query-ability and visibility of the information my customers are dying to get their hands on!