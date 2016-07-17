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

# Routes

### /Session

#### POST
A successful POST generates a browser-session cookie that will permit continued access for 2 hours. Indicated Person becomes the AU. An unsuccesful POST results in a 400/No Permission error code, with no further information.
- email Email of user requesting login
- password Password of user

#### GET
Returns a list of all active sessions. Admin-privileged AU required. Returns array of
- cookie Unique cookie value for session
- prsId ID of Person logged in
- loginTime Date and time of login

### /Session/|cookie|

#### DELETE
Log out the specified Ssn. AU must be owner of Ssn or admin.
