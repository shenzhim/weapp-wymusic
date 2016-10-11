//index.js
var data = require('../../utils/data.js').songs;

Page({
	data: {
		imgUrls: [
			'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
			'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
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
			url: `../play/index?id=${dataset.id}&name=${dataset.name}`
		})
	}
})