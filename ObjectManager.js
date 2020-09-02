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
Runtime.Core.ObjectManager = function(ctx)
{
	use("Runtime.Core.CoreObject").call(this, ctx);
	/* Create object */
	var __v0 = use("Runtime.Map");
	this.objects = new __v0(ctx);
	var __v1 = use("Runtime.Map");
	this.drivers = new __v1(ctx);
	var __v2 = use("Runtime.Vector");
	this.messages = new __v2(ctx);
	var __v3 = use("Runtime.Mutex");
	this.mutex_messages = new __v3(ctx);
	var __v4 = use("Runtime.Mutex");
	this.mutex_objects = new __v4(ctx);
	var __v5 = use("Runtime.Mutex");
	this.mutex_process = new __v5(ctx);
	/* Register self */
	this.objects.set(ctx, this.getClassName(ctx), this);
	this.drivers.set(ctx, this.getClassName(ctx), this);
	this.objects.set(ctx, "default:object_manager", this);
	this.drivers.set(ctx, "default:object_manager", this);
	var __v6 = use("Runtime.Vector");
	this.listeners = new __v6(ctx);
	this.manager = this;
};
Runtime.Core.ObjectManager.prototype = Object.create(use("Runtime.Core.CoreObject").prototype);
Runtime.Core.ObjectManager.prototype.constructor = Runtime.Core.ObjectManager;
Object.assign(Runtime.Core.ObjectManager.prototype,
{
	/**
	 * Add object
	 */
	addObject: function(ctx, obj, object_name)
	{
		if (object_name == undefined) object_name = "";
		var __v0 = use("Runtime.Core.CoreObject");
		if (obj instanceof __v0)
		{
			if (object_name == "")
			{
				object_name = obj.getObjectName(ctx);
			}
			if (!this.drivers.has(ctx, object_name))
			{
				this.objects.set(ctx, object_name, obj);
				obj.manager = this;
			}
		}
	},
	/**
	 * Get object
	 */
	getObject: function(ctx, object_name)
	{
		var obj = null;
		obj = this.objects.get(ctx, object_name, null);
		return obj;
	},
	/**
	 * Get objects
	 */
	getObjects: function(ctx, class_name)
	{
		var __v0 = use("Runtime.Vector");
		var objects = new __v0(ctx);
		this.objects.each(ctx, (ctx, obj) => 
		{
			var __v1 = use("Runtime.rtl");
			if (__v1.is_instanceof(ctx, obj, class_name))
			{
				objects.push(ctx, obj);
			}
		});
		return objects.toCollection(ctx);
	},
	/**
	 * Get driver
	 */
	getDriver: function(ctx, driver_name)
	{
		var obj = null;
		obj = this.drivers.get(ctx, driver_name, null);
		return obj;
	},
	/**
	 * Get drivers
	 */
	getDrivers: function(ctx, class_name)
	{
		var __v0 = use("Runtime.Vector");
		var drivers = new __v0(ctx);
		this.drivers.each(ctx, (ctx, obj) => 
		{
			var __v1 = use("Runtime.rtl");
			if (__v1.is_instanceof(ctx, obj, class_name))
			{
				drivers.push(ctx, obj);
			}
		});
		return drivers.toCollection(ctx);
	},
	/**
	 * Remove object
	 */
	removeObject: function(ctx, object_name)
	{
		if (!this.drivers.has(ctx, object_name))
		{
			var obj = this.objects.get(ctx, object_name, null);
			if (obj != null && obj.parent != null)
			{
				obj.parent.childs.remove(ctx, obj);
				obj.parent = null;
			}
			this.objects.remove(ctx, object_name);
		}
	},
	/**
	 * Remove object
	 */
	removeObjectRecursive: function(ctx, object_name)
	{
		var keys = null;
		keys = this.objects.keys(ctx);
		var __v0 = use("Runtime.lib");
		keys = keys.filter(ctx, (ctx, item_name) => 
		{
			var __v0 = use("Runtime.rs");
			return __v0.strpos(ctx, item_name, object_name) == 0;
		}).sortIm(ctx, __v0.sortDesc);
		for (var i = 0;i < keys.count(ctx);i++)
		{
			var name = Runtime.rtl.get(ctx, keys, i);
			this.removeObject(ctx, name);
		}
		/* Remove listeners */
		for (var i = this.listeners.count(ctx) - 1;i >= 0;i--)
		{
			var item = Runtime.rtl.get(ctx, this.listeners, i);
			var __v1 = use("Runtime.rs");
			var __v2 = use("Runtime.rs");
			if (__v1.strpos(ctx, Runtime.rtl.get(ctx, item, "from"), object_name) == 0 || __v2.strpos(ctx, Runtime.rtl.get(ctx, item, "object_name"), object_name) == 0)
			{
				this.listeners.remove(ctx, i);
			}
		}
	},
	/**
	 * Register listener
	 */
	registerListener: function(ctx, from, event_class_name, object_name, method_name)
	{
		if (method_name == undefined) method_name = "";
		for (var i = 0;i < this.listeners.count(ctx);i++)
		{
			var item = Runtime.rtl.get(ctx, this.listeners, i);
			if (Runtime.rtl.get(ctx, item, "from") == from && Runtime.rtl.get(ctx, item, "object_name") == object_name && Runtime.rtl.get(ctx, item, "method_name") == method_name && Runtime.rtl.get(ctx, item, "event_class_name") == event_class_name)
			{
				return ;
			}
		}
		this.listeners.push(ctx, use("Runtime.Dict").from({"from":from,"object_name":object_name,"event_class_name":event_class_name,"method_name":method_name}));
	},
	/**
	 * Find callback
	 */
	findListeners: function(ctx, from, event_class_name)
	{
		if (event_class_name == undefined) event_class_name = "";
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		for (var i = 0;i < this.listeners.count(ctx);i++)
		{
			var item = Runtime.rtl.get(ctx, this.listeners, i);
			if (Runtime.rtl.get(ctx, item, "from") == from && (event_class_name == "" || Runtime.rtl.get(ctx, item, "event_class_name") == event_class_name))
			{
				items.push(ctx, item);
			}
		}
		return items.toCollection(ctx);
	},
	/**
	 * Start object manager
	 */
	startManager: async function(ctx, entities)
	{
		var __v0 = use("Runtime.Vector");
		var drivers_created = new __v0(ctx);
		var drivers = entities.filter(ctx, (ctx, item) => 
		{
			var __v1 = use("Runtime.Core.Driver");
			return item instanceof __v1;
		});
		for (var i = 0;i < drivers.count(ctx);i++)
		{
			var driver_entity = drivers.item(ctx, i);
			var driver_name = driver_entity.name;
			var class_name = driver_entity.value;
			if (class_name == "")
			{
				class_name = driver_entity.name;
			}
			var __v1 = use("Runtime.rtl");
			var driver = __v1.newInstance(ctx, class_name, use("Runtime.Collection").from([driver_name,driver_entity]));
			var __v2 = use("Runtime.Monad");
			var __v3 = new __v2(ctx, ctx.chain(ctx, class_name, use("Runtime.Collection").from([driver])));
			__v3 = __v3.attr(ctx, 0);
			driver = __v3.value(ctx);
			if (class_name != driver_name)
			{
				var __v4 = use("Runtime.Monad");
				var __v5 = new __v4(ctx, ctx.chain(ctx, driver_name, use("Runtime.Collection").from([driver])));
				__v5 = __v5.attr(ctx, 0);
				driver = __v5.value(ctx);
			}
			if (driver == null)
			{
				var __v4 = use("Runtime.Exceptions.RuntimeException");
				throw new __v4(ctx, "Driver not found " + use("Runtime.rtl").toStr(class_name))
			}
			this.objects.set(ctx, driver_name, driver);
			this.drivers.set(ctx, driver_name, driver);
			driver.manager = this;
			drivers_created.push(ctx, driver);
		}
		/* Start drivers */
		for (var i = 0;i < drivers_created.count(ctx);i++)
		{
			var driver = drivers_created.item(ctx, i);
			await driver.startDriver(ctx);
		}
		/*rtl::runThread( method this.processMessages );*/
	},
	/**
	 * Send message
	 * @param Message msg
	 * @return Message
	 */
	sendMessage: async function(ctx, msg)
	{
		this.messages.push(ctx, msg);
		this.mutex_process.unLock(ctx);
		/* Handle messages */
		await this.handleMessages(ctx);
	},
	/**
	 * Send message
	 * @param Message msg
	 * @return Message
	 */
	remoteCall: async function(ctx, items)
	{
		/* Create message */
		var __v0 = use("Runtime.Core.RemoteCallEvent");
		var event = __v0.create(ctx, items);
		var __v1 = use("Runtime.Core.Message");
		var msg = new __v1(ctx, event, event.object_name);
		/* Send message */
		await this.sendMessage(ctx, msg);
		/* Wait message */
		var response = await this.waitResponse(ctx, msg);
		/* Return response */
		return Promise.resolve(response);
	},
	/**
	 * Process messages
	 */
	processMessages: async function(ctx)
	{
		var is_run = ctx.getRun(ctx);
		while (is_run)
		{
			if (this.message.count(ctx) == 0)
			{
				await this.mutex_process.waitAsync(ctx);
			}
			await this.handleMessages(ctx);
			this.mutex_process.lock(ctx);
		}
	},
	/**
	 * Handle messages
	 */
	handleMessages: async function(ctx)
	{
		while (this.messages.count(ctx) > 0)
		{
			var msg = null;
			msg = this.messages.pop(ctx);
			if (msg == null)
			{
				return Promise.resolve();
			}
			await this.handleMessage(ctx, msg);
		}
	},
	/**
	 * Handle messages
	 */
	handleMessage: async function(ctx, msg)
	{
		if (msg.data == null)
		{
			return Promise.resolve();
		}
		var __v0 = use("Runtime.Map");
		var hash = new __v0(ctx);
		var items = this.findListeners(ctx, msg.from, msg.data.getClassName(ctx));
		for (var i = 0;i < items.count(ctx);i++)
		{
			var item = Runtime.rtl.get(ctx, items, i);
			var object_name = Runtime.rtl.get(ctx, item, "object_name");
			var method_name = Runtime.rtl.get(ctx, item, "method_name");
			var obj = this.getObject(ctx, object_name);
			if (obj != null)
			{
				var __v1 = use("Runtime.rtl");
				if (__v1.method_exists(ctx, obj, method_name))
				{
					var __v2 = use("Runtime.rtl");
					var f = __v2.method(ctx, obj, method_name);
					await f(ctx, msg);
				}
			}
			if (!hash.has(ctx, object_name))
			{
				while (obj != null)
				{
					await obj.handleMessage(ctx, msg);
					obj = obj.parent;
				}
				hash.set(ctx, object_name, true);
			}
		}
	},
	/**
	 * Set parent
	 */
	setParent: function(ctx, child_obj, parent_obj)
	{
		if (child_obj.parent != null)
		{
			child_obj.parent.childs.remove(ctx, child_obj);
		}
		child_obj.parent = parent_obj;
		if (parent_obj != null)
		{
			if (parent_obj.childs.indexOf(ctx, child_obj) == -1)
			{
				parent_obj.childs.push(ctx, child_obj);
			}
		}
	},
	_init: function(ctx)
	{
		this.objects = null;
		this.drivers = null;
		this.messages = null;
		this.mutex_messages = null;
		this.mutex_objects = null;
		this.mutex_process = null;
		this.listeners = null;
		use("Runtime.Core.CoreObject").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Core.ObjectManager"))
		{
			this.objects = o.objects;
			this.drivers = o.drivers;
			this.messages = o.messages;
			this.mutex_messages = o.mutex_messages;
			this.mutex_objects = o.mutex_objects;
			this.mutex_process = o.mutex_process;
			this.listeners = o.listeners;
		}
		use("Runtime.Core.CoreObject").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "objects")this.objects = v;
		else if (k == "drivers")this.drivers = v;
		else if (k == "messages")this.messages = v;
		else if (k == "mutex_messages")this.mutex_messages = v;
		else if (k == "mutex_objects")this.mutex_objects = v;
		else if (k == "mutex_process")this.mutex_process = v;
		else if (k == "listeners")this.listeners = v;
		else use("Runtime.Core.CoreObject").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "objects")return this.objects;
		else if (k == "drivers")return this.drivers;
		else if (k == "messages")return this.messages;
		else if (k == "mutex_messages")return this.mutex_messages;
		else if (k == "mutex_objects")return this.mutex_objects;
		else if (k == "mutex_process")return this.mutex_process;
		else if (k == "listeners")return this.listeners;
		return use("Runtime.Core.CoreObject").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Core.ObjectManager";
	},
});
Object.assign(Runtime.Core.ObjectManager, use("Runtime.Core.CoreObject"));
Object.assign(Runtime.Core.ObjectManager,
{
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime.Core";
	},
	getCurrentClassName: function()
	{
		return "Runtime.Core.ObjectManager";
	},
	getParentClassName: function()
	{
		return "Runtime.Core.CoreObject";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Runtime.Core.ObjectManager",
			"name": "Runtime.Core.ObjectManager",
			"annotations": Collection.from([
			]),
		});
	},
	getFieldsList: function(ctx, f)
	{
		var a = [];
		if (f==undefined) f=0;
		if ((f|2)==2)
		{
			a.push("objects");
			a.push("drivers");
			a.push("messages");
			a.push("mutex_messages");
			a.push("mutex_objects");
			a.push("mutex_process");
			a.push("listeners");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		if (field_name == "objects") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.ObjectManager",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "drivers") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.ObjectManager",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "messages") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.ObjectManager",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "mutex_messages") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.ObjectManager",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "mutex_objects") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.ObjectManager",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "mutex_process") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.ObjectManager",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "listeners") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.ObjectManager",
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
});use.add(Runtime.Core.ObjectManager);
module.exports = Runtime.Core.ObjectManager;