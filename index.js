
const program = require('commander')
	rp= require('request-promise');

	//console.log(proj4);

program
  .version('0.0.1')
  .description('Command line Weather Application')

program
  .command("etrs89 <koordinater>")
  .alias('e')
  .description('transformer fra wgs84 til etrs89')
  .action(koordinater => transformer(koordinater, 'etrs89', 0, []));

program
  .command("wgs84 <koordinater>")
  .alias('w')
  .description('transformer fra etrs89 til wgs84')
  .action(koordinater => transformer(koordinater, 'wgs84', 0, [])); 

program.parse(process.argv);

async function transformer(koordinaterfrom, to, niveau, koordinaterto) {
	try {
		if (niveau === 0) {
			koordinaterfrom= JSON.parse(koordinaterfrom);
			//console.log(koordinaterfrom);
		}
		if (!Array.isArray(koordinaterfrom) && niveau === 0) {
			console.log('Argument er ikke array');
		}
		//console.log(' isFinitr: ' + Number.isFinite(koordinaterfrom[0]));
		if (!(Number.isFinite(koordinaterfrom[0]) && koordinaterfrom.length === 2)) {
			for (let i= 0; i<koordinaterfrom.length; i++) {
				koordinaterto.push([]);
				await transformer(koordinaterfrom[i], to, niveau+1, koordinaterto[i]);
			};
		}
		else {
			if (to === 'wgs84') {
				let wgs84= await rp('https://services.kortforsyningen.dk/rest/webproj/v1.0/trans/EPSG:25832/EPSG:4258/'+koordinaterfrom[0].toFixed(3)+','+koordinaterfrom[1].toFixed(3)+'?token=d23aed4ea6f89420aae2fcf89b47e95b');
				//console.log(wgs84);
				wgs84= JSON.parse(wgs84);
				koordinaterto.push(wgs84.v2);
				koordinaterto.push(wgs84.v1);
				console.log(koordinaterfrom);
				console.log(koordinaterto);
			}
			else if (to === 'etrs89') {
				let etrs89= await rp('https://services.kortforsyningen.dk/rest/webproj/v1.0/trans/EPSG:4258/EPSG:25832/'+koordinaterfrom[1].toFixed(10)+','+koordinaterfrom[0].toFixed(10)+'?token=d23aed4ea6f89420aae2fcf89b47e95b');
				//console.log(etrs89)
				etrs89= JSON.parse(etrs89);
				koordinaterto.push(etrs89.v1.toFixed(3));
				koordinaterto.push(etrs89.v2.toFixed(3));
				console.log(koordinaterfrom);
				console.log(koordinaterto);
			}
		}
		console.log(niveau);
		if (niveau === 0) {
			console.log(JSON.stringify(koordinaterto));
		}
	}
	catch (e) {
		//console.log(e);
	}
}