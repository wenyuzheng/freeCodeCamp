const width = 800;
const height = 500;
const padding = 50;

const svg = d3.select("svg");

let dataset, xScale, yScale, barHeightScale, barXScale;

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch(url)
  .then((response) => response.json())
  .then((res) => {
    dataset = res.data;

    drawCanvas();
    generateScales();
    drawAxes();
    drawBars();
  });

const drawCanvas = () => {
  svg.attr("width", width).attr("height", height);
};

const drawBars = () => {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .text("tooltip here");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", (width - padding * 2) / dataset.length)
    .attr("height", (d) => barHeightScale(d[1]))
    .attr("x", (d, i) => barXScale(i))
    .attr("y", (d, i) => height - padding - barHeightScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (e, d) =>
      tooltip
        .style("visibility", "visible")
        .html(`${d[0]}<br>$${d[1]} Billion`)
        .attr("data-date", d[0])
    )
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
};

const generateScales = () => {
  const dates = dataset.map((d) => new Date(d[0]));
  xScale = d3
    .scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([height - padding, padding]);

  barHeightScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([0, height - padding * 2]);

  barXScale = d3
    .scaleLinear()
    .domain([0, dataset.length - 1])
    .range([padding, width - padding]);
};

const drawAxes = () => {
  const xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};
