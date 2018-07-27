const log = console.log;

class Right {
  constructor(x) {
    this.x = x;
  }

  // Right applies f to x
  map(f) {
    return Right.of(f(this.x));
  }

  // applies the function on the right and returns raw value
  fold(f, g) {
    return g(this.x);
  }

  // custom getter function -- called by console.log
  inspect() {
    return `Right(${this.x})`;
  }

  // boxes value again
  static of(x) {
    return new Right(x);
  }
}

class Left {
  constructor(x) {
    this.x = x;
  }

  // Left ignores f, simply passes ahead raw value x
  map(f) {
    return Left.of(this.x);
  }

  // applies the function on the left and returns raw value
  fold(f, g) {
    return f(this.x);
  }

  // custom getter function -- called by console.log
  inspect() {
    return `Left(${this.x})`;
  }

  static of(x) {
    return new Left(x);
  }
}

// this will apply the functions
const resultRight = Right.of(3)
  .map(x => x + 1)
  .map(x => x / 2);
// this will ignore all functions and return itself
const resultLeft = Left.of(3)
  .map(x => x + 1)
  .map(x => x / 2);

log(`Right(3) transformed: `, resultRight); //=> Right(2)
log(`Left(3) transformed: `, resultLeft); //=> Left(3)

// passing Right value,
// all functions are applied
// and result is returned
const result = Right.of(2)
  .map(x => x + 1)
  .map(x => x / 2)
  // left function handles error, right function returns the value
  .fold(x => "error", x => x);

log(
  `Right(2) transformed and unwrapped with (x => 'error', x => x): ${result}`
); //=> 1.5

// passing Left value,
// so all functions are ignored
// and error is returned
const resultError = Left.of(2)
  .map(x => x + 1)
  .map(x => x / 2)
  // left function handles error, right function returns the value
  .fold(x => "error", x => x);

log(
  `Left(2) transformed and unwrapped with (x => 'error', x => x): ${resultError}`
); //=> error

const findColor = name =>
  // need to wrap the object in parentheses
  // to avoid confusion with function block
  ({ red: "#ff4444", blue: "#00ff00" }[name]);

// would generate error if the 'red' key were not defined
const resultColor = findColor("red")
  .slice(1)
  .toUpperCase();

log(`findColor('red') transformed is: ${resultColor}`);

const findColorCases = name => {
  const found = { red: "#ff4444", blue: "#00ff00" }[name];
  return found ? Right.of(found) : Left.of(null);
};

log(`findColorCases("gray") is:`, findColorCases("gray")); //=> no color

const badColor = findColorCases("gray")
  // map only applies when passed Right,
  // ignored when passed Left
  .map(c => c.slice(1))
  .fold(e => "no color", c => c.toUpperCase());

log(
  `findColorCases('gray') transformed and fold with (e => 'no color', c => c.toUpperCase()) is: `,
  badColor
); //=> no color

// ensure null (of any falsey value) will always go to Left
const fromNullable = x => (x != null ? Right.of(x) : Left.of(null));

// no need anymore to worry about null in our logic
// much simpler function, no more cases
const findColorFromNullable = name =>
  fromNullable({ red: "#ff4444", blue: "#00ff00" }[name]);

const badColorNew = findColorFromNullable("gray")
  // map only applies when passed Right,
  // ignored when passed Left
  .map(c => c.slice(1))
  .fold(e => "no color", c => c.toUpperCase());

log(
  `findColorFromNullable('gray') transformed and fold with (e => 'no color', c => c.toUpperCase()) is: `,
  badColorNew
); //=> no color
