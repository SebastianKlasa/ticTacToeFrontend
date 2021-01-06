$(function() {
    $(".mouse-hover").hover(function(e) {
        var thisElement = $(this);
        var el_pos = thisElement.offset();
        var edge = closestEdge(e.pageX - el_pos.left, e.pageY - el_pos.top, thisElement.width(), thisElement.height());
        thisElement.removeClass('leaved-top leaved-right leaved-bottom leaved-left');
        thisElement.addClass(edge);
    }, function(e) {
        var thisElement = $(this);
        var el_pos = thisElement.offset();
        var edge = closestEdge(e.pageX - el_pos.left, e.pageY - el_pos.top, thisElement.width(), thisElement.height());
        thisElement.removeClass('top right bottom left');
        thisElement.addClass('leaved-'+edge);
    });
});

function closestEdge(x,y,w,h) {
        var topEdgeDist = distMetric(x,y,w/2,0);
        var bottomEdgeDist = distMetric(x,y,w/2,h);
        var leftEdgeDist = distMetric(x,y,0,h/2);
        var rightEdgeDist = distMetric(x,y,w,h/2);
    
        var min = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist);
        switch (min) {
            case leftEdgeDist:
                return "left";
            case rightEdgeDist:
                return "right";
            case topEdgeDist:
                return "top";
            case bottomEdgeDist:
                return "bottom";
        }
}
    
function distMetric(x,y,x2,y2) {
    var xDiff = x - x2;
    var yDiff = y - y2;
    return (xDiff * xDiff) + (yDiff * yDiff);
}

/* Swiper Gallery */

$(function(){
    var ww = $(window).width();
    if( ww < 560 ) { 
        var gallery = new Swiper('.swiper-container', {
            spaceBetween: 0,
            loop: false,
        });
    }
})