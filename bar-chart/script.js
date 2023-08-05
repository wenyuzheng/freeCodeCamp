const width = 800;
const height = 500;
const padding = 50;

const svg = d3.select("svg");

let dataset, xScale, yScale;

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    dataset = res.data;

    drawCanvas();
    generateScales();
    drawAxes();
    // drawBars();
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

const generateScales = () => {
  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height - padding, padding]);
};

const drawAxes = () => {
  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};
