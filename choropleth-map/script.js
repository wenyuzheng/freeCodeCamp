import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const svg = d3.select("svg");

let countyData, educationData;

d3.json(countyURL).then((data) => {
  countyData = topojson.feature(data, data.objects.counties).features;

  d3.json(educationURL).then((data) => {
    educationData = data;

    console.log(countyData, educationData);

    drawMap();
  });
});

const drawMap = () => {
  svg
    .selectAll("path")
    .data(countyData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county");
};
