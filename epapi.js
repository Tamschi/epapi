/*

    EndPwn "API"

    Copyright 2018 EndPwn Project

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    DO NOT EDIT THIS FILE! Your bootstrap may overwrite changes to it, and you will lose your work!
    EndPwn3 users: You can prevent this by creating a file in the same directory named DONTUPDATE

    https://github.com/endpwn/

*/

function evaluate(str, exportsR) {
    var exports = {};
    var ret = eval(str);
    if (exportsR) Object.assign(exportsR, exports);
    return ret;
}

(() => {

    var internal = {

        print: function (t) {
            console.log(`%c[EPAPI]%c ${t}`, 'font-weight:bold;color:#0cc', '');
        },

        warn: function (t, e) {
            if (typeof (e) == 'undefined') e = ''; else e = ':\n\n' + e;
            console.warn(`%c[EPAPI]%c ${t}`, 'font-weight:bold;color:#0cc', '', e);
        },

        error: function (e, t) {
            if (typeof (t) == 'undefined') t = 'uncaught exception';
            console.error(`%c[EPAPI]%c ${t}:\n\n`, 'font-weight:bold;color:#0cc', '', e);
        },

        alert: function (b, t) {
            if (typeof (t) == 'undefined') t = 'EPAPI'; else t = 'EPAPI: ' + t;
            try {
                wc.findFunc('e.onConfirmSecondary')[1].exports.show({ title: t, body: b });
            } catch (e2) {
                internal.error(e2, "Error occurred while attempting to pop the standard dialog box, falling back to alert()");
                alert(b, t);
            }
        },

        crashed: 0,

        crash: function (e) {
            internal.error(e, 'Fatal error!');
            if (!internal.crashed) {
                internal.crashed = 1;
                if (internal.brand) {
                    internal.setSigmaColor('#f00');
                }
                internal.alert('A fatal error occurred in EPAPI.\n\nThis usually means there is a bug in EPAPI or your bootstrap. It can also mean that Discord updated, breaking something important.\n\nCheck the console for details.\n\nIf you don\'t know what this means, contact your bootstrap maintainer.', 'Fatal error!');
            }
        },

        setwordmark: function (html) {
            try {
                return document.querySelector('[class*="wordmark"]').innerHTML = html;
            }
            catch (e) { }
        },

        setSigmaColor: function (color) {
            setTimeout(() => internal.setwordmark(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="${color}" d="M0,0L13,0L13,2L3,2L8,7.5L3,13L13,13L13,15L0,15L0,13L5,7.5L0,2L0,0Z"/></svg>`), 2000);
        },

        // document-level events (internal)
        events: {

            // dispatched whenever Discord's internal event system dispatches an event
            discordNativeEvent: function (e) {
                return new CustomEvent('ep-native', { detail: e });
            },

            // dispatched whenever EPAPI is done initializing and loading plugins
            onReady: function () {
                return new Event('ep-ready');
            },

            // dispatched during early init, to signal that at least the global namespace is ready
            // intended for use by bootstraps
            onPrepared: function () {
                return new Event('ep-prepared');
            },

            // dispatched whenever the user changes channel/guild in the ui
            onChannelChange: function (e) {
                return new CustomEvent('ep-onchannelchange', { detail: e.detail });
            },

            // dispatched whenever any message is received by the client
            onMessage: function (e) {
                return new CustomEvent('ep-onmessage', { detail: e.detail });
            },

            // dispatched whenever a message is received in the channel that the user is currently viewing
            onChannelMessage: function (e) {
                return new CustomEvent('ep-onchannelmessage', { detail: e.detail });
            }

        },

        // stuff asarpwn's i.js and main.js used to handle
        prepare: async function () {

            internal.print('loading RapidDOM...');
            evaluate(await (await fetch('https://endpwn.github.io/rapiddom/rapiddom.js?_=' + Date.now())).text());

            // undefine config and settings if running in lite mode and dont deal with require()
            if (internal.lite) {
                exports.config = undefined;
            }
            else {

                // mutant hybrid require() for maximum compatibility, always defined now because some bootstraps have bad implementations
                internal.print('defining require...');
                //if (typeof (require) == "undefined") {
                var r = DiscordNative.nativeModules.requireModule("discord_/../electron").remote.require;
                window.require = m => {
                    try {
                        return DiscordNative.nativeModules.requireModule("discord_/../" + m);
                    }
                    catch (e) {
                        return r(m);
                    }
                };
                //}

                // here we import and define some stuff that usually gets defined by the bootstrap, just in case
                internal.print('requiring necessary modules...');
                window.electron = require('electron').remote;
                window.app = electron.app;
                window.fs = require("original-fs");

                // kinclude executes a file directly in the context of the page
                window.kinclude = function (p) {
                    return evaluate(fs.readFileSync(p, 'utf8').toString());
                }

                // krequire is a reimplementation of require(), only intended for loading plugins
                window.krequire = function (p) {
                    var exports = {};
                    evaluate(fs.readFileSync($api.data + '/plugins/' + p + (p.endsWith('.js') ? '' : '.js'), 'utf8').toString(), exports);
                    return exports;
                }

            }

            window.kparse = function (p) {
                var exports = {};
                evaluate(p, exports);
                return exports;
            }

            // this part sets up webcrack, which is a very important part of EPAPI -- credit to bootsy
            internal.print('initializing webcrack...');
            webpackJsonp([1e3], { webcrack_ver01_xyzzy: function (n, b, d) { mArr = d.m, mCac = d.c, mCar = [], Object.keys(mCac).forEach(function (n) { mCar[n] = mCac[n] }), findFunc = function (n) { results = []; if ("string" == typeof n) mArr.forEach(function (r, t) { -1 !== r.toString().indexOf(n) && results.push(mCac[t]) }); else { if ("function" != typeof n) throw new TypeError("findFunc can only find via string and function, " + typeof n + " was passed"); mArr.forEach(function (r, e) { n(r) && results.push(mCac[e]) }) } return results }, findCache = function (n) { if (results = [], "function" == typeof n) mCar.forEach(function (r, t) { n(r) && results.push(r) }); else { if ("string" != typeof n) throw new TypeError("findCache can only find via function or string, " + typeof n + " was passed"); mCar.forEach(function (r, t) { if ("object" == typeof r.exports) for (p in r.exports) if (p == n && results.push(r), "default" == p && "object" == typeof r.exports["default"]) for (p in r.exports["default"]) p == n && results.push(r) }) } return results }, window.wc = { get: d, modArr: mArr, modCache: mCac, modCArr: mCar, findFunc: findFunc, findCache: findCache } } }); webpackJsonp([1e3], "", ["webcrack_ver01_xyzzy"]);

            internal.print('defining helper functions...');

            // shorthand methods that are used internally and in many plugins, maintained for compatibility and convenience
            window.$listen = (e, c) => {
                var listener = {
                    name: e,
                    callback: function () {
                        try {
                            c.apply(null, arguments);
                        }
                        catch (e) {
                            internal.error(e, 'An event listener threw an exception');
                        }

                    },
                    unregister: function () {
                        document.removeEventListener(this.name, this.callback);
                    }
                }
                document.addEventListener(listener.name, listener.callback);
                return listener;
            };
            window.$dispatch = e => document.dispatchEvent(e);
            window.$purge = e => {
                internal.warn('$purge() is deprecated, use HTMLElement.purge() instead');
                e.innerHTML = '';
            };
            window.$_ = function (e, c, t, i) {
                internal.warn('$_() is deprecated, use createElement() and RapidDOM instead');
                var elm = document.createElement(e);
                if (typeof (c) != 'undefined') {
                    elm.className = c;
                    if (typeof (t) != 'undefined') {
                        elm.innerText = t;
                        if (typeof (i) != 'undefined') {
                            elm.id = i;
                        }
                    }
                }
                return elm;
            };
            window.$chan = exports.ui.getCurrentChannel;
            window.$guild = exports.ui.getCurrentGuild;
            window.$me = exports.internal.getId;

            // expose EPAPI as $api, which is what most plugins expect it to be known as
            window.$api = exports;

            // extension methods used in some older plugins, maintained for compatibility
            String.prototype.replaceAll = function (search, replacement) { return this.split(search).join(replacement) };
            Array.prototype.contains = function (s) { return this.indexOf(s) != -1 };

            // derive the date of creation from a discord snowflake id
            Date.fromSnowflake = (id) => new Date((id / 4194304) + 1420070400000);

        },

        // set everything up and load plugins
        init: function () {
            if ($(".guilds-wrapper .guilds") != null ? $(".guilds-wrapper .guilds").children.length > 0 : 0) {
                try {
                    if (exports.localStorage.get('safemode')) {
                        internal.print('running in safe mode, aborting late-init and informing the user');
                        exports.localStorage.remove('safemode');
                        internal.setSigmaColor('#ff0');
                        internal.alert('EPAPI is running in safe mode. No plugins have been loaded and internal Discord data structures have been left unmodified.', 'Safe Mode');
                        return;
                    }
                    exports.localStorage.remove('safemode');

                    // actually start initializing...
                    internal.print('Discord ready, initializing...')

                    // number of broken plugins
                    var warning = 0;

                    // use the ep-native event to dispatch other events
                    $listen('ep-native', (e) => {
                        switch (e.detail.type) {
                            case 'MESSAGE_CREATE':
                                $dispatch(internal.events.onMessage(e));
                                break;
                            case 'CHANNEL_SELECT':
                                $dispatch(internal.events.onChannelChange(e));
                                break;
                        }
                    });

                    // ep-onchannelmessage is like ep-onmessage, except it only fires when the user is currently viewing the channel the message originates from
                    $listen('ep-onmessage', e => {
                        if (e.detail.channel_id == $chan()) {
                            $dispatch(internal.events.onChannelMessage(e));
                        }
                    });

                    // register an event with discord's internal event system
                    internal.print('registering Discord event handler...');
                    window.__logAllInternalEvents = false;
                    exports.internal.dispatcher.default.register(e => {
                        if (!internal.crashed) {
                            if (window.__logAllInternalEvents) {
                                console.log(e.type + '\n', e);
                            }
                            try {
                                $dispatch(internal.events.discordNativeEvent(e));
                            }
                            catch (e) {
                                internal.crash(e);
                            }
                        }
                    });

                    // hook the discord internal event system
                    // TODO: registering with the event system is no longer necessary, we should probably unify this with the above chunk of code
                    exports.internal.dispatcher.default.dispatch_original = exports.internal.dispatcher.default.dispatch;
                    exports.internal.dispatcher.default.dispatch = function (e) {
                        internal.hooks.filter(x => x.type == e.type).forEach(x => x.callback(e));
                        exports.internal.dispatcher.default.dispatch_original(e);
                    }

                    // add our avatar -- credit to block for finding this method
                    wc.findFunc("clyde")[0].exports.BOT_AVATARS.EndPwn = "https://cdn.discordapp.com/avatars/350987786037493773/ae0a2f95898cfd867c843c1290e2b917.png";

                    // dont try loading plugins in lite mode
                    if (internal.lite) {

                    }
                    else {

                        // load styles
                        if (fs.existsSync(exports.data + '/styles')) {
                            fs.readdirSync(exports.data + '/styles').forEach(x => {
                                internal.print('loading /styles/' + x);
                                if (x.endsWith('.css')) {
                                    var style = document.createElement("style");
                                    style.type = "text/css";
                                    style.innerHTML = fs.readFileSync(exports.data + '/styles/' + x).toString();
                                    document.head.appendChild(style);
                                }
                            });
                        }

                        // load plugins...
                        if (fs.existsSync(exports.data + '/plugins')) {
                            fs.readdirSync(exports.data + '/plugins').forEach(x => {
                                if (x.endsWith('.js')) {
                                    try {
                                        var plugin = krequire(x);
                                        if (plugin.start !== undefined) {
                                            internal.print('loading /plugins/' + x);
                                            plugin.start();
                                        } else {
                                            internal.print('/plugins/' + x + ' does not export start(), ignoring...');
                                        }
                                    }
                                    catch (e) {
                                        internal.error(e, x + ' failed to initialize properly');
                                        warning++;
                                    }
                                }
                            });
                        }

                        // execute autoruns...
                        if (fs.existsSync(exports.data + '/autorun')) {
                            fs.readdirSync(exports.data + '/autorun').forEach(x => {
                                if (x.endsWith('.js')) {
                                    try {
                                        internal.print('executing /autorun/' + x);
                                        kinclude(exports.data + '/autorun/' + x);
                                    }
                                    catch (e) {
                                        internal.error(e, x + ' failed to execute properly');
                                        warning++;
                                    }
                                }
                            });
                        }

                    }

                    setTimeout(() => {
                        if (window.jQuery)
                            internal.crash('EndPwn is not compatible with jQuery');
                    }, 2000);

                    // display a message if any plugins failed to load
                    if (warning)
                        internal.alert(`${warning} file${warning > 1 ? 's' : ''} failed to load. Check the console for details.`, 'Plugin failure');

                    // print the about message to the console
                    if (!internal.silent)
                        exports.about();

                    // dispatch the ep-ready event, we're all done here
                    $dispatch(internal.events.onReady());
                }
                catch (ex) {
                    internal.crash(ex);
                }
            } else {
                // discord isnt ready, wait a bit and try again
                internal.print('Discord not ready, waiting 1 second...');
                setTimeout(arguments.callee, 1000);
            }
        },

        hooks: []

    }

    exports = {

        // new version data
        version: {

            major: 5,
            minor: 6,
            revision: 43,   // TODO: find a better way of incrementing/calculating the revision; the current way is fucking ridiculous (manually editing)

            toString: function () {
                return `v${this.major}.${this.minor}.${this.revision}`;
            }

        },

        // the first ever export added to epapi, originally as a test -- kept in mainline because i havent had the heart to remove it
        xyzzy: 'Nothing happened.',

        // display info
        // ugly code, should probably be made prettier at some point
        // oh no i made it even uglier
        about: function () {
            if (internal.lite) {
                console.log('%cΣndPwnᴸᴵᵀᴱ', 'font-size:48px;font-family:sans-serif');
                console.log(`EPAPI ${this.version}\nhttps://endpwn.github.io/\nhttps://discord.gg/8k3gEeE`);
            }
            else
                console.log(`%cΣndPwn%c
${this.bootstrap.name ? this.bootstrap.name : 'unknown'}${this.bootstrap.version ? ` ${this.bootstrap.version}` : ''}${this.bootstrap.method ? ` (${this.bootstrap.method})` : ''}
EPAPI ${this.version}${window.crispr ? `, CRISPR ${window.crispr.version}` : ''}
https://endpwn.github.io/
https://discord.gg/8k3gEeE`,
                    'background:linear-gradient(to bottom right,#0ff,#f0f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:48px;font-family:sans-serif', '');
        },

        // get the lite status
        get lite() {
            return internal.lite;
        },

        /*
        
            entrypoint arguments:
        
                bootstrap (object): bootstrap properties
                                    keys:
                                        name (string):                  name of bootstrap
                                        version (string or object):     version of bootstrap
                                        method (string):                name of stage 1 method in use
                                        lite (bool):                    disables node dependence (for web browsers)
                                        silent (bool):                  dont display about() after initialization
                                        brand (bool):                   enables the sigma wordmark replacement
                                        secure (bool):                  enables security features like permissions
    
                                    all keys are optional, boolean values are assumed false if not provided
            
            please do not call this method unless you are a bootstrap
        
        */
        go: async function (bootstrap, silent, brand, lite) {

            if (location.hostname.indexOf('discordapp') == -1 && location.hostname.indexOf('dr1ft.xyz') == -1) return;

            try {
                internal.print('starting up...')

                // figure out which calling convention is being used
                switch (typeof bootstrap) {

                    // new bootstrap using bootstrap properties object instead of separate arguments
                    case 'object':
                        exports.bootstrap = bootstrap;
                        internal.lite = bootstrap.lite ? true : false;
                        internal.silent = bootstrap.silent ? true : false;
                        internal.brand = bootstrap.brand ? true : false;
                        break;

                    // older bootstrap
                    case 'string':
                        exports.bootstrap = {
                            name: bootstrap
                        };
                        internal.lite = lite ? true : false; // dont use node integration
                        internal.silent = silent ? true : false;
                        internal.brand = brand ? true : false;
                        break;

                    // really old bootstrap, or the bootstrap is doing something stupid we dont expect
                    default:
                        if (window._epmethod === undefined) {
                            exports.method = 'unknown';
                        } else {
                            exports.method = _epmethod;
                        }
                        break;

                }
                internal.print('detected calling convention');

                // prepare the global namespace
                internal.print('preparing the global namespace...');
                await internal.prepare();

                // dispatch ep-prepared to let the bootstrap know that the global namespace is ready
                $dispatch(internal.events.onPrepared());

                if (!internal.lite) {
                    // determine the root path where plugins and files will be found
                    exports.data = app.getPath('userData').replace(/\\/g, "/") + '/';
                    internal.print('data path ' + exports.data);

                    // icon by toxoid49b, tweaked by me
                    if (internal.brand) {
                        internal.setSigmaColor('#0ff');
                    }
                }

                // start trying to init
                internal.print('starting init loop...');
                setTimeout(internal.init, 0);

                // undefine the entrypoint to avoid getting double-called
                delete exports.go;
            }
            catch (ex) {
                // something bad happened, undefine $api and display a message
                internal.crash(ex);
            }

        },

        // methods for committing data to settings.json
        settings: {

            // get a value in the settings.json object
            get: function (k) {
                if (internal.lite)
                    internal.warn('Something tried retrieving data from settings.json, but we are running in lite mode! Returning undefined...');
                else
                    return JSON.parse(fs.readFileSync(exports.data + '/settings.json', 'utf8'))[k];
            },

            // set a value in the settings.json object
            set: function (k, v) {
                if (internal.lite) {
                    internal.warn('Something tried putting data into settings.json, but we are running in lite mode! Doing nothing...');
                }
                else {
                    var o = JSON.parse(fs.readFileSync(exports.data + '/settings.json', 'utf8'));
                    o[k] = v;
                    fs.writeFileSync(exports.data + '/settings.json', JSON.stringify(o, null, 2));
                    return v;
                }
            }

        },

        // localStorage stuff
        localStorage: {

            // get a value from localStorage
            get: function (k) {
                return exports.internal.objectStorage.impl.get(k);
            },

            // set a value in localStorage
            set: function (k, v) {
                return exports.internal.objectStorage.impl.set(k, v);
            },

            // remove a value from localStorage
            remove: function (k) {
                return exports.internal.objectStorage.impl.remove(k);
            }

        },

        // utility functions
        util: {

            // BUG: wrap and its sister function both fuck things up that use `this`
            //      i know exactly why this happens, but not the slightest clue how to fix it
            //      manual wrapping is necessary in some cases because of this
            //
            //      trying to use these on any function that uses `this` will fuck that function
            //      dont do it

            // intercept a function's arguments
            wrap: function (target1, callback) {

                // for security; we're evaluating an untrusted expression in the local scope here
                var internal = {};

                // get the original function
                var orig = evaluate(target1);

                // the stub we will overwrite the function with
                function stub() {

                    // what we will pass to the original function
                    var args;

                    try {
                        // call the wrapper and get our args
                        args = callback.apply(null, arguments);
                    }
                    catch (e) {
                        internal.error(e, 'A function wrapper threw an exception');

                        // dont completely break the function if there's a flaw in the wrapper
                        args = arguments;
                    }

                    // returning undefined results in the function call being suppressed
                    if (typeof (args) != 'undefined') {
                        // call the original function
                        return orig.apply(null, args)
                    }

                }

                stub.original = orig;
                stub.callback = callback;
                callback = callback.bind(stub);

                // do the overwriting thing
                eval(`${target1}=stub`);

            },

            // intercept a function's return value
            wrapAfter: function (target1, callback) {

                var internal = {};

                // get the original function
                var orig = evaluate(target1);

                // the stub we will overwrite the function with
                function stub() {

                    // call the original argument
                    var r = orig.apply(null, arguments);

                    try {
                        // call the wrapper and return its return value
                        return callback(r);
                    }
                    catch (e) {
                        internal.error(e, 'A function wrapper threw an exception');

                        // again, dont fuck stuff up if there's a flaw in the wrapper
                        return r;
                    }

                }

                stub.original = orig;
                stub.callback = callback;
                callback = callback.bind(stub);

                // overwrite that shit
                eval(`${target1}=stub`);

            },

            // extended findFunc that automatically narrows down results
            findFuncExports: function (s, e) {
                if (s === undefined) throw Error('must provide a search string');
                if (e === undefined) e = s;
                var results = wc.findFunc(s).filter(x => x !== undefined && x.exports !== undefined && x.exports[e] !== undefined);
                if (results.length == 0)
                    throw Error('findFuncExports() found no matches');
                if (results.length > 1)
                    internal.warn('findFuncExports() found more than one match');
                return results[0].exports;
            },

            findConstructor: function (s, e) {
                if (s === undefined) throw Error('must provide a search string');
                var results = e !== undefined ? wc.findFunc(s).filter(x => x !== undefined && x.exports !== undefined && x.exports[e] !== undefined) : wc.findFunc(s);
                if (results.length == 0)
                    throw Error('findConstructor() found no matches');
                if (results.length > 1)
                    internal.warn('findConstructor() found more than one match');
                return mArr[results[0].i];
            }

        },

        // discord internal modules exposed with webcrack, commented out lines' purposes have been forgotten
        internal: {

            get constants() { return wc.findCache('API_HOST')[0].exports; },
            get dispatcher() { return wc.findCache('Dispatcher').filter(x => x.exports !== undefined && x.exports.Store === undefined && x.exports.default !== undefined)[0].exports; },
            //get evnt() { wc.findFunc('MESSAGE_CREATE')[1].exports },
            get messageUI() { return exports.util.findFuncExports('receiveMessage'); },
            get messageCreation() { return exports.util.findFuncExports('createMessage'); },
            get notification() { return exports.util.findFuncExports('showNotification', 'setTTSType'); },
            //get hguild() { wc.findFunc('leaveGuild')[0].exports },
            //get lguild() { wc.findFunc('markGuildAsRead')[0].exports },
            get objectStorage() { return wc.findCache('ObjectStorage')[0].exports; },
            get user() { return wc.findCache('getUser')[0].exports; },

            getId: () => wc.findCache('getId')[0].exports.getId()

        },

        // discord internal events stuff
        // $api.event.* is has no use outside of epapi internal things
        // as such, it has been moved to an internal object
        events: {

            // $listen('ep-native') without all the fuss
            listen: function (type, callback) {
                if (type === undefined) throw Error('must provide an event type');
                if (callback === undefined) throw Error('must provide a callback');

                return $listen('ep-native', e => {
                    if (e.detail.type == type) {
                        callback(e.detail);
                    }
                });
            },

            // forge an event and dispatch it
            dispatch: function (event) {
                if (event.type === undefined) throw Error('must provide an event type');

                return exports.internal.dispatcher.default.dirtyDispatch(event);
            },

            // intercept and modify an event before it can go anywhere
            hook: function (type, callback) {
                if (type === undefined) throw Error('must provide an event type');
                if (callback === undefined) throw Error('must provide a callback');

                var newHook = {
                    type: type,
                    callback: callback,
                    unregister: () => {
                        var i = internal.hooks.indexOf(newHook);
                        if (i > -1)
                            internal.hooks.splice(i, 1);
                    }
                };

                internal.hooks.push(newHook);
                return newHook;
            }

        },

        // discord api stuff
        discord: {

            // take a wild guess
            rest: async function (method, endpoint, body, c) {

                // the url we will be making our request to
                var url = "https://discordapp.com/api/v6" + endpoint;

                // fetch() options
                var options = {
                    headers: {
                        // get the token from localStorage as our auth header
                        'Authorization': exports.internal.objectStorage.impl.get('token'),
                        'Content-type': 'application/json'
                    },
                    method: method
                };

                // if the body isnt already a string go ahead and stringify it
                if (typeof (body) !== 'string') body = JSON.stringify(body);

                // probably not the best way to handle this
                if (method !== 'GET') options.body = body;

                // fetch
                var r = await fetch(url, options);
                if (!r.ok)
                    throw Error(await r.text());

                // urgh, theyre using callbacks
                if (c !== undefined) {

                    // warn the dev
                    internal.warn("Using callbacks in REST calls is deprecated and may be removed in a future release.");

                    // operate like EPAPI =<5.0
                    c(await r.text());
                }
                else {
                    return await r.json();
                }

            },

            // mark a message read
            ack: function (channel, id) {
                return this.rest('POST', `/channels/${channel}/messages/${id}/ack`);
            },

            sendMessage: function (channel, text) {
                return this.rest('POST', `/channels/${channel}/messages`, { content: text });
            },

            sendEmbed: function (channel, ebd) {
                return this.rest('POST', `/channels/${channel}/messages`, { embed: ebd }
                );
            },

            getGuild: function (id, c) {
                return this.rest('GET', `/guilds/${id}`, '', c ? e => c(JSON.parse(e)) : undefined);
            },

            getChannel: function (id, c) {
                return this.rest('GET', '/channels/' + id, '', c ? e => c(JSON.parse(e)) : undefined);
            },

            getUser: function (id) {
                return exports.internal.user.getUser(id);
            },

            getCurrentUser: function () {
                return exports.internal.user.getCurrentUser();
            },

            getGuildRoles: function (id, c) {
                return this.rest('GET', `/guilds/${id}/roles`, '', c ? e => c(JSON.parse(e)) : undefined);
            },

            getGuildChannels: function (id, c) {
                return this.rest('GET', `/guilds/${id}/channels`, '', c ? e => c(JSON.parse(e)) : undefined);
            },

            getGuildUser: function (guildid, userid, c) {
                return this.rest('GET', `/guilds/${guildid}/members/${userid}`, '', c ? e => c(JSON.parse(e)) : undefined);
            },

            getGuildUsers: function (id, c) {
                return this.rest('GET', `/guilds/${id}/members?limit=1000`, '', c ? e => c(JSON.parse(e)) : undefined);
            }

        },

        // ui stuff, including pulling data from the path for some reason
        ui: {

            // navigate
            transitionTo: function (path) {
                wc.findCache('transitionTo')[0].exports.transitionTo(path);
            },

            // focus discord
            focus: function () {
                electron.getCurrentWindow().focus();
            },

            // pull the channel id from the url
            getCurrentChannel: function () {
                var p = window.location.pathname.split('/');
                return p[p.length - 1];
            },

            // pull the guild id from the url
            getCurrentGuild: function () {
                var p = window.location.pathname.split('/');
                return p[p.length - 2];
            },

            // creates a fake message in the current channel (like clyde)
            fakeMsg: function (t, f) {
                var msg = exports.internal.messageCreation.createMessage(this.getCurrentChannel(), t);
                msg.author.avatar = 'EndPwn'
                msg.author.bot = true;
                msg.author.discriminator = '0000';
                msg.author.id = '1';
                msg.author.username = 'EndPwn';
                msg.state = 'SENT';
                if (typeof (f) != 'undefined') {
                    f(msg);
                }
                exports.internal.messageUI.receiveMessage(this.getCurrentChannel(), msg);
            },

            hideChannels: function () {
                $('[class^="channels"]').style.display = 'none';
            },

            showChannels: function () {
                $('[class^="channels"]').style.display = '';
            },

            hideServers: function () {
                $('.guilds-wrapper').style.display = 'none';
            },

            showServers: function () {
                $('.guilds-wrapper').style.display = '';
            },

            /*hideToolbar: function () {
                $('.topic').style.display = 'none';
                $('.header-toolbar').style.display = 'none';
            },
        
            showToolbar: function () {
                $('.topic').style.display = '';
                $('.header-toolbar').style.display = '';
            },*/

            toggleUsers: function () {
                wc.findFunc('toggleSection')[1].exports.TOGGLE_USERS.action()
            },

            // display a dialog box
            showDialog: function (x) { // for example, $api.ui.showDialog({title: 'Pwnt!', body: 'It works!'})
                exports.util.findFuncExports('e.onConfirmSecondary', 'show').show(x);
            },

            // display a banner at the top of the app
            showNotice: function (text, button) {
                exports.util.findFuncExports('ActionTypes.NOTICE_SHOW', 'show').show("GENERIC", text, button, () => { }, 0);
            },

            // get profile notes for a user
            getNote: function (id) {
                return exports.util.findFuncExports('getNote', '_actionHandlers').getNote(id);
            },



            get focused() {
                return electron.getCurrentWindow().isFocused();
            }

        }

    }

})();