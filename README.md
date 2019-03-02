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

### setup allure on mac osx
```
brew install allure
```

### Generating report
```
allure serve allure-results
```
