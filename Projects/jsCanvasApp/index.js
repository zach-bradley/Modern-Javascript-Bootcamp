const { Engine, Render, Runner, World, Bodies} = Matter;

const width = 600;
const height = 600;

const row = 3;
const column = 3;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

const walls = [
  //Walls adjust based on width and height
  Bodies.rectangle(width / 2, 0, width, 20, {isStatic: true}),
  Bodies.rectangle(width / 2, height, width, 20, {isStatic: true}),
  Bodies.rectangle(0, height / 2, 20, height, {isStatic: true}),
  Bodies.rectangle(width, height / 2, 20, height, {isStatic: true}),
];

World.add(world, walls);

//Maze generation
const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

//Same as for loop in for loop
const grid = Array(row).fill(null).map(() => Array(column).fill(false));

const verticals = Array(column).fill(null).map(() => Array(row-1).fill(false));
const horizontals = Array(column-1).fill(null).map(() => Array(row).fill(false));

const startRow = Math.floor(Math.random() * row);
const startColumn = Math.floor(Math.random() * column);

const cellStep = (row, column) => {
  //If I have visited the call at [row, column], then return
  if (grid[row][column] === true) {
    return;
  }

  //Mark cell as visited
  grid[row][column] = true;

  //Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row-1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left']
  ]);

  //For each neighbor...
  for (let neighbor of neighbors) { 
    const [nextRow, nextColumn, direction] = neighbor;

    //See if that neighbor is out of bounds
    if (nextRow < 0 || nextRow >= row || nextColumn < 0 || nextColumn >= column) {
      continue;
    }
    
    //If we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }
  
    //Remove wall from horizontals or verticals
    if (direction === 'left') {
      verticals[row][column-1] = true;
    } else if (direction === 'right') {
      verticals[row][column] = true;
    }
  }
  //Visit that next cell

};

cellStep(startRow, startColumn);

