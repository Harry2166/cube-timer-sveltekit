
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
    let eventString: string = $state("333")
    let solvesToShow: Solve[] = $derived(solves.filter(sameEvent))
    let currMo3: number = $state(0)
    let currAo5: number = $state(0)
    let currAo12: number = $state(0)

    function setSolves(givenSolves: Solve[]) {
        solves = givenSolves
        calculateAverages()
    }

    function setEvent(strEvent: string) {
        eventString = strEvent
        calculateAverages()
    }
    
    function calculateAverages() {
        if (solvesToShow.length != 0) {
            currMo3 = trimmedAvg(3)
            currAo5 = trimmedAvg(5)
            currAo12 = trimmedAvg(12)
        }
    }
    
	function sameEvent(solve: Solve){
        return eventString == solve.event
    }

    async function updateSolves(user_id: string) {
        const response = await fetch('?/getMostRecentSolve', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: JSON.stringify({
				user_id: user_id,
			}),
		});
        if (!response.ok) {
			console.error('Failed to get from scramble DB', await response.text());
		} else {
			console.log('Scramble DB gottened');
            const responseData = await response.json()
            const newSolveData = JSON.parse(responseData.data)
            const mapping = newSolveData[0]
            const newSolve: Solve = {
                solveId : newSolveData[mapping["solveId"]],
                scramble : newSolveData[mapping["scramble"]],
                userId : newSolveData[mapping["userId"]],
                minutes : newSolveData[mapping["minutes"]],
                seconds : newSolveData[mapping["seconds"]],
                ms : newSolveData[mapping["ms"]],
                timeRecord : newSolveData[mapping["timeRecord"]],
                event : newSolveData[mapping["event"]],
                isDNF : newSolveData[mapping["isDNF"]],
                isPlusTwo : newSolveData[mapping["isPlusTwo"]],
            }
            solves.push(newSolve)
            trimmedAvg(3)
            trimmedAvg(5)
            trimmedAvg(12)
		}           
    }

    function convertToSolveTimes (num: number) {
        let arr: number[] = []
        const startingIdx: number = solvesToShow.length - num
        for (let i = startingIdx; i < solvesToShow.length; i++){
            arr.push(solvesToShow[i].minutes * 60000 + solvesToShow[i].seconds*1000 + solvesToShow[i].ms)
        }
        return arr
    }

    // async function updateAvg(user_id: string, avg: number, avgNumber: number) {
    //     const response = await fetch('?/updateAvg', {
	// 		method: 'POST',
	// 		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	// 		body: JSON.stringify({
	// 			user_id: user_id,
    //             avg: avg,
    //             avgNumber: avgNumber
	// 		}),
	// 	});
    //     if (!response.ok) {
	// 		console.error('Failed to get from Avg DB', await response.text());
	// 	} else {
	// 		console.log('Avg DB gottened');
	// 	}           
    // }

    function trimmedAvg (avgNumber: number){
        if (solvesToShow.length < avgNumber) {
            return 0
        }
        const sortedValues = convertToSolveTimes(avgNumber)
        const maxValue = Math.max(...sortedValues)
        const minValue = Math.min(...sortedValues)
        const removedValues = sortedValues.filter((num) => {
            return minValue < num && num < maxValue
        })
        let value = sum(removedValues) / removedValues.length
        if (avgNumber == 3) {
            value = (sum(sortedValues)/3)
            currMo3 = value
        } else if (avgNumber == 5){
            currAo5 = value
        } else if (avgNumber == 12) {
            currAo12 = value
        }

        return value
    }

    return {
        get value() {
            return solves 
        },
        setSolves,
        updateSolves,
        trimmedAvg,
        setEvent,
        get currMo3() {
            return currMo3
        },
        get currAo5() {
            return currAo5
        },
        get currAo12() {
            return currAo12
        },
        get solvesToShow() {
            return solvesToShow
        }
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

function sum(arr: number[]) {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i]
    }
    return sum
}