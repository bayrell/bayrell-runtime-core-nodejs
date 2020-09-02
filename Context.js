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
	use("Runtime.BaseStruct").apply(this, arguments);
};
Runtime.Core.Context.prototype = Object.create(use("Runtime.BaseStruct").prototype);
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
	/* ------------------ Object Manager ---------------- */
	/**
	 * Add object
	 */
	addObject: function(ctx, obj, object_name)
	{
		if (object_name == undefined) object_name = "";
		this.object_manager.addObject(ctx, obj, object_name);
		return this;
	},
	/**
	 * Register listener
	 */
	registerListener: function(ctx, from, event_class_name, object_name, method_name)
	{
		if (method_name == undefined) method_name = "";
		return this.object_manager.registerListener(ctx, from, event_class_name, object_name, method_name);
	},
	/**
	 * Find listeners
	 */
	findListeners: function(ctx, from, event_class_name)
	{
		if (event_class_name == undefined) event_class_name = "";
		return this.object_manager.findListeners(ctx, from, event_class_name);
	},
	/**
	 * Get object
	 */
	getObject: function(ctx, object_name)
	{
		return this.object_manager.getObject(ctx, object_name);
	},
	/**
	 * Get objects
	 */
	getObjects: function(ctx, object_name)
	{
		return this.object_manager.getObjects(ctx, object_name);
	},
	/**
	 * Get driver
	 */
	getDriver: function(ctx, driver_name)
	{
		return this.object_manager.getDriver(ctx, driver_name);
	},
	/**
	 * Get drivers
	 */
	getDrivers: function(ctx, class_name)
	{
		return this.object_manager.getDrivers(ctx, class_name);
	},
	/**
	 * Remove object
	 */
	removeObject: function(ctx, object_name)
	{
		this.object_manager.removeObject(ctx, object_name);
		return this;
	},
	/**
	 * Send message
	 * @param Message msg
	 * @return Message
	 */
	sendLocalMessage: async function(ctx, msg)
	{
		await this.object_manager.sendMessage(ctx, msg);
	},
	/**
	 * Remote call
	 * @param Dict items
	 * @return RemoteCallResponse
	 */
	remoteLocalCall: async function(ctx, items)
	{
		return await this.object_manager.remoteCall(ctx, items);
	},
	/**
	 * Send message
	 * @param Message msg
	 * @return Message
	 */
	sendBusMessage: async function(ctx, msg)
	{
		var driver = this.getDriver(ctx, "default:external_bus");
		await driver.sendMessage(ctx, msg);
	},
	/**
	 * Remote call
	 * @param Dict items
	 * @return RemoteCallResponse
	 */
	remoteBusCall: async function(ctx, items)
	{
		var driver = this.getDriver(ctx, "default:external_bus");
		return Promise.resolve(await driver.remoteCall(ctx, items));
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
			return item instanceof __v0 && item.name == chain_name && item.is_async == false;
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
				args = this.chain(ctx, item_chain_name, args);
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
				args = __v2.apply(ctx, f, args);
			}
		}
		return args;
	},
	/**
	 * Apply Lambda Chain Await
	 */
	chainAsync: async function(ctx, chain_name, args)
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
				args = await this.chainAsync(ctx, item_chain_name, args);
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
					args = await __v2.apply(ctx, f, args);
				}
				else
				{
					var __v3 = use("Runtime.rtl");
					args = __v3.apply(ctx, f, args);
				}
			}
		}
		return Promise.resolve(args);
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
	/**
	 * Push message to frontend client
	 * @param Message msg
	 * @return Message
	 */
	pushExternalMessage: async function(ctx, msg)
	{
		var driver = this.getDriver(ctx, "default:external_bus");
		await driver.pushMessage(ctx, msg);
	},
	/**
	 * Send message
	 * @param Message msg
	 * @return Message
	 */
	sendSystemMessage: async function(ctx, msg)
	{
		var driver = this.getDriver(ctx, "default:system_bus");
		await driver.sendMessage(ctx, msg);
	},
	/**
	 * Remote call
	 * @param Dict items
	 * @return RemoteCallResponse
	 */
	remoteSystemCall: async function(ctx, items)
	{
		var driver = this.getDriver(ctx, "default:system_bus");
		await driver.remoteCall(ctx, items);
	},
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		this.base_path = null;
		this.enviroments = null;
		this.settings = null;
		this.modules = null;
		this.entities = null;
		this.cli_args = null;
		this.initialized = false;
		this.started = false;
		this.start_time = 0;
		this.entry_point = "";
		this.main_module = "";
		this.main_class = "";
		this.object_manager = null;
		use("Runtime.BaseStruct").prototype._init.call(this,ctx);
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
			this.initialized = o.initialized;
			this.started = o.started;
			this.start_time = o.start_time;
			this.entry_point = o.entry_point;
			this.main_module = o.main_module;
			this.main_class = o.main_class;
			this.object_manager = o.object_manager;
		}
		use("Runtime.BaseStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "base_path")this.base_path = v;
		else if (k == "enviroments")this.enviroments = v;
		else if (k == "settings")this.settings = v;
		else if (k == "modules")this.modules = v;
		else if (k == "entities")this.entities = v;
		else if (k == "cli_args")this.cli_args = v;
		else if (k == "initialized")this.initialized = v;
		else if (k == "started")this.started = v;
		else if (k == "start_time")this.start_time = v;
		else if (k == "entry_point")this.entry_point = v;
		else if (k == "main_module")this.main_module = v;
		else if (k == "main_class")this.main_class = v;
		else if (k == "object_manager")this.object_manager = v;
		else use("Runtime.BaseStruct").prototype.assignValue.call(this,ctx,k,v);
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
		else if (k == "initialized")return this.initialized;
		else if (k == "started")return this.started;
		else if (k == "start_time")return this.start_time;
		else if (k == "entry_point")return this.entry_point;
		else if (k == "main_module")return this.main_module;
		else if (k == "main_class")return this.main_class;
		else if (k == "object_manager")return this.object_manager;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Core.Context";
	},
});
Object.assign(Runtime.Core.Context, use("Runtime.BaseStruct"));
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
		var __v0 = use("Runtime.Core.ObjectManager");
		var obj = use("Runtime.Dict").from({"enviroments":env,"settings":settings,"modules":use("Runtime.Collection").from([]),"object_manager":new __v0(ctx)});
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
		/* Set entry point */
		c = Runtime.rtl.setAttr(ctx, c, Runtime.Collection.from(["entry_point"]), main_module_class_name);
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
	 * Init context
	 */
	init: function(ctx, c)
	{
		ctx = c;
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
		var __v1 = use("Runtime.Monad");
		var __v2 = new __v1(ctx, c.chain(ctx, "Runtime.Entities", use("Runtime.Collection").from([c,entities])));
		__v2 = __v2.attr(ctx, 1);
		entities = __v2.value(ctx);
		entities = this.extendEntities(ctx, c, entities);
		entities = this.getRequiredEntities(ctx, entities);
		return c.copy(ctx, use("Runtime.Dict").from({"modules":modules,"entities":entities,"base_path":base_path,"initialized":true}));
	},
	/**
	 * Start context
	 */
	start: async function(ctx, c)
	{
		ctx = c;
		if (c.started)
		{
			return Promise.resolve(c);
		}
		/* Start Object Manager */
		await c.object_manager.startManager(ctx, c.entities);
		return Promise.resolve(c.copy(ctx, use("Runtime.Dict").from({"started":true})));
	},
	/**
	 * Init
	 */
	appInit: async function(ctx, c)
	{
		var main_class = c.main_class;
		/* Init app */
		var __v0 = use("Runtime.rtl");
		if (main_class != "" && __v0.method_exists(ctx, main_class, "appInit"))
		{
			var __v1 = use("Runtime.rtl");
			var init = __v1.method(ctx, main_class, "appInit");
			c = init(ctx, c);
		}
		else
		{
			c = c.constructor.init(ctx, c);
		}
		return Promise.resolve(c);
	},
	/**
	 * Start
	 */
	appStart: async function(ctx, c)
	{
		var main_class = c.main_class;
		/* Start app */
		var __v0 = use("Runtime.rtl");
		if (main_class != "" && __v0.method_exists(ctx, main_class, "appStart"))
		{
			var __v1 = use("Runtime.rtl");
			var start = __v1.method(ctx, main_class, "appStart");
			c = await start(ctx, c);
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
	appRun: async function(ctx, c)
	{
		ctx = c;
		var entry_point = c.entry_point;
		/* Run entrypoint */
		if (entry_point != "")
		{
			var __v0 = use("Runtime.rtl");
			var run = __v0.method(ctx, entry_point, "appRun");
			await run(c);
		}
		return Promise.resolve(c);
	},
	/**
	 * Run application
	 */
	run: async function(ctx, c, f1, f2)
	{
		if (f1 == undefined) f1 = null;
		if (f2 == undefined) f2 = null;
		c = await this.appInit(ctx, c);
		if (f1 != null)
		{
			c = await f1(ctx, c);
		}
		c = await this.appStart(ctx, c);
		if (f2 != null)
		{
			c = await f2(ctx, c);
		}
		c = await this.appRun(ctx, c);
		return Promise.resolve(c);
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
		return "Runtime.BaseStruct";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
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
			a.push("initialized");
			a.push("started");
			a.push("start_time");
			a.push("entry_point");
			a.push("main_module");
			a.push("main_class");
			a.push("object_manager");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
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
		if (field_name == "object_manager") return new IntrospectionInfo(ctx, {
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
			"pushExternalMessage",
			"sendSystemMessage",
			"remoteSystemCall",
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