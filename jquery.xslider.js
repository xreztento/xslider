(function($){
    $.fn.slider = function(userOptions){
        var options = {
            id : 'slider',
            showedObject : [],//可显示的内容，目前为图片的URL，未来可扩展
            showNum : 1,//显示出的数量
            width : 540,//整个控件div层的宽度
            height : 180,//整个控件div层的高度
            objectWidth : 540,//每个显示对象的宽度
            objectHeight : 180,//每个显示对象的高度
            mouseoverHandler : function(index){//鼠标落在显示对象时的方法
                $(this).css("margin","-2px");
            },
            clickHandler : function(index){//鼠标点击显示对象时的方法

            },
            mouseoutHandler : function(index){//鼠标离开显示对象时的方法
                $(this).css("margin","0px");
            },
            model : "click"
        };
        $.extend(options, userOptions);
        if(options.showNum < 1){
            options.showNum = 1;
        }
        if(options.showedObject.length <= options.showNum) {//图片数小于显示
            options.showNum = options.showedObject.length - 1;
        }
        var num = options.showedObject.length;//图片总数
        var status;//当前滑动状态
        //console.log("num: " + num);

        var thumbnail = [];
        var movable = [];
        var intervalId = -1;
        var moveStopped = true;

        var createSlider = function(where){
            //定义Slider DIV容器，用于放置图片
            var slider = $("<div id='" + options.id + "'></div>")
                .css({
                    "display" : "block",
                    "position" : "relative",
                    "width" : options.width,
                    "height" : options.height,
                    "overflow" : "hidden"
                });

            if(options.showedObject.length === 0){//无图片
                var noRecent = $("<p id='no-recent'></p>")
                    .text("No recent.")
                    .css({
                        "color" : "#000",
                        "text-shadow" : "1px 1px #FFF",
                        "opacity" : "0.5",
                        "font-size" : "2em",
                        "font-weight" : "bolder"
                    });
                slider.append(noRecent);
            } else {//有图片

                for(var i = 0,l = options.showedObject.length; i < l; i++){
                    var sub = $("<div id='thumbnail" + i +"'></div>")//初始化图片DIV
                        .addClass("thumb")
                        .css({
                            "width" : options.width / options.showNum,
                            "height" : options.height,
                            "position" : "absolute",
                            "left" : "0px",
                            "cursor" : "pointer"
                        });
                    sub.append($("<img src='" + options.showedObject[i] +"' />").css({"width":options.objectWidth }));
                    (function(index){
                        sub.bind("mouseover",function(){
                            options.mouseoverHandler.call(this, index);
                        });

                        sub.bind("click",function(){
                            options.clickHandler.call(this, index);
                        });

                        sub.bind("mouseout",function(){
                            options.mouseoutHandler.call(this, index);
                        });
                    })(i);

                    thumbnail[i] = sub;
                    slider.append(sub);
                }
                //初始化图片
                for(var i = 0;i < num;i++){
                    thumbnail[i].css("left",(options.width / options.showNum) * i).show();
                }

            }
            where.append(slider);

        };

        var _hideThumbnail = function(){
            for(var i = 0,l = thumbnail.length; i < l; i++){
                thumbnail[i].hide();
            }
        };

        var _leftwards = function(movable){
            var block = options.width / (options.showNum * 2);
            for(var i = 0;i < (options.showNum + 1);i++){
                thumbnail[movable[i]].css({"left" :  i * block * 2}).show();
            }
            for(var i = 0;i < (options.showNum + 1);i++){
                thumbnail[movable[i]].animate({left:'-=' + block + 'px'},"fast");
            }
            for(var i = 0;i < (options.showNum + 1);i++){
                thumbnail[movable[i]].animate({left:'-=' + block + 'px'},"fast", function(){
                    moveStopped = true;
                });
            }
        };

        var _rightwards = function(movable){
            var block = options.width / (options.showNum * 2);
            for(var i = 0;i < (options.showNum + 1);i++){
                thumbnail[movable[i]].css({"left" :  (i - 1) * block * 2}).show();
            }
            for(var i = 0;i < (options.showNum + 1);i++){
                thumbnail[movable[i]].animate({left:'+=' + block + 'px'},"fast");
            }
            for(var i = 0;i < (options.showNum + 1);i++){
                thumbnail[movable[i]].animate({left:'+=' + block + 'px'},"fast", function(){
                    moveStopped = true;
                });
            }

        };

        createSlider(this);


        var leftwards = function(){
                //初始化状态
                if(status == undefined){
                    for(var i = 0;i < options.showNum + 1;i++){
                        if(i == 0){
                            movable[i] = num - 1;
                        } else {
                            movable[i] = i - 1;
                        }
                    }
                }
                //当由向右的状态切换到向左的状态
                if(status == 0){

                    for(var i = 0;i < options.showNum + 1;i++){
                        if(movable[i] == 0){
                            movable[i] = num - 1;
                        } else {
                            movable[i] -= 1;
                        }
                    }
                }
                //向左滑动逻辑
                for(var i = 0;i < options.showNum + 1;i++){
                    if(movable[i] == num - 1){
                        movable[i] = 0;
                    } else {
                        movable[i] += 1;
                    }
                }
                //向右滑动UI变化
                _leftwards(movable);
                status = 1;
            };

        var rightwards = function(){
                //初始化状态
                if(status == undefined){
                    for(var i = 0;i < options.showNum + 1;i++){
                        movable[i] = i;
                    }
                }
                //当由向左的状态切换到向右的状态
                if(status == 1){
                    for(var i = 0;i < options.showNum + 1;i++){
                        if(movable[i] == num - 1){
                            movable[i] = 0;
                        } else {
                            movable[i] += 1;
                        }
                    }
                }
                //向右滑动逻辑
                for(var i = 0;i < options.showNum + 1;i++){
                    if(movable[i] == 0){
                        movable[i] = num - 1;
                    } else {
                        movable[i] -= 1;
                    }
                }
                //向右滑动UI变化
                _rightwards(movable);
                status = 0;
            };

        return {
            //向左滑动方法
            leftwards : function(){
                if(moveStopped){
                    moveStopped = false;
                    $(this).trigger("onSlide");
                    leftwards();
                    $(this).trigger("onSlid");
                }

            },
            //向右滑动方法
            rightwards : function(){
                if(moveStopped){
                    moveStopped = false;
                    $(this).trigger("onSlide");
                    rightwards();
                    $(this).trigger("onSlid");
                }

            },
            //循环播放
            cycle : function(intertval){
                var intertval = intertval || 2000;
                if(intervalId === -1){
                    intervalId = setInterval(function(){
                        leftwards();
                    }, intertval);
                }
            },
            //停止播放
            pause : function(){
                if(intervalId !== -1){
                    clearInterval(intervalId);
                    intervalId = -1;
                }
            },
            on : function(eventName, callback){
                $(this).on(eventName, function(){
                    if(callback){
                        callback();
                    }
                });
            }
        };
    };
}(jQuery));


