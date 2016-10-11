//index.js
var data = require('../../utils/data.js').songs;

Page({
	data: {
		imgUrls: [
			'http://p4.music.126.net/17zN0YxTY6W6rzITa9EhNA==/3445869453818250.jpg',
			'http://p3.music.126.net/bKFfzVVNmdLTaRN5uHHPqA==/18786255672743757.jpg',
			'http://p4.music.126.net/n15ddawhY4cyIzFu23CSJA==/1401877341861315.jpg',
			'http://p3.music.126.net/zMwH3zh33TAacyh2_4RjXw==/1375489062675977.jpg'
		]
	},
	onLoad: function() {
		var recommends = [];

		for (var id in data) {
			recommends.push(Object.assign({
				id: id
			}, data[id]))
		}

		this.setData({
			recommends: recommends
		})
	},
	playTap: function(e) {
		const dataset = e.currentTarget.dataset;
		wx.navigateTo({
			url: `../play/index?id=${dataset.id}`
		})
	}
})