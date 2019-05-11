---
title: Up and Running with Unity IOC Container for ASP.Net MVC
author: Andrew
type: blog
date: 2014-10-27T18:07:21+00:00
aliases:
  - /2014/10/27/up-and-running-with-unity-ioc-container-for-asp-net-mvc/
dsq_thread_id:
  - "3162390625"
categories:
  - .Net Development
  - 'C#'
tags:
  - ASP.Net MVC
  - Dependency Injection
  - Inversion of Control
  - Unity

---
The process for creating an ASP.Net MVC web application that relies on the Unity Inversion of Control (IOC) container has gotten quite a bit more streamlined since I first started working with it.&nbsp; However, since I don’t start brand new software projects often, it’s often the case that it takes me a few minutes to figure out which NuGet package to install to get things up and running.&nbsp; 

The following is a quick-reference for myself, and for anyone else who’s interested in getting up and running quickly with the Unity IOC container for an ASP.Net MVC project.

### Assumptions:

  * Using Visual Studio 2013 
      * Using ASP.Net MVC 5 
          * Have already created a new, fresh solution (File –> New Project, etc)</ul> 
        ### Walkthrough
        
        Begin by right-clicking your solution, and choosing to “Manage NuGet Packages for Solution…”:
        
        [<img title="image" style="border-left-width: 0px; border-right-width: 0px; border-bottom-width: 0px; display: inline; border-top-width: 0px" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image_thumb.png" width="504" height="367" />][1]
        
        Next, choose to search for packages found at nuget.org.&nbsp; In the search bar in the upper right, type in “Unity”, and press enter.&nbsp; Choose to install “Unity bootstrapper for ASP.NET MVC”:
        
        [<img title="SNAGHTMLb1d5c8" style="border-left-width: 0px; border-right-width: 0px; border-bottom-width: 0px; display: inline; border-top-width: 0px" border="0" alt="SNAGHTMLb1d5c8" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/10/SNAGHTMLb1d5c8_thumb.png" width="504" height="325" />][2]
        
        [<img title="image" style="border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px; display: inline" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image_thumb1.png" width="309" height="398" />][3] 
        
        Now that the appropriate NuGet package is installed, you’re set to start using the Unity IOC Container.&nbsp; 
        
        ### Using Unity for Dependency Injection and Management
        
        I’ve contrived an example and tried to show side-by-side views of the bare minimums you need to program in order to start taking advantage of Unity for managing your dependencies.&nbsp;&nbsp; I’m going to show how to inject a concrete implementation of a very simple Interface into the HomeController. The steps go something like this:
        
          1. Create an Interface (in this example, I called it IUnityExample) which specifies that an implementer of this interface must define an itWorksMessage method that returns a string. 
              * Create a new class called UnityExample.&nbsp;&nbsp; Specify that it implements IUnityExample in the class declaration line.&nbsp; Implement the required itWorksMessage method. 
                  * In HomeController.cs, declare a private variable to hold an instance of an IUnityExample. 
                      * In HomeController.cs, declare a new constructor which takes an IUnityExample (to be injected by Unity) and sets the privately declared IUnityExample variable to the instance that’s passed in. 
                          * Utilize the itWorksMessage somehow.&nbsp; In my example, I set the return value to a new dynamic property called ViewBag.Message inside the Index method. 
                              * In UnityConfig.cs, register IUnityExample and UnityExample with the container inside the RegisterTypes method.</ol> 
                            Let’s pause here and show that side-by-side view I referred to a second ago.&nbsp; Perhaps visualizing the files in play will help bring the whole picture into view:
                            
                            [<img title="image" style="border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px; display: inline" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image_thumb5.png" width="720" height="308" />][4]
                            
                            At this point, we’re done with writing C# code, and we’re ready to move into the View layer.&nbsp; This final step will access ViewBag.Message, and display it at the bottom of the page.&nbsp; It’s fairly straight-forward.&nbsp; Inside Views –> Home –> Index.cshtml, simply add a <div> that contains @ViewBag.Message:
                            
                            [<img title="image" style="border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px; display: inline" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image_thumb3.png" width="624" height="217" />][5] 
                            
                            To confirm everything works, run your solution and verify the results!
                            
                            [<img title="image" style="border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px; display: inline" border="0" alt="image" src="http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image_thumb4.png" width="720" height="263" />][6] 
                            
                            ### Summary
                            
                            In this article, you’ve seen how to use NuGet to install the required components to get up and running with the Unity Inversion of Control container.&nbsp; Additionally, you saw a bare-bones example demonstrating the steps required to start using Unity to manage your dependencies with ASP.Net MVC.

 [1]: http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image.png
 [2]: http://www.andrewcbancroft.com/wp-content/uploads/2014/10/SNAGHTMLb1d5c8.png
 [3]: http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image1.png
 [4]: http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image5.png
 [5]: http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image3.png
 [6]: http://www.andrewcbancroft.com/wp-content/uploads/2014/10/image4.png