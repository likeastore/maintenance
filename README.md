# Maintenance
[![Build Status](https://api.travis-ci.org/likeastore/maintenance.png)](https://travis-ci.org/likeastore/maintenance)

Express.js middleware for easy switching the app to maintenance mode.

## Description

Deployment of new version of app or patching the database, could cause the need to put application to `maintenance` mode before all operations are completed. Typically, it's just a page with description of what's happening and when service is going to be restore.

For REST API's, it's required to send a meaningful HTTP code and description.

`maintenance` provides middleware and http-endpoint for putting application to maintenance mode.

It supports 2 modes of work:

* configuration-based (require redeployment of app)
* hot-switch mode (put to maintenance without redeployment)

In configuration-based mode, you should provide the `flag` signaling the application on maintenance mode and restart the application:

```js
var config = {
	maintenance: true
};

maintenance(app, config.maintenance);
```

Hot-switch is could more convenient since doesn't require re-start. And could be controlled by HTTP:

```bash
# put app to maintanance
HTTP POST http://youapp.com/maintenance?access_key=[SHARED_SECRET_KEY]

# back to normal
HTTP DELETE http://youapp.com/maintenance?access_key=[SHARED_SECRET_KEY]
```

By default, if application in maintenance mode, it would render `views/maintenance.html` view.

## Usage

Install `maintenance` from npm,

```bash
$ npm install maintenance
```

Update your application,

```js
var maintenance = require('maintenance');
var app = express();

app.get('/', function (req, res) {
	console.log(req.url);
	res.send(200);
});

maintenance(app);
```

Specifying the initial mode,

```js
// starts the app in maintenance mode
maintenance(app, true);
```

or take from config,

```js
// starts the app in maintenance mode
maintenance(app, config.maintenence.current);
```

or use options,

```js
maintenance(app, {httpEndpoint: true, api: '/api'});
```

## Options

Instead of initial you can customize `maintenance` with options object,

```js
var options = {
	current: true,						// current state, default **false**
	httpEndpoint: true,					// expose http endpoint for hot-switch, default **false**,
	url: '/app/mt',						// if `httpEndpoint` is on, customize endpoint url, default **'/maintenance'**
	accessKey: 'xx4zUU8Cyy7',			// token that client send to authorize, if not defined `access_key` is not used
	view: 'myview.html',				// view to render on maintenance, default **'maintenance.html'**
	api: '/api',						// for rest API, species root URL to apply, default **undefined**
	status: 503,						// status code for response, default **503**
	message: 'will be back'				// response message, default **'sorry, we are on maintenance'**
};

maintenance(app, options);
```

## Licence (MIT)

Copyright (c) 2013, Likeastore.com info@likeastore.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
