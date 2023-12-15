#!/usr/bin/env node
const { exec } = require('node:child_process')
const { 
	mkdir, 
	writeFile,
	readFile,
	unlink 
} = require('node:fs/promises')
const { existsSync } = require('node:fs')
const { join } = require('node:path')
const { createInterface } = require('node:readline/promises')
const { performance } = require('node:perf_hooks')

const {
    electronData, 
    buildTemplate, 
    htmlTemplate, 
    vueCoreTemplate, 
    vueRouterTemplate,
    vueApp,
    indexPage
} = require('./data')

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
})

// cmds
const createPkg = 'npm init -y'
const addMainModules = 'npm i -D electron electron-builder --no-package-lock --package-lock-only'
const addSpecialModules = 'npm i vue vue-router --no-package-lock --package-lock-only'
const deletePkgLock = process.platform === 'win32' ? 'del package-lock.json' : 'rm package-lock.json'

// project generator
const createProject = async () => {
    const projectName = await rl.question('project name: ')
    console.info('\x1b[32mcreating project\x1b[0m')

    // master dir
    if (existsSync(`./${projectName}`)) {
        process.chdir(`${projectName}`)
    } else {
        await mkdir(`./${projectName}`)
        process.chdir(`${projectName}`)
    }

    const dirs = [
        `./app`, `./app/styles`, `./app/images`,
        `./app/components`, `./app/pages`, `./icons`,
    ]

    for await (const dir of dirs) { mkdir(dir) }

    // create files
    await writeFile('./app/preload.js', '')
    await writeFile('main.js', electronData)
    await writeFile('electron-builder.yml', buildTemplate(projectName))
    await writeFile('./app/index.html', htmlTemplate)
    await writeFile('./app/renderer.js', vueCoreTemplate)
    await writeFile('./app/app.js', vueApp)
    await writeFile('./app/styles/styles.css', '')
    await writeFile('./app/router.js', vueRouterTemplate)
    await writeFile('./app/pages/Home.js', indexPage)
    
    // comands
    exec(`${createPkg} && ${addMainModules} && ${addSpecialModules} && ${deletePkgLock}`)
    const timeEnd = performance.now()
    
    setTimeout(async () => {
    	const packageJSON = JSON.parse(await readFile('package.json'))
    	packageJSON.scripts.start = 'electron .'
    	packageJSON['license'] = 'MIT'
    	delete packageJSON.scripts.test
    	
    	await writeFile('./package.json', JSON.stringify(packageJSON, null, 2))
    	console.info(`\x1b[36m${projectName}\x1b[0m project succesful`)
    	console.info(`now run cd \x1b[36m${projectName}\x1b[0m`)
    	console.info('for install using npm i or yarn')
    }, timeEnd)
    
    rl.close()
}

// init project
createProject()
