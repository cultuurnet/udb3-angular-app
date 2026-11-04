// Node port of `angular_config hash -c config.json.dist`: replaces every top-level
// config value with the SHA-256 of its key.
var fs = require('fs');
var crypto = require('crypto');
require('jsonminify');

var source = process.argv[2] || 'config.json.dist';
var config = JSON.parse(JSON.minify(fs.readFileSync(source, 'utf8')));
var hashed = {};

Object.keys(config).forEach(function (key) {
  hashed[key] = crypto.createHash('sha256').update(key).digest('hex');
});

process.stdout.write(JSON.stringify(hashed) + '\n');
