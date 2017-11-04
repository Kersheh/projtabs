'use strict'

const exec = require('child_process').exec
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
    throw 'Config ./projrc is invalid format.'
  }
}

function buildNewTerminalCmd(dir) {
  const ttab = path.join(__dirname, '../node_modules/ttab/bin/ttab')

  if(dir.constructor.name === 'String') {
    return `${ttab} cd ${dir}`
  } else {
    let cmd = `${ttab} `
    let opts = []

    opts.push(dir['path'] ? `-d ${dir['path']} ` : '')
    opts.push(dir['name'] ? `-t '${dir['name']}' ` : '')
    opts.push(dir['window'] ? '-w ' : '')

    opts.push(dir['cmd'] ? `'${dir['cmd']}'` : '')

    opts.forEach((opt) => {
      cmd += opt
    });

    return cmd
  }
}

function launchTabs(dirs) {
  const ttab = path.join(__dirname, '../node_modules/ttab/bin/ttab')

  dirs.forEach((dir) => {
    exec(buildNewTerminalCmd(dir))
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
      console.error(err)
      process.exit(1)
    })
}

readConf()
