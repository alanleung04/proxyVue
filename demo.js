

let target = {
    name: 'Tom',
    age: 24
}
let handler = {
    get: function (target, key) {
        console.log('getting ' + key);
        return target[key]; // 不是target.key
    },
    set: function (target, key, value) {
        console.log('setting ' + key);
        target[key] = value;
    }
}
let proxy = new Proxy(target, handler)
proxy.name     // 实际执行 handler.get
proxy.age = 25 // 实际执行 handler.set



let exam = {
    name: "Tom",
    age: 24
}
let proxy = new Proxy(exam, {
    get(target, propKey, receiver) {
        console.log('Getting ' + propKey);
        return target[propKey];
    }
})
proxy.name
// Getting name
// "Tom"


let proxy = new Proxy({}, {
    get(target, propKey, receiver) {
        // 实现私有属性读取保护
        if (propKey[0] === '_') {
            throw new Erro(`Invalid attempt to get private     "${propKey}"`);
        }
        console.log('Getting ' + propKey);
        return target[propKey];
    }
});


let validator = {
    set: function (obj, prop, value) {
        if (prop === 'age') {
            if (!Number.isInteger(value)) {
                throw new TypeError('The age is not an integer');
            }
            if (value > 200) {
                throw new RangeError('The age seems invalid');
            }
        }
        // 对于满足条件的 age 属性以及其他属性，直接保存
        obj[prop] = value;
    }
};
let proxy = new Proxy({}, validator)
proxy.age = 100;
proxy.age           // 100
proxy.age = 'oppps' // 报错
proxy.age = 300     // 报错