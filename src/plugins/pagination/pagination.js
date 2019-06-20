/**
 * @type {{init, render, _renderFixedBar, _calcPage, _renderPage, _renderMorePage, _createElem, _validBetweenPage}}
 * @dancy
 * @createAt 2019-01-24
 *
 * @update 2019-01-25
 * 1. 修改renderPage渲染模式，添加_calcPage页码计算
 * 2. 新增配置项betweenPage，分页条显示页码数量配置，默认为4。取值范围[1-(totalPage-3)] 超出范围默认为totalPage-3
 * 3. 修改分页条鼠标hover样式
 */
var DPagination = (function(){
	return {
		init: function(elem, options) {
			this.$pagination = elem;
			this._currentPage = options.currentPage || 1;
			this._totalPage =  options.totalPage || 0;
			this._betweenPage = options.betweenPage || 4;

			this._validBetweenPage();
			console.log(this)
			this.render()

		},
		render: function() {
			this._renderFixedBar();
			this._calcPage();
			this._renderPage();
		},
		_renderFixedBar: function() {
			var pagination = document.createDocumentFragment();
			var ul = document.createElement('ul');

			ul.className = 'pagination';
			this.$ul = ul;

			var fixedBar = [
				{
					name: '首页',
					className: 'first'
				},
				{
					name: '上一页',
					className: 'prev'
				},
				{
					name: '下一页',
					className: 'next'
				},
				{
					name: '尾页',
					className: 'last'
				},
			]

			for(var i = 0; i < fixedBar.length; i ++) {
				var li = this._createElem({
					type: 'li',
					children: {
						type: 'a',
						text: fixedBar[i].name,
						className: fixedBar[i].className
					},
				})
				this.$ul.appendChild(li);
				this['$' + fixedBar[i].className] = li;
			}
			pagination.appendChild(this.$ul)
			this.$pagination.appendChild(pagination)
		},
		_calcPage: function() {
			var totalPage = this._totalPage;
			var currentPage = this._currentPage;
			var between = this._betweenPage - 1;

			var startPage = 1;
			var endPage = startPage + between;
			var morePage = totalPage - 1;

			if(currentPage >= endPage) {
				startPage = currentPage - 1;
				endPage = startPage + between;
				morePage = endPage - 1;

				if(totalPage - currentPage < between + 1) {
					startPage = totalPage - between;
					endPage =totalPage;
					morePage = 2;
					this._isFront = true;
				}
			}

			if(endPage >= totalPage - 1) {
				endPage = totalPage;
			}

			this._startPage = startPage;
			this._endPage = endPage;
			this._morePage = morePage;
		},
		_renderPage: function() {
			var startPage = this._startPage;
			var endPage = this._endPage;
			var morePage = this._morePage;

			var page = document.createDocumentFragment();

			if(this._isFront) {
				this._renderMorePage(page)
			}

			for(var i = startPage; i <= endPage; i ++) {
				var className = this._currentPage == i ? 'current' : '';
				var li = this._createElem({
					type: 'li',
					children: {
						type: 'a',
						text: i,
						className: className
					},
				})
				page.appendChild(li)
			}

			if(!this._isFront) {
				this._renderMorePage(page)
			}

			this.$ul.insertBefore(page, this.$next)
		},
		_renderMorePage: function(page) {
			var text = 1;

			if(!this._isFront) {
				text = this._totalPage;
			}
			var li = this._createElem({
				type: 'li',
				children: {
					type: 'a',
					text: text,
					className: ''
				},
			})
			var more = this._createElem({
				type: 'li',
				children: {
					type: 'a',
					text: '···',
					className: 'more'
				},
			})
			if(!this._isFront) {
				page.appendChild(more)
				page.appendChild(li)
			} else {
				page.appendChild(li)
				page.appendChild(more)
			}
		},
		_createElem: function(params) {
			var elem = document.createElement(params.type);
			var children = params.children;
			if(!children) {
				elem.innerText = params.text;
				elem.className = params.className
				return elem;
			}
			elem.appendChild(this._createElem({
				type: children.type,
				children: children.children,
				text: children.text,
				className: children.className
			}))
			return elem;
		},
		_validBetweenPage: function() {
			if(this._betweenPage + 3 > this._totalPage) {
				this._betweenPage = this._totalPage - 3;
			}
		}
	}
})()
