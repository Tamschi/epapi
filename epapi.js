/*

    EndPwn "API"

    Copyright 2018 EndPwn Project

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    DO NOT EDIT THIS FILE! Your bootstrap may overwrite changes to it, and you will lose your work!
    EndPwn3 users: You can prevent this by creating a file in the same directory named DONOTUPDATE

    https://github.com/endpwn/

*/

/* below are internal functions and objects, please don't touch them */

const __tag = 'EPAPI'

var __silent;
var __brand;
var __lite;

var __config = {
    data: {},
    load: () => this.data = exports.settings.get('epapi') ? exports.settings.get('epapi') : exports.settings.set('epapi', {}),
    get: k => this.data[k],
    set: (k, v) => {
        this.data[k] = v;
        exports.settings.set('epapi', this.data);
        return v;
    }
};

function __print(t) {
    console.log(`%c[${__tag}]%c ${t}`, 'font-weight:bold;color:#0cc', '');
}

function __warn(t, e) {
    if (typeof (e) == 'undefined') e = ''; else e = ':\n\n' + e;
    console.warn(`%c[${__tag}]%c ${t}${e}`, 'font-weight:bold;color:#0cc', '');
}

function __error(e, t) {
    if (typeof (t) == 'undefined') t = 'uncaught exception';
    console.error(`%c[${__tag}]%c ${t}:\n\n${e}`, 'font-weight:bold;color:#0cc', '');
}

function __alert(b, t) {
    if (typeof (t) == 'undefined') t = 'EPAPI'; else t = 'EPAPI: ' + t;
    try {
        wc.findFunc('e.onConfirmSecondary')[1].exports.show({ title: t, body: b });
    } catch (e2) {
        __error(e2, "Error occurred while attempting to pop the standard dialog box, falling back to alert()");
        alert(b, t);
    }
}

var __crashed = 0;

function __crash(e) {
    __error(e, 'Fatal error!');
    if (!__crashed) {
        __crashed = 1;
        if (__brand) {
            setTimeout(() => __setwordmark('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#f00" d="M0,0L13,0L13,2L3,2L8,7.5L3,13L13,13L13,15L0,15L0,13L5,7.5L0,2L0,0Z"/></svg>'), 2000);
        }
        __alert('A fatal error occurred in EPAPI.\n\nThis usually means there is a bug in EPAPI or your bootstrap. It can also mean that Discord updated, breaking something important.\n\nCheck the console for details.\n\nIf you don\'t know what this means, contact your bootstrap maintainer.', 'Fatal error!');
    }
}

function __setwordmark(html) {
    try {
        return document.querySelector('.wordmark-2L03Wr').innerHTML = html;
    }
    catch (e) { }
}

// stuff asarpwn's i.js and main.js used to handle
function __prepare() {

    // undefine config and settings if running in lite mode and dont deal with require()
    if (__lite) {
        exports.config = undefined;
    }
    else {

        // mutant hybrid require() for maximum compatibility, always defined now because some bootstraps have bad implementations
        __print('defining require...');
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
        __print('requiring necessary modules...');
        window.electron = require('electron').remote;
        window.app = electron.app;
        window.fs = require("original-fs");

        // kinclude executes a file directly in the context of the page
        window.kinclude = function (p) {
            return eval(fs.readFileSync(p, 'utf8').toString());
        }

        // krequire is a reimplementation of require(), only intended for loading plugins
        window.krequire = function (p) {
            var exports = {};
            eval(fs.readFileSync($api.data + '/plugins/' + p + (p.endsWith('.js') ? '' : '.js'), 'utf8').toString());
            return exports;
        }

    }

    window.kparse = function (p) {
        var exports = {};
        eval(p);
        return exports;
    }

    // this part sets up webcrack, which is a very important part of EPAPI -- credit to bootsy
    __print('initializing webcrack...');
    webpackJsonp([1e3], { webcrack_ver01_xyzzy: function (n, b, d) { mArr = d.m, mCac = d.c, mCar = [], Object.keys(mCac).forEach(function (n) { mCar[n] = mCac[n] }), findFunc = function (n) { results = []; if ("string" == typeof n) mArr.forEach(function (r, t) { -1 !== r.toString().indexOf(n) && results.push(mCac[t]) }); else { if ("function" != typeof n) throw new TypeError("findFunc can only find via string and function, " + typeof n + " was passed"); mArr.forEach(function (r, e) { n(r) && results.push(mCac[e]) }) } return results }, findCache = function (n) { if (results = [], "function" == typeof n) mCar.forEach(function (r, t) { n(r) && results.push(r) }); else { if ("string" != typeof n) throw new TypeError("findCache can only find via function or string, " + typeof n + " was passed"); mCar.forEach(function (r, t) { if ("object" == typeof r.exports) for (p in r.exports) if (p == n && results.push(r), "default" == p && "object" == typeof r.exports["default"]) for (p in r.exports["default"]) p == n && results.push(r) }) } return results }, window.wc = { get: d, modArr: mArr, modCache: mCac, modCArr: mCar, findFunc: findFunc, findCache: findCache } } }); webpackJsonp([1e3], "", ["webcrack_ver01_xyzzy"]);

    __print('defining helper functions...');

    // shorthand methods that are used internally and in many plugins, maintained for compatibility and convenience
    window.$listen = (e, c) => document.addEventListener(e, function () {
        try {
            c.apply(null, arguments);
        }
        catch (e) {
            __error(e, 'An event listener threw an exception');
        }

    });
    window.$dispatch = e => document.dispatchEvent(e);
    window.$ = s => document.querySelector(s);
    window.$$ = s => document.querySelectorAll(s);
    window.$purge = e => e.innerHTML = '';
    window.$_ = function (e, c, t, i) {
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

}

// set everything up and load plugins
function __init() {
    if ($(".guilds-wrapper .guilds") != null ? $(".guilds-wrapper .guilds").children.length > 0 : 0) {
        try {
            // actually start initializing...
            __print('Discord ready, initializing...')

            // number of broken plugins
            var warning = 0;

            // use the ep-native event to dispatch other events
            $listen('ep-native', (e) => {
                switch (e.detail.type) {
                    case 'MESSAGE_CREATE':
                        $dispatch(exports.event.onMessage(e));
                        break;
                    case 'CHANNEL_SELECT':
                        $dispatch(exports.event.onChannelChange(e));
                        break;
                }
            });

            // ep-onchannelmessage is like ep-onmessage, except it only fires when the user is currently viewing the channel the message originates from
            $listen('ep-onmessage', e => {
                if (e.detail.channel_id == $chan()) {
                    $dispatch(exports.event.onChannelMessage(e));
                }
            });

            // register an event with discord's internal event system
            __print('registering Discord event handler...');
            exports.internal.dispatcher.default.register(e => {
                if (!__crashed) {
                    try {
                        $dispatch(exports.event.discordNativeEvent(e));
                    }
                    catch (e) {
                        __crash(e);
                    }
                }
            });

            // add our avatar -- credit to block for finding this method
            wc.findFunc("clyde")[0].exports.BOT_AVATARS.EndPwn = "https://cdn.discordapp.com/avatars/350987786037493773/ae0a2f95898cfd867c843c1290e2b917.png";

            // dont try loading plugins in lite mode
            if (__lite) {

            }
            else {

                // load plugins...
                if (fs.existsSync(exports.data + '/plugins')) {
                    fs.readdirSync(exports.data + '/plugins').forEach(x => {
                        if (x.endsWith('.js')) {
                            try {
                                var plugin = krequire(x);
                                if (plugin.start !== undefined) {
                                    __print('loading /plugins/' + x);
                                    plugin.start();
                                } else {
                                    __print('/plugins/' + x + ' does not export start(), ignoring...');
                                }
                            }
                            catch (e) {
                                __error(e, x + ' failed to initialize properly');
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
                                __print('executing /autorun/' + x);
                                kinclude(exports.data + '/autorun/' + x);
                            }
                            catch (e) {
                                __error(e, x + ' failed to execute properly');
                                warning++;
                            }
                        }
                    });
                }

            }

            // display a message if any plugins failed to load
            if (warning) {
                __alert(`${warning} file${warning > 1 ? 's' : ''} failed to load. Check the console for details.`, 'Plugin failure');
            }

            // print the about message to the console
            if (!__silent)
                exports.about();

            // dispatch the ep-ready event, we're all done here
            $dispatch(exports.event.onReady());
        }
        catch (ex) {
            __crash(ex);
        }
    } else {
        // discord isnt ready, wait a bit and try again
        __print('Discord not ready, waiting 1 second...');
        setTimeout(arguments.callee, 1000);
    }
}

/* above are internal functions and objects, please don't touch them */

exports = {

    // new version data
    version: {

        major: 5,
        minor: 3,
        revision: 29,   // TODO:    find a better way of incrementing/calculating the revision; the current way is fucking ridiculous (manually editing)

        toString: function () {
            return `v${this.major}.${this.minor}.${this.revision}`;
        }

    },

    // the first ever export added to epapi, originally as a test -- kept in mainline because i havent had the heart to remove it
    xyzzy: 'Nothing happened.',

    // display info
    about: function () {
        if (__lite) {
            console.log('%cΣndPwnᴸᴵᵀᴱ', 'font-size:48px;font-family:sans-serif');
            console.log(`EPAPI ${this.version}\nhttps://github.com/endpwn/`);
        }
        else
            console.log(`%cΣ${__brand ? 'ndPwn%c\nEPAPI ' : 'PAPI⁵%c\n'}${this.version}, using ${this.method}\nhttps://github.com/endpwn/`, 'background:linear-gradient(to bottom right,#0ff,#f0f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:48px;font-family:sans-serif', '');
    },

    // get the lite status
    get lite() {
        return __lite;
    },

    // config
    config: {

        setBranding: v => __config.set('brand', v),

        setSilent: v => __config.set('silent', v),

    },

    /*
    
        entrypoint arguments:
    
            mthd (string):  the name of your bootstrap
    
            silent (bool):  dont show the about message after completing init
    
            brand (bool):   present self as EndPwn instead of EPAPI V
                            also replaces the Discord wordmark in the top left of the client with the EPAPI/EndPwn logo
        
        please do not call this method unless you are a bootstrap
    
    */
    go: function (mthd, silent, brand, lite) {
        try {
            __print('starting up...')

            // dont use node integration
            __lite = lite ? true : false;

            // prepare the global namespace
            __print('preparing the global namespace...');
            __prepare();

            // dispatch ep-prepared to let the bootstrap know that the global namespace is ready
            $dispatch(exports.event.onPrepared());

            if (!__lite) {
                // determine the root path where plugins and files will be found
                exports.data = app.getPath('userData').replace(/\\/g, "/") + '/';
                __print('data path ' + exports.data);

                // load the epapi config
                __config.load();

                // dont display about()
                __silent = __config.get('silent');
                __silent = __silent === undefined ? silent : __silent;

                // brand the client as endpwn
                __brand = __config.get('brand');
                __brand = __brand === undefined ? brand : __brand;

                // icon by toxoid49b, tweaked by me
                if (__brand) {
                    // dirty hack to avoid a race condition
                    setTimeout(() => __setwordmark('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#0ff" d="M0,0L13,0L13,2L3,2L8,7.5L3,13L13,13L13,15L0,15L0,13L5,7.5L0,2L0,0Z"/></svg>'), 2000);
                }
            }
            else {
                __silent = silent;
                __brand = brand;
            }

            // try to figure out what bootstrap method was used -- helpful in cases where plugins need to know which bootstrap they are using
            if (typeof (mthd) == 'undefined') {
                if (typeof (_epmethod) == 'undefined') {
                    exports.method = 'unidentified-bootstrap';
                } else {
                    exports.method = _epmethod;
                }
            } else {
                exports.method = mthd;
            }
            __print('using method ' + exports.method);

            // start trying to init
            __print('starting init loop...');
            setTimeout(__init, 0);

            // undefine the entrypoint to avoid getting double-called
            exports.go = undefined;
        }
        catch (ex) {
            // something bad happened, undefine $api and display a message
            __crash(ex);
        }
    },

    // events, obviously
    event: {

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

    // methods for committing data to settings.json
    settings: {

        // get a value in the settings.json object
        get: function (k) {
            if (__lite)
                __warn('Something tried retrieving data from settings.json, but we are running in lite mode! Returning undefined...');
            else
                return JSON.parse(fs.readFileSync(exports.data + '/settings.json', 'utf8'))[k];
        },

        // set a value in the settings.json object
        set: function (k, v) {
            if (__lite) {
                __warn('Something tried putting data into settings.json, but we are running in lite mode! Doing nothing...');
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
        }

    },

    // utility functions
    util: {

        // intercept a function's arguments
        wrap: function (target1, callback) {

            // get the original function
            var orig = eval(target1);

            // the stub we will overwrite the function with
            function stub() {

                // what we will pass to the original function
                var args;

                try {
                    // call the wrapper and get our args
                    args = callback.apply(null, arguments);
                }
                catch (e) {
                    __error(e, 'A function wrapper threw an exception');

                    // dont completely break the function if there's a flaw in the wrapper
                    args = arguments;
                }

                // returning undefined results in the function call being suppressed
                if (typeof (args) != 'undefined') {
                    // call the original function
                    return orig.apply(null, args)
                }

            }

            // do the overwriting thing
            eval(`${target1}=stub`);

        },

        // intercept a function's return value
        wrapAfter: function (target1, callback) {

            // get the original function
            var orig = eval(target1);

            // the stub we will overwrite the function with
            function stub() {

                // call the original argument
                var r = orig.apply(null, arguments);

                try {
                    // call the wrapper and return its return value
                    return callback(r);
                }
                catch (e) {
                    __error(e, 'A function wrapper threw an exception');

                    // again, dont fuck stuff up if there's a flaw in the wrapper
                    return r;
                }

            }

            // overwrite that shit
            eval(`${target1}=stub`);

        },

        // extended findFunc that automatically narrows down results
        findFuncExports: function (s, e) {
            if (e === undefined) e = s;
            var results = wc.findFunc(s).filter(x => x.exports[e] !== undefined);
            if (results.length > 1)
                __warn('findFuncExports() found more than one match');
            return results[0].exports;
        }

    },

    // discord internal modules exposed with webcrack, commented out lines' purposes have been forgotten
    internal: {

        get constants() { return wc.findCache('API_HOST')[0].exports; },
        get dispatcher() { return wc.findCache('Dispatcher').filter(x => x.exports !== undefined && x.exports.Store === undefined && x.exports.default !== undefined)[0].exports; },
        //get evnt() { wc.findFunc('MESSAGE_CREATE')[1].exports },
        get messageUI() { return exports.util.findFuncExports('receiveMessage'); },
        get messageCreation() { return exports.util.findFuncExports('createMessage'); },
        get notification() { return exports.util.findFuncExports('showNotification'); },
        //get hguild() { wc.findFunc('leaveGuild')[0].exports },
        //get lguild() { wc.findFunc('markGuildAsRead')[0].exports },
        get objectStorage() { return wc.findCache('ObjectStorage')[0].exports; },
        get user() { return wc.findCache('getUser')[0].exports; },

        getId: () => wc.findCache('getId')[0].exports.getId()

    },

    // discord api stuff
    discord: {

        // take a wild guess
        rest: function (method, endpoint, body, c) {

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

            // get the promise
            var promise = fetch(url, options).then(r => {

                // if a bad thing happens then throw
                if (!r.ok) throw r;

                return r;

            }).catch(r => r.json().then(x => { throw x }));

            // urgh, theyre using callbacks
            if (c !== undefined) {

                // warn the dev
                __warn("Using callbacks in REST calls is deprecated and may be removed in a future release.");

                // operate like EPAPI =<5.0
                promise.then(r => r.text()).then(c);
            }
            else {
                return promise.then(r => r.json());
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
            $('.channels-3g2vYe').style.display = 'none';
        },

        showChannels: function () {
            $('.channels-3g2vYe').style.display = '';
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
        }

    },

    // debug, dont touch
    __eval: x => eval(x)

}