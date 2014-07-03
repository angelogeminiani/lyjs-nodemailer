/**
 * Generic default configuration.
 * Custom mailman uses custon configurations.
 */
(function () {


    'use strict';

    // -------------------------------------------------
    //          imports
    // -------------------------------------------------

    // -------------------------------------------------
    //          public
    // -------------------------------------------------

    // -------------------------------------------------
    //          export
    // -------------------------------------------------

    var config = module.exports = exports = {

        from: 'Fred Foo <foo@blurdybloop.com>',

        smtp: {
            service: "Gmail",
            auth: {
                user: "xxx",
                pass: "xxx"
            }
        }

    };


}).call(this);