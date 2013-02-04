/**
* @xDialog 弹出层
* @author 赵海龙
* @version 3.0
* @update 2013-2-4
*/

;(function($){
    $.xDialog = function(){

        //默认参数
        var defaults = {
            width:'auto',       //宽度
            height:'auto',      //高度
            title:"",           //标题
            content:"",         //内容
            opacity:0.7,        //遮罩层透明度
            show:true,          //是否立即显示弹出层
            ok:null,            //确定按钮回调函数，函数如果返回false将阻止弹出层关闭
            cancel:true,        //取消按钮回调函数，如果为true，调用默认关闭事件，函数如果返回false将阻止弹出层关闭
            overlayClose:true,  //点击遮罩层是否可以关闭
            type:null,          //消息类型：tips，配合time参数使用
            time:1.5,           //多少秒后关闭弹出层，配合type参数使用
            closeBtn:true       //是否显示右上角关闭按钮
        };

        var plugin = this,//避免this混乱
        $element = $(element),//jquery对象
        element = element;//原生对象
        plugin.settings = {};//参数集合
        options = arguments[0];//获取参数

        //初始化
        plugin.init = function(){
            plugin.settings  = $.extend({},defaults,options);//合并参数
            plugin.create();
            return this;
        };

        //创建弹出层
        plugin.create = function(){

            //初始化弹窗HTML结构
            this.dialog = $('<div>',{'class':"xDialog fixed border"});

            //判断弹窗类型
            if(this.settings.type && this.settings.type == 'tips'){
                $('<div>',{'class':'x-content clearfix'}).appendTo(this.dialog);
                this.settings.opacity = false;
            }else{
                this.header = $('<div>',{'class':'x-header clearfix'}).appendTo(this.dialog);

                //加入标题
                $('<span>',{'class':'x-title'}).html(this.settings.title).appendTo(this.header);

                //加入右上角关闭按钮
                if(this.settings.closeBtn){
                    $('<span>',{'class':'x-close'}).html('X').appendTo(this.header);
                }

                //加入内容
                $('<div>',{'class':'x-content'}).appendTo(this.dialog);
                
                //加入确定取消按钮
                if(this.settings.ok && typeof this.settings.ok == 'function'){
                    $('<div>',{'class':'x-buttons clearfix'}).html('<a class=\"x-ok g-button blue\" href=\"javascript:;\">确定<\/a><a href=\"javascript:;\" class=\"x-cancel g-button\">取消<\/a>').appendTo(this.dialog);
                }
            }

            this.setContent(this.settings.content);//设置内容
            this.dialog.appendTo('body');

            //初始化遮罩层
            if (plugin.settings.opacity){
                if(!plugin.overlay){
                    var view = getViewSize();
                    plugin.overlay = jQuery('<div>', {
                        'class':'x-overlay'
                    }).css({
                        'background-color': '#FFFFFF',
                        'position': 'absolute',
                        'width':    view.width,
                        'height':   view.height,
                        'left':     0,                                     
                        'top':      0,                               
                        'opacity':  plugin.settings.opacity,      
                        'z-index':  1000,
                        'cursor': 'pointer'                            
                    });

                    //判断点击遮罩层是否可以关闭
                    if(plugin.settings.overlayClose){
                         plugin.overlay.bind('click', function() {plugin.close();});
                    }
                    plugin.overlay.appendTo('body');
                }else{
                    plugin.overlay.show();
                }
            }

            //显示弹出层
            if(this.settings.show){
                this.open();
            }

            //绑定按钮
            $.each(['ok','cancel','close'],function(index, value){
                plugin.dialog.find('.x-' + value).bind('click',function(){
                    if(typeof plugin.settings[value] == 'function'){
                        if(plugin.settings[value]() === false){
                            return false;
                        }
                    }
                    plugin.close();
                });
            });
        };

        //设置位置
        plugin.setPos = function(){
            var width = (this.settings.width == 'auto') ? this.dialog.outerWidth() : this.settings.width,
            height = (this.settings.height == 'auto') ? this.dialog.outerHeight() : this.settings.height,
            left = -(width / 2), top = -(height / 2);

            plugin.dialog.css({
                'margin-top': top,
                'margin-left': left,
                'width': width,
                'height': height
            });
        };

        //设置标题
        plugin.setTitle = function(title){
            plugin.dialog.find('.x-title').html(title);
            return this;
        };

        //设置内容
        plugin.setContent = function(obj){
            //判断内容类型
            if(typeof obj != 'string'){
                obj = (obj instanceof jQuery) ? obj[0] : obj;
                obj = obj.cloneNode(true);
                obj.style.display = 'block';
            }
            plugin.dialog.find('.x-content').append(obj);
            return this;
        };

        //打开弹出层
        plugin.open = function(){
            this.setPos();//重置样式
            plugin.dialog.fadeIn(300);//显示弹出层
           
            //判断弹出层类型
            if(this.settings.type === 'tips' && this.settings.time){
                setTimeout(function(){
                    plugin.close();
                },this.settings.time * 1000);
            }
        };

        //关闭弹出层
        plugin.close = function(){
            plugin.dialog.remove();
            if(this.overlay) this.overlay.hide();
        };

        //私有方法：获取文档大小
        var getViewSize = function(){
            //判断文档模式
            if (document.compatMode == "BackCompat"){
                this.width = document.body.clientWidth;
                if(document.body.scrollHeight > document.body.clientHeight){
                    this.height = document.body.scrollHeight;
                }else{
                    this.height = document.body.clientHeight;
                }
            }else{
                this.width = document.documentElement.clientWidth;
                if(document.documentElement.scrollHeight > document.documentElement.clientHeight){
                    this.height = document.documentElement.scrollHeight;
                }else{
                    this.height = document.documentElement.clientHeight;
                } 
            }
            return {width:this.width,height:this.height};
        };

        return plugin.init();
    };

    // $.fn.xDialog = function(options) {
    //     return this.each(function() {
    //         if (undefined == $(this).data('xDialog')) {
    //             console.log(1111111111111);
    //             var plugin = new $.xDialog(this, options);
    //             $(this).data('xDialog', plugin);
    //         }else{
    //             console.log(2222222222222);
    //             $.xDialog(this, options);
    //         }
    //     });
    // }
})(jQuery);