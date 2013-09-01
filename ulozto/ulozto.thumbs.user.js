var document.qsLoaded = false;
var site = RegExp('(www\.)?uloz(\.to|to\.cz)');
if(!site.test(document.location.host)) return;

$(document).ready(function() {
    if(!document.qsLoaded) {
        var wrap = $('article');

        var url = $('.thumbVideo .jsShowDownload img', wrap).attr('src');
        var sep = url.lastIndexOf('.');
        var urlPre = url.substr(0,sep-1);
        var urlAfter = url.substr(sep);

        for(var idx=9; idx>=0; --idx) {
            wrap.after('<img src="' + urlPre + idx + urlAfter +'"/ >');
        }
    }
});
