/* eslint-disable no-console */

import fs from 'fs'
import path from 'path'
import favicons from 'favicons'
import Promise from 'bluebird'

const run = !module.parent

function saveIcons(directory, images) {
  const savedFiles = []
  for (const img of images) {
    const absFilename = path.join(directory, img.name)
    savedFiles.push(fs.writeFile(absFilename, img.contents, 'binary'))
  }
  Promise.all(savedFiles).then(()=> {
    console.info('images saved')
  })
}

function saveFiles(directory, files) {
  const savedFiles = []
  for (const file of files) {
    const absFilename = path.join(directory, file.name)
    savedFiles.push(fs.writeFile(absFilename, file.contents, 'utf-8'))
  }
  Promise.all(savedFiles).then(()=> {
    console.info('files saved')
  })
}

function saveHtml(directory, html) {
  const absFilename = path.join(directory, 'icons-metadata.html')
  fs.writeFileSync(absFilename, '        ' + html.join('\n        '), 'utf-8')
  console.info('html metadata saved')
}

if (run) {
  const publicDir = path.join(__dirname, '..', 'public')
  const assetsDir = path.join(publicDir, 'assets')
  const sourceImage = path.join(assetsDir, 'learners-guild-icon.png')
  const config = {
    appName: 'idm',                             // Your application's name. `string`
    appDescription: 'Identity Management',      // Your application's description. `string`
    developerName: 'Learners Guild',            // Your (or your developer's) name. `string`
    developerURL: 'https://learnersguild.org',  // Your (or your developer's) URL. `string`
    background: '#fff',             // Background colour for flattened icons. `string`
    path: '/assets/',               // Path for overriding default icons path. `string`
    url: '/assets/',                // Absolute URL for OpenGraph image. `string`
    display: 'standalone',          // Android display: 'browser' or 'standalone'. `string`
    orientation: 'portrait',        // Android orientation: "portrait" or "landscape". `string`
    version: null,                  // Your application's version number. `number`
    logging: false,                 // Print logs to console? `boolean`
    online: false,                  // Use RealFaviconGenerator to create favicons? `boolean`
    icons: {
      android: true,                // Create Android homescreen icon. `boolean`
      appleIcon: true,              // Create Apple touch icons. `boolean`
      appleStartup: true,           // Create Apple startup images. `boolean`
      coast: true,                  // Create Opera Coast icon. `boolean`
      favicons: true,               // Create regular favicons. `boolean`
      firefox: true,                // Create Firefox OS icons. `boolean`
      opengraph: true,              // Create Facebook OpenGraph image. `boolean`
      twitter: true,                // Create Twitter Summary Card image. `boolean`
      windows: true,                // Create Windows 8 tile icons. `boolean`
      yandex: true                  // Create Yandex browser icon. `boolean`
    }
  }

  favicons(sourceImage, config, (error, response)=> {
    if (error) {
      console.error(error.status)    // HTTP error code (e.g. `200`) or `null`
      console.error(error.name)      // Error name e.g. "API Error"
      console.error(error.message)   // Error description e.g. "An unknown error has occurred"
    } else {
      // console.log(response.images)   // Array of { name: string, contents: <buffer> }
      // console.log(response.files)    // Array of { name: string, contents: <string> }
      // console.log(response.html)     // Array of strings (html elements)
      saveIcons(assetsDir, response.images)
      saveFiles(assetsDir, response.files)
      saveHtml(assetsDir, response.html)
    }
  })
}
