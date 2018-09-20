const assert = require('assert');

// Mocha Test intro
class Car {
    park() { return 'stopped'; }
    drive() { return 'aan aan'; }
}

/* let car;
beforeEach(() => {
    console.log('Going to run some tests');
    car = new Car();
})

describe('Car', () => {
    it('car can park', () => {
        assert.equal(car.park(), 'stopped');
    });
    it('car can drive', () => {
        assert.equal(car.drive(), 'aan aan');
    });
}) */
