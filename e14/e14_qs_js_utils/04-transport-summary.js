(function ($) {
$('document').ready( function () {

	/***
	 * TRANSPORT SUMMARY
	 *
	 * On transport overview dialog (CartsDialog)
	 * there is added "sum" command, after click
	 * it will display sumarization in form:
	 *  Workshop1: 30*GoodOne  20*GoodTwo ...
	 *  ...
	 *
	 * This script goes through all current transports and
	 * their goods and good counts and calculates sumarization
	 * based on destination workshops.
	 */
	var transpOverview = $('.body .transportOverview');

	if(transpOverview.length == 1) {
		var transports = $('div.transport');
		var transSumBtn = $('<div id="transSum">sum</div>');
		var transSumRes = $('<pre id="transSumRes"></pre>');
		transSumRes.fadeTo(1,0.85);
		transSumRes.hide();
		transSumRes.click( function () { $(this).hide(500); } );
		var displayResults = function (res) {
			//alert(res);
			transSumRes.html(res);
			transSumRes.show(500);
		};
		transpOverview.before( transSumBtn );
		transpOverview.before( transSumRes );
		if( transports.length == 0 ) {
			transSumBtn.animate({'opacity':0.25},500);
			transSumBtn.click( function () {
				displayResults('No transport at the moment!');
			});
			return;
		}
		transSumBtn.click( function () {
			var sum = {};
			transports.each( function () {
				var dest = $('.destination span', $(this)).text();
				if( sum[dest] == undefined ) {
					sum[dest] = {};
				}
				$('.transportedGoods .available' ,$(this)).each( function () {
					var goodName = $('.textLabel', $(this)).text().trim();
					var goodCount = $(this).contents().filter(function () {
						return this.nodeType == 3;
					}).first().text();

					if( sum[dest][goodName] == undefined ) {
						sum[dest][goodName] = 0;
					}
					sum[dest][goodName] += Number(goodCount);
				});
			});
			var sumStr = '';
			for( var d in sum ) {
				sumStr += d + ':';
				for( var g in sum[d] ) {
					sumStr += '  ' + sum[d][g] + '*' + g;
				}
				sumStr += '\n';
			}
			displayResults(sumStr);
		});
	}

})
})(jQuery.noConflict());

