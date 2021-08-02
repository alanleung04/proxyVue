const rollup = require('rollup');
const path = require('path');
const json = require('@rollup/plugin-json');
const nodeResolve = require('@rollup/plugin-node-resolve').nodeResolve;
const common = require('@rollup/plugin-commonjs/dist/index');
const babel = require('@rollup/plugin-babel').babel;
const uglify = require('rollup-plugin-uglify').uglify;

/**
 * 目前是打包了umd版本的，html可以直接使用，非module
 * 计划会加入esm标准es6版本，npm install后可直接引入
 */
const buildConfig = [
  {
    input: path.resolve('src/index.js'),
    plugins: [json(),nodeResolve(), common(), babel()],
    dest: path.resolve('dist/moon-charts.js'),
    name: 'MoonCharts',
    format: 'umd',
  },
  {
    input: path.resolve('src/index.js'),
    plugins: [json(),nodeResolve(), common(), babel(), uglify()],
    dest: path.resolve('dist/moon-charts.min.js'),
    name: 'MoonCharts',
    format: 'umd',
  },
  {
    input: path.resolve('src/index.js'),
    plugins: [json(), common(), babel()],
    dest: path.resolve('dist/moon-charts.esm.js'),
    name: 'MoonCharts',
    format: 'es',
  },
];


async function runBuild() {
  for (let i = 0; i < buildConfig.length; i++) {
    const config = buildConfig[i];
    const inputOptions = {
      input: config.input,
      plugins: config.plugins,
    };
    const outputOptions = {
      file: config.dest,
      name: config.name,
      format: config.format,
    };
    await build(inputOptions,outputOptions);
  }
}

async function build(inputOptions, outputOptions) {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}

runBuild();
