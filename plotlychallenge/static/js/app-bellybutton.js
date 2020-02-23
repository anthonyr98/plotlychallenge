function buildMetadata(sample) {

    // complete the following function that builds the metadata panel
    // use `d3.json` to fetch the metadata for a sample
    var url = "/metadata/" + sample;
    d3.json(url).then(function(sample){
  
      // use d3 to select the panel with id of `#sample-metadata`
      var sample_metadata = d3.select("#sample-metadata");
  
      // use `.html("") to clear any existing metadata
      sample_metadata.html("");
  
      // use `Object.entries` to add each key and value pair to the panel
      Object.entries(sample).forEach(([key, value]) => {
        var row = sample_metadata.append("p");
        row.text(`${key}: ${value}`);
  
      })
    })
  };
  
  function buildCharts(sample) {
  
    // use `d3.json` to fetch the sample data for the plots
    var url = `/samples/${sample}`;
    d3.json(url).then(function(data) {
  
      // build a Bubble Chart using the sample data
      var xValues = data.otu_ids;
      var yValues = data.sample_values;
      var tValues = data.otu_labels;
      var mSize = data.sample_values;
      var mClrs = data.otu_ids;
  
      var trace_bubble = {
        x: xValues,
        y: yValues,
        text: tValues,
        mode: 'markers',
        marker: {
          size: mSize,
          color: mClrs
        }
      };
  
      var data = [trace_bubble];
  
      var layout = {
        xaxis: {title: "OTU ID"}
      };
  
      Plotly.newPlot('bubble', data, layout);
  
      // build a Pie Chart
      d3.json(url).then(function(data) {
        var pieValue = data.sample_values.slice(0,10);
        var pielabel = data.otu_ids.slice(0, 10);
        var pieHover = data.otu_labels.slice(0, 10);
  
        var data = [{
          values: pieValue,
          labels: pielabel,
          hovertext: pieHover,
          type: 'pie'
        }];
  
        Plotly.newPlot('pie', data);
      });
    });
  };
  
  function init() {
    // grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  };
  
  function optionChanged(newSample) {
    // fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  };
  
  // initialize the dashboard
  init();
  