fx_version 'cerulean'
game 'gta5'
author "DSCO Network"
description "Simple loadscreen with music and video"

files {
    'ui/index.html',
    'ui/main.css',
    'ui/assets/*.js',
    'ui/music/*.mp3',
    'ui/config.js',
}

loadscreen 'ui/index.html'

loadscreen_cursor 'yes'

loadscreen_manual_shutdown "yes"

client_script "client.lua"