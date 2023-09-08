// data fed incrementally into updateGraph based on index of data.js (dynamic)
let i = 0

let colours = [
  'var(--chrome)', 
  'var(--ie)', 
  'var(--firefox)', 
  'var(--safari)', 
  'var(--opera)', 
  'var(--android)'
]

const svg = d3.select("svg")

svg
  .attr("viewBox", "0 0 640 640")
// 	.attr('width', '640')
// 	.attr('height', '640')

const pieGroup = svg
  .append("g")
  .attr("transform", "translate(320, 320)")

const monthLabel = d3.select("div.month")

// update function is called on each instance of index changing - allows for dynamic visualization based on data state; for each index a new pie chart is generated to reflect changes in data.
const updateGraph = function () {
//   // Mechanism of d3 pie charts - (1)  define a generator function that takes in raw data (2) outputs encoded data (i.e.: angles) ready to be fed into arcGenerator function
//   // pie charts are multi-step, where raw data is converted into data that the generator function inputs to draw pie charts based off encoded data
//   // see docs for pie charts: https://github.com/d3/d3-shape#pies
//   const pieGenerator = d3.pie()
//   // null sort = pie slices don't move based on size, stay in same position
//   .sort(null)
//   // want the start to go from -90 --> 90deg
//   //   	.startAngle(-0.5 * Math.PI)
//   //   	.endAngle(0.5 * Math.PI)

//   const arcData = pieGenerator(data[i])

//   // draws each individual pie slice (aka an arc)
//   // arcs require inner + outer radius fields; corner radius for rounding
//   const arcGenerator = d3.arc()
//     .innerRadius(200)
//     .outerRadius(300)
//   //   	.cornerRadius(16)
  
    const pieGenerator = d3.pie()
//   	.startAngle(-1 * Math.PI / 2)
//   	.endAngle(Math.PI / 2)06-
	  .sort(null)
  
	const arcData = pieGenerator(data[i])

	const arcGenerator = d3.arc()
	  .innerRadius(200)
	  .outerRadius(300)
//   	.cornerRadius(3)
//   	.padAngle(0.01)

  
  const paths = pieGroup
    .selectAll("path")
    .data(arcData)

//   binding data to paths that don't exist yet -> appending new paths
  paths
    .enter()
    .append("path")
    .attr('d', arcGenerator)
    .style('fill', (d, i) => { return colours[i] })
  	.each(function (d) {
    	this.savedValue = d
  })
  
  // binding data to paths that currently exist -> updating paths
  paths
  	.transition()
  	.duration(500)
  	.ease(d3.easeLinear)
  	// using function notation to capture current 'd' path in 'this'
  	.attrTween('d', function (d) {
      const startValue = this.savedValue
      const endValue = d
      console.log('initial value: ', startValue)
      console.log('end value: ', startValue)
      
      const curve = d3.interpolate(startValue, endValue)

      this.savedValue = endValue
      console.log('new initial value: ', this.savedValue)

      return function (t) {
        return arcGenerator(curve(t))
      }
  })
//     .attr('d', arcGenerator)
  
    // Storing month and passing through to update text - date format begins at January 1, 2009
  // we only want month and year for d3.timeFormat - see docs at: https://github.com/d3/d3-time-format
  const month = new Date(2009, i, 1)
  const d3Month = d3.timeFormat('%b %Y')
  const monthFormat = d3Month(month)
  monthLabel.text(monthFormat)
}

let loop = null
// initializing pie chart animation (month by month, reset from first data point)
const startLoop = function () {
  clearInterval(loop)
  i = 0
  
  loop = setInterval(function () {
    i = i + 1

    if (i >= data.length) {
      clearInterval(loop)
    } else {
      updateGraph()
    }

    // YOU IDIOT YOU CALLED THE FUNCTION TWICE WHICH WAS WHY IT WASN'T TWEENING PROPERLY - LET THIS BE A LESSON.
//     updateGraph()
  }, 500)
}

// run on page load
startLoop()

// restart
const button = document.querySelector('a.restart')

button.addEventListener('click', event => {
  startLoop()
})

