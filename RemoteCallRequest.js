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
Runtime.Core.RemoteCallRequest = function(ctx)
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
Runtime.Core.RemoteCallRequest.prototype = Object.create(use("Runtime.BaseStruct").prototype);
Runtime.Core.RemoteCallRequest.prototype.constructor = Runtime.Core.RemoteCallRequest;
Object.assign(Runtime.Core.RemoteCallRequest.prototype,
{
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		this.app_name = "self";
		this.object_name = "";
		this.interface_name = "default";
		this.method_name = "";
		this.data = null;
		this.storage = null;
		use("Runtime.BaseStruct").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Core.RemoteCallRequest"))
		{
			this.app_name = o.app_name;
			this.object_name = o.object_name;
			this.interface_name = o.interface_name;
			this.method_name = o.method_name;
			this.data = o.data;
			this.storage = o.storage;
		}
		use("Runtime.BaseStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "app_name")this.app_name = v;
		else if (k == "object_name")this.object_name = v;
		else if (k == "interface_name")this.interface_name = v;
		else if (k == "method_name")this.method_name = v;
		else if (k == "data")this.data = v;
		else if (k == "storage")this.storage = v;
		else use("Runtime.BaseStruct").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "app_name")return this.app_name;
		else if (k == "object_name")return this.object_name;
		else if (k == "interface_name")return this.interface_name;
		else if (k == "method_name")return this.method_name;
		else if (k == "data")return this.data;
		else if (k == "storage")return this.storage;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Core.RemoteCallRequest";
	},
});
Object.assign(Runtime.Core.RemoteCallRequest, use("Runtime.BaseStruct"));
Object.assign(Runtime.Core.RemoteCallRequest,
{
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime.Core";
	},
	getCurrentClassName: function()
	{
		return "Runtime.Core.RemoteCallRequest";
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
			"class_name": "Runtime.Core.RemoteCallRequest",
			"name": "Runtime.Core.RemoteCallRequest",
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
			a.push("app_name");
			a.push("object_name");
			a.push("interface_name");
			a.push("method_name");
			a.push("data");
			a.push("storage");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.IntrospectionInfo");
		if (field_name == "app_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallRequest",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "object_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallRequest",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "interface_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallRequest",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "method_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallRequest",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "data") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallRequest",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "storage") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallRequest",
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
});use.add(Runtime.Core.RemoteCallRequest);
module.exports = Runtime.Core.RemoteCallRequest;