var appConfig = require('application-config')('screencaptain')
var fs = require('fs')
var path = require('path')

var APP_NAME = 'Screen Captain'
var APP_TEAM = 'Dave Blakey'
var APP_VERSION = require('../package.json').version

module.exports = {
    APP_NAME: APP_NAME,
    APP_TEAM: APP_TEAM,
    APP_VERSION: APP_VERSION,
    APP_WINDOW_TITLE: APP_NAME + ' (BETA)',
    CONFIG_PATH: path.dirname(appConfig.filePath),
}
