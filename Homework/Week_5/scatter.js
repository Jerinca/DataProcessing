// Student:       Jerinca vreugdenhil
// Studentnumber: 12405965

// This javascript file loads in data from an API
// And we create an interactive scatterplot with that data

window.onload = function() {

var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"
var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"

var requests = [d3.json(consConf), d3.json(womenInScience)];

lekkerLijstje = [];
lekkerLijstje2 = [];

Promise.all(requests).then(function(response) {
    mydata = response;

   var mydata_consconf = transformResponse(mydata[0])
   var mydata_womeninscience = transformResponse(mydata[1])
   
   mydata_consconf.forEach(function(element){
     
     lekkerLijstje.push([element["Country"], Number(element["time"]), element["datapoint"]]);
     

   });
   console.log(lekkerLijstje)

   mydata_womeninscience.forEach(function (element) {
      lekkerLijstje2.push([element["Country"], Number(element["time"]), element["datapoint"]]);
   });
   console.log(lekkerLijstje2)

   extralijst = []

   lekkerLijstje.forEach(function(t){
      lekkerLijstje2.forEach(function(y){
         if (t[0] == y[0] && t[1] == y[1]){
            t.push(y[2])
         }
      })
   })
   console.log(lekkerLijstje)

   mydata_womeninscience.forEach(function(element){
      womenCountry = element["Country"]
      womenTime = element["time"]
      // console.log(womenCountry)
      mydata_consconf.forEach(function(element2){
         // console.log(element2)

         consConfCountry = element2["Country"]
         consConfTime = element2["time"]
         // console.log(consConfCountry)

         if (womenCountry == consConfCountry && womenTime == consConfTime){
            console.log(element, element2)
         }
         if ("Country" in element2){
            // console.log("hoi")
         }
         else{
            console.log("nee")
         }
      // if (mydata_consconf.includes(element["Country"] && element["time"])) {
      //    console.log("hoi");
      // }
      });
   });
   




      // //Width and height
      // var w = 500;
      // var h = 110;
      // var range = [miny, maxy]
      // var domain = [2007, 2015]
      
      // var dataset = [
      //         [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
      //         [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
      //         ];
  
      // //Create SVG element
      // var svg = d3.select("body")
      //       .append("svg")
      //       .attr("width", w)
      //       .attr("height", h);

      // svg.selectAll("circle")
      //    .data(lekkerLijstje)
      //    .enter()
      //    .append("circle")
      //    .attr("cx", function(d) {
      //       return d[1] / w;
      //    })
      //    .attr("cy", function(d) {
      //       return d[2] / h;
      //    })
      //    .attr("r", function(d) {
      //       return Math.sqrt(h - d[2]);
      //    });

      // svg.selectAll("text")
      //    .data(lekkerLijstje)
      //    .enter()
      //    .append("text")
      //    .text(function(d) {
      //       return d[1] + "," + d[2];
      //    })
      //    .attr("x", function(d) {
      //       return d[1];
      //    })
      //    .attr("y", function(d) {
      //       return d[2];
      //    })
      //    .attr("font-family", "sans-serif")
      //    .attr("font-size", "11px")
      //    .attr("fill", "red");
      

    
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

