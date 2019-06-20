/**
 * @dancy
 * @createAt 2019-06-17
 * @type {{getElemsByClass, getNowDateStr, getElemStyle, removeClass, getElemsByTagName, getElemByClass, mousewheel, setOptions, isEmptyObj, getElemById, ajax, addClass}}
 */
var Util = (function(){
    return {
        getElemByClass: function (className) {
            return document.getElementsByClassName(className)[0];
        },
        getElemById: function (id) {
            return document.getElementById(id);
        },
        getElemsByClass: function (className) {
            return document.getElementsByClassName(className);
        },
        getElemsByTagName: function (tagName) {
            return document.getElementsByTagName(tagName);
        },
        mousewheel: function(dom, callback, bool) {
            var type = "mousewheel";
            if(dom.onmousewheel === undefined) {
                // 兼容firefox滚轮事件，事件类型为DOMMouseScroll且只能使用DOM2级事件绑定
                type = "DOMMouseScroll";
            }

            function fn(e) {
                /* 滚轮滚动方向
                 * firefox：e.detail
                 * IE/Chrome等：e.wheelDelta
                 */
                var e = e || window.event;

                // firefox滚轮事件滚动方向兼容
                if(!e.wheelDelta) {
                    e.wheelDelta = e.detail/-3*120;
                }

                if(!!bool) {
                    if(e.preventDefault) {
                        e.preventDefault()
                    } else {
                        //IE 阻止默认事件兼容
                        e.returnValue = false;
                    }
                }

                callback && callback.call(this, e);
            }

            if(dom.addEventListener) {
                dom.addEventListener(type, fn)
            } else {
                // IEDOM2级事件绑定兼容
                dom.attachEvent("on" + type, fn)
            }
        },
        removeClass: function(elem, target, className) {
            var lis = elem.querySelectorAll(target);
            for(var i = 0; i < lis.length; i ++) {
                lis[i].classList.remove(className);
            }
        },
        addClass: function(elem, target, className) {
            var lis = elem.querySelectorAll(target);
            for(var i = 0; i < lis.length; i ++) {
                lis[i].classList.add(className);
            }
        },
        getNowDateStr: function() {
            var date = new Date(Date.now());
            var dateStr = date.getFullYear() + " 年 " + (date.getMonth() + 1) + " 月 " + date.getDate() +" 日";
            return dateStr;
        },
        getElemStyle: function(elem, style) {
            if(elem.currentStyle){
                return (elem.currentStyle[style] * window.innerWidth)/100;
            }else{
                return getComputedStyle(elem, false)[style];
            }
        },
        ajax: function(options) {
            var method = options.method || 'get';
            var url = options.url || '';
            var succFn = options.success || function(){console.log('请求成功！')};
            var data = options.data || null;
            var isAsync = options.async === undefined ? true : options.async;

            if (data && method.toLowerCase() === 'get') {
                url += '?';
                for(var key in data) {
                    url += key + "=" + data[key] + "&";
                }
                url = url.slice(0, url.length - 1);
            }

            var ajax = null;
            if(window.XMLHttpRequest) {
                ajax = new XMLHttpRequest();
            }
            else {
                ajax = new ActiveXObject("Microsoft.XMLHTTP");
            }

            ajax.open(method, url, isAsync);

            if(method.toLowerCase() === 'post') {
                ajax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                if(data) {
                    ajax.send(data);
                } else {
                    ajax.send();
                }

            }

            if(method.toLowerCase() === 'get') {
                ajax.send();
            }

            ajax.onreadystatechange = function () {
                if (ajax.readyState==4 && ajax.status==200) {
                    succFn(ajax);
                }
            }
        },
        setOptions: function(selector, data, text) {
            var options = '<option value="">' + text + '</option>';
            for(var key in data) {
                options += '<option value="' + key + '">' + data[key] + '</option>';
            }
            selector.innerHTML = options;
        },
        isEmptyObj: function(obj){
            for(var key in obj){
                return false
            }
            return true;
        }
    }
})()