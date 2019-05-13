---
title: Fix MAMP, MySQL Workbench “Failed to Connect to MySQL”
author: Andrew
type: blog
date: 2015-01-19T18:40:12+00:00
aliases:
  - /2015/01/19/fix-mamp-mysql-workbench-failed-connect-mysql/
dsq_thread_id:
  - "3435786395"
categories:
  - Software Development
tags:
  - MAMP
  - MySQL
  - MySQL Workbench
  - Wordpress

---
Installing [MAMP][1] was easy. I did, however, spend at least 45 minutes trying to get MySQL Workbench to connect to my local MySQL database server. The solution was simple, but getting there led me around the Internet and back with little help. Hopefully this signpost will help others having connection issues with MySQL Workbench to MAMP MySQL servers as well.

Once MAMP is installed and the MySQL server has started, you'll be taken to a start screen that looks something like this:  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/01/MAMP_StartScreen.png" alt="MAMP Start Screen Port Number" width="601" height="411" class="alignnone size-full wp-image-11187" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/01/MAMP_StartScreen.png 601w, https://www.andrewcbancroft.com/wp-content/uploads/2015/01/MAMP_StartScreen-300x205.png 300w" sizes="(max-width: 601px) 100vw, 601px" />][2]

**The information presented there is misleading.** The start page instructs you to use port 3306. So I did:  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/01/SettingsBasedOnStartScreen.png" alt="Settings based on MAMP Start Screen" width="897" height="515" class="alignnone size-full wp-image-11185" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/01/SettingsBasedOnStartScreen.png 897w, https://www.andrewcbancroft.com/wp-content/uploads/2015/01/SettingsBasedOnStartScreen-300x172.png 300w" sizes="(max-width: 897px) 100vw, 897px" />][3]

When testing the connection, however, I got the dreaded "Failed to Connect to MySQL at localhost&#8221;:  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/01/ErrorOnTestConnection.png" alt="Error on Test Connection" width="412" height="146" class="alignnone size-full wp-image-11184" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/01/ErrorOnTestConnection.png 412w, https://www.andrewcbancroft.com/wp-content/uploads/2015/01/ErrorOnTestConnection-300x106.png 300w" sizes="(max-width: 412px) 100vw, 412px" />][4]

It turns out that MAMP has a preferences panel wherein you can configure the ports for your Apache and MySQL servers. And of course, MySQL was _not_ set to use port 3306, as the start page led me to believe. Rather, it was set to use port 8889:  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/01/MAMP_Preferences_Port.png" alt="MAMP Preferences Port Number" width="529" height="400" class="alignnone size-full wp-image-11186" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/01/MAMP_Preferences_Port.png 529w, https://www.andrewcbancroft.com/wp-content/uploads/2015/01/MAMP_Preferences_Port-300x227.png 300w" sizes="(max-width: 529px) 100vw, 529px" />][5]

Adjusting the settings to use the port listed in the MAMP preferences pane led to a successful connection!  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/01/SettingsBasedOnMAMPPreferences1.png" alt="Settings based on MAMP Preferences" width="897" height="515" class="alignnone size-full wp-image-11198" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/01/SettingsBasedOnMAMPPreferences1.png 897w, https://www.andrewcbancroft.com/wp-content/uploads/2015/01/SettingsBasedOnMAMPPreferences1-300x172.png 300w" sizes="(max-width: 897px) 100vw, 897px" />][6]

Good to go!  
[<img src="http://www.andrewcbancroft.com/wp-content/uploads/2015/01/GoodToGo.png" alt="Good to go!" width="414" height="144" class="alignnone size-full wp-image-11190" srcset="https://www.andrewcbancroft.com/wp-content/uploads/2015/01/GoodToGo.png 414w, https://www.andrewcbancroft.com/wp-content/uploads/2015/01/GoodToGo-300x104.png 300w" sizes="(max-width: 414px) 100vw, 414px" />][7]

 [1]: http://www.mamp.info/
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2015/01/MAMP_StartScreen.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2015/01/SettingsBasedOnStartScreen.png
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2015/01/ErrorOnTestConnection.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2015/01/MAMP_Preferences_Port.png
 [6]: http://www.andrewcbancroft.com/wp-content/uploads/2015/01/SettingsBasedOnMAMPPreferences1.png
 [7]: http://www.andrewcbancroft.com/wp-content/uploads/2015/01/GoodToGo.png