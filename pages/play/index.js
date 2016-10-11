var data = require('../../utils/data.js').songs;
var strRe = /\[(\d{2}:\d{2})\.\d{2,}\](.*)/;

Page({
	data: {
		status: 'play',
		mode: 'loop'
	},
	onLoad: function(param) {
		var obj = {},
			lyricList = [],
			song = data[param.id] || {},
			zh = song.zh ? song.zh.split('\n') : [],
			en = song.en ? song.en.split('\n') : [];

		zh.forEach(function(str) {
			var arr = str.match(strRe);
			if (!arr) return;

			var k = arr[1],
				v = arr[2];

			if (!obj[k]) obj[k] = {};
			obj[k].zh = v;
		});

		en.forEach(function(str) {
			var arr = str.match(strRe);
			if (!arr) return;

			var k = arr[1],
				v = arr[2];

			if (!obj[k]) obj[k] = {};
			obj[k].en = v;
		});

		for (var t in obj) {
			lyricList.push({
				time: "t" + t.replace(':', ''),
				zh: obj[t].zh,
				en: obj[t].en
			})
		}

		this.setData({
			title: param.name,
			picurl: song.album.picUrl,
			src: song.mp3Url,
			action: {
				method: 'play'
			},
			lyricList: lyricList
		})
	},
	onReady: function() {
		wx.setNavigationBarTitle({
			title: this.data.title
		})
	},
	errorEvent: function(e) {

	},
	playEvent: function(e) {

	},
	pauseEvent: function(e) {

	},
	timeupdateEvent: function(e) {

	},
	endEvent: function(e) {

	}
})