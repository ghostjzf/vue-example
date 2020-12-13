import { EventEmitter } from './event';
const raf = require('raf');

export interface RemainTimeData {
    /** 天数 */
    days: number;
    /**
     * 小时数
     */
    hours: number;
    /**
     * 分钟数
     */
    minutes: number;
    /**
     * 秒数
     */
    seconds: number;
    /**
     * 毫秒数
     */
    count: number;
}

export type CountdownCallback = (remainTimeData: RemainTimeData, remainTime: number) => void;

enum CountdownStatus {
    running,
    paused,
    stoped,
}

interface CountdownOptions {
    showTwoMillSecond?: boolean;
}

export class Countdown extends EventEmitter {
    private static COUNT_IN_MILLISECOND: number = 1 * 100;
    private static SECOND_IN_MILLISECOND: number = 10 * Countdown.COUNT_IN_MILLISECOND;
    private static MINUTE_IN_MILLISECOND: number = 60 * Countdown.SECOND_IN_MILLISECOND;
    private static HOUR_IN_MILLISECOND: number = 60 * Countdown.MINUTE_IN_MILLISECOND;
    private static DAY_IN_MILLISECOND: number = 24 * Countdown.HOUR_IN_MILLISECOND;

    private endTime: number;
    private remainTime: number = 0;
    private status: CountdownStatus = CountdownStatus.stoped;
    private step: number;
    private options: CountdownOptions;

    constructor(endTime: number, step: number = 1e3, options: CountdownOptions = {}) {
        super();

        this.endTime = endTime;
        this.step = step;
        this.options = options;

        this.start();
    }

    start() {
        this.emit('start');

        this.status = CountdownStatus.running;
        this.countdown();
    }

    stop() {
        this.emit('stop');

        this.status = CountdownStatus.stoped;
    }

    pause() {
        this.emit('pause');

        this.status = CountdownStatus.paused;
    }

    private countdown() {
        if (this.status !== CountdownStatus.running) {
            return;
        }

        this.remainTime = Math.max(this.endTime - Date.now(), 0);

        this.emit('countdown', this.parseRemainTime(this.remainTime), this.remainTime);

        if (this.remainTime > 0) {
            if (this.options.showTwoMillSecond) {
                raf(() => this.countdown());
            } else {
                setTimeout(() => this.countdown(), this.step);
            }
        } else {
            this.stop();
        }
    }

    private parseRemainTime(remainTime: number): RemainTimeData {
        let time = remainTime;

        const days = Math.floor(time / Countdown.DAY_IN_MILLISECOND);
        time = time % Countdown.DAY_IN_MILLISECOND;

        const hours = Math.floor(time / Countdown.HOUR_IN_MILLISECOND);
        time = time % Countdown.HOUR_IN_MILLISECOND;

        const minutes = Math.floor(time / Countdown.MINUTE_IN_MILLISECOND);
        time = time % Countdown.MINUTE_IN_MILLISECOND;

        const seconds = Math.floor(time / Countdown.SECOND_IN_MILLISECOND);
        time = time % Countdown.SECOND_IN_MILLISECOND;

        let count = time;
        if (!this.options.showTwoMillSecond) {
            count = Math.floor(time / Countdown.COUNT_IN_MILLISECOND);
        }

        return {
            days,
            hours,
            minutes,
            seconds,
            count,
        };
    }
}
