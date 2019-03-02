## Pup

### Installation
```
npm ci
```

### Development process
Run `tsc` to automatically compile ts to js when the file is updated.
```
npm run build:watch
```
Open a new terminal tab and run the test file. (e.g. `src/__tests__/example/index.ts`)
```
npm run dev dist/__tests__/example/index.js
```
an example source code:
```ts
app
  .init()
  .goto('https://www.google.com')
  .search('input[name=q]', 'google')
```
after run the command above..
```
## Loading test and generating test plan...
Step 1. Init
Step 1.1. Create page
Deferred Step 1.2. Close browser
Step 2. Goto https://www.google.com
Step 3. Search input[name=q] google
Step 3.1. Type input[name=q] google
Step 3.2. Enter
* Test plan generated successfully!
```

### Debugging dom on chrome
```
document.querySelector('«query»')
```

### setup allure on mac osx
```
brew install allure
```

### Generating report
```
allure serve allure-results
```

### References
- [puppeteer](https://pptr.dev)
- [prescript](https://prescript.netlify.com)
