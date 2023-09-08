// selecting our form element
const formTag = document.querySelector('form')
// selecting user input box within form element
const inputTag = formTag.querySelector('input')
// selecting the span element in the legent to inject our queried text into
// NOTE: Can alternatively select using vanilla JS vs d3.select
// const nameTag = document.querySelector('span.name')
const nameTag = d3.select('span.name')

//defining svg parameters
const svg = d3.select('svg')
	.attr('viewBox', '0 0 960 540')

// defining groups to append to svg
const nameGroups = svg
	.append('g')
	.attr('class', 'paths')

// defining scale based on rank (y-variable)
// docs: https://github.com/d3/d3-scale#scalePow
const rankScale = d3.scalePow()
	.exponent(0.5)
	.domain([1, 1000])
	.range([20, 500])

// defining scale based on date (x-variable)
const dateScale = d3.scaleLinear()
	.domain([1880, 2010])
	.range([60, 915])

// defining line parameters to draw
const line = d3.line()
	// there are 10 indeces representing the 10 decades from 1880 - 2010 - this serves as the independent x-variable being measured on the line graph
	.x((d,i) => { return dateScale(1880 + i * 10 )})
// rank is being measured as the dependent y-variable for our line
	.y((d,i) => { return rankScale(d)})
	.defined(d => { return d!== 0 })
	.curve(d3.curveCardinal.tension(0.25))

// defining y-axis based on rankScale values
const rankAxis = d3.axisLeft(rankScale)
	.tickValues([1, 5, 10, 20, 40, 80, 160, 500, 10000])
	.tickPadding(4)

// defining x-axis based on dateScale values
const dateAxis = d3.axisBottom(dateScale)
	.tickFormat(d => { return d + "\'s" })
	.tickPadding(4)

// initial constant position of the lines before data is loaded (transitioning point)
const startLine = d3.line()
	.x((d,i) => { return dateScale(1880)})
	.y((d,i) => { return rankScale(d)})
	.defined(d => { return d!== 0 })
	.curve(d3.curveCardinal.tension(0.25))

//calling and appending our axis groups as defined above
svg
	.append('g')
	.attr('transform', 'translate(40, 0)')
	.call(rankAxis)

svg
	.append('g')
	.attr('transform', 'translate(0, 500)')
	.call(dateAxis)

const search = function (name) {
  // filter creates a list with the filtered objects if query exists
  // for docs, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  let results = data.filter((d,i) => {
    const testName = d.name
    // using localeCompare allows for case insenstive / symbolic string comparison without changing the strings being compared (i.e.: upper to lower)
    // for docs, see : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
    const match = testName.localeCompare(name, undefined, { sensitivity: 'base' })
		// localeCompare returns 0 for matches found (1, -1 if unmatched before or after match)
    if (match === 0) {
      return d.name
    }
  })
  
  if (results.length > 0) {
    // selecting the span name tag and updating with newly queried input
    nameTag.text(name)
    
    // creating our lines via d3 selections
    const lines = nameGroups
      .selectAll('path')
      // filtered results serve as the data to draw upon
      .data(results, d => { return d.name })

    // appending line path to svg
    lines
      .enter()
      .append('path')
      .attr('d', d => { return startLine(d.rank) })
    	.attr('class', d => { return d.sex })
    // docs for transition: https://github.com/d3/d3-transition#selection_transition
    	.style('opacity', '0')
    	.transition(d3.easeLinear)
    	.duration(1000)
    	.style('opacity', '1')
      .attr('d', d => { return line(d.rank) })
    
    // removing line paths no longer used (i.e.: when searching a new name)
    lines
    	.exit()
      .attr('d', d => { return line(d.rank) })
    	.style('opacity', '1')
      .transition(d3.easeLinear)
    	.duration(1000)
    	.style('opacity', '0')
      .attr('d', d => { return startLine(d.rank) })
      .remove()
  } 
  else {
    alert(`No results found for ${name}`)
  }
}

// running search function on pageload with default name 'Brooke'
search('Riley')

// running search function on form submit
// NOTE: formTag.addEventListener('submit', event => {}) is an alternate appropriate format
formTag.onsubmit = event => {
  // preventDefault stops default behaviour (in this case stopping the page from reloading elsewhere with the submit event)
  event.preventDefault()
  //running the search function on the inputted value
  search(inputTag.value)
  // resetting the input value string to default placeholder
  inputTag.value = ''
}
