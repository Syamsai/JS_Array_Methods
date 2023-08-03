// refer the article: https://dmitripavlutin.com/gentle-explanation-of-this-in-javascript/

// All about this Keyword

// In JavaScript the situation is different: 
// this is the context of a function invocation (a.k.a. execution). 
// The language has 4 function invocation types:

// function invocation: alert('Hello World!')
// method invocation: console.log('Hello World!')
// constructor invocation: new RegExp('\\d')
// indirect invocation: alert.call(undefined, 'Hello World!')

// Function Invocation:
// this is an global object in function invocation
// the global object is determined by the execution environment.

function sum(a, b) {
    console.log(this === window); // -> true
    this.myNumber = 20; // add myNumber property to global object
    return a + b; 
}

sum(15, 16); // -> 31
window.myNumber; // -> 20

// Function Invocation in strict mode:
// this is undefined in a function invocation in strict mode

function multiply(a, b) {
    'use strict'; // enable the strict mode
    console.log(this === undefined) // -> true
    return a * b;
}

multiply(2, 5) // -> 10

// the strict mode is active not only in current scope but also
// in the inner scopes

function execute() {
    'use strict';

    function concat(str1, str2) {
        // the strict mode is enabled too here
        console.log(this === undefined) // -> true
        return str1 + str2;
    }

    // concat() is invoked as a function in strict mode
   // this in concat() is undefined
    concat('Hello', 'World');
}

execute();

// Pitfall : this is an inner function

// const numbers = {
//     numberA: 5,
//     numberB: 10,

//     sum: function() {
//         console.log(this === numbers) // ->  true

//         function calculate() {
//             // this is window or undefined in strict mode
//             console.log(this === numbers) // -> false
//             return this.numberA + this.numberB;
//         }

//         calculate();
//     }
// };
// console.log(numbers.sum()) // -> NaN or throws TypeError in strict mode

// solution 1 for above is to change manually the context of calculate() 
// to the desired one by calling calculate.call(this) (an indirect invocation of a function)

// const numbers = {
//     numberA: 5,
//     numberB: 10,

//     sum: function() {
//         console.log(this === numbers) // ->  true

//         function calculate() {
//             // this is window or undefined in strict mode
//             console.log(this === numbers) // -> false
//             return this.numberA + this.numberB;
//         }

//         return calculate.call(this);
//     }
// };

// console.log(numbers.sum()) // -> 15



// solution 2 for above is to use an arrow function
// const numbers = {
//     numberA : 5,
//     numberB : 10,

//     sum: function() {
//         console.log(this === numbers) // -> true

//         const calcualte = () => {
//             console.log(this === numbers) // -> true
//             return this.numberA + this.numberB;
//         }

//         return calcualte();
//     }
// }
// console.log(numbers.sum()); // => 15

// Method Invocation
// A method is a function stored in property of an object
const myObject = {
  // helloMethod is a method
  helloMethod: function() {
    return 'Hello World!';
  }
};
const message = myObject.helloMethod();

// myObject.helloMethod() is a method invocation of 
// helloMethod on the object myObject

// more examples fo method calls
// [1, 2].join(',')
// /\s/.test('beautiful world')


const words = ['Hello', 'World'];
words.join(', ') // method invocation

const obj = {
    myMethod() {
        return new Date().toString();
    }
};
obj.myMethod(); // method invocation

const func = obj.myMethod;
func();  // function invocation
parseFloat('16.6');  // function invocation
isNaN(0); // function invocation

// this in a method invocation
// this is the object that owns the method in a method invocation

// when invoking a method on an object, this is the object
// that owns the method

const calc = {
    num: 0,
    increment() {
        console.log(this === calc); // -> true
        this.num += 1;
        return this.num;
    }
}

// method invocation. this is calc
calc.increment(); // -> 1
calc.increment(); // -> 2

// Let's follow another case.
// A javascript object inherits a method from its prototype.
// When the inherited method is invoked on the object,
// the context of the invocation is still the object itself.

const myDog = Object.create({
  sayName() {
    console.log(this === myDog); // -> true
    return this.name;
  }  
});

myDog.name = 'Milo';
// method invocation. this is myDog
myDog.sayName(); // -> 'Milo'


// In ECMAScript 2015 class syntax, the method invocation
// context is also the instance itself
class Planet  {
    constructor(name) {
        this.name = name;
    }

    getName() {
        console.log(this === earth); // -> true
        return this.name;
    }
}

const earth = new Planet('Earth');
earth.getName();

// Pitfall: separating method from its object
// function Pet(type, legs) {
//     this.type = type;
//     this.legs = legs;

//     this.logInfo = function() {
//         console.log(this === myCat); // -> false
//         console.log(`The ${this.type} has ${this.legs} legs`);
//     }
// }

// const myCat = new Pet('Cat', 4);
// logs "The undefined has undefined legs"
// or throws a TypeError in strict mode
// console.log(setTimeout(myCat.logInfo, 1000));

// You might think that setTimeout(myCat.logInfo, 1000) 
// will call the myCat.logInfo(), which should log the 
// information about myCat object.

// Unfortunately the method is separated from its object 
// when passed as a parameter: setTimeout(myCat.logInfo). 
// The following cases are equivalent:

// setTimeout(myCat.logInfo);

// is equivalent to:

// const extractedLogInfo = myCat.logInfo;
// setTimeout(extractedLogInfo);

// A function bounds with an object using .bind() method.
// If the separated method is bound with myCat object, the 
// context problem is sovled.

// function Pet(type, legs) {
//     this.type = type;
//     this.legs = legs;

//     this.logInfo = function() {
//         console.log(this === myCat); // -> true
//         console.log(`The ${this.type} has ${this.legs} legs`);
//     }
// }

// const myCat = new Pet('Cat', 4);

// Create a bound function
// const boundLogInfo = myCat.logInfo.bind(myCat);
// logs "The Cat has 4 legs"
// setTimeout(boundLogInfo, 1000)

// myCat.logInfo.bind(myCat) returns a new function that
// executes exactly like logInfo, but has this as myCat,
// even in a function invocation

// an alternative solution is to define logInfo() method
// as an arrow function which binds this lexically.

// function Pet(type, legs) {
//     this.type = type;
//     this.legs = legs;

//     this.logInfo = () => {
//         console.log(this === myCat); // -> true
//         console.log(`The ${this.type} has ${this.legs} legs`);
//     };
// }

//const myCat = new Pet('Cat', 4);
// logs "The Cat has 4 legs"
//setTimeout(myCat.logInfo, 1000);

// If you'd like to use classes and bind this to the class
// instance in your method, use the arrow function as
// a class property

// class Pet {
//     constructor(type, legs) {
//         this.type = type;
//         this.legs = legs;
//     }

//     logInfo = () => {
//         console.log(this === myCat); // -> true
//         console.log(`The ${this.type} has ${this.legs} legs`);
//     }
// }

// const myCat = new Pet('Cat', 4);
// logs "The Cat has 4 legs"
// setTimeout(myCat.logInfo, 1000);


// Constructor Invocation
// constructor invocation is performed when new keyword
// is followed by an expression that evaluates to 
// function object, an open parenthesis (, a comma
// separated list of arguments expressions and a close
// parenthesis ).

// example
// new Pet('cat', 4), new RegExp('\\d')

function Country(name, traveled) {
    this.name = name ? name : 'UK';
    this.traveled = Boolean(traveled);
}

Country.prototype.travel = function() {
    this.traveled = true;
}

// constructor invocation
const france = new Country('France', false);
// constructor invocation
const uk = new Country;

uk.travel();
france.travel();

function Foo() {
    this.property = 'Default Value';
}

// constructor invocation
const fooInstance = new Foo();
fooInstance.property; // -> 'Default Value'

// when using class syntax, only the initialization
// happens in the constructor method

class Bar {
    constructor() {
        // this is barInstance
        this.property = 'Default Value';
    }
}

const barInstance = new Bar();
barInstance.property; // -> 'Default Value'

// Pitfall: forgetting about new
const reg1 = new RegExp('\\w+');
const reg2 = RegExp('\\w+');

console.log(reg1 instanceof RegExp); // -> true
console.log(reg2 instanceof RegExp); // -> true
console.log(reg1.source === reg2.source); // -> true

// Using a function invocation to create objects is a
// potential problem(excluding factory pattern), because
// some constructors may omit the logic to initialize the
// object when new keyword is missing.

// to illustrates the problem see below
// function Vechicle(type, wheelsCount) {
//     this.type = type;
//     this.wheelsCount = wheelsCount;
//     return this;
// }

// Function invocation
// const car = Vechicle('Car', 4);
// car.type; // -> 'Car'
// car.wheelsCount; // -> 4
// console.log(car === window) // -> true

// you might think it works well for creating and
// initializing new objects.

// However, this is window object, thus sets properties on 
// the window object. This is a mistake. A new object is 
// not created

// Make sure to use new operator in cases when a constructor
// call is expected

// function Vechicle(type, wheelsCount) {
//     if (!(this instanceof Vechicle)) {
//         throw Error('Error: Incorrect invocation');
//     }

//     this.type = type;
//     this.wheelsCount = wheelsCount;
//     return this;
// }

// constructor invocation
// const car = new Vechicle('Car', 4);
// car.type // -> 'Car'
// car.wheelsCount // -> 4
// console.log(car instanceof Vechicle) // -> true

// Function invocation. Throws a error.
// const brokenCar = Vechicle('BrokenCar', 3);

// Indirect Invocation

function sum(num1, num2) {
    return num1 + num2;
}

sum.call(undefined, 10, 2);  // -> 12
sum.apply(undefined, [10, 2]); // -> 12


// Indirect invocation is performed when a function is called
// using myFun.call() or myFun.apply() methods.
 
// this is the first argument of .call() or .apply() in an
// indirect invocation

const rabbit = { name: 'White Rabbit' };

function concatName(string) {
    console.log(this === rabbit); // -> true
    return string + this.name;
}

// Indirect invocation
console.log(concatName.call(rabbit, 'Hello ')); // -> 'Hello White Rabbit'
console.log(concatName.apply(rabbit, ['Bye '])); // -> 'Bye White Rabbit'

// Bound function

// A bound function is a function whose context and/or 
// arguments are bound to specific values.

// You can create a bound function using .bind() method.

// this is the first argument of myFunc.bind(thisArg) when
// invoking a bound function

const numbers = {
    array: [3, 5, 10],

    getNumbers() {
        return this.array;
    }
}

// Create a bound function
const boundGetNumbers = numbers.getNumbers.bind(numbers);
console.log(boundGetNumbers()); // -> [3, 5, 10]

// Extract method from object
const simpleGetNumbers = numbers.getNumbers;
console.log(simpleGetNumbers()); // -> undefined or throws an error in strict mode

// Tight context binding
// .bind() makes a permanent context link and will always keep it.
// A bound function cannot change its linked context when using 
// .call() or .apply() with a different context or even
// a rebound doesn't have any effect.

// the following example creates a bound function, then tries
// to change its already pre-defined context:

function getThis() {
    'use strict';
    return this;
}

const one = getThis.bind(1);

console.log(one()); // -> 1

console.log(one.call(2)); // -> 1
console.log(one.apply(2)); // -> 1
console.log(one.bind(2)()); // -> 1

console.log(new one()); // -> Object

// Arrow function
// Arrow function is designed to declare the function in a
// shorter form and lexically bind the context.

const hello = (name) => {
    return 'Hello ' + name;
};

console.log(hello('World')); // -> 'Hello World'
// keep only even numbers
console.log([1, 2, 5, 6].filter((item) => item % 2 === 0)); // -> [2, 6]
