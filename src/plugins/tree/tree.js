/**
 * Created by Dancy at 2019/6/20
 *
 * @type {{init, getTree, toggleCollapsed, bindHoverStyle, renderTree, setStyle, bindCollapsedEvent, bindNodeEvent, setOtherStyle, setIconStyle, bindEvent}}
 */
var DTree = (function () {
    return {
        init: function (elem, params) {
            this.elem = elem || null;
            this.data = params.data || [];
            this.style = params.style || {};
            this.default = params.default || 'collapsed';
            this.checkedColor = params.checkedColor || '#FF5246';
            this.iconSize = params.iconSize || '20px';
            this.hoverColor = params.hoverColor || params.checkedColor || '#FF5246';

            this.onClick = params.onClick || function(){};

            this.renderTree(this.data);
            this.setStyle();
            this.bindHoverStyle();
            this.bindCollapsedEvent();
            this.bindNodeEvent();

        },
        renderTree: function (tree) {
            if (!tree.length) {
                return false;
            }
            var defaultClass = this.default === "open" ? "collapsed" : "has-collapsed";

            var treeHtml = this.getTree(tree, defaultClass);
            this.elem.innerHTML = treeHtml;
            this.setOtherStyle();
        },
        getTree: function (node, className, hidden) {
            var html = '<ul class="' + hidden + '">';
            for (var i = 0; i < node.length; i++) {
                html += ' <li class="d-tree-node">';
                if (node[i].children) {
                    html += '<span class="' + className + '"></span>';
                    html += '<span class="' + node[i].type + '"></span>';
                    html += '<span class="node-name" data-id="' + node[i].id + '" data-type="' + node[i].type + '">' + node[i].name + '</span>';
                    if (className === "collapsed") {
                        html += this.getTree(node[i].children, className);
                    } else {
                        html += this.getTree(node[i].children, className, 'hidden');
                    }

                } else {
                    html += '<span class="' + node[i].type + '"></span>';
                    html += '<span class="node-name" data-id="' + node[i].id + '" data-type="' + node[i].type + '">' + node[i].name + '</span>';
                    html += '</li>';
                }
            }
            html += '</ul>';
            return html;
        },
        setStyle: function () {
            var style = this.style;
            for (var key in style) {
                var styleType = this.elem.style[key];
                if (styleType !== undefined) {
                    this.elem.style[key] = style[key];
                }

            }
        },
        setOtherStyle: function () {
            var folders = this.elem.querySelectorAll('.d-tree .folder');
            var docs = this.elem.querySelectorAll('.d-tree .doc');
            var excels = this.elem.querySelectorAll('.d-tree .excel');
            var pdfs = this.elem.querySelectorAll('.d-tree .pdf');

            this.setIconStyle(folders);
            this.setIconStyle(docs);
            this.setIconStyle(excels);
            this.setIconStyle(pdfs);
        },
        setIconStyle: function(elems) {
            if(!elems.length) return false;

            for(var i = 0; i < elems.length; i ++) {
                elems[i].style.width = this.iconSize;
            }
        },
        bindHoverStyle: function() {
            var that = this;
            this.bindEvent('mouseover', 'node-name', function (target) {
                if(!target.classList.contains('checked')) {
                    target.style.color = that.hoverColor;
                }
            })
            this.bindEvent('mouseout', 'node-name', function (target) {
                if(!target.classList.contains('checked')) {
                    target.style.color = that.style.color || '#fff';
                }
            })
        },
        bindCollapsedEvent: function () {
            var that = this;
            this.bindEvent('click', 'collapsed', function (target) {
                that.toggleCollapsed(target);
            })
            this.bindEvent('click', 'has-collapsed', function (target) {
                that.toggleCollapsed(target);
            })
        },
        toggleCollapsed: function (target) {
            target.parentNode.querySelector('ul').classList.toggle('hidden');
            target.classList.toggle('collapsed', !target.classList.contains('collapsed'));
            target.classList.toggle('has-collapsed', !target.classList.contains('has-collapsed'));
        },
        bindNodeEvent: function () {
            var that = this;
            var elem = this.elem;

            this.bindEvent('click', 'node-name', function (target) {
                var hasCheckedElem = elem.querySelector('.checked');
                if (hasCheckedElem) {
                    hasCheckedElem.classList.remove('checked');
                    hasCheckedElem.style.color = that.style.color || "#fff";
                }
                target.classList.add('checked');
                target.style.color = that.checkedColor;
                that.onClick({
                    id: target.getAttribute('data-id'),
                    name: target.innerText,
                    type: target.getAttribute('data-type')
                })
            })
        },
        bindEvent: function (eventType, className, fn) {
            var treeElem = this.elem;

            var elems = treeElem.querySelectorAll('.' + className);

            if (!elems.length) return false;

            for (var i = 0; i < elems.length; i++) {
                (function () {
                    elems[i].addEventListener(eventType, function () {
                        fn(this);
                    })
                })()
            }
        }
    }
})()