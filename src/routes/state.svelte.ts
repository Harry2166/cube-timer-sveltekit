
export function createTimer() {
	let time = $state({
        minutes: 0,
        seconds: 0,
        miliseconds: 0
    });

    function increment() {
        // time.miliseconds += 1
        // if (time.miliseconds == 1000) {
        //     time.seconds += 1
        //     time.miliseconds = 0
        // }
        // time.seconds += 1
        
        if (time.seconds == 60) {
            time.minutes += 1
            time.seconds = 0
        }
    }

    function setTime(startTime: number, endTime: number) {
        let result = endTime - startTime
        let minutes = Math.floor((result % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((result % (1000 * 60)) / 1000);
        let miliseconds = result % 1000
        time.seconds = seconds
        time.minutes = minutes
        time.miliseconds = miliseconds
    }

    function reset() {
        time.miliseconds = 0
        time.seconds = 0
        time.minutes = 0
    }

	return {
		get value() {
			return time;
		},
        increment,
        reset,
        setTime
	}
}