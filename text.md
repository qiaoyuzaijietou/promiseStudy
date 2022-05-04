# 笔记
## 异步编程
* fs 文件操作
```js
require('fs').readeFile('./index.html',(err,data)=>{})
```
* 数据库操作

* AJAX

  ```js
  $.get('/server',(data)=>{})
  ```

* 定时器

  ```js
  setTimeout(()=>{},2000)
  ```

  ### 2.2.1 指定回调函数的方式更加灵活

  1. 旧的：必须在启动异步任务之前指定
  2. promise:启动异步任务 => 返回promise对象 =>给promise绑定回调函数（甚至可以在异步任务结束后指定/多个）

  ### 支持链式调用，可以解决回调地狱问题

  1. 什么是回调地狱

     回调函数嵌套调用，外部回调函数异步执行的结果是嵌套的回调执行的条件

  		   2. 回调地狱的缺点
     	
     	 不便于阅读
     	
     	 不便于异常处理
     	
  		   3. 解决方案
     	
     	 promise链式调用

### promise的状态改变

1. pending变为resolved
2. pending变为rejected

说明：只有这两种，且一个promise对象只能改变一次

无论是变为成功还是失败，都会有一个结果数据

成功的结果数据一般称为value,失败的结果数据一般称为reason

#### promise的状态

实例对象中的一个属性 PromiseState

* pending 未决定的
* resolved / fullfilled 成功
* rejected 失败

### promise对象的值

实例对象中的另一个属性 PromiseResult

保存着异步任务 成功/失败 的结果

* resolve
* reject

### promise的基本流程

![image-20220502095643407](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220502095643407.png)



## 如何使用Promise

### API

 1. Promise构造函数：Promise(executor){}

    (1) executor 函数 :执行器 （resolve,reject）=>{}

    (2)resolve 函数：内部定义成功时我们调用的函数 value=>{}

    (3)reject 函数：内部定义失败时我们调用的函数 reason=>{}

    说明：executor会在Promise内部立即同步调用，异步操作在执行器中执行

  2.Promise.prototype.then 方法：（onResolved,onRejected）=>{}

​	(1)	onResolved 函数：成功的回调函数 （value）=>{}

​	(2) onRejected 函数：失败的回调函数 （reason）=>{}

说明：指定用于得到成功value的成功回调和用于得到失败reason的失败回调返回一个新的Promise对象

3.Promise.prototype.catch 方法：（onRejected）=>{}

​	(1)	onRejected 函数：失败的回调函数 （reason）=>{}

4.Promise.resolve方法：（value）=>{}

(1)value成功的数据或者Promise对象

说明返回一个成功或者失败的Promise对象，如果传入的参数为非Promise类型的对象，则返回的结果为成功Promise对象

如果传入的参数为promise对象，则参数的结果决定了resolve的结果

5.Promise.reject 方法:(reason)=>{}

（1）reason :失败的原因

说明：返回一个失败的Promise对象

6.Promise.all 方法：（promises）=>{}

(1) promise包含n个Promise的数组

说明：返回一个新的Promise,只有所有的promise都成功才成功，结果值是promise数组中所有promise对象的结果组成的数组，只要有一个失败了就直接失败，结果值是失败的promise对象的结果值

7.Promise.race方法：（Promises）=>{}

说明：返回一个新的promise,第一个完成的promise的结果状态就是最终的结果状态

## Promise的几个关键问题

1.如何改变promise的状态

（1）resolve(value):如果当前是pending就会变为resolved

（2）reject（reason）：如果当前是pending就会变为rejected

  (3) 	抛出异常：如果当前是pending就会变为rejected

2.一个promise指定多个成功/失败回调函数，都会调用吗

​	当promise改变为对应状态时都会调用

3.改变promise状态和指定回调函数谁先谁后？

（1）都有可能，正常情况下是先指定回调再改变状态，但也可以先改状态再指定回调

（2）如何先改状态再指定回调？

​		①	在执行器中直接调用resolve()/reject()

​		②	延迟更长时间才调用then()

  (3)	什么时候才能得到数据？

​		① 	如果先指定的回调，那当状态发生改变时，回调函数就会调用，得到数据

​		②	如果先改变的状态，那当指定回调时，回调函数就会调用，得到数据

4. promise.then()返回的新promise的结果状态由什么决定？

​	⑴	简单表达：由then()指定的回调函数执行的结果决定

​	⑵	详细表达：

​		①	如果抛出异常，新promise变为rejected，reason为抛出的异常

​		②	如果返回的是非promise的任意值，新promise变为resolved，value为返回的值

​		③	如果返回的是另一个新promise，此promise的结果就会成为新promise的结果

5. promise 如何串联多个操作任务

   ⑴	promise的then()返回一个新的promise,可以开启then()的链式调用

   ⑵	通过then的链式调用串联多个同步/异步任务

6. promise的异常穿透？

   ⑴	当使用promise的then链式调用时,可以在最后指定失败的回调

   ⑵	前面任何操作出了异常，都会传到最后失败的回调中处理

7. 中断promise链？

   ⑴	当使用promise的then链式调用时，在中间中断，不再调用后面的回调函数

   ⑵	办法：在回调函数中返回一个pending状态的promise对象

   
