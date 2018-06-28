const DEFAULT_MARKS = {
    statements: [50, 80],
    lines: [50, 80],
    functions: [50, 80],
    branches: [50, 80],
    average: [50, 80]
};

exports = {
    watermarks: function (options) {
        let customMarks = options && options.marks;

        if (!customMarks) {
            return DEFAULT_MARKS;
        } else {
            if (customMarks.constructor.name == 'Array') {
                let marks = {};

                Object.keys(DEFAULT_MARKS).forEach(function (type) {
                    marks[type] = customMarks
                })

                return marks;
            } else {
                return Object.assign(DEFAULT_MARKS, customMarks);
            }
        }
    },

    classFor: function (type, metrics, watermarks) {
        var mark = watermarks[type],
            value = metrics[type].pct;

        return value >= mark[1] ? 'high' : value >= mark[0] ? 'medium' : 'low';
    },

    colorize: function (str, clazz) {
        /* istanbul ignore if: untestable in batch mode */
        var colors = {
            low: '31;1',
            medium: '33;1',
            high: '32;1'
        };

        if (colors[clazz]) {
            return '\u001b[' + colors[clazz] + 'm' + str + '\u001b[0m';
        }
        return str;
    }
};

