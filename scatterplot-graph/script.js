import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const w = 800;
const h = 500;
const padding = 40;

const svg = d3.select("svg");

let dataset;

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    dataset = res;
    drawCanvas();
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
