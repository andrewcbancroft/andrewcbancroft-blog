---
title: Troubleshooting SQL Server 2012 Reporting Services and SharePoint 2010 Integration (Part 2)
author: Andrew
type: blog
date: 2012-06-30T19:44:36+00:00
aliases:
  - /2012/06/30/troubleshooting-sql-server-2012-reporting-services-and-sharepoint-2010-integration-part-2/
suf_meta_description:
  - Troubleshooting SQL Server 2012 Reporting Services and SharePoint 2010 Integration
suf_meta_keywords:
  - SSRS SharePoint, SSRS 2012, Install SSRS, Troubleshoot SSRS Installation
dsq_thread_id:
  - "2685367305"
categories:
  - Business Intelligence
  - Microsoft
  - Reporting Services
tags:
  - BI
  - BI Semantic Model
  - Reporting Services
  - SharePoint
  - SSAS
  - SSRS
  - Troubleshooting

---
You can visit Part 1 of this troubleshooting series by [clicking here][1].

During our configuration of Reporting Services for SharePoint I ran into another common issue.

I consulted MSDN once again and followed the directions <a title="PowerPivot BI Semantic Model Connection (.bism) " href="http://msdn.microsoft.com/en-us/library/gg471575.aspx" target="_blank">given at this MSDN article</a>.  Even after following all these instructions, when I would attempt to create a new BI Semantic Model Connection in the SharePoint library, I would receive the following error:

<div class="note">
  Cannot connect to the server or database.
</div>

Even after adding the Reporting Services service account to the SSAS Tabular instance as a server administrator, we still hit this error.

Once again I found little documentation out there as I was troubleshooting, presumably because SQL Server 2012 is still quite new.  Here's what we did to fix our problem:

<div class="note">
  <strong>The Analysis Services service must be running under a domain account.</strong>  When I installed SSAS, I took all the defaults for the server installation.  The SSAS service was running under some default built-in account which ended up being the problem.
</div>

Once we switched this to run under a domain account, I was able to create BI Semantic Model Connections using this library document type with no issues.

 [1]: http://andrewcbancroft.com/2012/06/30/troubleshooting-sql-server-2012-reporting-services-and-sharepoint-2010-integration-part-1/ "Troubleshooting SQL Server 2012 Reporting Services and SharePoint 2010 Integration (Part 1)"