const width = 800;
const height = 500;
const padding = 20;

let dataset;

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    dataset = res.data;

    drawCanvas();
  });

const drawCanvas = () => {
  const svg = d3.select("svg");
  svg.attr("width", width).attr("height", height);
};
