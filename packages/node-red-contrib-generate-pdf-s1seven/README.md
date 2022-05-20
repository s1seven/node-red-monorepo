# Usage

This is a custom node that wraps the S1Seven [schema tools PDF generator](https://www.npmjs.com/package/@s1seven/schema-tools-generate-pdf/v/0.0.19) in a custom node that can be used in Node-Red. Simply pass in a valid JSON certificate as `msg.payload`. `msg.payload` will be set to a `buffer` when it is output from the custom node. Connect it to a `write file` node to write it to your filesystem.

# Installation

Until this module is published, it needs to be installed locally. Pull the repo, then go to the folder where you wish to use node-red. Run `npm install <path-to-this-repo>` to add it as a dependency. Installing local modules does not appear to install dependencies, so you may have to run `npm install node-red` and `npm install lato-font` for it to work correctly. Once this module is published that should no longer be necessary.

# Sample flow

<img width="939" alt="Screenshot 2022-05-19 at 16 32 55" src="https://user-images.githubusercontent.com/21305201/169474693-623da5d4-5330-4506-a4f0-840f4ae94658.png">
