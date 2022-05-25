// ----

const Express = require("express");
// console.log(Express)

// ----

let num1 = 2;
let num2 = 3;
function mutation_sideEffect () {
    num1 *= num2;   // <QUESTION> if I export this though, and do not expose the "let num1" and "let num2", how does it get handled ?
    console.log(num1);
}
const print_instantiated = () => {
    console.log("Instantiated;", `num1: ${num1}, num2: ${num2}`);    // <CONCLUSION>: the instantiated function here seems to use a reference
}

print_instantiated();
mutation_sideEffect();
print_instantiated();
mutation_sideEffect();
print_instantiated();

// ----

//..

// ----

module.exports = {mutation_sideEffect, print_instantiated};