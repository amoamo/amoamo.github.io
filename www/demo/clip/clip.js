(function(){
    // 操作的dom
    var originCon = $('.clip-original'),
        rawPic = $('.clip-back-pic'),
        clipPic = $('.clip-front-pic'),
        clipBox = $('.clip-box'),
        preBox = $('.clip-preview'),
        prePic = $('.clip-preview-img'),
        direcDom = $('.clip-box-drag'),
        leftTop = $('.clip-box-lt'),
        rightTop = $('.clip-box-rt'),
        rightBottom = $('.clip-box-rb'),
        leftBottom = $('.clip-box-lb');

    // 全局系统变量
    var originWidth = originCon.width();

    // 全局标识
    var isClick = false,
        direction = '';

    bindBehavior();
    clipPreview();

    function bindBehavior() {
        // 四个角可以拖
       direcDom.mousedown(function(e) {
            e.stopPropagation();
            var me = $(this);
            isClick = true;
            direction = me.attr('data-rel');
        });
        originCon.mousemove(function(e) {
            // 说明处于拖动的状态
            if (isClick) {
                var xPos = e.pageX,
                    yPos = e.pageY;
                clipResize(xPos, yPos, direction);
            }
        });
        direcDom.mousemove(function(e) {
            e.stopPropagation();
        });
        // 松开鼠标
        $(window).mouseup(function(e) {
            isClick = false;
            direction = "";
        });
        clipBox.draggable({
            containment: ".clip-original",
            drag: function(){    //拖动时执行setClip();
                clipPreview();
            },
            stop: function(){
                clipPreview();
            }
        }); 
    }

    function clipResize(x, y, direc) {
        var offset = clipBox.offset(),
            offsetTop = offset.top,
            offsetLeft = offset.left,
            position = clipBox.position(),
            positionTop = position.top,
            positionLeft = position.left,
            boxWidth = clipBox.width(),
            resize,
            newLeft,
            newTop,
            newWidth;
        
        resize = x - offsetLeft;
        switch(direc) {
            case "lt":
                // lefttop
                newLeft = resize + positionLeft;
                newTop = resize + positionTop;
                newWidth = boxWidth - resize;
                // 防止超出左边界和上边界
                newLeft = newLeft <= 0 ? 0 : newLeft;
                newTop = newTop <= 0 ? 0 : newTop;
                break;
            case "rt":
                // righttop
                newLeft = positionLeft;
                newTop = positionTop + boxWidth - resize;
                newWidth = resize;
                newTop = newTop <= 0 ? 0 : newTop;
                if (newLeft + newWidth >= originWidth) {
                    newWidth = originWidth - newLeft;
                    return false;
                }
                break;
            case "rb":
                // rightbottom
                newLeft  = positionLeft;
                newTop = positionTop;
                newWidth = resize;
                if (newWidth + newLeft >= originWidth) {
                    newWidth = originWidth - newLeft;
                    return false;
                }
                break;
            case "lb":
                // leftbottom
                newLeft = resize + positionLeft;
                newTop = positionTop;
                newWidth = boxWidth - resize;
                newLeft = newLeft <= 0 ? 0 : newLeft;
                if (newWidth + newTop >= originWidth) {
                    newWidth = originWidth - newTop;
                    return false;
                }
                break;
            default: 
                break;
        }
        // 防止缩为一个点
        if (newWidth <= 8) {
            newWidth = 8;
            return false;
        }

        // clipbox的边框跟随着鼠标进行resize
        clipBox.css({
            "left": newLeft,
            "width": newWidth,
            "height": newWidth,
            "top": newTop
        });
        clipPreview();
    }

    function clipPreview() {
        var position = clipBox.position(),
            positionTop = position.top,
            positionLeft = position.left,
            boxWidth = clipBox.width(), // 原始剪裁的宽度
            preWidth = preBox.width(), // 预览剪裁的宽度
            originWidth = originCon.width(), // 原始的图片宽度
            prePicWidth, // 预览的图片宽度
            prePicLeft,
            prePicRight,
            prePicTop,
            prePicBottom;        

        // 前置层高亮部分的显示
        var rect = 'rect(' + positionTop + 'px ' + (positionLeft + boxWidth) + 'px ' + (positionTop + boxWidth) + 'px ' + positionLeft + 'px)';
        clipPic.css('clip', rect);

        // 预览部分的显示
        prePicWidth = originWidth * preWidth / boxWidth; // prePicWidth / preWidth = originWidth / boxWidth
        prePicLeft = positionLeft * prePicWidth / originWidth;
        prePicRight = positionLeft + prePicWidth;
        prePicTop = positionTop * prePicWidth / originWidth;
        prePicBottom = prePicTop + prePicWidth;
        console.log(prePicTop);
        var preRect = 'rect(' + prePicTop + 'px ' + prePicRight + 'px ' + prePicBottom + 'px ' + prePicLeft + 'px)';
        prePic.css({'width': prePicWidth, 'height': prePicWidth, 'clip': preRect, 'left': -prePicLeft, 'top': -prePicTop});

    }
})();
