webpackJsonp([54],{PTVn:function(e,t,a){"use strict";var u=a("ouCL");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n=u(a("+TWC")),o=(a("0xDb"),{namespace:"publish",state:{submitting:!1,publishType:"",photo:{images:[],thumb:""},article:{content:"",thumb:""},question:{title:"",content:"",thumb:"",topics:""},answer:{content:"",thumb:""}},effects:{},reducers:{changePublishType:function(e,t){var a=t.payload;return(0,n.default)({},e,{publishType:a.publishType})},saveArticle:function(e,t){var a=t.payload;return(0,n.default)({},e,{article:(0,n.default)({},e.article,a)})},savePhoto:function(e,t){var a=t.payload;return(0,n.default)({},e,{photo:(0,n.default)({},e.photo,a)})},saveQuestion:function(e,t){var a=t.payload;return(0,n.default)({},e,{question:(0,n.default)({},e.question,a)})},saveAnswer:function(e,t){var a=t.payload;return(0,n.default)({},e,{answer:(0,n.default)({},e.answer,a)})}}});t.default=o}});