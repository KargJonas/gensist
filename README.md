## WARNING - DO NOT USE THIS PACKAGE. IT IS UNDER CONSTRUCTION.

# A simple static site generator.

## How it works
Gensist grabs a folder of markdown files and/or more folders and generates a website from it. The folder structure and filenames are preserved.

You can build any folder that contains a `content/` folder with markdown files. For example:
```
.
└── content
    ├── home.md
    ├── index.md
    └── info.md
```
You can of course configure it to be any folder you want.

## Commands
| Command              | Info                    |
| -------------------- | ----------------------- |
| `gensist new <name>` | Create a new project    |
| `gensist`            | Build current folder    |
| `gensist init`       | Generate missing files. |
| `gensist -v`         | Display gensist version |

## Getting started:
Just install gensist with `npm i -g gensist`, generate a new project with `npm new my-website` and build it by running `gensist` or `gensist build` inside the project and it should generate a `build/` folder with all of the HTML and CSS nicely compressed inside your project.

## Config
You can configure gensist by placing a `gensist.json` file in the root your project.
If there is no `gensist.json`, gensist will fall back on this config:
```json
{
  "title": "Test Site",
  "optimize": true,
  "input": "content",
  "output": "build",
  "template": "template.html",
  "assets": "assets",
  "style": [
    "theme.css"
  ]
}
```