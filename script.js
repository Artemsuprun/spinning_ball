//
//  File Name:    script.js (for ball)
//  Author:       Artem Suprun
//  Date:         07/17/2023
//  Description:  A script containing code that renders a
//                  3D ball in a 2D js canvas.
//

const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");
let width = canvas.offsetWidth;
let height = canvas.offsetHeight;

// Function for reseting the width and height variables
// when the user resizes the screen.
function onResize() {
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  // to check if the pixelratio is over 1, if so render the canvas
  // twice as big to make it sharper.
  if (window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2;
    canvas.height = canvas.clientHeight * 2;
    ctx.scale(2, 2);
  } else {
    canvas.width = width;
    canvas.height = height;
  }
}
// to make sure the size is correct
onResize();
// listen to resize event
window.addEventListener("resize", onResize);

// Variables for perspective
let PERSPECTIVE = width * 0.8;
let PROJECTIONX = width / 2;
let PROJECTIONY = height / 2;
let GLOBE_RADIUS = width / 4;
// To store  the particals
const dots = [];
// Class for the particals
class Partical {
  constructor() {
    this.theta = Math.random() * 2 * Math.PI;
    this.phi = Math.acos((Math.random() * 2) - 1);
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.radius = 10;
    this.color = "black";
    this.xProjected = 0;
    this.yProjected = 0;
    this.scaleProjected = 0;
    this.vol = 0.005;
  }
  project() {
    this.x = GLOBE_RADIUS * Math.sin(this.phi) * Math.cos(this.theta);
    this.y = GLOBE_RADIUS * Math.cos(this.phi);
    this.z = GLOBE_RADIUS * Math.sin(this.phi) * Math.sin(this.theta) + GLOBE_RADIUS;
    
    this.scaleProjected = PERSPECTIVE / (PERSPECTIVE + this.z);
    this.xProjected = (this.x * this.scaleProjected) + PROJECTIONX;
    this.yProjected = (this.y * this.scaleProjected) + PROJECTIONY;
  }
  draw() {
    this.theta += this.vol;
    this.project();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.abs(1 - this.z / width);
    ctx.beginPath();
    //ctx.fillRect(this.xProjected - this.radius, this.yProjected - this.radius, this.radius * 2 * this.scaleProjected, this.radius * 2 * this.scaleProjected);
    ctx.arc(this.xProjected, this.yProjected, this.radius * this.scaleProjected, 0, Math.PI * 2);
    ctx.fill();
  }
  resetPos() {
    this.phi = Math.acos((Math.random() * 2) - 1);
  }
}

// variables for extra control features.
colors = [
  ["#D93636", "#A62E2E", "#732424", "#262626", "#0D0D0D"],
  ["#295FA6", "#80DDF2", "#F2E5A0", "#F25041", "#733630"],
  ["#042940", "#005C53", "#9FC131", "#DBF227", "#D6D58E"],
  ["#D4C2AD", "#D7A184", "#EFDFCC", "#BA8E7A", "#66796B"],
  ["#3A356E", "#4F81F7", "#00F4CC", "#EFB7FF", "#F5F549"],
  ["#68A8B0", "#DE5047", "#444850", "#777D79", "#62A887"],
  ["#1A0E3E", "#1F1A70", "#DB488B", "#FF83F6", "#3ED0EB"],
  ["#0D0B0C", "#BF930F", "#A64B17", "#8C2323", "#F24949"],
  ["#F2C2CF", "#F1F2D5", "#F2BE5C", "#F29057", "#F27141"],
  ["#B4D8F2", "#F3FAFE", "#C9E0DD", "#99BEB6", "#E08C67"],
  ["#F2F2F2", "#D9D9D9", "#8C8C8C", "#595959", "#404040"],
  ["#AA1F23", "#1D2D62", "#001E5A", "#A60006", "#F5F6F8"],
  ["#A67F5D", "#8C6046", "#BF947A", "#402116", "#734434"],
  ["#F2D8DC", "#F2BDCB", "#8C7279", "#F2CED8", "#594D4D"],
  ["#035AA6", "#97BF04", "#F2CB05", "#F28705", "#F24405"]
]
let rand;
// controls for the ball such as, reseting the phi cord and
// increasing and decreasing the speed at which the globe spins.
window.addEventListener("keydown", function(e) {
  if (e.keyCode === 32 || e.key === " " || e.code === "Space") {
    let newRand = Math.floor(Math.random()*colors.length);
    if (newRand === rand) {
      newRand = (newRand + 1) % colors.length;
    }
    rand = newRand;
    for (let i = 0; i < dots.length; i++) {
      //dots[i].reset();
      dots[i].color = colors[rand][(i % colors[rand].length)];
    }
  }
  else if (e.keyCode === 39) {
    for (let i = 0; i < dots.length; i++) {
      dots[i].vol += 0.001;
    }
  }
  else if (e.keyCode === 37) {
    for (let i = 0; i < dots.length; i++) {
      dots[i].vol -= 0.001;
    }
  }
});

for (let i = 0; i < 800; i++)
{
  dots.push(new Partical());
}

function draw() {
  //ctx.clearRect(0, 0, width, height);
  //ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#151922";
  ctx.fillRect(0, 0, width, height);
  /*
  ctx.font = "40px Arial";
  ctx.fillStyle = "White";
  ctx.textAlign = "center";
  ctx.fillText("Hit Spacebar", width/2, height/2 - height/40);
  ctx.fillText("Hit left and right arrow keys", width/2, height/2 + height/40);
  */
  dots.sort((dot1, dot2) => {
    return dot1.scaleProjected - dot2.scaleProjected;
  });
  for (let i = 0; i < dots.length; i++) {
    dots[i].draw();
  }
  
  window.requestAnimationFrame(draw);
}

draw();
