// Student:       Jerinca vreugdenhil
// Studentnumber: 12405965

// This javascript file loads in data from an API
// And we create an interactive scatterplot with that data

// header and paragrapgh
    d3.select("body")
      .append("h1")
        .text("Scatterplot about Women in Science & Consumer Confidence");
    d3.select("body")
      .append("h2")
        .text("Jerinca Vreugdenhil 12405965");
    d3.select("body")
      .append("p")
        .text("The scatterplot visualizes 2 different datasets over the same year, in the dropdown menu you can see the different data per year.");

// when window is being unloaded show
window.onload = function() {

// datasets
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"

// write them to jason
var requests = [d3.json(consConf), d3.json(womenInScience)];

// space for lists
newList1 = [];
newList2 = [];

// create dictionary
uberData = [];
uberData2 = [];

// hold data
Promise.all(requests).then(function(response) {
  mydata = response;

   // transform into better format
   var mydata_consconf = transformResponse(mydata[0])
   var mydata_womeninscience = transformResponse(mydata[1])
   // console.log(mydata_womeninscience.datapoint)
   
   // create list with data wanted
   mydata_consconf.forEach(function(element){
     newList1.push([element["Country"], Number(element["time"]), Number(element["datapoint"])]);
   });

   mydata_consconf.forEach(function(element){
    uberData.push({"Country": element["Country"], "Time": Number(element["time"]), "Datapoint": Number(element["datapoint"])})
   });

   // create list2 with data wanted
   mydata_womeninscience.forEach(function (element) {
      newList2.push([element["Country"], Number(element["time"]), Number(element["datapoint"])]);
   });

   mydata_womeninscience.forEach(function(element){
    uberData2.push({"Country": element["Country"], "Time": Number(element["time"]), "Datapoint": Number(element["datapoint"])})
   });
   console.log(uberData2)

   // set width height en margins
   var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

   // set y scale consconf
   var yScale = d3.scaleLinear()
        .domain([95, d3.max(uberData, function(d){return d.Datapoint})])
        .range([height, 0]);
  
   // set x scale women in science
   var xScale = d3.scaleLinear()
        .domain([0, d3.max(uberData2, function(d){return d.Datapoint})])
        .range([0, width]);

   // set scale of points
   var rScale = d3.scaleLinear()
       .domain([0, d3.max(uberData, function(d) { return d.Datapoint; })])
       .range([2, 5]);

   // check weather the data is from the same
   // country and the same year
   // if so, add data point to list with complete datapoints
   newList1.forEach(function(t){
      newList2.forEach(function(y){
         if (t[0] == y[0] && t[1] == y[1]){
            t.push(y[2])
         }
      })
   })

  // create svg
  var svg = d3.select("body").append("svg")
      .attr("id", "svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

  var yAxis = d3.axisLeft(yScale)
    
  // add the x Axis
  svg.append("g")
     .attr("transform", "translate(50," + height + ")")
     .call(d3.axisBottom(xScale))

  extraList = [];
  valuesSeven =[];
  valuesEight =[];
  valuesNine =[];
  valuesTen =[];
  valuesEleven =[];
  valuesTwelf =[];
  valuesThirtheen =[];
  valuesFourteen =[];
  valuesFifteen =[];

  // create the country list and a color list
  var country = ["France", "Netherlands", "Portugal", "Germany", "United Kingdom", "Korea"];

  newList1.forEach(function (element) {
      if (element.length == 4){
        extraList.push(element)
          if (element[1] == 2007){
            valuesSeven.push([element[1], element[2], element[3]])
        }
                  if (element[1] == 2007){
            valuesSeven.push([element[1], element[2], element[3]])
        }
                  if (element[1] == 2008){
            valuesEight.push([element[1], element[2], element[3]])
        }
                  if (element[1] == 2009){
            valuesNine.push([element[1], element[2], element[3]])
        }
                  if (element[1] == 2010){
            valuesTen.push([element[1], element[2], element[3]])
        }
                  if (element[1] == 2011){
            valuesEleven.push([element[1], element[2], element[3]])
        }
                  if (element[1] == 2012){
            valuesTwelf.push([element[1], element[2], element[3]])
        }
                  if (element[1] == 2013){
            valuesThirtheen.push([element[1], element[2], element[3]])
        }
                  if (element[1] == 2014){
            valuesFourteen.push([element[1], element[2], element[3]])
        }
                  if (element[1] == 2015){
            valuesFifteen.push([element[1], element[2], element[3]])
        }
      }
  });

    svg.selectAll("circle")
         .data(extraList)
         .enter()
         .append("circle")
         .attr("id", "dot")
         .attr("cx", function(d) {
            return xScale(d[3]);
         })
         .attr("cy", function(d) {
            return yScale(d[2]) +50;
         })
          .attr("r", function(d) {
              return rScale(d[2]);
          })
          .style("fill", function(d, i){
         if (i <= 8){
           return "red";
         }
         if (i <= 15){
           return "blue";
         }
         if (i <= 24){
           return "green";
         }
         if (i <= 29){
           return "yellow";
         }
         if (i <= 37){
           return "brown";
         }
         if (i <= 40){
           return "purple";
         }
       });

  // Create a dropdown
  // makes the dropdown button interactive
  //http://bl.ocks.org/anupsavvy/9513382
  d3.selectAll(".m")
      .on("click", function() {
        console.log("yo")
        var date = this.getAttribute("value");
        console.log(date)
        var str = "";
          d3.selectAll("#dot").remove()
          if (date == 2007 ){
          str = valuesSeven
          }
          if (date == 2008 ){
          str = valuesEight
          }
          if (date == 2009 ){
          str = valuesNine
          }
          if (date == 2010 ){
          str = valuesTen
          }
          if (date == 2011 ){
          str = valuesEleven
          }
          if (date == 2012 ){
          str = valuesTwelf
          }
          if (date == 2013 ){
          str = valuesThirtheen
          }
          if (date == 2014 ){
          str = valuesFourteen
          }
          if (date == 2015 ){
          str = valuesFifteen
          }
          scatterplot(str, date);
      })

  //makes function for scatterplot variables
  function scatterplot(str, date){
    svg = d3.selectAll("#svg")

    svg.selectAll("circle")
         .data(str)
         .enter()
         .append("circle")
         .attr("id", "dot")
         .attr("cx", function(d) {
        
            return xScale(d[2]) + 90;
          
         })
         .attr("cy", function(d) {
            return yScale(d[1]) + 50;
         })
          .attr("r", function(d) {
              return rScale(d[1]);
          })
          .style("fill", function(d, i){
             if (i === 0){
               return "red";
             }
             if (i === 1){
               return "blue";
             }
             if (i === 2){
               return "green";
             }
             if (i === 3){
               return "yellow";
             }
             if (i === 4){
               return "brown";
             }
             if (i === 5){
               return "purple";
             };
           });
        };

    svg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(" + 0 + ",500)")
         .call(d3.axisBottom(xScale));

    // add y axis
    svg.append("g")
         .attr("class", "y axis")
         .attr("transform", "translate(" + 50 + ",0)")
         .call(d3.axisLeft(yScale));

    // add y label
    svg.append("text")
         .attr("class", "y label")
         .attr("text-anchor", "end")
         .attr("y", 5)
         .attr("x", -180)
         .attr("dy", ".75em")
         .attr("transform", "rotate(-90)")
         .text("Consumer Confidence");

    // add x label
    svg.append("text")
         .attr("class", "x label")
         .attr("text-anchor", "end")
         .attr("x", 570)
         .attr("y", 428)
         .text("Percentage of Women in Science (%)");

    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", 430)
        .attr("y", -20)
        .style("font-size", "20px")
        .text("Women in Science & Consumer Confidence");

    // create new svg
    var svg = d3.select("#area2").append("svg")
        .attr("class", "pieChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // makes rectangles for legend
    svg.selectAll("rect")
        .data(country)
        .enter()
        .append("rect")
        .attr("width", 20 )
        .attr("height", 20 )
        .attr("x", function(d) {
          return 500;
        })
        .attr("y", function(d, i) {
          return i * 20 + 100;
        })
        .style("fill", function(d, i){
       if (i === 0){
            return "red";
          }
          if (i === 1){
            return "blue";
          }
          if (i === 2){
            return "green";
          }
          if (i === 3){
            return "yellow";
          }
          if (i === 4){
            return "brown";
          }
          if (i === 5){
            return "purple";
          }
        });

    // set text for legenda
    svg.selectAll("textlegend")
        .data(country)
        .enter()
        .append("text")
        .text(function(d) {
        return d;
        })
        .attr("x", function(d) {
        return 380;
        })
        .attr("y", function(d, i) {
        return i * 20 + 115;
      });
    
}).catch(function(e){
    throw(e);
});

};    

function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":");
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product
    return dataArray;
};

