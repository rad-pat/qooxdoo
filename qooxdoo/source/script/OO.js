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

#namespace(qx.OO)
#package(core)
#require(qx.lang.Core)

************************************************************************ */

qx.OO = {};

qx.OO.classes = {};
qx.OO.setter = {};
qx.OO.getter = {};
qx.OO.resetter = {};
qx.OO.values = {};
qx.OO.propertyNumber = 0;

qx.OO.C_SET = "set";
qx.OO.C_GET = "get";
qx.OO.C_APPLY = "apply";
qx.OO.C_RESET = "reset";
qx.OO.C_FORCE = "force";
qx.OO.C_TOGGLE = "toggle";
qx.OO.C_CHANGE = "change";
qx.OO.C_STORE = "store";
qx.OO.C_RETRIEVE = "retrieve";
qx.OO.C_PRIVATECHANGE = "_change";
qx.OO.C_INVALIDATE = "_invalidate";
qx.OO.C_INVALIDATED = "_invalidated";
qx.OO.C_RECOMPUTE = "_recompute";
qx.OO.C_CACHED = "_cached";
qx.OO.C_COMPUTE = "_compute";
qx.OO.C_COMPUTED = "_computed";
qx.OO.C_UNITDETECTION = "_unitDetection";

qx.OO.C_GLOBALPROPERTYREF = "PROPERTY_";

qx.OO.C_UNIT_VALUE = "Value";
qx.OO.C_UNIT_PARSED = "Parsed";
qx.OO.C_UNIT_TYPE = "Type";
qx.OO.C_UNIT_TYPE_NULL = "TypeNull";
qx.OO.C_UNIT_TYPE_PIXEL = "TypePixel";
qx.OO.C_UNIT_TYPE_PERCENT = "TypePercent";
qx.OO.C_UNIT_TYPE_AUTO = "TypeAuto";
qx.OO.C_UNIT_TYPE_FLEX = "TypeFlex";

qx.OO.C_GETDEFAULT = "getDefault";
qx.OO.C_SETDEFAULT = "setDefault";
qx.OO.C_RETRIEVEDEFAULT = "retrieveDefault";
qx.OO.C_STOREDEFAULT = "storeDefault";

qx.OO.C_VALUE = "_value";
qx.OO.C_NULL = "_null";
qx.OO.C_EVAL = "_eval";
qx.OO.C_CHECK = "_check";
qx.OO.C_MODIFY = "_modify";






/*
---------------------------------------------------------------------------
  DEFINE CLASS IMPLEMENTATION
---------------------------------------------------------------------------
*/

qx.OO.defineClass = function(vClassName, vSuper, vConstructor)
{
  var vSplitName = vClassName.split(qx.Const.CORE_DOT);
  var vNameLength = vSplitName.length;

  var vLightClass = typeof vSuper === qx.Const.TYPEOF_UNDEFINED;
  var vTempObject = window;

  if (!vLightClass) {
    vNameLength--;
  };

  for (var i=0; i<vNameLength; i++)
  {
    if (typeof vTempObject[vSplitName[i]] === qx.Const.TYPEOF_UNDEFINED) {
      vTempObject[vSplitName[i]] = {};
    };

    vTempObject = vTempObject[vSplitName[i]];
  };

  if (vLightClass) {
    return;
  };

  // Store constructor function under classname
  qx.Class = vTempObject[vSplitName[i]] = vConstructor;

  // build helper function
  // this omits the initial constructor call while inherit properties
  var vHelperConstructor = new Function;
  vHelperConstructor.prototype = vSuper.prototype;
  qx.Proto = vConstructor.prototype = new vHelperConstructor;

  vConstructor.superclass = vSuper;

  qx.Proto.classname = vConstructor.classname = vClassName;
  qx.Proto.constructor = vConstructor;

  // Compatibility to old extend()
  proto = qx.Proto;

  // Store reference to global classname registry
  qx.OO.classes[vClassName] = vConstructor;
};






/*
---------------------------------------------------------------------------
  OBJECT PROPERTY EXTENSION
---------------------------------------------------------------------------
*/

Function.prototype.addFastProperty = function(vConfig)
{
  var vName = vConfig.name;
  var vUpName = qx.lang.String.toFirstUp(vName);

  var vStorageField = qx.OO.C_VALUE + vUpName;
  var vGetterName = qx.OO.C_GET + vUpName;
  var vSetterName = qx.OO.C_SET + vUpName;
  var vComputerName = qx.OO.C_COMPUTE + vUpName;

  proto[vStorageField] = typeof vConfig.defaultValue !== qx.Const.TYPEOF_UNDEFINED ? vConfig.defaultValue : null;

  if (vConfig.noCompute)
  {
    proto[vGetterName] = function() {
      return this[vStorageField];
    };
  }
  else
  {
    proto[vGetterName] = function() {
      return this[vStorageField] == null ? this[vStorageField] = this[vComputerName]() : this[vStorageField];
    };
  };

  if (vConfig.setOnlyOnce)
  {
    proto[vSetterName] = function(vValue)
    {
      this[vStorageField] = vValue;
      this[vSetterName] = null;

      return vValue;
    };
  }
  else
  {
    proto[vSetterName] = function(vValue) {
      return this[vStorageField] = vValue;
    };
  };

  if (!vConfig.noCompute)
  {
    proto[vComputerName] = function() {
      return null;
    };
  };
};

Function.prototype.addCachedProperty = function(p)
{
  var vName = p.name;
  var vUpName = qx.lang.String.toFirstUp(vName);

  var vStorageField = qx.OO.C_CACHED + vUpName;
  var vComputerName = qx.OO.C_COMPUTE + vUpName;
  var vChangeName = qx.OO.C_PRIVATECHANGE + vUpName;

  if (typeof p.defaultValue !== qx.Const.TYPEOF_UNDEFINED) {
    proto[vStorageField] = p.defaultValue;
  };

  proto[qx.OO.C_GET + vUpName] = function()
  {
    if (this[vStorageField] == null) {
      this[vStorageField] = this[vComputerName]();
    };

    return this[vStorageField];
  };

  proto[qx.OO.C_INVALIDATE + vUpName] = function()
  {
    if (this[vStorageField] != null)
    {
      this[vStorageField] = null;

      if (p.addToQueueRuntime) {
        this.addToQueueRuntime(p.name);
      };
    };
  };

  proto[qx.OO.C_RECOMPUTE + vUpName] = function()
  {
    var vOld = this[vStorageField];
    var vNew = this[vComputerName]();

    if (vNew != vOld)
    {
      this[vStorageField] = vNew;
      this[vChangeName](vNew, vOld);

      return true;
    };

    return false;
  };

  proto[vChangeName] = function(vNew, vOld) {};
  proto[vComputerName] = function() { return null; };
};

Function.prototype.addPropertyGroup = function(p)
{
  /* --------------------------------------------------------------------------------
      PRE-CHECKS
  -------------------------------------------------------------------------------- */
  if(typeof p !== qx.Const.TYPEOF_OBJECT) {
    throw new Error("Param should be an object!");
  };

  if (qx.util.Validation.isInvalid(p.name)) {
    throw new Error("Malformed input parameters: name needed!");
  };

  if (qx.util.Validation.isInvalid(p.members)) {
    throw new Error("Malformed input parameters: members needed!");
  };

  p.method = qx.lang.String.toFirstUp(p.name);


  /* --------------------------------------------------------------------------------
      CACHING
  -------------------------------------------------------------------------------- */
  p.getter = [];
  p.setter = [];

  for (var i=0, l=p.members.length; i<l; i++) {
    p.setter.push(qx.OO.C_SET + qx.lang.String.toFirstUp(p.members[i]));
  };

  for (var i=0, l=p.members.length; i<l; i++) {
    p.getter.push(qx.OO.C_GET + qx.lang.String.toFirstUp(p.members[i]));
  };


  /* --------------------------------------------------------------------------------
      GETTER
  -------------------------------------------------------------------------------- */
  this.prototype[qx.OO.C_GET + p.method] = function()
  {
    var a = [];
    var g = p.getter;

    for (var i=0, l=g.length; i<l; i++) {
      a.push(this[g[i]]());
    };

    return a;
  };


  /* --------------------------------------------------------------------------------
      SETTER
  -------------------------------------------------------------------------------- */
  switch(p.mode)
  {
    case "shorthand":
      this.prototype[qx.OO.C_SET + p.method] = function()
      {
        if (arguments.length > 4 || arguments.length == 0) {
          throw new Error("Invalid number of arguments for property " + p.name + ": " + arguments);
        };

        try
        {
          var ret = qx.lang.Array.fromShortHand(arguments);
        }
        catch(ex)
        {
          throw new Error("Invalid shorthand values for property " + p.name + ": " + arguments + ": " + ex);
        };

        var s = p.setter;
        var l = s.length;

        for (var i=0; i<l; i++) {
          this[s[i]](ret[i]);
        };
      };
      break;

    default:
      this.prototype[qx.OO.C_SET + p.method] = function()
      {
        var s = p.setter;
        var l = s.length;

        if (arguments.length != l) {
          throw new Error("Invalid number of arguments (needs: " + l + ", is: " + arguments.length + ") for property " + p.name + ": " + qx.lang.Array.fromArguments(arguments).toString());
        };

        for (var i=0; i<l; i++) {
          this[s[i]](arguments[i]);
        };
      };
  };
};

Function.prototype.removeProperty = function(p)
{
  if (typeof this.prototype._properties !== qx.Const.TYPEOF_STRING) {
    throw new Error("Has no properties!");
  };

  if(typeof p !== qx.Const.TYPEOF_OBJECT) {
    throw new Error("Param should be an object!");
  };

  if (qx.util.Validation.isInvalid(p.name)) {
    throw new Error("Malformed input parameters: name needed!");
  };

  // building shorter prototype access
  var pp = this.prototype;

  p.method = qx.lang.String.toFirstUp(p.name);
  p.implMethod = p.impl ? qx.lang.String.toFirstUp(p.impl) : p.method;

  var valueKey = qx.OO.C_VALUE + p.method;

  // Remove property from list
  pp._properties = qx.lang.String.remove(pp._properties, p.name);

  // Reset default value to null
  pp[valueKey] = null;

  // Reset methods
  pp[qx.OO.C_GET + p.method] = null;
  pp[qx.OO.C_SET + p.method] = null;
  pp[qx.OO.C_RESET + p.method] = null;
  pp[qx.OO.C_APPLY + p.method] = null;
  pp[qx.OO.C_FORCE + p.method] = null;
  pp[qx.OO.C_GETDEFAULT + p.method] = null;
  pp[qx.OO.C_SETDEFAULT + p.method] = null;
};

Function.prototype._createProperty = function(p)
{
  if(typeof p !== qx.Const.TYPEOF_OBJECT) {
    throw new Error("AddProperty: Param should be an object!");
  };

  if (qx.util.Validation.isInvalid(p.name)) {
    throw new Error("AddProperty: Malformed input parameters: name needed!");
  };

  // building shorter prototype access
  var pp = this.prototype;

  p.method = qx.lang.String.toFirstUp(p.name);
  p.implMethod = p.impl ? qx.lang.String.toFirstUp(p.impl) : p.method;

  if (qx.util.Validation.isInvalid(p.defaultValue)) {
    p.defaultValue = null;
  };

  if (qx.util.Validation.isInvalidBoolean(p.allowNull)) {
    p.allowNull = true;
  };

  if (qx.util.Validation.isInvalidBoolean(p.allowMultipleArguments)) {
    p.allowMultipleArguments = false;
  };






  if (typeof p.type === qx.Const.TYPEOF_STRING) {
    p.hasType = true;
  }
  else if (typeof p.type !== qx.Const.TYPEOF_UNDEFINED) {
    throw new Error("AddProperty: Invalid type definition for property " + p.name + ": " + p.type);
  }
  else {
    p.hasType = false;
  };

  if (typeof p.instance === qx.Const.TYPEOF_STRING) {
    p.hasInstance = true;
  }
  else if (typeof p.instance !== qx.Const.TYPEOF_UNDEFINED) {
    throw new Error("AddProperty: Invalid instance definition for property " + p.name + ": " + p.instance);
  }
  else {
    p.hasInstance = false;
  };

  if (typeof p.classname === qx.Const.TYPEOF_STRING) {
    p.hasClassName = true;
  }
  else if (typeof p.classname !== qx.Const.TYPEOF_UNDEFINED) {
    throw new Error("AddProperty: Invalid classname definition for property " + p.name + ": " + p.classname);
  }
  else {
    p.hasClassName = false;
  };






  p.hasConvert = qx.util.Validation.isValidFunction(p.convert);
  p.hasPossibleValues = qx.util.Validation.isValidArray(p.possibleValues);
  p.hasUnitDetection = qx.util.Validation.isValidString(p.unitDetection);

  p.addToQueue = p.addToQueue || false;
  p.addToQueueRuntime = p.addToQueueRuntime || false;

  // upper-case name
  p.up = p.name.toUpperCase();

  // register global uppercase name
  qx.Const[qx.OO.C_GLOBALPROPERTYREF + p.up] = p.name;

  var valueKey = qx.OO.C_VALUE + p.method;
  var evalKey = qx.OO.C_EVAL + p.method;
  var changeKey = qx.OO.C_CHANGE + p.method;
  var modifyKey = qx.OO.C_MODIFY + p.implMethod;
  var checkKey = qx.OO.C_CHECK + p.implMethod;

  if (!qx.OO.setter[p.name])
  {
    qx.OO.setter[p.name] = qx.OO.C_SET + p.method;
    qx.OO.getter[p.name] = qx.OO.C_GET + p.method;
    qx.OO.resetter[p.name] = qx.OO.C_RESET + p.method;
    qx.OO.values[p.name] = valueKey;
  };

  // unit detection support
  if (p.hasUnitDetection)
  {
    // computed unit
    var cu = qx.OO.C_COMPUTED + p.method;
    pp[cu + qx.OO.C_UNIT_VALUE] = null;
    pp[cu + qx.OO.C_UNIT_PARSED] = null;
    pp[cu + qx.OO.C_UNIT_TYPE] = null;
    pp[cu + qx.OO.C_UNIT_TYPE_NULL] = true;
    pp[cu + qx.OO.C_UNIT_TYPE_PIXEL] = false;
    pp[cu + qx.OO.C_UNIT_TYPE_PERCENT] = false;
    pp[cu + qx.OO.C_UNIT_TYPE_AUTO] = false;
    pp[cu + qx.OO.C_UNIT_TYPE_FLEX] = false;

    var unitDetectionKey = qx.OO.C_UNITDETECTION + qx.lang.String.toFirstUp(p.unitDetection);
  };

  // apply default value
  pp[valueKey] = p.defaultValue;

  // building getFoo(): Returns current stored value
  pp[qx.OO.C_GET + p.method] = function() {
    return this[valueKey];
  };

  // building forceFoo(): Set (override) without do anything else
  pp[qx.OO.C_FORCE + p.method] = function(newValue) {
    return this[valueKey] = newValue;
  };

  // building resetFoo(): Reset value to default value
  pp[qx.OO.C_RESET + p.method] = function() {
    return this[qx.OO.C_SET + p.method](p.defaultValue);
  };

  // building toggleFoo(): Switching between two boolean values
  if (p.type === qx.Const.TYPEOF_BOOLEAN)
  {
    pp[qx.OO.C_TOGGLE + p.method] = function(newValue) {
      return this[qx.OO.C_SET + p.method](!this[valueKey]);
    };
  };

  if (p.allowMultipleArguments || p.hasConvert || p.hasInstance || p.hasClassName || p.hasPossibleValues || p.hasUnitDetection || p.addToQueue || p.addToQueueRuntime || p.addToStateQueue)
  {
    // building setFoo(): Setup new value, do type and change detection, converting types, call unit detection, ...
    pp[qx.OO.C_SET + p.method] = function(newValue)
    {
      // convert multiple arguments to array
      if (p.allowMultipleArguments && arguments.length > 1) {
        newValue = qx.lang.Array.fromArguments(arguments);
      };

      // support converter methods
      if (p.hasConvert)
      {
        try
        {
          newValue = p.convert.call(this, newValue, p);
        }
        catch(ex)
        {
          throw new Error("Attention! Could not convert new value for " + p.name + ": " + newValue + ": " + ex);
        };
      };

      var oldValue = this[valueKey];

      if (newValue === oldValue) {
        return newValue;
      };

      if (!(p.allowNull && newValue == null))
      {
        if (p.hasType && typeof newValue !== p.type) {
          return this.error("Attention! The value \"" + newValue + "\" is an invalid value for the property \"" + p.name + "\" which must be typeof \"" + p.type + "\" but is typeof \"" + typeof newValue + "\"!", qx.OO.C_SET + p.method);
        };

        if (p.hasInstance && !(newValue instanceof qx.OO.classes[p.instance])) {
          return this.error("Attention! The value \"" + newValue + "\" is an invalid value for the property \"" + p.name + "\" which must be an instance of \"" + p.instance + "\"!", qx.OO.C_SET + p.method);
        };

        if (p.hasClassName && newValue.classname != p.classname) {
          return this.error("Attention! The value \"" + newValue + "\" is an invalid value for the property \"" + p.name + "\" which must be an object with the classname \"" + p.classname + "\"!", qx.OO.C_SET + p.method);
        };

        if (p.hasPossibleValues && newValue != null && !qx.lang.Array.contains(p.possibleValues, newValue)) {
          return this.error("Failed to save value for " + p.name + ". '" + newValue + "' is not a possible value!", qx.OO.C_SET + p.method);
        };
      };

      // Allow to check and transform the new value before storage
      if (this[checkKey])
      {
        try
        {
          newValue = this[checkKey](newValue, p);

          // Don't do anything if new value is indentical to old value
          if (newValue === oldValue) {
            return newValue;
          };
        }
        catch(ex)
        {
          return this.error("Failed to check property " + p.name + ": " + ex, checkKey);
        };
      };

      // Store new value
      this[valueKey] = newValue;

      // Check if there is a modifier implementation
      if (this[modifyKey])
      {
        try
        {
          var r = this[modifyKey](newValue, oldValue, p);
          if (!r) {
            return this.error("Modification of property \"" + p.name + "\" failed without exception (" + r + ")", modifyKey);
          };
        }
        catch(ex)
        {
          return this.error("Modification of property \"" + p.name + "\" failed with exception (" + ex + ")", modifyKey);
        };
      };

      // Unit detection support
      if (p.hasUnitDetection) {
        this[unitDetectionKey](p, newValue);
      };

      // Auto queue addition support
      if (p.addToQueue) {
        this.addToQueue(p.name);
      }
      else if (p.addToQueueRuntime) {
        this.addToQueueRuntime(p.name);
      };

      // Auto state queue addition support
      if (p.addToStateQueue) {
        this.addToStateQueue();
      };

      // Create Event
      if (this.hasEventListeners && this.hasEventListeners(changeKey))
      {
        try
        {
          this.createDispatchDataEvent(changeKey, newValue);
        }
        catch(ex)
        {
          throw new Error("Property " + p.name + " modified: Failed to dispatch change event: " + ex);
        };
      };

      return newValue;
    };
  }
  else
  {
    // building setFoo(): Setup new value, do type and change detection, converting types, call unit detection, ...
    pp[qx.OO.C_SET + p.method] = function(newValue)
    {
      // this.debug("Fast Setter: " + p.name);

      var oldValue = this[valueKey];

      if (newValue === oldValue) {
        return newValue;
      };

      if (!(p.allowNull && newValue == null))
      {
        if (p.hasType && typeof newValue !== p.type) {
          return this.error("Attention! The value \"" + newValue + "\" is an invalid value for the property \"" + p.name + "\" which must be typeof \"" + p.type + "\" but is typeof \"" + typeof newValue + "\"!", qx.OO.C_SET + p.method);
        };
      };

      // Allow to check and transform the new value before storage
      if (this[checkKey])
      {
        try
        {
          newValue = this[checkKey](newValue, p);

          // Don't do anything if new value is indentical to old value
          if (newValue === oldValue) {
            return newValue;
          };
        }
        catch(ex)
        {
          return this.error("Failed to check property " + p.name + ": " + ex, checkKey);
        };
      };

      // Store new value
      this[valueKey] = newValue;

      // Check if there is a modifier implementation
      if (this[modifyKey])
      {
        try
        {
          var r = this[modifyKey](newValue, oldValue, p);
          if (!r) {
            return this.error("Modification of property \"" + p.name + "\" failed without exception (" + r + ")", modifyKey);
          };
        }
        catch(ex)
        {
          return this.error("Modification of property \"" + p.name + "\" failed with exception (" + ex + ")", modifyKey);
        };
      };

      // Create Event
      if (this.hasEventListeners && this.hasEventListeners(changeKey))
      {
        var vEvent = new qx.event.types.DataEvent(changeKey, newValue, oldValue, false);

        vEvent.setTarget(this);

        try
        {
          this.dispatchEvent(vEvent, true);
        }
        catch(ex)
        {
          throw new Error("Property " + p.name + " modified: Failed to dispatch change event: " + ex);
        };
      };

      return newValue;
    };
  };

  // building user configured get alias for property
  if (typeof p.getAlias === qx.Const.TYPEOF_STRING) {
    pp[p.getAlias] = pp[qx.OO.C_GET + p.method];
  };

  // building user configured set alias for property
  if (typeof p.setAlias === qx.Const.TYPEOF_STRING) {
    pp[p.setAlias] = pp[qx.OO.C_SET + p.method];
  };
};

Function.prototype.changeProperty = Function.prototype._createProperty;

Function.prototype.addProperty = function(p)
{
  qx.OO.propertyNumber++;

  this._createProperty(p);

  // add property to (all) property list
  if (typeof this.prototype._properties !== qx.Const.TYPEOF_STRING) {
    this.prototype._properties = p.name;
  } else {
    this.prototype._properties += qx.Const.CORE_COMMA + p.name;
  };

  // add property to object property list
  switch(p.type)
  {
    case undefined:
    case qx.Const.TYPEOF_OBJECT:
    case qx.Const.TYPEOF_FUNCTION:
      if (typeof this.prototype._objectproperties !== qx.Const.TYPEOF_STRING) {
        this.prototype._objectproperties = p.name;
      } else {
        this.prototype._objectproperties += qx.Const.CORE_COMMA + p.name;
      };
  };
};
