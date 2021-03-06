# hanoi-towers

This is a repo for my "Hanoi towers" challenge.

## Task
For this challenge I have been tasked with producing an animated display of
the hanoi towers problem being solved.

P1xt Project Criteria : Build an online Towers of Hanoi solver that accepts a tower height between 5 and 10, and then displays a graphical (animated) solution, iteratively moving each piece until the puzzle is solved

Extended: I would like to alter this game to allow somebody to attempt to solve the puzzle themselves. For the time being the focus will be on completing the core requirements set out by P1xt.

### What is the hanoi tower's puzzle?

The premise of 'Hanoi Towers' puzzle is that you are required to move a number 
of disks that are of differing sizes (stacked so that the largest is on the 
bottom through to the smallest on the top) from one tower to another tower. 

When moving the disks you are not allowed to make a move that results in a 
larger disk being placed on top of a smaller disk.

When starting the problem you would select one of the remaining two 
towers to move the disks to as the target affects which starting move you need 
to perform.

The hanoi's tower problem can be solved in a minimum number of moves which can 
be calculated before beginning the problem and is defined as thus:

&nbsp;&nbsp;&nbsp;&nbsp;Minimum moves = 2<sup>n</sup> - 1<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Where n is the number of disk being used in the puzzle

Therefore, given a single disk, we know we can solve the problem in minimum 
of 1 move, while two disks requires 3 separate moves, three disks require 7 
different moves, four disks require a minimum of 15 moves and so on.

### Aim

Given the task and the nature of the puzzle, I have decided to produce a 
display that is split in to two sections. A section for settings and controls, and a section to display the towers and the animated solution.

1. The Controls:
    - Disks - (Type: Text) Defines the number of disks that will be used. Must be between  
      minimum of five and a maximum of 10, inclusive.
    - Start - (Type: Text) This is the tower that the disks will start being stacked on.
    - Target - (Type: Text) The target is the tower that we need to move the 
      disks to. This must be a different tower to that defined as the starting tower.
    
    - Transitions - (Type: Checkbox) This represents a Boolean which will 
    define whether the movements from one tower to another will be fully 
    animated (checked / true) or 'instant' (unchecked / false).

    - Solve / Pause / Continue - (Type: Button) This button will start animating the display to
    show the solution. When in progress this button will pause the sequence once the currently executing move is completed. When already paused the button will continue the solver.

    - Reset - (Type: Button) This button will stop the sequence and recontruct the display so that the disk are stacked according to the options set in the text inputs, before any moves had been made.

2. The Display
  
    The display will diplay the hanoi towers which consists of a single base at the bottom of the display and the three towers.

    There will also be the disks which will initially have the default of 5
    disks present but if the 'Disks' input field is changed, and the solver
    hasn't started yet, the disks will be rerendered. If the solver is active the disks will be rerendered when the reset button is pressed.
    The disks will be generated with random colors. The largest disk will have a width that is 28% of the display container width.

    There will be two informational items in the display. 
      1. One item displaying the minimum number of moves needed to solve the puzzle.
      2. One item displaying the number of moves taken so far.

## Code Structure

To structure my code I will create and use a number of objects that I believe
best represent the nature of the puzzle. 

I will create a HanoiSolver class that will be the main controller which manages the setup, state and execution of the game. 

Within the HanoiSolver there will be a 'towers' array which is made up of three Stack objects. A Stack being a data structure that allows objects to be added to the top of the structure and lifted from the top of the structure (Last-in-first-out). Much in the same way that the towers in the puzzle operate.

I will use a Disk object to represent the Disks in the game. These objects will
contain the dimensions of the disk, will generate the disc html that is added to the DOM, and will have an id which allows for the easy selection of the Disc within the UI. The discs will be stored in the aforementioned stacks.

When the Hanoisolver is generated, and valid settings are supplied, the solver will generate all the required moves to solve the puzzle and add these to a queue (First-in-first-out). This queue will be controlled by the buttons within the control panel. and while the solver is visually active, 'Moves' will be processed from the front of the queue in turn. 

## My Hanoi Solver Alogrithm
# \##### SPOILER ALERT \###### 
## Don't read on if you want to solve this puzzle yourself.
<br>
<br>
<br>
<br>Spoiler starts soon...
<br>
<br>
<br>
<br>
<br>(No turning back now)
<br>
<br>
To begin the only available disk to move is the top disk of the start tower.
The first move is dependent on the number of disks being used. 
If the number of disks is even then you should place the first disk on the 
spare tower. If the number of disks is odd you should place the first disk 
on the target tower.

Once you have made the first move the sequence changes. 

You never move the same disk in two consecutive moves. by moving the same 
disc twice, you would either be moving the disk back to where it was 
previously, which would mean you have wasted two moves, or you move the 
disk to the other tower, which means you either made the wrong move in the 
previous turn, or are making the wrong move now.

You should move the smallest disc every other move.

After you've moved the smallest disc to a tower, you are left with two situations: Either both towers have discs or just one has.

If both towers have discs then there will only be one which you can validly move, which will be to move the smaller of the two movable discs on top of the larger disc.

If only one of the two towers has a disc, then the only available move is to move that disc to the empty tower.

With the exception of the first move, each time you move the first disc, you will move the disk on top of the next even numbered disc. If no even numbered disc is available, move the disk into the empty tower.

Repeat until the tiles are all stacked in order on top of the target tower.