const core = require('@actions/core')
const github = require('@actions/github')
const axios = require('axios').default
const path = require('path')

;(async () => {
  try {
    const action = core.getInput('action')
    let commandClass
    switch (action) {
      case 'addEdit':
        commandClass = require('./commands/addEdit')
        break
      default:
        throw new Error(`Unknown action ${action}`)
    }
    const baseUrl = core.getInput('baseUrl')
    const username = core.getInput('username')
    const password = core.getInput('password')
    const directory = core.getInput('directory')
    const assetTemplatePath = path.resolve(process.cwd(), core.getInput('assetTemplate'))
    console.log(`Logging in ${username}`)

    const res = await axios.post(`${baseUrl}/login`, {
      username: username,
      password: password,
    })

    const token = res.data.token

    console.log(`Starting command for action ${action} in directory ${directory}`)
    const command = new commandClass(token, assetTemplatePath)
    await command.do()

    console.log('Logging out of asset lib')
    await axios.post(`${baseUrl}/logout`, {
      token: token,
    })
  } catch (error) {
    if (error.isAxiosError) {
      core.setFailed(`${error.message}: ${error.response.data.error}`)
    } else {
      core.setFailed(error.message)
    }
  }
})()
