const electronData = `// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const { join } = require('node:path')

app.disableHardwareAcceleration()

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, './app/preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
`

const htmlTemplate = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
    <link href="./styles.css" rel="stylesheet">
    <script src="./renderer.js" defer></script>
  </head>
  
  <body></body>
</html>`

const vueApp = `const { defineComponent } = require('vue')

module.exports = defineComponent({
	template: '<router-view></router-view>'
})
`

const indexPage = `const { defineComponent } = require('vue')

module.exports = defineComponent({
	template: '<main><h1>Hello world</h1></main>'
})
`

const vueRouterTemplate = `const { createRouter, createWebHashHistory } = require('vue-router')

const routes = [
	{
		path: '/',
		component: require('./pages/Home'),
		name: 'home Page'
	}
]

const router = createRouter({
  history: createWebHashHistory(), 
  routes
})

module.exports = router
`

const vueCoreTemplate = `const { createApp } = require('vue')
const App = require('./app')
const router = require('./router')

const app = createApp(App)

app.use(router)

router.isReady()
  .then(() => {
    app.mount('body')
  })
`

const buildTemplate = (dir) => `appId: com.${dir}
productName: ${dir}
asar: false
files:
  - 'app/**/*'
  - 'icons'
  - 'package.json'
copyright: ${dir}
`

module.exports = {
  electronData,
  htmlTemplate,
  buildTemplate,
  vueCoreTemplate,
  vueRouterTemplate,
  vueApp,
  indexPage 
}
