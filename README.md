# md-fileserver

> Locally view markdown files in a browser.

![NPM version](https://badge.fury.io/js/md-fileserver.png)

Starts a local server to render "markdown" files within your browser:

* Runs on `localhost:4000`
* Supports [Markdown Syntax][] with [GFM][].
* Based on [marked][].
* Includes [markedpp][] as preprocessor.
* Supports syntax highlighting using [highlight.js][]
* For supported markdown Syntax see [Cheatsheet][].

## Installation

```bash
npm install -g md-fileserver
```

## Start the Local Server

In your terminal type:

```
mdstart
```

## Open a markdown file

```
mdopen <file>
``` 

<a name="cheatsheet">

## Cheatsheet

```
mdopen test/cheatsheet.md
```

[Cheatsheet][]

## LICENSE

Software is released under [MIT License][].



[Cheatsheet]: test/cheatsheet.md
[GFM]: https://help.github.com/articles/github-flavored-markdown
[highlight.js]: http://highlightjs.org
[marked]: https://github.com/chjj/marked
[markedpp]: https://github.com/commenthol/markedpp
[Markdown Syntax]: http://daringfireball.net/projects/markdown/syntax
[MIT License]: ./LICENSE
