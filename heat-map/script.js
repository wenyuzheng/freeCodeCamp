import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const w = 1000;
const h = 500;
const padding = 50;

const svg = d3.select("svg");

let dataset, baseTemp;

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    baseTemp = res.baseTemperature;
    dataset = res.monthlyVariance;
    console.log(dataset);

    const years = dataset.map((e) => e.year);

    addDescription(years);
    drawCanvas();
    drawAxes(years);
    drawCell();
  });

const addDescription = (years) => {
  document.getElementById(
    "description"
  ).textContent = `Base temperature in ${d3.min(years)} - ${d3.max(
    years
  )}: ${baseTemp} ℃`;
};

const drawCanvas = () => {
  svg.attr("width", w).attr("height", h);
};

const generateScales = (years) => {
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([padding, w - padding]);

  const months = dataset.map((e) => e.month);
  const yScale = d3
    .scaleLinear()
    .domain([d3.max(months), d3.min(months)])
    .range([h - padding, padding]);

  return { xScale, yScale };
};

const drawAxes = (years) => {
  const { xScale, yScale } = generateScales(years);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
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

const drawCell = () => {
  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .style("fill", (d) => {
      if (d.variance <= -1) {
        return "blue";
      } else if (d.variance <= 0) {
        return "lightblue";
      } else if (d.variance <= 1) {
        return "yellow";
      } else {
        return "orange";
      }
    })
    .attr("data-month", (d) => d.month)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance);
};
