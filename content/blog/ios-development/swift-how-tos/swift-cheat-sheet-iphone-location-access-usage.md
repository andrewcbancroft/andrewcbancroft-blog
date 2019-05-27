---
title: 'Swift Cheat Sheet for iPhone Location Services Access & Usage'
author: Andrew
type: blog
date: 2018-07-17T00:43:03+00:00
url: /2018/07/16/swift-cheat-sheet-iphone-location-access-usage/
categories:
  - Swift
tags:
  - Location Services

---
This is a cheat sheet of the code and workflow for iPhone location access and usage, from requesting permission to using the location of the user's device.


<a name="framework-import" class="jump-target"></a>

# Framework Import

`import CoreLocation`

<a name="location-usage-description" class="jump-target"></a>

# Set Location Usage Description in Info.plist

**This is a required first step**

If you **don't** set this, your app simply won't present the user with the system alert to request access to the location (and, of course, you won't be getting any location data for your app either).

When you request permission to use the device's location, a short message will appear in the default iOS system dialog. You customize this message by adding one of the following keys to your Info.plist file:

  * Privacy – Location Always and When In Use Usage Description
  * Privacy – Location Always Usage Description
  * Privacy – Location When In Use Usage Description

For the **value** of this plist property, type a short string describing what you're using the location for.

<a name="location-manager-delegate" class="jump-target"></a>

# Initialize CLLocationManager and Implement CLLocationManagerDelegate

`CLLocationManager` is the name of the class that gives you a way to request location services permission. It is also responsible for starting the location tracking process.

It needs a corresponding `CLLocationManagerDelegate` to be assigned. The location manager instance you initialize will alert you to location services authorization changes (ie, if the user turns off location services permissions for your app) _through_ the one of the methods that your delegate class implements.

The location manager instance will also send you the user's current location through one of the methods your delegate class implements.

Here is an example of initializing the `CLLocationManager` instance, and setting its delegate.

There's also a `currentLocation` variable that will get continually updated&#8230;

```swift
class NameOfViewController: UIViewController, CLLocationManagerDelegate {
    private let locationManager = CLLocationManager()

    // This will get updated via the location manager delegate's didUpdateLocations method
    var currentLocation: CLLocation? = nil 

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.

        locationManager.delegate = self

        self.startLocationServices() // This function is implemented below...
    }
}
```

Here is an example of how to implement the two `CLLocationManagerDelegate` methods:

```swift
// Monitor location services authorization changes
func locationManager(_ manager: CLLocationManager,
                        didChangeAuthorization status: CLAuthorizationStatus) {
    switch status {
    case .notDetermined: 
        break
    case .authorizedWhenInUse, .authorizedAlways:
        if CLLocationManager.locationServicesEnabled() {
            self.locationManager.startUpdatingLocation()
        }
    case .restricted, .denied: 
        self.alertLocationAccessNeeded()
    }

// Get the device's current location and assign the latest CLLocation value to your tracking variable
func locationManager(_ manager: CLLocationManager,
                        didUpdateLocations locations: [CLLocation]) {
    self.currentLocation = locations.last
    }
}
```

<a name="start-location-services" class="jump-target"></a>

# Start Location Services, Check Location Authorization Status, Request Permission

When you first start location services in your app, you will want to immediately check your app's current authorization status for location services, just in case the user has gone in and disabled location services permission for your app since the last time he/she used it.

If it's the first time the user has launched your app, the `.notDetermined` case will get hit. This is where you request permission for the first time.

If the user grants permission, you can use the `CLLocationManager` instance that your class is using to start updating the user's location.

If, however, the user denies permission, you can alert them to the fact that your app needs access to his/her location for [[insert some good reason here][1]].

Here's a code snippet showing this in action:

```swift
func startLocationServices() {
    locationManager.desiredAccuracy = kCLLocationAccuracyBest
    
    let locationAuthorizationStatus = CLLocationManager.authorizationStatus()
    
    switch locationAuthorizationStatus {
    case .notDetermined: 
        self.locationManager.requestWhenInUseAuthorization() // This is where you request permission to use location services
    case .authorizedWhenInUse, .authorizedAlways:
        if CLLocationManager.locationServicesEnabled() {
            self.locationManager.startUpdatingLocation()
        }
    case .restricted, .denied: 
        self.alertLocationAccessNeeded()
    }
}
```

**Note**: You can test for the `.notDetermined` case by deleting the app on the device, if it's already been installed or run on a device from the debugger.

<a name="alert-location-access-needed" class="jump-target"></a>

# Alert Location Services Access Needed

If location services access has been denied or restricted, you can alert the user and direct them to the Settings app to make the appropriate permissions adjustment:

```swift
func alertLocationAccessNeeded() {
    let settingsAppURL = URL(string: UIApplicationOpenSettingsURLString)!
    
    let alert = UIAlertController(
        title: "Need Location Access",
        message: "Location access is required for including the location of the hazard.",
        preferredStyle: UIAlertControllerStyle.alert
    )
    
    alert.addAction(UIAlertAction(title: "Cancel", style: .default, handler: nil))
    alert.addAction(UIAlertAction(title: "Allow Location Access",
                                    style: .cancel,
                                    handler: { (alert) -> Void in
                                    UIApplication.shared.open(settingsAppURL,
                                                                options: [:],
                                                                completionHandler: nil)
    }))
    
    present(alert, animated: true, completion: nil)
}
```

**Note**: You can test for this case (`.restricted` and `.denied`) by going to the Settings app and turning off location services access for your app, if it's been previously granted.

<a name="share" class="jump-target"></a>

 [1]: #location-usage-description