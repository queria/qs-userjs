var data = require('sdk/self').data;
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
    include: ["*.uloz.to", "*.ulozto.cz"],
    contentScriptFile: [data.url("jquery.min.js"), data.url("uloztomod.js")],
    attachTo: ["existing", "top"]
});

