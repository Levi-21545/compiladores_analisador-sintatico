<script lang="ts">
	export let onSetToken: (tokens: string[]) => void;

	let tokens: string[] = [""];
	let newToken: string = "";

	function addTokenInput() {
		if (tokens.length < 5) {
			tokens = [...tokens, ""];
		}
	}

	function removeToken(index: number) {
		if (tokens.length > 1) {
			tokens = tokens.filter((_, i) => i !== index);
		}
	}

	function updateToken(index: number, value: string) {
		tokens = tokens.map((token, i) => (i === index ? value : token));
	}

	function handleSubmit() {
		const validTokens = tokens.filter((token) => token.trim() !== "");

		if (validTokens.length > 0 && onSetToken) {
			onSetToken(validTokens);
			tokens = [""];
			newToken = "";
		}
	}
</script>

<div style="display:flex;flex-direction:column;gap:8px;margin-bottom:2em;">
	{#each tokens as token, index}
		<div style="display:flex;gap:8px;align-items:center;">
			<input
				value={token}
				on:input={(e) => updateToken(index, e.currentTarget.value)}
				placeholder={`Token ${index + 1}`}
				style="flex:1;padding:6px 8px;border:1px solid #ccc;border-radius:6px;"
			/>
			{#if tokens.length > 1}
				<button
					on:click={() => removeToken(index)}
					style="background:#dc2626;color:white;padding:4px 8px;border:none;border-radius:4px;cursor:pointer;"
				>
					×
				</button>
			{/if}
		</div>
	{/each}

	<div style="display:flex;gap:8px;">
		{#if tokens.length < 5}
			<button
				on:click={addTokenInput}
				style="background:#16a34a;color:white;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;"
			>
				+ Adicionar Token
			</button>
		{/if}

		<button
			on:click={handleSubmit}
			style="background:#2563eb;color:white;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;"
		>
			Confirmar Tokens
		</button>
	</div>
</div>
