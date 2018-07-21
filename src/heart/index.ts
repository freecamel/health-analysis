import * as fs from "fs";
import * as _ from "lodash";
import * as util from "util";

const readFileAsync = util.promisify(fs.readFile);

export interface HeartAnalysisSummary {
    readonly rows: number;
    readonly sampleLine: string;
    readonly averageHeartRateInfo: {
        readonly avg: number;
        readonly count: number;
        readonly totalRate: number;
        readonly median?: number;
    };
}

export async function doAnalysis(): Promise<HeartAnalysisSummary> {
    console.log("starting Heart analysis");

    const result = await readFileAsync(
        'e:/sources/health-analysis/data/heart/Heart Rate.csv', {
            encoding: "utf8"
        });

    const lines = _.chain(result)
        .split('\n')
        .tail()
        .value();

    const sampleLine = _.head(lines) || "No lines found!";

    const skipCount = lines.length / 2;

    const validSamples = _.chain(lines)
        .map(l => _.last(l.split(',')))
        .map(rate => +(rate || 0))
        // .filter(rate => rate > 0)
        // .filter(rate => rate < 75)
        .drop(skipCount);

    const sorted = validSamples.sort().value();

    // close enough :)
    const median = sorted[Math.floor(sorted.length / 2)];

    console.log(median);

    const avgHeartRateInfo = validSamples
        .map(rate => ({ avg: rate, count: 1, totalRate: rate }))
        .reduce((acc, next) => ({
            avg: (acc.totalRate + next.totalRate) / (acc.count + next.count),
            count: acc.count + next.count,
            totalRate: acc.totalRate + next.totalRate,
        }), { totalRate: 0, count: 0, avg: 0 })
        .value();

    return {
        averageHeartRateInfo: { ...avgHeartRateInfo, median },
        rows: lines.length,
        sampleLine,
    };
}
