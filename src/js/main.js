'use strict';
//=include jquery.js

$(document).ready(() => {
  console.log('Testing');





});

function HanoiSolver(disks) {

}

function Stack() {
  this.height = 0;
  this.pile = [];
  this.shift = shift;
  this.unshift = unshift;
  this.validate = validate;

  function validate(disk) {

  }

  function shift(disk) {
    this.pile.shift(disk);
    this.height--;

    return this;
  }

  function unshift() {

  }
}

function Disk(left, top, width, n) {
  this.left = left;
  this.top = top;
  this.width = width;
  this.id = `block-${n}`;
  this.html = generateBlock(left, top, width, `block-${n}`);
}

/**
 * 
 */
function generateBlock(left, top, width, id) {
  const { red, green, blue } = randomColor();
  return `<div id="${id}" ` + 
              `class="block" ` + 
              `style="top: ${top}%; left: ${left}%; background-color: rgb(${red}, ${green}, ${blue});"` +
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
