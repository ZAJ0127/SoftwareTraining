# Code Dojo

A phone-friendly practice app for learning C++ through short themed lessons and daily challenges. It runs as a static site on GitHub Pages and can be added to the home screen.

## What's in it

- **Lessons** follow the chapter order of [LearnCpp.com](https://www.learncpp.com/). The text and examples are original, and each lesson links to the matching LearnCpp page for the full treatment.
- **Challenges** come in three kinds: write code, bug hunt, and read the code.
- **Running code** sends your C++ to a public online compiler (Compiler Explorer, with Wandbox as a fallback), so it needs an internet connection.
- **Progress** is stored on the device. Use Progress → Export backup to move it elsewhere.

## Files

| Path | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The app |
| `runner.js` | Talks to the online compilers |
| `content/index.js` | Chapter list |
| `content/chNN.js` | Lessons and challenges for one chapter |
| `sw.js`, `manifest.webmanifest`, `icon-*.png` | Install and offline support |
| `tools/verify-content.mjs` | Compiles every example and solution to check the content |

## Adding a chapter

1. Copy `content/ch01.js` to `content/chNN.js` and write the lessons and challenges.
2. Add `load: () => import('./chNN.js')` to that chapter in `content/index.js`.
3. Add the new file to `CORE` in `sw.js`.
4. Run `node tools/verify-content.mjs` (needs `g++`).
