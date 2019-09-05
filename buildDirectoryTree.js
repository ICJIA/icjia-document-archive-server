const dirTree = require('./lib/directoryTreeFork')

'use strict';

const jsonfile = require('jsonfile')
const apiDir = './root/files'
const fileName = 'directoryTree.json'

const tree = dirTree('root')

jsonfile.writeFile(`${apiDir}/${fileName}`, tree, function (err) {
    if (err) console.error(err)
    console.log(`Created: ${apiDir}/${fileName}`)
  })