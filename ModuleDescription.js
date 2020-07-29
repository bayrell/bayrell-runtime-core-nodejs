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
if (typeof Runtime.Web == 'undefined') Runtime.Web = {};
Runtime.Web.ModuleDescription = function(ctx)
{
};
Object.assign(Runtime.Web.ModuleDescription.prototype,
{
	assignObject: function(ctx,o)
	{
		if (o instanceof use("Runtime.Web.ModuleDescription"))
		{
		}
	},
	assignValue: function(ctx,k,v)
	{
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
	},
	getClassName: function(ctx)
	{
		return "Runtime.Web.ModuleDescription";
	},
});
Object.assign(Runtime.Web.ModuleDescription,
{
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleName: function(ctx)
	{
		return "Runtime.Web";
	},
	/**
	 * Returns module name
	 * @return string
	 */
	getModuleVersion: function(ctx)
	{
		return "0.9.3";
	},
	/**
	 * Returns required modules
	 * @return Dict<string>
	 */
	requiredModules: function(ctx)
	{
		return use("Runtime.Dict").from({"Runtime":">=0.3","Runtime.Web":"*"});
	},
	/**
	 * Returns module files load order
	 * @return Collection<string>
	 */
	assets: function(ctx)
	{
		return use("Runtime.Collection").from(["Runtime.Web/ApiContainer","Runtime.Web/Cookie","Runtime.Web/RenderContainer","Runtime.Web/RenderHelper","Runtime.Web/Request","Runtime.Web/Response","Runtime.Web/Annotations/ApiList","Runtime.Web/Annotations/ApiMethod","Runtime.Web/Annotations/Route","Runtime.Web/Annotations/RouteList","Runtime.Web/Annotations/RouteMiddleware","Runtime.Web/Annotations/Template","Runtime.Web/Events/UIEvent","Runtime.Web/Events/WebEvent","Runtime.Web/Events/BlurEvent","Runtime.Web/Events/ChangeEvent","Runtime.Web/Events/FocusEvent","Runtime.Web/Events/KeyboardEvent","Runtime.Web/Events/KeyDownEvent","Runtime.Web/Events/KeyPressEvent","Runtime.Web/Events/KeyUpEvent","Runtime.Web/Events/MouseEvent","Runtime.Web/Events/MouseClickEvent","Runtime.Web/Events/MouseContextMenuEvent","Runtime.Web/Events/MouseDoubleClickEvent","Runtime.Web/Events/MouseDownEvent","Runtime.Web/Events/MouseEnterEvent","Runtime.Web/Events/MouseLeaveEvent","Runtime.Web/Events/MouseMoveEvent","Runtime.Web/Events/MouseOutEvent","Runtime.Web/Events/MouseOverEvent","Runtime.Web/Events/MouseUpEvent","Runtime.Web/Events/MouseWheelEvent","Runtime.Web/Frontend/Component","Runtime.Web/Frontend/Layout","Runtime.Web/Frontend/LayoutModel","Runtime.Web/Frontend/SeoModel","Runtime.Web/RedirectResponse","Runtime.Web/JsonResponse","Runtime.Web/ModuleDescription"]);
	},
	/**
	 * Returns enities
	 */
	entities: function(ctx)
	{
		var __v0 = use("Runtime.Annotations.LambdaChainDeclare");
		var __v1 = use("Runtime.Web.RenderHelper");
		var __v2 = use("Runtime.Annotations.LambdaChainDeclare");
		var __v3 = use("Runtime.Web.RenderHelper");
		return use("Runtime.Collection").from([new __v0(ctx, use("Runtime.Dict").from({"name":__v1.LAYOUT_CHAIN})),new __v2(ctx, use("Runtime.Dict").from({"name":__v3.PATTERN_CHAIN}))]);
	},
	/**
	 * Returns sync loaded files
	 */
	resources: function(ctx)
	{
		return null;
	},
	/* ======================= Class Init Functions ======================= */
	getCurrentNamespace: function()
	{
		return "Runtime.Web";
	},
	getCurrentClassName: function()
	{
		return "Runtime.Web.ModuleDescription";
	},
	getParentClassName: function()
	{
		return "";
	},
	getClassInfo: function(ctx)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
		return new IntrospectionInfo(ctx, {
			"kind": IntrospectionInfo.ITEM_CLASS,
			"class_name": "Runtime.Web.ModuleDescription",
			"name": "Runtime.Web.ModuleDescription",
			"annotations": Collection.from([
			]),
		});
	},
	getFieldsList: function(ctx, f)
	{
		var a = [];
		if (f==undefined) f=0;
		return use("Runtime.Collection").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Collection = use("Runtime.Collection");
		var Dict = use("Runtime.Dict");
		var IntrospectionInfo = use("Runtime.Annotations.IntrospectionInfo");
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
		use("Runtime.Interfaces.ModuleDescriptionInterface"),
		use("Runtime.Interfaces.AssetsInterface"),
	],
});use.add(Runtime.Web.ModuleDescription);
if (module.exports == undefined) module.exports = {};
if (module.exports.Runtime == undefined) module.exports.Runtime = {};
if (module.exports.Runtime.Web == undefined) module.exports.Runtime.Web = {};
module.exports.Runtime.Web.ModuleDescription = Runtime.Web.ModuleDescription;