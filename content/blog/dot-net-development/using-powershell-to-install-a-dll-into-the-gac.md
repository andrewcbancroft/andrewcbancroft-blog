---
title: Using PowerShell to Install a DLL into the GAC
author: Andrew
type: blog
date: 2015-12-16T17:45:55+00:00
url: /2015/12/16/using-powershell-to-install-a-dll-into-the-gac/
dsq_thread_id:
  - "4409443667"
categories:
  - .Net Development
tags:
  - GAC
  - PowerShell

---
A couple of ways exist to install a DLL into the Global Assembly Cache (GAC). Using gacutil.exe is one, but this comes as part of a Visual Studio installation, and in a server environment, you may not have the luxury of installing Visual Studio, just to get the utility installed.

An alternative, however, is to use PowerShell to install the DLL into the GAC. The following code snippet should take care of your needs.

```powershell
#Note that you should be running PowerShell as an Administrator
[System.Reflection.Assembly]::Load("System.EnterpriseServices, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a")            
$publish = New-Object System.EnterpriseServices.Internal.Publish            
$publish.GacInstall("C:\Path\To\DLL.dll")

#If installing into the GAC on a server hosting web applications in IIS, you need to restart IIS for the applications to pick up the change.
#Uncomment the next line if necessary...
#iisreset
```