# Node-Red Monorepo

This is a monorepo to contain all our node red projects. It contains `node-red-chartjs`, `node-red-contrib-generate-pdf-s1seven`, and `node-red-s1seven-api`.

## Starting out

To get started, run:

```sh
npm install
npm run bootstrap
```

## Updating packages

`node-red-contrib-generate-pdf-s1seven` needs to be kept up to date, when `@s1seven/schema-tools-generate-pdf` is updated, this package should be updated.

`node-red-chartjs` should not be updated to keep compatability with older charts.

`node-red-s1seven-api` only needs to be updated if the implementation of one of the endpoints changes.

## More details

For more information on each project, see the README.md file in each package.
