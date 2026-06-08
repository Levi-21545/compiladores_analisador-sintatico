<script lang="ts">
	import type { Automaton } from "./automaton";

	export let automaton: Automaton;

	export let currentState: number | null;
	export let lastFrom: number | null;
	export let lastSymbol: string | null;
	export let error: boolean;

	$: symbols = Object.values(automaton?.transitions || {})
		.flatMap((t) => Object.keys(t))
		.filter((v, i, arr) => arr.indexOf(v) === i)
		.sort();

	function isFinalState(state: string): boolean {
		const stateNum = parseInt(state);
		return automaton?.finals[stateNum] !== undefined;
	}

	function getFinalToken(state: string): string {
		const stateNum = parseInt(state);
		return automaton?.finals[stateNum] || "";
	}
</script>

<div style="overflow-x:auto;">
	<table style="border-collapse:collapse;width:100%;font-size:0.9rem;">
		<thead>
			<tr>
				<th style="border:1px solid #ccc;padding:4px 6px;">Estado</th>
				{#each symbols as sym}
					<th style="border:1px solid #ccc;padding:4px 6px;">{sym}</th
					>
				{/each}
				<th style="border:1px solid #ccc;padding:4px 6px;">Final</th>
			</tr>
		</thead>
		<tbody>
			{#each Object.entries(automaton?.transitions || {}) as [state, trans]}
				<tr
					class="state-row
        {+state === currentState ? 'state-current' : ''}
        {error && +state === lastFrom ? 'state-error' : ''}"
				>
					<td class="cell" style="text-align:left;">q{state}</td>
					{#each symbols as sym}
						<td
							class="cell
                {lastFrom === +state && lastSymbol === sym
								? error
									? 'cell-error'
									: 'cell-active'
								: ''}"
						>
							{trans[sym] !== undefined ? `q${trans[sym]}` : "–"}
						</td>
					{/each}
					<td class="cell">
						{#if isFinalState(state)}
							<span
								class="final-check"
								title={getFinalToken(state)}>✓</span
							>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	{#if automaton?.finals && Object.keys(automaton.finals).length > 0}
		<div style="margin-top:8px;font-size:0.8rem;color:#6b7280;">
			<strong>Estados finais:</strong>
			{#each Object.entries(automaton.finals) as [state, token], i}
				{#if i > 0},
				{/if}q{state} → "{token}"
			{/each}
		</div>
	{/if}
</div>

<style>
	.state-row {
		transition: background 0.2s;
	}
	.state-current {
		background: #7993b3;
	}
	.state-error {
		background: #f78383;
	}
	.cell {
		border: 1px solid #ccc;
		padding: 4px 6px;
		text-align: center;
	}
	.cell-active {
		background: #93c5fd;
	}
	.cell-error {
		background: #eb4646;
	}
	.final-check {
		color: #16a34a;
	}
</style>
