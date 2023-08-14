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

  console.log(dataset);

  drawTreemap();
  addLegend();
});

const drawTreemap = () => {
  // Convert data to treemap
  const rootData = d3
    .hierarchy(dataset)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  //   console.log(rootData.leaves());
  d3.treemap().size([width, height])(rootData);
  //   console.log(rootData.leaves());

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
    .style("stroke", "black");
};

const addLegend = () => {
  const categories = dataset.children.map((e) => e.name);
  console.log(categories);
  const legend = d3.select("#legend").attr("width", 600).attr("height", 400);

  //   legend
  //     .selectAll("rect")
  //     .data(categories)
  //     .enter()
  //     .append("rect")
  //     .attr("class", "legend-item")
  //     .attr("fill", (d) => colors(d))
  //     .attr("width", "30px")
  //     .attr("height", "30px")
  //     .attr("y", (d, i) => (i % (categories.length / 2)) * 35)
  //     .attr("x", (d, i) => (i % 2) * 35);
};
