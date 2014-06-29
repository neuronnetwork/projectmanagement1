'use strict';
 
exports.helperfunctions = function(config) {
	
	function createTmpFilename(filename) {
		var timestamp = new Date().getTime() ;
		console.log('createTmpFilename: ' + filename);
		console.log('createTmpFilename:  timestamp' + timestamp);
		console.log('path.basename(filename): ' + path.basename(filename, path.extname(filename)));
		console.log('path.extname(filename): ' + path.extname(filename));
	
		return  path.basename(filename, path.extname(filename)) + '_' +timestamp + path.extname(filename);
	}
 
	function convertSvg2Pdf(svgData, filenameSvg, filenamePdf) {
		console.log('convertSvg2Pdf:  filename: ' + filenameSvg);
		// console.log('convertSvg2Pdf:  svgData: ' + svgData);
		
		fs.writeFileSync(filenameSvg, svgData); 
		console.log('convertSvg2Pdf: success writing data to file: ' + filenameSvg);
		
		var convert = 'convert';
		var args = [filenameSvg ,filenamePdf];
		var options = null;
		child_process.execFile(convert, args, options, function (error, stdout, stderr) {
		    console.log('convertSvg2Pdf --> stdout: ' + stdout);
		    console.log('convertSvg2Pdf --> stderr: ' + stderr);
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }		
		});
	}
	
	function writeCSV(csvData,csvFilename) {
		console.log('writeCSV:  filename: ' + csvFilename);
		console.log('writeCSV:  csvData: ' + csvData);
		var data = JSON.stringify(csvData); 
		var zeilen = []; 
		var zeile = "Artikel"+ ";" +"Preis"+ ";" +"Wien"+ ";" +"OÖ"+ ";" +"Bgld"+"\n";

		zeilen.push(zeile);
		for (var i = 0; i < csvData.length; i++) {
			zeile = csvData[i].artikel + ";" +csvData[i].preis + ";" +csvData[i].wien+ ";" +csvData[i].oo + ";" +csvData[i].bgld +"\n";
			zeilen.push(zeile);
	 	} 
		fs.writeFileSync(csvFilename, zeilen); 
	}

};