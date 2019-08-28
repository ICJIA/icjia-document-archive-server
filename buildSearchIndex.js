'use strict'

const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')

const apiDir = './root/files'
const base = './root/files'
const fileName = 'searchIndex.json'
const archiveBase = 'https://archive.icjia.cloud/files'

function getStats (file) {
  const { size, atime, mtime, ctime, birthtime } = fs.statSync(file)
  let obj = {}
  obj.size = size
  obj.atime = atime
  obj.mtime = mtime
  obj.ctime = ctime
  obj.birthtime = birthtime
  return obj
}

function walkDir (dirpath) {
  const result = []
  const files = [dirpath]
  do {
    const filepath = files.pop()
    const stat = fs.lstatSync(filepath)
    if (stat.isDirectory()) {
      fs.readdirSync(filepath).forEach(f => {
        files.push(path.join(filepath, f))
      })
    } else if (stat.isFile()) {
      let obj = {}
      obj.path = '/' + path.relative(dirpath, filepath)
      obj.download = `${archiveBase}${obj.path}`
      obj.name = path.basename(dirpath + '/' + obj.path)
      obj.stats = getStats(dirpath + '/' + obj.path)
      result.push(obj)
    }
  } while (files.length !== 0)

  return result
}

let searchIndex = walkDir(base)

// if (!fs.existsSync(apiDir)) {
//   fs.mkdirSync(apiDir)
//   console.log(`Created: ${apiDir}/`)
// }

jsonfile.writeFile(`${apiDir}/${fileName}`, searchIndex, function (err) {
  if (err) console.error(err)
  console.log(`Created: ${apiDir}/${fileName}`)
})
