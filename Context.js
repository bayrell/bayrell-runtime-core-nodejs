"use strict;"
var use = require('bayrell').use;
/*!
 *  Bayrell Runtime Library
 *
 *  (c) Copyright 2016-2020 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
if (typeof Runtime == 'undefined') Runtime = {};
if (typeof Runtime.Core == 'undefined') Runtime.Core = {};
Runtime.Core.Context = function(ctx)
{
	use("Runtime.CoreStruct").apply(this, arguments);
};
Runtime.Core.Context.prototype = Object.create(use("Runtime.CoreStruct").prototype);
Runtime.Core.Context.prototype.constructor = Runtime.Core.Context;
Object.assign(Runtime.Core.Context.prototype,
{
	/**
	 * Returns enviroment by eky
	 */
	env: function(ctx, key, def_value)
	{
		if (def_value == undefined) def_value = "";
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, this);
		__v1 = __v1.attr(ctx, "enviroments");
		var __v2 = use("Runtime.lib");
		__v1 = __v1.call(ctx, __v2.get(ctx, key, def_value));
		return __v1.value(ctx);
	},
	/**
	 * Returns settings
	 * @return Dict<string>
	 */
	config: function(ctx, items, d)
	{
		if (d == undefined) d = null;
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, this);
		__v1 = __v1.attr(ctx, "settings");
		var __v2 = use("Runtime.lib");
		__v1 = __v1.call(ctx, __v2.get(ctx, "config", null));
		var __v3 = use("Runtime.lib");
		__v1 = __v1.call(ctx, __v3.attr(ctx, items, d));
		return __v1.value(ctx);
	},
	/**
	 * Returns docker secret key
	 */
	secret: function(ctx, key)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, this);
		__v1 = __v1.attr(ctx, "settings");
		var __v2 = use("Runtime.lib");
		__v1 = __v1.call(ctx, __v2.get(ctx, key, ""));
		return __v1.value(ctx);
	},
	/* ---------------- Driver & Provider --------------- */
	/**
	 * Get driver
	 *
	 * @params string driver_name
	 * @return Runtime.anager
	 */
	getDriver: function(ctx, driver_name)
	{
		return this.drivers.get(ctx, driver_name, null);
	},
	/**
	 * Create provider
	 *
	 * @params string provider_name
	 * @return CoreProvider
	 */
	createProvider: function(ctx, provider_name, params, settings_name)
	{
		if (params == undefined) params = null;
		if (settings_name == undefined) settings_name = "default";
		var provider = null;
		if (this.providers.has(ctx, provider_name))
		{
			var info = this.providers.item(ctx, provider_name);
			var __v0 = use("Runtime.Core.Provider");
			if (info.kind == __v0.KIND_INTERFACE)
			{
				var __v1 = use("Runtime.Exceptions.RuntimeException");
				throw new __v1(ctx, "Provider " + use("Runtime.rtl").toStr(provider_name) + use("Runtime.rtl").toStr(" does not declared"))
			}
			var class_name = info.className(ctx);
			/* Set default params */
			if (params == null)
			{
				var __v0 = use("Runtime.rtl");
				params = __v0.attr(ctx, this.settings, use("Runtime.Collection").from(["providers",class_name,settings_name]));
			}
			if (params == null)
			{
				params = use("Runtime.Dict").from({});
			}
			var __v0 = use("Runtime.rtl");
			provider = __v0.newInstance(ctx, class_name, use("Runtime.Collection").from([params]));
			provider = this.chain(ctx, class_name, use("Runtime.Collection").from([provider]));
			if (provider_name != class_name)
			{
				provider = this.chain(ctx, provider_name, use("Runtime.Collection").from([provider]));
			}
		}
		else
		{
			var __v1 = use("Runtime.Exceptions.RuntimeException");
			throw new __v1(ctx, "Provider " + use("Runtime.rtl").toStr(provider_name) + use("Runtime.rtl").toStr(" not found"))
		}
		return provider;
	},
	/**
	 * Returns provider
	 *
	 * @params string provider_name
	 * @return CoreProvider
	 */
	getProvider: function(ctx, provider_name, settings_name)
	{
		if (settings_name == undefined) settings_name = "default";
		return this.createProvider(ctx, provider_name, null, settings_name);
	},
	/* ---------------------- Chain --------------------- */
	/**
	 * Apply Lambda Chain
	 */
	chain: function(ctx, chain_name, args)
	{
		var entities = this.entities.filter(ctx, (ctx, item) => 
		{
			var __v0 = use("Runtime.Core.LambdaChain");
			return item instanceof __v0 && item.name == chain_name && item.is_await == false;
		});
		entities = entities.sortIm(ctx, (ctx, a, b) => 
		{
			return a.pos > b.pos;
		});
		for (var i = 0;i < entities.count(ctx);i++)
		{
			var item = entities.item(ctx, i);
			var item_chain_name = item.chain;
			if (item_chain_name != "")
			{
				var res = this.chain(ctx, item_chain_name, args);
				args = args.setIm(ctx, args.count(ctx) - 1, res);
			}
			else
			{
				var __v0 = use("Runtime.rs");
				var arr = __v0.split(ctx, "::", item.value);
				var class_name = arr.get(ctx, 0, "");
				var method_name = arr.get(ctx, 1, "");
				var __v1 = use("Runtime.rtl");
				var f = __v1.method(ctx, class_name, method_name);
				var __v2 = use("Runtime.rtl");
				var res = __v2.apply(ctx, f, args);
				args = args.setIm(ctx, args.count(ctx) - 1, res);
			}
		}
		var res = args.last(ctx);
		return res;
	},
	/**
	 * Apply Lambda Chain Await
	 */
	chainAwait: async function(ctx, chain_name, args)
	{
		var entities = this.entities.filter(ctx, (ctx, item) => 
		{
			var __v0 = use("Runtime.Core.LambdaChain");
			return item instanceof __v0 && item.name == chain_name;
		});
		entities = entities.sortIm(ctx, (ctx, a, b) => 
		{
			return a.pos > b.pos;
		});
		for (var i = 0;i < entities.count(ctx);i++)
		{
			var item = entities.item(ctx, i);
			var item_chain_name = item.chain;
			if (item_chain_name != "")
			{
				var res = await this.chainAwait(ctx, item_chain_name, args);
				args = args.setIm(ctx, args.count(ctx) - 1, res);
			}
			else
			{
				var __v0 = use("Runtime.rs");
				var arr = __v0.split(ctx, "::", item.value);
				var class_name = arr.get(ctx, 0, "");
				var method_name = arr.get(ctx, 1, "");
				var __v1 = use("Runtime.rtl");
				var f = __v1.method(ctx, class_name, method_name);
				if (item.is_async)
				{
					var __v2 = use("Runtime.rtl");
					var res = await __v2.apply(ctx, f, args);
					args = args.setIm(ctx, args.count(ctx) - 1, res);
				}
				else
				{
					var __v3 = use("Runtime.rtl");
					var res = __v3.apply(ctx, f, args);
					args = args.setIm(ctx, args.count(ctx) - 1, res);
				}
			}
		}
		var res = args.last(ctx);
		return Promise.resolve(res);
	},
	/**
	 * Translate message
	 * @params string space - message space
	 * @params string message - message need to be translated
	 * @params Map params - Messages params. Default null.
	 * @params string locale - Different locale. Default "".
	 * @return string - translated string
	 */
	translate: function(ctx, space, message, params, locale)
	{
		if (params == undefined) params = null;
		if (locale == undefined) locale = "";
		message = (params == null) ? (message) : (params.reduce(ctx, (ctx, message, value, key) => 
		{
			var __v0 = use("Runtime.rs");
			return __v0.replace(ctx, "%" + use("Runtime.rtl").toStr(key) + use("Runtime.rtl").toStr("%"), value, message);
		}, message));
		return message;
	},
	/* ----------------------- Bus ---------------------- */
	/**
	 * Send message
	 * @param Message msg
	 * @return Message
	 */
	send: function(ctx, msg)
	{
		var __v0 = use("Runtime.Monad");
		var __v2 = use("Runtime.rtl");
		var __v1 = new __v0(ctx, this.getProvider(ctx, __v2.BUS_INTERFACE, "default"));
		var __v3 = use("Runtime.Core.MessageRPC");
		__v1 = __v1.monad(ctx, __v3.end.bind(__v3));
		return __v1.value(ctx);
	},
	/**
	 * Send rpc message
	 * @param Dict items
	 * @return Message
	 */
	sendMessage: function(ctx, items)
	{
		var __v0 = use("Runtime.Monad");
		var __v2 = use("Runtime.rtl");
		var __v1 = new __v0(ctx, this.getProvider(ctx, __v2.BUS_INTERFACE, "default"));
		var __v3 = use("Runtime.Core.MessageRPC");
		var __v4 = use("Runtime.Core.MessageRPC");
		__v1 = __v1.monad(ctx, __v4.end.bind(__v4));
		return __v1.value(ctx);
	},
	/* ---------------------- Logs ---------------------- */
	/**
	 * Log message
	 * @param string message
	 * @param int loglevel
	 */
	debug: function(ctx, message, loglevel)
	{
		if (loglevel == undefined) loglevel = 0;
		this.logs.push(ctx, message + use("Runtime.rtl").toStr("\n"));
	},
	/**
	 * Timer message
	 * @param string message
	 * @param int loglevel
	 */
	log_timer: function(ctx, message, loglevel)
	{
		if (loglevel == undefined) loglevel = 0;
		var time = this.utime;
		time = time - this.start_time;
		var __v0 = use("Runtime.rtl");
		var s = "[" + use("Runtime.rtl").toStr(__v0.round(ctx, time * 1000)) + use("Runtime.rtl").toStr("]ms ") + use("Runtime.rtl").toStr(message) + use("Runtime.rtl").toStr("\n");
		this.logs.push(ctx, s);
	},
	/**
	 * Dump var to log
	 * @param var v
	 * @param int loglevel
	 */
	dump: function(ctx, v, loglevel)
	{
		if (loglevel == undefined) loglevel = 0;
	},
	/**
	 * Append logs message
	 * @param Collection<string> logs
	 */
	logAppend: function(ctx, logs)
	{
		/*this.logs.appendVector(logs);*/
	},
	/**
	 * Return logs
	 */
	getLogs: function(ctx)
	{
		/*return this.logs.toCollection();*/
		return use("Runtime.Collection").from([]);
	},
	/* ---------------------- Other --------------------- */
	/**
	 * Returns unix timestamp
	 */
	time: function(ctx)
	{
	},
	/**
	 * Returns unix timestamp
	 */
	utime: function(ctx)
	{
	},
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		var __v0 = use("Runtime.Vector");
		this.base_path = null;
		this.enviroments = null;
		this.settings = null;
		this.modules = null;
		this.entities = null;
		this.cli_args = null;
		this.drivers = null;
		this.providers = null;
		this.initialized = false;
		this.started = false;
		this.start_time = 0;
		this.logs = new __v0(ctx);
		this.entry_point = "";
		this.main_module = "";
		this.main_class = "";
		use("Runtime.CoreStruct").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Core.Context"))
		{
			this.base_path = o.base_path;
			this.enviroments = o.enviroments;
			this.settings = o.settings;
			this.modules = o.modules;
			this.entities = o.entities;
			this.cli_args = o.cli_args;
			this.drivers = o.drivers;
			this.providers = o.providers;
			this.initialized = o.initialized;
			this.started = o.started;
			this.start_time = o.start_time;
			this.logs = o.logs;
			this.entry_point = o.entry_point;
			this.main_module = o.main_module;
			this.main_class = o.main_class;
		}
		use("Runtime.CoreStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "base_path")this.base_path = v;
		else if (k == "enviroments")this.enviroments = v;
		else if (k == "settings")this.settings = v;
		else if (k == "modules")this.modules = v;
		else if (k == "entities")this.entities = v;
		else if (k == "cli_args")this.cli_args = v;
		else if (k == "drivers")this.drivers = v;
		else if (k == "providers")this.providers = v;
		else if (k == "initialized")this.initialized = v;
		else if (k == "started")this.started = v;
		else if (k == "start_time")this.start_time = v;
		else if (k == "logs")this.logs = v;
		else if (k == "entry_point")this.entry_point = v;
		else if (k == "main_module")this.main_module = v;
		else if (k == "main_class")this.main_class = v;
		else use("Runtime.CoreStruct").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "base_path")return this.base_path;
		else if (k == "enviroments")return this.enviroments;
		else if (k == "settings")return this.settings;
		else if (k == "modules")return this.modules;
		else if (k == "entities")return this.entities;
		else if (k == "cli_args")return this.cli_args;
		else if (k == "drivers")return this.drivers;
		else if (k == "providers")return this.providers;
		else if (k == "initialized")return this.initialized;
		else if (k == "started")return this.started;
		else if (k == "start_time")return this.start_time;
		else if (k == "logs")return this.logs;
		else if (k == "entry_point")return this.entry_point;
		else if (k == "main_module")return this.main_module;
		else if (k == "main_class")return this.main_class;
		return use("Runtime.CoreStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Core.Context";
	},
});
Object.assign(Runtime.Core.Context, use("Runtime.CoreStruct"));
Object.assign(Runtime.Core.Context,
{
	/**
	 * Returns app name
	 * @return string
	 */
	appName: function(ctx)
	{
		return "";
	},
	/**
	 * Returns context settings
	 * @return Dict<string>
	 */
	getSettings: function(ctx, env)
	{
		return null;
	},
	/**
	 * Extends entities
	 */
	getEntities: function(ctx, entities)
	{
		return null;
	},
	/**
	 * Create context
	 *
	 * @params Dict env
	 * @params Collection<string> modules
	 * @params Dict settings
	 * @return Context
	 */
	create: function(ctx, env)
	{
		if (env == undefined) env = null;
		var settings = use("Runtime.Dict").from({});
		/* Context data */
		var obj = use("Runtime.Dict").from({"enviroments":env,"settings":settings,"modules":use("Runtime.Collection").from([])});
		/* Create context */
		var ctx = this.newInstance(ctx, obj);
		return ctx;
	},
	/**
	 * Set main module
	 */
	setMainModule: function(ctx, c, main_module)
	{
		var settings = use("Runtime.Dict").from({});
		var main_module_class_name = "";
		/* Get settings */
		if (main_module)
		{
			main_module_class_name = main_module + use("Runtime.rtl").toStr(".ModuleDescription");
			var __v0 = use("Runtime.rtl");
			var f = __v0.method(ctx, main_module_class_name, "appSettings");
			settings = f(ctx, c.enviroments);
		}
		/* Add main module */
		if (main_module)
		{
			c = Runtime.rtl.setAttr(ctx, c, Runtime.Collection.from(["modules"]), c.modules.pushIm(ctx, main_module));
		}
		/* Set main module */
		c = Runtime.rtl.setAttr(ctx, c, Runtime.Collection.from(["main_module"]), main_module);
		c = Runtime.rtl.setAttr(ctx, c, Runtime.Collection.from(["main_class"]), main_module_class_name);
		/* Set new settings */
		c = Runtime.rtl.setAttr(ctx, c, Runtime.Collection.from(["settings"]), settings);
		return c;
	},
	/**
	 * Set entry point
	 */
	setEntryPoint: function(ctx, c, entry_point)
	{
		return c.copy(ctx, use("Runtime.Dict").from({"entry_point":entry_point}));
	},
	/**
	 * Prepare to run
	 */
	prepare: async function(ctx, c)
	{
		var main_class = c.main_class;
		/* Init app */
		if (main_class != "")
		{
			var __v0 = use("Runtime.rtl");
			var appInit = __v0.method(ctx, main_class, "appInit");
			c = appInit(ctx, c);
		}
		else
		{
			c = c.constructor.init(ctx, c);
		}
		/* Start app */
		if (main_class != "")
		{
			var __v0 = use("Runtime.rtl");
			var appStart = __v0.method(ctx, main_class, "appStart");
			c = await appStart(ctx, c);
		}
		else
		{
			c = await c.constructor.start(ctx, c);
		}
		return Promise.resolve(c);
	},
	/**
	 * Run entry point
	 */
	run: async function(ctx, c)
	{
		var entry_point = c.entry_point;
		/* Run entrypoint */
		if (entry_point != "")
		{
			var __v0 = use("Runtime.rtl");
			var run = __v0.method(ctx, entry_point, "run");
			await run(c);
		}
		return Promise.resolve(c);
	},
	/**
	 * Init context
	 */
	init: function(ctx, c)
	{
		if (c.initialized)
		{
			return c;
		}
		/* Extends modules */
		var modules = this.getRequiredModules(ctx, c.modules);
		/* Get modules entities */
		var entities = this.getEntitiesFromModules(ctx, modules);
		entities = entities.prependCollectionIm(ctx, this.getEntities(ctx, c.env));
		/* Base path */
		var __v0 = use("Runtime.rtl");
		var base_path = (c.base_path != "") ? (c.base_path) : (__v0.attr(ctx, c.env, use("Runtime.Collection").from(["BASE_PATH"]), "", "string"));
		/* Add entities */
		if (c.entities != null)
		{
			entities = entities.appendCollectionIm(ctx, c.entities);
		}
		c = Runtime.rtl.setAttr(ctx, c, Runtime.Collection.from(["entities"]), entities);
		/* Extend entities */
		entities = c.chain(ctx, "Runtime.Entities", use("Runtime.Collection").from([c,entities]));
		entities = this.extendEntities(ctx, c, entities);
		entities = this.getRequiredEntities(ctx, entities);
		/* Get providers */
		var providers = this.getProvidersFromEntities(ctx, c, entities);
		/* Register drivers */
		var drivers = this.getDriversFromEntities(ctx, c, entities);
		return c.copy(ctx, use("Runtime.Dict").from({"modules":modules,"entities":entities,"providers":providers,"drivers":drivers,"base_path":base_path,"initialized":true}));
	},
	/**
	 * Start context
	 */
	start: async function(ctx, c)
	{
		if (c.started)
		{
			return Promise.resolve(c);
		}
		var drivers = c.drivers.keys(ctx);
		for (var i = 0;i < drivers.count(ctx);i++)
		{
			var driver_name = drivers.item(ctx, i);
			var driver = c.drivers.item(ctx, driver_name);
			await driver.startDriver(ctx);
		}
		return Promise.resolve(c.copy(ctx, use("Runtime.Dict").from({"started":true})));
	},
	/* -------------------- Functions ------------------- */
	/**
	 * Returns required modules
	 * @param string class_name
	 * @return Collection<string>
	 */
	_getRequiredModules: function(ctx, res, cache, modules, filter)
	{
		if (filter == undefined) filter = null;
		if (modules == null)
		{
			return ;
		}
		if (filter)
		{
			modules = modules.filter(ctx, filter);
		}
		for (var i = 0;i < modules.count(ctx);i++)
		{
			var module_name = modules.item(ctx, i);
			if (cache.get(ctx, module_name, false) == false)
			{
				cache.set(ctx, module_name, true);
				var __v0 = use("Runtime.rtl");
				var f = __v0.method(ctx, module_name + use("Runtime.rtl").toStr(".ModuleDescription"), "requiredModules");
				var sub_modules = f(ctx);
				if (sub_modules != null)
				{
					var sub_modules = sub_modules.keys(ctx);
					this._getRequiredModules(ctx, res, cache, sub_modules);
				}
				res.push(ctx, module_name);
			}
		}
	},
	/**
	 * Returns all modules
	 * @param Collection<string> modules
	 * @return Collection<string>
	 */
	getRequiredModules: function(ctx, modules)
	{
		var __v0 = use("Runtime.Vector");
		var res = new __v0(ctx);
		var __v1 = use("Runtime.Map");
		var cache = new __v1(ctx);
		this._getRequiredModules(ctx, res, cache, modules);
		res = res.removeDublicatesIm(ctx);
		return res.toCollection(ctx);
	},
	/**
	 * Returns modules entities
	 */
	getEntitiesFromModules: function(ctx, modules)
	{
		var __v0 = use("Runtime.Vector");
		var entities = new __v0(ctx);
		for (var i = 0;i < modules.count(ctx);i++)
		{
			var module_class_name = modules.item(ctx, i) + use("Runtime.rtl").toStr(".ModuleDescription");
			var __v1 = use("Runtime.rtl");
			var f = __v1.method(ctx, module_class_name, "entities");
			var arr = f(ctx);
			entities.appendVector(ctx, arr);
		}
		return entities.toCollection(ctx);
	},
	/**
	 * Extend entities
	 */
	getRequiredEntities: function(ctx, entities)
	{
		var e = entities.toVector(ctx);
		for (var i = 0;i < entities.count(ctx);i++)
		{
			var item1 = entities.item(ctx, i);
			var item1_class_name = item1.getClassName(ctx);
			if (item1_class_name == "Runtime.Core.Entity")
			{
				var class_name = (item1.value != "") ? (item1.value) : (item1.name);
				var __v0 = use("Runtime.RuntimeUtils");
				var info = __v0.getClassIntrospection(ctx, class_name);
				if (info != null && info.class_info)
				{
					for (var j = 0;j < info.class_info.count(ctx);j++)
					{
						var item2 = info.class_info.item(ctx, j);
						var item2_class_name = item2.getClassName(ctx);
						var __v1 = use("Runtime.Core.Entity");
						if (item2 instanceof __v1 && item2_class_name != "Runtime.Core.Entity")
						{
							item2 = item2.copy(ctx, use("Runtime.Dict").from({"name":class_name}));
							e.push(ctx, item2);
						}
					}
				}
			}
		}
		return e.toCollection(ctx);
	},
	/**
	 * Returns providers from entities
	 */
	getProvidersFromEntities: function(ctx, c, entities)
	{
		var arr = entities.filter(ctx, (ctx, item) => 
		{
			var __v0 = use("Runtime.Core.Provider");
			return item instanceof __v0;
		});
		var __v0 = use("Runtime.Map");
		var providers = new __v0(ctx);
		for (var i = 0;i < arr.count(ctx);i++)
		{
			var item = arr.item(ctx, i);
			providers.set(ctx, item.name, item);
		}
		return providers.toDict(ctx);
	},
	/**
	 * Register drivers
	 */
	getDriversFromEntities: function(ctx, c, entities)
	{
		var arr = entities.filter(ctx, (ctx, item) => 
		{
			var __v0 = use("Runtime.Core.Driver");
			return item instanceof __v0;
		});
		var __v0 = use("Runtime.Map");
		var drivers = new __v0(ctx);
		for (var i = 0;i < arr.count(ctx);i++)
		{
			var item = arr.item(ctx, i);
			var driver_name = item.name;
			var class_name = item.value;
			if (class_name == "")
			{
				class_name = item.name;
			}
			var __v1 = use("Runtime.rtl");
			var driver = __v1.newInstance(ctx, class_name, use("Runtime.Collection").from([]));
			driver = c.chain(ctx, class_name, use("Runtime.Collection").from([driver]));
			if (class_name != driver_name)
			{
				driver = c.chain(ctx, driver_name, use("Runtime.Collection").from([driver]));
			}
			drivers.set(ctx, item.name, driver);
		}
		return drivers.toDict(ctx);
	},
	/**
	 * Extends entities
	 */
	extendEntities: function(ctx, c, entities)
	{
		return entities;
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime.Core";
	},
	getCurrentClassName: function()
	{
		return "Runtime.Core.Context";
	},
	getParentClassName: function()
	{
		return "Runtime.CoreStruct";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Runtime.Core.Context",
			"name": "Runtime.Core.Context",
			"annotations": Collection.from([
			]),
		});
	},
	getFieldsList: function(ctx, f)
	{
		var a = [];
		if (f==undefined) f=0;
		if ((f|3)==3)
		{
			a.push("base_path");
			a.push("enviroments");
			a.push("settings");
			a.push("modules");
			a.push("entities");
			a.push("cli_args");
			a.push("drivers");
			a.push("providers");
			a.push("initialized");
			a.push("started");
			a.push("start_time");
			a.push("logs");
			a.push("entry_point");
			a.push("main_module");
			a.push("main_class");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		if (field_name == "base_path") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "enviroments") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "settings") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "modules") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "entities") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "cli_args") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "drivers") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "providers") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "initialized") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "started") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "start_time") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "logs") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "entry_point") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "main_module") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "main_class") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Context",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a = [
		];
		return use("Runtime.Collection").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
	__implements__:
	[
		use("Runtime.Interfaces.ContextInterface"),
	],
});use.add(Runtime.Core.Context);
module.exports = Runtime.Core.Context;