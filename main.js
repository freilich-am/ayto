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

function getForbiddenFromTruthBoothsAndBlackouts (truthBooths, ceremonies) {
    // todo: add
    return truthBooths
}

/*
let argumentObject = {}

for (let i = 0; i < matchingCeremonies.length; i++) {
    const ceremony = matchingCeremonies[i]
    const liveCouples = getLiveCouples(ceremony)
    const possibilities = getPossibilities(liveCouples, ceremony.freeBeams)
    possibilities.forEach(x => tryPossibility(x, matchingCeremonies, forbiddenMatches, argumentObject))
}

// an argument object is a series of cases looking like:
let argumentObject = [
    {
	name: 'Jonathan and Basit, Danny and Kai, in week 1;',
	forbiddenMatches: {}, // a forbidden matches object
	confirmedMatches: [], // an array of matches
	ceremonyTotals: {}, // a ceremonies object
	subCases: [] // an array of cases
    }
]

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

// console.log(JSON.stringify(argumentObject, null, 2))
*/
