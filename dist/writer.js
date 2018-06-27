let fs = require('fs');
let StringBuilder = Java.type('java.lang.StringBuilder')

function Writer() {
    this.sb = new StringBuilder();
}

Writer.prototype.println = function println(str) {
    this.sb.append(str).append('\n');
}

Writer.prototype.saveToFile = function saveToFile(outFile) {
    fs.write(outFile, this.sb.toString());
}

exports = Writer;
