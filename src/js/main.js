'use strict';
//=include jquery.js

$(document).ready(() => {
  console.log('Testing');

  const disks = 0;
  const target = 'R';
  const start = 'L';

  // spare stack is the remaining stack need to figure this out
  const spare = 'C';

  const solver = new HanoiSolver(target, start, spare, disks);

  solver.generateDisks();




});

const measureLeft = {
  'R': 77,
  'L': 20,
  'C': 48.5
};

function HanoiSolver(target, start, spare, disks) {
  const startStack = new Stack(start);
  const spareStack = new Stack(spare);
  const targetStack = new Stack(target);
  const heightDiff = 50 / disks;

  const stacks = [startStack, spareStack, targetStack];
  
  const generateDisks = () => {
    const base = 15;
    const width = 28;
    const widthDiff = (28-10) / this.disks;
    const left = measureLeft.start;

    for(let i = 1; i <= this.disks; i++ ) {
      let diskWidth = width - ((i - 1) * widthDiff);
      
      let bottom = base + ((i-1) * heightDiff);
      let diskLeft = left - (diskWidth / 2);
      startStack.unshift(new Disk(diskLeft, bottom, diskWidth, heightDiff, i));
    }

    console.log(startStack);
  }

  return {
    disks: disks,
    towers: stacks,
    heightDiff: heightDiff,
    generateDisks: generateDisks
  }
}

function Stack(position) {
  this.left = measureLeft.position;
  this.height = 15;
  this.oddOrEven = null;
  this.position = position;
  this.pile = [];
  this.canUse = false;
  this.shift = shift;
  this.unshift = unshift;
  this.changeHeight = changeHeight;

  function changeHeight(height) {
    this.height += height;
  }

  function shift() {
    const disk = this.pile.shift(disk);
    this.height--;
    this.oddOrEven = this.pile[0].oddOrEven;

    return disk;
  }

  function unshift(disk) {
    this.pile.unshift(disk);
    this.height++;
    this.oddOrEven = disk.oddOrEven;

    return this;
  }
}

function Disk(left, bottom, width, height, n) {
  this.oddOrEven = `${n % 2 === 0 ? 'even' : 'odd'}`
  this.left = left;
  this.bottom = bottom;
  this.height = height;
  this.width = width;
  this.id = `block-${n}`;
  this.html = generateBlock(left, bottom, width, `block-${n}`);
}

/**
 * 
 */
function generateBlock(left, bottom, width, id, transitions) {
  const { red, green, blue } = randomColor();
  return `<div id="${id}" ` + 
              `class="block" ` + 
              `style=` + 
                `"bottom: ${bottom}%; ` + 
                 `left: ${left}%; ` + 
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
  const min = Math.ceil(min);
  const max = Math.floor(max) + 1;
  return Math.floor(Math.random() * (max - min)) + min; 
}