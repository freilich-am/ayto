const setup = require('./setupAfterWeek5')
//console.log(JSON.stringify(setup, null, 2))

const truthBooths = mirror(setup.truthBooths)

function mirror (truthBooths) {
    let result = {}
    Object.keys(truthBooths).forEach(first => {
	result[first] = result[first] || {}
	Object.keys(truthBooths[first]).forEach(second => {
	    result[second] = result[second] || {}
	    result[first][second] = result[second][first] = truthBooths[first][second]
	})
    })
    console.log(result)
    return result
}

const forbiddenMatches = getForbiddenFromTruthBoothsAndBlackouts(truthBooths, setup.ceremonies)

// console.log(JSON.stringify(forbiddenMatches, null, 2))

function getForbiddenFromTruthBoothsAndBlackouts (truthBooths, ceremonies) {
    let result = JSON.parse(JSON.stringify(truthBooths))
    ceremonies.filter(ceremony => !ceremony.freeBeams).forEach(ceremony => {
	Object.keys(ceremony.matching).forEach(key => {
	    result[key] = result[key] || {}
	    result[key][ceremony.matching[key]] = false
	})
    })
    return result
}

const unresolvedCeremonies = setup.ceremonies.filter(ceremony => ceremony.freeBeams)

let argumentObject = [
    {
	name: 'Week 5 (Jonathan and Basit)',
	forbidden: forbiddenMatches,
	ceremonies: unresolvedCeremonies,
	matchings: [['Jonathan', 'Basit']],
	cases: expandCases(forbiddenMatches, unresolvedCeremonies, [['Jonathan', 'Basit']], true),
	notes: ''
    }
]

// printArgumentObject(argumentObject)

// todo: print function for forbidden
// todo: print function for matchings

function printArgumentObject (argumentObject, nestingLevel = 0, prefix = '') {
    argumentObject.forEach(currCase => {
	let lines = []
	lines.push('The case we are considering is ' + prefix + '; ' + currCase.name)
	const matchesString = currCase.matchings.map(x => x[0] + ' & ' + x[1]).join(', ')
	lines.push('So far we have matched up: ' + matchesString)
	// todo: some stuff about the ceremonies and state of forbidden matches?
	if (currCase.notes) lines.push('Notes: ' + notes)
	console.log(lines)
	lines.forEach(line => {
	    console.log(Array(nestingLevel + 1).join(' ') + line)
	})
	printArgumentObject(currCase.cases, nestingLevel + 1, prefix + `; ${currCase.name}`)
    })
}

function expandCases (forbidden, ceremonies, matchings, recursive = false) {
    // first, incorporate matches, removing all references etc
    // second, update ceremonies and remove resolved
    // third find an available ceremony and choose its matches
    // add the rest of the ceremony's matches to forbidden
    // if none available, terminate
    const newForbidden = {}
    const newCeremonies = []
    // const matches = []
    return possibilities.map(pos => {
	const newMatchings = [..matchings, ..possibility] // wrong syntax?
	return {
	    name: stringify(pos),
	    forbidden: newForbidden,
	    ceremonies: newCeremonies,
	    matchings: newMatchings,
	    cases: recusive ? expandCases(newForbidden, newCeremonies, newMatchings, recursive - 1) : [],
	    notes: ''
	}
    })
}

/*
function getLiveCouples (ceremony, forbiddenMatches) {
    // go through the couples in the ceremony and filter based on forbidden matches
}

// a possibility is an array of matches
function getPossibilities (liveCouples, numBeams) {
    // this is a simple choose operation, choose all sets of size numBeams from liveCouples, return those arrays
    
}

function tryPossibility (possibility, matchingCeremonies, forbiddenMatches, argumentObject) {
    // add the rest of the couples from the ceremony to forbidden matches
    // adjust the free beams in the remaining matching ceremonies
    // add all of the couples in the possibility
}

function addCouple (couple, matchingCeremonies, forbiddenMatches) {
    // remove all references to the couple from the matching ceremonies and forbiddenMatches
}
*/
