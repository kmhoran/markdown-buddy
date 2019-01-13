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

Create a GitHub personal and set it as environment variable `GH_TOKEN`.

    npx electron-builder -p onTagOrDraft
