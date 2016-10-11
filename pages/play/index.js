var data = require('../../utils/data.js').songs;
var strRe = /\[(\d{2}:\d{2})\.\d{2,}\](.*)/;

Page({
	data: {
		status: 'play',
		mode: 'loop',
		currentTime: '0',
		currentIndex: 0,
		animationData: {}
	},
	onLoad: function(param) {
		var song = data[param.id] || {};

		this.setData({
			title: song.name,
			picurl: song.album.picUrl,
			src: song.mp3Url,
			action: {
				method: this.data.status
			},
			lyricList: this.getLyricList(song)
		})
	},
	onReady: function() {
		wx.setNavigationBarTitle({
			title: this.data.title
		})
	},
	onShow: function() {
		var animation = wx.createAnimation({
			duration: 1000,
			timingFunction: 'ease',
		})

		this.animation = animation
	},
	errorEvent: function(e) {
		console.log("加载资源失败 code：", e.detail.errMsg);
	},
	prevEvent: function(e) {

	},
	actionEvent: function(e) {
		var method = this.data.status === 'play' ? 'pause' : 'play';

		this.setData({
			status: method,
			action: {
				method: method
			}
		})
	},
	nextEvent: function(e) {

	},
	switchModeEvent: function(e) {

	},
	timeupdateEvent: function(e) {
		var t = e.detail.currentTime,
			list = this.data.lyricList,
			currentIndex = this.data.currentIndex;

		for (var i = 0; i < list.length; i++) {
			if (list[i].time <= t && list[i].endtime > t && currentIndex !== i) {
				this.animation.translateY(-(50 * i)).step();

				this.setData({
					currentTime: t,
					currentIndex: i,
					animationData: this.animation.export()
				});

				break;
			}
		}
	},
	endEvent: function(e) {

	},
	getLyricList: function(song) {
		var obj = {},
			lyricList = [],
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
			var ts = t.split(':');
			var time = parseInt(ts[0]) * 60 + parseInt(ts[1]);

			if (lyricList.length) {
				lyricList[lyricList.length - 1].endtime = time;
			}

			lyricList.push({
				time: time,
				zh: obj[t].zh,
				en: obj[t].en
			});
		}

		return lyricList;
	}
})