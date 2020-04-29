function Person(name, age, location) {
    this.name = name;
    this.age = age;
    this.location = location;
}

let person = new Person('tony', 25, 'nairobi');
console.log(person.name);