---
title: Accessing the Root View Controller at Launch on iOS 13 with SceneDelegate
description: With iOS 13 comes a new SceneDelegate class, which changes how you access your root view controller at app launch. Learn what to do now with this change.
author: Andrew
type: blog
date: 2019-06-07T18:20:41+00:00
tags:
  - Storyboard
  - SceneDelegate
  - Swift
  - UINavigationController
  - iOS 13
showrecent: true
wip: false
toc: true
images:
  - images/social-assets/Twitter Accessing the Root View Controller at Launch on iOS 13 with SceneDelegate.png
  - images/social-assets/Facebook Accessing the Root View Controller at Launch on iOS 13 with SceneDelegate.png
---

A new <a href="https://developer.apple.com/documentation/uikit/uiwindowscenedelegate" rel="nofollow">SceneDelegate</a> was introduced for Storyboard-based apps in iOS 13, and with it came some changes in how you're able to access your app's root view controller at app launch.

## The Old Way
`AppDelegate` Swift file used to be where code landed for accessing your app's `rootViewController`:

{{< highlight swift "hl_lines=3" >}}
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        let rootVC = window?.rootViewController

        return true
    }
{{< /highlight >}}

## What To Do Now
*Now*, you'll be moving that code over to your app's `SceneDelegate` Swift file:

{{< highlight swift "hl_lines=12" >}}
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?


    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        // Use this method to optionally configure and attach the UIWindow `window` to the provided UIWindowScene `scene`.
        // If using a storyboard, the `window` property will automatically be initialized and attached to the scene.
        // This delegate does not imply the connecting scene or session are new (see `application:configurationForConnectingSceneSession` instead).
        guard let _ = (scene as? UIWindowScene) else { return }
        
        let rootVC = self.window?.rootViewController 
    }

    // ... the rest of SceneDelegate
}
{{< /highlight >}}