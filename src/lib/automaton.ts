export interface Automaton {
	start: number;
	finals: Record<number, string>;
	transitions: Record<number, Record<string, number>>;
}

// Gera um AFD unificado para reconhecer múltiplos tokens
export function buildAutomaton(tokens: string[]): Automaton {
	const transitions: Record<number, Record<string, number>> = {};
	const finals: Record<number, string> = {};

	const startState = 0;
	let nextState = 1;

	transitions[startState] = {};

	// Para cada token, constrói o caminho no autômato
	tokens.forEach(token => {
		let currentState = startState;

		for (let i = 0; i < token.length; i++) {
			const char = token[i];
			const nextStateKey = transitions[currentState]?.[char];

			if (nextStateKey === undefined) {
				// Cria novo estado
				transitions[currentState][char] = nextState;
				currentState = nextState;
				transitions[currentState] = {};
				nextState++;
			} else {
				// Reutiliza estado existente
				currentState = nextStateKey;
			}

			// Marca como estado final no último caractere
			if (i === token.length - 1) {
				finals[currentState] = token;
			}
		}
	});

	return { start: startState, finals, transitions };
}

// Processa a string de entrada e retorna se foi aceita, o estado final e o token correspondente (se aceito)
export function processString(automaton: Automaton, input: string) {
	let current = automaton.start;
	let accepted = false;
	let matchedToken = "";

	for (const char of input) {
		const next = automaton.transitions[current]?.[char];

		if (next === undefined) {
			return { accepted: false, current, matchedToken: "" };
		}
		current = next;
	}

	// Verifica se chegou em um estado final
	if (automaton.finals[current] !== undefined) {
		accepted = true;
		matchedToken = automaton.finals[current];
	}

	return { accepted, current, matchedToken };
}
