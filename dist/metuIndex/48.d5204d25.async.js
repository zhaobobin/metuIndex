webpackJsonp([48],{"5lke":function(t,e){function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(e){return"function"==typeof Symbol&&"symbol"===o(Symbol.iterator)?t.exports=n=function(t){return o(t)}:t.exports=n=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":o(t)},n(e)}t.exports=n},"95ke":function(t,e){function o(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}t.exports=o},F6AD:function(t,e,o){function n(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?u(t):e}var r=o("5lke"),u=o("95ke");t.exports=n},Q9dM:function(t,e){function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}t.exports=o},QwVp:function(t,e,o){function n(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&r(t,e)}var r=o("j76U");t.exports=n},fghW:function(t,e){function o(e){return t.exports=o=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},o(e)}t.exports=o},j76U:function(t,e){function o(e,n){return t.exports=o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},o(e,n)}t.exports=o},wY2f:function(t,e,o){"use strict";var n=o("ouCL");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r,u,i=n(o("Q9dM")),c=n(o("wm7F")),a=n(o("F6AD")),f=n(o("fghW")),l=n(o("QwVp")),s=n(o("GiK3")),p=o("S6G3"),y=o("7xWd"),b=(r=(0,p.connect)(function(t){return{global:t.global}}))(u=function(t){function e(t){var o;return(0,i.default)(this,e),o=(0,a.default)(this,(0,f.default)(e).call(this,t)),o.ajaxFlag=!0,o.state={loading:!0,list:"",count:0},o}return(0,l.default)(e,t),(0,c.default)(e,[{key:"componentDidMount",value:function(){var t=this.props.global.profileUser._id;this.queryList(t)}},{key:"queryList",value:function(t){var e=this;this.ajaxFlag&&(this.ajaxFlag=!1,this.props.dispatch({type:"global/request",url:"/users/".concat(t,"/following"),method:"GET",payload:{},callback:function(t){setTimeout(function(){e.ajaxFlag=!0},500),0===t.code?e.setState({loading:!1,list:t.data.list,count:t.data.count}):e.props.dispatch(y.routerRedux.push("/404"))}}))}},{key:"render",value:function(){return s.default.createElement("div",null,"\u5173\u6ce8")}}]),e}(s.default.Component))||u;e.default=b},wm7F:function(t,e){function o(t,e){for(var o=0;o<e.length;o++){var n=e[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function n(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t}t.exports=n}});