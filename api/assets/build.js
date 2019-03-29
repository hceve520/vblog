'use strict'

const fs = require('fs-extra')
const globby = require('globby')
const path = require('path')

// STEP 3 将lib copy 到 build 目录
globby([
  'node_modules/babel-polyfill/dist/*',
  'node_modules/react/dist/*',
  'node_modules/react-dom/dist/*',
  'node_modules/react-router/umd/*',
  'node_modules/lodash/*',
  'node_modules/bizcharts/umd/*',
  'node_modules/intl/dist/*',
  'node_modules/antd/dist/*'
]).then((paths2) => {
  fs.mkdirsSync('build/lib/')
  paths2.forEach((item) => {
    const filename = path.basename(item)
    fs.copySync(item, `build/lib/${filename}`)
  })
})

console.log('copy files to build/lib done !')

globby([
  'public/*'
]).then((paths3) => {
  fs.mkdirsSync('build/public/')
  paths3.forEach((item) => {
    const filename = path.basename(item)
    fs.copySync(item, `build/public/${filename}`)
  })
})
console.log('copy public/ files to build done !')

globby([
  'utils/*'
]).then((paths3) => {
  fs.mkdirsSync('build/utils/')
  paths3.forEach((item) => {
    const filename = path.basename(item)
    fs.copySync(item, `build/utils/${filename}`)
  })
})
console.log('copy utils/ files to build done !')

globby([
  'styles/*'
]).then((paths3) => {
  fs.mkdirsSync('build/styles/')
  paths3.forEach((item) => {
    const filename = path.basename(item)
    fs.copySync(item, `build/styles/${filename}`)
  })
})

console.log('copy styles/ files to build done !')
