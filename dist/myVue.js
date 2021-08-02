
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.myVue = factory());
}(this, (function () { 'use strict';

    class myVue {
      constructor(options) {
        this.$el = this.getElement(options.el);
        this.template = this.$el.innerHTML;
        this.data = options.data;
        this.activeMethods(options.methods);
        this.reactive(options.data);
        this.render();
      } // 激活函数


      activeMethods(methods) {
        for (const key in methods) {
          // 绑定this指向
          this[key] = methods[key].bind(this);
        }
      }

      getElement(name) {
        // 目前只考虑id
        if (name.includes('#')) {
          return document.getElementById(name.slice(1, name.length));
        }
      }

      reactive(data) {
        for (const key in data) {
          this[key] = this.def(data[key]);
        }
      } // 检查是否已经进行ref


      checkIfRef(data) {
        if (typeof data !== 'object') {
          return true;
        }

        return data.__isRef;
      }

      buildGetter() {
        return (target, key) => {
          const val = target[key];
          console.log(val);

          if (this.checkIfRef(val)) {
            return target[key];
          }

          Reflect.set(target, key, this.subDef(val));
          return target[key];
        };
      }

      buildSetter() {
        return (target, key, value) => {
          Reflect.set(target, key, value);
          this.render();
        };
      }

      def(value) {
        return new Proxy({
          value
        }, {
          get: this.buildGetter(),
          set: this.buildSetter()
        });
      }

      subDef(target) {
        target.__isRef = true;
        return new Proxy(target, {
          get: this.buildGetter(),
          set: this.buildSetter()
        });
      }

      getData(key) {
        let getKey = `${key}.value`;

        if (key.includes('.')) {
          const keyList = key.split('.');
          getKey = keyList.slice(0, 1).concat(['value'], keyList.slice(1)).join('.');
        }

        const val = eval(`this.${getKey}`);
        return val || '';
      }

      render() {
        const {
          template
        } = this;
        const result = template.replace(/\{\{\w+\.?\w+\}\}/g, word => {
          const key = word.slice(2, word.length - 2);
          return this.getData(key);
        });
        console.log('result', result);
        this.$el.innerHTML = result;
      }

    }

    return myVue;

})));
//# sourceMappingURL=myVue.js.map
