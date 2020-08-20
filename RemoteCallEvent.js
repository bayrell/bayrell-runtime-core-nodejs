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
Runtime.Core.RemoteCallEvent = function(ctx)
{
	use("Runtime.Core.BaseEvent").apply(this, arguments);
};
Runtime.Core.RemoteCallEvent.prototype = Object.create(use("Runtime.Core.BaseEvent").prototype);
Runtime.Core.RemoteCallEvent.prototype.constructor = Runtime.Core.RemoteCallEvent;
Object.assign(Runtime.Core.RemoteCallEvent.prototype,
{
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		this.object_name = "";
		this.space_name = "";
		this.method_name = "";
		this.data = null;
		use("Runtime.Core.BaseEvent").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Core.RemoteCallEvent"))
		{
			this.object_name = o.object_name;
			this.space_name = o.space_name;
			this.method_name = o.method_name;
			this.data = o.data;
		}
		use("Runtime.Core.BaseEvent").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "object_name")this.object_name = v;
		else if (k == "space_name")this.space_name = v;
		else if (k == "method_name")this.method_name = v;
		else if (k == "data")this.data = v;
		else use("Runtime.Core.BaseEvent").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "object_name")return this.object_name;
		else if (k == "space_name")return this.space_name;
		else if (k == "method_name")return this.method_name;
		else if (k == "data")return this.data;
		return use("Runtime.Core.BaseEvent").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Core.RemoteCallEvent";
	},
});
Object.assign(Runtime.Core.RemoteCallEvent, use("Runtime.Core.BaseEvent"));
Object.assign(Runtime.Core.RemoteCallEvent,
{
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime.Core";
	},
	getCurrentClassName: function()
	{
		return "Runtime.Core.RemoteCallEvent";
	},
	getParentClassName: function()
	{
		return "Runtime.Core.BaseEvent";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Runtime.Core.RemoteCallEvent",
			"name": "Runtime.Core.RemoteCallEvent",
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
			a.push("object_name");
			a.push("space_name");
			a.push("method_name");
			a.push("data");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		if (field_name == "object_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallEvent",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "space_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallEvent",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "method_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallEvent",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "data") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallEvent",
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
});use.add(Runtime.Core.RemoteCallEvent);
module.exports = Runtime.Core.RemoteCallEvent;