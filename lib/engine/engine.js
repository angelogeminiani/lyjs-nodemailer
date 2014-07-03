/**
 * Mailman engine.
 *
 * sample url:
 * http://dacstudio.sphinner.com/mailman/render?template=default&module=mirabilandia&fullname=mario&email=angelo.geminiani@gmail.com&subject=sub
 *
 * Options:
 *  module: Default='system'
 *  template: Default='default'
 *  lang: Default='base'
 *  subject: Email subject
 *  email: email address
 *  ..... other parameters passed to template engine for rendering
 *
 */
(function () {

    'use strict';

    // -------------------------------------------------
    //          imports
    // -------------------------------------------------

    var ly = require('lyjs-node').ly;
    var lyPath = require('lyjs-node').path;
    var fs = require('fs');
    var swig = require('swig'); // render template
    var nodemailer = require('nodemailer'); // send email

    // -------------------------------------------------
    //          const
    // -------------------------------------------------

    var PATH_MODULES = lyPath.join(__dirname, '../modules');
    var DIR_MODULE_CONFIG = 'config';
    var DIR_MODULE_TEMPLATES = 'templates';

    // -------------------------------------------------
    //          events
    // -------------------------------------------------

    var EVENT_SEND = 'send';
    var EVENT_RENDER = 'render';

    // -------------------------------------------------
    //          public
    // -------------------------------------------------

    /**
     * Constructor. Passing "options" parameter, some default
     * attributes can be override
     * @param options {object} Options to override defaults:
     *  - 'path_modules' {string} : absolute path to modules directory
     * @constructor
     */
    function MailmanEngine(options) {
        // init options, if any
        options = options||{};
        PATH_MODULES = options['path_modules']||PATH_MODULES;

        // add events and invoker functions
        ly.extend(this, require('lyjs-node').Events);
        ly.extend(this, require('lyjs-node').Invoker);
    }

    /**
     * Render a template.
     * Useful for testing a template before start send emails.
     * @param options
     * @param callback
     */
    MailmanEngine.prototype.render = function (options, callback) {
        try {
            options = options || {};
            options['uid'] = options['uid'] || ly.guid();
            options['module'] = options['module'] || 'system';
            options['template'] = options['template'] || 'default';
            options['lang'] = options['lang']||'base';
            // ready to render
            this.invoke(_render, options['module'], options['template'], options, function (err, html) {
                if (!err) {
                    this.invoke(callback, null, html);
                } else {
                    this.invoke(callback, err);
                }
            });
        } catch (err) {
            this.invoke(callback, err.toString());
        }
    };

    MailmanEngine.prototype.send = function (options, callback) {
        this.render(options, function (err, html) {
            if (!err) {
                if (!!html) {
                    this.invoke(_send, html, null, options['module'], options, function (err, response) {
                        if (!err) {
                            this.invoke(callback, null, {success: true, response: response});
                        } else {
                            this.invoke(callback, err);
                        }
                    });
                } else {
                    this.invoke(callback, 'Template "' + options['template'] + '" is empty.');
                }
            } else {
                this.invoke(callback, err);
            }
        });

    };

    // -------------------------------------------------
    //          private
    // -------------------------------------------------

    function doEvent(event_name, data, error, response) {
        var event_data = {
            name: event_name,
            error: error,
            data: data,
            response: response
        };
        this.triggerAsync(event_name, event_data);
    }

    function getTemplatePath(module_name, template_name, lang, callback) {
        var self = this;
        lang=lang||'base';
        var template_path = lyPath.join(PATH_MODULES, module_name, DIR_MODULE_TEMPLATES, template_name, lang + '.html');
        fs.exists(template_path, function(exists){
            if(exists){
                self.invoke(callback, template_path);
            } else {
                // try with base lang
                if(lang!='base'){
                    var base_path = lyPath.join(PATH_MODULES, module_name, DIR_MODULE_TEMPLATES, template_name, 'base.html');
                    fs.exists(base_path, function(exists){
                        if(exists){
                            self.invoke(callback, base_path);
                        } else {
                            self.invoke(callback, lyPath.join(PATH_MODULES, 'system', DIR_MODULE_TEMPLATES, 'default.html'));
                        }
                    });
                } else {
                    self.invoke(callback, lyPath.join(PATH_MODULES, 'system', DIR_MODULE_TEMPLATES, 'default.html'));
                }
            }
        });
        // return lyPath.join(PATH_MODULES, module_name, DIR_MODULE_TEMPLATES, template_name + '.html');
    }

    function getConfigData(module_name) {
        var conf_path = '../modules/' + module_name + '/' + DIR_MODULE_CONFIG + '/config';
        return require(conf_path) || {};
    }

    function _render(module_name, template_name, options, callback) {
        var self = this;
        try {
            self.invoke(getTemplatePath, module_name, template_name, options['lang'], function(file){
                swig.renderFile(file, options, function (err, text) {
                    self.invoke(doEvent, EVENT_RENDER, options, err, text);
                    self.invoke(callback, err, text);
                });
            });
        } catch (err) {
            self.invoke(callback, err.toString());
        }
    }

    function _send(html_message, text_message, module_name, options, callback) {
        var self = this;
        try {
            var config = getConfigData(module_name);
            if (!!config && !!config['smtp']) {
                var smtpTransport = nodemailer.createTransport("SMTP", config['smtp']);

                var to = options['email'];
                var subject = options['subject'] || 'Automatic Response';
                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: config['from'] || '', // sender address
                    to: to, // list of receivers
                    subject: subject, // Subject line
                    generateTextFromHTML: !text_message, // automatic get text
                    text: text_message, // plaintext body
                    html: html_message // html body
                };

                // send mail with defined transport object
                smtpTransport.sendMail(mailOptions, function (err, response) {
                    self.invoke(doEvent, EVENT_SEND, options, err, response);
                    self.invoke(callback, err, response);
                    smtpTransport.close(); // shut down the connection pool, no more messages
                });
            } else {
                self.invoke(callback, 'Missing Configuration file for module "' + module_name + '"');
            }
        } catch (err) {
            self.invoke(callback, err.toString());
        }
    }

    // -------------------------------------------------
    //          exports
    // -------------------------------------------------

    MailmanEngine.init = function(options){
        return new MailmanEngine(options);
    };

    var engine = module.exports = exports = new MailmanEngine();

}).call(this);