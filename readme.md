# `qx.html.Image#setPadding` drops a clipped image's offset

Reproduction for the bug fixed by
[qooxdoo/qooxdoo#10880](https://github.com/qooxdoo/qooxdoo/pull/10880).

## The bug

A clipped image — one the compiler packs into a combined image — is painted as
the whole strip plus a `background-position` that scrolls the wanted glyph into
view. `qx.html.Image#setPadding` writes the padding straight into that same
property:

```js
this.setStyle("backgroundPosition", paddingLeft + "px " + paddingTop + "px");
```

which replaces the offset instead of shifting it. The widget then paints
whichever glyph happens to sit at `[0, 0]` of the combined image.

Padding lands on an image from ordinary appearance data, so this shows up
whenever a theme change, a state change or an explicit `setPadding*()` re-applies
it to an already-rendered icon.

## Running it

Needs the qooxdoo compiler; nothing else, and no other dependencies to install.

```sh
npm install --global @qooxdoo/framework   # if you haven't got qx already
qx compile
qx serve
```

Then open http://localhost:8080/imagepaddingrepro/.

To try it against a fix, add the framework checkout to `compile.json` and
recompile:

```json
"libraries": ["/path/to/your/qooxdoo", "."]
```

## What you should see

Eight glyphs out of one combined image — four squares, four circles, four
colours — magnified 5x, next to a reference showing the glyph that lives at
offset `[0, 0]` of that strip. Everything is a stock framework resource; this
project ships no images of its own.

Press **Add padding (4px)**.

| | |
|---|---|
| **Affected build** | all eight turn into the reference glyph, and the report reads `FAIL - 8 of 8 glyphs lost their offset.` |
| **Fixed build** | the eight glyphs are unchanged apart from shifting 4px right, and the report reads `PASS - all 8 glyphs kept their offset.` |

The report is not judged by eye: for each image it reads
`backgroundPosition` back off the DOM node and compares it with the offset
`qx.util.ResourceManager` holds for that resource, plus the padding. On
qooxdoo 7.9.3 it prints

```
 FAIL checkbox.png                         expected -486px 0px     got 4px 0px
 FAIL checkbox-checked.png                 expected -262px 0px     got 4px 0px
 FAIL checkbox-checked-disabled.png        expected -332px 0px     got 4px 0px
 FAIL checkbox-invalid.png                 expected -346px 0px     got 4px 0px
 FAIL radiobutton.png                      expected -220px 0px     got 4px 0px
 FAIL radiobutton-checked.png              expected -318px 0px     got 4px 0px
 FAIL radiobutton-checked-disabled.png     expected -206px 0px     got 4px 0px
 FAIL radiobutton-invalid.png              expected -276px 0px     got 4px 0px
```

Press **Remove padding** to put them back.

## Where it all is

Everything is in
[`source/class/imagepaddingrepro/Application.js`](source/class/imagepaddingrepro/Application.js);
the rest is an unmodified `qx create` skeleton.

One thing worth noting if you adapt this: the combined image has to be asseted
alongside the individual glyphs. Without
`@asset(qx/decoration/Classic/checkbox-radiobutton-combined.png)` the strip is
missing from the resource manager's registry, the glyphs load individually,
nothing is clipped, and the bug does not appear.
