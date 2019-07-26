const players = {
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

let numbers = {}
Object.keys(players).forEach(key => { numbers[players[key]] = key} )

const matchingString =
`Aasha	Paige	Brandon	Max	Remy	Kai
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
matchingString.split('\n').forEach(line => {
    const names = line.split() // whitespace??
    matchingObject[names[0]] = names.slice(0) // is this right??
}

const scores = [2, 2, 2, 1, 0]

// const truthBooths = 

/* steps:
choose week with fewest 'free' matches,
find most restricted person and choose a possible match,
reduce number of free matches,
recalculate other weeks 'free' matches if needed,
if a week has no free matches add its restrictions

repeat?
*/
