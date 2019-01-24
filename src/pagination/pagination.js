var DPagination = (function(){
	return {
		init: function(elem, options) {
			this.$pagination = elem;
			this._currentPage = options.currentPage || 1;
			this._totalPage =  options.totalPage || 0;
			console.log(this)
			this.render()

		},
		render: function() {
			this._renderFixedBar();
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
		_renderPage: function() {
			var page = document.createDocumentFragment();
			var totalPage = this._totalPage;

			if(totalPage > 5) {
				totalPage = 3;
			}

			for(var i = 0; i < totalPage; i ++) {
				var className = this._currentPage == (i+1) ? 'current' : '';
				var li = this._createElem({
					type: 'li',
					children: {
						type: 'a',
						text: i + 1,
						className: className
					},
				})
				page.appendChild(li)
			}

			if(this._totalPage > 5) {
				var more = this._createElem({
					type: 'li',
					children: {
						type: 'a',
						text: '···',
						className: 'more'
					},
				})
				var lastPage = this._createElem({
					type: 'li',
					children: {
						type: 'a',
						text: this._totalPage,
						className: ''
					},
				})
				page.appendChild(more)
				page.appendChild(lastPage)

				this.$lastPage = lastPage
				this.$more = more
			}

			this.$ul.insertBefore(page, this.$next)
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
		}
	}
})()
