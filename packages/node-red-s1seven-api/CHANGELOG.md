# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.3.0](https://github.com/s1seven/node-red-monorepo/compare/@s1seven/node-red-s1seven-api@1.2.0...@s1seven/node-red-s1seven-api@1.3.0) (2023-03-23)

### Bug Fixes

- **node-red-s1seven-api:** add validators when initializing async local store ([67df69f](https://github.com/s1seven/node-red-monorepo/commit/67df69f800d22b195971215811beca8b0ac0e7ce))
- **node-red-s1seven-api:** allow space in config node name ([94c110a](https://github.com/s1seven/node-red-monorepo/commit/94c110a73c7ac30a5c4f8e8cf6f98990d9ad300a))
- **node-red-s1seven-api:** disable mqtt connect node and only provide reusable subflow ([b9f0239](https://github.com/s1seven/node-red-monorepo/commit/b9f0239077ae3465565c256ce28edfe408c2570c))
- **node-red-s1seven-api:** increase node configs type safety ([a4431d1](https://github.com/s1seven/node-red-monorepo/commit/a4431d10a5c3b5af6d6acb2a981cb7cca9574d08))
- **node-red-s1seven-api:** make storage keys dynamic ([79f8902](https://github.com/s1seven/node-red-monorepo/commit/79f89028bb14894ea4d3b161a3d74a7453d25a37))
- **node-red-s1seven-api:** refine axios instance creation ([aec1f90](https://github.com/s1seven/node-red-monorepo/commit/aec1f90dc88bc69f3d4479afd403e7360df1500c))
- **node-red-s1seven-api:** rename hash node type ([4a45d80](https://github.com/s1seven/node-red-monorepo/commit/4a45d80832d3598197e5550c36e3353b1958bdd2))
- **node-red-s1seven-api:** replace undefined globalContext ([c08a243](https://github.com/s1seven/node-red-monorepo/commit/c08a2436439ae54db47860994d93fe8e57519be9))
- **node-red-s1seven-api:** solve translations path ([f05d716](https://github.com/s1seven/node-red-monorepo/commit/f05d716ac59cf18eef430339ea09a998591fa25f))
- **node-red-s1seven-api:** try improving subflow loading ([1c83467](https://github.com/s1seven/node-red-monorepo/commit/1c83467724d27f0a4dd30f18338702dbc7695c74))

### Features

- add has-changed event to get-token node ([c94d92f](https://github.com/s1seven/node-red-monorepo/commit/c94d92f88d0274d7746f72763c072bf62fb02ac8))
- add validate endpoint node ([96a3d86](https://github.com/s1seven/node-red-monorepo/commit/96a3d86b381096f7adce793b49495cea21c50783))
- **node-red-s1seven-api:** add response headers in `requestHandler` and improve doc ([7e3ad3d](https://github.com/s1seven/node-red-monorepo/commit/7e3ad3dd44792862ce9f89f1e6c4e9f371a13b70))
- **node-red-s1seven-api:** add type definitions ([324f23f](https://github.com/s1seven/node-red-monorepo/commit/324f23fd3dcf7c6fbf9fbfa12ca32190a5b4360d))
- **node-red-s1seven-api:** check mqtt connection status ([2d1ed00](https://github.com/s1seven/node-red-monorepo/commit/2d1ed002fb405f90efa642d5dceabe7df8f261b2))
- **node-red-s1seven-api:** create axios instance creation helper ([d96fb19](https://github.com/s1seven/node-red-monorepo/commit/d96fb193af40a9703143b386c6d25c10e444091f))
- **node-red-s1seven-api:** create functions to get/set values in async local storage ([963ccdf](https://github.com/s1seven/node-red-monorepo/commit/963ccdfe4a40dafe9fb26ecb4e3958008ca6f0a8))
- **node-red-s1seven-api:** create shared container ([4cd48be](https://github.com/s1seven/node-red-monorepo/commit/4cd48be64104951772f2496c57a3b7ae3abc74cd))
- **node-red-s1seven-api:** create subflow module to connect to MQTT ([4340c1f](https://github.com/s1seven/node-red-monorepo/commit/4340c1fa7509ad6339116d8b66e8a15e32c77eb7))
- **node-red-s1seven-api:** store base URL in global context ([de7f909](https://github.com/s1seven/node-red-monorepo/commit/de7f9090d7102256163e8bd367571cdcf6b53e08))

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
