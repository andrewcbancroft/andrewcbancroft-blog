---
title: Solving ‘Spatial types and functions are not available’ with Entity Framework
author: Andrew
type: blog
date: 2017-03-27T16:38:33+00:00
aliases:
  - /2017/03/27/solving-spatial-types-and-functions-are-not-available-with-entity-framework/
dsq_thread_id:
  - "5670890129"
categories:
  - 'C#'
tags:
  - Entity Framework
  - Spatial
  - SQL Server

---
Using SQL Server's Geospatial features with Entity Framework is awesome. I was crusing along just fine with using `DbGeography` for an ASP.Net application I'm working on&#8230; Right up until I deployed to the server. Yep. It worked on _my_ machine, but alas, I was hitting a runtime exception on my test server.

This was the exception:

> Spatial types and functions are not available for this provider because the assembly &#8216;Microsoft.SqlServer.Types' version 10 or higher could not be found. 

Luckily, I ran across a [Stack Overflow answer][1] that _almost_ helped me get all the way there in solving this exception. It was actually [the second-most up-voted answer][2] that helped me the most. You're welcome to reference these if you want, but since the info is scattered between the question and the two answers, I'm assembling it here for your convenience.

# Fixing &#8216;Spatial types and functions are not available'

## 1 – Install the Microsoft.SqlServer.Types package from NuGet

You can install it using the NuGet Package Manager UI, or from the command line:

[<img src="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/NuGetPM_MSSqlServerTypes1.png" alt="NuGetPM_MSSqlServerTypes" width="985" height="270" class="alignnone size-full wp-image-13100" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2017/03/NuGetPM_MSSqlServerTypes1.png 985w, https://www.andrewcbancroft.com/wp-content/uploads/2017/03/NuGetPM_MSSqlServerTypes1-300x82.png 300w" sizes="(max-width: 985px) 100vw, 985px" />][3]

or

`> Install-Package Microsoft.SqlServer.Types`

## 2 – Follow readme.htm instructions

After you install the NuGet package, a readme.htm file is opened and displayed to you. If you don't see it for some reason, a new SqlServerTypes folder was added to your project. You can expand it and double-click readme.htm to open it.

Follow the instructions within.

Depending on the type of app you're deploying, you need to perform different steps. I happened to be deploying an ASP.Net MVC app, so I followed the instructions for adding a line of code to Global.asax.cs. Your situation may be different, but the Readme instructions are clear on what to do.

### ASP.Net Web _Applications_

Open Global.asax.cs and add the following to the list of registrations in `Application_Start()`:

```c#
protected void Application_Start()
{
    // Enables use of spatial data types
    SqlServerTypes.Utilities.LoadNativeAssemblies(Server.MapPath("~/bin"));

    // Other registrations...
}
```

### Asp.Net _Websites_

Open Default.aspx.cs and add

```c#
public partial class _Default : System.Web.UI.Page
{
    static bool _isSqlTypesLoaded = false;

    public _Default()
    {
        if (!_isSqlTypesLoaded)
        {
            SqlServerTypes.Utilities.LoadNativeAssemblies(Server.MapPath("~"));
            _isSqlTypesLoaded = true;
        }
        
    }
}
```

### Desktop Applications

Add the following before any spatial operations are performed.

```c#
SqlServerTypes.Utilities.LoadNativeAssemblies(AppDomain.CurrentDomain.BaseDirectory);
```

### 3 – Tell Entity Framework which version of the assembly to use

Most of the explanations of how to solve the &#8220;&#8216;Microsoft.SqlServer.Types' version 10 or higher&#8221; error stopped at step 2.

After performing the steps that readme.htm outlined, I re-deployed the app, and things were still broken. Same exception. What gives??

This is where that [second-most-popular answer][2] came into play. It gave me the clue I needed.

Back in Global.asax.cs (or wherever you performed the steps for #2 above), add the following&#8221;

```
    SqlProviderServices.SqlServerTypesAssemblyName =
    "Microsoft.SqlServer.Types, Version=14.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91";
```

**Note:** Depending on which version of the NuGet package you installed, you need to adjust the Version number from 14.0.0.0 to the correct version, as appropriate. I installed the latest, which at the time is version 14.x, so that's what I put in.

#### ??? The SqlServerTypesAssemblyName property doesn't exist! ???

In my case, I ran into another small hurdle. When I tried to set the `SqlServerTypesAssemblyName` property, it didn't exist!

Upon further inspection, I discovered that I only had Entity Framework version 6.1.**** installed. I updated to 6.1.**3**, and the property lit up. I set it appropriately, redeployed the app, and it magically worked.

Here's hoping that this helps bring together several pieces of information to get you going with using SQL Server Geospatial data types with Entity Framework!

 [1]: http://stackoverflow.com/questions/13174197/microsoft-sqlserver-types-version-10-or-higher-could-not-be-found-on-azure
 [2]: http://stackoverflow.com/a/40166192/3198996
 [3]: https://www.andrewcbancroft.com/wp-content/uploads/2017/03/NuGetPM_MSSqlServerTypes1.png