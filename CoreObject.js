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
Runtime.Core.CoreObject = function(ctx, object_name, entity)
{
	if (object_name == undefined) object_name = "";
	if (entity == undefined) entity = null;
	/* Init object */
	this._init(ctx);
	/* Set object name */
	var __v0 = use("Runtime.rtl");
	this.object_name = (object_name != "") ? (object_name) : (this.getClassName(ctx) + use("Runtime.rtl").toStr(".") + use("Runtime.rtl").toStr(__v0.unique(ctx)));
	var __v1 = use("Runtime.Vector");
	this.childs = new __v1(ctx);
	this.entity = entity;
};
Runtime.Core.CoreObject.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Core.CoreObject.prototype.constructor = Runtime.Core.CoreObject;
Object.assign(Runtime.Core.CoreObject.prototype,
{
	/**
	 * Returns object name
	 */
	getObjectName: function(ctx)
	{
		return this.object_name;
	},
	/**
	 * Returns entity
	 */
	getEntity: function(ctx)
	{
		return this.entity;
	},
	/**
	 * Handle message
	 */
	handleMessage: async function(ctx, msg)
	{
	},
	/**
	 * Set parent
	 */
	setParent: function(ctx, parent_obj)
	{
		this.manager.changeParent(ctx, this, parent_obj);
	},
	_init: function(ctx)
	{
		this.object_name = "";
		this.parent = null;
		this.childs = null;
		this.manager = null;
		this.entity = null;
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Core.CoreObject"))
		{
			this.object_name = o.object_name;
			this.parent = o.parent;
			this.childs = o.childs;
			this.manager = o.manager;
			this.entity = o.entity;
		}
		use("Runtime.BaseObject").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "object_name")this.object_name = v;
		else if (k == "parent")this.parent = v;
		else if (k == "childs")this.childs = v;
		else if (k == "manager")this.manager = v;
		else if (k == "entity")this.entity = v;
		else use("Runtime.BaseObject").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "object_name")return this.object_name;
		else if (k == "parent")return this.parent;
		else if (k == "childs")return this.childs;
		else if (k == "manager")return this.manager;
		else if (k == "entity")return this.entity;
		return use("Runtime.BaseObject").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Core.CoreObject";
	},
});
Object.assign(Runtime.Core.CoreObject, use("Runtime.BaseObject"));
Object.assign(Runtime.Core.CoreObject,
{
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime.Core";
	},
	getCurrentClassName: function()
	{
		return "Runtime.Core.CoreObject";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Runtime.Core.CoreObject",
			"name": "Runtime.Core.CoreObject",
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
			a.push("object_name");
			a.push("parent");
			a.push("childs");
			a.push("manager");
			a.push("entity");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		if (field_name == "object_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.CoreObject",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "parent") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.CoreObject",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "childs") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.CoreObject",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "manager") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.CoreObject",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "entity") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.CoreObject",
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
});use.add(Runtime.Core.CoreObject);
module.exports = Runtime.Core.CoreObject;