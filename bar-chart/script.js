const width = 800;
const height = 500;
const padding = 20;

const svg = d3.select("svg");

let dataset;

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    dataset = res.data;

    drawCanvas();
    drawBars();
  });

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const drawBars = () => {
  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => i * 7)
    // .attr("y", height - padding - 100)
    .attr("width", 5)
    .attr("height", (d, i) => d[1]);
};
