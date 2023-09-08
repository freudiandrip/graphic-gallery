const svg = d3.select('svg')

svg.attr('viewBox', '0 0 1000 600')

const worldGroup = svg.append('g')

// docs for what projections are: https://github.com/d3/d3-geo-projection
const projection = d3.geoNaturalEarth1()
	.translate([500, 300])
	.scale(175)

// makes map using geoPath method, takes in data from the projection defined above
const mapGenerator = d3.geoPath()
	.projection(projection)

// colorScale docs: https://github.com/d3/d3-scale-chromatic
const colorScale = d3.scaleSequentialPow(d3.interpolatePlasma)
	.domain([2000, 0])
	.exponent(0.3)
	// no need for range since colorScale has built in color range
// 	.range

// scale has multiple values for smoother tweening
const scrollScale = d3.scaleLinear()
	.domain([0, 2000, 4000, 7500, 15000])
	// range based on population density - want position to linearly correspond with density data
	.range([0, 10, 100, 300, 2000])
	// clamping --> scrolling ends when range upper limit is reached
	.clamp(true)

// original data is density from data.json
d3.json('data.json').then(function (data) {
  // map path border data is nested using world-m110m2.json
  d3.json('world-110m2.json').then(function (mapData) {
    // 1. use worldGroup to add in paths which define appearance of map
    // 2. projection and mapGenerator draw the actual paths
    worldGroup
    	.selectAll('path')
    	.data(mapData.features)
    	.enter()
    	.append('path')
    	.attr('d', mapGenerator)
    	.style('fill', (d,i) => {
      	const dataCountry = d.properties.name
      	const country = data.find((country) => {
          return country.name === dataCountry
        })
      
      	if (country) {
            return colorScale(country.density)
            } else {
              return '#111111'
            }
    })
    
    window.addEventListener('scroll', function () {
      const pixels = window.pageYOffset
      // slowing down scroll using scale; threshold is based on density
      const threshold = scrollScale(pixels)
      const spanTag = d3.select('span.counter')
      const format = d3.format('.1f')
      const density = data.density
      
      spanTag.text(format(threshold))
      
      worldGroup
      	.selectAll('path')
      	.style('fill', d => {
        	const dataCountry = d.properties.name
        	const country = data.find((country) => { 
            return country.name === dataCountry
          })
          
          if (country && country.density > threshold) {
            return colorScale(country.density)
          } else {
            return '#111111'
          }
          
      })
    })
    
    
  })
  
  // bar chart testing
//   svg
//   	.selectAll('rect')
//   	.data(data)
//   	.enter()
//   	.append('rect')
//   	.attr('x', 0)
//   	.attr('y', (d, i) => { return i * 30 })
//   	.attr('width', d => { return d.density })
//   	.attr('height', 24)
//   	.style('fill', 'red')
})