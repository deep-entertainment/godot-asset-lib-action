# Godot asset lib action

This github action manages assets in the 
[Godot asset library](https://godotengine.org/asset-library/asset).

## Inputs

### `action`

**Required** The action to carry out. Currently, these actions
are provided:

* addEdit: Add an asset edit. Requires the assetId input. Expects that you 
  have created the asset previously with all the basic information.

*Default*: addEdit

### `username`

**Required** The username for the asset library

### `password`

**Required** The password for the asset library. It's recommeded
to use a secret.

### `assetId`

**Required** The id of the asset in the asset store

### `assetTemplate`

**Required** A [handlebars](https://handlebarsjs.com/) template
file that will provided with the webhook context of the
action. See the [webhook](https://octokit.github.io/webhooks/index.json)
reference file for details.

The resulting file should fit the Asset model. See
[the asset library rest api documentation](https://github.com/godotengine/godot-asset-library/blob/master/API.md)
for details.

The token will be injected by the action.

*Default*: .asset-template.json.hb

### `baseUrl`

**Required** Base URL for the godot asset lib.

*Default*: https://godotengine.org/asset-library/api

### `approveDirectly`

If your Godot asset library user has moderation features, you can directly approve the changes.

*Default*: false

## Outputs

### `id`

ID of the asset in the asset store.

## Example usage

```yaml
name: "Push to asset lib"
on: 
  release:
    types:
      - published

jobs:
  publish:
    runs-on: ubuntu-latest
    name: Publish new version to asset lib
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Godot Asset Lib
        uses: deep-entertainment/godot-asset-lib-action@v0.4.0
        with:
          username: example
          password: ${{ secrets.ASSET_STORE_PASSWORD }}
          assetId: 12345
```

## Example template

```handlebars
{
  "title": "Snake",
  "description": "Lorem ipsum…",
  "category_id": "1",
  "godot_version": "2.1",
  "version_string": "{{ context.release.tag_name }}",
  "cost": "GPLv3",
  "download_provider": "GitHub",
  "download_commit": "{{ env.GITHUB_SHA }}",
  "browse_url": "{{ context.repository.html_url }}",
  "issues_url": "{{ context.repository.html_url }}/issues",
  "icon_url": "https://raw.githubusercontent.com/..."
}
```
