'use strict'

const exec = require('child_process').exec
const path = require('path')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const CWD = process.cwd()
const PROPERTIES = {
  'dirs': launchTabs
}

function logErr(msg) {
  console.log('\x1b[31m', msg)
}

function parseJSON(file) {
  try {
    return JSON.parse(file)
  } catch(err) {
    throw 'Config ./projrc is invalid format.'
  }
}

function launchTabs(dirs) {
  const ttab = path.join(__dirname, '../node_modules/ttab/bin/ttab')

  dirs.forEach((dir) => {
    const dirPath = dir.constructor.name === 'String' ? dir : dir['path']

    if(typeof dirPath !== 'undefined') {
      const cmd = `${ttab} cd ${dirPath}`

      fs.readdirAsync(dirPath)
        .then(() => exec(cmd))
        .catch(() => logErr(`"dirs" path to "${dirPath}" is invalid`))
    } else {
      logErr('Config ./projrc "dirs" missing "path" property')
    }
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
