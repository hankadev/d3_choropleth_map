/* global d3 */
(function () {
  'use strict';

  const urlGeoData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
  const urlEducationData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

  let geoData;
  let educationData;

  const colors = ['#191970', '#0000cd', '#4169e1', '#7b68ee', '#6595ed', '#87cefa', '#b0e0e6'];
  const texts = ['over 57 %', '48 - 57 %', '39 - 48 %', '30 - 39 %', '21 - 30 %', '12 - 21 %', 'below 12 %']

  function getColor(id) {
    let item = educationData.find(f => f.fips === id);
    let value = item.bachelorsOrHigher
    if (value >= 57) {
      return colors[0];
    }
    else if (value >= 48) {
      return colors[1];
    }
    else if (value >= 39) {
      return colors[2];
    }
    else if (value >= 30) {
      return colors[3];
    }
    else if (value >= 21) {
      return colors[4];
    }
    else if (value >= 12) {
      return colors[5];
    } else {
      return colors[6];
    }
  }

  function showTooltip(id) {
    let item = educationData.find(f => f.fips === id);
    return item.area_name + ', ' + item.state + ': ' + item.bachelorsOrHigher + ' %';
  }

  d3.json(urlGeoData)
    .then(function (data) {
      if (data) {
        geoData = topojson.feature(data, data.objects.counties).features;
        d3.json(urlEducationData)
          .then(function (data) {
            if (data) {
              educationData = data;
              const width = 1000;
              const height = 600;
              // create svg element and append it to body
              const svg =
                d3.select('#canvas')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);
              // add tooltip 
              const tooltip =
                d3.select('#canvas')
                  .append('div')
                  .attr('id', 'tooltip');

              svg
                .selectAll('path')
                .data(geoData)
                .enter()
                .append('path')
                .attr('d', d3.geoPath())
                .attr('class', 'county')
                .attr('fill', d => getColor(d.id))
                .attr('data-fips', d => d.id)
                .attr('data-education', d => {
                  let item = educationData.find(f => f.fips === d.id);
                  return item.bachelorsOrHigher;
                })
                .on('mouseover', d => {
                  tooltip
                    .html(showTooltip(d.id))
                    .style('top', (d3.event.pageY - 35) + 'px')
                    .style('left', (d3.event.pageX) + 'px')
                    .style('visibility', 'visible')
                    .attr('data-education', () => {
                      let item = educationData.find(f => f.fips === d.id);
                      return item.bachelorsOrHigher;
                    })
                })
                .on('mouseout', () => {
                  tooltip.style('visibility', 'hidden');
                });

              const legendRectWidht = 100;

              const legend =
                d3.select('#legend')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', 50)
                  .append("g")
                  .attr('transform', 'translate(' + (width - 7 * legendRectWidht) / 2 + ', 0)')
                  .attr('id', 'legend')

              legend.selectAll('rect')
                .data(colors.reverse())
                .enter()
                .append('rect')
                .attr('x', (item, index) => index * legendRectWidht)
                .attr('y', 0)
                .attr('width', legendRectWidht)
                .attr('height', 20)
                .attr('fill', c => c);

              legend.selectAll('text')
                .data(texts.reverse())
                .enter()
                .append('text')
                .attr('x', (item, index) => index * legendRectWidht)
                .attr('y', 35)
                .attr('width', 0)
                .attr('height', 20)
                .text(t => t)
            }
          })
      }
    })

}());
