// Student:       Jerinca vreugdenhil
// Studentnumber: 12405965

// This javascript file loads in data from an API
// And we create an interactive scatterplot with that data

window.onload = function() {

	var requests = 'happy_ranking2.csv';

	Promise.all(requests).then(function(response) {

	 // load csv file to d3 v5		
  	d3.csv('happy_ranking2.csv')
  		.then(function(data) {

  	// create lists to sort data
  	var uberData = [];
  	var uberData2 = [];
  	var rankings = [];
  	var countries = [];
  	var avLifeExpec = [];
  	var Region = [];
  	var counter = 0;
  	var populationtot = [];
  	var sum = 0;

  	// sort out data and sum up population per region 
  	data.forEach(function(element){
		var rankHPI = element["HPI Rank"];
		rankings.push(Number(rankHPI));
		var country = element["Country"];
		countries.push(country);
		var avlife = element["Average Life Expectancy"];
		counter+= Number(avlife);
		avLifeExpec.push(Number(avlife));
		var population = element["Population"];
		populationtot.push(Number(population));
		var regiontot = element["Region"];
		Region.push(regiontot);

		sum+= Number(population);

		uberData2.push({"Region": regiontot, "Population": Number(population)});

		uberData.push({"Country": country, "HPIrank": Number(rankHPI), "AverageLifeExpectancy": Number(avlife), "Population": Number(population), "Region": regiontot});

		});

  	// calculate world average age
  	var worldAverage = counter / 140;


	// width and height svg and bar padding
	var w = 800;
	var h = 600;
	var barPadding = 4.5;

	// header and paragrapgh
   	d3.select("body")
   		.append("h1")
   			.text("Barchart and PieChart about Happy Ranking, Jerinca Vreugdenhil 12405965");
    d3.select("body")
    	.append("p")
    		.text("The barchart visualizes the HPI ranking per country, whilst you hover on the bars you can also click on them to generate a piechart about the Population Distribution in the region of the country");

	// set the dimensions and margins of the graph
	var margin = {top: 50, right: 20, bottom: 100, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;
	          
	// append the svg object to the body of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("#area1").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  	.append("g")
	    .attr("transform", 
	          "translate(" + margin.left + "," + margin.top + ")");

	svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("text-decoration", "underline")  
        .text("Countries in HPI rank order");

	// set color range	
  	var colors = d3.scaleLinear()
        .domain([0, 140])
        .range(['#FFB6C1', '#FF1493']);


	// create tooltip with style
	var tooltip = d3.select("body").append("div")
		.style('position','absolute')
		.style('background','#f4f4f4')
		.style('padding','5 15px')
		.style('border','1px #333 solid')
		.style('border-radius','5px')
		.style('opacity','0');

	// create yScale
   	var yScale = d3.scaleLinear()
             .domain([0, d3.max(uberData, function(d){return d.HPIrank})])
             .range([height, 0]);	

	// create xScale
	var xScale = d3.scaleBand()
	         .domain(countries)
	         .range([0, width]);

   // creat Y axis
   var yAxis = d3.axisLeft(yScale)

		svg.append("g")
	      .call(d3.axisLeft(yScale));
				    

		// add the x Axis
		svg.append("g")
		  .attr("transform", "translate(-10," + height + ")")
		  .call(d3.axisBottom(xScale))
		  .selectAll("text")
		  	.style("font", "8px times")	
	        .style("text-anchor", "end")
	        .attr("dx", "-.8em")
	        .attr("dy", ".15em")
	        .attr("transform", "rotate(-90)");


		// create bins and hover
		svg.selectAll("rect")
		   .data(uberData)
		   .enter()
		   .append("rect")
		   .attr("fill", function(d, i){
		   		return colors(i);
		   })
		   .attr("x", function(d) {
		   		
		   		return xScale(d.Country);
		   })
		   .attr("y", function(d) {
		   		return yScale(d.HPIrank);
		   })
		   .attr("width", width / rankings.length + barPadding)
		   .attr("height", function(d) {
		   		return height - yScale(d.HPIrank);
		   })
		   .on('mouseover', function(d){
				tooltip.transition()
					.style('opacity', 1)

				tooltip.html(d.HPIrank)
					.style('left', (d3.event.pageX)+ 'px')
					.style('top', (d3.event.pageY)+ 'px')

				d3.select(this).style('opacity', 0.5)
			})
		   .on('mouseout', function(d){
		   	tooltip.transition()
		   		.style('opacity', 0)
		   	d3.select(this).style('opacity', 1)
		   })
		   .on("click", function(d){
		   	makePie(d.Country, d.HPIrank, d.AverageLifeExpectancy, d.Region, worldAverage, d.Population, sum, populationtot, uberData2);
		   })

		// set text
		svg.selectAll(".textInVis")
		   .data(uberData)
		   .enter()
		   .append("text")
		   .text(function(d) {
		   		return d.HPIrank;
		   })
		   // .attr("text-anchor", "middle")
		   .attr("x", function(d, i) {
		   		return xScale(d.Country);
		   })
		   .attr("y", function(d) {
		   		return yScale(d.HPIrank);
		   })
		   .attr("font-family", "sans-serif")
		   .attr("font-size", "8px");

  	});

				
			
	function makePie(country, valueHPI, averageLifeExpectancy, regionok, worldAverage, Population, sum, listTotPop, uberData2){
		
		// makes sure you get a new pie chart when clicking on a different bar
		d3.selectAll(".pieChart").remove()
		
		// all these lists are for sorting out te data
		var postCommunist = [];
		var postCommunistPop = [];
		var countryC = [];
		var sumC = 0;
		var americas = [];
		var americasPop = [];
		var countryA = [];
		var sumA = 0;
		var asiaPacific	= [];
		var asiaPacificPop = [];
		var countryAS =[];
		var sumAs = 0;
		var Europe = [];
		var EuropePop = [];
		var countryEU = [];
		var sumEu = 0;
		var	subSaharanAfrica = [];
		var subSaharanAfricaPop =[];
		var countryAF = [];
		var sumS = 0;

		uberData2.forEach(function(element){

			// calculate the population distribution per region
			var region = element["Region"];
			var countryOk = element["Country"];
			var population = element["Population"];
			if (region == "Post-communist"){
				postCommunist.push(region);
				postCommunistPop.push(Math.round(Number(population)/100000));
				countryC.push(countryOk);
				sumC+= Number(population);
			}
			if (region == "Americas"){
				americas.push(region);
				americasPop.push(Math.round(Number(population)/100000));
				countryA.push(countryOk);
				sumA+= Number(population);
			}
			if (region == "Asia Pacific"){
				asiaPacific.push(region);
				asiaPacificPop.push(Math.round(Number(population)/100000));
				countryAS.push(countryOk);
				sumAs+= Number(population);
			}
			if (region == "Europe"){
				Europe.push(region);
				EuropePop.push(Math.round(Number(population)/100000));
				countryEU.push(countryOk);
				sumEu+= Number(population);
			}
			if (region == "Sub Saharan Africa"){
				subSaharanAfrica.push(region);
				subSaharanAfricaPop.push(Math.round(Number(population)/100000));
				countryAF.push(countryOk);
				sumS+= Number(population);
			}


		});

		// if clicked on region == post comm make piechart for this region
		if (regionok == "Post-communist"){
			var ok = Population / sumC;
			var data = postCommunistPop;
			var country = countryC;
			
			// set w, h and radius
			var width = 960,
			    height = 500,
			    radius = Math.min(width, height) / 4;

			// set color range
			var color = d3.scaleLinear()
		        .domain([0, uberData2.length])
		        .range(['#FFB6C1', '#FF1493']);

		    // set part of pie
			var arc = d3.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(0);

			// label part of pie
			var labelArc = d3.arc()
			    .outerRadius(radius + 60)
			    .innerRadius(radius - 40);

			// sort out pie
			var pie = d3.pie()
			    .sort(null)
			    .value(function(d) { return d; });

			// set margin
			var margin = {top: 80, right: 20, bottom: 100, left: 40},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			// create svg
			var svg = d3.select("#area2").append("svg")
				.attr("class", "pieChart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			// append title
			svg.append("text")
		        .attr("x", (width / 2.5))             
		        .attr("y", 0 - (margin.top / 2))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "16px") 
		        .style("text-decoration", "underline")  
		        .text("Population in Post-communist Region");
		     
		    // append parts of pie
			var g = svg.selectAll(".arc")
			      .data(pie(data))
			      .enter().append("g")
			      .attr("class", "arc");

			g.append("path")
			      .attr("d", arc)
			      .style("fill", function(d) { return color(d.data); });

			g.append("text")
			  	  .style("font", "8px times")	
			      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
			      .attr("dy", ".35em")
			      .text(function(d) { return d.data; });
		}

		if (regionok == "Americas"){
			var ok = Population/ sumA
			var data = americasPop;

			// set w, h and radius
			var width = 960,
			    height = 500,
			    radius = Math.min(width, height) / 4;

			// set color range
			var color = d3.scaleLinear()
		        .domain([0, uberData2.length])
		        .range(['#FFB6C1', '#FF1493']);

		    // set part of pie
			var arc = d3.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(0);

			// label part of pie
			var labelArc = d3.arc()
			    .outerRadius(radius + 60)
			    .innerRadius(radius - 40);

			// sort out pie
			var pie = d3.pie()
			    .sort(null)
			    .value(function(d) { return d; });

			// set margin
			var margin = {top: 80, right: 20, bottom: 100, left: 40},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			// create svg
			var svg = d3.select("#area2").append("svg")
				.attr("class", "pieChart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			// append title
			svg.append("text")
		        .attr("x", (width / 2.5))             
		        .attr("y", 0 - (margin.top / 2))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "16px") 
		        .style("text-decoration", "underline")  
		        .text("Population in Americas");

		      // append parts of pie
			  var g = svg.selectAll(".arc")
			      .data(pie(data))
			    .enter().append("g")
			      .attr("class", "arc");

			  g.append("path")
			      .attr("d", arc)
			      .style("fill", function(d) { return color(d.data); });

			  g.append("text")
			  	  .style("font", "8px times")	
			      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
			      .attr("dy", ".35em")
			      .text(function(d) { return d.data; });
		}
		if (regionok == "Asia Pacific"){
			var ok = Population/ sumAs;
			var data = asiaPacificPop;

			// set w, h and radius
			var width = 960,
			    height = 500,
			    radius = Math.min(width, height) / 4;

			// set color range
			var color = d3.scaleLinear()
		        .domain([0, uberData2.length])
		        .range(['#FFB6C1', '#FF1493']);

		    // set part of pie
			var arc = d3.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(0);

			// label part of pie
			var labelArc = d3.arc()
			    .outerRadius(radius + 60)
			    .innerRadius(radius - 40);

			// sort out pie
			var pie = d3.pie()
			    .sort(null)
			    .value(function(d) { return d; });

			// set margin
			var margin = {top: 80, right: 20, bottom: 100, left: 40},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			// create svg
			var svg = d3.select("#area2").append("svg")
				.attr("class", "pieChart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			// append title
			svg.append("text")
		        .attr("x", (width / 2.5))             
		        .attr("y", 0 - (margin.top / 2))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "16px") 
		        .style("text-decoration", "underline")  
		        .text("Population in Asia Pacific");

		      // append parts of pie
			  var g = svg.selectAll(".arc")
			      .data(pie(data))
			    .enter().append("g")
			      .attr("class", "arc");

			  g.append("path")
			      .attr("d", arc)
			      .style("fill", function(d) { return color(d.data); });

			  g.append("text")
			  	  .style("font", "8px times")	
			      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
			      .attr("dy", ".35em")
			      .text(function(d) { return d.data; });
		}
		if (regionok == "Europe"){
			var ok = Population/ sumEu;
			var data = EuropePop;

			// set w, h and radius
			var width = 960,
			    height = 500,
			    radius = Math.min(width, height) / 4;

			// set color range
			var color = d3.scaleLinear()
		        .domain([0, uberData2.length])
		        .range(['#FFB6C1', '#FF1493']);

		    // set part of pie
			var arc = d3.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(0);

			// label part of pie
			var labelArc = d3.arc()
			    .outerRadius(radius + 60)
			    .innerRadius(radius - 40);

			// sort out pie
			var pie = d3.pie()
			    .sort(null)
			    .value(function(d) { return d; });

			// set margin
			var margin = {top: 80, right: 20, bottom: 100, left: 40},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			// create svg
			var svg = d3.select("#area2").append("svg")
				.attr("class", "pieChart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			// append title
			svg.append("text")
		        .attr("x", (width / 2.5))             
		        .attr("y", 0 - (margin.top / 3))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "16px") 
		        .style("text-decoration", "underline")  
		        .text("Europe");

		      // append parts of pie
			  var g = svg.selectAll(".arc")
			      .data(pie(data))
			    .enter().append("g")
			      .attr("class", "arc");

			  g.append("path")
			      .attr("d", arc)
			      .style("fill", function(d) { return color(d.data); });

			  g.append("text")
			  	  .style("font", "8px times")	
			      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
			      .attr("dy", ".35em")
			      .text(function(d) { return d.data; });
		}
		if (regionok == "Sub Saharan Africa"){
			var ok = Population/ sumS;
			var data = subSaharanAfricaPop;

			// set w, h and radius
			var width = 960,
			    height = 500,
			    radius = Math.min(width, height) / 4;

			// set color range
			var color = d3.scaleLinear()
		        .domain([0, uberData2.length])
		        .range(['#FFB6C1', '#FF1493']);

		    // set part of pie
			var arc = d3.arc()
			    .outerRadius(radius - 10)
			    .innerRadius(0);
			
			// label part of pie
			var labelArc = d3.arc()
			    .outerRadius(radius + 60)
			    .innerRadius(radius - 40);

			// sort out pie
			var pie = d3.pie()
			    .sort(null)
			    .value(function(d) { return d; });

			// set margin
			var margin = {top: 80, right: 20, bottom: 100, left: 40},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			// create svg
			var svg = d3.select("#area2").append("svg")
				.attr("class", "pieChart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			// append title
			svg.append("text")
		        .attr("x", (width / 2.5))             
		        .attr("y", 0 - (margin.top / 3))
		        .attr("text-anchor", "middle")  
		        .style("font-size", "16px") 
		        .style("text-decoration", "underline")  
		        .text("Population in SubSaharanAfrica");

		      // append parts of pie
			  var g = svg.selectAll(".arc")
			      .data(pie(data))
			    .enter().append("g")
			      .attr("class", "arc");

			  g.append("path")
			      .attr("d", arc)
			      .style("fill", function(d) { return color(d.data); });

			  g.append("text")
			  	  .style("font", "8px times")	
			      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
			      .attr("dy", ".35em")
			      .text(function(d) { return d.data; });
		}
	}
	}).catch(function(e){
	    throw(e);
	});
};