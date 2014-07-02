/**
 * Mailer.
 *
 * Dependencies:
 * - lyjs-node
 * - swig
 * - nodemailer
 *
 */
(function(){

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

    var mailer = module.exports = exports = {

        //-- http API --//
        api: require('./api/index'),

        //-- mailman engine --//
        engine: require('./engine/engine')

    };
}).call(this);