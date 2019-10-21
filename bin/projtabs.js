#!/usr/bin/env node

const projtabs = require('../lib/projtabs')
projtabs.readConf().then(console.log)
