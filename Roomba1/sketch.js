let roomba1;
let roomba2;
let food = [];
let showFood = true;
let obstacles = [];

function setup() {
  createCanvas(800, 600);
  roomba1 = new Roomba1(4,2);
  roomba2 = new Roomba1(1.2,2);

  for (let i = 20; i < width; i += 45) {
    for (let j = 20; j < height; j += 45) {
      food.push({ x: i, y: j });
    }
  }

  let tvSprite = createSprite(0, height / 2, 40, 300);
  tvSprite.shapeColor = color(0, 0, 0);

  let couchSprite = createSprite(width / 2, 0, 200, 100);
  couchSprite.shapeColor = color(255, 100, 100);

  let couchArms = createSprite(width / 2 - 100, 0, 50, 100);
  couchArms.shapeColor = color(255, 100, 100);

  let couchArms2 = createSprite(width / 2 + 100, 0, 50, 100);
  couchArms2.shapeColor = color(255, 100, 100);

  let table = createSprite(width / 2, height / 2, 250, 100);
  table.shapeColor = color(165, 42, 42);

  let light = createSprite(width - 50, height - 50, 100, 100);
  light.shapeColor = color(165, 42, 42);

  let light2 = createSprite(width - 50, 50, 100, 100);
  light2.shapeColor = color(165, 42, 42);

  let otherCouch = createSprite(width / 2, height, 200, 100);
  otherCouch.shapeColor = color(255, 100, 100);

  let otherCouchArms = createSprite(width / 2 - 100, 0, 50, 100);
  otherCouchArms.shapeColor = color(255, 100, 100);

  let otherCouchArms2 = createSprite(width / 2 + 100, 0, 50, 100);
  otherCouchArms2.shapeColor = color(255, 100, 100);

  obstacles.push(tvSprite);
  obstacles.push(couchSprite);
  obstacles.push(couchArms);
  obstacles.push(couchArms2);
  obstacles.push(table);
  obstacles.push(light);
  obstacles.push(light2);
  obstacles.push(otherCouch);
  obstacles.push(otherCouchArms);
  obstacles.push(otherCouchArms2);
}



function draw() {

  background(252, 172, 152);
  roomba1.update(roomba2,800);
  roomba1.draw(100,roomba2);
  roomba2.update(roomba1,500);
  roomba2.draw(150,roomba1);
  roomba1.update(roomba2)
  roomba2.update(roomba1)
  // roomba1.move(roomba2)
  // roomba2.move(roomba1)


  
  fill(0);

  for (let obstacle of obstacles) {
    roomba1.sprite.collide(obstacle);
    roomba2.sprite.collide(obstacle);
    drawSprite(obstacle);
  }


  if (showFood) {
    for (let snack of food) {
      fill(255, 255, 255);
      circle(snack.x, snack.y, 10);
    }
  }
}
