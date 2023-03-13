# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.2.0](https://github.com/s1seven/node-red-monorepo/compare/@s1seven/node-red-s1seven-api@1.1.0...@s1seven/node-red-s1seven-api@1.2.0) (2023-03-13)

### Bug Fixes

- add script tags to load constants in html files ([59b441d](https://github.com/s1seven/node-red-monorepo/commit/59b441d0bff890a72d0d74b120d1d444a1fec476))
- update path to identity error messages ([22a92ca](https://github.com/s1seven/node-red-monorepo/commit/22a92ca4ef6f42f740d81db9df226d14feaec6c5))

### Features

- update auth flow, add tokens node ([2abb7a8](https://github.com/s1seven/node-red-monorepo/commit/2abb7a8c530ab3d0c5c570e15fd12948ea1aad0e))

# 1.1.0 (2022-11-21)

### Bug Fixes

- add dotenv as a dependency as it wasn't getting installed ([f50bf89](https://github.com/s1seven/node-red-monorepo/commit/f50bf89b83d6ffca500fa070f6e11a4b672664f2))
- add globalContext to identities node ([2e302d1](https://github.com/s1seven/node-red-monorepo/commit/2e302d1ef3951fb86221e09a2e34da82f41add7e))
- fix 404 on notarize request ([24fbc3d](https://github.com/s1seven/node-red-monorepo/commit/24fbc3d6a2ccb00fb91724ac5435d3e6b3b22607))
- fix bug where constants wasn't being served in node-red ([137aa97](https://github.com/s1seven/node-red-monorepo/commit/137aa9738a6629195c928eef20aea4cab1186f99))
- fix bug where labels weren't shown in company and identities ui ([00e3432](https://github.com/s1seven/node-red-monorepo/commit/00e343245a18a458f53f6e29ecf503a24eda3622))

### Features

- add config node and notarize endpoint ([70a6fd2](https://github.com/s1seven/node-red-monorepo/commit/70a6fd2c6075c5bce13f6bfb919aaaab6066c266))
- add endpoint to get identites ([7a7c3f9](https://github.com/s1seven/node-red-monorepo/commit/7a7c3f9da47a5aacdb513ee46e42a2b58926ce42))
- add first draft of API hashing node ([c08e84a](https://github.com/s1seven/node-red-monorepo/commit/c08e84a69aa591cad7cc604942c9a4c5bc4741ce))
- add get company node ([5db161d](https://github.com/s1seven/node-red-monorepo/commit/5db161d586d1a3a88808a44fe152c3c72b720acd))
- add internationalisation support for the hashing node ([7c3a17f](https://github.com/s1seven/node-red-monorepo/commit/7c3a17f783cfabf30a4989e4c6381868c02d2bb7))
- add internationalisation support to the config node ([54d131a](https://github.com/s1seven/node-red-monorepo/commit/54d131a753631f69b2a775967a287835213a7c88))
- add internationalisation support to the notarization node ([2727596](https://github.com/s1seven/node-red-monorepo/commit/2727596535b75f245dbde22caa7f4dcc2e3808f5))
- add internationalisation support to the verify node ([0fd01e6](https://github.com/s1seven/node-red-monorepo/commit/0fd01e6e41aa0e99da8bf57ab40770161fed4c7e))
- add notarize endpoint node ([8cfa8c6](https://github.com/s1seven/node-red-monorepo/commit/8cfa8c650fb98d77ce2c4c05138c0e8b553bb6f4))
- add S1Seven label to custom nodes ([da03096](https://github.com/s1seven/node-red-monorepo/commit/da03096d495dc8687bcb59be37ec09725eef345b))
- add verify certificate node ([fa2f5e1](https://github.com/s1seven/node-red-monorepo/commit/fa2f5e1ece7d03a78ad984e17b777e691cc810df))
- allow .dev or .ovh to be chosen via admin ui ([70ba355](https://github.com/s1seven/node-red-monorepo/commit/70ba35572c1f7a96d98593ca76fdc256136d49ae))
- allow access token and company id to be retrieved from global variables ([68a97f8](https://github.com/s1seven/node-red-monorepo/commit/68a97f8240a69a7f299df6633174ca50e652c978))
- allow algorithm and encoding to be chosen when working with the hashing node ([8dc244d](https://github.com/s1seven/node-red-monorepo/commit/8dc244d286c60774b00ee56f8b551e6b07b1ce27))
- allow algorithm and encoding to be selected from dropdown menu in hashing node ([aac188b](https://github.com/s1seven/node-red-monorepo/commit/aac188b63e7ddd443ae43f88b75373998a545088))
- allow each configuration to have its own name ([640b928](https://github.com/s1seven/node-red-monorepo/commit/640b92827abcd23271d671077e1158623906e316))
- allow identities to be filtered by coinType and/or status ([d2c72cc](https://github.com/s1seven/node-red-monorepo/commit/d2c72cc927226ca7359740f1111ff60c4064edaf))
- allow identity to be added via the ui of the notarize node ([917cf76](https://github.com/s1seven/node-red-monorepo/commit/917cf76728c2a7b08b62f306a8925f22fe9ee9c7))
- allow the url to be overridden for local testing, update docs ([f23f452](https://github.com/s1seven/node-red-monorepo/commit/f23f4529750d67a9fa48deaa3167f9504f7ff942))
- allow user to input BIP44 account/index ([59759a7](https://github.com/s1seven/node-red-monorepo/commit/59759a7a565b472a341f38a6b090b7abefc3f3d7))
