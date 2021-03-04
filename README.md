# load-es

> Load ES Module or TypeScript in node environment

## Installation
```shell
npm install load-es
#or
yarn add load-es 
```

## Usage

```shell
node --require load-es <your file path>
```

example

```shell
node --require load-es main.js
```
main.js
```javascript
import Koa from 'koa';

const app = new Koa();
//...
```

