# Cheatsheet - Markdown Syntax with GFM

This cheatsheet uses markdown syntax based on:

* [Markdown Specification][]
* [Github Flavored Markdown][]

## Table of Contents

* Markdown
  * [Headers](#headers)
  * [Paragraphs and Line Breaks](#paragraphs-and-line-breaks)
  * [Styling Text](#styling-text)
    * [Escaping](#escaping)
  * [Lists](#lists)
    * [Unordered](#unordered)
    * [Ordered, Mixed](#ordered-mixed)
  * [Tables](#tables)
    * [Column Alignment](#column-alignment)
  * [Links](#links)
    * [Link within document](#link-within-document)
  * [Block Quotes](#block-quotes)
  * [Horizontal Ruler](#horizontal-ruler)
  * [Images](#images)
  * [Code](#code)
    * [Indented Block](#indented-block)
    * [Highlighting](#highlighting)
  * [Inline HTML](#inline-html)
  * [Inline Comments](#inline-comments)
* [Extensions](#extensions)
  * [Emoji](#emoji)
  * [Tasklists](#tasklists)
  * [Footnotes](#footnotes)
* [Preprocessor](#preprocessor)
  * [Include other files](#include-other-files)
  * [Table of Contents](#table-of-contents-1)
  * [Reference list](#reference-list)

## Headers

```
# h1

## h2

### h3

#### h4

##### h5

###### h6

h1 Alternate
============

h2 Alternate
------------
```

# h1

## h2

### h3

#### h4

##### h5

###### h6

h1 Alternate
============

h2 Alternate
------------

## Paragraphs and Line Breaks

```
A paragraph is a paragraph is a paragraph is a paragraph is a paragraph. Is a paragraph is a paragraph is a paragraph is a paragraph is a paragraph. Is a paragraph is a paragraph is a paragraph.
This is a not a new line.
This as not as well..

This is a new paragraph.

Forcing a new line with `<br>` <br> causes a new line.

Or ending a line with two spaces  
causes a line break as well
```

A paragraph is a paragraph is a paragraph is a paragraph is a paragraph. Is a paragraph is a paragraph is a paragraph is a paragraph is a paragraph. Is a paragraph is a paragraph is a paragraph.
This is a not a new line.
This as not as well..

This is a new paragraph.

Forcing a new line with `<br>` <br> causes a new line.

Or ending a line with two spaces  
causes a line-break as well

## Styling Text

```
**Bold** Text      === __Bold__ Text
*Emphasised* Text  === _Emphasised_ Text
`monospaced` Text
~~strikethrough~~ Text
Wi*thin*Words   - but not -   Wi_thin_Words
```

**Bold** Text      === __Bold__ Text

*Emphasised* Text  === _Emphasised_ Text

`monospaced` Text

~~strikethrough~~ Text

Wi*thin*Words   - but not -   Wi_thin_Words


### Escaping

```
\\   backslash
\`   backtick
\*   asterisk
\_   underscore
\{\}  curly braces
\[\]  square brackets
\(\)  parentheses
\#   hash mark
\+   plus sign
\-   minus sign (hyphen)
\.   dot
\!   exclamation mark
```

\\   backslash<br>
\`   backtick<br>
\*   asterisk<br>
\_   underscore<br>
\{\}  curly braces<br>
\[\]  square brackets<br>
\(\)  parentheses<br>
\#   hash mark<br>
\+   plus sign<br>
\-   minus sign (hyphen)<br>
\.   dot<br>
\!   exclamation mark


## Lists

### Unordered

```
* Cyan
* Magenta
* Yellow

- Red
- Green
- Blue

+ Black
+ Gray
+ White

* Cyan
  * No Red
  * Green
    * Is a color
      * like the grass
  * Blue
    * Another color
    * like the sky
* Magenta
* Yellow
```

* Cyan
* Magenta
* Yellow

- Red
- Green
- Blue

+ Black
+ Gray
+ White

* Cyan
  * No Red
  * Green
    * Is a color
      * like the grass
  * Blue
    * Another color
    * like the sky
* Magenta
* Yellow

### Ordered, Mixed

```
1. Red
2. Green
3. Blue

2. Black
3. Grey
1. White

<!--- -->

40. Cyan
   1. RGB (0, 255, 255)
   1. A color between green and blue
      * Green
      * Blue
2. Magenta
10. Yellow
```

> <span style="color: #f55;">**Note**: Wrong numbers get corrected into right order!</span>


1. Red
2. Green
3. Blue <span style="color: #f55;">**Note:** Counting continues with line-breaks</span>

2. Black
3. Grey
1. White

<!--- -->

40. Cyan <span style="color: #f55;">**Note:** Counting is restarted with 40 after <!--- --&gt;</span>
   1. RGB (0, 255, 255)
   1. A color between green and blue
      * Green
      * Blue
2. Magenta
10. Yellow


## Tables

```
| Column 1 | Column 2 | Column 3 |
| ---      | ---      | ---      |
| Row 1    | 1        | 2        |
| Row 2    | 3        | 4        |
```

| Column 1 | Column 2 | Column 3 |
| ---      | ---      | ---      |
| Row 1    | 1        | 2        |
| Row 2    | 3        | 4        |


### Column Alignment

```
| Left Aligned | Center Aligned | Right Aligned |
| ---          | :---:          | ---:          |
| Row 1        | 1              | 2             |
| Row 2        | 3              | 4             |
```

| Left Aligned | Center Aligned | Right Aligned |
| ---      | :---:    | ---:     |
| Row 1    | 1        | 2        |
| Row 2    | 3        | 4        |


## Links

```
http://example.com

<http://example.com>

[Linktext](http://example.com)

[Reference][Referenced Link]

[Referenced Link][]

[Referenced Link]: http://example.com
```

http://example.com

<http://example.com>

[Linktext](http://example.com)

[Reference][Referenced Link]

[Referenced Link][]

[Referenced Link]: http://example.com


### Link within document

```
<a name="cross-reference">

[Cross-Reference](#cross-reference)
```

<a name="cross-reference">

[Cross-Reference](#cross-reference)

## Block Quotes

```
> Block Quoted Text
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Or line
> by line

You need "text" to break block quotes

> Or with a
> > nested quote

> line
```

> Block Quoted Text
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

> Or line
> by line

You need "text" to break block quotes

> Or with a
> > nested quote

> line


## Horizontal Ruler

Three or more Hyphens, Asterisks, Underscores

```
---

***
___

```

---

***

___


## Images

<style>
img[alt=img100x] {width: 100px; border: 5px solid red; border-radius: 25%}
</style>

    ![Alt Text](path_to/img.png)
    ![Alt Text](path_to/img.png "Optional Title")
    ![Alt Text](http://placehold.it/150x100)
    ![broken image](http://localhost/my-broken-image)

![Alt Text](path_to/img.png)
![Alt Text](path_to/img.png "Optional Title")
![Alt Text](http://placehold.it/150x100)
![broken image](http://localhost/my-broken-image)

Using plain html can be used to size images:

    <img src="path_to/img.png" title="Optional Title" alt="Alt Text" style="width: 50px;">

<img src="path_to/img.png" title="Optional Title" alt="Alt Text" style="width: 50px;">

Styling images can also be done by hijacking on the `alt` attribute.

    <style>
    img[alt=img100x] {width: 100px; border: 5px solid red; border-radius: 25%}
    </style>
    ![img100x](path_to/img.png)

<style>
img[alt=img100x] {width: 100px; border: 5px solid red; border-radius: 25%}
</style>
![img100x](path_to/img.png)

## Code

    `a line of code`

    ``literal backtick (`)``

`a line of code`

``literal backtick (`)``

### Indented Block

```
    a line of code
    literal backtick (`)
```
outputs:

    a line of code
    literal backtick (`)


### Highlighting

    ```javascript
    (function(){
      "use strict";
      var t = "a string";
      console.log(t);
    }())
    ```
outputs:

```javascript
(function(){
  "use strict";
  var t = "a string";
  console.log(t);
}())
```

## Inline HTML

```
<dl>
  <dt>A Definition List</dt>
  <dd>Mixing Markdown might **not** work *everywhere*. <br>
      Use HTML <em>tags</em> <strong>instead</strong>.</dd>
</dl>
```

<dl>
  <dt>A Definition List</dt>
  <dd>Mixing Markdown might **not** work *everywhere*. <br>
      Use HTML <em>tags</em> <strong>instead</strong>.</dd>
</dl>

## Inline Comments

    <!---
    This is a comment (!NOTE the 3 <!--- dashes)
    -->

<!---
This is a comment (NOTE the 3 <!--- dashes)
-->

# Extensions

## Emoji

See http://www.webpagefx.com/tools/emoji-cheat-sheet/

:smile: `:smile:`  
:blush: `:blush:`  
:sunny: `:sunny:`  
:heavy_multiplication_x: `:heavy_multiplication_x:`  
:heavy_check_mark: `:heavy_check_mark:`  

## Tasklists

```
- [ ] Open
- [x] Done
```

- [ ] Open
- [x] Done

## Footnotes

```
Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.
```

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.

# Preprocessor

Check [markedpp][] for further options.

## Include other files

See <https://github.com/commenthol/markedpp#include>

__Syntax:__

```
!include(path_to/include.md)
```

<!-- include (path_to/include.md) -->

---

This is an included file.

!include (path_to/include.md)

---
<!-- /include -->

<a name="table-of-contents-1">

## Table of Contents

See <https://github.com/commenthol/markedpp#toc> for more options

__Syntax:__

```
!toc

!toc(minlevel=3 maxlevel=4 omit="h3;Unordered")
```

<!-- !toc (minlevel=3 maxlevel=4 omit="h3;Unordered") -->

* [Escaping](#escaping)
* [Ordered, Mixed](#ordered-mixed)
* [Column Alignment](#column-alignment)
* [Link within document](#link-within-document)
* [Indented Block](#indented-block)
* [Highlighting](#highlighting)

<!-- toc! -->

## Reference list

See <https://github.com/commenthol/markedpp#ref>

__Syntax:__

```
!ref
```

<!-- !ref -->

* [Github Flavored Markdown][Github Flavored Markdown]
* [Markdown Specification][Markdown Specification]
* [markedpp][markedpp]
* [Referenced Link][Referenced Link]

<!-- ref! -->

[Markdown Specification]: http://daringfireball.net/projects/markdown/syntax
[Github Flavored Markdown]: https://help.github.com/articles/github-flavored-markdown
[markedpp]: https://github.com/commenthol/markedpp
