function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleBacterias = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesResultArray = sampleBacterias.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var samplesResult = samplesResultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = samplesResult.otu_ids;
    var otuLabels = samplesResult.otu_labels;
    var sampleValues = samplesResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(i=>`OTU ID ${i}`).slice(0,10).reverse();
    var xticks = sampleValues.slice(0,10).reverse();
    var hover = otuLabels.slice(0,10).reverse();
    //console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      //x: sampleValues.reverse(),
      x: xticks,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: hover
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      //yaxis=dict(type='category')
      yaxis: {
        type: "category"
        //labels: 
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        size: sampleValues,
        colorscale: "Picnic"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis:  {
        //labels:
        title: "OTU ID",
        //margins:
        autorange: true,
        hovermode: "closest"
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
    // 4. Create the trace for the gauge chart.
    d3.json("samples.json").then((data) => {
      // Create a variable that holds the samples array. 
      var metadata1 = data.metadata;
      // Create a variable that filters the samples for the object with the desired sample number.
      var wfreqResultArray = metadata1.filter(sampleObj => sampleObj.id == sample);
      //  Create a variable that holds the first sample in the array.
      //var wfreqResult = wfreqResultArray.wfreq;
      var wfreqResult = wfreqResultArray[0];
      //  Create a variable that converts the washing frequency to a floating number
     // var wfreq = parseFloat(wfreqResult);
      var wfreq = parseFloat(wfreqResult.wfreq);
      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
		    value: wfreq,
		    title: { text: `Belly Button Washing Frequency<br>Scrubs per Week` },
		    type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "blue" },
            { range: [2, 4], color: "turquoise" },
            { range: [4, 6], color: "pink"},
            { range: [6, 8], color: "hotpink"},
            { range: [8, 10], color: "crimson"}
          ]}
    }];
    
    // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 500, 
        height: 400, 
        margin: { t: 0, b: 0 }
      };

    // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  });
}