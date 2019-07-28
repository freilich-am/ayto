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
  //    console.log(result)
  return result
}

const forbiddenMatches = getForbiddenFromTruthBoothsAndBlackouts(truthBooths, setup.ceremonies)

// console.log(JSON.stringify(forbiddenMatches, null, 2))

function getForbiddenFromTruthBoothsAndBlackouts (truthBooths, ceremonies) {
  let result = JSON.parse(JSON.stringify(truthBooths))
  ceremonies.filter(ceremony => !ceremony.freeBeams).forEach(ceremony => {
    Object.keys(ceremony.matching).forEach(key => {
      result[key] = result[key] || {}
      result[key][ceremony.matching[key]] = true // true = yes forbidden
    })
  })
  return result
}


const ceremonies = calculateLiveMatchings(setup.ceremonies, forbiddenMatches, [["Basit", "Jonathan"], ['Danny', 'Kai']])

// console.log(JSON.stringify(ceremonies, null, 2))

function calculateLiveMatchings (ceremonies, forbiddenMatches, matchings) {
  //    console.log(JSON.stringify(ceremonies))
  return ceremonies.map(x => findLiveMatches(x, forbiddenMatches, matchings))
}

// todo: incorporate initial matchings into initialization

function findLiveMatches(ceremony, forbiddenMatches, matchings) {
  const currMatching = ceremony.matching
  let res = ceremony
  const liveMatchings = Object.keys(currMatching)
	.filter(key => key < currMatching[key]) // take each pair once
	.filter(key => {
	  return !forbiddenMatches[key][currMatching[key]] // remove the forbidden
	})
	.map(key => [key, currMatching[key]]) // return as array
	.filter(x => {
	  let isMatchMatched = false
	  let isMemberMatched = false
	  matchings.forEach(matching => {
	    isMatchMatched = isMatchMatched || matching[0] === x[0] && matching[1] === x[1]
	    isMemberMatched = isMemberMatched || !!x.filter(value => matching.includes(value)).length
	  })
	  if (isMatchMatched) {
	    ceremony.freeBeams--
	  }
	  if (isMemberMatched) {
	    delete res.matching[x[0]]
	    delete res.matching[x[1]]
	  }
	  return (!isMemberMatched && !isMatchMatched)
	})
  res.liveMatches = liveMatchings
  return res
  
}

const unresolvedCeremonies = ceremonies.filter(ceremony => ceremony.freeBeams)

// console.log('unresolved ceremonies', JSON.stringify(unresolvedCeremonies, null, 2))

let argumentObject = [
  {
    name: 'Week 5 (Jonathan and Basit, Danny and Kai)', // always put in alphabetical order?
    forbidden: forbiddenMatches,
    ceremonies: unresolvedCeremonies,
    matchings: [["Basit", "Jonathan"], ['Danny', 'Kai']],
    cases: expandCases(forbiddenMatches, unresolvedCeremonies,[["Basit", "Jonathan"], ['Danny', 'Kai']], 20),
    notes: ''
  }
]

// console.log(JSON.stringify(argumentObject, null, 2))
printArgumentObject(argumentObject)

// todo: print function for forbidden
// todo: print function for matchings

function printArgumentObject (argumentObject, nestingLevel = 0, prefix = '') {
  argumentObject.forEach(currCase => {
    let lines = []
    if (currCase.name) lines.push('The case we are considering is ' + prefix + '; ' + currCase.name)
    const matchesString = currCase.matchings ? stringify(currCase.matchings) : ''
    if (matchesString) lines.push('So far we have matched up: ' + matchesString)
    // todo: some stuff about the ceremonies and state of forbidden matches?
    if (currCase.notes) lines.push('Notes: ' + currCase.notes)
    //	console.log(lines)
    lines.forEach(line => {
      console.log('*' + Array(nestingLevel + 1).join(' ') + line)
    })
    if (currCase.cases) printArgumentObject(currCase.cases, nestingLevel + 1, prefix + `; ${currCase.name}`)
  })
}

// you might not need to put all matchings into this, only new ones
function expandCases (forbidden, ceremonies, matchings, recursive = false) {
  const liveCeremonies = ceremonies.filter(ceremony => ceremony.freeBeams)
  if (!liveCeremonies.length) {
    //	console.log('input to expland cases')
    //	console.log(JSON.stringify({forbidden, ceremonies, matchings, recursive}, null, 2))
    return []
  }
  // if none available, terminate
  const possibilities = getPossibilities(ceremonies[0]) // change
  if (!possibilities.length) {
    return [{notes: 'this sucks'}]
  }
  return possibilities.map(pos => {
    const tryResult = tryPos(pos, forbidden, ceremonies, matchings)
    const newMatchings = matchings.concat(pos)
    if (!recursive) {console.log(JSON.stringify('ruh roh'))}
    return {
      name: stringify(pos), // special stringify
      forbidden: tryResult.forbidden,
      ceremonies: tryResult.ceremonies,
      matchings: newMatchings,
      cases: recursive
        ? expandCases(tryResult.forbidden,
                      tryResult.ceremonies,
                      newMatchings,
                      // prefix + '.' + stringify(pos),
                      recursive - 1)
        : [],
      notes: tryResult.notes
    }
  })
}

function stringify (pos) {
  return pos.map(x => x[0] + ' & ' + x[1]).join(', ')
}

function getSubsets (array, k) {
  // console.log(JSON.stringify(array, null, 2), k)
  let subsetsObject = [{array: [], sizeLeft: k}]
  return array.reduce((subsets, val) => {
    const res =  subsets.concat(subsets.map(arrayObj => {
      if (arrayObj.sizeLeft) {
	return {array : [val, ...arrayObj.array], sizeLeft: arrayObj.sizeLeft - 1}
      }
	}).filter(x => !!x))
    return res
  }, subsetsObject).filter(x => !x.sizeLeft).map(x => x.array)
}

function getPossibilities (ceremony) {
  // console.log(JSON.stringify(ceremony, null, 2))
  let subsets = getSubsets(ceremony.liveMatches, ceremony.freeBeams)
  return subsets
}

function tryPos (pos, forbidden, ceremonies, matchings) {
  //  let noteLines = []
  let newForbidden = forbidden // a copy please!
  // first, incorporate matches, removing all references etc
  ceremonies = calculateLiveMatchings(ceremonies, forbidden, pos)
  // second, update ceremonies and remove resolved
  // add the rest of the ceremony's matches to forbidden (todo)
  ceremonies.filter(ceremony => !ceremony.freeBeams).forEach(x => {
    //    noteLines.push(`week ${x.week} has no remaining free beams, here's the whole object ${JSON.stringify(x, null, 2)}`)
    x.liveMatches.forEach(x => {
      newForbidden[x[0]][x[1]] = newForbidden[x[1]][x[0]] = true
    })
  })
  // third find an available ceremony and choose its matches
  let newCeremonies = ceremonies.filter(ceremony => ceremony.freeBeams) // i hope this makes a copy!
  const cerm = newCeremonies.shift()
  return {ceremonies: newCeremonies, forbidden: newForbidden}
}


