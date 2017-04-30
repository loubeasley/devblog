const _second = 1000;
const _minute = _second * 60;
const _hour = _minute * 60;
const _day = _hour * 24;

class CycleService {
    constructor($http, $timeout) {
        this.current_cycle = null;
        this.$http = $http;
        this.remainingTime = {};

        this.$timeout = $timeout;
        this.countdown = $timeout(this.updateClock.bind(this), 1000);
        this.ticks = 0;
    }

    updateClock() {
        this.ticks++;
        const end = new Date(this.current_cycle.end_date);
        const now = new Date();
        const distance = end - now;
        if (distance < 0) {
            this.remainingTime.toString = () => "EXPIRED";
            return;
        }

        const days = Math.floor(distance / _day);
        const hours = Math.floor((distance % _day) / _hour);
        const minutes = Math.floor((distance % _hour) / _minute);

        this.remainingTime = {
            days,
            hours,
            minutes,

            toString: () => {
                return `Next cycle: ${days} days`
            }
        };

        if(this.ticks > 50) {
            this.getCurrentCycle();
            this.ticks = 0;
        }

        this.countdown = this.$timeout(this.updateClock.bind(this), _minute);
    }

    getCurrentCycle() {
        return this.$http({
            method: 'GET',
            url: '/api/cycle/current'
        }).then((response) => {
            this.current_cycle = response.data.results;
            return response.data.results;
        });
    }

    get $inject() {
        return ['$http', '$timeout'];
    }
}

angular
    .module('components.inventory')
    .factory('CycleService', ($http, $timeout) => new CycleService($http, $timeout));