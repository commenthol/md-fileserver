# md-fileserver

> Locally view markdown files in a browser.

[![NPM version](https://badge.fury.io/js/md-fileserver.svg)](https://www.npmjs.com/package/md-fileserver)

Starts a local server to render "markdown" files within your browser:

* Runs on `localhost:4000`
* Supports [Markdown Syntax][] with [GFM][].
* Markdown rendering based on [markdown-it][].   
  Enabled Plugins for:
  * Emojis
  * Task lists
  * Footnotes
  * [KaTeX][]
* Includes [markedpp][] as preprocessor.
* Supports syntax highlighting using [highlight.js][]
* For supported markdown syntax see [Cheatsheet][].
* Automatic update in browser after saving edited file. (Tested on Linux, MacOS, Windows)

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Installation](#installation)
* [Usage](#usage)
  * [Start the Local Server](#start-the-local-server)
  * [Open a markdown file](#open-a-markdown-file)
* [Configuration](#configuration)
* [Cheatsheet](#cheatsheet)
* [Personalisation](#personalisation)
* [Contribution](#contribution)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Installation

```bash
npm install -g md-fileserver
```

## Usage

### Start the Local Server

In your terminal type:

```
mdstart
```

Open the given link <http://localhost:4000/?session=...> in your browser and
navigate to the markdown file.

__Note__: The local server can only be reached from your local computer on port 4000.
Any remote access from other computers to your files is denied.
An internal session is used, so you'll need to either start with a file or use the provided
link with the session parameter.

### Open a markdown file

Type in your terminal:

```
mdstart <file.md>
```

This will open the default browser with the processed markdown file.

## Configuration

```
mdstart /config
```

## Cheatsheet

```
mdstart /cheatsheet
```

[Cheatsheet][]

## Personalisation

In `config.js` you can change several settings to fit your needs. These include:

* **Browser**: Default browser of MacOS, Linux or Windows is used.
* **Markdown** options: Change the options how [markdown-it][] processes your markdown files.
* **Markdown PP** options: Change the options how [markedpp][] pre-processes your markdown files.

Install personalized version:

1.  Clone this repo
    ````
    git clone --depth 2 https://github.com/commenthol/md-fileserver.git
    cd md-fileserver
    ````
2.  Make your changes in `./config.js`
3.  Install with `npm i -g` from same folder.  
    If there are issues with installing you'll need to uninstall first with `npm un -g`

## Contribution

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work.

## License

Copyright (c) 2014-present commenthol   
Software is released under [MIT License][].

Bundled fonts from [KaTeX][] by Khan Academy - https://github.com/Khan/KaTeX -
[License](https://github.com/KaTeX/KaTeX/blob/master/LICENSE) (Fonts: SIL OFL 1.1, Code: MIT License)

## References

<!-- !ref -->

* [Cheatsheet][Cheatsheet]
* [GFM][GFM]
* [highlight.js][highlight.js]
* [KaTeX][]
* [Markdown Syntax][Markdown Syntax]
* [markedpp][markedpp]
* [MIT License][MIT License]

<!-- ref! -->

[KaTeX]: https://katex.org/
[Cheatsheet]: test/cheatsheet.md
[GFM]: https://help.github.com/articles/github-flavored-markdown
[highlight.js]: http://highlightjs.org
[markdown-it]: https://github.com/markdown-it/markdown-it
[markedpp]: https://github.com/commenthol/markedpp
[Markdown Syntax]: http://daringfireball.net/projects/markdown/syntax
[MIT License]: ./LICENSE
