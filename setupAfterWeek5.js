let playersObject = {
  1: 'Aasha',
  2: 'Amber',
  3: 'Basit', 
  4: 'Brandon',
  5: 'Danny',
  6: 'Jasmine',
  7: 'Jenna',
  8: 'Jonathan',
  9: 'Justin',
  10: 'Kai',
  11: 'Kari', 
  12: 'Kylie', 
  13: 'Max',
  14: 'Nour',
  15: 'Paige',
  16: 'Remy'
}

const players = Object.keys(playersObject).map(key => playersObject[key])

// let numbers = {}
// Object.keys(players).forEach(key => { numbers[players[key]] = key} )

const matchingString = `Aasha	Paige	Brandon	Max	Remy	Kai
Amber	Nour	Nour	Paige	Nour	Nour
Basit	Jonathan	Jonathan	Remy	Danny	Remy
Brandon	Remy	Aasha	Jonathan	Jasmine	Max				
Danny	Kai	Remy	Kai	Basit	Kari				
Jasmine	Jenna	Justin	Nour	Brandon	Paige
Jenna	Jasmine	Kai	Justin	Paige	Kylie
Jonathan	Basit	Basit	Brandon	Kylie	Justin					
Justin	Max	Jasmine	Jenna	Max	Jonathan					
Kai	Danny	Jenna	Danny	Kari	Aasha					
Kari	Kylie	Kylie	Kylie	Kai	Danny					
Kylie	Kari	Kari	Kari	Jonathan	Jenna					
Max	Justin	Paige	Aasha	Justin	Brandon					
Nour	Amber	Amber	Jasmine	Amber	Amber					
Paige	Aasha	Max	Amber	Jenna	Jasmine					
Remy	Brandon	Danny	Basit	Aasha	Basit`

let matchingObject = {}
const lines = matchingString.split('\n')
for (let i = 0; i < lines.length; i++) {
  const names = lines[i].split(/\s+/).filter(x => !!x)
  for (let j = 1; j < names.length; j++) {
    matchingObject[j] = matchingObject[j] || {}
    matchingObject[j][names[0]] = names[j]
  }
}

const ceremonies = [
  {
    week: 1,
    matching: matchingObject[1],
    beams: 2,
    freeBeams: 2
  },
  {
    week: 2,
    matching: matchingObject[2],
    beams: 2,
    freeBeams: 2
  },
  {
    week: 3,
    matching: matchingObject[3],
    beams: 2,
    freeBeams: 2
  },
  {
    week: 4,
    matching: matchingObject[4],
    beams: 1,
    freeBeams: 1
  },
  {
    week: 5,
    matching: matchingObject[5],
    beams: 0,
    freeBeams: 0
  }
]


/*
  Justin & Nour	1	Not A Match
  Brandon & Remy	2	Not A Match
  Jenna & Kai	3	Not A Match
  Danny & Jenna	4	Not A Match
  Kari & Kylie	5	Not A Match
*/

// true denotes not a match
const truthBooths = {
  Justin: {Nour: true},
  Brandon: {Remy: true},
  Kai: {Jenna: true},
  Danny: {Jenna: true},
  Kari: {Kylie: true}
}

module.exports = {
  truthBooths: truthBooths,
  ceremonies: ceremonies,
  players: players
  //    numbers: numbers
}
