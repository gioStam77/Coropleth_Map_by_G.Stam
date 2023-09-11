w = 1200;
h = 800;
padding = 60;

url_edu =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
url_county =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

let edu_data;
let county_data;

function createChoroplethMap() {
  d3.select("body")
    .append("h1")
    .attr("id", "title")
    .text("United States Educational Attainment");

  d3.select("body")
    .append("h3")
    .attr("id", "description")
    .text(
      "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
    );

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .attr("visibility", "hidden")
    .text("");

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .selectAll("path")
    .data(county_data)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "county")
    .attr("data-fips", (county_data_item) => {
      return county_data_item["id"];
    })
    .attr("data-education", (county_data_item) => {
      let id = county_data_item["id"];
      let county = edu_data.find((item) => item["fips"] === id);
      let percentage = county["bachelorsOrHigher"];
      return percentage;
    })
    .attr("fill", (d) => {
      const id = d.id;
      const county = edu_data.find((item) => item["fips"] == id);
      console.log(county);
      let percentage = county["bachelorsOrHigher"];
      if (percentage <= 15) {
        return "red";
      } else if (percentage <= 30) {
        return "orange";
      } else if (percentage <= 45) {
        return "yellow";
      } else {
        return "blue";
      }
    })
    .on("mouseover", (county_data_item) => {
      let id = county_data_item["id"];
      let county = edu_data.find((item) => item["fips"] === id);
      tooltip
        .transition()
        // .style("visibility", "visibile")
        .text(
          `fips:${county["fips"]},area-name:${county["area_name"]}
          state:${county["state"]}Edu.level:${county["bachelorsOrHigher"]}`
        )
        .style("left", `${d3.event.x}px`)
        .style("top", `${d3.event.y}px`)
        .duration(200)
        .style("opacity", "1")
        .attr("data-education", county["bachelorsOrHigher"]);
    })
    .on("mouseout", (d) => {
      // tooltip.style("visibility", "hidden");
      tooltip.transition().duration(300).style("opacity", "0");
    });

  d3.select("body")
    .append("svg")
    .attr("id", "legend")
    .attr("width", 160)
    .attr("height", 40);
}
// fetch(url_edu)
//   .then((response) => response.json())
//   .then((data) => {
//     createChoroplethMap(data);
//   });
d3.json(url_county).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    county_data = topojson.feature(data, data.objects.counties).features;
    console.log(county_data);

    d3.json(url_edu).then((data, error) => {
      if (error) {
        console.log(error);
      } else {
        edu_data = data;
        console.log(edu_data);
      }
      createChoroplethMap();
    });
  }
});
