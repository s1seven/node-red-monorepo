# Node-Red Monorepo

This is a monorepo to contain all our node red projects. It contains `node-red-chartjs`, `node-red-generate-pdf`, and `node-red-s1seven-api`.

## Starting out

To get started, run:

```sh
npm install
npm run bootstrap
```

## Updating packages

`node-red-generate-pdf` needs to be kept up to date, when `@s1seven/schema-tools-generate-pdf` is updated, this package should be updated.

`node-red-chartjs` - When this package is updated, if we want to keep the charts rendering correctly, the user should pin the correct version of @s1seven/node-red-chartjs in their package.json.

`node-red-s1seven-api` only needs to be updated if the implementation of one of the endpoints changes, or if a dependency has a security vunerability.

### Releasing the new packages

Once a release has been made on Github and the node has been updated on npm, the Node Red Flow Library needs to be informed of the update. To do so, go to https://flows.nodered.org/add/node and use the form `3 Add your node to the Flow Library`. Submit the package name, e.g. `@s1seven/node-red<package-name>`, and click `add node`. The update should be detected, and should then be made available for use. Please note that it can take up to 30 minutes for the update to be made available under the `Install` tab in the `Palette`.

## More details

For more information on each project, see the README.md file in each package.

## Example authentication flows

Access tokens now expire after 24 hours and need to be regenerated, you can find an example of how to automate the access token regeneration [here](https://github.com/s1seven/node-red-monorepo/blob/main/packages/node-red-s1seven-api/README.md#authentication)
