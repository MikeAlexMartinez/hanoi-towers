'use strict';
//=include jquery.js

$(document).ready(() => {
  console.log('Testing');

  const disks = 6;
  const start = 'L';
  const target = 'R';

  // spare stack iss the remaining stack need to figure this out
  const spare = 'C';

  const solver = new HanoiSolver(target, start, spare, disks);

  solver.generateDisks();
  console.log(solver.towers);

  solver.render();

});

const measureLeft = {
  'R': 78.5,
  'L': 21.5,
  'C': 50
};

function HanoiSolver(target, start, spare, disks) {
  this.disks = disks;
  this.towers = [
    new Stack(start),
    new Stack(spare),
    new Stack(target)
  ];
  this.heightDiff = 50 / disks;
}
HanoiSolver.prototype.generateDisks = function() {
  console.log('generateDisks');
  const startTower = this.towers[0];
  const base = 15;
  const width = 28;
  const widthDiff = (28-10) / this.disks;
  const left = measureLeft[startTower.position];

  for(let i = 1; i <= this.disks; i++ ) {
    let diskWidth = width - ((i - 1) * widthDiff);
    let bottom = base + ((i-1) * this.heightDiff);
    let diskLeft = left - (diskWidth / 2);
    startTower.unshift(new Disk(diskLeft, bottom, diskWidth, this.heightDiff, i));
    console.log(startTower);
  }

  return this;
}
HanoiSolver.prototype.render = function() {
  const startTower = this.towers[0];
  const pile = startTower.pile;
  const board = $('.board');

  pile.forEach((disk) => {
    board.append(disk.html);
  });
}

function Stack(position) {
  this.left = measureLeft[position];
  this.height = 15;
  this.oddOrEven = null;
  this.position = position;
  this.pile = [];
  this.canUse = false;
  this.shift = function() {
    const disk = this.pile.shift();
    this.height -= disk.height;
    this.oddOrEven = this.pile[0].oddOrEven;
    return disk;
  };
  this.unshift = function(disk) {
    this.pile.unshift(disk);
    this.height += disk.height;
    this.oddOrEven = disk.oddOrEven;
    return this;
  };
  this.changeHeight = function(height) {
    this.height += height;
  };
}

function Disk(left, bottom, width, height, n) {
  this.oddOrEven = `${n % 2 === 0 ? 'even' : 'odd'}`
  this.left = left;
  this.bottom = bottom;
  this.height = height;
  this.width = width;
  this.id = `block-${n}`;
  this.html = generateBlock(left, bottom, width, height, `block-${n}`, true);
}

/**
 * 
 */
function generateBlock(left, bottom, width, height, id, transitions) {
  const { red, green, blue } = randomColor();
  return `<div id="${id}" ` + 
              `class="block" ` + 
              `style=` + 
                `"bottom: ${bottom}%; ` + 
                 `left: ${left}%; ` +
                 `width: ${width}%; ` +
                 `height: ${height}%;` + 
                 `background-color: rgb(${red}, ${green}, ${blue});` +
                 `transition: ${transitions ? 'all 1s linear;' : 'none;'}` +
                `"` +
         `</div>`;
}

function randomColor() {
  return {
    red: randomInt(0, 255),
    green: randomInt(0, 255),
    blue: randomInt(0, 255)
  };
}

function randomInt(min, max) {
  const minimum = Math.ceil(min);
  const maximum = Math.floor(max) + 1;
  return Math.floor(Math.random() * (maximum - minimum)) + minimum; 
}