define(
	[
		"dojo/_base/declare",
		"mxui/widget/_WidgetBase",
		"mxui/dom",
		"dojo/dom",
		"dojo/dom-prop",
		"dojo/dom-geometry",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/dom-construct",
		"dojo/_base/array",
		"dojo/_base/lang",
		"dojo/text",
		"dojo/html",
		"dojo/_base/event",
	],
	function(
		declare,
		_WidgetBase,
		dom,
		dojoDom,
		dojoProp,
		dojoGeometry,
		dojoClass,
		dojoStyle,
		dojoConstruct,
		dojoArray,
		lang,
		dojoText,
		dojoHtml,
		dojoEvent
	){
		"use strict";
		return declare(
			"mxpagechange.widget.mxpagechange",[
				_WidgetBase
			],
			{
				_handles: null,
				_contextObj: null,
				constructor: function () {
					this._handles = [];
				},
				postCreate: function () {
				},
				update: function (obj, callback) {
					this._contextObj = obj;
					this._updateRendering(callback);
				},
				resize: function (box) {
				},
				uninitialize: function () {
				},
				_updateRendering: function (callback) {
					try{
						//--------------------------------------------------------------------------------
						//obtain content form [based on version]
						//--------------------------------------------------------------------------------
						var mxv=[];
						mx.version.split('.').forEach(function(a,b){
						   mxv.push(parseInt(a));
						});
						this.pagechangecf=null;
						switch(mxv[0]){
							//todo: obtain version specific content form acquisition details
							case 7:
								if(mxv[1]<12){
									this.pagechangecf=mx.router._contentForm;
								}else{
									this.pagechangecf=mx.ui.getContentForm();
								}
								break;
							default:
								console.error("pagechange: unsupported mx major version");
						};
						//--------------------------------------------------------------------------------
						if(this.pagechangecf!=null){
							//------------------------------------------------------------------------
							//setup callback
							//------------------------------------------------------------------------
							this.pagechangecb=function(){
								if(this._contextObj!=null){
									//alter app name
									if(this.attr_appname!=null){
										try{
											//------------------------------------------------
											//set title
											//------------------------------------------------
											document.title=
												this._contextObj.get(this.attr_appname)+
												//" - "+			//avoid api changes as follows
												//mx.ui.getContentForm().title	//...
												document.title.substring(document.title.indexOf("-")-1);
											;
										}catch(e){
											console.error("pagechange: "+e.toString());
										}
									}
									if(this.mf_pagechange!=null){
										if(this.attr_curpage!=null){
											this._contextObj.set(this.attr_curpage,mx.router._contentForm.path);
										}
										this._execMf(this.mf_pagechange,this._contextObj.getGuid(),function(){});
									}
								}else{
									console.error("pagechange: contextObj NULL");
									//-------------------------------------------------------
									//remove handler
									//-------------------------------------------------------
									if(this.pagechangehdl!=null){
									    dojo.disconnect(this.pagechangehdl);
									}
								}
							};
							//------------------------------------------------------------------------
							//initial call
							//------------------------------------------------------------------------
							this.pagechangecb();
							//------------------------------------------------------------------------
							//dettach
							//------------------------------------------------------------------------
							if(this.pagechangehdl!=null){
							    dojo.disconnect(this.pagechangehdl);
							}
							//------------------------------------------------------------------------
							//attach
							//------------------------------------------------------------------------
							this.pagechangehdl=this.connect(
								this.pagechangecf,//mx.ui.getContentForm(),
								"onNavigation",
								this.pagechangecb//dojo.hitch(this.pagechangecb,this)
							);
						}else{
							console.error("pagechange: failed to obtain content form");
						}
					}catch(e){
						console.error("pagechange: "+e.toString());
					}
					if (this._contextObj !== null) {
						dojoStyle.set(this.domNode, "display", "block");
					} else {
						dojoStyle.set(this.domNode, "display", "none");
					}

					this._executeCallback(callback, "_updateRendering");
				},
				_execMf: function (mf, guid, cb) {
					if (mf && guid) {
						mx.ui.action(mf, {
							params: {
								applyto: "selection",
								guids: [guid]
							},
							callback: lang.hitch(this, function (objs) {
								if (cb && typeof cb === "function") {
									cb(objs);
								}
							}),
							error: function (error) {
								console.debug(error.description);
							}
						}, this);
					}
				},
				_executeCallback: function (cb, from) {
					if (cb && typeof cb === "function") {
						cb();
					}
				}
			}
		);
	}
);
require(["mxpagechange/widget/mxpagechange"]);

