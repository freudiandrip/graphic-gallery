// defining scales, constants, helper functions
// function that finds the temperature range for list of location objects
function tempDomain(locations) {
  const minList = []
  const maxList = []

  locations.forEach( location => {
    const temperatures = location.tempsC
    const max = Math.max(...temperatures)
    const min = Math.min(...temperatures)

    maxList.push(max)
    minList.push(min)
  })
  const tempMin = Math.min(...minList)
  const tempMax = Math.max(...maxList)
  const domain = [tempMin, tempMax]

  return domain
}

// sorting temperatures in ascending order to be encoded in colorScale as the domain
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort for docs on .sort() method
const minTemp = tempDomain(data)[0]
const maxTemp = tempDomain(data)[1]
const temps = [minTemp, maxTemp, -1, 7, 15, 23].sort((a, b) => { return a - b })

//creating linear encoding scale for temperature data in celcius
// from content.txt: -10 #814ee7; 0 #3f24ec; 7 #79e87C; 14 #fbe157; 21 #ff9737; 25 #fe3b3b
const colorScale = d3
  .scaleLinear()
  .domain(temps)
  .range(['#814ee7', '#3f24ec', '#79e87C', '#fbe157', ' #ff9737', '#fe3b3b'])

// box scale for positioning of our paths and circles
const boxScale = d3.scaleLinear()
	.domain([(minTemp - 12), (maxTemp + 12)])
	// reversing the range for display purposes- the lower the temperature, the lower it should be positioned from 150 -> 0 
	.range([150, 0])

// linear scale for converting celsius to farenheit
const unitScale = d3.scaleLinear()
	.domain([-100, 100])
	.rangeRound([-148, 212])

// function to generate line of best fit for temperature data (as svg path)
const lineGenerator = d3.line()
	// in the x direction: line is positioned at 25 px + 50px per each successive index point within the monthData group
	.x((d,i) => { return 25 + 50 * i })
// boxScale encodes the y position to the correct range
	.y((d,i) => { return boxScale(d) })

//
// D3 portion of code

// selecting the svg tag within document
const svg = d3.select('svg')
// assigning a width and dynamic height based on data points in data.js
svg
	.attr('viewBox', `0 0 800 ${data.length *150}`)

// creating a data group for each location and appending it to the svg (so in this case, 10 data points for the 10 cities)
const locationData = svg
  .selectAll('g.data-pt')
  // selecting the data variable in data.js
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'data-pt')
  .attr('transform', (d, i) => {
    return `translate(0, ${i * 150})`
  })

// adding a city text label + class per location group
locationData
  .append('text')
  .attr('x', 175)
  .attr('y', 70)
  .attr('class', 'city')
  .text((d, i) => { return d.city })

// adding a country text label + class per location group
locationData
  .append('text')
  .attr('x', 175)
  .attr('y', 92)
  .attr('class', 'country')
  .text((d, i) => { return d.country })

// within each location data point, create a subgroup that encompasses the annual temperature data per city
const yearData = locationData
  .append('g')
  .attr('class', 'year')
  .attr('transform', 'translate(200, 0)')
  .style('fill', '#ffffff')

// create a monthly temperature data subgroup, for each of the 12 months in the yearly temperature group per location
const monthData = yearData
  .selectAll('g.month')
	// selecting group --> joining it to data in tempsC
	// working data is in celsius
  .data( d => { return d.tempsC })
  .enter()
  .append('g')
  .attr('class', 'month')
	// each successive month group is translated by 50px horizontally
  .attr('transform', (d, i) => { return `translate( ${i * 50}, 0)` })

// creating a colorScaled filled rect per each month of location
monthData
  .append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', 50)
  .attr('height', 150)
  .style('fill', d => { return colorScale(d) })

// appending circle with temperature text element
monthData
  .append('circle')
  .attr('cx', 25)
  .attr('cy', d => { return boxScale(d) })
  .attr('r', 15)
  .style('fill', '#ffffff')

const tempValues = monthData
	.append('text')
	.attr('class', 'temperature')
  .attr('x', 25)
  .attr('y', (d,i) => { return (boxScale(d) + 2) })
  .text((d,i) => { return d })
	.style('fill', (d,i) => { return colorScale(d) })

// passing data to draw path in the tempData section of svg (average monthly temps over a year)
yearData
	.append('path')
	// datum function assigns a path to each individual point AKA the datum based on the discrete monthly temperature (i.e.: temperature in January for New York) from data.js. So really a path is being drawn per datum point vs over the entire data set.
	// where data point is average monthly temperature for each city; data set is list of monthly temperatures
	.datum( d => { return d.tempsC })
	// d.monthlyTemps taken from datum() function immediately passed into .attr field as d; lineGenerator generates line path for particular data point
	.attr('d', (d,i) => { return lineGenerator(d) })


// defining a function to convert temps in C to F
const tempConverter = event => {
  console.log("Temperature currently in: " + event.target.value)
  
  if (event.target.value === "c") {
    // binding data to the tempValues selection (the group containing our temperature text)
    tempValues
      .data( function Celsius(d) { return d.tempsC })
      .text( d => { console.log(d); return d })
  }
  
	// method (1) for assigning data as seen in course videos (converting C to F using unitScale)
//   else if (event.target.value === "f") {
//     tempValues.text((d,i) => { return unitScale(d) }) 
//   }
  
  // method (2) for assigning F temps using tempsF key:values found in data.js
  else {
    tempValues
       // binding data to the tempValues selection (the group containing our temperature text)
      .data( function Farenheit(d) { return d.tempsF })
      .text( d => { console.log(d); return d })
  }
}

// assigning a listener for the drop down 
// when farenheit or celsius is selected, run tempCoverter
const selectTag = document.querySelector('select')
selectTag.addEventListener('input', tempConverter)


