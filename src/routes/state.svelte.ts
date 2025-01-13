
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
	
    async function updateScrambleDB(startTime: number, endTime: number, user_id: string, scramble: string, event: string){
        setTime(startTime, endTime)
		const response = await fetch('?/updateScrambleDB', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: JSON.stringify({
				scramble, 
				timeRecorded: endTime,
				minutes: time.minutes,
				seconds: time.seconds,
				ms: time.miliseconds,
				user_id: user_id,
                event
			}),
		});
		if (!response.ok) {
			console.error('Failed to update scramble DB', await response.text());
		} else {
			console.log('Scramble DB updated successfully');
		}           
	}

	return {
		get value() {
			return time;
		},
        increment,
        reset,
        updateScrambleDB
    }
}