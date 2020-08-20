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
Runtime.Core.Message = function(ctx, data, object_name, message_id)
{
	if (object_name == undefined) object_name = "";
	if (message_id == undefined) message_id = "";
	use("Runtime.BaseObject").call(this, ctx);
	/* Set property */
	this.data = data;
	this.object_name = object_name;
	var __v0 = use("Runtime.rtl");
	this.message_id = (message_id != "") ? (message_id) : (__v0.unique(ctx));
	var __v1 = use("Runtime.Map");
	this.tags = new __v1(ctx);
};
Runtime.Core.Message.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Core.Message.prototype.constructor = Runtime.Core.Message;
Object.assign(Runtime.Core.Message.prototype,
{
	/**
	 * Read property
	 */
	getMessageID: function(ctx)
	{
		return this.message_id;
	},
	getObjectName: function(ctx)
	{
		return this.object_name;
	},
	isCancel: function(ctx)
	{
		return this.is_cancel;
	},
	getData: function(ctx)
	{
		return this.data;
	},
	/**
	 * Cancel Message
	 */
	cancel: function(ctx)
	{
		this.is_cancel = true;
	},
	_init: function(ctx)
	{
		this.message_id = "";
		this.object_name = "";
		this.is_cancel = false;
		this.data = null;
		this.tags = null;
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Core.Message"))
		{
			this.message_id = o.message_id;
			this.object_name = o.object_name;
			this.is_cancel = o.is_cancel;
			this.data = o.data;
			this.tags = o.tags;
		}
		use("Runtime.BaseObject").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "message_id")this.message_id = v;
		else if (k == "object_name")this.object_name = v;
		else if (k == "is_cancel")this.is_cancel = v;
		else if (k == "data")this.data = v;
		else if (k == "tags")this.tags = v;
		else use("Runtime.BaseObject").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "message_id")return this.message_id;
		else if (k == "object_name")return this.object_name;
		else if (k == "is_cancel")return this.is_cancel;
		else if (k == "data")return this.data;
		else if (k == "tags")return this.tags;
		return use("Runtime.BaseObject").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Core.Message";
	},
});
Object.assign(Runtime.Core.Message, use("Runtime.BaseObject"));
Object.assign(Runtime.Core.Message,
{
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime.Core";
	},
	getCurrentClassName: function()
	{
		return "Runtime.Core.Message";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Runtime.Core.Message",
			"name": "Runtime.Core.Message",
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
			a.push("message_id");
			a.push("object_name");
			a.push("is_cancel");
			a.push("data");
			a.push("tags");
		}
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		if (field_name == "message_id") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Message",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "object_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Message",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "is_cancel") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Message",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "data") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Message",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "tags") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Message",
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
});use.add(Runtime.Core.Message);
module.exports = Runtime.Core.Message;