describe("work-wrap", function () {
	describe("wrap", function () {
		var wrap, wrappedTask;
		before(function () {
			wrap = window.Worker.wrap;
		});

		afterEach(function () {
			wrappedTask && wrappedTask.terminate();
		});

		it("should add a method to the Worker prototype", function () {
			expect(wrap).to.be.a('function');
		});

		it("should accept a single argument", function () {
			expect(wrap).to.have.lengthOf(1);
		});

		it("should return a function", function () {
			wrappedTask = wrap(function () {
			});
			expect(wrappedTask).to.be.a('function');
		});

		it("should return a Promise when executed the returned function", function () {
			wrappedTask = wrap(function () {
			});
			expect(wrappedTask()).to.be.instanceOf(Promise);
		});

		it("should run a simple task", function () {
			var taskFn = function () {
				return 'TASK_COMPLETE';
			};
			wrappedTask = wrap(taskFn);

			return wrappedTask().then(function (data) {
				expect(data).to.equal('TASK_COMPLETE');
			})
		});

		it("should run a task with arguments", function () {
			var taskFn = function () {
				return Array.prototype.join.call(arguments, '!');
			};
			wrappedTask = wrap(taskFn);

			return wrappedTask('one', 2, true).then(function (data) {
				expect(data).to.equal('one!2!true');
			})
		});

		it("should run a task with a function as an argument", function () {
			var taskFn = function (fn, value) {
					return fn(value);
				},
				passedFn = function (value) {
					return Math.pow(3, value);
				};
			wrappedTask = wrap(taskFn);

			return wrappedTask(passedFn, 4).then(function (data) {
				expect(data).to.equal(81);
			})
		});

		it("should run several times in a single worker", function () {
			var taskFn = function (value) {
				return Math.pow(2, value);
			};
			wrappedTask = wrap(taskFn);

			return Promise.all([wrappedTask(2), wrappedTask(3), wrappedTask(4)]).then(function (dataArr) {
				expect(dataArr).to.deep.equal([4, 8, 16]);
			});
		});

		it("should have a 'terminate' method", function () {
			wrappedTask = wrap(function () {
			});
			expect(wrappedTask.terminate).to.be.a('function');
		});

		it("should terminate a worker", function () {
			wrappedTask = wrap(function () {
			});
			wrappedTask.terminate();
			return wrappedTask().catch(function (err) {
				expect(err).to.equal("Worker has been terminated. Call `.restart()` before trying again.");
			});
		});

		it("should not fail when the worker termination doubles", function () {
			wrappedTask = wrap(function () {
			});
			expect(wrappedTask.terminate()).to.equal(true);
			expect(wrappedTask.terminate()).to.equal(false);
		});

		it("should restart a worker", function () {
			wrappedTask = wrap(function () {
			});
			wrappedTask.terminate();
			wrappedTask.restart();
			return wrappedTask();
		});
	});
});