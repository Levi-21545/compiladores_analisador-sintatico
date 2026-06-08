<script lang="ts">
	import type { Automaton } from "./automaton";

	export let automaton: Automaton;

	export let onUpdateState: (data: {
		state: number | null;
		lastFrom: number | null;
		lastSymbol: string | null;
		error: boolean;
	}) => void;

	export let onAnalyze: (input: string) => void;

	let input = "";
	let currentState = automaton?.start ?? -1;
	let error = false;

	function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
		const value = event.currentTarget.value;

		if (!automaton) return;

		let state = automaton.start;
		let lastFrom: number | null = null;
		let lastSymbol: string | null = null;
		let hasError = false;

		for (const ch of value) {
			lastFrom = state;
			lastSymbol = ch;

			const next = automaton.transitions[state]?.[ch];
			if (next === undefined) {
				hasError = true;
				break;
			}
			state = next;
		}

		currentState = hasError ? -1 : state;
		error = hasError;

		onUpdateState({
			state: currentState,
			lastFrom,
			lastSymbol,
			error,
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === " ") {
			e.preventDefault();
			if (input.trim() && onAnalyze) {
				onAnalyze(input.trim());
				input = "";
				currentState = automaton?.start ?? -1;
				error = false;

				onUpdateState({
					state: currentState,
					lastFrom: null,
					lastSymbol: null,
					error: false,
				});
			}
		}
	}
</script>

<div style="display:flex;flex-direction:column;gap:4px;">
	<input
		bind:value={input}
		on:input={handleInput}
		on:keydown={handleKeydown}
		placeholder="Digite uma palavra e pressione espaço"
		style="padding:6px 8px;border:1px solid #ccc;border-radius:6px;"
	/>
	<span style="font-size:0.9rem;color:{error ? '#dc2626' : '#2563eb'};">
		Estado atual: q{currentState}{error ? " — erro" : ""}
	</span>
</div>
