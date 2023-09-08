// Three places to run the data visualization
// 1. on page load
// 2. on any change of any select dropdowns
// all will run the same code
const svg = d3.select('svg')
svg
  .attr('viewBox', '0 0 960 720')

// elements to set up
// axes, scales, text elements
const axisXGroup = svg
	.append('g')
	.attr('class', 'x-axis')
	.attr('transform', 'translate(0, 620)')

const axisXText = svg
  .append('text')
  .attr('class', 'x-label')
  .attr('transform', 'translate(480, 670)')
  .text("x-axis")

const axisYGroup = svg
	.append('g')
	.attr('class', 'y-axis')
  .attr('transform', 'translate(100, 0)')

const axisYText = svg
  .append('text')
  .attr('class', 'y-label')
  .attr('transform', 'translate(24, 360) rotate(-90)')
  .text("y-axis")

const placeCities = function() {
  // taking the input from our select dropdown menus
  let inputX = document.querySelector('select[name=valueX]')
  let inputY = document.querySelector('select[name=valueY]')

  // inputting obj key names as variables; key value is linked to both the select options and the data
  let valueX = inputX.value
  let valueY = inputY.value
  
  // grabbing the text for our XY labels
 	const xLabel = inputX.options[inputX.selectedIndex].innerText
  const yLabel = inputY.options[inputY.selectedIndex].innerText
  
  // updating labels with input selection
 	axisXText.text(xLabel)
  axisYText.text(yLabel)

  // format follows as d3.max(iterable[, accessor]), where accessor is (d,i) => {expression}
  // also applies for d3.min - refer to docs: https://github.com/d3/d3-array#max
  // the point? allows for the dynamic retrieval of min and max values without hard coding (particularly useful for complex multi-variate data)
  const xMax = d3.max(data, d => { return d[valueX] })
  const yMax = d3.max(data, d => { return d[valueY] })
  // assigning a var and creating a dependent variable r based on max pop size
  const rMax = d3.max(data, d => { return d.population })

  // linear scales encode + decode data to suitable outputs for svg parameters
  const scaleX = d3.scaleLinear()
    .domain([0, xMax])
    .range([100, 860])

  const scaleY = d3.scaleLinear()
    .domain([0, yMax])
    .range([620, 100])

  const scaleR = d3.scaleSqrt()
    .domain([0, rMax])
    // we want our max radius to be 30 and have r be dependent on population size by encoding population to the radius using sqrt, where area = pi * r^2, therefore r = sqrt( area / pi ), for the data to be accurately represented
    .range([0, 30])
  
  const cities = svg
  	// VERY IMPORTANT - GROUP SELECTION IS ALWAYS BASED ON CLASSES IF CLASS IS ASSIGNED - failure to specify creates a general selection which results in data 
    .selectAll('g.city')
  	// NOTE2: due to the d3. event handling function for raising different data points on hover, data is now unordered due to selection by index (which is changed due to .raise() call in NOTE1) - selecting the data by the city allows it to select the correct one
    .data(data, (d,i) => { return d.city })
    .enter()
    .append('g')
    .attr('class', 'city')
    .attr('transform', (d, i) => {
      // d[var] notation allows for dynamic retrieval of values based on keys
      const x = scaleX(d[valueX])
      const y = scaleY(d[valueY])
      return `translate(${x}, ${y})`
    })

  cities
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 0)
    .transition()
    .duration(500)
  	// need to call d.population vs d as we are accessing a constant value within the bound parent d
    .attr('r', d => { return scaleR(d.population) })
  
  // creating tool-tips for cities on hover
  cities
  	.append('rect')
  	.attr('x', '-60')
  	// for the y position of the tool-tip, position should be based on that of circle co-ordinates in addition to styling
  	.attr('y', d => { return (-1 * scaleR(d.population) - 35) })
  	.attr('width', 120)
  	.attr('height', 30)
  
  cities
  	.append('text')
  	.attr('x', 0)
    	// for the y position of the tool-tip, position should be based on that of circle co-ordinates in addition to styling
  	.attr('y', d => { return (-1 * scaleR(d.population) - 18) })
  	.text(d => { return d.city })

  // updating svg with each successive select event (selecting options from dropdown)
  svg
    .selectAll('g.city')
    .transition(d3.ease)
    .duration(500)
    .attr('transform', (d, i) => {
      const x = scaleX(d[valueX])
      const y = scaleY(d[valueY])
      return `translate(${x}, ${y})`
    })
  
  //  NOTE1: mouseover function changes the order of the SVG groups and the data is accessed through an index. (see NOTE2).
  svg
  	.selectAll('g.city')
  	.on('mouseover', function () {
    	d3.select(this).raise()
  })
  
  // refer to https://github.com/d3/d3-axis
  // defining + applying x axis tick and grid styling
	const axisX = d3.axisBottom(scaleX)
  	.tickSizeInner(-520)
  	.tickSizeOuter(0)
  	.tickPadding(10)
  	// notation for D3 styling (including commas for 4 digits and dollar sign for cost)
  	.ticks(10, '$,f')
  
  // defining + applying x axis tick and grid styling  
  const axisY = d3.axisLeft(scaleY)
  	.tickSizeInner(-760)
  	.tickSizeOuter(0)
  	.tickPadding(10)
  	.ticks(10, '$,f')
    
  axisXGroup.call(axisX)
  axisYGroup.call(axisY)
}

// run on page load
placeCities()
// grabbing first drop down menu and assigning event listener to change (selecting options)
const selectTag1 = document.querySelector('select.dropdown1')
selectTag1.onchange = placeCities
// grabbing second drop down menu and assigning event listener to change (selecting options)
const selectTag2 = document.querySelector('select.dropdown2')
selectTag2.onchange = placeCities
