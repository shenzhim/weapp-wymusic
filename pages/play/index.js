var data = require('../../utils/data.js').songs;
var strRe = /\[(\d{2}:\d{2})\.\d{2,}\](.*)/;

Page({
	data: {},
	onLoad: function(param) {
		this.setData({
			currentId: param.id
		})
		this.idsMap = wx.getStorageSync('ids') || {};
	},
	onReady: function() {
		this.reload(this.data.currentId);
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
		this.reload(this.idsMap[Number(this.data.currentId)].preid);
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
		this.reload(this.idsMap[Number(this.data.currentId)].nextid);
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
	reload: function(id) {
		var song = data[id] || {};
		this.setData({
			status: 'play',
			mode: 'loop',
			currentId: id,
			currentTime: '0',
			currentIndex: 0,
			animationData: {},
			title: song.name,
			picurl: song.album.picUrl,
			src: song.mp3Url,
			action: {
				method: 'play'
			},
			lyricList: this.getLyricList(song)
		});

		wx.setNavigationBarTitle({
			title: song.name
		})
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