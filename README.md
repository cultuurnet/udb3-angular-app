# README #

### What is this repository for? ###

This is the UDB3 web app that.

### How do I get set up? ###

For local development you'll need node and npm. A great tool to manage your node versions is https://github.com/creationix/nvm

Yeoman and generator-angular were used to scaffold the project. You can use the same generator to add additional code snippets.
Install using: ```npm install -g yo bower grunt-cli generator-angular```. You do not need to scaffold the project again!

Copy the ```config.json.dist``` file to ```config.json``` and ```config_dev.json```. Change config settings according to the environment.

To get up and running check out the project and run the following commands:
```
npm install
bower install
grunt

//Serve unminified locally for development
grunt serve

//Or create a dist folder and serve the minified version
grunt build
grunt serve:dist
```

For more info on building and serving the project you can check out the [angular generator](https://github.com/yeoman/generator-angular) page on Github.

[Configure the server for HTML5 url rewrites](https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode).
You can find all the app routes in ```app/app.js```.
