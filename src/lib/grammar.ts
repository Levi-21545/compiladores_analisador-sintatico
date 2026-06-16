export interface Grammar {
	nonTerminals: string[];
	terminals: string[];
	startSymbol: string;
	rules: Record<string, string[][]>;
	first: Record<string, string[]>;
	follow: Record<string, string[]>;
	parsingTable: Record<string, Record<string, string[] | null>>;
}

// Gramática original da especificação do TDE (docs/gramatica.txt):
// 1. S → BA     
// 2. A → aBA | ε
// 3. B → DC     
// 4. C → bDC | ε
// 5. D → c | d  
export const grammar: Grammar = {
	nonTerminals: ['S', 'A', 'B', 'C', 'D'],
	terminals: ['a', 'b', 'c', 'd', '$'],
	startSymbol: 'S',
	rules: {
		'S': [['B', 'A']],
		'A': [['a', 'B', 'A'], ['ε']],
		'B': [['D', 'C']],
		'C': [['b', 'D', 'C'], ['ε']],
		'D': [['c'], ['d']]
	},
	first: {
		'S': ['c', 'd'],
		'A': ['a', 'ε'],
		'B': ['c', 'd'],
		'C': ['b', 'ε'],
		'D': ['c', 'd']
	},
	follow: {
		'S': ['$'],
		'A': ['$'],
		'B': ['a', '$'],
		'C': ['a', '$'],
		'D': ['a', 'b', '$']
	},
	parsingTable: {
		'S': { 'a': null, 'b': null, 'c': ['B', 'A'], 'd': ['B', 'A'], '$': null },
		'A': { 'a': ['a', 'B', 'A'], 'b': null, 'c': null, 'd': null, '$': ['ε'] },
		'B': { 'a': null, 'b': null, 'c': ['D', 'C'], 'd': ['D', 'C'], '$': null },
		'C': { 'a': ['ε'], 'b': ['b', 'D', 'C'], 'c': null, 'd': null, '$': ['ε'] },
		'D': { 'a': null, 'b': null, 'c': ['c'], 'd': ['d'], '$': null }
	}
};

/**
 * Gera automaticamente uma sentença válida com base nas produções da GLC
 */
export function generateValidSentence(): string {
	let depthCount = 0;

	function expand(symbol: string): string {
		depthCount++;
		// Salvaguarda para evitar loops infinitos caso a aleatoriedade falhe
		if (depthCount > 50) {
			if (symbol === 'A') return '';
			if (symbol === 'B') return 'c';
			if (symbol === 'C') return '';
		}

		if (!grammar.nonTerminals.includes(symbol)) {
			return symbol === 'ε' ? '' : symbol;
		}

		const productions = grammar.rules[symbol];
		const randomProd = productions[Math.floor(Math.random() * productions.length)];

		return randomProd.map(s => expand(s)).join('');
	}

	return expand(grammar.startSymbol);
}