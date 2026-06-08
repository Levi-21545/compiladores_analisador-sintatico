<script lang="ts">
  import TokenManager from "./lib/TokenManager.svelte";
  import LexicalAnalyzer from "./lib/LexicalAnalyzer.svelte";
  import StateTable from "./lib/StateTable.svelte";
  import History from "./lib/History.svelte";
  import { buildAutomaton, processString } from "./lib/automaton";
  import type { Automaton } from "./lib/automaton";

  let automaton: Automaton | null = null;
  let tokens: string[] = [];
  let history: { token: string; accepted: boolean; matchedToken?: string }[] =
    [];

  let currentState: number | null = null;
  let currentFrom: number | null = null;
  let currentSymbol: string | null = null;
  let errorFlag = false;

  let tokenKey = 0;

  function handleSetToken(newTokens: string[]) {
    tokens = newTokens;
    automaton = buildAutomaton(newTokens);
    history = [];

    currentState = 0;
    currentFrom = null;
    currentSymbol = null;
    errorFlag = false;

    tokenKey += 1;
  }

  function handleUpdateState(data: {
    state: number | null;
    lastFrom: number | null;
    lastSymbol: string | null;
    error: boolean;
  }) {
    currentState = data.state;
    currentFrom = data.lastFrom;
    currentSymbol = data.lastSymbol;
    errorFlag = data.error;
  }

  function handleAnalyze(input: string) {
    if (!automaton) return;

    const result = processString(automaton, input);

    history = [
      {
        token: input,
        accepted: result.accepted,
        matchedToken: result.matchedToken,
      },
      ...history,
    ];

    currentState = automaton.start;
    currentFrom = null;
    currentSymbol = null;
    errorFlag = false;
  }
</script>

<main style="max-width:900px;margin:28px auto;padding:0 12px;">
  <h1 style="font-size:1.4rem;margin-bottom:12px;">
    Analisador Sintático
  </h1>

  <!-- <section style="margin-bottom:14px;">
    <TokenManager onSetToken={handleSetToken} />
  </section>

  {#if automaton}
    {#key tokenKey}
      <section style="display:grid;grid-template-columns: 1fr; gap:12px;">
        <LexicalAnalyzer
          {automaton}
          onUpdateState={handleUpdateState}
          onAnalyze={handleAnalyze}
        />
        <StateTable
          {automaton}
          {currentState}
          lastFrom={currentFrom}
          lastSymbol={currentSymbol}
          error={errorFlag}
        />
        <History {history} />
      </section>
    {/key}
  {:else}
    <div style="color:#6b7280;">
      Adicione tokens para começar (ex: "casa", "carro").
    </div>
  {/if} -->
</main>
