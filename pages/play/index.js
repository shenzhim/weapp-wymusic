var data = require('../../utils/data.js').songs;
var strRe = /\[(\d{2}:\d{2})\.\d{2,}\](.*)/;

Page({
	data: {
		toastHidden: true
	},
	onLoad: function(param) {
		this.setData({
			currentId: param.id
		})
		this.idsMap = wx.getStorageSync('ids') || {};
		this.idsArr = Object.keys(this.idsMap);
	},
	onReady: function() {
		this.reload(this.data.currentId);
	},
	onShow: function() {
		this.animation = wx.createAnimation({
			duration: 1000,
			timingFunction: 'ease',
		});
	},
	onHide: function() {
		this.clearTurner();
	},
	onUnload: function() {
		this.clearTurner();
	},
	errorEvent: function(e) {
		console.log("加载资源失败 code：", e.detail.errMsg);
		this.reload(this.idsMap[Number(this.data.currentId)].nextid);
	},
	prevEvent: function(e) {
		this.reload(this.idsMap[Number(this.data.currentId)].preid);
	},
	nextEvent: function(e) {
		this.reload(this.idsMap[Number(this.data.currentId)].nextid);
	},
	actionEvent: function(e) {
		var method = this.data.status === 'play' ? 'pause' : 'play';
		this.setData({
			status: method,
			action: {
				method: method
			}
		});

		if (method === 'pause') this.clearTurner();
	},
	switchModeEvent: function(e) {
		var newMode = 'loop';
		var toastMsg = "列表循环";
		if (this.data.mode === 'loop') {
			newMode = 'single';
			toastMsg = "单曲循环";
		} else if (this.data.mode === 'single') {
			newMode = 'random';
			toastMsg = "随机播放";
		}
		this.setData({
			mode: newMode,
			toastMsg: toastMsg,
			toastHidden: false
		})
	},
	switchbgEvent: function(e) {
		this.setData({
			lyricHidden: !this.data.lyricHidden
		});
	},
	timeupdateEvent: function(e) {
		var t = e.detail.currentTime,
			d = e.detail.duration,
			step = this.isEnSong ? 78 : 55,
			list = this.data.lyricList,
			cIndex = this.data.currentIndex;

		if (cIndex < list.length - 1 && t >= list[cIndex + 1].time) {
			this.animation.translateY(-step * (cIndex + 1)).step();

			this.setData({
				currentTime: t,
				currentIndex: cIndex + 1,
				animationData: this.animation.export()
			});
		}

		this.setData({
			per: Math.floor(t / d * 100),
			timeText: this.formatTime(t),
			durationText: this.formatTime(d)
		});

		if (!this.turner && this.data.status === 'play') {
			this.turner = setInterval(() => {
				this.setData({
					deg: this.data.deg + 1,
				})
			}, 50);
		}
	},
	endEvent: function(e) {
		this.reload(this.getNextSongId());
	},
	toastChange: function(e) {
		this.setData({
			toastHidden: true
		});
	},
	reload: function(id) {
		var song = data[id] || {};

		this.clearTurner();
		this.animation.translateY(0).step({
			duration: 1000,
			delay: 100
		});
		this.setData({
			per: 0,
			deg: 0,
			status: 'play',
			lyricHidden: true,
			toastHidden: true,
			mode: this.data.mode || 'loop',
			currentId: id,
			currentTime: '0',
			currentIndex: -1,
			timeText: '00:00',
			durationText: '',
			animationData: this.animation.export(),
			title: song.name,
			picurl: song.album.picUrl,
			src: song.mp3Url,
			action: {
				method: 'setCurrentTime',
				data: 0
			},
			lyricList: this.getLyricList(song)
		});

		wx.setNavigationBarTitle({
			title: song.name
		});

		setTimeout(() => {
			this.setData({
				action: {
					method: 'play'
				}
			})
		}, 100);
	},
	getNextSongId: function() {
		if (this.data.mode === 'single') {
			return this.data.currentId;
		} else if (this.data.mode === 'random') {
			return idsArr[Math.floor(Math.random() * idsArr.length)]
		} else if (this.data.mode === 'loop') {
			return this.idsMap[Number(this.data.currentId)].nextid;
		}
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
				v = arr[2] || '(music)';

			if (!obj[k]) obj[k] = {};
			obj[k].zh = v;
		});
		if (en.length) {
			this.isEnSong = true;
		} else {
			this.isEnSong = false;
		}

		en.forEach(function(str) {
			var arr = str.match(strRe);
			if (!arr) return;

			var k = arr[1],
				v = arr[2] || '(music)';

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
	},
	clearTurner: function() {
		if (this.turner) {
			clearInterval(this.turner);
			this.turner = null;
		}
	},
	formatTime: function(time) {
		time = Math.floor(time);
		var m = Math.floor(time / 60).toString();
		m = m.length < 2 ? '0' + m : m;

		var s = (time - parseInt(m) * 60).toString();
		s = s.length < 2 ? '0' + s : s;

		return `${m}:${s}`;
	}
})