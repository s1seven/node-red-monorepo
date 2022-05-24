# Usage

This is a custom node that wraps the S1Seven [schema tools PDF generator](https://www.npmjs.com/package/@s1seven/schema-tools-generate-pdf/v/0.0.19) in a custom node that can be used in Node-Red. Simply pass in a valid JSON certificate as `msg.payload`. `msg.payload` will be set to a `buffer` when it is output from the custom node. Connect it to a `write file` node to write it to your filesystem.

# Sample flow

<img width="939" alt="Screenshot 2022-05-19 at 16 32 55" src="https://user-images.githubusercontent.com/21305201/169474693-623da5d4-5330-4506-a4f0-840f4ae94658.png">
