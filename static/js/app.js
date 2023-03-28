// Fetch data from the given URL using d3.json() method
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {

  // Create a function to extract the required data for the chart
  function createChart(sample) {
    var sampleData = data.samples.filter(d => d.id === sample)[0];
    var sampleValues = sampleData.sample_values.slice(0, 10).reverse();
    var otuIDs = sampleData.otu_ids.slice(0, 10).reverse().map(id => "OTU " + id);
    var otuLabels = sampleData.otu_labels.slice(0, 10).reverse();

    // Create scales and axes for the chart
    var xScale = d3.scaleLinear()
      .domain([0, d3.max(sampleValues)])
      .range([0, 500]);

    var yScale = d3.scaleBand()
      .domain(otuIDs)
      .range([0, 300])
      .padding(0.1);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Create and update the bars, labels and hovertext of the chart
    var bars = d3.selectAll(".bar")
      .data(sampleValues);

    bars.enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", function(d, i) { return yScale(otuIDs[i]); })
      .attr("width", function(d) { return xScale(d); })
      .attr("height", yScale.bandwidth())
      .attr("fill", "blue");

    bars.attr("width", function(d) { return xScale(d); });

    bars.exit().remove();

    var labels = d3.selectAll(".label")
      .data(otuLabels);

    labels.enter()
      .append("text")
      .attr("class", "label")
      .attr("x", 0)
      .attr("y", function(d, i) { return yScale(otuIDs[i]) + yScale.bandwidth() / 2; })
      .text(function(d) { return d; });

    labels.text(function(d) { return d; });

    labels.exit().remove();

    bars.on("mouseover", function(d, i) {
      d3.select(this).attr("fill", "red");
      d3.select(".hovertext").text