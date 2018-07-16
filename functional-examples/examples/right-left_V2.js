const log = console.log;

class Right {
  constructor(x) {
    this.x = x;
  }

  // Right applies f to x
  map(f) {
    return Right.of(f(this.x));
  }

  // custom getter function -- called by console.log
  inspect () {
    return `Right(${x})`;
  };

  static of(x) {
    return new Right(x);
  }
}

class Left {
  
}

console.log(Right
              .of("sandwich")
              .map(i => i.toUpperCase())
            );
let str = "jack".toUpperCase();