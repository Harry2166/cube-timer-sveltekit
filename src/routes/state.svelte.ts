
type Solve = {
    solveId: number;
    scramble: string | null;
    userId: string;
    minutes: number;
    seconds: number;
    ms: number;
    timeRecord: number;
    event: string | null;
    isDNF: number;
    isPlusTwo: number;
}

export function createSolvesArr() {
    let solves: Solve[] = $state([])

    function setSolves(givenSolves: Solve[]) {
        solves = givenSolves
    }

    function updateSolves(newSolve: Solve) {
        solves.push(newSolve)
    }

    function convertToSolveTimes (num: number) {
        let arr: number[] = $state([])
        const startingIdx: number = solves.length - num
        for (let i = startingIdx; i < solves.length; i++){
            // converting it into miliseconds
            arr.push(solves[i].minutes * 60000 + solves[i].seconds*1000 + solves[i].ms)
        }
        return arr
    }

    // https://stackoverflow.com/questions/20202719/truncated-mean-javascript
    function trimmedAvg (avgNumber: number, trimPercent: number){
        const sortedValues = convertToSolveTimes(avgNumber).sort()
        const trimCount = Math.floor(sortedValues.length * ((trimPercent / 2) * 0.01))
        const trimmedValues = sortedValues.slice(trimCount, sortedValues.length - trimCount)
        if (!trimmedValues.length) return null
        const sum = trimmedValues.reduce((acc, value) => acc + value, 0)
        return sum / trimmedValues.length
    }

    return {
        get value() {
            return solves
        },
        setSolves,
        updateSolves,
        trimmedAvg
    }

}

export function createTimer() {
	let time = $state({
        minutes: 0,
        seconds: 0,
        miliseconds: 0
    });

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
	
    async function updateSolvesDB(startTime: number, endTime: number, user_id: string, scramble: string, event: string){
        setTime(startTime, endTime)
		const response = await fetch('?/updateSolvesDB', {
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
		// const responseData = await response.json()
        // console.log(responseData.data)
        // console.log(responseData.data.tite)
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
        reset,
        updateSolvesDB
    }
}