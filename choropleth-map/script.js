import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const countiesUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countiesData, edcuationData;

d3.json(countiesUrl).then((data) => {
  countiesData = data;

  d3.json(educationUrl).then((data) => {
    edcuationData = data;

    console.log(countiesData, edcuationData);
  });
});
