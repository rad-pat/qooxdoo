/* ************************************************************************

   qooxdoo - the new era of web interface development

   Copyright:
     (C) 2004-2006 by Schlund + Partner AG, Germany
         All rights reserved

   License:
     LGPL 2.1: http://creativecommons.org/licenses/LGPL/2.1/

   Internet:
     * http://qooxdoo.oss.schlund.de

   Authors:
     * Sebastian Werner (wpbasti)
       <sebastian dot werner at 1und1 dot de>
     * Andreas Ecker (aecker)
       <andreas dot ecker at 1und1 dot de>

************************************************************************ */

/* ************************************************************************

#package(border)
#require(qx.renderer.color.ColorObject)
#post(qx.renderer.border.BorderPresets)

************************************************************************ */

/*!
  Border implementation for qx.ui.core.Widget instances.
*/
qx.OO.defineClass("qx.renderer.border.Border", qx.core.Object, 
function(vWidth, vStyle, vColor)
{
  qx.core.Object.call(this);

  this._themedEdges = {};
  this._initCache();

  if (qx.util.Validation.isValidNumber(vWidth))
  {
    this.setWidth(vWidth);

    if (qx.util.Validation.isValidString(vStyle)) {
      this.setStyle(vStyle);
    };

    if (qx.util.Validation.isValid(vColor)) {
      this.setColor(vColor);
    };
  };
});

qx.renderer.border.Border.enhancedCrossBrowserMode = true;
qx.renderer.border.Border.baseColor = "threedlightshadow";
qx.renderer.border.Border.stylePart = "Style";
qx.renderer.border.Border.colorPart = "Color";

proto._needsCompilationTop = true;
proto._needsCompilationRight = true;
proto._needsCompilationBottom = true;
proto._needsCompilationLeft = true;



/*
---------------------------------------------------------------------------
  PROPERTIES
---------------------------------------------------------------------------
*/

qx.renderer.border.Border.addProperty({ name : "topWidth", type : qx.Const.TYPEOF_NUMBER, defaultValue : 0, impl : "borderTopProperty" });
qx.renderer.border.Border.addProperty({ name : "rightWidth", type : qx.Const.TYPEOF_NUMBER, defaultValue : 0, impl : "borderRightProperty" });
qx.renderer.border.Border.addProperty({ name : "bottomWidth", type : qx.Const.TYPEOF_NUMBER, defaultValue : 0, impl : "borderBottomProperty" });
qx.renderer.border.Border.addProperty({ name : "leftWidth", type : qx.Const.TYPEOF_NUMBER, defaultValue : 0, impl : "borderLeftProperty" });

qx.renderer.border.Border.addProperty({ name : "topStyle", type : qx.Const.TYPEOF_STRING, defaultValue : qx.Const.CORE_NONE, impl : "borderTopProperty" });
qx.renderer.border.Border.addProperty({ name : "rightStyle", type : qx.Const.TYPEOF_STRING, defaultValue : qx.Const.CORE_NONE, impl : "borderRightProperty" });
qx.renderer.border.Border.addProperty({ name : "bottomStyle", type : qx.Const.TYPEOF_STRING, defaultValue : qx.Const.CORE_NONE, impl : "borderBottomProperty" });
qx.renderer.border.Border.addProperty({ name : "leftStyle", type : qx.Const.TYPEOF_STRING, defaultValue : qx.Const.CORE_NONE, impl : "borderLeftProperty" });

qx.renderer.border.Border.addProperty({ name : "topColor", impl : "borderTopProperty", type : qx.Const.TYPEOF_OBJECT, instance : "qx.renderer.color.Color", convert : qx.renderer.color.ColorCache });
qx.renderer.border.Border.addProperty({ name : "rightColor", impl : "borderRightProperty", type : qx.Const.TYPEOF_OBJECT, instance : "qx.renderer.color.Color", convert : qx.renderer.color.ColorCache });
qx.renderer.border.Border.addProperty({ name : "bottomColor", impl : "borderBottomProperty", type : qx.Const.TYPEOF_OBJECT, instance : "qx.renderer.color.Color", convert : qx.renderer.color.ColorCache });
qx.renderer.border.Border.addProperty({ name : "leftColor", impl : "borderLeftProperty", type : qx.Const.TYPEOF_OBJECT, instance : "qx.renderer.color.Color", convert : qx.renderer.color.ColorCache });




/*
---------------------------------------------------------------------------
  UTILITY
---------------------------------------------------------------------------
*/

qx.renderer.border.Border.fromString = function(vDefString)
{
  var vBorder = new qx.renderer.border.Border;
  var vAllParts = vDefString.split(/\s+/);
  var vPart, vTemp;

  for (var i=0; i<vAllParts.length; i++)
  {
    switch(vPart = vAllParts[i])
    {
      case qx.Const.BORDER_STYLE_GROOVE:
      case qx.Const.BORDER_STYLE_RIDGE:
      case qx.Const.BORDER_STYLE_INSET:
      case qx.Const.BORDER_STYLE_OUTSET:
      case qx.Const.BORDER_STYLE_SOLID:
      case qx.Const.BORDER_STYLE_DOTTED:
      case qx.Const.BORDER_STYLE_DASHED:
      case qx.Const.BORDER_STYLE_DOUBLE:
      case qx.Const.BORDER_STYLE_NONE:
        vBorder.setStyle(vPart);
        break;

      default:
        vTemp = parseFloat(vPart);

        if(vTemp == vPart || qx.lang.String.contains(vPart, qx.Const.CORE_PIXEL))
        {
          vBorder.setWidth(vTemp);
        }
        else
        {
          vPart = vPart.toLowerCase();
          vBorder.setColor(new qx.renderer.color.Color(vPart));
        };

        break;
    };
  };

  return vBorder;
};





/*
---------------------------------------------------------------------------
  COMPATIBILITY TO qx.renderer.border.BorderOBJECT
---------------------------------------------------------------------------
*/

proto.addListenerWidget = qx.util.Return.returnTrue;
proto.removeListenerWidget = qx.util.Return.returnTrue;

proto._sync = qx.util.Return.returnTrue;





/*
---------------------------------------------------------------------------
  COMBINED SETTERS
---------------------------------------------------------------------------
*/

proto.setWidth = function(vWidth)
{
  this.setTopWidth(vWidth);
  this.setRightWidth(vWidth);
  this.setBottomWidth(vWidth);
  this.setLeftWidth(vWidth);

  return true;
};

proto.setStyle = function(vStyle)
{
  this.setTopStyle(vStyle);
  this.setRightStyle(vStyle);
  this.setBottomStyle(vStyle);
  this.setLeftStyle(vStyle);

  return true;
};

proto.setColor = function(vColor)
{
  this.setTopColor(vColor);
  this.setRightColor(vColor);
  this.setBottomColor(vColor);
  this.setLeftColor(vColor);

  return true;
};




proto.setTop = function(vWidth, vStyle, vColor)
{
  this.setTopWidth(vWidth);
  this.setTopStyle(vStyle);
  this.setTopColor(vColor);

  return true;
};

proto.setRight = function(vWidth, vStyle, vColor)
{
  this.setRightWidth(vWidth);
  this.setRightStyle(vStyle);
  this.setRightColor(vColor);

  return true;
};

proto.setBottom = function(vWidth, vStyle, vColor)
{
  this.setBottomWidth(vWidth);
  this.setBottomStyle(vStyle);
  this.setBottomColor(vColor);

  return true;
};

proto.setLeft = function(vWidth, vStyle, vColor)
{
  this.setLeftWidth(vWidth);
  this.setLeftStyle(vStyle);
  this.setLeftColor(vColor);

  return true;
};





/*
---------------------------------------------------------------------------
  INITIALISATION OF CACHE
---------------------------------------------------------------------------
*/


if (qx.sys.Client.isGecko())
{
  proto._initCache = function()
  {
    this._defsX =
    {
      borderLeft : qx.Const.CORE_EMPTY,
      borderRight : qx.Const.CORE_EMPTY,

      MozBorderLeftColors : qx.Const.CORE_EMPTY,
      MozBorderRightColors : qx.Const.CORE_EMPTY
    };

    this._defsY =
    {
      borderTop : qx.Const.CORE_EMPTY,
      borderBottom : qx.Const.CORE_EMPTY,

      MozBorderTopColors : qx.Const.CORE_EMPTY,
      MozBorderBottomColors : qx.Const.CORE_EMPTY
    };
  };
}
else
{
  proto._initCache = function()
  {
    this._defsX =
    {
      borderLeft : qx.Const.CORE_EMPTY,
      borderRight : qx.Const.CORE_EMPTY
    };

    this._defsY =
    {
      borderTop : qx.Const.CORE_EMPTY,
      borderBottom : qx.Const.CORE_EMPTY
    };

    if (qx.renderer.border.Border.enhancedCrossBrowserMode)
    {
      this._enhancedDefsX =
      {
        borderLeft : qx.Const.CORE_EMPTY,
        borderRight : qx.Const.CORE_EMPTY
      };

      this._enhancedDefsY =
      {
        borderTop : qx.Const.CORE_EMPTY,
        borderBottom : qx.Const.CORE_EMPTY
      };
    };
  };
};


/*
---------------------------------------------------------------------------
  BORDER MODIFIER AND SYNCER
---------------------------------------------------------------------------
*/

if (qx.sys.Client.isGecko() || qx.renderer.border.Border.enhancedCrossBrowserMode)
{
  proto._addToThemed3DColors = function(vProp)
  {
    var needRegistering = qx.lang.Object.isEmpty(this._themedEdges);

    this._themedEdges[vProp] = true;

    if (needRegistering)
    {
      (new qx.renderer.color.ColorObject("ThreeDDarkShadow")).add(this);
      (new qx.renderer.color.ColorObject("ThreeDShadow")).add(this);
      (new qx.renderer.color.ColorObject("ThreeDLightShadow")).add(this);
      (new qx.renderer.color.ColorObject("ThreeDHighlight")).add(this);
    };
  };

  proto._removeFromThemed3DColors = function(vProp)
  {
    delete this._themedEdges[vProp];

    if (qx.lang.Object.isEmpty(this._themedEdges))
    {
      (new qx.renderer.color.ColorObject("ThreeDDarkShadow")).remove(this);
      (new qx.renderer.color.ColorObject("ThreeDShadow")).remove(this);
      (new qx.renderer.color.ColorObject("ThreeDLightShadow")).remove(this);
      (new qx.renderer.color.ColorObject("ThreeDHighlight")).remove(this);
    };
  };
}
else
{
  proto._addToThemed3DColors = function(vProp)
  {
    var needRegistering = qx.lang.Object.isEmpty(this._themedEdges);

    this._themedEdges[vProp] = true;

    if (needRegistering)
    {
      (new qx.renderer.color.ColorObject("ThreeDLightShadow")).add(this);
    };
  };

  proto._removeFromThemed3DColors = function(vProp)
  {
    delete this._themedEdges[vProp];

    if (qx.lang.Object.isEmpty(this._themedEdges))
    {
      (new qx.renderer.color.ColorObject("ThreeDLightShadow")).remove(this);
    };
  };
};





qx.renderer.border.Border.data =
{
  1 :
  {
    outset :
    {
      top : [ "threedhighlight" ],
      right : [ "threedshadow" ],
      bottom : [ "threedshadow" ],
      left : [ "threedhighlight" ]
    },

    inset :
    {
      top : [ "threedshadow" ],
      right : [ "threedhighlight" ],
      bottom : [ "threedhighlight" ],
      left : [ "threedshadow" ]
    }
  },

  2 :
  {
    outset :
    {
      top : [ "threedlightshadow", "threedhighlight" ],
      right : [ "threeddarkshadow", "threedshadow" ],
      bottom : [ "threeddarkshadow", "threedshadow" ],
      left : [ "threedlightshadow", "threedhighlight" ]
    },

    inset :
    {
      top : [ "threedshadow", "threeddarkshadow" ],
      right : [ "threedhighlight", "threedlightshadow" ],
      bottom : [ "threedhighlight", "threedlightshadow" ],
      left : [ "threedshadow", "threeddarkshadow" ]
    },

    ridge :
    {
      top : [ "threedhighlight", "threedshadow" ],
      right : [ "threedshadow", "threedhighlight" ],
      bottom : [ "threedshadow", "threedhighlight" ],
      left : [ "threedhighlight", "threedshadow" ]
    },

    groove :
    {
      top : [ "threedshadow", "threedhighlight" ],
      right : [ "threedhighlight", "threedshadow" ],
      bottom : [ "threedhighlight", "threedshadow" ],
      left : [ "threedshadow", "threedhighlight" ]
    }
  }
};





proto._generateDefString = function(vWidth, vStyle, vColor)
{
  if (typeof vWidth !== qx.Const.TYPEOF_NUMBER || vWidth < 0) {
    return qx.Const.CORE_EMPTY;
  };

  var vArr = [ vWidth + qx.Const.CORE_PIXEL ];

  if (qx.util.Validation.isValidString(vStyle)) {
    vArr.push(vStyle);
  };

  if (qx.util.Validation.isValidObject(vColor) && vColor instanceof qx.renderer.color.Color) {
    vColor = vColor.getStyle();
  };

  if (qx.util.Validation.isValidString(vColor)) {
    vArr.push(vColor);
  };

  return vArr.join(qx.Const.CORE_SPACE);
};




// TODO: Add more smartness ;)
// Only update the border edges which depends on this color object
proto._updateColors = function(vColorObject, vNewValue)
{
  this._needsCompilationTop = true;
  this._needsCompilationRight = true;
  this._needsCompilationBottom = true;
  this._needsCompilationLeft = true;

  this._sync(qx.Const.PROPERTY_TOP);
  this._sync(qx.Const.PROPERTY_RIGHT);
  this._sync(qx.Const.PROPERTY_BOTTOM);
  this._sync(qx.Const.PROPERTY_LEFT);
};







proto._handleColorRegistration = function(propValue, propOldValue, propData)
{
  if (qx.lang.String.contains(propData.name, qx.renderer.border.Border.stylePart))
  {
    switch(propValue)
    {
      case qx.Const.BORDER_STYLE_OUTSET:
      case qx.Const.BORDER_STYLE_INSET:
      case qx.Const.BORDER_STYLE_GROOVE:
      case qx.Const.BORDER_STYLE_RIDGE:
        this._addToThemed3DColors(propData.name);
        break;

      default:
        this._removeFromThemed3DColors(propData.name);
    };
  };

  if (qx.lang.String.contains(propData.name, qx.renderer.border.Border.colorPart))
  {
    if (propOldValue instanceof qx.renderer.color.ColorObject)
    {
      // detect if there are no other deps anymore
      switch(propOldValue)
      {
        case this.getTopColor():
        case this.getRightColor():
        case this.getBottomColor():
        case this.getLeftColor():
          break;

        default:
          propOldValue.remove(this);
      };
    };

    if (propValue instanceof qx.renderer.color.ColorObject)
    {
      // simply add, internal storage is a hash key so
      // this is not a problem also if this is already
      // registered there.
      propValue.add(this);
    };
  };
};








proto._modifyBorderTopProperty = function(propValue, propOldValue, propData)
{
  this._handleColorRegistration(propValue, propOldValue, propData);

  this._needsCompilationTop = true;
  this._useEnhancedCrossBrowserMode = null;

  this._sync("top");

  return true;
};

proto._modifyBorderRightProperty = function(propValue, propOldValue, propData)
{
  this._handleColorRegistration(propValue, propOldValue, propData);

  this._needsCompilationRight = true;
  this._useEnhancedCrossBrowserMode = null;

  this._sync("right");

  return true;
};

proto._modifyBorderBottomProperty = function(propValue, propOldValue, propData)
{
  this._handleColorRegistration(propValue, propOldValue, propData);

  this._needsCompilationBottom = true;
  this._useEnhancedCrossBrowserMode = null;

  this._sync("bottom");

  return true;
};

proto._modifyBorderLeftProperty = function(propValue, propOldValue, propData)
{
  this._handleColorRegistration(propValue, propOldValue, propData);

  this._needsCompilationLeft = true;
  this._useEnhancedCrossBrowserMode = null;

  this._sync("left");

  return true;
};









proto.getUseEnhancedCrossBrowserMode = function()
{
  if (this._useEnhancedCrossBrowserMode == null) {
    this._useEnhancedCrossBrowserMode = this._evalUseEnhancedCrossBrowserMode();
  };

  return this._useEnhancedCrossBrowserMode;
};

proto._evalUseEnhancedCrossBrowserMode = function()
{
  if (this.getTopWidth() == 2) {
    switch(this.getTopStyle()) {
      case qx.Const.BORDER_STYLE_OUTSET: case qx.Const.BORDER_STYLE_INSET: case qx.Const.BORDER_STYLE_GROOVE: case qx.Const.BORDER_STYLE_RIDGE: return true;
    };
  };

  if (this.getRightWidth() == 2) {
    switch(this.getRightStyle()) {
      case qx.Const.BORDER_STYLE_OUTSET: case qx.Const.BORDER_STYLE_INSET: case qx.Const.BORDER_STYLE_GROOVE: case qx.Const.BORDER_STYLE_RIDGE: return true;
    };
  };

  if (this.getBottomWidth() == 2) {
    switch(this.getBottomStyle()) {
      case qx.Const.BORDER_STYLE_OUTSET: case qx.Const.BORDER_STYLE_INSET: case qx.Const.BORDER_STYLE_GROOVE: case qx.Const.BORDER_STYLE_RIDGE: return true;
    };
  };

  if (this.getLeftWidth() == 2) {
    switch(this.getLeftStyle()) {
      case qx.Const.BORDER_STYLE_OUTSET: case qx.Const.BORDER_STYLE_INSET: case qx.Const.BORDER_STYLE_GROOVE: case qx.Const.BORDER_STYLE_RIDGE: return true;
    };
  };

  return false;
};






/*
---------------------------------------------------------------------------
  BORDER APPLY IMPLEMENTATION
---------------------------------------------------------------------------
*/

proto._applyWidget = function(o)
{
  this._applyWidgetX(o);
  this._applyWidgetY(o);
};

proto._resetWidget = function(o)
{
  this._resetWidgetX(o);
  this._resetWidgetY(o);
};

proto._resetWidgetX = function(o) {
  return qx.renderer.border.Border._resetBorderX(o);
};

proto._resetWidgetY = function(o) {
  return qx.renderer.border.Border._resetBorderY(o);
};

proto._applyWidgetXCommon = function(vObject)
{
  if (this._needsCompilationLeft) {
    this._compileLeft();
  };

  if (this._needsCompilationRight) {
    this._compileRight();
  };

  for (i in this._defsX) {
    vObject._style[i] = this._defsX[i];
  };

  if (!qx.sys.Client.isGecko() && qx.renderer.border.Border.enhancedCrossBrowserMode)
  {
    if (this.getUseEnhancedCrossBrowserMode()) {
      vObject._createElementForEnhancedBorder();
    };

    if (vObject._borderStyle)
    {
      for (i in this._enhancedDefsX) {
        vObject._borderStyle[i] = this._enhancedDefsX[i];
      };
    };
  };
};

proto._applyWidgetYCommon = function(vObject)
{
  if (this._needsCompilationTop) {
    this._compileTop();
  };

  if (this._needsCompilationBottom) {
    this._compileBottom();
  };

  for (i in this._defsY) {
    vObject._style[i] = this._defsY[i];
  };

  if (!qx.sys.Client.isGecko() && qx.renderer.border.Border.enhancedCrossBrowserMode)
  {
    if (this.getUseEnhancedCrossBrowserMode()) {
      vObject._createElementForEnhancedBorder();
    };

    if (vObject._borderStyle)
    {
      for (i in this._enhancedDefsY) {
        vObject._borderStyle[i] = this._enhancedDefsY[i];
      };
    };
  };
};

if (qx.sys.Client.isGecko())
{
  proto._applyWidgetX = proto._applyWidgetXCommon;
  proto._applyWidgetY = proto._applyWidgetYCommon;

  proto._generateMozColorDefString = function(vWidth, vStyle, vEdge)
  {
    try
    {
      try {
        var a = qx.renderer.border.Border.data[vWidth][vStyle][vEdge];
      } catch(ex) {};

      if (typeof a === qx.Const.TYPEOF_OBJECT)
      {
        for (var i=0, s=[], l=a.length; i<l; i++) {
          s.push((new qx.renderer.color.ColorObject(a[i]).getStyle()));
        };

        return s.join(qx.Const.CORE_SPACE);
      };
    }
    catch(ex) {
      this.error("Failed to generate Mozilla Color Definition Strings: " + ex, "_generateMozColorDefString");
    };

    return qx.Const.CORE_EMPTY;
  };

  proto._compileTop = function()
  {
    var w=this.getTopWidth(), s=this.getTopStyle(), d=this._defsY;

    d.borderTop = this._generateDefString(w, s, this.getTopColor());
    d.MozBorderTopColors = this._generateMozColorDefString(w, s, qx.Const.PROPERTY_TOP);

    this._needsCompilationTop = false;
  };

  proto._compileRight = function()
  {
    var w=this.getRightWidth(), s=this.getRightStyle(), d=this._defsX;

    d.borderRight = this._generateDefString(w, s, this.getRightColor());
    d.MozBorderRightColors = this._generateMozColorDefString(w, s, qx.Const.PROPERTY_RIGHT);

    this._needsCompilationRight = false;
  };

  proto._compileBottom = function()
  {
    var w=this.getBottomWidth(), s=this.getBottomStyle(), d=this._defsY;

    d.borderBottom = this._generateDefString(w, s, this.getBottomColor());
    d.MozBorderBottomColors = this._generateMozColorDefString(w, s, qx.Const.PROPERTY_BOTTOM);

    this._needsCompilationBottom = false;
  };

  proto._compileLeft = function()
  {
    var w=this.getLeftWidth(), s=this.getLeftStyle(), d=this._defsX;

    d.borderLeft = this._generateDefString(w, s, this.getLeftColor());
    d.MozBorderLeftColors = this._generateMozColorDefString(w, s, qx.Const.PROPERTY_LEFT);

    this._needsCompilationLeft = false;
  };

  qx.renderer.border.Border._resetBorderX = function(o)
  {
    s = o._style;
    s.borderLeft = s.borderRight = s.MozBorderLeftColors = s.MozBorderRightColors = qx.Const.CORE_EMPTY;
  };

  qx.renderer.border.Border._resetBorderY = function(o)
  {
    s = o._style;
    s.borderTop = s.borderBottom = s.MozBorderTopColors = s.MozBorderBottomColors = qx.Const.CORE_EMPTY;
  };
}
else
{
  proto._applyWidgetX = function(vObject)
  {
    this._applyWidgetXCommon(vObject);

    if (qx.renderer.border.Border.enhancedCrossBrowserMode)
    {
      if (this.getUseEnhancedCrossBrowserMode()) {
        vObject._createElementForEnhancedBorder();
      };

      if (vObject._borderStyle)
      {
        for (i in this._enhancedDefsX) {
          vObject._borderStyle[i] = this._enhancedDefsX[i];
        };
      };
    };
  };

  proto._applyWidgetY = function(vObject)
  {
    this._applyWidgetYCommon(vObject);

    if (qx.renderer.border.Border.enhancedCrossBrowserMode)
    {
      if (this.getUseEnhancedCrossBrowserMode()) {
        vObject._createElementForEnhancedBorder();
      };

      if (vObject._borderStyle)
      {
        for (i in this._enhancedDefsY) {
          vObject._borderStyle[i] = this._enhancedDefsY[i];
        };
      };
    };
  };

  proto._compileTop = function()
  {
    var vTopWidth = this.getTopWidth();
    var vTopStyle = this.getTopStyle();
    var vTopColor = this.getTopColor();

    switch(vTopWidth)
    {
      case 1:
        switch(vTopStyle)
        {
          case qx.Const.BORDER_STYLE_OUTSET:
          case qx.Const.BORDER_STYLE_INSET:
            vTopColor = (new qx.renderer.color.ColorObject(qx.renderer.border.Border.data[vTopWidth][vTopStyle][qx.Const.PROPERTY_TOP][0]));
            vTopStyle = qx.Const.BORDER_STYLE_SOLID;
        };

        break;

      case 2:
        switch(vTopStyle)
        {
          case qx.Const.BORDER_STYLE_OUTSET:
          case qx.Const.BORDER_STYLE_INSET:
          case qx.Const.BORDER_STYLE_GROOVE:
          case qx.Const.BORDER_STYLE_RIDGE:
            if (qx.renderer.border.Border.enhancedCrossBrowserMode)
            {
              try
              {
                var c = qx.renderer.border.Border.data[vTopWidth][vTopStyle][qx.Const.PROPERTY_TOP];

                if (typeof c === qx.Const.TYPEOF_OBJECT)
                {
                  vTopStyle = qx.Const.BORDER_STYLE_SOLID;
                  vTopWidth = 1;
                  vTopColor = (new qx.renderer.color.ColorObject(c[1]));

                  this._enhancedDefsY.borderTop = this._generateDefString(vTopWidth, vTopStyle, vTopColor);

                  vTopColor = (new qx.renderer.color.ColorObject(c[0]));
                };
              }
              catch(ex)
              {
                this.error("Failed to compile top border: " + ex, "_compileTop");
                this.warn("Details: Width=" + vTopWidth + ", Style=" + vTopStyle);
              };
            }
            else
            {
              vTopColor = (new qx.renderer.color.ColorObject(qx.renderer.border.Border.baseColor));
            };
        };

        break;
    };

    this._defsY.borderTop = this._generateDefString(vTopWidth, vTopStyle, vTopColor);
    this._needsCompilationTop = false;
  };

  proto._compileRight = function()
  {
    var vRightWidth = this.getRightWidth();
    var vRightStyle = this.getRightStyle();
    var vRightColor = this.getRightColor();

    switch(vRightWidth)
    {
      case 1:
        switch(vRightStyle)
        {
          case qx.Const.BORDER_STYLE_OUTSET:
          case qx.Const.BORDER_STYLE_INSET:
            vRightColor = (new qx.renderer.color.ColorObject(qx.renderer.border.Border.data[vRightWidth][vRightStyle][qx.Const.PROPERTY_RIGHT][0]));
            vRightStyle = qx.Const.BORDER_STYLE_SOLID;
        };

        break;

      case 2:
        switch(vRightStyle)
        {
          case qx.Const.BORDER_STYLE_OUTSET:
          case qx.Const.BORDER_STYLE_INSET:
          case qx.Const.BORDER_STYLE_GROOVE:
          case qx.Const.BORDER_STYLE_RIDGE:
            if (qx.renderer.border.Border.enhancedCrossBrowserMode)
            {
              try
              {
                var c = qx.renderer.border.Border.data[vRightWidth][vRightStyle][qx.Const.PROPERTY_RIGHT];

                if (typeof c === qx.Const.TYPEOF_OBJECT)
                {
                  vRightStyle = qx.Const.BORDER_STYLE_SOLID;
                  vRightWidth = 1;
                  vRightColor = (new qx.renderer.color.ColorObject(c[1]));

                  this._enhancedDefsX.borderRight = this._generateDefString(vRightWidth, vRightStyle, vRightColor);

                  vRightColor = (new qx.renderer.color.ColorObject(c[0]));
                };
              }
              catch(ex)
              {
                this.error("Failed to compile right border: " + ex, "_compileRight");
                this.warn("Details: Width=" + vRightWidth + ", Style=" + vRightStyle);
              };
            }
            else
            {
              vRightColor = (new qx.renderer.color.ColorObject(qx.renderer.border.Border.baseColor));
            };
        };

        break;
    };

    this._defsX.borderRight = this._generateDefString(vRightWidth, vRightStyle, vRightColor);
    this._needsCompilationRight = false;
  };

  proto._compileBottom = function()
  {
    var vBottomWidth = this.getBottomWidth();
    var vBottomStyle = this.getBottomStyle();
    var vBottomColor = this.getBottomColor();

    switch(vBottomWidth)
    {
      case 1:
        switch(vBottomStyle)
        {
          case qx.Const.BORDER_STYLE_OUTSET:
          case qx.Const.BORDER_STYLE_INSET:
            vBottomColor = (new qx.renderer.color.ColorObject(qx.renderer.border.Border.data[vBottomWidth][vBottomStyle][qx.Const.PROPERTY_BOTTOM][0]));
            vBottomStyle = qx.Const.BORDER_STYLE_SOLID;
        };

        break;

      case 2:
        switch(vBottomStyle)
        {
          case qx.Const.BORDER_STYLE_OUTSET:
          case qx.Const.BORDER_STYLE_INSET:
          case qx.Const.BORDER_STYLE_GROOVE:
          case qx.Const.BORDER_STYLE_RIDGE:
            if (qx.renderer.border.Border.enhancedCrossBrowserMode)
            {
              try
              {
                var c = qx.renderer.border.Border.data[vBottomWidth][vBottomStyle][qx.Const.PROPERTY_BOTTOM];

                if (typeof c === qx.Const.TYPEOF_OBJECT)
                {
                  vBottomStyle = qx.Const.BORDER_STYLE_SOLID;
                  vBottomWidth = 1;
                  vBottomColor = (new qx.renderer.color.ColorObject(c[1]));

                  this._enhancedDefsY.borderBottom = this._generateDefString(vBottomWidth, vBottomStyle, vBottomColor);

                  vBottomColor = (new qx.renderer.color.ColorObject(c[0]));
                };
              }
              catch(ex) {
                this.error("Failed to compile bottom border: " + ex, "_compileBottom");
                this.warn("Details: Width=" + vBottomWidth + ", Style=" + vBottomStyle);
              };
            }
            else
            {
              vBottomColor = (new qx.renderer.color.ColorObject(qx.renderer.border.Border.baseColor));
            };
        };

        break;
    };

    this._defsY.borderBottom = this._generateDefString(vBottomWidth, vBottomStyle, vBottomColor);
    this._needsCompilationBottom = false;
  };

  proto._compileLeft = function()
  {
    var vLeftWidth = this.getLeftWidth();
    var vLeftStyle = this.getLeftStyle();
    var vLeftColor = this.getLeftColor();

    switch(vLeftWidth)
    {
      case 1:
        switch(vLeftStyle)
        {
          case qx.Const.BORDER_STYLE_OUTSET:
          case qx.Const.BORDER_STYLE_INSET:
            vLeftColor = (new qx.renderer.color.ColorObject(qx.renderer.border.Border.data[vLeftWidth][vLeftStyle][qx.Const.PROPERTY_LEFT][0]));
            vLeftStyle = qx.Const.BORDER_STYLE_SOLID;
        };

        break;

      case 2:
        switch(vLeftStyle)
        {
          case qx.Const.BORDER_STYLE_OUTSET:
          case qx.Const.BORDER_STYLE_INSET:
          case qx.Const.BORDER_STYLE_GROOVE:
          case qx.Const.BORDER_STYLE_RIDGE:
            if (qx.renderer.border.Border.enhancedCrossBrowserMode)
            {
              try
              {
                var c = qx.renderer.border.Border.data[vLeftWidth][vLeftStyle][qx.Const.PROPERTY_LEFT];

                if (typeof c === qx.Const.TYPEOF_OBJECT)
                {
                  vLeftStyle = qx.Const.BORDER_STYLE_SOLID;
                  vLeftWidth = 1;
                  vLeftColor = (new qx.renderer.color.ColorObject(c[1]));

                  this._enhancedDefsX.borderLeft = this._generateDefString(vLeftWidth, vLeftStyle, vLeftColor);

                  vLeftColor = (new qx.renderer.color.ColorObject(c[0]));
                };
              }
              catch(ex) {
                this.error("Failed to compile left border: " + ex, "_compileLeft");
                this.warn("Details: Width=" + vLeftWidth + ", Style=" + vLeftStyle);
              };
            }
            else
            {
              vLeftColor = (new qx.renderer.color.ColorObject(qx.renderer.border.Border.baseColor));
            };
        };

        break;
    };

    this._defsX.borderLeft = this._generateDefString(vLeftWidth, vLeftStyle, vLeftColor);
    this._needsCompilationLeft = false;
  };

  qx.renderer.border.Border._resetBorderX = function(o)
  {
    s = o._style;
    s.borderLeft = s.borderRight = qx.Const.CORE_EMPTY;

    if (qx.renderer.border.Border.enhancedCrossBrowserMode)
    {
      s = o._borderStyle;
      if (s) {
        s.borderLeft = s.borderRight = qx.Const.CORE_EMPTY;
      };
    };
  };

  qx.renderer.border.Border._resetBorderY = function(o)
  {
    s = o._style;
    s.borderTop = s.borderBottom = qx.Const.CORE_EMPTY;

    if (qx.renderer.border.Border.enhancedCrossBrowserMode)
    {
      s = o._borderStyle;
      if (s) {
        s.borderTop = s.borderBottom = qx.Const.CORE_EMPTY;
      };
    };
  };
};











/*
---------------------------------------------------------------------------
  DISPOSER
---------------------------------------------------------------------------
*/

proto.dispose = function()
{
  if (this.getDisposed()) {
    return;
  };

  if (typeof this._defsX === qx.Const.TYPEOF_OBJECT) {
    for (var i in this._defsX) {
      delete this._defsX[i];
    };
  };

  delete this._defsX;

  if (typeof this._defsY === qx.Const.TYPEOF_OBJECT) {
    for (var i in this._defsY) {
      delete this._defsY[i];
    };
  };

  delete this._defsY;

  if (qx.renderer.border.Border.enhancedCrossBrowserMode)
  {
    if (typeof this._enhancedDefsX === qx.Const.TYPEOF_OBJECT) {
      for (var i in this._enhancedDefsX) {
        delete this._enhancedDefsX[i];
      };
    };

    delete this._enhancedDefsX;

    if (typeof this._enhancedDefsY === qx.Const.TYPEOF_OBJECT) {
      for (var i in this._enhancedDefsY) {
        delete this._enhancedDefsY[i];
      };
    };

    delete this._enhancedDefsY;
  };

  delete this._themedEdges;

  return qx.core.Object.prototype.dispose.call(this);
};