export default class myVue {
    constructor(options) {
        this.$root = this.getElement(options.el)
        // 原始数据保存
        this.data = options.data
        // 绑定数据
        this.reactive(this.data)
        // 函数绑定
        this.activeMethods(options.methods)
        // 初始模板构建
        // 可优化为使用虚拟dom
        this.template = this.$root.innerHTML
        this.render()
    }

    // 激活函数
    activeMethods(methods) {
        for (const key in methods) {
            // 绑定this指向
            this[key] = methods[key].bind(this)
        }
    }

    // 激活数据
    reactive(data) {
        // 遍历data对象，对每一项都做Proxy
        for (const key in data) {
            this[key] = this.ref(data[key])
        }
    }

    // 检查是否已经进行ref
    checkIfRef(data) {
        if (typeof data !== 'object') {
            return true
        }
        return data.__isRef
    }

    buildGetter() {
        return (target, key) => {
            const val = target[key]
                if (this.checkIfRef(val)) {
                    return target[key]
                }
                Reflect.set(target, key, this.subRef(val))
                return target[key]
        }
    }

    buildSetter() {
        return (target, key, value) => {
            Reflect.set(target, key, value)
            this.render()
        }
    }

    // ref函数，对data对象进行数据绑定
    ref(value) {
        return new Proxy({value}, {
            get: this.buildGetter(),
            set: this.buildSetter(),
        })
    }

    subRef(target) {
        target.__isRef = true
        return new Proxy(target, {
            get: this.buildGetter(),
            set: this.buildSetter(),
        })
    }

    getElement(name) {
        // 目前只考虑id
        if (name.includes('#')) {
            return document.getElementById(name.slice(1, name.length))
        }
    }

    getData(key) {
        let getKey = `${key}.value`
        if (key.includes('.')) {
            const keyList = key.split('.')
            getKey = keyList.slice(0, 1).concat(['value'], keyList.slice(1)).join('.')
        }
        const val = eval(`this.${getKey}`)
        return val || ''
    }

    // 简单粗暴版的渲染函数
    render() {
        const { template } = this
        const res = template.replace(/(\{\{\w+\.?\w+\}\})/g, (word) => {
            const key = word.slice(2, word.length - 2)
            return this.getData(key)
        })
        this.$root.innerHTML = res
    }
}