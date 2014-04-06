# Maintenance

Express.js middleware for easy switching the app to maintenance mode.

## Description

Deployment of new version of app or patching the database, could cause the need to put application to `maintanance` mode before all operations are completed. Typically, it's just a page with description of what's happening and when service is going to be restore.

## How to works

`maintanace` provides middleware and http-endpoint for putting application to maintenance mode.

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

```
# put app to maintanance
HTTP PUT http://youapp.com/maintenance

# back to norma
HTTP DELETE http://youapp.com/maintenance
```

By default, if application in maintenance mode, it would render `views/maintenance.html` view.

## Usage

Install `maintenance` from npm,

```bash
> npm install maintenance
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



