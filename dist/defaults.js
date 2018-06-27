exports = {
    watermarks: function () {
        return {
            statements: [50, 80],
            lines: [50, 80],
            functions: [50, 80],
            branches: [50, 80],
            average: [50, 80]
        };
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

