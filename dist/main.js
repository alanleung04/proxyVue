const el = new myVue({
    el: '#app',
    data: {
        title: 'myVue使用proxy来实现数据的双向绑定',
        test: 1,
        test2: 2,
        test3: {
            num: 3,
        },
    },
    methods: {
        add1() {
            this.test.value++
        },
        add2() {
            this.test2.value++
        },
        add3() {
            this.test3.value.num++
        }
    }
})

function add1() {
    el.add1()
}
function add2() {
    el.add2()
}
function add3() {
    el.add3()
}