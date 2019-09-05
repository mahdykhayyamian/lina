const samples = [
	`
[ 
    {"sets": ["When you say: it's fine"], "size": 20},
    {"sets": ["When it is actually fine"], "size": 20},
    {"sets": ["When you say: it's fine","When it is actually fine"], "size": 1}
]`,
	`
[ 
	{"sets": ["Natural"], "size": 1},
	{"sets": ["Integer"], "size": 2},
	{"sets": ["Rational"], "size":3},
	{"sets": ["Rational","Integer"], "size": 2},
	{"sets": ["Rational","Natural"], "size": 1},
	{"sets": ["Integer","Natural"], "size": 1},
	{"sets": ["Rational", "Natural", "Integer"], "size": 1}
]
`
];

export { samples };
