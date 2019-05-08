## Pup

An example puppeteer project with prescript

<img width="990" alt="simple" src="https://user-images.githubusercontent.com/9087409/54936625-6feb0b00-4f55-11e9-8185-dc707eeab7a3.png">

### Setup
Clone & fulfill cookie configs in `.env` file.
```
cp .env.template .env
```
Install packages.
```
npm ci
```

### Development process
Run `tsc` to automatically compile ts to js when the file is updated.
```
npm run build:watch
```
Open a new terminal tab and run the test file. (e.g. `src/__tests__/google/search/desktop.ts`)
```
npm run dev dist/__tests__/google/search/desktop.js
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
See more how to use [prescript](https://prescript.netlify.com) and enjoy : )

### Use querySelector to debug
```
document.querySelector("")
```

### Use xPath to debug
```
document.evaluate("", document, null, XPathResult.ANY_TYPE, null).iterateNext()
```

### Test Parallelization

Run all test files

```
npm run test:all
```

Run all test files with generating a report

```
npm run test:report
```

### Setup allure on mac osx
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
