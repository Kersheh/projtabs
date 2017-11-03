'use strict'

const exec = require('child_process').exec
const path = require('path')
const Promise = require('bluebird');
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

function launchTabs(dirs) {
  const ttab = path.join(__dirname, '../node_modules/ttab/bin/ttab')

  dirs.forEach((dir) => {
    const dirPath = path.join(CWD, dir)
    const cmd = `${ttab} cd ${dirPath}`
    console.log(cmd)

    fs.readdirAsync(dirPath)
      .then(() => exec(cmd))
      .catch(() => console.log('\x1b[31m', `"dirs" path to ${dir} is invalid`))
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
