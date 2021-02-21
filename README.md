# load-es

> Load ES Module or TypeScript in node environment

## Installation
```shell
npm install load-es
#or
yarn add load-es 
```

## Usage

entry.js file

```javascript
require("load-es")
require("./main.js")
// or  require("./main.ts")
```
main.js
```javascript
import Koa from 'koa';

const app = new Koa();
//...
```

