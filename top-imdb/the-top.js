const svg = d3.select('svg')

// updating data to append additional difference key:value
data = data.map((d,i) => {
  d.difference = d.imdb - d.metascore // no abs value as we want to examine if data skews towards imdb or metascore (+ve to -ve)
  return d
})
// drawing our SVG
svg
	.attr('viewBox', `0 0 960 ${data.length * 40}`)

// defining scales
const scoreScale = d3.scaleLinear()
	.domain([0,100])
	.range([420, 900])

// defining area to draw
const area = d3.area()
	.x0(d => { return scoreScale(d.imdb) })
	.x1(d => { return scoreScale(d.metascore) })
	.y0((d,i) => { return 40 * i + 20 })
	.y1((d,i) => { return 40 * i + 20 })

// drawing area path to svg
const areaPath = svg
	.append('path')
	.datum(data)
	.attr('d', area)
	.attr('class', 'graph-area')

// defining d attribute of line path to svg
const imdbLine = d3.line()
	.x(d => { return scoreScale(d.imdb) })
	.y((d,i) => { return 40 * i + 20 })

const metascoreLine = d3.line()
	.x(d => { return scoreScale(d.metascore) })
	.y((d,i) => { return 40 * i + 20 })

// appending path to entire SVG - NOT GROUPS
const imdbPath = svg
	.append('path')
	.datum(data)
	.attr('d', imdbLine)
	.attr('class', 'imdb-path')

const metascorePath = svg
	.append('path')
	.datum(data)
	.attr('d', metascoreLine)
	.attr('class', 'metascore-path')

// drawing our svg graph
const movies = svg
	// ALWAYS selectAll!!! otherwise the groups append to end of body (and not to SVG)
	// operates similarly to for loop append --> (selectAll)
  .selectAll('g.movie')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'movie')
  .attr('transform', (d, i) => { return `translate(0, ${i * 40})` })

// background hover highlight for each movie group
movies
	.append('rect')
	.attr('x', '0')
	.attr('y', '0')
	.attr('width', '960')
	.attr('height', '40')
	.attr('class', 'item-bg')

// adding title
movies
  .append('text')
	.attr('x', '90')
	.attr('y', '20') // half of 40 is 20
	.attr('class', 'title')
  .text(d => { return d.title })

// adding year of release
movies
	.append('text')
	.attr('x', 24)
	.attr('y', 20)
	.attr('class', 'year')
	.text(d => { return d.year })

// adding data points for IMDB + metascore scores
movies
	.append('circle')
	.attr('cx', d => { return scoreScale(d.imdb) })
	.attr('cy', 20)
	.attr('r', 8)
	.attr('class', 'imdb-score')

movies
	.append('circle')
	.attr('cx', d => { return scoreScale(d.metascore) })
	.attr('cy', 20)
	.attr('r', 8)
	.attr('class', 'metascore-score')

// adding score text labels to each data point
movies
	.append('text')
	.attr('x', (d, i) => {
    if (d.difference > 0 ) {
      return scoreScale(d.imdb) + 15
    } 
    else {
      console.log(scoreScale(d.imdb))
    	const position = scoreScale(d.imdb) - 15
      console.log(position)
      return position
    }
  })
	.attr('y', '20')
	.text(d => { return d.imdb })
	.attr('class', 'imdb')
	.style('text-anchor', (d, i) => {
    if (d.difference > 0 ) {
      return 'start'
    } 
    else {
      return 'end'
    }
	})

movies
	.append('text')
	.attr('x', (d, i) => {
  	if (d.difference > 0 ) {
      return scoreScale(d.metascore) - 15
    } 
  else if (d.difference <= 0) {
      return scoreScale(d.metascore) + 15
    }
})
	.attr('y', '20')
	.text(d => { return d.metascore })
	.attr('class', 'metascore')
	.style('text-anchor', (d, i) => {
  	if (d.difference > 0 ) {
      return 'end'
    } else if (d.difference <= 0) {
      return 'start'
    }
})

/* NOTE: UNABLE TO CALL FUNCTION AND PASS IN ARGUMENT THROUGH EVENT CHANGES SEE UPDATED FUNCTION BELOW */
// const selector = function (option) {
//   // sorting data.js based on dropdown tag value
//   // see docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
//   console.log(option)
//   data.sort((a,b) => {
//     return d3.descending(a.option, b.option)
//     console.log(data)
//   })
// //   if (option === 'title' || option === 'year') {
// //     data.sort((a,b) => { 
// //       return d3.ascending(a.option, b.option)
// //     })
// // 	} 
// //   else {
// //     data.sort((a,b) => {
// //       return d3.descending(a.option, b.option)
// //     })
// //   }
//   // 
//   movies
//   	.data(data, d => { return d.title })
//   	.transition()
//   	.duration(1000)
//   	.attr('transform', (d, i) => { return `translate(0, ${i * 40})` })
//   } 
// calling selector with selected option value.
// selectTag.onchange = selector(selectTag.value)

// UPDATED FUNCTION ONCHANGE
/* for select, input, textarea, can set up event listener in form of addEventListener ( x, event => {} ) OR onchange. */
/* see docs here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event */
const selectTag = document.querySelector('select')
selectTag.onchange = function () {
  // sorting data.js based on dropdown tag value
  // see docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  const option = selectTag.value
  /* NOTE: FOR DYNAMIC VALUES, NEED TO FOLLO x[key] NOTATION VS x.key TO ACCESS VALUES*/
  // adapted from: https://stackoverflow.com/questions/922544/using-variable-keys-to-access-values-in-javascript-objects
  // title and year sorted in ascending order (oldest to newest; 123/a to z)
  data.sort((a,b) => {
    if (option === 'title' || option === 'year') {
      return d3.ascending(a[option], b[option])
    } 
    // scores sorted in descending order
    else {
      return d3.descending(a[option], b[option])
    }
  })
  // adding a transition by binding the updated data.js, as sorted by dropdown option, to existing elements
  movies
  	.data(data, d => { return d.title })
  	.transition()
  	.duration(1000)
  	.attr('transform', (d, i) => { return `translate(0, ${i * 40})` })
  
  imdbPath
    .datum(data, d => { return d.title })
    .transition()
    .duration(1500)
    .attr('d', imdbLine)
  
  metascorePath
    .datum(data, d => { return d.title })
    .transition()
    .duration(1500)
    .attr('d', metascoreLine)
  
  areaPath
  	.datum(data, d => {return d.title })
  	.transition()
  	.duration(1500)
  	.attr('d', area)
  } 







