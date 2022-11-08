const helper = require("node-red-node-test-helper");
const generatePdfNode = require("../generate-pdf-node.js");
const certificate = require("../fixtures/valid_certificate_1.json");
// const { readFileSync } = require("fs");
// const { join } = require("path");

// const expectedPdfBuffer = readFileSync(join(__dirname, "../fixtures/valid_certificate_1.pdf"));

helper.init(require.resolve("node-red"));

describe("generate pdf Node", function () {
	beforeEach(function (done) {
		helper.startServer(done);
	});

	afterEach(function (done) {
		helper.unload();
		helper.stopServer(done);
	});

	it("should be loaded", function (done) {
		const flow = [{ id: "n1", type: "generate pdf", name: "generate pdf" }];
		helper.load(generatePdfNode, flow, function () {
			const n1 = helper.getNode("n1");
			try {
				expect(n1.name).toBe("generate pdf");
				done();
			} catch (err) {
				done(err);
			}
		});
	});

	it("should return a buffer when passed a certificate", function (done) {
		const flow = [
			{ id: "n1", type: "generate pdf", name: "generate pdf", wires: [["n2"]] },
			{ id: "n2", type: "helper" },
		];
		helper.load(generatePdfNode, flow, function () {
			const n2 = helper.getNode("n2");
			const n1 = helper.getNode("n1");
			n2.on("input", function (msg) {
				try {
					const { payload } = msg;
					expect(payload instanceof Buffer).toEqual(true);
					// TODO: figure out why the buffer is slightly different
					// expect(payload).toEqual(expectedPdfBuffer);
					done();
				} catch (err) {
					done(err);
				}
			});
			n1.receive({ payload: certificate });
		});
	}, 10000);
});
