# Markdown with GFM - Cheatsheet

This cheatsheet uses markdown based on:

* [Markdown Specification][Markdown Spec]
* [Github Flavored Markdown][Github Flavored Markdown]

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
* [Preprocessor](#preprocessor)
  * [Include other files](#include-other-files)

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
```

A paragraph is a paragraph is a paragraph is a paragraph is a paragraph. Is a paragraph is a paragraph is a paragraph is a paragraph is a paragraph. Is a paragraph is a paragraph is a paragraph.
This is a not a new line.
This as not as well..

This is a new paragraph.

Forcing a new line with `<br>` <br> causes a new line.

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


1. Cyan
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
3. Blue <span style="color: #f55;">**Note:** Counting continues with just a single line-break</span>

2. Black
3. Grey
1. White


1. Cyan <span style="color: #f55;">**Note:** Counting is restarted with two line-breaks</span>
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

[Referenced Link]: http://example.com
```

http://example.com

<http://example.com>

[Linktext](http://example.com)

[Reference][Referencelink]

[Referencelink]: http://example.com

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

```
![Alt Text](path_to/img.png)
![Alt Text](path_to/img.png "Optional Title")
![Alt Text](http://placekitten.com/100)
<img src="path_to/img.png" title="Optional Title" alt="Alt Text" style="width: 50px;">
```

![Alt Text](path_to/img.png)
![Alt Text](path_to/img.png "Optional Title")
![Alt Text](http://placekitten.com/100)
<img src="path_to/img.png" title="Optional Title" alt="Alt Text" style="width: 50px;">


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


# Preprocessor

## Include other files

__Syntax:__

\!INCLUDE (path_to/include.md)

!INCLUDE (path_to/include.md)


[Markdown Spec]: http://daringfireball.net/projects/markdown/syntax
[Github Flavored Markdown]: https://help.github.com/articles/github-flavored-markdown
