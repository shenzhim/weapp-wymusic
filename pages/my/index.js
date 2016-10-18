Page({
    data: {},
    onLoad: function() {
        if (!wx.getStorageSync('favlist')) {
            wx.setStorageSync('favlist', {
                '我喜欢的音乐': {
                    picurl: '',
                    list: []
                }
            });
        }
    },
    onShow: function() {
        var favList = [];
        var data = wx.getStorageSync('favlist');

        Object.keys(data).forEach(function(key) {
            favList.push({
                picurl: data[key].picurl,
                name: key,
                count: data[key].list.length
            });
        });

        this.setData({
            favlist: favList
        })
    },
    playTap: function(e) {

    }
})