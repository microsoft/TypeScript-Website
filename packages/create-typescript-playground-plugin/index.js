#!/usr/bin/env node
// @ts-check

// A fork of https://github.com/c8r/initit/blob/master/index.js
// which is MIT licensed

// Changes:
//  - Less dependencies
//  - Ability for me to define the branch and the depth to extract from a zip
//  - yarn not npm

const path = require('path')
const os = require('os')
const fs = require('fs')
const exec = require('child_process').execSync
const spawn = require('cross-spawn')

const install = () => {
  return new Promise((resolve, reject) => {
    const child = spawn('yarn', ['install'], {
      stdio: 'inherit',
    })
    child.on('close', code => {
      if (code !== 0) {
        reject()
        return
      }
      resolve()
    })
  })
}

const gitInit = () => {
  exec('git --version', { stdio: 'inherit' })
  exec('git init', { stdio: 'inherit' })
  exec('git add .', { stdio: 'inherit' })
  exec('git commit -am "Init"', { stdio: 'inherit' })
  return true
}

const branch = 'v2'

const getTar = ({ user, repo, path = '', name }) => {
  const url = `https://codeload.github.com/${user}/${repo}/tar.gz/${branch}`
  const cmd = `curl ${url} | tar -xz -C ${name} --strip=4 ${repo}-${branch}/${path}`
  exec(cmd, { stdio: 'inherit' })
}

const create = async (opts = {}) => {
  if (!opts.name) {
    throw new Error('name argument required')
    return
  }

  if (!opts.template) {
    throw new Error('template argument required')
    return
  }

  const dirname = path.resolve(opts.name)
  const name = path.basename(dirname)
  const [user, repo, ...paths] = opts.template.split('/')

  if (!fs.existsSync(name)) {
    fs.mkdirSync(name)
  }

  getTar(
    Object.assign({}, opts, {
      name,
      user,
      repo,
      path: paths.join('/'),
    })
  )

  const templatePkg = require(path.join(dirname, 'package.json'))

  const pkg = Object.assign({}, templatePkg, {
    name,
    version: '0.0.1',
  })

  fs.writeFileSync(path.join(dirname, 'package.json'), JSON.stringify(pkg, null, 2) + os.EOL)

  process.chdir(dirname)

  await install()
  gitInit()

  console.log("\nAlright, you're good to go!")

  return { name, dirname }
}

const [name] = process.argv.slice(2)
const template = 'microsoft/TypeScript-Website/packages/create-typescript-playground-plugin/template/'

create({ name, template })
