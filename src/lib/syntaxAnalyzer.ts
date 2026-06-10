import { grammar } from './grammar';

export interface AnalysisStep {
	step: number;
	stack: string[];
	inputRemaining: string;
	action: string;
}

export interface SyntaxResult {
	accepted: boolean;
	message: string;
	steps: AnalysisStep[];
}

/**
 * Executa a análise sintática tabular baseada em pilha
 */
export function checkSentence(input: string): SyntaxResult {
	const stack: string[] = ['$', grammar.startSymbol];
	const formattedInput = input.replace(/\s+/g, '') + '$';	// Remove espaços e adiciona o marcador de fim de linha $

	const steps: AnalysisStep[] = [];
	let currentInputIndex = 0;
	let stepCounter = 1;

	while (stack.length > 0) {
		const top = stack[stack.length - 1];
		const currentToken = formattedInput[currentInputIndex];

		// Registra o estado atual da pilha e da entrada antes da ação
		steps.push({
			step: stepCounter++,
			stack: [...stack],
			inputRemaining: formattedInput.substring(currentInputIndex),
			action: ''
		});

		const currentStepIndex = steps.length - 1;

		// Caso 1: Sucesso completo no emparelhamento do fim da cadeia
		if (top === '$' && currentToken === '$') {
			steps[currentStepIndex].action = 'Aprovado!';
			stack.pop();
			return { accepted: true, message: 'Sentença ACEITA com sucesso!', steps };
		}

		// Caso 2: Se o topo for um terminal
		if (grammar.terminals.includes(top)) {
			if (top === currentToken) {
				steps[currentStepIndex].action = `Emparelhou '${currentToken}'`;
				stack.pop();
				currentInputIndex++;
			} else {
				steps[currentStepIndex].action = `Erro: Terminal esperado '${top}', mas encontrou '${currentToken}'`;
				return { accepted: false, message: `Erro sintático: Esperado '${top}', obtido '${currentToken}'`, steps };
			}
		}
		// Caso 3: Se o topo for um Não-Terminal
		else if (grammar.nonTerminals.includes(top)) {
			const production = grammar.parsingTable[top]?.[currentToken];

			if (production === null || production === undefined) {
				steps[currentStepIndex].action = `Erro: Sem transição na tabela para [${top}, ${currentToken}]`;
				return { accepted: false, message: `Erro sintático: Sentença rejeitada na regra '${top}' com token '${currentToken}'`, steps };
			}

			steps[currentStepIndex].action = `Aplicou ${top} -> ${production.join(' ')}`;
			stack.pop(); // Remove o não-terminal

			// Insere os elementos da produção na pilha em ordem inversa (se não for ε)
			if (production[0] !== 'ε') {
				for (let i = production.length - 1; i >= 0; i--) {
					stack.push(production[i]);
				}
			}
		} else {
			steps[currentStepIndex].action = 'Erro: Símbolo inválido detectado';
			return { accepted: false, message: 'Erro crítico: Símbolo desconhecido na execução.', steps };
		}
	}

	return { accepted: false, message: 'Erro sintático: Fim inesperado da análise.', steps };
}