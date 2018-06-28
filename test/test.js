let coverage = require('../dist/index.js')
let majesty = require('majesty')

function exec(describe, it, beforeEach, afterEach, expect, should, assert) {

    let utils = require('./utils')
    let equals = require('./utils/equals')
    let ignored = require('./utils/ignored')

    describe("Testando coverage de testes", function () {
        it("Executando função simples", function () {
            expect(equals(true, true)).to.equal(true)
        });

        it("Executando função com ignoreIf", function () {
            utils.ignoreIf()
        });

        it("Executando função com ignoreElse", function () {
            utils.ignoreElse()
        });
    });

    describe("Gerando reports de coverage", function () {
        it("Testando saida do coverage", function () {
            // expect(coverage.getAverageCoverage()).to.be.gte(100)
        });
    });
}

coverage.init({
    ignore: [
        'utils/ignored.js'
    ]
})

let res = majesty.run(exec)

coverage.report()

exit(res.failure.length);