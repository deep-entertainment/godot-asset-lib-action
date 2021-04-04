const Command = require('./command')
const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs').promises
const axios = require('axios').default
const handlebars = require('handlebars')

module.exports = class extends Command {
  async do() {
    const templateContent = await fs.readFile(core.getInput('assetTemplate'), {
      encoding: 'utf-8',
    })
    const baseUrl = core.getInput('baseUrl')
    const assetId = core.getInput('assetId')

    console.log('Compiling asset edit template for request')
    const template = handlebars.compile(templateContent)
    const assetEdit = JSON.parse(template(github.context.payload))
    assetEdit.token = this._token
    console.log(`Sending request: ${JSON.stringify(assetEdit)}`)
    const res = await axios.post(`${baseUrl}/asset/${assetId}`, assetEdit)
    console.log(`Request returned id ${res.data.id}`)
    core.setOutput('id', res.data.id)
  }
}
