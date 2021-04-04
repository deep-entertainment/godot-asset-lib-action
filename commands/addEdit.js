const Command = require("./command")
const core = require("@actions/core")
const github = require("@actions/github")
const fs = require("fs").promises
const axios = require("axios").default

module.exports = class extends Command {
  async do() {
    const templateContent = await fs.readFile(core.getInput("assetTemplate"), {
      encoding: "utf-8",
    })
    const baseUrl = core.getInput("baseUrl")
    const assetId = core.getInput("assetId")
    const template = Handlebars.compile(templateContent)
    const assetEdit = JSON.parse(template(github.context.payload))
    assetEdit.token = token
    const res = await axios.post(`${baseUrl}/asset/${assetId}`, assetEdit)
    core.setOutput("id", res.data.id)
  }
}
