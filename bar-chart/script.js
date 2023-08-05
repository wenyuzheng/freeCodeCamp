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
    .attr("width", (width - padding * 2) / dataset.length)
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1]);
};

const generateScales = () => {
  const dates = dataset.map((d) => new Date(d[0]));
  xScale = d3
    .scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height - padding, padding]);
};

const drawAxes = () => {
  const xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};
