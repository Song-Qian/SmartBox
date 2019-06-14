/**
 * Developer    :   SongQian
 * Time         :   2017-9-17
 * email        :   onlylove1172559463@vip.qq.com
 * description  :   此工具类用于加密解密重要数据字符, 此接口为ES5语法，框架请使用Keys-SHA-ES6.js
 */
(function(win, fn){
    if(win instanceof Window && fn){
        win.Keys = function(){};
        fn(win.Keys);
    }
})(window, function(keys){
    //密钥实例
    keys.prototype = {
        //md5加密算法
        SHA : function(charts, cases) {
            //设置默认值
            cases = cases || false;
            var core_sha1 = function(blockArray){
                var x = blockArray;
                var w = Array(80);
                var a = 1732584193;
                var b = -271733879;
                var c = -1732584194;
                var d = 271733878;
                var e = -1009589776;
                for(var n = 0; n < x.length; n += 16)
                {
                    var olda = a;
                    var oldb = b;
                    var oldc = c;
                    var oldd = d;
                    var olde = e;
                    for(var j = 0; j < 80; j++)
                    {
                        if(j < 16)
                            w[j] = x[n + j];
                        else
                            w[j] = rol(w[j - 3] ^ w[j - 8] ^ w [j - 14] ^ w[j - 16], 1);
                        var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                        e = d;
                        d = c;
                        c = rol(b, 30);
                        b = a;
                        a = t;
                    }
                    a = safe_add(a, olda);
                    b = safe_add(b, oldb);
                    c = safe_add(c, oldc);
                    d = safe_add(d, oldd);
                    e = safe_add(e, olde);
                }
                return new Array(a, b, c, d, e);
            };
    
            var sha1_ft = function(t, b, c, d){
                if(t < 20)
                    return (b & c) | ((~b) & d);
                if(t < 40)
                    return b ^ c ^ d;
                if(t < 60)
                    return (b & c) | (b & d) | (c & d);
                return b ^ c ^ d;
            };
    
            var sha1_kt = function(t){
                return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
            };
    
            var safe_add = function(x, y){
                var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xFFFF);
            };
    
            var rol = function(num, cnt){
                return (num << cnt) | (num >>> (32 - cnt));
            };
    
            var AlignSHA1 = function(str){
                var nblk = ((str.length + 8) >> 6) + 1,
                    blks = new Array(nblk * 16);
                var i = 0;
                for(i = 0; i < nblk * 16; i++)
                    blks[i] = 0;
                for(i = 0; i < str.length; i++)
                    blks[i >> 2] |= str.charCodeAt(i) << (24 - (i & 3) * 8);
                blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
                blks[nblk * 16 - 1] = str.length * 8;
                return blks;
            };
    
            var binb2hex = function(binarray, hexcase){
                var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
                var str = "";
                for(var i = 0; i < binarray.length * 4; i++)
                    str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                            hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
                return str;
            };
            return binb2hex(core_sha1(AlignSHA1(charts)), cases)

        }
        
    }
});