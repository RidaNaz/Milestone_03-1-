1. npm init
2. tsc --init
3. npm install inquirer
4. npm install --save-dev @types/inquirer
5. npm install uuid
6. npm install --save-dev @types/uuid
7. npm install chalk
8. npm install validator
9. npm i --save-dev @types/validator

# NPM publish

* Add `#!/usr/bin/env node` only in *index.ts*.
* Add `"include": ["src/**/*"]`, below the compiler option in *tsconfig.json*.
* Add `"bin": { "milestone_03-rida_naz": "dist/index.js" }` in *package.json*.
* Add `"build": "tsc"` under `scripts` in *package.json*.
* Update `"main": "dist/index.js",` in *package.json*.
* Run `tsc` & `npm run build`.
* Run `npm publish`.