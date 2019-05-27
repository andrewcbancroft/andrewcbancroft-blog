---
title: FIX – Query in Parse Cloud Code Returns Unauthorized Error
author: Andrew
type: blog
date: 2016-04-06T04:27:49+00:00
url: /2016/04/05/fix-query-in-parse-cloud-code-returns-unauthorized-error/
dsq_thread_id:
  - "4723786776"
categories:
  - iOS / Mac
tags:
  - Parse Migration
  - Swift

---
The Parse migration process has begun – I've got a couple of small apps that used this backend as a service because the backend was simple and Parse was free.

The migration has gone fairly smooth so far, but I hit a wall and have been struggling to figure out the solution for about 3 hours. 3 hours too many, haha!


<a name="problem-overview" class="jump-target"></a>

# Problem Overview

Any time I did a query in my Parse Cloud Code, the query would fail. Every time I'd make a request to my Cloud Code function, I'd get "500 Internal Server Error&#8221; as my response.

I finally wised up and adjusted my query so that I could see the specific "internal server error&#8221; that was occurring:

<pre class="lang:js mark:8 decode:true " title="Parse Query" >var query = new Parse.Query("NameOfParseClassImFetching");

query.find({
    success: function(results){
        // Do things with the results
    },
    error: function(error) {
        response.error(error);
    }
});
```

When the details came back as to what was failing, the JSON object in the response looked like this:

<pre class="lang:js decode:true " >{
  "code": 141,
  "error": {
    "message": "unauthorized"
  }
}
```

I got to searching and found an [issue on GitHub][1] that pointed me in the right direction, but to spare you reading through the entire thread, here's the gist:

<a name="solution" class="jump-target"></a>

# Solution

I happened to be using a version of the Parse Server Example that was missing a critical line of configuration in index.js. When you configure your Parse Server by calling `new ParseServer`, you need to make sure that there's a `serverURL` property that's set to the URL of your Parse Server's API endpoint.

My config didn't have this, but the moment I added it, my Cloud Code queries worked perfectly as they did before. Here's a look at my final index.js file with the relevant line highlighted:

<pre class="lang:js mark:18 decode:true " title="index.js" >// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverurl: 'http://url-to-your-parse-api-endpoint/parse'
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

var port = process.env.PORT || 1337;
app.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});
```

I hope this little breadcrumb finds its way to someone before _they_ spend 3 hours on a silly configuration issue.

<a name="share" class="jump-target"></a>

 [1]: https://github.com/ParsePlatform/parse-server/issues/356