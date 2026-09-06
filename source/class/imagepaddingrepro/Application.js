/* ************************************************************************

   Minimal reproduction for:
     qx.html.Image#setPadding drops a clipped image's background-position
     offset, so the widget paints whichever glyph sits at [0, 0] of the
     combined image.

   Discussed on https://github.com/qooxdoo/qooxdoo/pull/10880

************************************************************************ */

/**
 * Every image below is a stock qooxdoo resource. The framework ships them
 * pre-combined - qx/decoration/Classic/checkbox-radiobutton-combined.meta maps
 * all 36 of them into one strip - so each is a "clipped" resource: the same
 * background-image, told apart only by its background-position. That is the
 * condition the bug needs, and this project adds no image of its own to set it
 * up.
 *
 * The strip itself has to be asseted alongside the glyphs: without it the
 * combined image is missing from qx.util.ResourceManager's registry, the
 * glyphs load individually, and nothing is clipped.
 *
 * @asset(qx/decoration/Classic/form/*)
 * @asset(qx/decoration/Classic/checkbox-radiobutton-combined.png)
 */
qx.Class.define("imagepaddingrepro.Application", {
  extend: qx.application.Standalone,

  statics: {
    /**
     * Eight glyphs from that strip, picked to be obvious at a glance: four
     * squares and four circles, in four different colours.
     */
    SOURCES: [
      "qx/decoration/Classic/form/checkbox.png",
      "qx/decoration/Classic/form/checkbox-checked.png",
      "qx/decoration/Classic/form/checkbox-checked-disabled.png",
      "qx/decoration/Classic/form/checkbox-invalid.png",
      "qx/decoration/Classic/form/radiobutton.png",
      "qx/decoration/Classic/form/radiobutton-checked.png",
      "qx/decoration/Classic/form/radiobutton-checked-disabled.png",
      "qx/decoration/Classic/form/radiobutton-invalid.png"
    ],

    /**
     * The glyph that happens to sit at offset [0, 0] of the strip. With the
     * bug, all eight of the above turn into this one.
     */
    GLYPH_AT_ORIGIN: "qx/decoration/Classic/form/checkbox-checked-pressed.png",

    /** The glyphs are 14x14, which is too small to judge by eye. */
    ZOOM: 5,

    /** Any non-zero padding triggers it; this is just a visible amount. */
    PADDING: 4
  },

  members: {
    __images: null,
    __verdict: null,
    __detail: null,

    main() {
      super.main();

      if (qx.core.Environment.get("qx.debug")) {
        qx.log.appender.Native;
        qx.log.appender.Console;
      }

      this.__images = [];
      this.getRoot().add(this.__buildUi(), { left: 24, top: 20, right: 24 });
      this.__applyPadding(0);
    },

    __buildUi() {
      const box = new qx.ui.container.Composite(new qx.ui.layout.VBox(14));
      box.add(this.__buildIntro());
      box.add(this.__buildGallery());
      box.add(this.__buildControls());
      box.add(this.__buildReport());
      return box;
    },

    __buildIntro() {
      const label = new qx.ui.basic.Label(
        "<b>qx.html.Image#setPadding on a clipped image</b><br>" +
          "Eight different glyphs out of one combined image, magnified " +
          imagepaddingrepro.Application.ZOOM +
          "x. Press <i>Add padding</i>: on an affected build all eight turn " +
          "into the glyph shown on the right, the one stored at offset [0, 0] " +
          "of the strip, because the padding is written straight into " +
          "background-position and replaces the offset that selects the glyph."
      );

      label.setRich(true);
      return label;
    },

    __buildGallery() {
      const app = imagepaddingrepro.Application;
      const row = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));

      app.SOURCES.forEach(source => {
        const image = new qx.ui.basic.Image(source);
        this.__images.push(image);
        row.add(this.__buildGlyph(image, this.__shortName(source)));
      });

      row.add(new qx.ui.core.Spacer(34));
      row.add(
        this.__buildGlyph(
          new qx.ui.basic.Image(app.GLYPH_AT_ORIGIN),
          "<i>strip offset [0,0]</i><br>" + this.__shortName(app.GLYPH_AT_ORIGIN)
        )
      );

      row.add(new qx.ui.core.Spacer(), { flex: 1 });
      return row;
    },

    __shortName(source) {
      return source.split("/").pop().replace(".png", "");
    },

    /**
     * A magnified glyph over its short name. The zoom is a paint-time
     * transform on the surrounding frame, so the image widget itself is left
     * exactly as an application would use it.
     */
    __buildGlyph(image, caption) {
      const zoom = imagepaddingrepro.Application.ZOOM;
      const data = qx.util.ResourceManager.getInstance().getData(
        image.getSource()
      );

      const frame = new qx.ui.container.Composite(new qx.ui.layout.Basic());
      frame.setWidth((data[0] + imagepaddingrepro.Application.PADDING) * zoom);
      frame.setHeight((data[1] + imagepaddingrepro.Application.PADDING) * zoom);
      frame.getContentElement().setStyles({
        transform: "scale(" + zoom + ")",
        transformOrigin: "0 0",
        imageRendering: "pixelated"
      });

      frame.add(image, { left: 0, top: 0 });

      const label = new qx.ui.basic.Label(caption);
      label.setRich(true);
      label.setWidth(frame.getWidth());

      const cell = new qx.ui.container.Composite(new qx.ui.layout.VBox(6));
      cell.add(frame);
      cell.add(label);
      return cell;
    },

    __buildControls() {
      const row = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));

      const add = new qx.ui.form.Button(
        "Add padding (" + imagepaddingrepro.Application.PADDING + "px)"
      );

      add.addListener("execute", () => {
        this.__applyPadding(imagepaddingrepro.Application.PADDING);
      });

      const clear = new qx.ui.form.Button("Remove padding");
      clear.addListener("execute", () => this.__applyPadding(0));

      row.add(add);
      row.add(clear);
      row.add(new qx.ui.core.Spacer(), { flex: 1 });
      return row;
    },

    __buildReport() {
      this.__verdict = new qx.ui.basic.Label();
      this.__verdict.setRich(true);

      this.__detail = new qx.ui.basic.Label();
      this.__detail.setRich(true);
      this.__detail.setSelectable(true);

      const box = new qx.ui.container.Composite(new qx.ui.layout.VBox(8));
      box.add(this.__verdict);
      box.add(this.__detail);
      return box;
    },

    /**
     * Sets the padding on every glyph, then reads the rendered
     * background-position back out of the DOM and compares it with the offset
     * the resource manager says the glyph lives at. No eyeballing required.
     */
    __applyPadding(padding) {
      this.__images.forEach(image => image.setPaddingLeft(padding));
      qx.ui.core.queue.Manager.flush();

      const rows = this.__images.map(image => this.__inspect(image, padding));
      const bad = rows.filter(row => !row.ok);

      this.__verdict.setValue(
        bad.length
          ? "<span style='color:#b00020'><b>FAIL</b> - " +
              bad.length +
              " of " +
              rows.length +
              " glyphs lost their offset.</span>"
          : "<span style='color:#00701a'><b>PASS</b> - all " +
              rows.length +
              " glyphs kept their offset.</span>"
      );

      this.__detail.setValue(
        "<pre style='margin:0'>" +
          rows
            .map(
              row =>
                (row.ok ? "  ok  " : " FAIL ") +
                row.name.padEnd(36) +
                " expected " +
                row.expected.padEnd(14) +
                " got " +
                row.actual
            )
            .join("\n") +
          "</pre>"
      );
    },

    __inspect(image, padding) {
      const source = image.getSource();
      const data = qx.util.ResourceManager.getInstance().getData(source);
      const expected = data[5] + padding + "px " + data[6] + "px";
      const actual =
        image.getContentElement().getDomElement().style.backgroundPosition;

      return {
        name: source.split("/").pop(),
        expected: expected,
        actual: actual,
        ok: actual === expected
      };
    }
  }
});
