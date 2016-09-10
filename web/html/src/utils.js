import "./vue.ex";
var utils = {
    config: {
        root: window.root,
        ctx: window.ctx,
        vue:window._vue_
    },
    push: function (data, item) {
        if (data === undefined) {
            data = [];
        }
        data.push(item);
    },
    token: function (token) {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            return localStorage.getItem("token") || '';
        }
    },
    user: function (userData) {
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            var userData = localStorage.getItem("user");
            if (userData) {
                return JSON.parse(userData);
            }
            return {};
        }
    },
    logout: function () {
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
        location.href = utils.config.ctx + "/";
    },
    toJSON: function (data) {
        if (data === undefined)
            return data;
        if (data.constructor.name == 'String') {
            //data = data.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
            data=data.replace(/:\s*"([^"]*)"/g, function(match, p1) {
                return ': "' + p1.replace(/:/g, '@colon@') + '"';
            })
                .replace(/:\s*'([^']*)'/g, function(match, p1) {
                    return ': "' + p1.replace(/:/g, '@colon@') + '"';
                })
                .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')
                .replace(/@colon@/g, ':')
            ;
            data = data.replace(/\s/g, '');
            return JSON.parse(data);
        }
        return data;
    },
    ajax: function (params) {
        var url = this.config.root + params.url;
        if (url.indexOf("?") != -1) {
            url += '&token=' + this.token();
        } else {
            url += '?token=' + this.token();
        }
        params.url = url;
        $._ajax_(params);
    },
    get: function (url, params, success, complete) {
        this.ajax({
            url: url,
            data: params,
            type: 'get',
            dataType: 'json',
            success: success,
            complete: complete
        });
    },
    post: function (url, params, success, error) {
        this.ajax({
            url: url,
            data: params,
            type: 'post',
            dataType: 'json',
            success: success,
            error: error
        });
    },
    "delete": function (url, success, error) {
        this.ajax({
            url: url,
            type: 'delete',
            success: success,
            error: error
        })
    },
    escape: function (str) {
        return str.replace(/\</g, '&lt;')
            .replace(/\>/g, '&gt;')
            .replace(/\"/g, "&quot;")
            .replace(/\'/g, "&apos;")

    },
    getQueryParams(qs) {
        qs = qs.split('+').join(' ');
        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params;
    },
    window:{
        qq:function(){
            var url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&state=login&client_id=101333549&redirect_uri=http://www.xiaoyaoji.com.cn/api/callback/qq';
            window.open(url, 'qqwindow', 'height=550, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
        },
        weibo:function(){
            var url = 'https://api.weibo.com/oauth2/authorize?client_id=290920638&redirect_uri=http://www.xiaoyaoji.com.cn/api/callback/weibo&state=login';
            window.open(url, 'qqwindow', 'height=550, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
        },
        github:function(){
            var url = "https://github.com/login/oauth/authorize?client_id=4c8973629deb3d577bd3&redirect_uri=http://www.xiaoyaoji.com.cn/api/callback/github&scope=user&state=login";
            window.open(url, 'qqwindow', 'height=550, width=900, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no');
        }
    },
    login: {
        init:function(){
            if(window.initialized){
                return true;
            }
            window.initialized = true;
            window.addEventListener('message',function(e){
                if(e.origin == 'http://www.xiaoyaoji.com.cn' || e.origin == 'https://www.xiaoyaoji.com.cn'){
                    var data = e.data;
                    data = JSON.parse(data);
                    utils.post('/login/'+data.type+'.json',data,function (rs) {
                        utils.login.success(rs.data.token,rs.data.user,null);
                    });
                }
            });
        },
        qq: function () {
             utils.window.qq();
            utils.login.init();
        },
        weibo: function () {
            utils.window.weibo();
            utils.login.init();
        },
        github: function () {
            utils.window.github();
            utils.login.init();
        },
        submit:function(url,data){
            utils.post(url,data,function(rs){
                localStorage.clear();
                localStorage.setItem('user',JSON.stringify(rs.data.user));
                localStorage.setItem('token',rs.data.token);
                location.href=utils.config.ctx+'/dashboard';
            });
        },
        success:function(token,user,href){
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            if(href){
                location.href=href;
            }else{
                location.href=utils.config.ctx+'/dashboard?t='+Date.now();
            }
        }
    }
};
$._ajax_ = function(params){
    var complete = params.complete;
    var success = params.success;
    params.complete = function (xhr, result) {
        if (result == 'error') {
            if (xhr.readyState == XMLHttpRequest.UNSENT) {
                toastr.error('网络错误');
            } else {
                console.log(arguments)
            }
        }
        if (complete) {
            complete.apply(this, arguments);
        }
    };
    params.success = function (rs) {
        if (rs.code == 0) {
            if (success) {
                success.apply(this, arguments);
            }
        } else if (rs.code == -2) {
            if (location.href.indexOf('/project/demo') != -1)
                return false;

            localStorage.setItem("token", "");
            localStorage.setItem("user", "");
            location.href = utils.config.ctx + '/login.html?status=expired&refer=' + encodeURIComponent(location.href);
        } else {
            toastr.error(rs.errorMsg);
        }
    };
    $.ajax(params);
};/*
$._ajax_ = $.ajax;
$.ajax = function (params) {
    //Pace.restart();
    var complete = params.complete;
    var success = params.success;
    params.complete = function (xhr, result) {
        if (result == 'error') {
            if (xhr.readyState == XMLHttpRequest.UNSENT) {
                toastr.error('网络错误');
            } else {
                console.log(arguments)
            }
        }
        if (complete) {
            complete.apply(this, arguments);
        }
    };
    params.success = function (rs) {
        if (rs.code == 0) {
            if (success) {
                success.apply(this, arguments);
            }
        } else if (rs.code == -2) {
            if (location.href.indexOf('/project/demo') != -1)
                return false;

            localStorage.setItem("token", "");
            localStorage.setItem("user", "");
            location.href = utils.config.ctx + '/login.html?status=expired&refer=' + encodeURIComponent(location.href);
        } else {
            toastr.error(rs.errorMsg);
        }
    };
    $._ajax_(params);
};*/
export default utils;