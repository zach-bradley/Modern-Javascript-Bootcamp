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
//Same as for loop in for loop
const grid = Array(row).fill(null).map(() => Array(column).fill(false));

const verticals = Array(column).fill(null).map(() => Array(row-1).fill(false));
const horizontals = Array(column-1).fill(null).map(() => Array(row).fill(false));

const startRow = Math.floor(Math.random() * row);
const startColumn = Math.floor(Math.random() * column);

const cellStep = (row, column) => {
  //If I have visited the call at [row, column], then return

  //Mark cell as visited

  //Assemble randomly-ordered list of neighbors

  //For each neighbor...

  //See if that neighbor is uot of bounds

  //If we have visited that neighbor, continue to next neighbor

  //Remove wall from horizontals or verticals
  
  //Visit that next cell

};

cellStep(startRow, startColumn);
