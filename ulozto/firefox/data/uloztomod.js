$(document).ready(function() {
    if(document.qsLoaded) return;
    document.qsLoaded = true;
    var wrap = $('article');
    if(wrap.length < 1) return;
    var downLink = $('#fileDownload', wrap);
    if(downLink.length < 1) return;


    var url = $('.thumbVideo .jsShowDownload img', wrap).attr('src');
    if(url == undefined) return;
    var sep = url.lastIndexOf('.');
    var urlPre = url.substr(0,sep-1);
    var urlAfter = url.substr(sep);

    
    for(var idx=9; idx>0; --idx) {
        downLink.after('<img width="640" height="360"' +
            ' alt="Image '+idx+'"' +
            ' src="' + urlPre + idx + urlAfter +'"/ >');
    }
});

$(document).ready(function() {
    var searchRes = $('.searchResults .chessFiles');
    if(searchRes.length < 1) {
        console.log('no search results');
        return;
    }
    
    var items = $('.fileName h4 a', searchRes);
    if(items.length < 1) {
        console.log('no search result items')
        return;
    }

    var maxTries = 30;
    var retryTimer = null;

    var transformLinks = function () {
        if( !('ad' in unsafeWindow) || !('kn' in unsafeWindow) ) {
            console.log('ad/kn objects not ready yet');
            maxTries--;
            if(maxTries <= 0) {
                clearInterval(retryTimer);
                console.log('Timeout while waiting for ad/kn objects');
            }
            return;
        }
        clearInterval(retryTimer);
        console.log('Going to update item links');
        for(var idx=0; idx < items.length; ++idx) {
            item = items.eq(idx);
            var url = unsafeWindow.ad.decrypt(
                    unsafeWindow.kn[
                        item.attr('data-icon')]);
            item.attr('href', url);

            var imgParent = item.parent().parent().parent();
            var img = $('img.thumb_rotate', imgParent);
            var link = $('<a />');
            link.attr('href', url);
            img.before(link);
            link.append(img);
        }
    };
    retryTimer = setInterval(transformLinks, 600);
});
