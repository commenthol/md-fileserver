# mdstart(1) -- Locally view markdown files in a browser

## SYNOPSIS

    mdstart [options] [<file.md>]

## DESCRIPTION

Starts a local server to render "markdown" files within your browser:

* Runs on `localhost:4000`
* Supports [Markdown Syntax][]  
  with [GFM][].
* Markdown rendering based on [markdown-it][].   
  Enabled Plugins for: Emojis, Task lists, Footnotes, [KaTeX][]
* Includes [markedpp][] as preprocessor.
* Supports syntax highlighting using [highlight.js][]
* For supported markdown syntax see the Cheatsheet.
* Automatic update in browser after saving edited file. (Tested on Linux, MacOS, Windows)

## OPTIONS

* `-h`, `--help`:
  Display this help and exit.

* `--version`:
  Output version information and exit.

* `-p`, `--port` `<number=4000>`:
  Change the default port of the server.
  Default is 4000.

* `-b`, `--browser` `<exe>`:
  Use a different browser executable.

* `-c`, `--confluence` :
  Generate confluence html. Copy and paste the rendered output into a editor
  window at confluence.
  Images need manual upload.

## EXAMPLES

Start the server:

    mdstart

Open a document in the default browser:

    mdstart README.md

Open the configuration page:

    mdstart /config

Open my home directory:

    mdstart /

Open the cheatsheet:

    mdstart /cheatsheet

Start with a different browser on port 2000:

    mdstart -p 2000 -b firefox

## INSTALLATION

    npm i -g md-fileserver

## COPYRIGHT

Copyright (c) 2014- commenthol - MIT License

## REPORTING BUGS

md-fileserver repository <https://github.com/commenthol/md-fileserver/issues>

[KaTeX]: https://katex.org/
[GFM]: https://help.github.com/articles/github-flavored-markdown
[highlight.js]: http://highlightjs.org
[markdown-it]: https://github.com/markdown-it/markdown-it
[markedpp]: https://github.com/commenthol/markedpp
[Markdown Syntax]: http://daringfireball.net/projects/markdown/syntax
