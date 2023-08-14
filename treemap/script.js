import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

const width = 1000;
const height = 800;

let dataset;

d3.json(url).then((data) => {
  dataset = data;

  console.log(dataset);

  drawTreemap();
});

const drawTreemap = () => {
  // Convert data to treemap
  const rootData = d3.hierarchy(dataset).sum((d) => d.value);
  console.log(rootData.leaves());
  d3.treemap().size([width, height])(rootData);
  console.log(rootData.leaves());

  // Draw canvas
  const canvas = d3
    .select("#canvas")
    .attr("width", width)
    .attr("height", height);

  canvas
    .selectAll("rect")
    .data(rootData.leaves())
    .enter()
    .append("rect")
    .attr("class", "tile");
};
