# 2048ish

[🕹 *play now*](https://vvn.space/2048ish)

This is a game that's like 2048, but not too much.
Built on top of the barebones [Excalibur](https://excaliburjs.com) game engine starter [template](https://github.com/excaliburjs/template-ts-webpack/generate).

## Controls

WASD or arrow keys: move in that direction

smushing together blocks that have the same value will combine them

that's it!

# Development instructions

(these are just from the template)

## Get Started

* Using [Node.js](https://nodejs.org/en/) 14 (LTS) and [npm](https://www.npmjs.com/)
* Run the `npm install` to install dependencies
* Run the `npm start` to run the development server to test out changes
   * [Webpack](https://webpack.js.org/) will build the [Typescript](https://www.typescriptlang.org/) into Javascript
   * [Webpack dev server](https://webpack.js.org/configuration/dev-server/) will host the script in a little server on http://localhost:8080/

## Publishing

* Run `npm run build:dev` to produce Javascript bundles for debugging in the `dist/` folder
* Run `npm run build:prod` to produce Javascript bundles for production (minified) in the `dist/` folder

The `dist/` folder can be deployed to a static web host. We recommend [Netlify](https://netlify.com) or [GitHub Pages](https://pages.github.com/) since they are free to use.
