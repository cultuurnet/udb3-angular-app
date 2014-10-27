# README #

### What is this repository for? ###

This is the UDB3 web app that.

### How do I get set up? ###

For local development you'll need node and npm. A great tool to manage your node versions is https://github.com/creationix/nvm

Yeoman and generator-angular were used to scaffold the project. You can use the same generator to add additional code snippets.
Install using: ```npm install -g yo bower grunt-cli generator-angular```.

Copy the ```config.json.dist``` file to ```config.json``` and ```config_dev.json```. Change config settings according to the environment.

For building and serving the project you can use the commands included with the [angular generator](https://github.com/yeoman/generator-angular).

[Configure the server for HTML5 url rewrites](https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode).
You can find all the app routes in ```app/app.js```.