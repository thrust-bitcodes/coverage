let defaults = require('../defaults')
let fs = require('fs');

function writeReport(coverageSummary, options) {
    let watermarks = defaults.watermarks(options)

    let lines = []

    lines.push('');

    lines.push('=============================== Coverage summary ===============================');

    lines.push.apply(lines, [
        lineForKey(coverageSummary, 'statements', watermarks),
        lineForKey(coverageSummary, 'branches', watermarks),
        lineForKey(coverageSummary, 'functions', watermarks),
        lineForKey(coverageSummary, 'lines', watermarks),
        '',
        lineForKey(coverageSummary, 'average', watermarks),
    ]);

    lines.push('================================================================================');

    if (options && options.file) {
        fs.write(options.file, lines.join('\n'))
    } else {
        console.log(lines.join('\n'));
    }

    
}

function lineForKey(summary, key, watermarks) {
    var metrics = summary[key],
        result,
        clazz = defaults.classFor(key, summary, watermarks);

    key = key.substring(0, 1).toUpperCase() + key.substring(1);

    if (key.length < 12) {
        key += '                   '.substring(0, 12 - key.length);
    }

    result = [key, ':', metrics.pct + '%'];

    if (metrics.covered && metrics.total) {
        result.push.apply(result, ['(', metrics.covered + '/' + metrics.total, ')']);
    }

    if (metrics.skipped > 0) {
        result.push.apply(result, [',', metrics.skipped, 'ignored']);
    }

    return defaults.colorize(result.join(' '), clazz);
}



exports = {
    writeReport: writeReport
};
