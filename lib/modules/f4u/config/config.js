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

        from: 'f4u No Reply <f4u@sphinner.com>',

        smtp: {
            service: "smtp.sphinner.com",
            host: "smtp.sphinner.com",
            port: 25,
            auth: {
                user: "f4u@sphinner.com",
                pass: "hui8FHG6"
            }
        }

    };


}).call(this);