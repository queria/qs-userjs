document.qsLoaded = false;
var site = RegExp('(www\.)?uloz(\.to|to\.cz)');
// uncomment for development/debugging
// site = RegExp('localhost|(www\.)?uloz(\.to|to\.cz)');
if(!site.test(document.location.host)) return;

$(document).ready(function() {
    if(document.qsLoaded) return;
    document.qsLoaded = true;
    var wrap = $('article');
    var downLink = $('#fileDownload', wrap);


    var url = $('.thumbVideo .jsShowDownload img', wrap).attr('src');
    var sep = url.lastIndexOf('.');
    var urlPre = url.substr(0,sep-1);
    var urlAfter = url.substr(sep);

    
    for(var idx=9; idx>0; --idx) {
        downLink.after('<img width="640" height="360"' +
            ' alt="Image '+idx+'"' +
            ' src="' + urlPre + idx + urlAfter +'"/ >');
    }
});

