const setup = require('./setupAfterWeek5')

const truthBooths = mirror(setup.truthBooths)

function mirror (truthBooths) {
  let result = {}
  Object.keys(truthBooths).forEach(first => {
    result[first] = result[first] || {}
    Object.keys(truthBooths[first]).forEach(second => {
      result[second] = result[second] || {}
      result[first][second] = result[second][first] = 'truth booth' // truthBooths[first][second]
    })
  })
  return result
}

const forbiddenMatches = getForbiddenFromTruthBoothsAndBlackouts(truthBooths, setup.ceremonies)

function getForbiddenFromTruthBoothsAndBlackouts (truthBooths, ceremonies) {
  let result = JSON.parse(JSON.stringify(truthBooths))
  ceremonies.filter(ceremony => !ceremony.freeBeams).forEach(ceremony => {
    Object.keys(ceremony.matching).forEach(key => {
      result[key] = result[key] || {}
      result[key][ceremony.matching[key]] = 'dervied from week ' + ceremony.week // truthy = yes forbidden
    })
  })
  return result
}

const ceremonies = calculateLiveMatchings(setup.ceremonies, forbiddenMatches, [["Basit", "Jonathan"]])

function calculateLiveMatchings (ceremonies, forbiddenMatches, matchings) {
  let newCeremonies = JSON.parse(JSON.stringify(ceremonies))
  return newCeremonies.map(x => findLiveMatches(x, forbiddenMatches, matchings))
}

// todo: incorporate initial matchings into initialization

function printCeremony (cerm) {
  console.log(`the ceremony is ${cerm.week} which got ${cerm.beams} beams ${cerm.freeBeams} remain free`)
  if (cerm.matchedCouples) {console.log('already matched: ', stringifyMatches(cerm.matchedCouples)) }
  if (cerm.liveMatches) {console.log('live matches:', stringifyMatches(cerm.matchedCouples)) }
  if (cerm.matching) { console.log(`matching is: ${stringifyMatching(cerm.matching)}`) }
  // console.log('l', Object.keys(cerm))
}

function findLiveMatches(ceremony, forbiddenMatches, matchings) {
  console.log(`''''''''''''''''''''''''''''''''''`)
  console.log(JSON.stringify({ceremony, forbiddenMatches, matchings}, null, 2))
  // printCeremony(ceremony)
  const currMatching = ceremony.matching
  ceremony.matchedCouples = ceremony.matchedCouples || []
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
      res.matchedCouples.push(x)
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

let argumentObject = [
  {
    name: 'Week 5 (Jonathan and Basit)', // always put in alphabetical order?
    forbidden: forbiddenMatches,
    ceremonies: unresolvedCeremonies,
    matchings: [["Basit", "Jonathan"]],
    cases: expandCases(forbiddenMatches, unresolvedCeremonies,[["Basit", "Jonathan"]], 20),
    notes: []
  }
]

function prune (argObj) {
  argObj = propogateFailures(argObj)
  // argObj = removeFailures(argObj)
  return argObj
}

function propogateFailures (poss) {
  if (poss.cases) {
    propogateFailures(poss.cases)
  }
  poss.failure = poss.failure || (poss.cases && poss.cases.every(p => p.failure))
  return poss
}

function removeFailures (argObj) {
  if (argObj.cases) {
    argObj.cases = argObj.cases.map(removeFailures)
    argObj.cases = argObj.cases.filter(poss => !poss.failure)
  }
  return argObj
}

printArgumentObject3(argumentObject, 1)
// printArgumentObject4(argumentObject)


function printArgumentObject3 (argumentObject, index, nestingLevel = 0) {
  let i = index
  argumentObject.forEach(currCase => {
    let lines = []
    if (currCase.name) lines.push('The case we are considering is ' + currCase.name)
    if(currCase.matchings) {
      lines.push(stringify(currCase.matchings))
    }
    if (!currCase.failure) {
      if (currCase.cases && currCase.cases.length) {
        lines.push('This is a successful path')
        lines.push(`It has ${currCase.cases.length} subcases which are:`)
        lines = lines.concat(currCase.cases.map(poss => {
          return poss.name
        }).filter(x => !!x))
      } else {
        lines.push(`This is possibility number ${index}`)
        i = i + 1
      }
    } else {
      if (currCase.cases && currCase.cases.length) {
        lines.push('This is an unsuccessful path as all of its subcases fail')
        lines.push(`It has ${currCase.cases.length} subcases which are:`)
        lines = lines.concat(currCase.cases.map(x => x.name))
      } else {
        lines.push(`This possibility fails`)
      }
    }
    if (currCase.notes.length) {
      lines.push('Notes:')
      lines = lines.concat(currCase.notes)
    }
    // if (currCase.cases && currCase.cases.length) {
    // }
    lines.forEach(line => {
      console.log('*' + Array(nestingLevel + 1).join(' ') + line)
    })
    if (currCase.cases && currCase.cases.length) {
      i = printArgumentObject3(currCase.cases, i, nestingLevel + 1)
    }
  })
  return i
}

// todo: print function for forbidden
function getForbiddenLines (forbidden) {
  let lines = ['The following are the forbidden matches:']
  Object.keys(forbidden).forEach(key => {
    lines.push(key + ' cannot be with: ' + Object.keys(forbidden[key]).join(', '))
  })
  return lines                             
}

// todo: print function for matchings

function printCase (poss, nestingLevel) {
  let lines = []

  Object.keys(poss).forEach(key => {
    switch (key) {
    case 'cases':
      return;
    case 'forbidden':
      lines = getForbiddenLines(poss[key])
      break
    case 'ceremonies':
    default:
      lines.push(`${key}: ${JSON.stringify(poss[key])}`)
    }
  })
  
  lines.forEach(line => {
    console.log('*' + Array(nestingLevel + 1).join(' ') + line)
  })

  if (poss.cases && poss.cases.length) {
    printArgumentObject4(poss.cases, nestingLevel + 1)
  }
}

function formatCase (poss) {
  const matchedPeople = [].concat.apply([], poss.matchings)
  const unmatchedPeople = setup.players.filter(player => {
    return !matchedPeople.includes(player)
  })
  let newForbidden = {}
  Object.keys(poss.forbidden)
    .filter(key => unmatchedPeople.includes(key))
    .forEach(key => {
      newForbidden[key] = {}
      Object.keys(poss.forbidden[key])
        .filter(k => unmatchedPeople.includes(k))
        .forEach(k => {
          newForbidden[key][k] = poss.forbidden[key][k]
        })
    })
  return {unmatchedPeople, forbidden: newForbidden, matchings: poss.matchings}
}

function linifyCeremony (ceremony) {
  let line = `in week ${ceremony.week} we have matched up ${ceremony.matchedCouples.map(x => x[0] + ' & ' + x[1]).join('; ')}`
  return line
}

// you might not need to put all matchings into this, only new ones
function expandCases (forbidden, ceremonies, matchings, recursive = false) {
  const liveCeremonies = ceremonies.filter(ceremony => ceremony.freeBeams)
  if (!liveCeremonies.length) {
    let lines = []
    lines.concat(ceremonies.map(linifyCeremony))
    return [{notes: lines}]
  }
  // if none available, terminate
  const possibilities = getPossibilities(liveCeremonies[0]) // change
  if (!possibilities.length) {
    const cerm = liveCeremonies[0]
    let lines = [`Week ${cerm.week} has no possibilities`]
    lines.push(`it has ${cerm.freeBeams} free beams but there are ${cerm.liveMatches.length} live matches`)
    return [{notes: lines, failure: true}]
  }
  return possibilities.map(pos => {
    const tryResult = tryPos(pos, forbidden, ceremonies, matchings)
    const newMatchings = matchings.concat(pos)
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

function stringifyMatches (pos) {
  // console.log(pos)
  return pos.map(x => x[0] + ' & ' + x[1]).join(', ')
}

function stringifyMatching (matching) {
  let arr = []
  Object.keys(matching).forEach(key1 => {
    Object.keys(matching[key1]).forEach(key2 => {
      if (key1 < key2) {
        arr.push([key1, key2])
      }
    })
  })
  return arr.map(a => a[0] + ' & ' + a[1]).join('; ')
}

function stringify (pos) {
  return pos.map(x => x[0] + ' & ' + x[1]).join(', ')
}

function getSubsets (array, k) {
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
  let subsets = getSubsets(ceremony.liveMatches, ceremony.freeBeams)
  return subsets
}

function tryPos (pos, forbidden, ceremonies, matchings) {
  let noteLines = []
  let newForbidden = JSON.parse(JSON.stringify(forbidden)) // a copy please!
  // first, incorporate matches, removing all references etc
  ceremonies = calculateLiveMatchings(ceremonies, forbidden, pos)
  // second, update ceremonies and remove resolved
  // add the rest of the ceremony's matches to forbidden (todo)
  ceremonies.filter(ceremony => !ceremony.freeBeams).forEach(y => {
    noteLines.push(`week ${y.week} has no remaining free beams`) //, here's the whole object ${JSON.stringify(x, null, 2)}`)
    y.liveMatches.forEach(x => {
      newForbidden[x[0]][x[1]] = newForbidden[x[1]][x[0]] = `derived from week ${y.week}`
    })
  })
  // third find an available ceremony and choose its matches
  return {ceremonies, forbidden: newForbidden, notes: noteLines}
}


