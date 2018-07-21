export * from './lib/async';
export * from './lib/hash';
export * from './lib/number';
import * as heartAnalysis from './heart';

// tslint:disable-next-line:no-expression-statement
heartAnalysis.doAnalysis()
    .then(r => {
        console.log("Completed heart analysis");
        console.log(r);
    })
    .catch(error => {
        console.log("failed to process heart analysis:", error);
    });

