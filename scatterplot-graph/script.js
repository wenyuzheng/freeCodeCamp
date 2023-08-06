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
    addLegend();
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

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${h - padding})`);

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));
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
    .domain([d3.min(years) - 1, d3.max(years) + 1])
    .range([padding, w - padding]);

  const seconds = dataset.map((d) => new Date(d["Seconds"] * 1000));
  const yScale = d3
    .scaleTime()
    .domain([d3.min(seconds), d3.max(seconds)])
    .range([h - padding, padding]);

  return { xScale, yScale };
};

const drawDots = () => {
  const { xScale, yScale } = generateScales();

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .text("tooltip");

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 5)
    .attr("cx", (d) => xScale(d["Year"]))
    .attr("cy", (d) => yScale(d["Seconds"] * 1000))
    .attr("data-xvalue", (d) => d["Year"])
    .attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000))
    .style("fill", (d) => (d["Doping"] ? "red" : "green"))
    .on("mouseover", (e, d) => {
      tooltip
        .style("visibility", "visible")
        .html(
          `<strong>${d["Name"]}</strong>: ${d["Nationality"]}<br>
          Year: ${d["Year"]}<br>
          Time: ${d["Time"]}<br>
          ${d["Doping"] ? d["Doping"] : ""}
          `
        )
        .style("top", Math.ceil(e.pageY / 15) * 15 + "px")
        .style("left", Math.ceil(e.pageX / 15) * 15 + "px");
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
};

const addLegend = () => {
  const legend = svg.append("g").attr("id", "legend");

  legend
    .append("text")
    .text("With doping allegations")
    .attr("x", w - 200)
    .attr("y", h / 2);

  legend
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "red")
    .attr("x", w - 220)
    .attr("y", h / 2 - 12);

  legend
    .append("text")
    .text("No doping allegations")
    .attr("x", w - 200)
    .attr("y", h / 2 - 20);

  legend
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", "green")
    .attr("x", w - 220)
    .attr("y", h / 2 - 32);
};
