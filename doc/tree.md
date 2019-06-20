# Tree #
树结构插件

## 使用 ##

1. 在index.html中引入插件
	
	`<link rel="stylesheet" href="../src/plugins/tree/tree.css">`
 
	`<script src="../src/plugins/tree/tree.js"></script>`

2. 初始化

		DTree.init(elem, {
			// 在这里进行Options配置及使用Event回调
		})

## Options ##

插件可配置项如下：

- data，必填，初始需要渲染的数据
- default， 树结构初始展开与否，当此配置为open时，初始展开。 默认收起。
- style，树的样式设置，支持css标准样式设置，如下所示

   ```
        backgroundColor: "#fff", // 默认#333
        color: "#454444", // 默认#fff
        fontSize: '16px', // 默认16px
        width: "280px", // 默认250px
   ```

- checkedColor，选中树节点之后的文本颜色，默认为#FF5246
- hoverColor，鼠标放到节点上时的文本颜色，默认使用checkedColor，若未设置checkedColor则默认#FF5246
- iconSize，树节点前面的文件/文件夹图标大小，默认为20px

## Event ##

插件提供以下内置事件：

- onClick，树节点点击事件，返回当前点击的树节点的节点对象。

更多使用方法请参考 [`exapmles/tree.html`](https://github.com/dancyli/js-Dplugins/blob/master/examples/tree.html)
