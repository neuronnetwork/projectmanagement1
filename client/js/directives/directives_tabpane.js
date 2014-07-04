'use strict';

/* Directives */

angular.module('grgProjectmanagement.directives', [])
	.directive('tabs', function() {
		return {
			restrict : 'E',
			transclude : true,
			scope : {},
			controller : function($scope, $element) {
					var panes = $scope.panes = [];
					$scope.select = function(pane) {
						angular.forEach(panes, function(pane) {
							pane.selected = false;
						});
						pane.selected = true;
					}
					console.log("sldhfsdhf");
					
					this.addPane = function(pane) {
						if (panes.length == 0)
							$scope.select(pane);
							panes.push(pane);
					}
			},
			template : '<div class="tabbable">'
					+ '<ul class="nav nav-tabs">'
					+ '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'
					+ '<a ng-click="select(pane)">{{pane.title}}</a>'
					+ '</li>'
					+ '</ul>'
					+ '<div class="tab-content" ng-transclude></div>'
					+ '</div>',
			replace : true
		};
	})
	.directive('pane', function() {
		return {
			require : '^tabs',
			restrict : 'E',
			transclude : true,
			scope : {
				title : '@'
			},
			link : function(scope, element, attrs, tabsCtrl) {
					tabsCtrl.addPane(scope);
			},
			template : '<div class="tab-pane" ng-class="{active: selected}" ng-transclude></div>',
			replace : true
		}
	})
.directive('grgetherpad', function() {
		return {
			restrict : 'EA',
			scope : {
				data : "=",
 			},
			link : function(scope, iElement, iAttrs) {
				var p = iElement[0];  
  
				scope.$watch('data', function(newVals, oldVals) {
				 	return scope.render(newVals);
				}, true);
				
				scope.render = function(data) { 
					if (data == undefined) return; 
					console.log('scope.render  id: ' + data.id);
					console.log('grgetherpad data' + JSON.stringify(data) );

					var id = "etherpad" + data.id;
					var username = data.username; 
					var usercolor = data.color; 
					console.log('username: ' +username);
					console.log('usercolor: ' +usercolor);
					console.log('id: ' +id);

					$(p).pad({ 
						'padId' : id,
						'showChat':'false', 
						'userName' : username, 
						'host': 'http://0.0.0.0:9001',
						 'width' : 400,
						 'height' : 600,
						 'showControls': true, 
						 'userColor' : usercolor,
 						 'border' : '1px',
						 'borderStyle' : 'solid'
					});
				}
			
				// 
			}
		}; 
	})
	.directive(
				'singleLineChart',
				function() {
					return {
						restrict : 'EA',
						scope : {
							data : "=" 
						},
						link : function(scope, iElement, iAttrs) {
  							 
							
							console.log('single-line-chart');
							var margin = {
									top : 20,
									right : 20,
									bottom : 80,
									left : 65
								},
								heightLabel = 50, 
								width = 900 - margin.left - margin.right, 
								height = 400 - margin.top - margin.bottom - heightLabel;

							var svg = d3
									.select(iElement[0])
									.append("svg")
									.attr("width",
											width + margin.left + margin.right)
									.attr("height",
											height + margin.top + margin.bottom + heightLabel)
									.append("g").attr(
											"transform",
											"translate(" + margin.left + ","
													+ margin.top + ")");
					
							scope.$watch('data', function(newVals, oldVals) {
							 	return scope.render(newVals);
							}, true);
				 		 
							// define render function
							scope.render = function(allData) { 
 								
				        		 	var data = allData.data;
									var diary = allData.diary; 
									// console.log('"singleLineChart" - data: ' + JSON.stringify(data)); 
									if (data === undefined) {
										return;
									}
									if (diary === undefined) {
										return;
									}
									if (data === null) {
										return;
									} 
									// remove all previous items before render
									svg.selectAll("*").remove();  
									
							        var parseDate = d3.time.format("%d.%m.%Y").parse;
									var format = d3.time.format("%d.%m.%Y"); 
									
									data.forEach(function(d) {
										d.order_date1 = parseDate(d.order_date)  ;
									 	d.yvalue = parseInt( d.yvalue);
									}); 

									var x = d3.time.scale()
									    .range([0, width]);
									
									var y = d3.scale.linear()
									    .range([height, 0]);
									
									var xAxis = d3.svg.axis().scale(x)
										.orient("bottom").ticks(data.length)
										.tickFormat(d3.time.format("%d.%m.%Y")); 
									    									    
									var yAxis = d3.svg.axis()
									    .scale(y)
									    .orient("left");
									
									y.domain(d3.extent(data, function(d) { return d.yvalue; }));
 
									var line = d3.svg.line()
									    .x(function(d) { return x(d.order_date1); })
									    .y(function(d) { return y(d.yvalue); });
 
									function formatDate(d) {
									 	var curr_year = d.getFullYear();
									 	var curr_month = d.getMonth() + 1; //Months are zero based
									 	if (curr_month < 10)
									       		curr_month = "0" + curr_month;

									 	var curr_day= d.getDate();
									        if (curr_day < 10)
									            curr_day = "0" + curr_day;

										return   curr_day +'.' + curr_month +'.' + curr_year ;
									}
									var duration = 21; 
									
									var end_date  = parseDate(data[data.length-1].order_date);
									var end_date_HR =  formatDate(end_date);
									var end_date_TS =  end_date.getTime() ;

							 		var dur = duration * 24 * 60 * 60 * 1000; 
									var start_date_TS = end_date.getTime() - dur;
									var start_date  = new Date(start_date_TS);
									 
									var start_date_HR = formatDate(start_date);
 									 
									//Add the year label; the value is set on transition.
									var label1 = svg.append("text")
										.attr("class", "year label")
										.attr("text-anchor", "end")
										.attr("y", 10 )
										.attr("x", width)
										.text(start_date_HR + " - " + end_date_HR);

					        		// console.log('label1 :  ' +(label1));

					        		// console.log('svg :  ' + (svg));

									// TODO: Add an overlay for the year label1.
									// var box = label1.node().getBBox();
					        		var box ={x: 320, y: -30, width: 480, height: 50}; 
 
									var overlay = svg.append("rect")
										.attr("class", "overlay")
										.attr("x", box.x)
										.attr("y", box.y)
										.attr("width", box.width)
										.attr("height", box.height)
										.on("mouseover", enableInteraction);
									
								    x.domain(d3.extent(data, function(d) { return d.order_date1; }));

							      
							        //After the transition finishes, you can mouseover to change the year.
							        function enableInteraction() {
 							        	var scaleLength = data.length - duration; 
							        	var yearScale = d3.scale.linear()
							        	    .domain([0, scaleLength])
							        	    .range([box.x + 10, box.x + box.width - 10])
							        	    .clamp(true);
							        	
							        	// Cancel the current transition, if any.
							        	svg.transition().duration(0);
							        	
							        	overlay
							        	    .on("mouseover", mouseover)
							        	    .on("mouseout", mouseout)
							        	    .on("mousemove", mousemove)
							        	    .on("touchmove", mousemove);
							        	
							        	function mouseover() {
							        	  label1.classed("active", true);
							        	}
							        	
							        	function mouseout() {
							        	  label1.classed("active", false);
							        	}
							        	
							        	function mousemove() { 
							        	  		displayYear(yearScale.invert(d3.mouse(this)[0])); 
							        	}
							        	
							        	  // Updates the display to show the specified year.
							        	function displayYear(year) {
							        		 year = Math.round(year); 
							        		 var deltaEnd = (scaleLength-year) * 24 * 60 * 60 * 1000; 
							        		 
							        		 // console.log('data[data.length-1].order_date : ' +data[data.length-1].order_date);
							        		 
							        		 end_date_TS =  parseDate(data[data.length-1].order_date).getTime() - deltaEnd;
							        		 end_date = new Date(end_date_TS); 
							        		 end_date_HR =  formatDate(end_date);
							        		   

							        		start_date_TS = end_date_TS - dur;
							        		 
							        		 start_date  = new Date(start_date_TS);
							        		 start_date_HR = formatDate(start_date);  
							         
							         	    	label1.text(start_date_HR + '-'+end_date_HR );
							        		var startIdx = year; 
							        		var endIdx = (year + duration);
							        		var data1 = data.slice(startIdx, endIdx);
							        		drawDiagram(data1); 
							        	  }
							        }

							        function drawDiagram(data1) {
							        	
							        	svg.selectAll(".line").remove(); 
							         	svg.selectAll(".axis").remove(); 
							         	svg.selectAll(".diaryentry").remove(); 

							         	xAxis = d3.svg.axis().scale(x)
							        		.orient("bottom").ticks(data1.length)
							        		.tickFormat(d3.time.format("%d.%m.%Y")); 
							        	  
							        	x.domain(d3.extent(data1, function(d) { return d.order_date1; }));
							        	 
							        	svg.append("g")
							        		      .attr("class", "x axis")
							        		      .attr("transform", "translate(0," + height + ")")
							        		      .call(xAxis) 
							        			  .selectAll("text")  
							        			  .style("text-anchor", "end")
							        			  .attr("dx", "-.8em")
							        			  .attr("dy", ".15em")
							        			  .attr("transform", function(d) {
							        			    	return "rotate(-65)" 
							        				}); 
							        	  
							        	  svg.append("g")
							        	      .attr("class", "y axis")
							        	      .call(yAxis)
							        	    .append("text")
							        	      .attr("transform", "rotate(-90)")
							        	      .attr("y", 6)
							        	      .attr("dy", ".71em")
							        	      .style("text-anchor", "end")
							        	    //  .text("BEstellungen pro Tag");
							        	
							        	  svg.append("path")
							        	      .datum(data1)
							        	      .attr("class", "line")
							        	      .attr("d", line);
							         	  
							        	  var div = d3.select("body").append("div")   
											.attr("class", "tooltip")               
											.style("opacity", 0); 
			
										svg.selectAll(".diaryentry")
												.data(diary)
											.enter()
												.append("rect")
												.attr("class", "diaryentry")
												.attr("x",function(d) { return x(d.date) - 10 / 2; })
												.attr("y", height - 10 / 2)
												.attr("width", 10)
												.attr("height", 10)
												.on("mouseover",function(d) {
															div.transition().duration(200)
																	.style("opacity", .9);
															div.html(d.entry)
																.style("left",(d3.event.pageX) + "px")
																	.style("top", (d3.event.pageY - 50) + "px");
														})
												.on("mouseout",function(d) {
															div.transition().duration(500)
																.style("opacity", 0);
												});
							        }	
							        // console.log('call enableInteraction()'); 
							        enableInteraction(); 
							} ; 
						}
					};
				})
		.directive(
				'stackedLineChart',
				function() {
					return {
						restrict : 'EA',
						scope : {
							data : "="
						},
						link : function(scope, iElement, iAttrs) {
							console.log('stackedLineChart');

							var margin = {
								top : 20,
								right : 20,
								bottom : 80,
								left : 65
							}, 
							heightLabel = 50, 
							width = 900 - margin.left - margin.right, 
							height = 550 - margin.top - margin.bottom - heightLabel;

							var svg = d3
									.select(iElement[0])
									.append("svg")
									.attr("width",
											width + margin.left + margin.right)
									.attr("height",
											height + margin.top + margin.bottom + heightLabel)
									.append("g").attr(
											"transform",
											"translate(" + margin.left + ","
													+ margin.top + ")");

							scope.$watch('data', function(newVals, oldVals) { 
								return scope.render(newVals);
							}, true);
							
							// define render function
							scope.render = function(allData) {

								var data = allData.data;
								var diary = allData.diary;
								
								//console.log('allData: ' + JSON.stringify(allData)); 
						
								if (data === undefined) {
									// // // // console.log('data is undefined - we return');
									return;
								}
								if (diary === undefined) {
									// // // // console.log('diary is undefined - we return');
									return;
								}
								if (data === null) {
									// // // // console.log('data is null - we return');
									return;
								}
								
								
								
								
								var keys = []; 

								for (var i= 0; i < data.length; i++) {
									if (keys.indexOf(data[i].diocese) == -1) {
										keys.push(data[i].diocese);
									}
								}
								var orderDates = []; 

								for (var i= 0; i < data.length; i++) {
									if (orderDates.indexOf(data[i].order_date) == -1) {
										var entry = {}; 
										entry.ts = 	data[i].order_timestamp;
										entry.order_date = 	data[i].order_date;
										orderDates.push(entry);
									}
								} 

								// var insertMissingElements = []; 
								for (var i = orderDates.length-1; i >= 0; i--) {
									var entry1 = orderDates[i]; 
									var ordDate = entry1.order_date;
									var ts = entry1.ts;

									// count all keys for this orderdate and remember them .. 
									var keysOrderDate = []; 
									for (var j = 0; j < data.length; j++) {
										if (ordDate == data[j].order_date) {
											keysOrderDate.push(data[j].diocese);
										}
									}
							1		// add entries with missing keys 
									if (keysOrderDate.length < keys.length) {
 										for (var j = 0; j < keys.length; j++) {
											if (keysOrderDate.indexOf(keys[j]) == -1) { 
												var entry = {}; 
												entry.diocese = keys[j];
												entry.order_date = ordDate;
												entry.value = 2;
												entry.order_timestamp = entry1.ts; 
												 
												data.push(entry); 
											}
										}
									} 
									
								}
								Array.prototype.sortOn = function(key) {
									this.sort(function(a, b) {
									    if(a[key] < b[key]) {
									        return -1;
									    }else if(a[key] > b[key]){
									        return 1;
									    }
									    return 0;
									});
								} 
								data.sortOn('diocese' ); 
								data.sortOn('order_timestamp' ); 
  
								
								
								// remove all previous items before render
								svg.selectAll("*").remove();
	
								var format = d3.time.format("%d.%m.%Y");
						        var parseDate = d3.time.format("%d.%m.%Y").parse;

								var x = d3.time.scale().range([ 0, width ]);
	
								var y = d3.scale.linear().range([ height, 0 ]);
	
								var z = d3.scale.category20c();
	
								var xAxis = d3.svg.axis().scale(x).orient("bottom")
										.ticks(d3.time.days).tickFormat(
												d3.time.format("%d.%m.%Y"));
	
								var yAxis = d3.svg.axis().scale(y).orient("left");
	
								var stack = d3.layout.stack().offset("zero")
										.values(function(d) {
											return d.values;
										}).x(function(d) {
											return d.order_date1;
										}).y(function(d) {
											return d.value1;
										});
	
								var nest = d3.nest().key(function(d) {
									return d.diocese;
								});
	
								var area = d3.svg.area()
								// .interpolate("cardinal")
									.x(function(d) {
										return x(d.order_date1);
									}).y0(function(d) {
										return y(d.y0);
									}).y1(function(d) {
										return y(d.y0 + d.y);
									});
	
								function formatDate(d) {
								 	var curr_year = d.getFullYear();
								 	var curr_month = d.getMonth() + 1; //Months are zero based
								 	if (curr_month < 10)
								       		curr_month = "0" + curr_month;

								 	var curr_day= d.getDate();
								        if (curr_day < 10)
								            curr_day = "0" + curr_day;

									return   curr_day +'.' + curr_month +'.' + curr_year ;
								}
								var duration = 21;
								
								
								var end_date  = parseDate(data[data.length-1].order_date);
								var end_date_HR =  formatDate(end_date);
								var end_date_TS =  end_date.getTime() ;

						 		var dur = duration * 24 * 60 * 60 * 1000; 
								var start_date_TS = end_date.getTime() - dur;
								var start_date  = new Date(start_date_TS);
								 
								var start_date_HR = formatDate(start_date);
								 
								data.forEach(function(d) {
									// // // // // console.log('d: ' + JSON.stringify(d));
									d.order_date1 = format.parse(d.order_date);
									d.value1 = +d.value;
								});
								 
								var layers = stack(nest.entries(data));
								// // // // // console.log('nach layers: ');
	
								x.domain(d3.extent(data, function(d) {
									return d.order_date1;
								}));
								y.domain([ 0, d3.max(data, function(d) {
									return d.y0 + d.y;
								}) ]);
	
								var div = d3.select("body").append("div")   
									.attr("class", "tooltip")               
									.style("opacity", 0);
								
								var divDiary = d3.select("body").append("div")   
									.attr("class", "tooltip")               
									.style("opacity", 0);
															
								//Add the year label; the value is set on transition.
								var label = svg.append("text")
								  .attr("class", "year label")
								  .attr("text-anchor", "end")
								  .attr("y", 10 )
								  .attr("x", width)
								  .text(start_date_HR + " - " + end_date_HR);

								//Add an overlay for the year label.
 								// TODO: Add an overlay for the year label1.
								// var box = label1.node().getBBox();
				        		var box ={x: 320, y: -30, width: 480, height: 50}; 
								// // console.log('data1.length: ' + data1.length/10);

								var overlay = svg.append("rect")
									.attr("class", "overlay")
									.attr("x", box.x)
									.attr("y", box.y)
									.attr("width", box.width)
									.attr("height", box.height)
									.on("mouseover", enableInteraction);

								//After the transition finishes, you can mouseover to change the year.
								function enableInteraction() {
									var scaleLength = data.length/10 - duration; 
									var yearScale = d3.scale.linear()
									    .domain([0, scaleLength])
									    .range([box.x + 10, box.x + box.width - 10])
									    .clamp(true);
									
									// Cancel the current transition, if any.
									svg.transition().duration(0);
									
									overlay
									    .on("mouseover", mouseover)
									    .on("mouseout", mouseout)
									    .on("mousemove", mousemove)
									    .on("touchmove", mousemove);
									
									function mouseover() {
									  label.classed("active", true);
									}
									
									function mouseout() {
									  label.classed("active", false);
									}
									
									function mousemove() {
										//// // console.log('d3.mouse(this)[0]: ' +d3.mouse(this)[0]);
									  	displayYear(yearScale.invert(d3.mouse(this)[0]));
									}
									
									  // Updates the display to show the specified year.
									  function displayYear(year) {
//										 
 										  year = Math.round(year); 
							        		 var deltaEnd = (scaleLength-year) * 24 * 60 * 60 * 1000; 
							        		 
							        		 // // console.log('data[data.length-1].order_date : ' +data[data.length-1].order_date);
							        		 
							        		 end_date_TS =  parseDate(data[data.length-1].order_date).getTime() - deltaEnd;
							        		 end_date = new Date(end_date_TS); 
							        		 end_date_HR =  formatDate(end_date);
							        		   

							        		start_date_TS = end_date_TS - dur;
							        		 
							        		 start_date  = new Date(start_date_TS);
							        		 start_date_HR = formatDate(start_date);  
							         
							         	    label.text(start_date_HR + '-'+end_date_HR );
							        		
							         	    var startIdx = year*10; 
							        		var endIdx = (year + duration) * 10;
							        		
							        		var data1 = data.slice(startIdx, endIdx);
							        		drawDiagram(data1); 
									  }
								}

								function drawDiagram(data1) {
									svg.selectAll(".layer").remove(); 
								 	svg.selectAll(".axis").remove(); 
								 	svg.selectAll(".axis").remove(); 
								 	svg.selectAll(".diaryentry").remove(); 

									  var layers = stack(nest.entries(data1));
									 
									  x.domain(d3.extent(data1, function(d) { return d.order_date1; }));
									  // y.domain([0, d3.max(data1, function(d) { return d.y0 + d.y; })]);


									  svg.selectAll(".layer")
									      .data(layers)
									    .enter().append("path")
									      .attr("class", "layer")
									      .attr("d", function(d) { return area(d.values); })
									      .style("fill", function(d, i) { return z(i); })
										 .on("mouseover", function(d) { 
											// // // console.log('d: ' + JSON.stringify(d));      
										    div.transition()        
										        .duration(200)      
										        .style("opacity", .9);      
										    div .html(d.key  )  
										        .style("left", (d3.event.pageX) + "px")     
										        .style("top", (d3.event.pageY -50 ) + "px");    
										    }) 
										.on("mouseout", function(d) {       
										    div.transition()        
										        .duration(500)      
										        .style("opacity", 0);   
										});

  								  svg.append("g")
					        		      .attr("class", "x axis")
					        		      .attr("transform", "translate(0," + height + ")")
					        		      .call(xAxis) 
					        			  .selectAll("text")  
					        			  .style("text-anchor", "end")
					        			  .attr("dx", "-.8em")
					        			  .attr("dy", ".15em")
					        			  .attr("transform", function(d) {
					        			    	return "rotate(-65)" 
					        				}); 
				        	   
									  svg.append("g")
									      .attr("class", "y axis")
									      .call(yAxis);
									 
									  svg.selectAll(".diaryentry")
									   	     .data(diary)
									    .enter().append("rect")
									      .attr("class", "diaryentry")
									     //  .attr("d", function(d) { return area(d.values); })
									     // .style("fill", function(d, i) { return z(i); }) 
									  		.attr("x", function(d) {  return x(d.date) - 10/2; })
									  		.attr("y", height-10/2)
									  		 .attr("width", 10)
									  		 .attr("height", 10)
									  		 .on("mouseover", function(d) {      
										    divDiary.transition()        
										        .duration(200)      
										        .style("opacity", .9);      
										    divDiary.html(d.entry  )  
										        .style("left", (d3.event.pageX) + "px")     
										        .style("top", (d3.event.pageY -50 ) + "px");    
										    })                  
										.on("mouseout", function(d) {       
											divDiary.transition()        
										        .duration(500)      
										        .style("opacity", 0);   
										});
										                       
								}  
							};
						}
					};
				}) 
			.directive(
						'circleDiagram',
						function() {
							return {
								restrict : 'EA',
								scope : {
									data : "="
								},
								link : function(scope, iElement, iAttrs) {
									console.log('circleDiagram');

									var width = 1000,
								    	height = 800;  
									
									var svg = d3
											.select(iElement[0])
											.append("svg")
											.attr("width", width)
											.attr("height", height)  

									scope.$watch('data', function(newVals, oldVals) { 
										return scope.render(newVals);
									}, true);
									
									// define render function
									scope.render = function(data) {
										
										// // console.log('circleDiagram: data ' + JSON.stringify(data)); 
										
										var padding = 1.5, // separation between same-color nodes
								    		clusterPadding = 6, // separation between different-color nodes
								    		maxRadius = 12;
											
										var dioceses = []; 
										dioceses['Oberösterreich'] = 0;
										dioceses['St. Pölten'] = 1;
										dioceses['Steiermark'] = 2;
										dioceses['Salzburg'] = 3;
										dioceses['Vorarlberg'] = 4;
										dioceses['Kärnten'] = 5;
										dioceses['Burgenland'] = 6;
										dioceses['Tirol'] = 7;
										dioceses['Wien'] = 8;
										dioceses['ÖCZ'] = 9;
										var n = 200, // total number of nodes
											m = 10; // number of distinct clusters
 										// The largest node for each cluster.
										var clusters = new Array(m);
										var nodes = [];
										// var data = allData.data;
										
										if (data === undefined) {
											return;
										}
										if (data === null) {
											return;
										}
										// console.log('width: ' + width  );										
										// console.log('height: ' + height  );

										data.forEach(function(element, index) {
											// // console.log('element: ' + JSON.stringify(element));
											var i = dioceses[element.diocese];
											var r = element.sumAmount / 750; 
											// // console.log('r: ' + r + ', i: ' + i);

											var d = {
											        cluster: i ,
											        radius: r,
											        x: Math.cos(i / m * 2 * Math.PI) * 400 + width / 2 + Math.random(),
											        y: Math.sin(i / m * 2 * Math.PI) * 600 + height / 2 + Math.random(),
											        diocese: element.diocese,
											        project: element.article_name,
											        amount: element.sumAmount
											      };
											nodes.push(d); 
											if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d; 
										});  
										//  // console.log('circleDiagram: nodes ' + JSON.stringify(nodes)); 
										nodes.forEach(function(elem, i) {
											// // console.log('circleDiagram: node['+i+']: ' + JSON.stringify(elem));
										});
										var force = d3.layout.force()
										    .nodes(nodes)
										    .size([width, height])
										    .gravity(.02)
										    .charge(0)
										    .on("tick", tick)
										    .start();
										
										var color = d3.scale.category10()
									    	.domain(d3.range(m));
										
										// remove all previous items before render
										svg.selectAll("*").remove();
										  
										var yPos = height-50; 

										var infoBox = svg.append("g")
											 		.attr("transform", "translate(0," + 20 + ")")
											 		.attr("class", "box")
												  .append("rect")
													.attr("class", "infobox")
													.attr("x", 5 )
													.attr("y", 5)
													.attr("width", 180)
													.attr("height", 25); 
											
										var txt = svg.select(".box")
													.append("text")
													// .attr("class", "txt")
														.attr("class", "infotext")
														.attr("x", 10)
														.attr("y", 20);  //  				.text('tedsfsdfdsf ff df d dsfds fds dsfst')
												
										
										var node = svg.selectAll("circle")
										    .data(nodes)
										  .enter().append("circle")
										    .style("fill", function(d) { return color(d.cluster); })
										    .call(force.drag) 
										    .on("mouseover", function(d) {
 										    	svg.select(".infotext").text(d.diocese + '-' + d.project + ' € '+d.amount);  
											})
											.on("mouseout", function(d) {
 										    	svg.select(".infotext").text("");   
											});
	
										node.transition()
										    .duration(750)
										    .delay(function(d, i) { return i * 5; })
										    .attrTween("r", function(d) {
										      var i = d3.interpolate(0, d.radius);
										      return function(t) { return d.radius = i(t); };
										    });
	
										function tick(e) {
										  node
										      .each(cluster(10 * e.alpha * e.alpha))
										      .each(collide(.5))
										      .attr("cx", function(d) { return d.x; })
										      .attr("cy", function(d) { return d.y; });
										}
	
										// Move d to be adjacent to the cluster node.
										function cluster(alpha) {
										  return function(d) {
											//  // console.log('in fct cluster. d: ' +JSON.stringify(d));
											 // // console.log('in fct cluster. clusters: ' +clusters);

										    var cluster = clusters[d.cluster];
										    if (cluster === d) return;
										   // // console.log('in fct cluster. cluster: ' +JSON.stringify(cluster));
										    var x = d.x - cluster.x,
										        y = d.y - cluster.y,
										        l = Math.sqrt(x * x + y * y),
										        r = d.radius + cluster.radius;
										    if (l != r) {
										      l = (l - r) / l * alpha;
										      d.x -= x *= l;
										      d.y -= y *= l;
										      cluster.x += x;
										      cluster.y += y;
										    }
										  };
										}
	
										// Resolves collisions between d and all other circles.
										function collide(alpha) {
										  var quadtree = d3.geom.quadtree(nodes);
										  return function(d) {
										    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
										        nx1 = d.x - r,
										        nx2 = d.x + r,
										        ny1 = d.y - r,
										        ny2 = d.y + r;
										    quadtree.visit(function(quad, x1, y1, x2, y2) {
										      if (quad.point && (quad.point !== d)) {
										        var x = d.x - quad.point.x,
										            y = d.y - quad.point.y,
										            l = Math.sqrt(x * x + y * y),
										            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
										        if (l < r) {
										          l = (l - r) / l * alpha;
										          d.x -= x *= l;
										          d.y -= y *= l;
										          quad.point.x += x;
										          quad.point.y += y;
										        }
										      }
										      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
										    });
										  };
										}
									};
								}
							};
						})
		.directive('grgCalendar', function() {
					return {
						restrict : 'EA',
						transclude : true, 
						scope : {
							data : "=" 
						},
						link : function(scope, iElement, iAttrs) {
  							  
							console.log('grg-calendar');
 
							var containerWidth = 1300, 	
								containerHeight = 700; 
							
							var marginChart = {top: 30, right: 10, bottom: 30, left: 60},
							    widthChart = containerWidth - marginChart.left - marginChart.right,
							    heightChart = containerHeight - marginChart.top - marginChart.bottom;
							
							console.log('grg-calendar: containerWidth: ' + containerWidth);
							console.log('grg-calendar: containerHeight: ' + containerHeight);

							var svg = d3.select('.chartArea').append('svg')
				    			.attr("width", containerWidth)
				    			.attr("height", containerHeight)
				 	
							
							scope.$watch('data', function(newVals, oldVals) {
							 	return scope.render(newVals);
							}, true);
				 		 
							// define render function
							scope.render = function(allData) { 
 								  
								console.log('scope.render.allData: ' + JSON.stringify(allData));
								var drag = d3.behavior.drag().on("drag", function (d) { 
									chartOffset += d3.event.dx;
								 	var s = "translate(" + (chartOffset) + ", 0)";
									console.log('"translate text : s: ' + s);  

									chartArea.attr("transform", s );
								}); 
								svg.call(drag);
								
								var chartArea = svg.append('g');

								
 								// dummy startDaten and endDate
								// later this is read from the <input> elements
								var halfYear = 365 / 2 * 24 * 60 * 60 * 1000; 

								var now = new Date().getTime(); 
								      
								var startDate = now - halfYear; 
								var endDate = now + 4*halfYear; 

								console.log('startDate: ' + startDate);
								console.log('endDate: ' + endDate);

								var minExtentX = startDate;
								var maxExtentX = endDate; 
								
								var countMonth = (endDate - startDate) / (halfYear * 2 )* 12;
								console.log('countMonth: ' + countMonth);

								var pixelPerMonth = containerWidth / 12; 
								var dataWidth = countMonth * pixelPerMonth; 
								console.log('dataWidth: ' + dataWidth);

								var chartOffset = -200; 
								 
								var xScaleChart = d3.time.scale().range([0, dataWidth]),
								    yScaleChart = d3.scale.linear().range([0, heightChart]);
								 
								var xAxisChart = d3.svg.axis()
									.scale(xScaleChart)
									.orient('top')
									.ticks(d3.time.month, 1)
									.tickFormat(d3.time.format('%B %y'))
									.tickSize(6, 0, 0);
								 
								// y Axis
								var yAxisChart = d3.svg.axis()
									.scale(yScaleChart)
									.orient('left')
									.tickValues([1, 5, 10, 15, 20, 25, 30, 31,]); 
								 

											 		 		
								svg.append("rect")
								    .attr("class", "overlay")
								    .attr("width", widthChart)
								    .attr("height", heightChart);

								svg.append("defs").append("clipPath")
									   	.attr("id", "clip")
									 .append("rect")
									  	.attr("width", widthChart)
									  	.attr("height", heightChart + marginChart.top +20);
								  
								 
								 
								  
								// x domain: from startDate to endDate which is choosen by the user
								xScaleChart.domain([minExtentX, maxExtentX]);
									
								// y domain: 31 days
								yScaleChart.domain([1, 31]);


								chartArea.append("g")
								      .attr("class", "x axis")
								      .attr("transform", "translate(0," + (marginChart.top-10) + ")") 
								      .call(xAxisChart)
								      .selectAll("text")  
								      .style("text-anchor", "center") 
								      .attr("transform", function(d) {
								    	  	var s = "translate(" + (pixelPerMonth/2) + ", 0)";
								   			//console.log('"translate text : s: ' + s);  
											 return s;
								      });
								    	  	
								svg.append("g")
									.attr("class", " y axis")
									.attr("transform", "translate(" + marginChart.left + "," + marginChart.top + ")") 
									.call(yAxisChart);
								 
								var days = []; 

								for (var i = 0; i < 31; i++) {
									days[i] = i+1;  	
								}
								 	
								var month = []; 
								 // horizontal grid
								var gridLinesHorizontal = svg.append('g').selectAll('.laneLines-horizontal')
											.data(days)
										.enter().append('line')
											.attr('x1', marginChart.left)
											.attr('y1', function(d) { return d3.round(yScaleChart(d )) + (marginChart.top )   ; })
											.attr('x2', widthChart)
											.attr('y2', function(d) { return d3.round(yScaleChart(d )) + (marginChart.top )   ; })
											.attr('class', 'laneLines')
											.attr('stroke',  'lightgray' );

								var gridLinesVertical = chartArea.append('g').selectAll('.laneLines-verical')		
										.data(xScaleChart.ticks(countMonth))
									.enter().append("line")
									    .attr("class", "laneLines")
									    .attr('y1', marginChart.top)
										.attr('x1', function(d) { 
												//console.log('d  x1: ' + JSON.stringify(d));
												return xScaleChart(d);
										})
										.attr('y2', heightChart  +  marginChart.top )
										.attr('x2', function(d){ 
												//console.log('d x2 : ' + JSON.stringify(d)); 
												return xScaleChart(d); 
										})
										.attr('class', 'laneLines ')
										.attr('stroke',  'lightgray' );
										
										
								var parseDate = d3.time.format("%d.%m.%Y").parse;
								var parseDateMonthYear = d3.time.format("%m.%Y").parse;

								var showTasks= [
								 	      	{ name: 'Urlaub Anna', type : 'miscellaneous', from : '01.04.2014', until : '10.04.2014', projectuid : 100 } ,
								  		 	{ name: 'Urlaub Georg', type : 'miscellaneous', from : '17.5.2014', until : '19.5.2014', projectuid : 100 } ,
								 				 { name: 'Launch freiwilligentag.at', status : 'open', type : 'projectgoal', from : '5.5.2014' , projectuid : 102 }  , 
								 		       	{ name: 'Startseite freiwilligentag.at', status : 'done', type : 'milestone', from : '12.4.2014' , projectuid : 102 } 
								            ];    
								            
								showTasks.forEach(function (d) { 
									var dummy = parseDate(d.from); 
									d.fromDate = parseDateMonthYear(dummy.getMonth() + "." + dummy.getFullYear());
								 
									if (d.until ==  undefined ) {
								   		d.untilDate = new Date(dummy.getTime() + 24*60*60*1000+600); 
									} else {
								  		d.untilDate = parseDate(d.until);	
									} 
									d.fromDay = dummy.getDate();
									d.duration = d.untilDate.getDate() - d.fromDay;  
								 });

								var tasksGroup = chartArea.append('g').selectAll( )		
										.data(showTasks)
									.enter()
										.append("g")
										.attr('transform', function(d) { 
											var x1 = xScaleChart(d.fromDate);
											var y1 = yScaleChart(d.fromDay) + marginChart.top;
											var s = 'translate(' + x1 + ', ' +y1+')';
											console.log('x1     : ' +x1); 
											console.log('y1     : ' +y1); 
								 			return s;
										});		
										
								var tasks = tasksGroup 
										.append("rect")
										.attr("class",  function(d) { 
								 			return d.status + " " + d.type;
										})
										.attr('x', 0)
										.attr('y', 0)
										.attr('width', pixelPerMonth )
										.attr('height', function(d) { 
											var h = d.duration*(yScaleChart(d.fromDay+1)-yScaleChart(d.fromDay));
											console.log('h    : ' + h);
								 			return h;
										});
										
										
								var taskLabels = tasksGroup
										.append('text')
											.text(function (d) { return d.name; })
								 			.attr('y', function(d) {
								 					return   (yScaleChart(2) - yScaleChart(1))/2 ;
											}) 
											.attr('text-anchor', 'start')
											.attr('class', 'itemLabel'); 
								  
							}; 
						}
					};
				})