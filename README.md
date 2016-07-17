# Rubik Timer
<b> Cameron Taylor <br> Cal Poly CPE 437 <br> 17 July 2016

A Rubik's Cube timer web app that allows users to practice solving Rubik's Cubes and keep track of their statistics.

<hr>

# Models

### Person
- <b>id</b>: A unique identifier
- <b>firstName</b>: person's first name
- <b>lastName</b>: person's last name
- <b>email</b>: person's email, must be unique
- <b>whenRegistered</b>: when the person registered as a user
- <b>password</b>: person's password for accessing the service
- <b>role</b>: 0=User, 1=Admin

### CubeType
- <b>id</b>: A unique identifier
- <b>name</b>: The name of the cube
- <b>scrambleLength</b>: The number of moves in a standard scramble

### SolveGroup
- <b>id</b>: a unique identifier
- <b>numSolves</b>: the number of solves associated with the SolveGroup
- <b>ownerId</b>: foreign key to the person who owns this SolveGroup
- <b>cubeType</b>: the type of cube used in this SolveGroup. 1=3x3, 2=4x4, 3=5x5

### Solve
- <b>id</b>: a unique identifier
- <b>groupId</b>: the id of the SolveGroup that this solve belongs to
- <b>scramble</b>: the scramble used during the solve (ex: D U' L' D' B' F D' B' U L2 U L2 R2 U D F D2 U' R2 D' F U2 L2 R B)
- <b>time</b>: the time it took to solve the cube

<hr>
