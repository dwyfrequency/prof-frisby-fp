const log = console.log;

// identity functor
class Box {
  constructor(x) {
    this.x = x;
  }

  // Now x is available in the closure instead of 'this'

  // functor map, sends f:a->b into map(f):Box(a)->Box(b),
  // the same as f(x) but wrapped into the Box container,
  // so we can keep chaining

  map(f) {
    return Box.of(f(this.x));
  }

  // applies f and returns the raw unwrapped value,
  // sends f:a->b into fold(f):Box(a)->b,
  // does not return any Box container, so can't be chained with map

  fold(f) {
    return f(this.x);
  }

  get isNothing() {
    return this.x === null || this.x === undefined;
  }

  // custom getter function -- called by console.log
  inspect()  {
    return this.isNothing ? `No contents in the box` : `Box(${this.x})`;
  }

  static of(x) {
    return new Box(x);
  }
}

// String => Box(String)
const moneyToFloat =  str =>
  Box
    .of(str)
    .map(s => s.replace(/\$/g, ''))
    .map(r => parseFloat(r));
log(moneyToFloat('$12.01'));

const cost = moneyToFloat('$12.01').fold(x => x);
log(cost);

// String => Box(String)
const percentToFloat = str => 
  Box
    .of(str) // Boxed x
    .map(str => str.replace(/\%/g, '')) // Box value after decimal place
    .map(str => parseFloat(str)) // parse the string from prev map 
    .map(num => num/100); // divide by 100
log(percentToFloat(`12%`)); 

const applyDiscount = (priceStr, discountStr) => {
  /* we apply two folds to unwrap our resulting values*/
  return moneyToFloat(priceStr) // take string priceStr and we rename the resulting float price
    .fold(price => 
      percentToFloat(discountStr) // turn the % discountStr to variable discount
        .fold(discount => price - price * discount) // price is available in the closure as a result of the previous calculations 
    )
}

log(`Total Cost: ${applyDiscount('$20.00', '5%')}`);



// // without fold, result is wrapped into Box twice
// const applyDiscountInBox = (price, discount) =>
//   moneyToFloat(price).map(cost =>

//     // nesting so cost remains in scope
//     percentToFloat(discount).map(savings =>
//       cost - cost * savings
//     )
//   )


// log(`moneyToFloat(' $33 ') : `, moneyToFloat(' $33 ')) //=> Box(33)
// log(`percentToFloat(' 1.23% ') : `, percentToFloat(' 1.23% ')) //=> Box(0.0123)

// const result = applyDiscount('$55', '20%')

// log(`applyDiscount('$55', '20%') : `, result) //=> 44

// log(
//   `applyDiscountInBox('$55', '20%') : `, 
//   applyDiscountInBox('$55', '20%')
// ) //=> Box(Box(44))

