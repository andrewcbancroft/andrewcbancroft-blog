---
title: Troubleshooting SQL Server 2012 Reporting Services and SharePoint 2010 Integration (Part 1)
author: Andrew
type: blog
date: 2012-06-30T19:06:39+00:00
aliases:
  - /2012/06/30/troubleshooting-sql-server-2012-reporting-services-and-sharepoint-2010-integration-part-1/
suf_meta_description:
  - Troubleshooting SQL Server 2012 Reporting Services and SharePoint 2010 Integration
suf_meta_keywords:
  - SSRS SharePoint, SSRS 2012, Install SSRS, Troubleshoot SSRS Installation
dsq_thread_id:
  - "2683715362"
categories:
  - Business Intelligence
  - Reporting Services
tags:
  - BI
  - Reporting Services
  - SharePoint
  - SSRS
  - Troubleshooting

---
I recently worked with our SharePoint administrator to install SQL Server 2012 Reporting Services in SharePoint Integrated Mode to take advantage of PowerView.  By following the installation instructions <a title="Install Reporting Services SharePoint Mode as a Single Server Farm" href="http://msdn.microsoft.com/en-us/library/gg492276.aspx" target="_blank">found at this MSDN article</a>, we were able to painlessly install both Reporting Services and the Reporting Services Add-in from the SQL Server installation media.

Then began the configuration process.  Since everyone's environment is different, I found it difficult to troubleshoot some of the odd behavior that we were running in to.  In Part 1 of this post I want to focus on what we did to overcome a specific error we were receiving:

After installation, I created a Business Intelligence Center site without any trouble.  In the Connections library, I would attempt to add a Report Data Source and receive a SharePoint page that detailed the following error:

<div class="note">
  <p>
    This SQL Server Reporting Services (SSRS) functionality is not supported.  Use Central Administration to verify and fix one or more of the following issues:
  </p>
  
  <ul>
    <li>
      A report server URL is not configured.  Use the SSRS Integration page to set it.
    </li>
    <li>
      The SSRS service application proxy is not configured.  Use the SSRS service application pages to configure the proxy.
    </li>
    <li>
      The SSRS service application is not mapped to this web application.  Use the SSRS service application pages to associate the SSRS service application proxy to the web application.
    </li>
  </ul>
</div>

Other times, I would receive a little bit more of a generic message saying something to the effect of &#8220;This SQL Server Reporting Services (SSRS) functionality is not supported&#8221; or &#8220;Unsupported Reporting Services Functionality&#8221;.

As it turns out, our specific problem was unrelated to any three of those bullet points.

Our solution?

<div class="note">
  Make sure to install the &#8220;Reporting Services Add-in for SharePoint Products&#8221; to all Web Front-End (WFE) nodes of your SharePoint farm.
</div>

On the Feature Selection screen of SQL Server setup, you can simply choose &#8220;Reporting Services Add-in for SharePoint Products&#8221; on your other WFE nodes.  You don't need to install the Database Engine Services or Reporting Services – SharePoint all over again&#8230;just the Add-in.

We began to suspect it was something related to missing components on the other nodes because as I was troubleshooting, I noticed that if I attempted to create a Report Data Source enough times, I would be able to proceed to different stages of the creation process.  Sometimes I would hit the error right away.  Sometimes I would get to the page where I could fill out the connection details but when I would attempt to save the data source I would get one of the error pages described above.

After we installed the Reporting Services Add-in on all WFE nodes, the problem stopped and we have not experienced any difficulty since.