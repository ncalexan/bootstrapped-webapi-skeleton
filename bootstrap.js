// -*- Mode: js2; tab-width: 2; indent-tabs-mode: nil; js2-basic-offset: 2; js2-skip-preprocessor-directives: t; -*-
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global Components */

let Cc = Components.classes;
let Ci = Components.interfaces;
let Cu = Components.utils;
let Cm = Components.manager;

Cu.import("resource://gre/modules/Services.jsm"); /*global Services */
Cu.import("resource://gre/modules/XPCOMUtils.jsm"); /*global XPCOMUtils */
Cu.import("resource://gre/modules/FileUtils.jsm"); /*global FileUtils */

let LOG_TAG = "Bootstrapped WebAPI";

function dump(msg) {
  Services.console.logStringMessage(LOG_TAG + " :: " + msg);
}

/* WebAPI */

function WebAPI() {}

WebAPI.prototype = {
  // This will expose navigator.bootstrappedWebAPI to web content.
  navigatorProperty: "bootstrappedWebAPI",

  classDescription: "Bootstrapped WebAPI",

  // XPCOMUtils.generateNSGetFactory expects this attribute to be defined.
  classID: Components.ID("{20bf1550-64b8-11e2-bcfd-0800200c9a78}"),

  contractID: "@mozilla.org/webapi-example;1",

  QueryInterface: XPCOMUtils.generateQI([
    Ci.nsIDOMGlobalPropertyInitializer
  ]),

  factory: {
    createInstance: function (aOuter, aIID) {
      return (new WebAPI()).QueryInterface(aIID);
    }
  },

  init: function init(win) {
    dump("WebAPI.init");

    // The `init` method can return an object that will be the one exposed as
    // `navigator.webapi`. This object will be created for each web document.
    return {
      require: function (url) {
        dump("WebAPI.require: " + url);
      },
      // Special internal attribute used to define which property the website
      // will be able to access. Only attribute whose name is specified here
      // are going to be accessible by the page.
      // https://wiki.mozilla.org/XPConnect_Chrome_Object_Wrappers
      __exposedProps__: {
        require: 'r'
      }
    };
  }
};

if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([WebAPI]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([WebAPI]);

/* XPCOM registration.

This does the equivalent of the following `chrome.manifest` file:

component {20bf1550-64b8-11e2-bcfd-0800200c9a78} webapi.js
contract @mozilla.org/webapi-example;1 {20bf1550-64b8-11e2-bcfd-0800200c9a78}
category JavaScript-navigator-property webapi @mozilla.org/webapi-example;1

Except it does this in a bootstrap-friendly way.
*/

/**
 * Register the component.
 */
function registerComponent(proto) {
  let registrar = Cm.QueryInterface(Ci.nsIComponentRegistrar);
  registrar.registerFactory(proto.classID, proto.classDescription, proto.contractID, proto.factory);

  let manager = Cc["@mozilla.org/categorymanager;1"]
      .getService(Ci.nsICategoryManager);
  manager.addCategoryEntry("JavaScript-navigator-property",
      proto.navigatorProperty, proto.contractID, false, true);

  dump("registered component");
}

/**
 * Unregister the component.
 */
function unregisterComponent(proto) {
  let registrar = Cm.QueryInterface(Ci.nsIComponentRegistrar);
  registrar.unregisterFactory(proto.classID, proto.factory);

  let manager = Cc["@mozilla.org/categorymanager;1"]
      .getService(Ci.nsICategoryManager);
  manager.deleteCategoryEntry("JavaScript-navigator-property", proto.navigatorProperty, false);

  dump("unregistered component");
}

/* Bootstrap Interface */

function startup(aData, aReason) {
  dump("startup");

  registerComponent(WebAPI.prototype);
}

function shutdown (aData, aReason) {
  dump("shutdown");

  unregisterComponent(WebAPI.prototype);
}

function install (aData, aReason) {
  dump("install");
}

function uninstall (aData, aReason) {
  dump("uninstall");
}
