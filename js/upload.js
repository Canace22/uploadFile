var uploadFile = /** @class */ (function () {
    function uploadFile(
    // public fso: any,
    ) {
    }
    uploadFile.prototype.showUploadInfo = function () {
        var txt = '';
        var f = document.getElementById("files"); // js 获取文件对象
        if ('files' in f) {
            if (f.files.length == 0) {
                txt = "Select one or more files.";
            }
            else {
                for (var i = 0; i < f.files.length; i++) {
                    txt += "<br>";
                    var file = f.files[i];
                    if ('name' in file) {
                        txt += "name: " + file.name + "<br>";
                    }
                    if ('size' in file) {
                        txt += "size: " + file.size + " bytes <br>";
                    }
                }
            }
        }
        else {
            if (f.value == "") {
                txt += "Select one or more files.";
            }
            else {
                txt += "The files property is not supported by your browser!";
                txt += "<br>The path of the selected file: " + f.value; // If the browser does not support the files property, it will return the path of the selected file instead.
            }
        }
        document.getElementById("list").innerHTML = txt;
    };
    uploadFile.prototype.postFile = function () {
        var f = document.getElementById("files"); // js 获取文件对象
        var url = "http://upload.lwio.me"; // 接收上传文件的后台地址
        var form = new FormData(); // FormData 对象
        form.append("file", f.files[0]); // 文件对象
        this.xhr = new XMLHttpRequest(); // XMLHttpRequest 对象
        this.xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
        this.xhr.onload = this.uploadComplete; //请求完成
        this.xhr.onerror = this.uploadFailed; //请求失败
        this.xhr.upload.onprogress = this.progressFunction; //【上传进度调用方法实现】
        this.xhr.upload.onloadstart = function () {
            this.ot = new Date().getTime(); //设置上传开始时间
            this.oloaded = 0; //设置上传开始时，以上传的文件大小为0
        };
        this.xhr.send(form); //开始上传，发送form数据
    };
    //上传成功响应
    uploadFile.prototype.uploadComplete = function (evt) {
        //服务接收完文件返回的结果
        var data = JSON.parse(evt.target.responseText);
        if (data.success) {
            alert("上传成功！");
        }
        else {
            alert("上传中！");
        }
    };
    //上传失败
    uploadFile.prototype.uploadFailed = function (evt) {
        alert("上传失败！");
    };
    //取消上传
    uploadFile.prototype.cancleUploadFile = function () {
        this.xhr.abort();
    };
    //上传进度实现方法，上传过程中会频繁调用该方法
    uploadFile.prototype.progressFunction = function (evt) {
        var progressBar = document.getElementById("progressBar");
        var percentageDiv = document.getElementById("percentage");
        // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
        if (evt.lengthComputable) { //
            progressBar.max = evt.total;
            progressBar.value = evt.loaded;
            percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
        }
        var time = document.getElementById("time");
        var nt = new Date().getTime(); //获取当前时间
        var pertime = (nt - this.ot) / 1000; //计算出上次调用该方法时到现在的时间差，单位为s
        this.ot = new Date().getTime(); //重新赋值时间，用于下次计算
        var perload = evt.loaded - this.oloaded; //计算该分段上传的文件大小，单位b
        this.oloaded = evt.loaded; //重新赋值已上传文件大小，用以下次计算
        //上传速度计算
        var speed = perload / pertime; //单位b/s
        var bspeed = speed;
        var units = 'b/s'; //单位名称
        if (speed / 1024 > 1) {
            speed = speed / 1024;
            units = 'k/s';
        }
        if (speed / 1024 > 1) {
            speed = speed / 1024;
            units = 'M/s';
        }
        speed = Number(speed.toFixed(1));
        //剩余时间
        var resttime = ((evt.total - evt.loaded) / bspeed).toFixed(1);
        time.innerHTML = '，速度：' + speed + units + '，剩余时间：' + resttime + 's';
        if (bspeed == 0)
            time.innerHTML = '上传已取消';
    };
    return uploadFile;
}());
