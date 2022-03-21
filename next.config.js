// next.config.js

const {join} = require('path');

module.exports = {
	webpack(config, { isServer, dev }) {
		config.experiments.asyncWebAssembly = true;
		config.plugins.push(
			new (class {
				apply(compiler) {
					compiler.hooks.afterEmit.tapPromise(
						"SymlinkWebpackPlugin",
						async (compiler) => {
							if (isServer) {
								const from = join(compiler.options.output.path, "../static");
								const to = join(compiler.options.output.path, "static");

								try {
									await from;
									console.log(`${from} already exists`);
									return;
								} catch (error) {
									if (error.code === "ENOENT") {
										// No link exists
									} else {
										throw error;
									}
								}

								await symlink(to, from, "junction");
								console.log(`created symlink ${from} -> ${to}`);
							}
						}
					);
				}
			})()
		);
		return config;
	},
};
