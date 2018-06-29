const fs = require('fs');
const log = console.log;

class Right {
  constructor(x) {
    this.x = x;
  }

  // like map but returns "unboxed" value
  chain(f) {
    return f(this.x);
  }

  // Right applies f to x
  map(f) {
    return Right.of(f(this.x));
  }

  // applies the function on the right and returns the raw value
  fold(f, g) {
    return g(this.x);
  }

  // custom getter function -- called by console.log
  inspect() {
    return `Right(${this.x})`
  }

  static of(x) {
    return new Right(x);
  }
}

class Left {
  constructor(x) {
    this.x = x;
  }

  chain(f) {
    Left.of(this.x);
  }

  // Left ignores f, simply passes x itself
  map(f) {
    return Left.of(this.x);
  }

  // applies the function on the left and returns the raw value
  fold(f, g) {
    return f(this.x);
  }

  // custom getter function -- called by console.log
  inspect() {
    return `Left(${this.x})`
  }

  static of(x) {
    return new Left(x);
  }
}

// ensures null values go Left - that we dont map a func on a null val
const fromNullable = x => 
        x !== null ? Right.of(x) : Left.of(x);

// encapsulate try/catch only here 
const tryCatch = f => {
  /**/
  try {
    return Right.of(f()); // impure, but necessary for example
  } catch(e) {
    return Left.of(e);
  }
}

const getPort = filename => 
  // this will not 'explod' if fileName is not found!
  tryCatch(() => fs.readFileSync(filename))
    .map(content => JSON.parse(content))
    .fold(
      e => 3000,
      c => c.port
    );

log(`Port: ${getPort()}`); // returns default left val - 3000
log(`Port: ${getPort('testt.json')}`); // returns default left val - 3000
log(`Port: ${getPort('config.json')}`); // returns port number in json file
// log(`Port: ${getPort('config-bad.json')}`); // blows up our program
log();
// protecting against further errors by wrapping into tryCatch
const getPortSafe = fileName => 
  tryCatch(() => fs.readFileSync(fileName))
  .chain(content => tryCatch(JSON.parse(content)))
  .fold( 
    e => 3000,
    c => c.port
  );
log(`Port: ${getPort()}`); // returns default left val - 3000
log(`Port: ${getPort('testt.json')}`); // returns default left val - 3000
log(`Port: ${getPort('config.json')}`); // returns port number in json file


const getPortSafeTest = fileName =>
  tryCatch(() => fs.readFileSync(fileName))
    .chain(content => tryCatch(() => JSON.parse(content)))
    .fold(
      e => 3000,
      c => c.port
    );
    

// Need to test the below - it keeps blowing up
log(`Bad file - Port: ${getPortSafeTest('configBad.json')}`); // blows up our program







// Testing Left functionality
const lefty = num => 
  Left.of(num)
  .map(num => num ** 3)
  .fold(i => i + 2, i => i + 30);
log(lefty(3));

// Testing Right functionality
const righty = num => 
  Right.of(num)
  .map(num => num ** 3)
  .fold(i => i + 2, i => i + 30);
log(righty(3));
