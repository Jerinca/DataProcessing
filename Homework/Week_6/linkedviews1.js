// Student:       Jerinca vreugdenhil
// Studentnumber: 12405965

// This javascript file loads in data from an API
// And we create an interactive scatterplot with that data

// import linkedviews.json



window.onload = function() {

	// name json file
	var happyRanking = "happyranking.json";

	// read in json file
	var requests = [d3.json(happyRanking)];
	console.log(requests)

	Promise.all(requests).then(function(response) {

		myHappyData = response

		// var mydata_happy = transformResponse(myHappyData)
		console.log(myHappyData)
		
		myHappyData.forEach(function(element){
			console.log(element)

		});

		// width and height svg and bar padding
		var w = 800;
		var h = 600;
		var barPadding = 1;

		// header and paragrapgh
	   	d3.select("body")
	   		.append("h1")
	   			.text("Barchart about Happy Ranking");
	    d3.select("body")
	    	.append("p")
	    		.text("Jerinca Vreugdenhil 12405965");

		// set the dimensions and margins of the graph
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = 960 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;
		          
		// append the svg object to the body of the page
		// append a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		var svg = d3.select("body").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  	.append("g")
		    .attr("transform", 
		          "translate(" + margin.left + "," + margin.top + ")");

		// set color range	
	  	var colors = d3.scaleLinear()
	        .domain([0, myHappyData.length])
	        .range(['#FFB6C1', '#FF1493']);


		// create tooltip with style
		var tooltip = d3.select("body").append("div")
			.style('position','absolute')
			.style('background','#f4f4f4')
			.style('padding','5 15px')
			.style('border','1px #333 solid')
			.style('border-radius','5px')
			.style('opacity','0')
		
		// create yScale
	   	var yScale = d3.scaleLinear()
                 .domain([0, d3.max(myHappyData, function(d){return d.Average Wellbeing(0-10)})])
                 .range([height, 0]);

	    // var countries = []
	    // const values = []

	  //   // load csv file to d3 v5		
	  // 	d3.csv('Hoogopgeleidden.csv')
	  // 		.then(function(data) {

	  // 			var uberData = [];

	  // 			data.forEach(function(element){
	  // 				var prov = element["Regio;Aantal-Hoogopgeleiden "];
	  // 				provincies.push(prov);
	  // 				var val = element["Netto-Arbeidsparticipatie"];
	  // 				values.push(Number(val));

	  // 				uberData.push({"Province": prov, "Value": Number(val)})

	  // 				});

	  // 			console.log(uberData)

	  // 			// set color range	
	  // 			 var colors = d3.scaleLinear()
	  //              		.domain([0, values.length])
	  //              		.range(['#FFB6C1', '#FF1493']);

			// 		console.log(provincies)
			// 		console.log(values)

			// 	// create tooltip with style
			// 	var tooltip = d3.select("body").append("div")
			// 		.style('position','absolute')
			// 		.style('background','#f4f4f4')
			// 		.style('padding','5 15px')
			// 		.style('border','1px #333 solid')
			// 		.style('border-radius','5px')
			// 		.style('opacity','0')

			// 		// create yScale
			// 	   var yScale = d3.scaleLinear()
	  //                        .domain([0, d3.max(uberData, function(d){return d.Value})])
	  //                        .range([height, 0]);

	  //               console.log(yScale(400))

	  //               // create xScale
			// 	   var xScale = d3.scaleBand()
	  //                        .domain(provincies)
	  //                        .range([0, width]);

	  //              console.log(xScale(provincies[6]))

	  //              // creat Y axis
	  //              var yAxis = d3.axisLeft(yScale)

	  //                svg.append("g")
			// 	      .call(d3.axisLeft(yScale));
				    

			// 	      // add the x Axis
			// 		  svg.append("g")
			// 		      .attr("transform", "translate(0," + height + ")")
			// 		      .call(d3.axisBottom(xScale))

			// 	// create bins and hover
			// 	svg.selectAll("rect")
			// 	   .data(uberData)
			// 	   .enter()
			// 	   .append("rect")
			// 	   .attr("fill", function(d, i){
			// 	   		return colors(i);
			// 	   })
			// 	   .attr("x", function(d) {
			// 	   		console.log(xScale(d.Province))
			// 	   		return xScale(d.Province);
			// 	   })
			// 	   .attr("y", function(d) {
			// 	   		return yScale(d.Value);
			// 	   })
			// 	   .attr("width", width / values.length - barPadding)
			// 	   .attr("height", function(d) {
			// 	   		return height - yScale(d.Value);
			// 	   })
			// 	   .on('mouseover', function(d){
			// 			tooltip.transition()
			// 				.style('opacity', 1)

			// 			tooltip.html(d.Value)
			// 				.style('left', (d3.event.pageX)+ 'px')
			// 				.style('top', (d3.event.pageY)+ 'px')

			// 			d3.select(this).style('opacity', 0.5)
			// 		})
			// 	   .on('mouseout', function(d){
			// 	   	tooltip.transition()
			// 	   		.style('opacity', 0)
			// 	   	d3.select(this).style('opacity', 1)
			// 	   })
			// 	   .on("click", function(d){
			// 	   	makePie(d.Province);
			// 	   })

			// 	// set text
			// 	svg.selectAll(".textInVis")
			// 	   .data(uberData)
			// 	   .enter()
			// 	   .append("text")
			// 	   .text(function(d) {
			// 	   		return d.Value;
			// 	   })
			// 	   // .attr("text-anchor", "middle")
			// 	   .attr("x", function(d, i) {
			// 	   		return xScale(d.Province);
			// 	   })
			// 	   .attr("y", function(d) {
			// 	   		return yScale(d.Value);
			// 	   })
			// 	   .attr("font-family", "sans-serif")
			// 	   .attr("font-size", "11px")
	   

			// 	});
				
			
			// function makePie(provcine){
			// 	console.log(provcine);
			// }



	}).catch(function(e){
	    throw(e);
	});
};

	// listCountry = []
	// listRankHPI = []
	// listGDP = []