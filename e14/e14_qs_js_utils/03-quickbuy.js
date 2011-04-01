
(function ($) {
var qsQuickBuyGID = -1;
var qsQuickBuySum = 0;

$('document').ready( function () {

	/***
	 * QUICK BUY
	 *
	 * On market screen after selecting wanted goods tab and target building,
	 * click "QB" to show "qb" - goods selectors - next to each goods block.
	 * Click "qb" to choose good you want to buy - it should be visualy highlighted 
	 * and "Buy" command next to already used "QB".
	 * It will place order for 10 items of selected good and commit the order.
	 * Then you can continue clicking on "Buy"+Close, "Buy"+Close until you
	 * reach demanded count.
	 */
	var marketDialog = $('.body.marketplace');
	if(marketDialog.length == 1) {
		var changeSum = function (newSum) {
			qsQuickBuySum = newSum;
			$('#sumQB').text(qsQuickBuySum);
		};
		var incSum = function () {
			changeSum( qsQuickBuySum + 1 );
		};
		marketDialog.prepend( $('<div id="sumQB"></div>') );
		marketDialog.prepend( $('<div id="toggleQB">QB</div>').click( function () {
			$('.marketProduct').each( function () {
				$('div.currentValue', $(this)).append(
					$('<span class="chooseQB">qb</span>').click(function () {
						$('.marketProduct .goodBig').css('border', '0px');
						$('.goodBig', $(this).parent().parent()).css('border','1px dotted #553910');
						var srcID = $('span', $(this).parent()).first().attr('id');
						var parts = srcID.split('_');
						qsQuickBuyGID = parts[1];
						changeSum(0);
						$("#executeQB").animate({opacity:1.0},500);
					})
					);
			});
		}) );
		marketDialog.prepend( $('<div id="executeQB">Buy</div>').click( function() {
			if( qsQuickBuyGID == -1 ) {
				return;
			}
			incSum();
			$('#gid'+qsQuickBuyGID).attr('value', 10);
			$('#gid'+qsQuickBuyGID).blur();
			transportObj.buy(activeBuildingId);
		}).animate({opacity:0.25},300) );
		changeSum(0);

	}

})
})(jQuery.noConflict());

