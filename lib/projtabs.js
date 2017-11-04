'use strict'

const execFileSync = require('child_process').execFileSync
const path = require('path')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const CWD = process.cwd()
const PROPERTIES = {
  'dirs': launchTabs
}

function parseJSON(file) {
  try {
    return JSON.parse(file)
  } catch(err) {
    throw 'Config file .projrc is invalid format.'
  }
}

function buildNewTerminalArgs(dir) {
  let args = []
  if(dir.constructor.name === 'String') {
    args.push('-d', dir)
  } else {
    dir['path'] ? args.push('-d', dir['path']) : 0
    dir['name'] ?  args.push('-t', `${dir['name']}`) : 0
    dir['window'] ?  args.push('-w') : 0
    dir['cmd'] ?  args.push(`${dir['cmd']}`) : 0

    return args
  }
}

function launchTabs(dirs) {
  const ttab = path.join(__dirname, '../node_modules/ttab/bin/ttab')

  dirs.forEach((dir) => {
    execFileSync(ttab, buildNewTerminalArgs(dir))
  })
}

function readConf() {
  const confPath = path.join(CWD, '.projrc')

  fs.readFileAsync(confPath, 'utf8')
    .then((file) => {
      const config = parseJSON(file)
      const props = Object.keys(config)

      props.forEach((prop) => {
        const operation = PROPERTIES[prop]
        if(typeof operation !== 'undefined') {
          operation(config[prop])
        }
      })
    }).catch((err) => {
      if(err.code === 'ENOENT') {
        err = 'Config file .projrc was not found.'
      }
      console.error(err)
      process.exit(1)
    })
}

exports.readConf = readConf;
