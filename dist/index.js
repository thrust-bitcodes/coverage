let fs = require('fs')
let Instrumenter = require("./instrumenter")
let lcovReporter = require('./reporters/lcovonly')
let textSummaryReporter = require('./reporters/text-summary')
let utils = require('./object-utils')

let instrumenter = new Instrumenter()

/**
* Inicializa o sistema de coverage em runtime.
* Todo require realizado após a chamada deste método será instrumentado em runtime,
* para que então a cobertura possa ser calculada.
* @code coverage.init()
*/
function init() {
    dangerouslyLoadToGlobal('$coverageData', {});

    require.addInterceptor(function (path, content) {
        if (path.indexOf('.json') > -1) {
            return content;
        } else if (path.indexOf('.lib/bitcodes') > -1) {
            return content;
        }

        return instrumenter.instrumentSync(content, path);
    });
}

/**
* Confecciona o relatório de cobertura, printando-o no console e gerando um arquivo
* coverage/lcov.info
* @code coverage.report()
*/
function report() {
    let finalSummary = getExecSummary();

    let coverageFile = new java.io.File('coverage', 'lcov.info').getPath()

    lcovReporter.writeReport($coverageData, coverageFile)
    textSummaryReporter.writeReport(finalSummary);

    return finalSummary.average.pct;
}

/**
* Retorna a cobertura média da execução.
* @code coverage.getAverageCoverage()
*/
function getAverageCoverage() {
    return getExecSummary().average.pct;
}

function getExecSummary() {
    let summaries = Object.keys($coverageData).map(function (file) {
        return utils.summarizeFileCoverage($coverageData[file])
    })

    return utils.mergeSummaryObjects.apply(null, summaries)
}

exports = {
    init: init,
    report: report,
    getAverageCoverage: getAverageCoverage
};
