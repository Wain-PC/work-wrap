# work-wrap
This tiny library makes your heavy JS code run in a separate thread in the browser.

## install

```
npm install work-wrap

or

yarn add work-wrap
```

## Usage

The code will add a single `wrap` method to the `window.Worker` object (if available). It'll fail silently when there's no `Worker` object on `window`.

## [Function] Worker.wrap(Function)

You can wrap any function as long as it's pure (**_it must not depend on any external variables_**).

```javascript
function pow(number) {
	return Math.pow(number, 2);
}

var wrappedPow = Worker.wrap(pow);
wrappedPow(3).then(function (result) {
	console.log(result); //9
});
```

You can pass to the wrapped function any arguments that can be serialized to JSON **and pure functions**.

Example of passing a function:
```javascript
function run(fn,number) {
	return fn(number);
}

var wrappedPow = Worker.wrap(run),
    passedFn = function(value) {
        return Math.pow(value, 2);
    }
wrappedPow(passedFn, 3).then(function (result) {
	console.log(result); //9
});
```


## wrappedFn.terminate

When you run terminate the task, it will destroy the worker behind that task. If the worker was running a task, it'll **not** be finished, so make sure you terminate the worker after the work has been completed.

```javascript
task = Worker.wrap(function() {
    //your heavy code here
});

//Perform your heavy task any number of times.
task();

//When you don't need your heavy task anymore, terminate the worker to free the resources and avoid memory leaks.

task.terminate();
```


## wrappedFn.restart

If you have terminated the task, the worker behind it can be restarted without wrapping the same function again. Just call `task.restart()`.

```javascript
task = Worker.wrap(function() {
    //your heavy code here
});

task.terminate();

//..Some time later you need to run the task again.
task.restart();

//Run normally.
task().then(...)
```
