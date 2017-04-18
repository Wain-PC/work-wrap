(function () {
	var functionToObjectURL = function (fn) {
			var blob, stringFunc = fn.toString();
			stringFunc = stringFunc.substring(stringFunc.indexOf('{') + 1, stringFunc.lastIndexOf('}'));
			try {
				blob = new Blob([stringFunc], {'type': 'text/javascript'});
			} catch (error) { // Backwards-compatibility
				var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
				blob = new BlobBuilder();
				blob.append(stringFunc);
				blob = blob.getBlob();
			}
			return (window.URL || window.webkitURL).createObjectURL(blob);
		},
		fnUrl = functionToObjectURL(function () {
			self.onmessage = function (event) {
				var message = event.data,
					args = message.args.map(function (arg) {
						if (arg && arg.indexOf && !arg.indexOf('!FN!')) {
							return eval('(' + arg.substr(4) + ')');
						}
						return arg;
					});

				try {
					self.postMessage({
						id: message.id,
						result: eval('(' + message.func + ')').apply(null, args)
					});
				} catch (e) {
					self.postMessage({id: message.id, error: e.message});
				}
			}
		}),
		createAndListen = function () {
			var worker = new Worker(fnUrl);
			worker.queue = {index: 0};
			worker.addEventListener('message', function (e) {
				if (e.data.hasOwnProperty('result')) {
					this.queue[e.data.id].resolve(e.data.result);
				}
				else {
					this.queue[e.data.id].reject(e.data.error);
				}
				delete this.queue[e.data.id];
			});
			return worker;
		};

	window.Worker.wrap = function (fn) {
		var worker = createAndListen(),
			retFunc = function () {
				var args = Array.prototype.slice.call(arguments).map(function (arg) {
					if (typeof arg === 'function') {
						return '!FN!' + arg.toString();
					}
					return arg;
				});

				if (!worker) {
					return Promise.reject("Worker has been terminated. Call `.restart()` before trying again.");
				}

				worker.postMessage({
					id: ++worker.queue.index,
					func: fn.toString(),
					args: args
				});
				return (function (index) {
					return new Promise(function (resolve, reject) {
						worker.queue[index] = {
							resolve: resolve,
							reject: reject
						};
					});
				})(worker.queue.index);


			};
		retFunc.terminate = function () {
			if (!worker) {
				return false;
			}
			worker.terminate();
			worker = null;
			return true;
		};

		retFunc.restart = function () {
			worker = createAndListen();
		};
		return retFunc;
	};
})();