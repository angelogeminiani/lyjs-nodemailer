(function () {

    'use strict';

    // -------------------------------------------------
    //          imports
    // -------------------------------------------------

    var lyForms = require('lyjs-node').forms;
    var engine = require('../engine/engine');

    // -------------------------------------------------
    //          public
    // -------------------------------------------------

    function render(req, res) {
        var options = lyForms.params(req);
        engine.render(options, function(err, data){
            var result = err||data;
            res.send(result);
        });
    }

    function respond(req, res) {
        var options = lyForms.params(req);
        engine.respond(options, function(err, data){
            var result = err||data;
            res.send(result);
        });
    }

    // -------------------------------------------------
    //          export
    // -------------------------------------------------

    var responder = module.exports = exports = {

        respond: respond,

        render: render

    };

}).call(this);