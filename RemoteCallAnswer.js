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
Runtime.Core.RemoteCallAnswer = function(ctx)
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
Runtime.Core.RemoteCallAnswer.prototype = Object.create(use("Runtime.BaseStruct").prototype);
Runtime.Core.RemoteCallAnswer.prototype.constructor = Runtime.Core.RemoteCallAnswer;
Object.assign(Runtime.Core.RemoteCallAnswer.prototype,
{
	/**
	 * Returns true if success
	 * @return bool
	 */
	isSuccess: function(ctx)
	{
		var __v0 = use("Runtime.rtl");
		return this.have_answer && this.code >= __v0.ERROR_OK;
	},
	/**
	 * Returns true if success
	 * @return bool
	 */
	getMessage: function(ctx)
	{
		return (this.isSuccess(ctx)) ? (this.success_message) : (this.error_message);
	},
	_init: function(ctx)
	{
		var defProp = use('Runtime.rtl').defProp;
		var a = Object.getOwnPropertyNames(this);
		this.app_name = "self";
		this.object_name = "";
		this.interface_name = "default";
		this.method_name = "";
		this.code = 0;
		this.success_message = "";
		this.error_message = "";
		this.error_name = "";
		this.error_trace = "";
		this.logs = null;
		this.have_answer = false;
		this.response = null;
		this.new_cookies = use("Runtime.Dict").from({});
		this.new_headers = use("Runtime.Collection").from([]);
		this.new_http_code = 200;
		use("Runtime.BaseStruct").prototype._init.call(this,ctx);
	},
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Core.RemoteCallAnswer"))
		{
			this.app_name = o.app_name;
			this.object_name = o.object_name;
			this.interface_name = o.interface_name;
			this.method_name = o.method_name;
			this.code = o.code;
			this.success_message = o.success_message;
			this.error_message = o.error_message;
			this.error_name = o.error_name;
			this.error_trace = o.error_trace;
			this.logs = o.logs;
			this.have_answer = o.have_answer;
			this.response = o.response;
			this.new_cookies = o.new_cookies;
			this.new_headers = o.new_headers;
			this.new_http_code = o.new_http_code;
		}
		use("Runtime.BaseStruct").prototype.assignObject.call(this,ctx,o);
	},
	assignValue: function(ctx,k,v)
	{
		if (k == "app_name")this.app_name = v;
		else if (k == "object_name")this.object_name = v;
		else if (k == "interface_name")this.interface_name = v;
		else if (k == "method_name")this.method_name = v;
		else if (k == "code")this.code = v;
		else if (k == "success_message")this.success_message = v;
		else if (k == "error_message")this.error_message = v;
		else if (k == "error_name")this.error_name = v;
		else if (k == "error_trace")this.error_trace = v;
		else if (k == "logs")this.logs = v;
		else if (k == "have_answer")this.have_answer = v;
		else if (k == "response")this.response = v;
		else if (k == "new_cookies")this.new_cookies = v;
		else if (k == "new_headers")this.new_headers = v;
		else if (k == "new_http_code")this.new_http_code = v;
		else use("Runtime.BaseStruct").prototype.assignValue.call(this,ctx,k,v);
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "app_name")return this.app_name;
		else if (k == "object_name")return this.object_name;
		else if (k == "interface_name")return this.interface_name;
		else if (k == "method_name")return this.method_name;
		else if (k == "code")return this.code;
		else if (k == "success_message")return this.success_message;
		else if (k == "error_message")return this.error_message;
		else if (k == "error_name")return this.error_name;
		else if (k == "error_trace")return this.error_trace;
		else if (k == "logs")return this.logs;
		else if (k == "have_answer")return this.have_answer;
		else if (k == "response")return this.response;
		else if (k == "new_cookies")return this.new_cookies;
		else if (k == "new_headers")return this.new_headers;
		else if (k == "new_http_code")return this.new_http_code;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,ctx,k,d);
	},
	getClassName: function(ctx)
	{
		return "Runtime.Core.RemoteCallAnswer";
	},
});
Object.assign(Runtime.Core.RemoteCallAnswer, use("Runtime.BaseStruct"));
Object.assign(Runtime.Core.RemoteCallAnswer,
{
	/**
	 * Set success result
	 * @param primitive res
	 * @return Message
	 */
	success: function(ctx, answer, response, message, code)
	{
		if (response == undefined) response = null;
		if (message == undefined) message = "";
		if (code == undefined) code = 1;
		return answer.copy(ctx, use("Runtime.Dict").from({"code":code,"error_message":"","success_message":message,"response":response,"have_answer":true}));
	},
	/**
	 * Set fail result
	 * @param primitive res
	 * @return Message
	 */
	fail: function(ctx, answer, response, error, code, error_name)
	{
		if (error == undefined) error = "";
		if (code == undefined) code = -1;
		if (error_name == undefined) error_name = "";
		return answer.copy(ctx, use("Runtime.Dict").from({"code":code,"error_message":error,"error_name":error_name,"response":response,"have_answer":true}));
	},
	/**
	 * Set exception
	 * @param primitive res
	 * @return Message
	 */
	exception: function(ctx, answer, e)
	{
		answer = answer.copy(ctx, use("Runtime.Dict").from({"code":e.getErrorCode(ctx),"error_message":e.getErrorMessage(ctx),"error_name":e.getClassName(ctx),"response":null,"have_answer":true}));
		var __v0 = use("Runtime.Core.ApiException");
		if (e instanceof __v0)
		{
			answer = Runtime.rtl.setAttr(ctx, answer, Runtime.Collection.from(["response"]), e.response);
		}
		return answer;
	},
	/**
	 * End pipe
	 */
	end: function(ctx, m)
	{
		if (m.err == null)
		{
			return m;
		}
		var __v0 = use("Runtime.Monad");
		var __v1 = use("Runtime.Core.Message");
		return new __v0(ctx, new __v1(ctx, use("Runtime.Dict").from({"error_message":m.err.getErrorMessage(ctx),"error_name":m.err.getClassName(ctx),"code":m.err.getErrorCode(ctx),"response":m.err})));
	},
	/**
	 * Add cookie
	 */
	addCookie: function(ctx, answer, cookie)
	{
		var cookie_name = Runtime.rtl.get(ctx, cookie, "name");
		if (answer.new_cookies == null)
		{
			var __v0 = use("Runtime.Dict");
			answer = Runtime.rtl.setAttr(ctx, answer, Runtime.Collection.from(["new_cookies"]), new __v0(ctx));
		}
		answer = Runtime.rtl.setAttr(ctx, answer, Runtime.Collection.from(["new_cookies"]), answer.new_cookies.setIm(ctx, cookie_name, cookie));
		return answer;
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime.Core";
	},
	getCurrentClassName: function()
	{
		return "Runtime.Core.RemoteCallAnswer";
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
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": "Runtime.Core.RemoteCallAnswer",
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
			a.push("code");
			a.push("success_message");
			a.push("error_message");
			a.push("error_name");
			a.push("error_trace");
			a.push("logs");
			a.push("have_answer");
			a.push("response");
			a.push("new_cookies");
			a.push("new_headers");
			a.push("new_http_code");
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
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "object_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "interface_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "method_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "code") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "success_message") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "error_message") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "error_name") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "error_trace") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "logs") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "have_answer") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "response") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "new_cookies") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "new_headers") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		if (field_name == "new_http_code") return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_FIELD,
			"class_name": "Runtime.Core.RemoteCallAnswer",
			"name": field_name,
			"annotations": Collection.from([
			]),
		});
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a = [
			"addCookie",
		];
		return use("Runtime.Collection").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Runtime.Core.RemoteCallAnswer);
module.exports = Runtime.Core.RemoteCallAnswer;