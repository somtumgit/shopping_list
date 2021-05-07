/* All JavaScript objects inherit properties and methods from a prototype. */

/* object constructor: */
function Person(first, last, age, eyecolor) {
    this.firstName = first;
    this.lastName = last;
    this.age = age;
    this.eyeColor = eyecolor;
}
  
var myFather = new Person("John", "Doe", 50, "blue");
var myMother = new Person("Sally", "Rally", 48, "green");

// you can not add a new property to an existing object constructor:
Person.nationality = "English";

console.log(myFather.nationality)  //undefined

Person.prototype.nationality = "English";

console.log(myFather.nationality)  //OK

Person.prototype.name = function(){
    return this.firstName + " " + this.lastName;
};

console.log(myFather.name());
console.log(myMother.name());