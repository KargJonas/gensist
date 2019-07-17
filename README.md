## WARNING - DO NOT USE THIS PACKAGE. IT IS UNDER CONSTRUCTION.

# A simple static site generator.

## How it works
Gensist grabs a folder of markdown files and generates a website from it. The folder structure and filenames are preserved.
```
.                           .
└── content                 └── build
    ├── home.md      >>>        ├── home.html
    ├── index.md                ├── index.html
    └── info.md                 └── info.html
```

## Commands

| Command              | Info                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------- |
| `gensist new <name>` | Create a new project                                                                         |
| `gensist`            | Build current folder                                                                         |
| `gensist build`      | Build current folder                                                                         |
| `gensist watch`      | Automatically rebuilds your<br>website and reloads the browser<br>tab when files are changed |
| `gensist init`       | Generate missing files.                                                                      |
| `gensist -v`         | Display gensist version                                                                      |

## Getting started:
Install gensist with `"npm i -g gensist"`, generate a new project with `"npm new my-website"` and start it by running `"gensist watch"`. Your browser should open a new tab and when you now make changes to your files the browser should automatically update the page as soon as you save them.

## Config
You can configure gensist by placing a `gensist.json` file in the root your project (all paths are relative to the `gensist.json` file).

| Property   | Default value   | Type       | Description                                                                 |
| ---------- | --------------- | ---------- | --------------------------------------------------------------------------- |
| `title`    | `"Gensist"`     | `string`   | Title of your website - you can <br>customize it further in `template.html` |
| `input`    | `content`       | `string`   | Input folder                                                                |
| `output`   | `build`         | `string`   | Output folder                                                               |
| `template` | `template.html` | `string`   | The HTML template used to <br>construct each page of your site              |
| `optimize` | `true`          | `boolean`  | Tells gensist to compress the HTML/CSS                                      |
| `style`    | _Not set_       | `string[]` | List of stylesheets to apply to the page                                    |
| `assets`   | _Not set_       | `string`   | Asset folder for images, fonts, etc.                                        |

If there is no `gensist.json`, gensist will fall back on this config (all properties are optional):
```json
{
  "title": "Gensist",
  "input": "content",
  "output": "build",
  "template": "template.html",
  "optimize": true
}
```