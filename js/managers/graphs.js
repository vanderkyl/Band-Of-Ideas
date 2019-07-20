var colors = ["#0074D9", "#3D9970", "#85144b", "#FF851B", "#FF4136", "#85144b"];

$(document).ready(function() {
  console.log("Rendering Graph...");
  setupIdeaGraph();
  setupOtherGraph();
});

function setupIdeaGraph() {
  var ideaGraphElement = document.getElementById("ideaGraphContainer").getContext('2d');
  var graphData = {
    labels: [],
    datasets: [{
      label: 'Band Details',
      data: [],
      borderWidth: 1,
      backgroundColor: [],
      borderColor: "rgb(168, 188, 212)",
      borderWidth: 3
    }]
  };
  var totalIdeas = 0;
  for (var i = 0 ; i < CURRENT_BANDS.length; i++) {
    var band = CURRENT_BANDS[i];
    graphData.labels.push(band.name);
    graphData.datasets[0].data.push(band.numFiles);
    graphData.datasets[0].backgroundColor.push(colors[i]);
    totalIdeas += band.numFiles;
  }


  var ideaGraph = new Chart(ideaGraphElement, {
    type: 'doughnut',
    data: graphData,
    options: {
      title: {
        display: true,
        fontColor: "#333",
        text: "Number of Ideas: " + totalIdeas,
        position: "top"
      },
      legend: {
        position: "bottom",
        labels: {
          fontColor: "#333",
          fontSize: 10
        }
      },
      cutoutPercentage: 60,
      scales: {

      }
    }

  });
}

function setupOtherGraph() {
  var otherGraphElement = document.getElementById("otherGraphContainer").getContext('2d');
  var graphData = {
    labels: [],
    datasets: [{
      label: 'Band Details',
      data: [],
      borderWidth: 1,
      backgroundColor: [],
      borderColor: "rgb(168, 188, 212)",
      borderWidth: 3
    }]
  };
  for (var i = 0 ; i < CURRENT_BANDS.length; i++) {
    var band = CURRENT_BANDS[i];
    graphData.labels.push(band.name);
    graphData.datasets[0].data.push(band.members.length);
    graphData.datasets[0].backgroundColor.push(colors[i]);
  }


  var otherGraph = new Chart(otherGraphElement, {
    type: 'doughnut',
    data: graphData,
    options: {
      title: {
        display: true,
        fontColor: "#333",
        text: "Band Members",
        position: "top"
      },
      legend: {
        position: "bottom",
        labels: {
          fontColor: "#333",
          fontSize: 10
        }
      },
      cutoutPercentage: 60,
      scales: {

      }
    }

  });
}