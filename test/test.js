let majesty = require('majesty')
let coverage = require('../dist/index.js');

function exec(describe, it, beforeEach, afterEach, expect, should, assert) {

    let equals = require('./utils/equals')

    describe("Testando coverage de testes", function () {
        it("Executando função simples", function () {
            expect(equals(true, true)).to.equal(true);
        });
    });

    describe("Gerando reports de coverage", function () {
        it("Testando saida do coverage", function () {
            expect(coverage.getAverageCoverage()).to.be.gte(100);
        });
    });
}

coverage.init();

let res = majesty.run(exec)

coverage.report();

exit(res.failure.length);