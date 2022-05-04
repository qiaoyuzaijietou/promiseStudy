class Promise {
    // 构造方法
    constructor(executor) {
        // 添加属性
        this.PromiseState = 'pending'
        this.PromiseResult = null
        this.callbacks = []
        // 保存实例对象的this的值
        const self = this //self_this,that
        // resolve函数
        function resolve(data) {
            // 判断状态
            if (self.PromiseState !== 'pending') return
            // 1.修改对象的状态（PromiseState）
            self.PromiseState = 'fulfilled'
            // 2.设置对象结果值(PromiseResult)
            self.PromiseResult = data
            // 执行成功的回调
            setTimeout(() => {
                self.callbacks.forEach(item => {
                    item.onResolved(data)
                })
            });
        }
        // reject函数
        function reject(data) {
            // 判断状态
            if (self.PromiseState !== 'pending') return
            // 1.修改对象的状态（PromiseState）
            self.PromiseState = 'rejected'
            // 2.设置对象结果值(PromiseResult)
            self.PromiseResult = data
            // 执行失败的回调
            setTimeout(() => {
                self.callbacks.forEach(item => {
                    item.onRejected(data)
                })
            });
        }
        try {
            // 同步调用 「执行器函数」
            executor(resolve, reject)
        } catch (error) {
            // 修改promise对象为失败
            reject(error)
        }
    }
    // then方法封装
    then(onResolved, onRejected) {
        const self = this
        //判断回调函数参数
        if (typeof onRejected !== 'function') {
            onRejected = reason => {
                throw reason
            }
        }
        if (typeof onResolved !== 'function') {
            onResolved = value => value
            // value=>{return value}
        }
        return new Promise((resolve, reject) => {
            // 封装函数
            function callback(type) {
                try {
                    // 获取回调函数的执行结果
                    let result = type(self.PromiseResult)
                    // 判断
                    if (result instanceof Promise) {
                        // 如果是promise类型的对象
                        result.then(v => {
                            resolve(v)
                        }, r => {
                            reject(r)
                        })
                    } else {
                        // 结果的对象状态为成功
                        resolve(result)
                    }
                } catch (error) {
                    reject(error)
                }
            }
            // 调用回调函数
            if (this.PromiseState === 'fulfilled') {
                setTimeout(() => {
                    callback(onResolved)
                });
            }
            if (this.PromiseState === 'rejected') {
                setTimeout(() => {
                    callback(onRejected)
                });
            }
            // 判断pending状态
            if (this.PromiseState === 'pending') {
                // 保存回调函数
                this.callbacks.push({
                    onResolved: function (data) {
                        callback(onResolved)
                    },
                    onRejected: function (data) {
                        callback(onRejected)
                    }
                })
            }
        })

    }
    //catch方法封装
    catch(onRejected) {
        return this.then(undefined, onRejected)
    }
    // 添加resolve方法
    static resolve(value) {
        // 返回promise对象
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(v => {
                    resolve(v)
                }, r => {
                    reject(r)
                })
            } else {
                // 状态设置为成功
                resolve(value)
            }
        })
    }
    // 添加reject方法
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }
    // 添加 all 方法
    static all(promises) {
        // 返回结果为promise对象
        return new Promise((resolve, reject) => {
            // 声明变量
            let count = 0
            let arr = []
            // 遍历
            for (let i = 0; i < promises.length; i++) {
                const element = promises[i];
                element.then(v => {
                    // 得知对象的状态是成功的
                    // 每个promise对象都成功
                    count++
                    // 将当前promise对象成功的结果存入到数组中
                    arr[i] = v
                    if (count === promises.length) {
                        resolve(arr)
                    }
                }, r => {
                    reject(r)
                })
            }
        })
    }
    // 添加 race 方法
    static race(promises) {
        return new Promise((resolve, reject) => {
            // 遍历
            for (let i = 0; i < promises.length; i++) {
                const element = promises[i];
                element.then(v => {
                    // 修改返回对象的状态为『成功』
                    resolve(v)
                }, r => {
                    // 修改返回对象的状态为『失败』
                    reject(r)
                })
            }
        })
    }
}









