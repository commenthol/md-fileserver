# markdown-fileserver

Locally view your markdown files in a browser.

Starts a local server to render "markdown" files within your browser:

* Runs on `localhost:4000`
* Supports [markdown](http://daringfireball.net/projects/markdown/syntax) with [Github Flavoured Markdown](https://help.github.com/articles/github-flavored-markdown).
* Supports syntax highlighting using [highlight.js](http://highlightjs.org)
* For supported Markdown see [Cheatsheet](#cheatsheet)

## Installation

```bash
git clone ...
cd markdown-fileserver
npm install -g
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

[Cheatsheet](test/cheatsheet.md)

## LICENSE

Software is released under [MIT](./LICENSE).
