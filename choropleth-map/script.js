import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const countyURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyDataset, educationDataset;

d3.json(countyURL).then((data) => {
  countyDataset = topojson.feature(data, data.objects.counties).features;

  d3.json(educationURL).then((data) => {
    educationDataset = data;

    console.log(countyDataset, educationDataset);

    drawMap();
    drawLegend();
  });
});

const drawMap = () => {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden");

  d3.select("svg")
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

const drawLegend = () => {
  const legendWidth = 300;
  const legend = d3.select("#legend").attr("width", legendWidth + 20);
  const [min, max] = d3.extent(educationDataset, (e) => e.bachelorsOrHigher);

  const xScale = d3
    .scaleLinear()
    .domain([min, max])
    .rangeRound([0, legendWidth]);
  const colorScale = d3
    .scaleThreshold()
    .domain(d3.range(min, max, (max - min) / 8))
    .range(d3.schemeGreens[9]);

  // Add color boxes
  legend
    .selectAll("rect")
    .data(
      colorScale.range().map((e) => {
        e = colorScale.invertExtent(e);

        if (!e[0]) e[0] = xScale.domain()[0];
        if (!e[1]) e[1] = xScale.domain()[1];

        return e;
      })
    )
    .enter()
    .append("rect")
    .attr("width", (d) => xScale(d[1]) - xScale(d[0]))
    .attr("height", 8)
    .attr("x", (d) => xScale(d[0]) + 10)
    .attr("fill", (d) => colorScale(d[0]));

  // Draw Axis
  const axis = d3
    .axisBottom(xScale)
    .tickFormat((i) => Math.round(i) + "%")
    .tickValues(colorScale.domain())
    .tickSize(15);

  legend
    .append("g")
    .attr("id", "color-axis")
    .attr("class", "color-tick")
    .attr("transform", `translate(10, 0)`)
    .call(axis);
};
