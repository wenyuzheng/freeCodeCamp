import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

const svg = d3.select("svg");

let countyDataset, educationDataset;

d3.json(countyURL).then((data) => {
  countyDataset = topojson.feature(data, data.objects.counties).features;

  d3.json(educationURL).then((data) => {
    educationDataset = data;

    console.log(countyDataset, educationDataset);

    drawMap();
  });
});

const drawMap = () => {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden");

  svg
    .selectAll("path")
    .data(countyDataset)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("fill", (countyData) => {
      const percentage = educationDataset.find(
        (e) => e.fips === countyData.id
      ).bachelorsOrHigher;
      if (percentage <= 15) {
        return "rgb(199, 233, 192)";
      } else if (percentage <= 30) {
        return "rgb(161, 217, 155)";
      } else if (percentage <= 45) {
        return "rgb(65, 171, 93)";
      } else {
        return "rgb(35, 139, 69)";
      }
    })
    .attr("data-fips", (countyData) => countyData.id)
    .attr(
      "data-education",
      (countyData) =>
        educationDataset.find((e) => e.fips === countyData.id).bachelorsOrHigher
    )
    .on("mouseover", (e, countyData) => {
      const county = educationDataset.find((e) => e.fips === countyData.id);
      tooltip
        .style("visibility", "visible")
        .html(
          `${county.area_name}, ${county.state}: ${county.bachelorsOrHigher}%`
        )
        .style("left", `${e.pageX}px`)
        .style("top", `${e.pageY + 28}px`)
        .attr("data-education", county.bachelorsOrHigher);
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });
};
