---
title: Resolving “UDA-SQL-0569 Unable to load the driver manager library ( db2cli.dll )” with Framework Manager 10.1
author: Andrew
type: blog
date: 2012-10-17T15:29:23+00:00
aliases:
  - /2012/10/17/resolving-uda-sql-0569-unable-to-load-the-driver-manager-library-db2cli-dll-with-framework-manager-10-1/
dsq_thread_id:
  - "2683748153"
categories:
  - Framework Manager
tags:
  - Framework Manager
  - Logon Failed
  - Troubleshooting

---
When installing Framework Manager 10.1 and attempting to use it for the first time, things went down hill nearly immediately.  I made sure to install a copy of the DB2 client on my development machine, but I still ran into issues connecting to data sources in Framework Manager.

For those who need to install a DB2 client, IBM provides those downloads [here][1] for DB2 10.1.  For other versions, you can go [here][2].  [Added 3/19/2013]

A good explanation of what each DB2 client &#8220;package&#8221; includes and what they&#8217;re used for can be found [here][3].

**Steps that I was taking:**

  * Load Framework Manager and open a project
  * Expand Data Sources
  * Right-Click Data Source and click Test
  * The following happens:

[<img style="background-image: none; padding-left: 0px; padding-right: 0px; display: inline; padding-top: 0px; border-width: 0px;" title="SNAGHTML194624" alt="SNAGHTML194624" src="http://www.andrewcbancroft.com/wp-content/uploads/2012/10/SNAGHTML194624_thumb.png" width="666" height="208" border="0" />][4]

**Text from dialog box:**

QE-DEF-0285 The logon failed.  
QE-DEF-0325 The logon failed for the following reason:  
RQP-DEF-0068 Unable to connect to at least one database during a multi-database attach to 1 database(s) in:  
DW  
UDA-SQL-0569 Unable to load the driver manager library ( db2cli.dll ).  
UDA-SQL-0571 The operating system returned an error message ( The specified module could not be found. ).

**How I resolved this:**

I simply moved C:Program FilesIBMSQLLIBBIN placed in PATH variable near the front of the list of directories. Depending on your installation directory, you may need to change the path above to fit your environment.  But this seems to have resolved my problem entirely.

 [1]: http://www-01.ibm.com/support/docview.wss?rs=4020&uid=swg21385217
 [2]: http://www-01.ibm.com/support/docview.wss?uid=swg27016878
 [3]: http://www.db2dean.com/Previous/DB2Client.html
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2012/10/SNAGHTML194624.png