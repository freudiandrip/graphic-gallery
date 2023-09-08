// svg loading before dataset load
const svg = d3.select('svg')
//parameters in viewBox correspond to 'top left width height'
svg.attr('viewBox', '0 0 960 320')

// API
const url = 'https://api.superhi.com/api/stocks/aapl'
// static file
// const url = "1y.json"

d3.json(url).then(function (data) {
  // refer for docs: https://github.com/d3/d3-time-format#locale_format
  // On using a parser vs formatting: https://www.educative.io/answers/what-is-a-d3-time-format 
  // essentially taking in string --> parsing to output date object
  const dateParse = d3.timeParse('%Y-%m-%d')
  
  // extracting and processing raw data from JSON
  data = data.map((d,i) => {
    return { close: d.close, date: dateParse(d.date) }
  })
  
  // ALWAYS INPUT the data when performing d3 functions
  const minDate = d3.min(data, d => { return d.date })
  const maxDate = d3.max(data, d => { return d.date })

  const minClose = d3.min(data, d => { return d.close })
  const maxClose = d3.max(data, d => { return d.close })
  
  const dateScale = d3.scaleTime()
  	.domain([minDate, maxDate])
  	.range([60, 900])
  
  const closeScale = d3.scaleLinear()
  	.domain([minClose, maxClose])
  	.range([280, 60])
  
  const line = d3.line()
  	.x(d => { return dateScale(d.date) })
  	.y(d => { return closeScale(d.close) })
  
  // for docs: https://github.com/d3/d3-shape#areas
	const area = d3.area()
  	.x0(d => { return dateScale(d.date) })
  	.x1(d => { return dateScale(d.date) })
  	// adding 10 pixels from the bottom of the svg to pad area for visual effect
  	.y0(d => { return closeScale(minClose) + 10 })
  	.y1(d => { return closeScale(d.close) })
  
  svg
  	.append('path')
  	// path is single object (call datum) but dependent on multiple data points (takes in data)
  	.datum(data)
  	.attr('class', 'area')
  	.attr('d', area)
  
  // order matters in the sequence of adding objects (we want our line to be on top of area)
  svg
  	.append('path')
  	.datum(data)
  	.attr('class', 'line')
  	.attr('d', line)
  
  hoverGroup = svg
  	.append('g')
//   	.attr('transform', 'translate(100, 100)')
  
  hoverGroup
  	.append('rect')
  	.attr('x', -50)
  	.attr('y', -60)
  	.attr('width', '100')
  	.attr('height', '50')
  
    hoverGroup
      .append('circle')
      .attr('x', 0)
      .attr('cy', 0)
      .attr('r', '7')
  
  // want to store these in a variable to call + iterate over data
  const closeText = hoverGroup
  	.append('text')
    .attr('class', 'close')
  	.attr('x', 0)
  	.attr('y', -18)
//   	.text('hi')
  
   const dateText = hoverGroup
  	.append('text')
   	.attr('class', 'date')
  	.attr('x', 0)
  	.attr('y', -37)
  	.text('date')
  
   // see docs for selecting DOM elements using D3: https://github.com/d3/d3-selection#selection_on
   //moz dev event reference docs: https://developer.mozilla.org/en-US/docs/Web/Events
  svg
    .on('mousemove', function () {
    // want to find position on SVG THEN want to update text accordingly
    // NOTE: this refers to the implicit captured element (in this case the svg is the container called on svg.on )
    const mouse = d3.mouse(this)
    // NOTE MOUSE IS LEGACY - refer to docs for d3.pointer: https://github.com/d3/d3-selection#pointer
    // mouse[0] is x position; mouse[1] is y. We only care about the X position since the tooltip is moving horizontally on hover
    const mouseX = mouse[0]
//     const mouseY = closeScale.invert(this.close)
    // scale.invert inverts the output by switching domain --> range; vice versa
    // this allows us to obtain a date based on encoded output from range
    const mouseDate = dateScale.invert(mouseX)
    // for docs, refer to: https://github.com/d3/d3-array#bisector
    const bisector = d3.bisector((d) => { return d.date }).right
    // splitting our array into 2 based on the provided point, which is the mouse Date; i represents the datapoint index within the dataset
    const i = bisector(data, mouseDate)
    const dataPoint = data[i]
    
    if (dataPoint) {
      const x = dateScale(dataPoint.date)
      const y = closeScale(dataPoint.close)
      const timeFormat = d3.timeFormat('%Y-%m-%d')
      
      closeText.text(dataPoint.close)
      dateText.text(timeFormat(dataPoint.date))

      hoverGroup
        .attr('transform', `translate(${x}, ${y})`)
        .style('opacity', '1')
    }

  })
  
  // getting the tooltip to disappear using opacity
  // could also translate outside of window
  svg.on('mouseout', function () {
    hoverGroup
    	.style('opacity', '0')
  })
  
  
   
   
}) 






