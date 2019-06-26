function Greeter(greeting) {
    this.greeting = greeting;
}

Greeter.prototype.greet = function() {
    return "Hello, " + this.greeting;
}

// Oops, we're passing an object when we want a string. This will print 
// "Hello, [object Object]" instead of "Hello, world" without error.
let greeter = new Greeter({message: "world"});  

let button = document.createElement('button');
button.textContent = "Say Hello";
button.onclick = function() {
    alert(greeter.greet());
};

document.body.appendChild(button);