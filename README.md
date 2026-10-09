# Code Dojo

A phone-friendly practice app for learning C++ through short themed lessons and daily challenges. It runs as a static site on GitHub Pages and can be added to the home screen.

## What's in it

- **Lessons** follow the chapter order of [LearnCpp.com](https://www.learncpp.com/). The text and examples are original, and each lesson links to the matching LearnCpp page for the full treatment.
- **Challenges** come in four kinds: write code, bug hunt, read the code, and mini projects. Later ones start from a blank file with a planning step, and anything you needed help with comes back as a rewrite from scratch.
- **Pattern drills** are tiny programs written from an empty file, repeated on a spaced schedule until they are automatic.
- **Running code** sends your C++ to a public online compiler (Compiler Explorer, with Wandbox as a fallback), so it needs an internet connection.
- **Progress** is stored on the device. Use Progress → Export backup to move it elsewhere.

## Files

| Path | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The app |
| `runner.js` | Talks to the online compilers |
| `content/index.js` | Tracks and their chapter lists |
| `content/chNN.js`, `content/eN.js`, `content/mN.js` | Lessons and challenges for one C++ chapter, engineering unit or embedded unit |
| `sw.js`, `manifest.webmanifest`, `icon-*.png` | Install and offline support |
| `tools/verify-content.mjs` | Compiles every example and solution to check the content |

## Adding a chapter

1. Copy `content/ch01.js` to `content/chNN.js` and write the lessons and challenges.
2. Add `load: () => import('./chNN.js')` to that chapter in `content/index.js`.
3. Add the new file to `CORE` in `sw.js`.
4. Run `node tools/verify-content.mjs` (needs `g++`).

## Content fields worth knowing

- `plan`: the steps of a working plan for a write-code challenge or project. Shown after solving.
- `scaffold: 'blank'`: the challenge starts from an empty file with a planning step. Leave `starter` empty.
- `drills`: short pattern programs written from an empty file and repeated on a spaced schedule. A drill unlocks when its `lesson` is finished. `mustMatch` adds source checks, such as requiring a function with a given name.
