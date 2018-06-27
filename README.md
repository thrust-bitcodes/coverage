Coverage [![Build Status](https://travis-ci.org/thrust-bitcodes/coverage.svg?branch=master)](https://travis-ci.org/thrust-bitcodes/coverage)
===============

Coverage é um *bitcode* para [thrust](https://github.com/thrustjs/thrust) utilizado para calcular a cobertura de códigos.

# Instalação

Posicionado em um app [thrust](https://github.com/thrustjs/thrust), no seu terminal:

```bash
thrust install coverage
```

## Tutorial

Primeiro vamos configurar nosso arquivo de testes para que o coverage dos testes seja contabilizado, como mostrado abaixo:

```javascript
let majesty = require('majesty')
let coverage = require('coverage')

function exec (describe, it, beforeEach, afterEach, expect, should, assert) {
    let equals = require('./utils/equals')

    describe("Testando coverage de testes", function () {
        it("Executando função simples", function () {
            expect(equals(true, true)).to.equal(true)
        });
    });

    describe("Gerando reports de coverage", function () {
        it("Testando saida do coverage", function () {
            expect(coverage.getAverageCoverage()).to.be.gte(100)
        });
    });
}

coverage.init()

let res = majesty.run(exec)

coverage.report()

exit(res.failure.length)
```

## API

```javascript
/**
* Inicializa o sistema de coverage em runtime.
* Todo require realizado após a chamada deste método será instrumentado em runtime,
* para que então a cobertura possa ser calculada.
* @code coverage.init()
*/
function init()

/**
* Retorna a cobertura média da execução.
* @code coverage.getAverageCoverage()
*/
function getAverageCoverage()

/**
* Confecctiona o relatório de cobertura, printando-o no console e gerando um arquivo
* coverage/lcov.info
* @code coverage.report()
*/
function report() 
```

Acesse também os outros *bitcodes* utilizados no exemplo para melhor entendimento:

- [thrust-bitcodes/majesty](https://github.com/thrust-bitcodes/majesty)