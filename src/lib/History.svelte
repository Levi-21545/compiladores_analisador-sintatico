<script lang="ts">
	export let history: { token: string; accepted: boolean; matchedToken?: string }[] = [];
</script>

<div style="margin-top:12px;">
	<h3 style="font-size:1rem;margin-bottom:6px;">Histórico</h3>
	{#if history.length > 0}
		<ul style="list-style:none;padding:0;margin:0;">
			{#each history as item}
				<li
					style="
            padding:4px 6px;
            border-bottom:1px solid #ddd;
            color:{item.accepted ? '#16a34a' : '#dc2626'};
          "
				>
					{item.token} —
					{item.accepted ? `Aceito (${item.matchedToken})` : "Rejeitado"}
				</li>
			{/each}
		</ul>
	{:else}
		<div style="color:#6b7280;">Nenhuma análise ainda.</div>
	{/if}
</div>
