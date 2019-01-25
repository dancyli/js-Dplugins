/**
 * @type {{init, getMonthSettings, getAjaxData, prev, next, render, _renderHeader, _renderBody, _renderData, _getClassHTML, _dealData, _bindFn, _calcDays, _getTitle, _calcStyle, _getElemStyle}}
 * @createAt 2019-01-18
 * @author Dancy
 *
 * @update 2019-01-21
 * 1. 修改renderData方法，实现插件的自定义数据渲染
 * 2. 添加日历的onClick、onMouseOver、onDblClick事件，实现自定义事件回调
 * 3. 添加notMouseOver、notDblClick、notClick配置项，可设置2中事件是否禁用
 * 4. 添加afterRender、bindMyFn方法，提供自定义渲染的DOM的事件绑定接口
 * 5. 添加defaultDate配置项，可设置日历初始显示的默认年月
 */
var DCalendar = (function(){
	return {
		init: function(elem, options) {

			this._calendar = elem;
			this._lang = options.lang || 'en';
			this._isUpperCase = !!options.isUpperCase;
			this._url = options.url || ''; // 暂时无效
			this._data = options.data || [];
			this._monthSettings = this.getMonthSettings();

			this._notMouseOver = !!options.notMouseOver;
			this._notDblClick = !!options.notDblClick;
			this._notClick = !!options.notClick;

			this.$onclick = options.onClick || function() {};
			this.$onmouseover = options.onMouseOver || function() {};
			this.$ondblclick = options.onDblClick || function() {};
			this.$renderData = options.renderData || function(){return ''};
			this.$afterRender = options.afterRender || function() {};

			var defaultDate = options.defaultDate;
			if(defaultDate !== undefined && !defaultDate) {
				throw new Error('默认年月格式错误');
			}
			if (defaultDate)  {
				defaultDateArr = defaultDate.split('-');
				if(defaultDateArr.length < 2 ) {throw new Error('默认年月格式错误')}
				this._year = parseFloat(defaultDateArr[0]);
				this._month = parseFloat(defaultDateArr[1]) - 1;
			}

			this._dealData();
			this.render();

			this._prev.onclick = this.prev.bind(this);
			this._next.onclick = this.next.bind(this);
		},
		getMonthSettings: function() {
			return [
				{
					name: "一月",
					enName: "Jan"
				},
				{
					name: "二月",
					enName: "Feb"
				},
				{
					name: "三月",
					enName: "Mar"
				},
				{
					name: "四月",
					enName: "Apr"
				},
				{
					name: "五月",
					enName: "May"
				},
				{
					name: "六月",
					enName: "Jun"
				},
				{
					name: "七月",
					enName: "Jul"
				},
				{
					name: "八月",
					enName: "Aug"
				},
				{
					name: "九月",
					enName: "Sep"
				},
				{
					name: "十月",
					enName: "Oct"
				},
				{
					name: "十一月",
					enName: "Nov"
				},
				{
					name: "十二月",
					enName: "Dec"
				}

			]
		} ,
		getAjaxData: function(url) {
			if(!url) {
				return false;
			}
			var ajax = new XMLHttpRequest();

			ajax.open('get', url);
			ajax.send();
			ajax.onreadystatechange = function() {
				if(ajax.readyState === 4 && ajax.status == 200) {
					console.log(ajax.responseText);
				}
			}
		},
		prev: function() {
			var prevMonth = this._month - 1;

			if(prevMonth < 0) {
				this._month = 11;
				this._year --;
			} else {
				this._month = prevMonth;
			}

			this.render();
		},
		next: function() {
			var nextMonth = this._month + 1;

			if(nextMonth > 11) {
				this._month = 0;
				this._year ++;
			} else {
				this._month = nextMonth;
			}

			this.render();
		},
		render: function() {
			this._renderHeader();
			this._calcDays();
			this._calcStyle();
			this._renderBody();
			this._bindFn();
			this.$afterRender();
		},
		renderData: function(params) {
			var content = this.$renderData(params)
			if(content === undefined) {
				throw new Error('renderData没有返回值!如不需要渲染日历内容，初始化日历时请去掉此函数或return空字符串');
			}
			return content
		},
		bindMyFn: function(eventType, $selector, fn) {
			var type = [
				'onclick',
				'onmouseover',
				'ondblclick',
				'onchange',
				'onblur',
				'onselect',
				'onfocus',
				'onmousedown',
				'onmouseup'
			];
			var index = type.indexOf(eventType);
			if(index === -1) {
				throw new Error('你绑定的事件不规范，请检查你绑定的自定义事件类型！')
			}

			var elems = document.getElementsByClassName($selector);

			for(var i = 0; i < elems.length; i ++) {
				(function(i){
					elems[i][type[index]] = fn.bind(elems[i]);
				}.bind(this))(i);
			}

		},
		_renderHeader: function() {
			if(this._header) {
				this._date.innerHTML = this._getTitle();
				return true;
			}

			var now = new Date();
			var year = this._year || now.getFullYear();
			var month =this._month || now.getMonth()
			var header = document.createDocumentFragment();

			var contain = document.createElement('div');
			var prev = document.createElement('span');
			var date = document.createElement('span');
			var next = document.createElement('span');

			contain.className = 'calendar-header';
			prev.className = 'prev';
			prev.innerHTML = '&lt;';
			date.className = 'date';
			date.innerHTML = this._getTitle();
			next.className = 'next';
			next.innerHTML = '&gt;';

			contain.appendChild(prev)
			contain.appendChild(date)
			contain.appendChild(next)

			header.appendChild(contain);

			this._calendar.appendChild(header)
			this._prev = prev;
			this._date = date;
			this._next = next;
			this._header = document.getElementsByClassName('calendar-header')[0];
			this._month = month;
			this._year = year;
		},
		_renderBody: function() {
			if(this._body) {
				this._calendar.removeChild(this._body)
			}
			var body = document.createDocumentFragment();
			var contain = document.createElement('div');

			contain.className = 'calendar-body';

			for(var i = 0; i < this._days; i ++) {
				var item = document.createElement('div');
				var itemTitle = document.createElement('div');
				var itemCon = document.createElement('div');
				var classItem = document.createElement('div');

				item.className = 'calendar-item'
				itemTitle.className = 'calendar-item-title'
				itemCon.className = 'calendar-item-content';
				classItem.className = 'class-item';

				itemTitle.innerHTML = i + 1;
				classItem.innerHTML = this.renderData({
					year: this._year,
					month: this._month +1,
					day: i + 1
				});
				item.style.width = this._itemWidth + "px";
				item.style.height = this._itemWidth + "px";
				item.setAttribute('date', JSON.stringify({
					year: this._year,
					month: this._month + 1,
					day: i + 1
				}))

				itemCon.appendChild(classItem)
				item.appendChild(itemTitle)
				item.appendChild(itemCon)
				contain.appendChild(item)
			}

			body.appendChild(contain)
			this._calendar.appendChild(body)
			this._body = document.getElementsByClassName('calendar-body')[0];
		},
		_dealData: function() {
			this._data.forEach(function(val) {
				var date = new Date(val.date);
				val.$year = date.getFullYear();
				val.$month = date.getMonth();
				val.$day = date.getDate();
			})
		},
		_bindFn: function() {
			var calendarItem = document.getElementsByClassName('calendar-item');

			for(var i = 0; i < calendarItem.length; i ++) {
				 (function(i){
					 !this._notClick && (calendarItem[i].onclick = this.$onclick.bind(calendarItem[i], JSON.parse(calendarItem[i].getAttribute('date'))));
					 !this._notMouseOver && (calendarItem[i].onmouseover = this.$onmouseover.bind(calendarItem[i], JSON.parse(calendarItem[i].getAttribute('date'))))
					 !this._notDblClick && (calendarItem[i].ondblclick = this.$ondblclick.bind(calendarItem[i], JSON.parse(calendarItem[i].getAttribute('date'))))
				}.bind(this))(i);
			}
		},
		_calcDays: function() {
			this._days = new Date(this._year, this._month + 1, 0).getDate();
		},
		_getTitle: function() {
			var lang = this._lang === 'en' ? 'enName' : 'name';
			var month = this._month || new Date().getMonth();
			var year = this._year || new Date().getFullYear();
			var title = this._monthSettings[month][lang];

			if(this._isUpperCase && this._lang === 'en') {
				title = title.toUpperCase();
			}

			return title + ' ' + year;
		},
		_calcStyle: function() {
			var width = parseFloat(this._getElemStyle(this._calendar, 'width'));

			this._itemWidth = width / 8;

		},
		_getElemStyle(elem, style) {
			if(elem.currentStyle){
				return elem.currentStyle[style];
			}else{
				return getComputedStyle(elem, false)[style];
			}
		}
	}
})()
