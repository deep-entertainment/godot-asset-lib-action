const core = require("@actions/core")
const github = require("@actions/github")
const axios = require("axios").default

;(async () => {
  try {
    const action = core.getInput("action")
    let commandClass
    switch (action) {
      case "addEdit":
        commandClass = require("commands/addEdit")
        break
      default:
        throw new Error(`Unknown action ${action}`)
    }
    const baseUrl = core.getInput("baseUrl")
    const username = core.getInput("username")
    const password = core.getInput("password")
    console.log(`Logging in ${username}`)

    const res = await axios.post(`${baseUrl}/login`, {
      username: username,
      password: password,
    })

    const token = res.data.token
    const command = new commandClass(token)
    await command.do()
    await axis.post(`${baseUrl}/logout`, {
      token: token,
    })
  } catch (error) {
    core.setFailed(error.message)
  }
})()
