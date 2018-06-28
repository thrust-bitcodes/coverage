/* coverage ignore next */
function ignoreNext() {
    console.log('ignoreNext')
}

function ignoreIf() {
    let ignore = true;

    /* coverage ignore if */
    if (!ignore) {
        console.log('ignoreIf')
    }
}

function ignoreElse() {
    let ignore = true;

    /* coverage ignore else */
    if (ignore) {
        console.log('ignoreElse')
    } else {
        let a = 1;
    }
}

exports = {
    ignoreNext: ignoreNext,
    ignoreIf: ignoreIf,
    ignoreElse: ignoreElse
}