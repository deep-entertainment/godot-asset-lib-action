import { Command } from './command'

const core = require('@actions/core')
const github = require('@actions/github');
const fs = require('fs').promises
const superagent = require('superagent')


export default class extends Command {
    async do () {
        const templateContent = await fs.readFile(
            core.getInput('assetTemplate'),
            {
                encoding: 'utf-8'
            }
        )
        const baseUrl = core.getInput('baseUrl')
        const assetId = core.getInput('assetId')
        const template = Handlebars.compile(templateContent)
        const assetEdit = JSON.parse(template(github.context.payload))
        assetEdit.token = token
        const res = await superagent(`${baseUrl}/asset/${assetId}`)
        core.setOutput('id', res.id)
    }
}
