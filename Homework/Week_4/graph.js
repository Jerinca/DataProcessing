   	// width and height svg and bar padding
	var w = 800;
	var h = 600;
	var barPadding = 1;

	// header and paragrapgh
   	d3.select("body")
   		.append("h1")
   			.text("Staafdiagram over aantal Hoogopgeleidden inwoners per provincie");
    d3.select("body")
    	.append("p")
    		.text("Jerinca Vreugdenhil 12405965");

    //Create SVG element
	var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

    var provincies = []
    const values = []

    // load csv file to d3 v5		
  	d3.csv('Hoogopgeleidden.csv')
  		.then(function(data) {
  			data.forEach(function(element){
  				var prov = element["Regio;Aantal-Hoogopgeleiden "];
  				provincies.push(prov);
  				var val = element["Netto-Arbeidsparticipatie"];
  				values.push(val);

  				});

  			// set color range	
  			 var colors = d3.scaleLinear()
               		.domain([0, values.length])
               		.range(['#FFB6C1', '#FF1493']);

				console.log(provincies)
				console.log(values)

			// create tooltip with style
			var tooltip = d3.select("body").append("div")
				.style('position','absolute')
				.style('background','#f4f4f4')
				.style('padding','5 15px')
				.style('border','1px #333 solid')
				.style('border-radius','5px')
				.style('opacity','0')

			// create bins and hover
			svg.selectAll("rect")
			   .data(values)
			   .enter()
			   .append("rect")
			   .attr("fill", function(d, i){
			   		return colors(i);
			   })
			   .attr("x", function(d, i) {
			   		return 20+ i  * (w / values.length);
			   })
			   .attr("y", function(d) {
			   		return h -50 - (d/2);
			   })
			   .attr("width", w / values.length - barPadding)
			   .attr("height", function(d) {
			   		return d * 4;
			   })
			   .on('mouseover', function(d){
					tooltip.transition()
						.style('opacity', 1)

					tooltip.html(d)
						.style('left', (d3.event.pageX)+ 'px')
						.style('top', (d3.event.pageY+ 'px'))

					d3.select(this).style('opacity', 0.5)
				})
			   .on('mouseout', function(d){
			   	tooltip.transition()
			   		.style('opacity', 0)
			   	d3.select(this).style('opacity', 1)
			   })

			// set text
			svg.selectAll("text")
			   .data(values)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d;
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function(d, i) {
			   		return i * (w / values.length) + (w / values.length - barPadding) / 2;
			   })
			   .attr("y", function(d) {
			   		return h - (d/2) + 14;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")


                // create yScale
			   var yScale = d3.scaleLinear()
                         .domain([0, 822])
                         .range([h, 0]);

                // create xScale
			   var xScale = d3.scaleLinear()
                         .domain([0,provincies])
                         .range([0,w]);

               // creat Y axis
               var yAxis = d3.axisLeft(yScale)
               		.ticks(10)
               		.tickPadding(10)

               // Y axis guide
               var yGuide = d3.select('svg')
               			.append('g')
               				yAxis(yGuide)
               				yGuide.attr('transform', 'translate(770, 10)')
               				yGuide.selectAll('path')
               					.style('fill', 'none')
               					.style('stroke', '#000')
               				yGuide.selectAll('line', '#000')

			 
               // creat Y axis
               var xAxis = d3.axisBottom(xScale)
               		.tickValues(xScale.domain().filter(function(d, i){
               			return!(i % (values.length))
               		}))

               // Y axis guide
               var xGuide = d3.select('svg')
               			.append('g')
               				xAxis(xGuide)
               				xGuide.attr('transform', 'translate(25,'+(h - 10 +' )'))
               				xGuide.selectAll('path')
               					.style('fill', 'none')
               					.style('stroke', '#000')
               				xGuide.selectAll('line', '#000')
	   

			});
			
		






			


			
		

	
			
		




