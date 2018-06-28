let Paths = Java.type('java.nio.file.Paths')

let fs = require('fs')
let Instrumenter = require("./instrumenter")
let lcovReporter = require('./reporters/lcovonly')
let textSummaryReporter = require('./reporters/text-summary')
let utils = require('./object-utils')

let instrumenter = new Instrumenter()

const DEFAULT_IGNORED = ['.lib/**', '*.json'];

/**
* Inicializa o sistema de coverage em runtime.
* Todo require realizado após a chamada deste método será instrumentado em runtime,
* para que então a cobertura possa ser calculada.
* @code coverage.init()
*/
function init(options) {
    dangerouslyLoadToGlobal('$coverageData', {})

    let jFs = java.nio.file.FileSystems.getDefault()

    let ignoreMatchers = DEFAULT_IGNORED.concat((options && options.ignore) || [])
        .map(function (pattern) {
            return jFs.getPathMatcher('glob:' + pattern);
        })

    require.addInterceptor(function (path, content) {
        let localPath = Paths.get(rootPath).relativize(Paths.get(path))

        let excludeFile = ignoreMatchers.find(function (matcher) {
            return matcher.matches(localPath)
        })

        if (excludeFile) {
            return content;
        }

        return instrumenter.instrumentSync(content, path)
    });
}

/**
* Confecciona o relatório de cobertura, printando-o no console e gerando um arquivo
* coverage/lcov.info
* @code coverage.report()
*/
function report(options) {
    let finalSummary = getExecSummary()

    let coverageFile = new java.io.File('coverage', 'lcov.info').getPath()

    lcovReporter.writeReport($coverageData, coverageFile, options && options.lcov)
    textSummaryReporter.writeReport(finalSummary, options && options.console)

    return finalSummary.average.pct
}

/**
* Retorna a cobertura média da execução.
* @code coverage.getAverageCoverage()
*/
function getAverageCoverage() {
    return getExecSummary().average.pct
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
