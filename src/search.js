// Helpful documentation about the mirror structure
// https://wiki.debian.org/DebianRepository/Format
const { readFileSync, unlinkSync } = require('fs')
const { join } = require('path')
const download = require('download')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

const config = require('../config.json')

// Search function for the mirror
module.exports = async (query) => {
  console.log('Downloading package list')
  const packageListUrl = `${config.mirror}dists/${config.version}/main/binary-${config.arch}/Packages.xz`
  await download(packageListUrl, join(config.tempFolder, 'deb-helper'))

  console.log('Extracting package list')
  unlinkSync(join(config.tempFolder, 'deb-helper', 'Packages'))
  await exec('unxz ' + join(config.tempFolder, 'deb-helper', 'Packages.xz'))
  const packageListFile = readFileSync(
    join(config.tempFolder, 'deb-helper', 'Packages')
  ).toString()

  console.log('Parsing package list')
  const packages = packageListFile
    .split('\n\n')
    .map((group) => {
      return group.split('\n').map((e) => e.split(': '))
    })
    .map((e) => {
      let items = {}
      // console.log(e)
      e.forEach((item) => (items[item[0].toLowerCase()] = item[1]))
      return items
    })
    .filter((pkg) => typeof pkg.package != 'undefined')

  console.log('Searching')
  return packages.filter((pkg) => pkg.package.includes(query)
}
