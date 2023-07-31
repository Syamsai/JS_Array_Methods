// Reduce() method usages

// to sum numbers
const numbers = [1,2,3];

const sumOfNumbers = numbers.reduce((acc, cur) => acc + cur, 0);
console.log(sumOfNumbers);

// getting object by reducing an array
const fruits = ["apple", "banana", "orange", "apple"];

const fruitsCount = fruits.reduce((acc, fruit) => {
    if (acc[fruit]) {
        acc[fruit] = acc[fruit] + 1;
    }
    else {
        acc[fruit] = 1;
    }
    return acc;
}, {});
console.log(fruitsCount);

// flattening an array
const nestedArray = [
    [1,2,3],
    [4,5,6]
]

const flatArray = nestedArray.reduce((acc, cur) => [...acc, ...cur]);
console.log(flatArray);

// running promises in sequence
 const urls = [
     "https://jsonplaceholder.typicode.com/users",
     "https://jsonplaceholder.typicode.com/posts",
     "https://jsonplaceholder.typicode.com/todos",
 ]

const fetchSequentially = urls.reduce((acc, url) => {
     return acc.then(results => {
         return fetch(url)
             .then(res => res.json())
             .then(data => results.concat(data))
     })
 }, Promise.resolve([]));

 fetchSequentially.then(results => console.log(results));

// grouping elements
const people = [
    { name: "Alice", age: 25, gender: "female" },
    { name: "Charlie", age: 35, gender: "male" },
    { name: "Eva", age: 45, gender: "female" },
]

const gropedByGender = people.reduce((acc, cur) => {
    const gender = cur.gender;
    if(!acc[gender]) {
        acc[gender] = [];
    }
    acc[gender].push(cur);
    return acc;
}, {});

console.log(gropedByGender);
