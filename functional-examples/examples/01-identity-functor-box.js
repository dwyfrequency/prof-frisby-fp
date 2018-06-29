const log = console.log;
// Identity functor 

class Box {
  constructor(x) {
    this.x = x;
  }

  map(f) {
    return Box.of(f(this.x));
  }

  fold(f) {
    return f(this.x);
  }

  /* created just so we dont have to keep typing new when we want a boxed item - just calls the constructor with the passed in*/
  static of(x) {
    return new Box(x);
  } 
}

const tea = Box.of('tea');
const jockoTea = tea.map(str => str.toUpperCase());
log(jockoTea.fold(str => str.split('')));

const nextCharForNumberString = str => 
  Box.of(str) // box value
  .map(str => str.trim()) // trim any white space
  .map(str => parseInt(str)) // parse numStr to an int
  .map(i => i + 1) // add one
  .map(num => String.fromCharCode(num)) // convert number back to str
  .fold(str => str.toLowerCase()); // return raw value

  const result = nextCharForNumberString(' 64 ');
  log(result);