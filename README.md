bootstrapped-webapi-skeleton
============================

This is a skeleton Firefox bootstrapped add-on that shows how to expose a new API to web content.  It is a bootstrapped version of Alexandre Poirot's [How to Write a New WebAPI in Firefox](http://blog.techno-barje.fr/post/2013/02/14/how-to-write-a-webapi/), which shows how to write a non-bootstrapped add-on that follows https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Adding_APIs_to_the_navigator_object.

This skeleton is easy to rapidly prototype with since, unlike Alexandre's example, the bootstrapped version can be enabled, disabled, and re-installed without restarting Firefox.  The skeleton should work with both Firefox for Desktop and Firefox for Android (Fennec).

What it does
============

The add-on simply exposes `navigator.bootstrappedWebAPI` to web content.  At the moment, there is a single `bootstrappedWebAPI.require` function exposed, which just logs to the console.

How to make it your own
=======================

You can change the API name by editing `WebAPI.navigatoryProperty`.  You can modify what `boostrappedWebAPI` itself exposes by editing the return value of `WebAPI.prototype.init`.  And finally, you can change the exposed API (`bootstrappedWebAPI.require`) in the same place.

Acknowledgements
================

* Nick Alexander ([@ncalexander](https://twitter.com/ncalexander))

  Wrote the original add-on.

* Alexandre Poirot ([@TechnoBarje](https://twitter.com/TechnoBarje))

  Wrote the blog post that informed me that this was even possible.

The chrome registration closely follows that developed for the [Fennec Bootstrapper](https://github.com/ncalexan/fennec-bootstrapper).
