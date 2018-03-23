# ChannelSelector

[![npm](https://img.shields.io/npm/v/channel-selector.svg)](https://www.npmjs.com/package/channel-selector) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

> Network TEN Channel Selector

## Installation

```bash
npm install --save channel-selector
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import ChannelSelector from 'channel-selector'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'channel-selector/dist/channel-selector.css'

Vue.use(ChannelSelector)
```

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="channel-selector/dist/channel-selector.css"></link>
<script src="channel-selector/dist/channel-selector.js"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/channel-selector/dist/channel-selector.css"></link>
<script src="https://unpkg.com/channel-selector"></script>
```

## Development

### Launch visual tests

```bash
npm run dev
```

### Launch Karma with coverage

```bash
npm run dev:coverage
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```


## Publishing

The `prepublish` hook will ensure dist files are created before publishing. This
way you don't need to commit them in your repository.

```bash
# Bump the version first
# It'll also commit it and create a tag
npm version
# Push the bumped package and tags
git push --follow-tags
# Ship it 🚀
npm publish
```

## License

[MIT](http://opensource.org/licenses/MIT)
