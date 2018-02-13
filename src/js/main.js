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
  let errorsPresent = false;

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
    $('#reset').attr('disabled', true);
    // reset board and pause
    setUp();
  });
  
  $('#start').click((evt) => {
    const self = $(evt.target);
    
    if (!errorsPresent) {
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
        }
        
        self.text('Pause');
        solve = true;
        
        if (!errorsPresent) {
          runSolver();
        }
      }
    }
  });
    
  function getSettings() {
    let settings = {
      disks: parseInt($('#blockCount').val()),
      start: $('#startStack').val().toUpperCase(),
      target: $('#targetStack').val().toUpperCase(),
      transitions: $('#transitions').attr('value') === 'true',
      smallest: 0
    };

    settings.spare = getSpare(settings);

    return settings;
  }

  // This functiion runs the set up, regenerates the solver
  // and resets the UI
  function setUp() {
    
    solverSettings = getSettings();
    let validSettings = true;
    
    const errors = [];

    // Data validations here
    // Check disks is between 5 and 10 inclusive.
    if (typeof solverSettings.disks !== 'number') {
      errors.push('Please provide a number for the Disks entry between 5 & 10, inclusive.')
    } else {
      if (solverSettings.disks > 10 || 
        solverSettings.disks < 5 
      ) {
        errors.push('Please provide a disk number between 5 & 10, inclusive');
      }
    }

    // check Start is L R or C
    if (typeof solverSettings.start !== 'string' || 
      towerPositions.indexOf(solverSettings.start) === -1
    ) {
      errors.push('Please provide a Start tower with the letters \'L\', \'C\' or \'R\'');
    }

    // check Target is L R or C
    if (typeof solverSettings.target !== 'string' || 
      towerPositions.indexOf(solverSettings.target) === -1
    ) {
      errors.push('Please provide a Target tower with the letters \'L\', \'C\' or \'R\'');
    }

    //Check start and target are different
    if (solverSettings.target === solverSettings.start) {
      errors.push('Please provide different values for the \'start\' and \'target\' towers');
    }

    if (errors.length > 0) {
      validSettings = false;
      errorsPresent = true;
      $('#start').attr('disabled', true);
      $('#reset').removeAttr('disabled');
    } else {
      errorsPresent = false;
      $('#start').removeAttr('disabled');
    }

    const toast = $('#solverToast');

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
      
      let errorHtml = '';
      errors.forEach((v) => {
        errorHtml += `<p>${v}</p>`;
      });

      toast.html(errorHtml);

      // display toast asking for valid Settings
      toast.addClass('active error');

      setTimeout(() => {
        toast.removeClass('active');
        setTimeout(() => {
          toast.removeClass('error');
          toast.empty();
        }, 500);
      }, 2000);
    }
  }
  
  function runSolver() {
    const timeout = solver.transitions ? 1500 : 300;
    
    if(solve) {
      solver.moveDisk(solver.queue.shift());
      $('#totalScore').text(solver.movesTaken);
      $('#reset').removeAttr('disabled');
      setTimeout(() => {
        runSolver();
      }, timeout);
    }
  }

});

// Amended from fast-deep-equal. The input is less complex
// So Dates, Regex, and array comparisons weren't required.
function deepEquals(a, b) {
  if (a === b) return true;
  let i;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;

    for (i = 0; i < keys.length; i++)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = 0; i < keys.length; i++)
      if(!deepEquals(a[keys[i]], b[keys[i]])) return false;

    return true;
  }

  return false;
}

/**
 * This function figures out which tower is the spare tower
 * @param {object} params
 * @return {number}
 */
function getSpare({start, target}) {
  const selected = [start, target];
  return towerPositions.filter((v) => selected.indexOf(v) === -1)[0];
}

/**
 * This function instantiates a new instance of a HanoiSolver
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
/**
 * Using the parameters used when creating the constructor, this function
 * generates the necessary disks calculating each disks width height and 
 * position on the board.
 * @return {HanoiSolver}
 */
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
/**
 * Once all the disks have been created and allocated to the relevant tower or 'stack'
 * this function adds the disk to the DOM
 * @return {this}
 */
HanoiSolver.prototype.firstRender = function() {
  const startTower = this.towers[0];
  const pile = startTower.pile;
  const board = $('.board');

  // update target moves
  $('#targetScore').text(this.targetMoves);

  // add disks to UI
  pile.forEach((disk) => {
    board.append(disk.html);
  });

  return this;
};
/**
 * Once the HanoiSolver us properly instantiated with disks this function
 * generates the moves required to solve the puzzle in the minimum moves possible.
 * @return {this}
 */
HanoiSolver.prototype.generateMoves = function() {
  while(this.moves < this.targetMoves) {
    this.move();
  }

  const correctConfiguration = this.validate();

  if (!correctConfiguration) {
    console.log('Incorrect Moves Generated!');
  } else {
    console.log('Complete');
  }

  return this;
};
/**
 * Validates results
 * @return {boolean}
 */
HanoiSolver.prototype.validate = function() {

  const [startStack, spareStack, targetStack] = this.towers;

  // No disks present in other stacks
  if (startStack.pile.length > 0) return false;
  if (spareStack.pile.length > 0) return false;

  // All disks are in correct stack
  if (targetStack.pile.length !== this.disks) return false;

  // Disks are stacked from the smallest to widest
  const disks = targetStack.pile;

  for(let i = 1; i < disks.length; i++) {
    if (disks[i].width <= disks[i-1].width) return false;
  }

  return true;
};
/**
 * This function contains the core logic of the Hanoi solver and determines
 * which disk should move to which tower based on the locations of the disks 
 * and the number of moves that have been made thus far. The moves are 
 * added to the HanoiSolver's queue which is managed using the controls in the
 * control panel.
 */
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
/**
 * 
 * @param {string} id - the css id of the disk to be moves
 * @param {number} left - defines the left end position of the disk being moved
 * @param {number} bottom - defines the bottom end position of the disk being moved
 * @return {null}; 
 */
HanoiSolver.prototype.moveDisk = function({id, left, bottom}) {
  
  const disk = $(`#${id}`);

  // If the animations button is on use the more elaborate
  // moves and transitions
  if(this.transitions) {
    const timeout = 500;
    const moves = [lift, slide, place];
    
    moves.forEach((fn, i) => {
      setTimeout( () => { fn(); }, i * timeout);
    });

  } else {
    // otherwise teleport that disk!
    teleport();
  }

  this.movesTaken++;

  function teleport() {
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

/**
 * This function instantiates a stack. the stack is responsible for storing the disks
 * @param {string} position - one of the three defined positions, 'L', 'C' or 'R'
 * @return {this}
 */
function Stack(position) {
  this.left = measureLeft[position];
  this.height = 15;
  this.oddOrEven = null;
  this.position = position;
  this.pile = [];
}
/**
 * This functions removes the disk from the top of the stack
 */
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
/**
 * This function takes a disk and adds it to the top of the stack
 * @param {Disk} disk 
 */
Stack.prototype.unshift = function(disk) {
  this.pile.unshift(disk);
  this.height += disk.height;
  this.oddOrEven = disk.oddOrEven;
  return this;
};

/**
 * This function instantiates a disk with the defined proportions.
 * @param {number} left 
 * @param {number} bottom 
 * @param {number} width 
 * @param {number} height 
 * @param {number} n 
 * @param {boolean} transitions
 * @return {this} 
 */
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
 * This function generates the html that will be added to the DOM
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

/**
 * This instantiates a Move object which are the instructions which
 * will be added to the queue and will control the movement of
 * the disks on the screen
 * @param {string} id 
 * @param {number} left 
 * @param {number} bottom 
 */
function Move(id, left, bottom) {
  this.id = id;
  this.left = left;
  this.bottom = bottom;
}

/**
 * Helper function to define which stacks  
 * @param {number} n 
 */
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