import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 1200;
const height = 800;

const colors = d3
  .scaleOrdinal()
  .range([...d3.schemePaired, ...d3.schemeTableau10]);

let dataset;

d3.json(url).then((data) => {
  dataset = data;

  drawTreemap();
  addLegend();
});

const drawTreemap = () => {
  // Convert data object to hierarchy
  const rootData = d3
    .hierarchy(dataset)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  // Create treemap using hierarchy data as arguments
  d3.treemap().size([width, height]).padding(1)(rootData);

  // Create tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden");

  // Draw canvas
  const canvas = d3
    .select("#canvas")
    .attr("width", width)
    .attr("height", height);

  // Add rect tiles
  canvas
    .selectAll("rect")
    .data(rootData.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (d) => colors(d.data.category))
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`)
    .style("stroke", "white")
    .on("mouseover", (e, d) => {
      tooltip
        .html(
          `Name: ${d.data.name}<br/>Category: ${d.data.category}<br/>Value: ${d.data.value}`
        )
        .style("visibility", "visible")
        .attr("data-value", d.data.value)
        .style("top", d.y1 + "px")
        .style("left", d.x1 + "px");
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
};

const addLegend = () => {
  const categories = dataset.children.map((e) => e.name);

  const legend = d3.select("#legend").attr("width", 600).attr("height", 400);
  const legendItem = legend.selectAll("g").data(categories).enter().append("g");

  const rowsNum = 5;

  legendItem
    .append("rect")
    .attr("class", "legend-item")
    .attr("fill", (d) => colors(d))
    .attr("width", "30px")
    .attr("height", "30px")
    .attr("y", (d, i) => Math.floor(i / rowsNum) * 35)
    .attr("x", (d, i) => (i % rowsNum) * 100);

  legendItem
    .append("text")
    .text((d) => d)
    .attr("y", (d, i) => Math.floor(i / rowsNum) * 35 + 20)
    .attr("x", (d, i) => (i % rowsNum) * 100 + 35);
};
