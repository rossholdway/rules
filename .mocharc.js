var path = require('path');

module.exports = {
    "spec": ["test/**/*.test.ts"],
    "require": ["ts-node/register", path.resolve(__dirname) + "/test/hooks.ts"],
    "trace-warnings": true,
    "extension": ['ts']
}
