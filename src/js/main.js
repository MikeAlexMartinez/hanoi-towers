'use strict';
//=include jquery.js

const towerPositions = ['L','C','R'];
const measureLeft = {
  'R': 78.5,
  'L': 21.5,
  'C': 50
};

$(document).ready(() => {

  let solve = false;
  let solver;
  let solverSettings = {};

  setUp();

  $('#transitions').click((evt) => {
    const self = $(evt.target);

    if (self.attr('value') === 'true') { 
      self.attr('value', 'false');
      $('.block').removeClass('transition');
    } else {
      self.attr('value', 'true');
      $('.block').addClass('transition');
    }

    solver.transitions = self.attr('value') === 'true';
  }); 

  $('#reset').click(() => {
    solve = false;
    // reset board and pause
    setUp();
  });
  
  $('#start').click((evt) => {
    const self = $(evt.target);
    console.log(self);
    
    if(solve) {
      solve = false;
      if (solver.movesTaken !== 0) {
        self.text('Continue');
      } else {
        self.text('Solve');
      }
    } else {

      if (solver.movesTaken === 0) {
        let currentSettings = getSettings();

        // if settings have changed redo setup
        if (!deepEquals(currentSettings, solverSettings)) {
          setUp();
        }
      } else {
        self.text('Pause');
      }

      solve = true;
      runSolver();
    }
  });
    
  function getSettings() {
    let settings = {
      disks: parseInt($('#blockCount').val()),
      start: $('#startStack').val(),
      target: $('#targetStack').val(),
      transitions: $('#transitions').attr('value') === 'true',
      smallest: 0
    };

    settings.spare = getSpare(settings);

    return settings;
  }

  function setUp() {
    
    solverSettings = getSettings();
    let validSettings = true;
    
    // Data validations here

    if(validSettings) {

      if (solver) {
        // remove disks
        $('.block').remove();
        $('#start').text('Solve');
      }
        
      // set up new solver
      solver = new HanoiSolver(solverSettings)
        .generateDisks()
        .firstRender()
        .generateMoves();
    
    } else {

      // display toast asking for valid Settings

    }
  }
  
  function runSolver() {
    const timeout = solver.transitions ? 1500 : 300;
    
    if(solve) {
      solver.moveDisk(solver.queue.shift());
      setTimeout(() => {
        runSolver();
        solver.movesTaken++;
      }, timeout);
    }
  }
});

function deepEquals(a, b) {
  if (a === b) return true;
  
  const arrA = Array.isArray(a);
  const arrB = Array.isArray(b);
  let i;

  if (arrA && arrB) {
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++)
      if (!deepEquals(a[i], b[i])) return false;
    return true;
  }

  if (arrA !== arrB) return false;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;

    const dateA = a instanceof Date;
    const dateB = b instanceof Date;
    if (dateA && dateB) return a.getTime() === b.getTime();
    if (dateA !== dateB) return false;

    const regexpA = a instanceof RegExp;
    const regexpB = b instanceof RegExp;
    if (regexpA && regexpB) return a.toString() === b.toString();
    if (regexpA !== regexpB) return false;

    for (i = 0; i < keys.length; i++)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = 0; i < keys.length; i++)
      if(!deepEquals(a[keys[i]], b[keys[i]])) return false;

    return true;
  }

  return false;
}

function getSpare({start, target}) {
  const selected = [start, target];
  return towerPositions.filter((v) => selected.indexOf(v) === -1)[0];
}

/**
 * 
 * @param {object} solverSettings
 * @return {HanoiSolver} 
 */
function HanoiSolver({target, start, spare, disks, transitions}) {
  this.disks = disks;
  this.transitions = transitions;
  this.moves = 0;
  this.movesTaken = 0;
  this.queue = [];
  this.targetMoves = Math.pow(2, disks) - 1;
  this.complete = false;
  this.towers = [
    new Stack(start),
    new Stack(spare),
    new Stack(target)
  ];
  this.smallest = 0; // keeps track of which tower smallest disk is on 
  this.heightDiff = 50 / disks;
}
HanoiSolver.prototype.generateDisks = function() {
  const startTower = this.towers[0];
  const start = 65;
  const width = 10;
  const widthDiff = (28-10) / this.disks;
  const left = measureLeft[startTower.position];

  for(let i = this.disks; i >= 1; i-- ) {
    let diskWidth = width + ((i - 1) * widthDiff);
    let bottom = start - ((i) * this.heightDiff);
    let diskLeft = left - (diskWidth / 2);
    startTower.unshift(new Disk(diskLeft, bottom, diskWidth, this.heightDiff, i, this.transitions));
  }

  return this;
};
HanoiSolver.prototype.firstRender = function() {
  const startTower = this.towers[0];
  const pile = startTower.pile;
  const board = $('.board');

  pile.forEach((disk) => {
    board.append(disk.html);
  });

  return this;
};
HanoiSolver.prototype.generateMoves = function() {
  while(this.moves < this.targetMoves) {
    this.move();
  }

  return this;
};
HanoiSolver.prototype.move = function() {

  const tN = notSmallest(this.smallest);

  if (this.moves === 0) {
    // move smallest disk from start
    const disk = this.towers[this.smallest].shift();
    let tower;

    if( isEven(this.disks) ) {
      tower = this.towers[1];
      this.smallest = 1;
    } else {
      tower = this.towers[2];
      this.smallest = 2;
    }

    // settings to move disk on screen
    const left = tower.left - (disk.width / 2);
    const bottom = tower.height;

    // move disk in memory
    tower.unshift(disk);  
    
    // add move to queue
    this.queue.push(new Move(disk.id, left, bottom));

  } else if (isEven(this.moves)) {

    // move smallest disk
    const fromTower = this.towers[this.smallest];
    let toTower;
    
    // determine 'even' tower to move disk to.
    if ((this.towers[tN[0]].oddOrEven === null &&
        this.towers[tN[1]].oddOrEven === 'odd') ||
        (this.towers[tN[0]].oddOrEven === 'even')
    ) {
      toTower = this.towers[tN[0]];
      this.smallest = tN[0];
    } else {
      toTower = this.towers[tN[1]];
      this.smallest = tN[1];
    }
    
    // move disk on to tower that has an 'even' disk at the top
    const disk = fromTower.shift();

    // settings to move disk on screen
    const left = toTower.left - (disk.width / 2);
    const bottom = toTower.height;

    // move disk in memory
    toTower.unshift(disk);  
    
    // add move to queue
    this.queue.push(new Move(disk.id, left, bottom));

  } else {
    // move next smallest available disk
    let fromTower;
    let toTower;

    // define fromTower and toTower
    // check if both towers have disks 
    if ( this.towers[tN[0]].pile.length > 0 && 
         this.towers[tN[1]].pile.length > 0
        ) {

      // find tower with smallest top disk
      const tower0Disk = this.towers[tN[0]].pile[0];
      const tower1Disk = this.towers[tN[1]].pile[0];

      if (tower1Disk.width > tower0Disk.width) {
        fromTower = this.towers[tN[0]];
        toTower = this.towers[tN[1]];
      } else {
        fromTower = this.towers[tN[1]];
        toTower = this.towers[tN[0]];
      }
    
    // if only one of the two towers has a disc move from
    // tower with discs to empty tower. 
    } else if (this.towers[tN[0]].pile.length > 0) {
      fromTower = this.towers[tN[0]];
      toTower = this.towers[tN[1]];
      
    } else {
      fromTower = this.towers[tN[1]];
      toTower = this.towers[tN[0]];  
    }

    // move disk on to tower that has an 'even' disk at the top
    const disk = fromTower.shift();
    
    // settings to move disk on screen
    const left = toTower.left - (disk.width / 2);
    const bottom = toTower.height;

    // move disk in memory
    toTower.unshift(disk);  
    
    // add move to queue
    this.queue.push(new Move(disk.id, left, bottom));

  }
  // increment moves total
  this.moves++;
};
HanoiSolver.prototype.moveDisk = function({id, left, bottom}) {
  
  const disk = $(`#${id}`);

  if(this.transitions) {
    const timeout = 500;
    const moves = [lift, slide, place];
    
    moves.forEach((fn, i) => {
      setTimeout( () => { fn(); }, i * timeout);
    });

  } else {
    transport();
  }

  this.movesTaken++;

  function transport() {
    disk.css('bottom', `${bottom}%`);
    disk.css('left', `${left}%`);
  }

  function lift() {
    disk.css('bottom', '80%');
  }

  function slide() {
    disk.css('left', `${left}%`);
  }

  function place() {
    disk.css('bottom', `${bottom}%`);
  }
};

function Stack(position) {
  this.left = measureLeft[position];
  this.height = 15;
  this.oddOrEven = null;
  this.position = position;
  this.pile = [];
}
Stack.prototype.shift = function() {
  const disk = this.pile.shift();
  this.height -= disk.height;

  if (this.pile[0]) {
    this.oddOrEven = this.pile[0].oddOrEven;
  } else {
    this.oddOrEven = null;
  }

  return disk;
};
Stack.prototype.unshift = function(disk) {
  this.pile.unshift(disk);
  this.height += disk.height;
  this.oddOrEven = disk.oddOrEven;
  return this;
};

function Disk(left, bottom, width, height, n, transitions) {
  this.oddOrEven = `${n % 2 === 0 ? 'even' : 'odd'}`;
  this.left = left;
  this.bottom = bottom;
  this.height = height;
  this.width = width;
  this.id = `block-${n}`;
  this.html = generateBlock(left, bottom, width, height, `block-${n}`, transitions);
}

/**
 * 
 */
function generateBlock(left, bottom, width, height, id, transitions) {
  const { red, green, blue } = randomColor();
  return `<div id="${id}" ` + 
              `class="block ${transitions ? 'transition' : ''}" ` + 
              `style=` + 
                `"bottom: ${bottom}%; ` + 
                 `left: ${left}%; ` +
                 `width: ${width}%; ` +
                 `height: ${height}%;` + 
                 `background-color: rgb(${red}, ${green}, ${blue});` +
                `"` +
         `</div>`;
}

function Move(id, left, bottom) {
  this.id = id;
  this.left = left;
  this.bottom = bottom;
}

function notSmallest(n) {
  return [0,1,2].filter((v) => v !== n);
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

function isEven(n) {
  return n % 2 === 0;
}