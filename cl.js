
var cl = {
	//------------------------------正则 start---------------------------------
    //手机
    mobileRegular : /^(((18[0-9]{1})|(17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1}))+\d{8})$/,
    //邮箱
     emailRegular : /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,///^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    //密码
    passwordRegular:/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,20}$/,
    //密码三级
    passwordRegular3:/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{15,20}$/,
    //密码二级
    passwordRegular2:/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,15}$/,
    //身份证
    regIdCard:/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
 	//------------------------------正则 end---------------------------------
 	
 	//邮箱加密 截取 中间截取星为加密
 	cl_slice:function(Encryptcontent){
        var Encryptcontent = String(Encryptcontent);
        var Contentlocation = Encryptcontent.indexOf('@');
        var Judgeem = Encryptcontent.slice(Encryptcontent.indexOf('@'),Encryptcontent.length);
        if(Contentlocation > -1 && Contentlocation != 0){
            if(Contentlocation >= 6){
                var Micontent = Encryptcontent.substring(0,3) + '***' + Encryptcontent.substring(Number(Contentlocation),Number(Contentlocation) -3) + Judgeem;
                return Micontent;
            }
        }else{
            return String(Encryptcontent.substring(0,3)) + '***' + String(Encryptcontent.substring(Encryptcontent.length-3,Encryptcontent.length));
        }
    },
    // 判断长度 (取字节)
    cl_length:function(val){
        Vallength = val.replace(/[^\x00-\xff]/g,'01').length
        return Vallength;
    },
    /*------------------------Ajax start----------------------------*/
    /*
    * Ajax请求入口
    * @param url=请求地址
    * @param data= 提交对象
    * @param type= 请求提交方式，默认为get
    * @param backFun= 回掉方法
    * @param errorBackFun = 错误回调方法
    * @param isAbs= 是否绝对路径，默认为否
    */
    cl_ajax:function(url,data,type,backfun,errorbackfun,isabs){
        var reqUrl = "/api/" + url;
        if(isabs){
            reqUrl = url;
        }
        if(type.toUpperCase()!="POST"){
            type="GET";
        }
        try {
            if(arguments.length==3)
            {
                //同步提交
                var result = this.cl_ajax_json(reqUrl,data,type);
                return result;
            }
            else if(arguments.length>3)
            {
                //异步提交
                this.cl_ajax_async_json(reqUrl,data,type,backfun,errorbackfun);
            }
        }
        catch(err){
            console.warn(err);
        }

    },
    cl_ajax_json:function(url, data,type) {

        var vlMsg;
        var obpram = data;
        if (data == null || data == "")
            obpram = {};

        var tokenname = $("meta[name='cfname']").attr("content");
        var tokenvalue = $("meta[name='valuecs']").attr("content");
        $.ajax({
            url: url,
            data: obpram,//JSON.stringify(obpram),
            type: type,
            beforeSend: function(xhr){
                xhr.setRequestHeader(tokenname, tokenvalue);
            },
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            async:false,
            success: function (result) {
                vlMsg = result;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //console.log("调用ajax发生错误:" + thrownError + " 调用地址:" + url);
                // xhr.responseJSON.message = xhr.responseJSON.message.replace('Authentication Failed:');
                if (xhr.responseJSON&&xhr.responseJSON.message){
                    xhr.responseJSON.message = xhr.responseJSON.message.replace('Authentication Failed:');
                }
                 vlMsg = xhr.responseJSON;
            }
        });
        return vlMsg;
    },
    cl_ajax_async_json:function(url, data,type, backfun,errorbackfun) {

        var obpram = data;
        if (data == null || data == "")
            obpram = {};
        var tokenname = $("meta[name='cfname']").attr("content");
        var tokenvalue = $("meta[name='valuecs']").attr("content");
        $.ajax({
            url: url,
            data: obpram,//JSON.stringify(obpram),
            type: type,
            beforeSend: function(xhr){
                xhr.setRequestHeader(tokenname, tokenvalue);
            },
            contentType: "application/x-www-form-urlencoded;charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (backfun != null) backfun(result);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //console.log("调用ajax发生错误:" + thrownError + " 调用地址:" + url);
                if (errorbackfun != null&&xhr.responseJSON&&xhr.responseJSON.message){
                    xhr.responseJSON.message = xhr.responseJSON.message.replace('Authentication Failed:');
                }
                if(errorbackfun != null){
                    errorbackfun(xhr.responseJSON);
                }
            }
        });
    },
    cl_text:function (url, data,type,backfun,errorbackfun) {
        var obpram = data;
        if (data == null || data == "")
            obpram = {};
        var tokenname = $("meta[name='cfname']").attr("content");
        var tokenvalue = $("meta[name='valuecs']").attr("content");
        try{
            $.ajax({
                url: url,
                data: obpram,//JSON.stringify(obpram),
                type: type,
                beforeSend: function(xhr){
                    xhr.setRequestHeader(tokenname, tokenvalue);
                },
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                dataType: "text",
                success: function (result) {
                    if (backfun != null) backfun(result);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (errorbackfun != null&&xhr.responseJSON&&xhr.responseJSON.message){
                        xhr.responseJSON.message = xhr.responseJSON.message.replace('Authentication Failed:');
                    }
                    if(errorbackfun != null){
                        errorbackfun(xhr.responseJSON);
                    }
                }
            });
        }catch (err){
            console.warn(err);
        }
    },
     /*------------------------Ajax end----------------------------*/
     
    // 设置Cookie
    cl_setup:function(){
        
    },
    // 获取Cookie
    cl_get:function(){

    },
    // 删除Cookie
    cl_delete:function(){

    },
 
    
    
    
};



