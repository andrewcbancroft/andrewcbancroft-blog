---
title: 'Swift Cheat Sheet for iPhone Camera Access & Usage'
author: Andrew
type: blog
date: 2018-02-24T12:23:02+00:00
aliases:
  - /2018/02/24/swift-cheat-sheet-for-iphone-camera-access-usage/
dsq_thread_id:
  - "6501934219"
categories:
  - Swift
tags:
  - Camera
  - Swift
  - UIImagePickerController
  - UIImagePickerControllerDelegate

---
This is a cheat sheet of the code and workflow for iPhone camera access and usage, from requesting permission to using the photo taken with a user's device.

<a name="framework-import" class="jump-target"></a>

# Framework Import

`import AVFoundation`

<a name="camera-usage-description" class="jump-target"></a>

# Set Camera Usage Description in Info.plist

When you request permission to use the device's camera, a short message will appear in the default iOS system dialog. You customize this message by adding the `Privacy - Camera Usage Description` key to your Info.plist file.

For the **value** of this plist property, type a short string describing what you're using the camera for.

If you **don't** set this, your app will crash when you request access to the camera.

<a name="check-authorization-status" class="jump-target"></a>

# Check and Respond to Camera Authorization Status

```swift
let cameraAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: .video)

switch cameraAuthorizationStatus {
case .notDetermined: requestCameraPermission()
case .authorized: presentCamera()
case .restricted, .denied: alertCameraAccessNeeded()
}
```

<a name="request-permission" class="jump-target"></a>

# Request Camera Permission

If the user has never responded to a request to access his/her camera, you need to prompt with the iOS system alert to request permission:

```swift
func requestCameraPermission() {
    AVCaptureDevice.requestAccess(for: .video, completionHandler: {accessGranted in
        guard accessGranted == true else { return }
        self.presentCamera()
    })
}
```

**Note**: You can test for this case by deleting the app on the device, if it's already been installed or run on a device from the debugger.

<a name="present-camera" class="jump-target"></a>

# Present Camera

```swift
func presentCamera() {
    let photoPicker = UIImagePickerController()
    photoPicker.sourceType = .camera
    photoPicker.delegate = self as? UIImagePickerControllerDelegate & UINavigationControllerDelegate
    
    self.present(photoPicker, animated: true, completion: nil)
}
```

<a name="alert-camera-access-needed" class="jump-target"></a>

# Alert Camera Access Needed

If camera access has been denied or restricted, you can alert the user and direct them to the Settings app to make the appropriate permissions adjustment:

```swift
func alertCameraAccessNeeded() {
    let settingsAppURL = URL(string: UIApplicationOpenSettingsURLString)!
    
    let alert = UIAlertController(
        title: "Need Camera Access",
        message: "Camera access is required to make full use of this app.",
        preferredStyle: UIAlertControllerStyle.alert
    )

    alert.addAction(UIAlertAction(title: "Cancel", style: .default, handler: nil))
    alert.addAction(UIAlertAction(title: "Allow Camera", style: .cancel, handler: { (alert) -&gt; Void in
        UIApplication.shared.open(settingsAppURL, options: [:], completionHandler: nil)
    }))

    present(alert, animated: true, completion: nil)
}
```

**Note**: You can test for this case by going to the Settings app and turning off camera access for your app, if it's been previously granted.

<a name="use-captured-image" class="jump-target"></a>

# Use the Captured Image

To use the image that the camera captured, you need to set up your view controller to adhere to and implement couple of delegate protocols:

<pre class="lang:default decode:true " title="Adhere to delegate protocols" >class NameOfViewController: UIViewController, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
// ...
}
```

<a name="delegate" class="jump-target"></a>

## UIImagePickerControllerDelegate

<pre class="lang:default decode:true " title="UIImagePickerControllerDelegate" >func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
    let photo = info[UIImagePickerControllerOriginalImage] as! UIImage
    // do something with the photo... set to UIImageView, save it, etc.

    dismiss(animated: true, completion: nil)
}
```

<a name="share" class="jump-target"></a>