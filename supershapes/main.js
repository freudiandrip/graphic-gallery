// NOTE /////////////////////////////////////////////////////////////////////////////
// duplicate fn adapted from: https://stackoverflow.com/questions/1877475/repeat-a-string-in-javascript-a-number-of-times
/////////////////////////////////////////////////////////////////////////////////////
//duplicate function takes in a destination div, and the final n value of objects we want to end up with
const duplicate = (element, n) => {
  // taking out STRING type content of interest inside div element (must be typeof STR)
  const object = element.innerHTML
  const content = object.repeat(n)
  element.innerHTML = content
}

// selecting our individual cross svg from div
const crossDiv = document.querySelector('#crosshairs')
// duplicating our cross svg 10 times calling duplicate fn
duplicate(crossDiv, 10)

// rotating cross 360deg animation using anime.js object
const cross360 = anime({
  targets: '.crosshairs path',
  rotate: '1turn',
  // applying function to delay: takes in el, index of el, and list of el
  delay: (el, index, l) => index * 100,
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutSine'
})

// tunnel animation from anime.js object
const tunnel = anime({
  // CSS selectors
  targets: '#tunnel circle',
  // scaling effect of our circles by 20%
  scale: 1.1,
  // this alternates the animation to return to initial state
  direction: 'alternate',
  // infinite animation looping
  loop: true,
  duration: 250,
  // easing effects create a more realistic effect in animations (vs just linear)
  easing: 'easeInOutSine',
  // applying a function, where successive delay for each individual element based on index which creates a staggered animation effect for each circle in list (takes in element, index of element)
  // in modern JS, writing an arrow function that points to object being returned removes the 'return' declaration in writing functions
  delay: (el, index) => index * 50
})

// conveyor belt animation effect using anime.js object
const conveyor = anime({
  targets: '.conveyor',
  // translating left by half the width of the 200% container
  translateX: '-50%',
  duration: 1500,
  loop: true,
  // consistently smooth animation speed
  easing: 'linear',
  autoplay: true
})

// grabbing the SVG path from the zigzag div id
const zigPath = document.querySelector('#zigzag path')
// using anime setDashOffset to figure out length of path
const zigOffset = anime.setDashoffset(zigPath)
// essentially, stroke-dashoffset defines the offset in the rendering of a dash array (which includes SVG objects)
// more at: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dashoffset
zigPath.setAttribute('stroke-dashoffset', zigOffset)
// zigzag path animation using anime.js object
const zigzag = anime({
  targets: zigPath,
  // initializing offset at
  strokeDashoffset: [0, zigOffset],
  duration: 3000,
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutSine',
  // need to include autoplay: true as animation is not run by default without it
  autoplay: true
})

// using the same animating effect from zigzagPath (except initializing from beginning of path --> end of path)
const wavePath = document.querySelector('#wave path')
const waveOffset = anime.setDashoffset(wavePath)
wavePath.setAttribute('stroke-dashooffset', waveOffset)
// sinusoidal wave animation via anime.js object
const wave = anime({
  targets: wavePath,
  strokeDashoffset: [0, waveOffset],
  duration: 2000,
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutSine',
  autoplay: true
})

// grabbing our first tile to copy
const templatePixel = document.querySelector('.pixels')
// calling our duplicate function
duplicate(templatePixel, 40)
// rotating animation applied using anime.js
const pixelate = anime({
  targets: '.pixel',
  rotate: (el, i) => anime.random(60, 360),
  duration: (el, i) => anime.random(250, 750),
  loop: true,
  easing: 'easeInOutSine',
  direction: 'alternate',
  autoplay: true
})

// essentially the same concept as the tiles, code adapted from above
// grabbing our first dot to copy
const templateDot = document.querySelector('.dots')
// calling our duplicate function
duplicate(templateDot, 20)
// staggered fade-in/out animation anime.js object
const fadeDot = anime({
  targets: '.dot',
  scale: [0, 1.2],
  delay: (el, i) => i * 100,
  duration: 250,
  loop: true,
  easing: 'easeInOutCubic',
  direction: 'alternate',
  autoplay: true
})

// tile flash sequence animation anime.js object
const tileFlash = anime({
  targets: '.tiles .tile',
  // colours are put into an array and are looped through using indeces via anonymous arrow function
  backgroundColor: (tile, index) => ['#fff636', '#cb89fc', '#fc3035', '#77ebfd'][index],
  // apply a random delay to each tile
  delay: (tile, index) => anime.random(50, 100),
  duration: 750,
  loop: true,
  direction: 'alternate',
  easing: 'easeInOutSine'
})

// square tunnel animation using anime.js object
// NOTE: when JS applies a transform, it overrides existing transforms in the CSS - this includes scale, rotate, translate, etc. properties for transform. Re-assigning the initial transform: translate styles in the CSS in the translateX/Y properties below
const squareTunnel = anime({
  targets: '.squares rect',
  // forcing the translate position to center the squares
  translateX: ['-50%', '-50%'],
  translateY: ['-50%', '-50%'],
  // range of rotation
  rotate: [45, 0, -45],
  // staggering the rotation of each successive square moving from inner to outer
  delay: (el, i) => 100 * i,
  // creates smoother rotating effect when a constant 750ms delay is assigned to each element by indeces
  duration: (el, i) => 750,
  loop: true,
  easing: 'easeInOutSine',
  direction: 'alternate'
})

// NOTE /////////////////////////////////////////////////////////////////////////////
// play / pause documentation: https://animejs.com/documentation/#playPause
// fns adapted from: https://stackoverflow.com/questions/54261806/how-to-make-multiple-animejs-animations-play-using-onclick
/////////////////////////////////////////////////////////////////////////////////////
// compiling all animations into an array
let animations = [
  tunnel,
  cross360,
  conveyor,
  zigzag,
  wave,
  pixelate,
  fadeDot,
  tileFlash,
  squareTunnel
]
// selecting the play / pause buttons from document
const playTag = document.querySelector('#play')
const pauseTag = document.querySelector('#pause')
// const slowTag = document.querySelector('.slow svg')

// defining playAll fn when applied, plays all anime defined animations
const playAll = event => {
  //   // tried with map....why does it not work?
  //     const played = animations.map(x => animation.play())

  // executing the play() fn for each anime object in the array
  animations.forEach(animation => {
    animation.play()
  })
}

// defining slowAll fn when applied, multiplies the duration of the animation by 1.5
// const slowAll = event => {

//   // applying a factor of 1.5 to each object duration value in the array
//   animations.forEach(animation => {
//     animationLength = animation.duration

//     animation.duration = animationLength * 1.5
//   })
// }

// defining stopAll fn when applied, stops all anime defined animations
const pauseAll = event => {
  //   // tried with map....why does it not work?
  //   const stop = animations.map(x => animation.pause())

  // executing the pause() fn for each anime object in the array
  animations.forEach(animation => {
    animation.pause()
  })
}
// assigning the execution of playAll + stopAll to click events for each respective button
playTag.onclick = playAll
pauseTag.onclick = pauseAll
// slowTag.onclick = slowAll
