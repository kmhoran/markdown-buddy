# Markdown Documentation App

Desktop editor and preview tool for Markdown powered by Electron.js.

## Requirements
---
- Node.js ( 8.12.0+ )
- Yarn

## Develop
---
#### Clone from Github

    git clone https://github.com/kmhoran/markdown-buddy.git markdown-buddy

    cd markdown-buddy

    yarn install

#### Run

To run locally:

    yarn start

#### Build

To create a production-ready build:

    yarn build

#### Publish

Before publishing you need to first [create a GitHub personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) and set it as environment variable `GH_TOKEN`.

As described in [electron-builder's](https://www.electron.build/configuration/publish) documentation, the reccomended Github realease workflow is as follows:

1. Draft a new release. Set the “Tag version” to the value of `version` in the application `package.json`, and prefix it with `v`. “Release title” can be anything you want.
For example, if your application `package.json` version is `1.0`, your draft’s “Tag version” would be `v1.0`.
1. Push some commits. Every CI build will update the artifacts attached to this draft.

1. Once you are done, publish the release by executing the following: (
GitHub will tag the latest commit for you). 

```npx electron-builder -p onTagOrDraft```


    
