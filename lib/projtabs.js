'use strict'

const execSync = require('child_process').execSync
const path = require('path')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))

const OPTIONS = {
  exit: false
}

function parseJSON(file) {
  try {
    return JSON.parse(file)
  } catch(err) {
    throw new Error('Config file .projrc is invalid format.')
  }
}

function setOptions(options) {
  if(typeof options.exit !== 'undefined') {
    if(typeof options.exit !== 'boolean') {
      throw new Error(`Invalid option "exit": ${options.exit}`)
    }

    OPTIONS.exit = options.exit
  }
}

function buildNewTerminalArgs(dir) {
  let args = []

  if(dir.constructor.name === 'String') {
    args.push('-d', dir)
  } else {
    dir['path'] ? args.push('-d', dir['path']) : 0
    dir['name'] ?  args.push('-t', `'${dir['name']}'`) : 0
    dir['window'] ?  args.push('-w') : 0
    dir['cmd'] ?  args.push(`"${dir['cmd']}"`) : 0
  }

  return args
}

function launchTerminals(dirs) {
  const ttab = path.join(__dirname, '../node_modules/ttab/bin/ttab')

  dirs.forEach(dir => {
    try {
      execSync(`${ttab} ${buildNewTerminalArgs(dir).join(' ')}`)
    } catch(err) {
      throw new Error('Config file .projrc caused error with ttab.')
    }
  })
}

function readConf() {
  const confPath = path.join(process.cwd(), '.projrc')

  return fs.readFileAsync(confPath, 'utf8')
    .then(file => {
      const config = parseJSON(file)

      if(config.options) {
        setOptions(config.options)
      }

      if(!config.dirs) {
        throw new Error(`Config file .projrc missing required "dirs" property.`)
      }

      launchTerminals(config.dirs)

      return OPTIONS.exit
    })
    .catch(err => {
      if(err.code === 'ENOENT') {
        err = new Error('Config file .projrc was not found.')
      }

      console.log(err.message)
      process.exit(1)
    })
}

exports.readConf = readConf
