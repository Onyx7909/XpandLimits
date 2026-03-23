# X-pand Limits revamped

Cleaned project package.

What was removed:
- `app/` expo-router ghost tree
- `components/` ghost screens and duplicate state files
- `assets/` nested duplicate project files, except the actual lightning image
- `.expo/`
- `node_modules/`
- duplicate readmes and helper scan scripts

This version uses the active `App.js` entry point.

## Run

```bash
npm install
npx expo start -c
```
