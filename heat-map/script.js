import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

let dataset;

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    dataset = res;
    console.log(dataset);
    addDescription();
  });

const addDescription = () => {
  const years = dataset.monthlyVariance.map((e) => e.year);
  document.getElementById(
    "description"
  ).textContent = `Base temperature in ${d3.min(years)} - ${d3.max(years)}: ${
    dataset.baseTemperature
  } ℃`;
};
