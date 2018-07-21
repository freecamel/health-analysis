// tslint:disable:no-object-mutation
// tslint:disable:no-expression-statement
// tslint:disable:prefer-const
// tslint:disable:no-let
// tslint:disable:readonly-array
// tslint:disable:object-literal-sort-keys
// tslint:disable:no-if-statement
// tslint:disable:ordered-imports
import moment from 'moment';
import * as fs from 'fs';
import * as _ from 'lodash';

function getTimeBucket(date1: Date, date2: Date): moment.Moment {
    const theDate = date1.getTime() < date2.getTime() ? date1 : date2;
    return moment(theDate).startOf('day');
}

function typeHeartData(data: string[]): any {
    const obj = {
        start: new Date(data[0]),
        // tslint:disable-next-line:object-literal-sort-keys
        finish: new Date(data[1]),
        count: Math.floor(+data[2]),
        day: null as any
    };

    obj.day = getTimeBucket(obj.start, obj.finish);

    return obj;
}

let projectDataDir = `${process.env.HEALTH_ANALYSIS_ROOT}/data/heart`.replace(/\\/g, '/');
let heartDataPath = `${projectDataDir}/heart rate.csv`;
// let heartSampleDataPath = `${projectDataDir}/heart rate sample.csv`;

// let hd = [];
// hd.length = 186824;
// let onDataCounter = -1;

let hd = _.chain(fs.readFileSync(heartDataPath, 'utf-8')
    .split('\n'))
    .tail()
    .map(r => r.split(','))
    .map(d => typeHeartData(d))
    .value();

console.log(hd.length);



// csv.fromPath(
//     heartDataPath, {
//         headers: true,
//         objectMode: false
//     } as any).
//     on("data", (data) => {
//         onDataCounter++;
//         if (onDataCounter % 1000 === 0) {
//             console.log(`lines read: ${onDataCounter}`);
//         }

//         hd[onDataCounter] = typeHeartData(JSON.parse(data as any));
//     }).
//     on("end", () => console.log(`completed: ${hd.length}`));