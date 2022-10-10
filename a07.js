// 
// a07.js
// Skeleton for CSC444 Assignment 07
// Joshua A. Levine <josh@email.arizona.edu>
//
// This file provides the skeleton code for you to write for A07.  It
// provides partial implementations for a number of functions you will
// implement to visualize scatteplots of the iris dataset with joint
// interactions
//
// Your main task is to complete the functions:
// (1) makeScatterplot(), which is used to generically create plots
// (2) onBrush(), which is the callback used to interact 
//
// You will also need to implement the logic for responding to selection
//



////////////////////////////////////////////////////////////////////////
// Global variables for the dataset and brushes

let data = iris;

// brush1 and brush2 will store the extents of the brushes,
// if brushes exist respectively on scatterplot 1 and 2.
//
// if either brush does not exist, brush1 and brush2 will
// hold the null value.

let brush1 = null;
let brush2 = null;



////////////////////////////////////////////////////////////////////////
// xAccessor and yAccessor allow this to be generic to different data
// fields

function makeScatterplot(sel, xAccessor, yAccessor)
{
  let width = 500;
  let height = 500;
 
  let svg = sel
    .append("svg")
    .attr("width", width).attr("height", height);


  let maxX=d3.max(data,d=>xAccessor(d));
  let minX=d3.min(data,d=>xAccessor(d));
  let maxY=d3.max(data,d=>yAccessor(d));
  let minY=d3.min(data,d=>yAccessor(d));
  let xScale=d3.scaleLinear()
  .domain([minX,maxX])
  .range([50,480]); // create a scale for the x axis
  let yScale=d3.scaleLinear()
  .domain([minY,maxY])
  .range([450,20]); // create a scale for the y axis
   
  let brush = d3.brush();
  
  svg.append("g")
    .attr("class", "brush")
    .call(brush);

  let color=function(d){
    if(d.species==="setosa")
    {return "green"; }

    if(d.species==="versicolor")
    {return "purple"; }

    if(d.species==="virginica")
    {return "orange"; }
}


  let circles = svg.append("g")
    .selectAll("circle")
    .data(data).enter()
    .append("circle")
    .attr("cx",function(d){return xScale(xAccessor(d))})
    .attr("cy",function(d){return yScale(yAccessor(d))})
    .attr("r",4)
    .attr("fill",function(d){return color(d)});
  // finish writing the circle creation here.
  // this *must* be done *after* adding the brush group.


  let xline=(maxX>7.5)?"Sepal Length":"Petal Length";
  let yline=(maxY>4.2)?"Sepal Width":"Petal Width";



  let xAxis =svg.append("g").attr("id","x-axis")
  .attr("transform","translate(-10,465)")
  .call(d3.axisBottom(xScale)); // create an axis object for the x axis
  let yAxis =svg.append("g").attr("id","y-axis")
  .attr("transform","translate(40,15)")
  .call(d3.axisLeft(yScale)); // create an axis object for the y axis

  let xWord=svg.append("text").text(xline)
  .attr("id","xWord")
  .attr("x",250).attr("y",495);
  // add code to draw the axes / axes labels

  var yWord=svg.append("text").text(yline)
  .attr("id","yWord")
  .attr("x",0).attr("y",0)
  .attr("transform", "translate(12,250)rotate(270)");
  // finally, return a plot object for global use in the brushes,
  // feel free to change this interface
  return {
    svg: svg,
    brush: brush,
    xScale: xScale,
    yScale: yScale,
    circles:circles,

  };
}

////////////////////////////////////////////////////////////////////////
// Setup plots

plot1 = makeScatterplot(d3.select("#scatterplot_1"),
                        function(d) { return d.sepalLength; },
                        function(d) { return d.sepalWidth; });
plot2 = makeScatterplot(d3.select("#scatterplot_2"),
                        function(d) { return d.petalLength; },
                        function(d) { return d.petalWidth; });

////////////////////////////////////////////////////////////////////////
// Callback during brushing


function Callback(){
  let allCircle = d3.select("body").selectAll("circle");
  allCircle.on("click",function(event,d){
    allCircle.attr("r",4)
    allCircle.filter(function(a){return a===d;}).attr("r",10);
    d3.select('#table-sepalLength').text(d.sepalLength);
    d3.select('#table-sepalWidth').text(d.sepalWidth);
    d3.select('#table-petalLength').text(d.petalLength);
    d3.select('#table-petalWidth').text(d.petalWidth);
    d3.select('#table-species').text(d.species);
  })
}
Callback();

function onBrush() {
 
  let allCircles = d3.select("body").selectAll("circle");
  
  if (brush1 === null && brush2 === null) {
    allCircles.attr("stroke",null);
    return;
  }

  // Selection filter function
if(brush1!==null){
  xi1=plot1.xScale.invert(brush1[0][0]);
  xx1=plot1.xScale.invert(brush1[1][0]);
  yx1=plot1.yScale.invert(brush1[0][1]);
  yi1=plot1.yScale.invert(brush1[1][1]);
  d3.select('#lxrange').text(xi1.toFixed(2)+"--"+xx1.toFixed(2));
  d3.select('#lyrange').text(yi1.toFixed(2)+"--"+yx1.toFixed(2));
}

  if(brush2!==null){
  xi2=plot2.xScale.invert(brush2[0][0]);
  xx2=plot2.xScale.invert(brush2[1][0]);
  yx2=plot2.yScale.invert(brush2[0][1]);
  yi2=plot2.yScale.invert(brush2[1][1]);
  d3.select('#rxrange').text(xi2.toFixed(2)+"--"+xx2.toFixed(2));
  d3.select('#ryrange').text(yi2.toFixed(2)+"--"+yx2.toFixed(2));
}
  


  //console.log(xi2,xx2,yx2,yi2);
  function isSelected(d) {
    if (brush2===null){
      return xx1>= d.sepalLength && d.sepalLength  >=xi1
      && yi1 <= d.sepalWidth && yx1 >=d.sepalWidth  ;
    }
   if(brush1===null){
      return xx2>= d.petalLength && d.petalLength  >=xi2
      && yi2 <= d.petalWidth && yx2 >=d.petalWidth;
    }
    if(brush2!==null && brush1!==null){
      return xx1>= d.sepalLength && d.sepalLength  >=xi1
      && yi1 <= d.sepalWidth && yx1 >=d.sepalWidth 
      && xx2>= d.petalLength && d.petalLength  >=xi2
      && yi2 <= d.petalWidth && yx2 >= d.petalWidth;
    }
  
  }

  let selected = allCircles
    .filter(isSelected).attr("stroke","black");
  let notSelected = allCircles
    .filter(function(d) { return !isSelected(d); })
    .attr("stroke",null);

  // selected and notSelected are d3 selections, write code to set their
  // attributes as per the assignment specification.
}

////////////////////////////////////////////////////////////////////////
//
// d3 brush selection
//
// The "selection" of a brush is the range of values in either of the
// dimensions that an existing brush corresponds to. The brush selection
// is available in the event.selection object.
// 
//   e = event.selection
//   e[0][0] is the minimum value in the x axis of the brush
//   e[1][0] is the maximum value in the x axis of the brush
//   e[0][1] is the minimum value in the y axis of the brush
//   e[1][1] is the maximum value in the y axis of the brush
//
// The most important thing to know about the brush selection is that
// it stores values in *PIXEL UNITS*. Your logic for highlighting
// points, however, is not based on pixel units: it's based on data
// units.
//
// In order to convert between the two of them, remember that you have
// the d3 scales you created with the makeScatterplot function above.
//
// It is not necessary to use, but you might also find it helpful to
// know that d3 scales have a function to *invert* a mapping: if you
// create a scale like this:
//
//  s = d3.scaleLinear().domain([5, 10]).range([0, 100])
//
// then s(7.5) === 50, and s.invert(50) === 7.5. In other words, the
// scale object has a method invert(), which converts a value in the
// range to a value in the domain. This is exactly what you will need
// to use in order to convert pixel units back to data units.
//
//
// NOTE: You should not have to change any of the following:

function updateBrush1(event) {
  brush1 = event.selection;
  onBrush();
}

function updateBrush2(event) {
  brush2 = event.selection;
  onBrush();
}

plot1.brush
  .on("brush", updateBrush1)
  .on("end", updateBrush1);

plot2.brush
  .on("brush", updateBrush2)
  .on("end", updateBrush2);
