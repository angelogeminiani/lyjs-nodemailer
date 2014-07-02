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

        from: 'NoReply Mirabilandia <noreplay@mirabilandia.it>',

        smtp: {
            service: "Gmail",
            auth: {
                user: "node.mailman@gmail.com",
                pass: "qazwsx098password"
            }
        }

    };


}).call(this);