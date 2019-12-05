const start = (ceHo, ceVe) =>{  
  const { Engine, Render, Runner, World, Bodies, Body, Events} = Matter;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const cellsHorizontal = ceHo;
  const cellsVertical = ceVe;

  const unitLengthX = width / cellsHorizontal;
  const unitLengthY = height / cellsVertical;

  const engine = Engine.create();
  engine.world.gravity.y = 0;

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
  const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

  const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal -1).fill(false));
  const horizontals = Array(cellsVertical -1).fill(null).map(() => Array(cellsHorizontal).fill(false));

  const startRow = Math.floor(Math.random() * cellsVertical);
  const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
        nextRow >= cellsVertical || 
        nextColumn < 0 || 
        nextColumn >= cellsHorizontal
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
        columnIndex * unitLengthX + unitLengthX / 2,
        rowIndex * unitLengthY + unitLengthY,
        unitLengthX,
        5,
        {
          isStatic: true,
          label: 'wall',
          render: {
            fillStyle: 'yellow'
          }
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
        columnIndex * unitLengthX + unitLengthX,
        rowIndex * unitLengthY + unitLengthY / 2,
        5,
        unitLengthY,
        {
          isStatic: true,
          label: 'wall',
          render: {
            fillStyle: 'yellow'
          }
        }
      );
      World.add(world, wall);
    });
  });

  //Goal
  const goalSize = Math.min(unitLengthX, unitLengthY) / 2;
  const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    goalSize,
    goalSize,
    {
      isStatic: true,
      render: {
        fillStyle: 'green'
      },
      label: 'goal'
    }
  );

  World.add(world, goal);

  //Ball

  const ballRadius = Math.min(unitLengthX, unitLengthY) / 2;
  const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius / 2,
    {
      label: 'ball'
    }
  );

  World.add(world, ball);
  document.addEventListener('keydown', event => {
  const {x, y} = ball.velocity;
  if (event.keyCode === 87) {
    Body.setVelocity(ball, { x, y: y-5 });
  }
  if (event.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 5, y });
  }
  if (event.keyCode === 83) {
    Body.setVelocity(ball, { x, y: y + 5 });
  }
  if (event.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 5, y });
  }
});
  //Win Condition

  Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach((collision) => {
      const labels = ['ball', 'goal']

      if(
        labels.includes(collision.bodyA.label) &&
        labels.includes(collision.bodyB.label)
        ) {
          document.querySelector('.winner').classList.remove('hidden');
          document.querySelector('h1').classList.add('dance');
          world.gravity.y = 1;
          world.bodies.forEach(body => {
            if (body.label === 'wall') {
              Body.setStatic(body, false);
            }
          })
        }
    });
  });
};






