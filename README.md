npm init
tsc --init
npm install inquirer
npm install --save-dev @types/inquirer
npm install uuid
npm install --save-dev @types/uuid
npm install chalk
npm install validator
npm i --save-dev @types/validator

# NPM publish

* Add `#!/usr/bin/env node` only in *index.ts*.
* Add `"include": ["src/**/*"]`, below the compiler option in *tsconfig.json*.
* Add `"bin": { "milestone_03-rida_naz": "dist/index.js }` in *package.json*.
* Add `"build": "tsc"` under `scripts` in *package.json*.
* Update `"main": "dist/index.js",` in *package.json*.
* Run `tsc` & `npm run build`.
* Run `npm publish`.