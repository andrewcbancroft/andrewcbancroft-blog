---
title: 'SQL Sever Synonyms, Entity Framework, and Integrated Security'
author: Andrew
type: blog
date: 2015-05-01T17:44:31+00:00
url: /2015/05/01/using-sql-sever-synonyms-entity-framework-integrated-security/
dsq_thread_id:
  - "3728582714"
categories:
  - .Net Development
tags:
  - .Net
  - Entity Framework
  - Security
  - SQL Server

---



<a name="scenario" class="jump-target"></a>

### Scenario

This may be an edge case, but I spent enough time (a couple of _days_) spinning on this that I thought it warranted a signpost on the Internet.

Suppose you have the following scenario before you:

**Basics**

  * You're building an ASP.Net web application
  * Entity Framework has been chosen as your ORM
  * SQL Server (any version supporting [Synonyms][1]) is your backend database server of choice

**Details**

  * You're using "Integrated Security=True&#8221; in your connection string to the database (in web.config)
  * The Application Pool in which your app resides is running under a domain service account (ie, not the default identity)
  * Your application primarily talks to one database, but there is information in _another_ database that you need to pull into your app
  * To access the data in that other database, you've chosen to create a [Synonym][1]

Every bullet point in this scenario is normal and valid, until you get to the part about using "Integrated Security=True&#8221; in your connection string&#8230;

<a name="login-failed" class="jump-target"></a>

### Login failed for user &#8216;NT AUTHORITY\ANONYMOUS LOGON'

If you had chosen to use SQL Server authentication in your conenction string, and passed in a username and password for a SQL Server login that had permissions to the database, things would have worked out perfectly. I know this because that's what I had been doing in my own application. I started running into the "Login failed&#8230;&#8221; error message once I switched to Integrated Security.

For some reason "Integrated Security=True&#8221; that throws Entity Framework for a loop. It accesses the database used in the `DbContext` instance just fine, but the second a line of code needs to use the object mapped to the _Synonym_, **boom**&#8230; crash&#8230; error&#8230;

<a name="reolving-error" class="jump-target"></a>

### Resolving the error

It turns out that the resolution is really, really simple. Instead of using a Synonym, use a View. You don't have to change a single line of .Net code. Just make sure the view is named the same as the Synonym was (and drop the Synonym from the database, of course).

<a name="creating-view" class="jump-target"></a>

#### Creating the view

A Synonym essentially maps to an entire table, so the View's structure could literally be a simple `select * from [fully.qualified.database.objectName]`. If your DBA hates `select *`, you'll end up listing out every column that your Entity Framework object lists as one of its Properties.

<a name="granting-permissions" class="jump-target"></a>

#### Granting permissions

If the service account that's running your Application Pool doesn't already have permission to the database objects you created the View for, you need to go in and grant appropriate permissions to that account. Otherwise, you're likely to get an error stating

> The server principal "Domain\PrincipalName&#8221; is not able to access the database "DatabaseName&#8221; under the current security context.

Be specific and granular with the permission you grant to the account. If you're just pulling in data for your app to display, only give the account SELECT permission on the database object your View references.

### Wrapping up

In essence, using a Synonym that references a database object in _another database_ with Entity Framework and Integrated Security just doesn't work out in the end. Somehow, the security context loses the identity of the account running the application pool, and the dreated Login failed for user &#8216;NT AUTHORITY\ANONYMOUS LOGON' rears its ugly head. Thankfully, the solution is simple: Create a View instead of a Synonym, grant approprate permissions, and you'll be off and running (and you'll avoid usernames and passwords in your web.config)!

<a name="share" class="jump-target"></a>

 [1]: https://msdn.microsoft.com/en-us/library/ms187552.aspx