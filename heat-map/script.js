import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

const width = 1500;
const height = 500;
const padding = 60;

const svg = d3.select("svg");

let dataset, baseTemp, xScale, yScale;

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    baseTemp = res.baseTemperature;
    dataset = res.monthlyVariance;
    console.log(dataset);

    const years = dataset.map((e) => e.year);

    addDescription(years);
    drawCanvas();
    generateScales(years);
    drawAxes();
    drawCells();
  });

const addDescription = (years) => {
  document.getElementById(
    "description"
  ).textContent = `Base temperature in ${d3.min(years)} - ${d3.max(
    years
  )}: ${baseTemp} ℃`;
};

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const generateScales = (years) => {
  xScale = d3
    .scaleLinear()
    .domain([d3.min(years), d3.max(years) + 1])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);
};

const drawAxes = () => {
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};

const drawCells = () => {
  const years = dataset.map((e) => e.year);

  const tooltip = d3.select("#tooltip");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .style("fill", (d) => {
      if (d.variance <= -2) {
        return "rgb(69, 117, 180)";
      } else if (d.variance <= -1) {
        return "rgb(171, 217, 233)";
      } else if (d.variance <= 0) {
        return "rgb(255, 255, 191)";
      } else if (d.variance <= 1) {
        return "rgb(253, 174, 97)";
      } else if (d.variance <= 2) {
        return "rgb(244, 109, 67)";
      } else {
        return "rgb(215, 48, 39)";
      }
    })
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemp + d.variance)
    .attr("y", (d) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
    .attr("x", (d) => xScale(d.year))
    .attr("height", (height - padding * 2) / 12)
    .attr("width", (width - padding * 2) / (d3.max(years) - d3.min(years)))
    .on("mouseover", (e, d) => {
      tooltip
        .style("visibility", "visible")
        .text(`${d.month}/${d.year}: ${(baseTemp + d.variance).toFixed(2)}℃`)
        .style("top", Math.ceil(e.pageY / 15) * 15 + "px")
        .style("left", Math.ceil(e.pageX / 15) * 15 + "px")
        .attr("data-year", d.year);
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });
};
