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
    const context = {
      context: github.context.payload,
      env: process.env,
    }
    console.log(`Providing context: ${JSON.stringify(context)}`)
    const assetEdit = JSON.parse(template(context))
    console.log(
      `Sending request: ${JSON.stringify(
        assetEdit
      )} (token redacted) to url ${baseUrl}/asset/${assetId}`
    )
    assetEdit.token = this._token
    const res = await axios.post(`${baseUrl}/asset/${assetId}`, assetEdit)
    const assetEditId = res.data.id
    console.log(`Request returned edit id ${assetEditId}`)
    core.setOutput('id', assetEditId)

    if (core.getInput('approveDirectly') === 'true') {
      console.log('Putting the edit in review')
      const resReview = await axios.post(
        `${baseUrl}/asset/edit/${assetEditId}/review`,
        {
          token: this._token
        }
      )
      const assetReviewId = resReview.data.id
      console.log(`Request returned review id ${assetReviewId}`)

      console.log('Accepting the edit')
      const resAccept = await axios.post(
        `${baseUrl}/asset/edit/${assetReviewId}/accept`,
        {
          token: this._token
        }
      )
    }
  }
}
