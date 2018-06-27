let utils = require('../object-utils')
let Writer = require('../writer')

function writeReport(coverageData, outFile) {
    let writer = new Writer()

    for (let file in coverageData) {
        writeFileCoverage(writer, coverageData[file]);
    }

    writer.saveToFile(outFile);
}

function writeFileCoverage(writer, fc) {
    let summary = utils.summarizeFileCoverage(fc),
        functions = fc.f,
        functionMap = fc.fnMap,
        lines = fc.l,
        branches = fc.b,
        branchMap = fc.branchMap;

    writer.println('TN:'); //no test name
    writer.println('SF:' + fc.path);

    Object.keys(functions).forEach(function (key) {
        let meta = functionMap[key];
        writer.println('FN:' + [meta.line, meta.name].join(','));
    });

    writer.println('FNF:' + summary.functions.total);
    writer.println('FNH:' + summary.functions.covered);

    Object.keys(functions).forEach(function (key) {
        let stats = functions[key]
        let meta = functionMap[key]

        writer.println('FNDA:' + [stats, meta.name].join(','));
    });

    if (lines) {
        Object.keys(lines).forEach(function (key) {
            var stat = lines[key];
            writer.println('DA:' + [key, stat].join(','));
        });
    }

    writer.println('LF:' + summary.lines.total);
    writer.println('LH:' + summary.lines.covered);

    Object.keys(branches).forEach(function (key) {
        var branchArray = branches[key],
            meta = branchMap[key],
            line = meta.line,
            i = 0;
        branchArray.forEach(function (b) {
            writer.println('BRDA:' + [line, key, i, b].join(','));
            i += 1;
        });
    });

    writer.println('BRF:' + summary.branches.total);
    writer.println('BRH:' + summary.branches.covered);
    writer.println('end_of_record');
}

function summarizeFileCoverage(fileCoverage) {
    var ret = blankSummary();

    addDerivedInfoForFile(fileCoverage);

    ret.lines = computeSimpleTotals(fileCoverage, 'l');
    ret.functions = computeSimpleTotals(fileCoverage, 'f', 'fnMap');
    ret.statements = computeSimpleTotals(fileCoverage, 's', 'statementMap');
    ret.branches = computeBranchTotals(fileCoverage);
    ret.linesCovered = fileCoverage.l;

    return ret;
}

function blankSummary() {
    return {
        lines: {
            total: 0,
            covered: 0,
            skipped: 0,
            pct: 'Unknown'
        },
        statements: {
            total: 0,
            covered: 0,
            skipped: 0,
            pct: 'Unknown'
        },
        functions: {
            total: 0,
            covered: 0,
            skipped: 0,
            pct: 'Unknown'
        },
        branches: {
            total: 0,
            covered: 0,
            skipped: 0,
            pct: 'Unknown'
        },
        linesCovered: {}
    };
}

function addDerivedInfoForFile(fileCoverage) {
    var statementMap = fileCoverage.statementMap,
        statements = fileCoverage.s,
        lineMap;

    if (!fileCoverage.l) {
        fileCoverage.l = lineMap = {};
        Object.keys(statements).forEach(function (st) {
            var line = statementMap[st].start.line,
                count = statements[st],
                prevVal = lineMap[line];

            if (count === 0 && statementMap[st].skip) {
                count = 1;
            }

            if (typeof prevVal === 'undefined' || prevVal < count) {
                lineMap[line] = count;
            }
        });
    }
}

function computeSimpleTotals(fileCoverage, property, mapProperty) {
    var stats = fileCoverage[property],
        map = mapProperty ? fileCoverage[mapProperty] : null,
        ret = { total: 0, covered: 0, skipped: 0 };

    Object.keys(stats).forEach(function (key) {
        var covered = !!stats[key],
            skipped = map && map[key].skip;

        ret.total += 1;

        if (covered || skipped) {
            ret.covered += 1;
        }

        if (!covered && skipped) {
            ret.skipped += 1;
        }
    });

    ret.pct = percent(ret.covered, ret.total);

    return ret;
}

function computeBranchTotals(fileCoverage) {
    var stats = fileCoverage.b,
        branchMap = fileCoverage.branchMap,
        ret = { total: 0, covered: 0, skipped: 0 };

    Object.keys(stats).forEach(function (key) {
        var branches = stats[key],
            map = branchMap[key],
            covered,
            skipped,
            i;

        for (i = 0; i < branches.length; i += 1) {
            covered = branches[i] > 0;
            skipped = map.locations && map.locations[i] && map.locations[i].skip;

            if (covered || skipped) {
                ret.covered += 1;
            }

            if (!covered && skipped) {
                ret.skipped += 1;
            }
        }

        ret.total += branches.length;
    });

    ret.pct = percent(ret.covered, ret.total);

    return ret;
}

function percent(covered, total) {
    if (total > 0) {
        let tmp = 1000 * 100 * covered / total + 5;
        return Math.floor(tmp / 10) / 100;
    } else {
        return 100.00;
    }
}

function mergeFileCoverage(first, second) {
    var ret = JSON.parse(JSON.stringify(first)),
        i;

    delete ret.l; //remove derived info

    Object.keys(second.s).forEach(function (k) {
        ret.s[k] += second.s[k];
    });
    Object.keys(second.f).forEach(function (k) {
        ret.f[k] += second.f[k];
    });
    Object.keys(second.b).forEach(function (k) {
        var retArray = ret.b[k],
            secondArray = second.b[k];
        for (i = 0; i < retArray.length; i += 1) {
            retArray[i] += secondArray[i];
        }
    });

    return ret;
}

exports = {
    writeReport: writeReport
}