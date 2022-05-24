const WORLD_WIDTH = 75;
const WORLD_HEIGHT = 75;
const CELL_SIZE = 10;

let now = [];
let controls;
let lastX = null;
let lastY = null;
let drawing = false;
let time = 0;

let params = {
  frame: 0,
  running: false, 
  speed: 5
};

//======================================================================
// P5 Handlers
//======================================================================
function setup() {
  createCanvas(WORLD_WIDTH * CELL_SIZE, WORLD_HEIGHT * CELL_SIZE);
  // frameRate(5);

  now = new_world();
  next = new_world();

  controls = new Tweakpane();
  controls.addMonitor(params,'frame', {});
  controls.addMonitor(params,'running', {});

  controls.addInput(params, 'speed', {min: 1, max: 60});

  controls.addButton({title:'Step'}).on('click', step_game);
  controls.addButton({title:'Run'}).on('click', run_game);
  controls.addButton({title:'Stop'}).on('click', stop_game);
  controls.addButton({title:'Reset'}).on('click', reset_game);

}

function draw() { 
  // update game logic
  time += 1;
  if (params.running && ((time % floor(params.speed)) == 0)) {
    next_frame();
  }

  // draw state
  background(220);
  noStroke();

  for ([y,row] of now.entries()) {
    for ([x,state] of row.entries()) {
      draw_cell(x,y,state);
    }
  }
}

function current_cell() {
  let x = Math.floor(mouseX / CELL_SIZE);
  let y = Math.floor(mouseY / CELL_SIZE);
  return [x,y];
}

function mouseClicked() {
  [lastX, lastY] = current_cell();
  drawing = !now[lastY][lastX];
  now[lastY][lastX] = drawing;

}

function mouseDragged() {
  [x, y] = current_cell();
  
  if (x != lastX || y != lastY) {
    lastX = x
    lastY = y
    now [y][x] = drawing;
  }
}

function mouseUp() {
  lastX = null;
  lastY = null;
}

//======================================================================
// Logic
//======================================================================
function new_world() {
  world = []
  for (let y = 0; y < WORLD_HEIGHT; y++) {
    let row = Array(WORLD_WIDTH).fill(0);
    world.push(row);
  }
  return world;
}

function count_neighbors(x,y) {
  let count = 0;
  let ww = WORLD_WIDTH - 1;
  let wh = WORLD_HEIGHT - 1;
  let bx = (x-1 + WORLD_WIDTH) % WORLD_WIDTH
  let ax = (x+1) % WORLD_WIDTH
  let by = (y-1 + WORLD_HEIGHT) % WORLD_HEIGHT
  let ay = (y+1) % WORLD_HEIGHT

  if (now[by][bx])
    count += 1;
  if (now[by][x])
    count += 1; 
  if (now[by][ax])
    count += 1;
  if (now[y][bx])
    count += 1;
  if (now[y][ax])
    count += 1;
  if (now[ay][bx])
    count += 1;
  if (now[ay][x])
    count += 1;
  if (now[ay][ax])
    count += 1;
  
  return count;
}

function next_frame() {
  params.frame += 1;
  
  for ([y,row] of now.entries()) {
    for ([x,state] of row.entries()) {
      n = count_neighbors(x,y)
      if ((n == 3) || (n ==2 && state)) {
        next[y][x] = 1;
      }
      else {
        next[y][x] = 0;
      }
    }
  } 

  [next, now] = [now, next];
}

function step_game() {
  stop_game();
  next_frame();
}

function run_game() {
  console.log('Running')
  params.running = true;
}

function stop_game() {
  console.log('Stopping')
  params.running = false;
}

function reset_game() {
  console.log('Reseting')
  stop_game();
  now = new_world();
}

//======================================================================
// Drawing
//======================================================================
function draw_cell(x,y,state) {
  if (state == 1) {
    fill('#800080');
  }
  else {
    fill('#fff');
  }
  square(x*CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1);
}