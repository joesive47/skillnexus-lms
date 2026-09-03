'use strict'

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const standalone = path.join(root, '.next', 'standalone')
const sourceStatic = path.join(root, '.next', 'static')
const targetStatic = path.join(standalone, '.next', 'static')

if (!fs.existsSync(path.join(standalone, 'server.js'))) {
  throw new Error('Standalone production build is missing. Run npm run build first.')
}
if (!fs.existsSync(sourceStatic)) throw new Error('Static production assets are missing.')
fs.cpSync(sourceStatic, targetStatic, { recursive: true, force: true })
console.log('Standalone static assets are ready.')
