import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const w = 800;
const h = 500;
const padding = 50;

const svg = d3.select("svg");

let dataset;

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    dataset = res;
    console.log(dataset);

    drawCanvas();
    drawAxes();
    drawDots();
  });

const drawCanvas = () => {
  svg.attr("width", w).attr("height", h);
  addTitle();
};

const addTitle = () => {
  svg
    .append("text")
    .text("Doping in Professional Bicycle Racing")
    .attr("id", "title")
    .attr("x", w / 2)
    .attr("y", padding);
};

const drawAxes = () => {
  const { xScale, yScale } = generateScales();

  const xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`);

  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};

const generateScales = () => {
  const years = dataset.map((d) => d["Year"]);
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([padding, w - padding]);

  const seconds = dataset.map((d) => d["Seconds"]);
  const yScale = d3
    .scaleLinear()
    .domain([d3.min(seconds), d3.max(seconds)])
    .range([h - padding, padding]);

  return { xScale, yScale };
};

const drawDots = () => {
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("cx", (d, i) => i)
    .attr("cy", (d, i) => i)
    .attr("data-xvalue", (d) => d["Year"])
    .attr("data-yvalue", (d) => d["Time"]);
};
