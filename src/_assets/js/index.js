import test from './utils/test';
// import igarashi_san from './utils/igarashi_san';
import Person from './class/Person';
import 'picturefill';

test.foo();
test.bar();

// igarashi_san();

let es6 = new Person('ECMAScript 2015');
es6.sayHello();

window.onload = () => {
  console.log("ロード!!");
}