import isOdd from "is-odd";

function testIsOdd(num: number): string {
  return `The number ${num} is ${isOdd(num) ? "odd" : "even"}.`;
}

console.log(testIsOdd(3)); // "The number 3 is odd."
export { testIsOdd };
