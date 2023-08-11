import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

let dataset;

d3.json(url).then((data) => {
  dataset = data;

  console.log(dataset);
});
