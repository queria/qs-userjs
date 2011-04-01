(function ($) {
/*
var qsQuickLaunchLinks = Array(
	'Alch', 'http://s2.cz.europe1400.com/index.php?userId=50767&view=FactoryView&districtId=500&buildingId=114365&roomId=3&cityId=5&dialog=ProduceDialog',
	'Koz', 'http://s2.cz.europe1400.com/index.php?userId=50767&view=FactoryView&districtId=501&buildingId=119859&roomId=3&cityId=5&dialog=ProduceDialog',
	'Klob', 'http://s2.cz.europe1400.com/index.php?userId=50767&view=FactoryView&districtId=500&buildingId=104162&roomId=3&cityId=5&dialog=ProduceDialog',
	'Knih', 'http://s2.cz.europe1400.com/index.php?userId=50767&view=FactoryView&districtId=500&buildingId=113216&roomId=3&cityId=5&dialog=ProduceDialog'
	);

$('document').ready( function () {

	var linksString = '';
	var links = qsQuickLaunchLinks;
	for(var idx=0; idx < links.length; idx += 2) {
		linksString += '<li class="qsLink qsLink'+idx+'">'
			+ '<a href="'+links[idx+1]+'">'+links[idx]+'</a>'
		+'</li>';
	}
	linksString = '<ul id="qsLinks">'+linksString+'</ul>';
	$('.shortcutButton').after(linksString);
	
})
*/
if ( document.location != 'http://s4.zeleneimperium.cz/main.php?page=garden' ) {
//if ( document.location != 'http://s4.zeleneimperium.cz/garten_map.php' ) {
	return;
}
$('document').ready( function () {
	var nullImage = 'http://pics.wurzelimperium.de/pics/produkte/0.gif';
	var nullImageUrl = 'url("'+nullImage+'")';
	var harvestTool = $('#ernten');
	var waterTool = $('#giessen');
	var processMethod = undefined;
	var processTimeout = 0;
	var processItems = [];
	var maxWaitTime = 400;
	var waterItem = function (item) {
		waterTool.click();
		item.click();
		//item.css('background-color', 'blue !important');
	};
	var harvestItem = function (item) {
		harvestTool.click();
		item.click();
		//item.css('background-color', 'white !important');
	};
	var seedItem = function (item) {
		// seed selected  ... hopefully
		item.click();
	};
	var breakProcess = function () {
		processItems = [];
		clearTimeout(processTimeout);
	};
	var randomOrder = function () {
		return (Math.round(Math.random()) - 0.5);
	};
	var doProcess = function (randomize) {
		if( randomize ) {
			processItems.sort( randomOrder );
		}
		if(processItems.length == 0) return;
		processMethod(processItems.pop());
		$('#qsCounter').text( processItems.length );
		if(processItems.length == 0) return;
		processTimeout = setTimeout(doProcess, Math.random() * maxWaitTime);
	};
	var waterAll = function () {
		breakProcess();
		processMethod = waterItem;
		$('iframe[name=garten]').contents().find('img.wasser').each( function () {
			if(
				// if we have 'no water image'
				$(this).attr('src') == 'http://pics.wurzelimperium.de/pics/0.gif'
				// not blocked (stone etc)
				&& $('img.cursor[alt=0]', $(this).parent()).length == 0
				// and not grown up
				&& $('img.cursor[alt=2]', $(this).parent()).length == 0 
				// and not empty field
				&& $(this).parent().css('background') != nullImageUrl
			) {
				processItems.push( $(this).parent() );
			}
		});
		doProcess(true);
	};
	var harvestAll = function () {
		breakProcess();
		processMethod = harvestItem;
		//harvestTool.click();
		$('iframe[name=garten]').contents().find('img.cursor[alt=2]').each( function () {
			processItems.push( $(this).parent() );
				//$(this).css('border: 1px solid red !important');
		});
		doProcess(true);
	};
	var seedAll = function () {
		// verify if plant seed is selected?
		// find all empty fields
		breakProcess();
		processMethod = seedItem;
		$('iframe[name=garten]').contents().find('img.wasser').each( function () {
			if(
				// if we have 'no water image'
				$(this).attr('src') == 'http://pics.wurzelimperium.de/pics/0.gif'
				// not blocked (stone etc)
				&& $('img.cursor[alt=0]', $(this).parent()).length == 0
				// and not grown up
				&& $('img.cursor[alt=2]', $(this).parent()).length == 0 
				// AND EMPTY field
				&& $(this).parent().css('background') == nullImageUrl
			) {
				processItems.push( $(this).parent() );
			}
		});
		doProcess(true);
	};
	$('body').prepend( '<div id="qs_zi_tool_panel">My panel: '
			+'<a id="qsWaterAll" href="#">water</a> '
			+'<a id="qsHarvestAll" href="#">harvest</a> '
			+'<a id="qsSeedAll" href="#">seed</a> '
			+'<a id="qsBreakProc" href="#">break</a> '
			+'remains <span id="qsCounter">0</span> '
			+'</div>');
	$('#qsWaterAll').click( function () { waterAll(); return false; } );
	$('#qsHarvestAll').click( function () { harvestAll(); return false; } );
	$('#qsSeedAll').click( function () { seedAll(); return false; } );
	$('#qsBreakProc').click( function () { breakProcess(); return false; } );
});
})(jQuery.noConflict());

