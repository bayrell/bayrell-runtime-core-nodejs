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
Runtime.Core.Message = function(ctx)
{
	use("Runtime.CoreStruct").apply(this, arguments);
};
Runtime.Core.Message.prototype = Object.create(use("Runtime.CoreStruct").prototype);
Runtime.Core.Message.prototype.constructor = Runtime.Core.Message;
Object.assign(Runtime.Core.Message.prototype,
{
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		var __v0 = use("Runtime.Dict");
		this.message_id = "";
		this.is_external = false;
		this.dict = new __v0(ctx);
		use("Runtime.CoreStruct").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Core.Message"))
		{
			this.message_id = o.message_id;
			this.is_external = o.is_external;
			this.dict = o.dict;
		}
		use("Runtime.CoreStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "message_id")this.message_id = v;
		else if (k == "is_external")this.is_external = v;
		else if (k == "dict")this.dict = v;
		else use("Runtime.CoreStruct").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "message_id")return this.message_id;
		else if (k == "is_external")return this.is_external;
		else if (k == "dict")return this.dict;
		return use("Runtime.CoreStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Core.Message";
	},
});
Object.assign(Runtime.Core.Message, use("Runtime.CoreStruct"));
Object.assign(Runtime.Core.Message,
{
	/**
	 * Set message id
	 */
	setMessageId: function(ctx, msg)
	{
		if (msg.message_id == "")
		{
			var __v0 = use("Runtime.rtl");
			msg = Runtime.rtl.setAttr(ctx, msg, Runtime.Collection.from(["message_id"]), __v0.unique(ctx));
		}
		return msg;
	},
	/**
	 * Create message
	 */
	create: function(ctx, items)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, this.newInstance(ctx, items));
		var __v2 = use("Runtime.Core.Message");
		__v1 = __v1.call(ctx, __v2.setMessageId.bind(__v2));
		return __v1.value(ctx);
	},
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
		return "Runtime.CoreStruct";
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
		if ((f|3)==3)
		{
			a.push("message_id");
			a.push("is_external");
			a.push("dict");
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
		if (field_name == "is_external") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.Message",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "dict") return new IntrospectionInfo(ctx, {
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