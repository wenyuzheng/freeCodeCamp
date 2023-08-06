import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const w = 1000;
const h = 500;
const padding = 50;

const svg = d3.select("svg");

let dataset;

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    dataset = res;
    console.log(dataset);

    const years = dataset.monthlyVariance.map((e) => e.year);

    addDescription(years);
    drawCanvas();
    drawAxes(years);
  });

const addDescription = (years) => {
  document.getElementById(
    "description"
  ).textContent = `Base temperature in ${d3.min(years)} - ${d3.max(years)}: ${
    dataset.baseTemperature
  } ℃`;
};

const drawCanvas = () => {
  svg.attr("width", w).attr("height", h);
};

const generateScales = (years) => {
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years)])
    .range([padding, w - padding]);

  return { xScale };
};

const drawAxes = (years) => {
  const { xScale } = generateScales(years);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  svg.append("g").call(xAxis).attr("id", "x-axis");
};
