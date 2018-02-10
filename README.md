# hanoi-towers

This is a repo for my "Hanoi towers" challenge.

## Task
For this challenge I have been tasked with producing an animated display of
the hanoi towers problem being solved.

### What is the hanoi tower's puzzle?

The premise of 'Hanoi Towers' puzzle is that you are required to move a number 
of disks that are of differing sizes (stacked so that the largest is on the 
bottom through to the smallest on the top) from one tower to another tower. 

When moving the disks you are not allowed to make a move that results in a 
larger disk being above a smaller disk.

Generally, when starting the problem you would select one of the remaining two 
towers to move the disks to as the target affects which starting move you need 
to perform.

The hanoi's tower problem can be solved in a minimum number of moves which can 
be calculated before beginning the problem and is defined as thus:

  Minimum moves = 2<sup>n</sup> - 1
    Where n is the number of disk being used in the puzzle

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

    - Begin - (Type: Button) This button will start animating the display to
    show the solution.

    - Pause / Unpause - (Type: Button) This button will stop the sequence as it is in the sequence. When already paused the button will 'unpause' the game.

    - Reset - (Type: Button) This button will stop the sequence and recontruct the display so that the disk are stacked according to the options set in the text inputs, before any moves had been made.

2. The Display

