(function ($) {
var qsQuickLaunchLinks = Array(
	'Alch', 'http://s2.cz.europe1400.com/index.php?userId=50767&view=FactoryView&districtId=500&buildingId=114365&roomId=3&cityId=5&dialog=ProduceDialog',
	'Koz', 'http://s2.cz.europe1400.com/index.php?userId=50767&view=FactoryView&districtId=501&buildingId=119859&roomId=3&cityId=5&dialog=ProduceDialog',
	'Klob', 'http://s2.cz.europe1400.com/index.php?userId=50767&view=FactoryView&districtId=500&buildingId=104162&roomId=3&cityId=5&dialog=ProduceDialog',
	'Knih', 'http://s2.cz.europe1400.com/index.php?userId=50767&view=FactoryView&districtId=500&buildingId=113216&roomId=3&cityId=5&dialog=ProduceDialog'
	);

$('document').ready( function () {

	/***
	 * QUICK LAUNCH LINKS
	 *
	 * This is alternative to classic browser bookmarks,
	 * only more static (you have to edit this script if
	 * you want to change them and so on), but placed
	 * inside game screen/layout - so for me its more
	 * friendly ;)
	 *
	 * edit qsQuickLaunchLinks array,
	 * first is link name second is target url
	 * then next link name, url follows and so on.
	 *
	 * To change icons displayed at background of these links,
	 * you need to get familiar with "Image arrays",
	 * and then get positions of your demanded icons.
	 * And finaly change these positions at
	 * classes qsLink0/qsLink2/... and so on
	 * inside ./e14_qs_tools.css.
	 *
	 */
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
})(jQuery.noConflict());



