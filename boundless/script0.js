let colors = [
  "var(--chrome)", 
  "var(--ie)", 
  "var(--firefox)", 
  "var(--safari)", 
  "var(--opera)", 
  "var(--android)"
]

let i = 0

const svg = d3.select("svg")

svg
  .attr('viewBox', '0 0 640 640')

const group = svg
	.append("g")
	.attr("transform", "translate(320, 320)")

const title = d3.select("div.month")

const updateGraph = function () {
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

  const paths = group
  	.selectAll("path")
		.data(arcData)
  
  const dateScale = d3.scaleTime()
  	.domain([new Date(2009, 0, 1), new Date(2019, 2, 1)])
  	.range([0, data.length - 1]) 	
  
  title.html(d3.timeFormat("%B %Y")(dateScale.invert(i)))
  
  paths
		.enter()
		.append("path")
	  .attr("d", arcGenerator)
  	.style("fill", (d, i) => { return colors[i] })
	  .each(function (d) { this.savedValue = d })
  
  paths
  	.transition()
  	.duration(500)
  	.ease(d3.easeLinear)
	  .attrTween("d", function (d) {
    	const startValue = this.savedValue
      const endValue = d
      
    	var curve = d3.interpolate(startValue, endValue)
      
      this.savedValue = endValue
    
    	return (t) => {
        return arcGenerator(curve(t))
      }
  	})
// 		.attr("d", arcGenerator)
}

// make something to hold a loop
let loop = null

// make something to make a loop
const startLoop = function () {
  clearInterval(loop)
  i = 0
  
  loop = setInterval(() => {
     i = i + 1
  
  	if (i >= data.length) {
    	clearInterval(loop)
  	}
  
  	updateGraph()
  }, 500)
}

// restart
document.querySelector("a.restart").addEventListener("click", function (event) {
  startLoop()
  event.preventDefault()
})

// start the loop on page load
startLoop()


	
  

