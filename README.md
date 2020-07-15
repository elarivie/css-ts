# css-ts
[![Build Status](https://travis-ci.org/elarivie/css-ts.svg?branch=master)](https://travis-ci.org/elarivie/css-ts) [![npm version](https://badge.fury.io/js/css-ts.svg)](http://badge.fury.io/js/css-ts)

**Generates TypeScript files (&#x2A;.ts) from (&#x2A;.css) files.**

For example given the following css,

```css
/* styles.css */

#myId {
  color: green;
}
.myClass {
  color: blue;
}
```

css-ts creates the following styles.css.ts file from the above css:

```ts
/* styles.css.ts */

export const Styles = {
	'myClass': 'myClass',
	'myId': 'myId'
};
export default Styles;
```

So, you can import CSS class names and ids into your TypeScript sources:

```ts
/* app.ts */
import * as styles from './styles.css';
console.log(`<div class="${styles.myClass}"></div>`);
console.log(`<div id="${styles.myId}"></div>`);
```

Doing so allows:
* To make sure that typescript and css are in sync since otherwise compilation errors are going to be generated.
* To know where a given css class name or css id is being use.

## Install instruction

```sh
npm install css-ts
```

## CLI

Use `css-ts --help` for full list of options

# Basic usage

Exec `css-ts <search path> [options]` command.

1. If search path points to a file, the file will be processed
2. If search path points to a folder, files to process will be looked for using glob pattern (see `--pattern`).

For example, if you have .css files under `src` directory, exec the following:

```sh
css-ts src
```

Then, this creates `*.css.ts` files under the directory which contains original .css files.

```text
(your project root)
- src/
    | myStyle.css
    | myStyle.css.ts [created]
```


#### input file name pattern

By default, this tool searches files under `<search directory>` using the pattern `**/*.css`.
If you want to customize glob pattern, you can use `--pattern` option.
Note the quotes around the glob to `--pattern` (they are required, so that your shell does not perform the expansion).

```sh
css-ts . --pattern 'src/**/*.css'
```

#### dry-run
A usefull CLI option is `--dry-run` which allows to validate the results without writing anything to disk.

You may also want to increase verbosity to obtain more detail with `-v` or `--verbose`.  Every `-v` increase the verbosity level by 1.

#### watch
With `-w` or `--watch`, this will watch files and process them when needed.

## ⚖️ License
This software is released under the MIT License, see LICENSE.txt.
