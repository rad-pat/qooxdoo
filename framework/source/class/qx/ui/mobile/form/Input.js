/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tino Butz (tbtz)

************************************************************************ */

/**
 * Abstract class for all input fields.
 */
qx.Class.define("qx.ui.mobile.form.Input",
{
  extend : qx.ui.mobile.core.Widget,
  include : [
    qx.ui.form.MForm,
    qx.ui.form.MModelProperty,
    qx.ui.mobile.form.MState
  ],
  implement : [
    qx.ui.form.IForm,
    qx.ui.form.IModel
  ],
  type : "abstract",


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);
    this._setAttribute("type", this._getType());
    this.addCssClass("gap");

    // BUG #7756
    if(qx.core.Environment.get("os.name") == "ios") {
      this.addListener("blur", this._onBlur, this);
      this.addListener("focus", this._onFocus, this);
    }
  },


  statics:
  {
    SCROLL_TIMER_ID : null
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    // overridden
    _getTagName : function()
    {
      return "input";
    },


    /**
     * Returns the type of the input field. Override this method in the
     * specialized input class.
     */
    _getType : function()
    {
      if (qx.core.Environment.get("qx.debug")) {
        throw new Error("Abstract method call");
      }
    },


    /**
     * Handles the focus event on this input.
     */
    _onFocus: function() {
      clearTimeout(qx.ui.mobile.form.Input.SCROLL_TIMER_ID);
    },


    /**
     * Handles the blur event on this input.
     */
    _onBlur: function() {
      qx.ui.mobile.form.Input.SCROLL_TIMER_ID = setTimeout(function() {
        window.scrollTo(0, 0);
      }, 150);
    }
  },


  destruct : function() {
    // BUG #7756
    if (qx.core.Environment.get("os.name") == "ios") {
      this.removeListener("focus", this._onFocus, this);
      this.removeListener("blur", this._onBlur, this);
    }
  }
});
