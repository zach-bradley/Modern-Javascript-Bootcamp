const { Engine, Render, Runner, World, Bodies} = Matter;

const width = 600;
const height = 600;

const cells= 8;

const unitLength = width / cells;

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
  Bodies.rectangle(width / 2, 0, width, 5, {isStatic: true}),
  Bodies.rectangle(width / 2, height, width, 5, {isStatic: true}),
  Bodies.rectangle(0, height / 2, 5, height, {isStatic: true}),
  Bodies.rectangle(width, height / 2, 5, height, {isStatic: true}),
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
const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));

const verticals = Array(cells).fill(null).map(() => Array(cells-1).fill(false));
const horizontals = Array(cells-1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const cellStep = (row, column) => {
  //If I have visited the call at [row, column], then return
  if (grid[row][column]) {
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
    if (
      nextRow < 0 || 
      nextRow >= cells || 
      nextColumn < 0 || 
      nextColumn >= cells
     ) {
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
    } else if(direction === 'up') {
      horizontals[row-1][column] = true;
    } else if (direction === 'down') {
      horizontals[row][column] = true;
    }
    //Visit that next cell
    cellStep(nextRow, nextColumn);
  }
};

cellStep(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      5,
      {
        isStatic: true
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      5,
      unitLength,
      {
        isStatic: true
      }
    );
    World.add(world, wall);
  });
});

//Goal

const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength / 2,
  unitLength / 2,
  {
    isStatic: true,
    fill: 'green'
  }
);

World.add(world, goal);

//Ball

const ball = Bodies.circle(
  unitLength / 2,
  unitLength / 2,
  unitLength / 4,
  {
    isStatic: true
  }
);

World.add(world, ball);
