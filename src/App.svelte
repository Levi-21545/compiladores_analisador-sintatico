<script lang="ts">
  import { grammar, generateValidSentence } from "./lib/grammar";
  import { checkSentence, type SyntaxResult } from "./lib/syntaxAnalyzer";

  let inputSentence = "";
  let analysisResult: SyntaxResult | null = null;

  function runAnalysis() {
    analysisResult = checkSentence(inputSentence);
  }

  function handleGenerate() {
    inputSentence = generateValidSentence();
    runAnalysis();
  }

  function handleReset() {
    inputSentence = "";
    analysisResult = null;
  }
</script>

<main class="app-shell">
  <div class="card card--header">
    <h1 class="app-title">Analisador Sintático LL(1) Preditivo Tabular</h1>
    <p class="app-subtitle">
      Professor: Fabio Zanin &nbsp;|&nbsp; Levi Gomes &amp; Gabriel Pansera
    </p>
  </div>

  <div class="card card--section">
    <h2 class="section-title">1. Definições Estruturais da GLC</h2>

    <h3 class="subsection-title subsection-title--center">
      Regras de Produção
    </h3>
    <div class="productions">
      {#each Object.entries(grammar.rules) as [nt, prods]}
        <div class="production-line">
          <span class="non-terminal">{nt}</span>
          <span class="arrow"> &rarr; </span>
          <span class="production-rhs">
            {prods.map((p) => p.join(" ")).join(" | ")}
          </span>
        </div>
      {/each}
    </div>

    <h3 class="subsection-title">Conjuntos FIRST e FOLLOW</h3>
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th class="th th--left">Não-Terminal</th>
            <th class="th th--left">FIRST</th>
            <th class="th th--left">FOLLOW</th>
          </tr>
        </thead>
        <tbody>
          {#each grammar.nonTerminals as nt}
            <tr class="table-row">
              <td class="td td--nt">{nt}</td>
              <td class="td">{`{ ${grammar.first[nt].join(", ")} }`}</td>
              <td class="td">{`{ ${grammar.follow[nt].join(", ")} }`}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <h3 class="subsection-title" style="margin-top: 20px;">
      Tabela de Parsing M[Não-Terminal, Terminal]
    </h3>
    <div class="table-wrapper">
      <table class="table table--parsing">
        <thead>
          <tr>
            <th class="th th--center" style="font-size: 0.8em;">NT</th>
            {#each grammar.terminals as t}
              <th class="th th--center th--terminal">{t}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each grammar.nonTerminals as nt}
            <tr class="table-row">
              <td class="td td--center td--nt" style="font-size: 0.85em;">{nt}</td>
              {#each grammar.terminals as t}
                <td class="td td--center" style="font-size: 0.85em;">
                  {#if grammar.parsingTable[nt][t]}
                    <span class="production-ref">
                      {nt} &rarr; {grammar.parsingTable[nt][t]?.join("")}
                    </span>
                  {:else}
                    <span class="empty-cell">—</span>
                  {/if}
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div class="card card--section">
    <h2 class="section-title">2. Entrada e Testes de Sentenças</h2>
    <div class="input-row">
      <input
        type="text"
        bind:value={inputSentence}
        placeholder="Ex: a b c d"
        class="sentence-input"
      />
      <button class="btn btn--analyze" on:click={runAnalysis}>
        Analisar Entrada
      </button>
      <button class="btn btn--generate" on:click={handleGenerate}>
        Gerar Sentença Válida
      </button>
      <button class="btn btn--reset" on:click={handleReset}>
        Reiniciar Ciclo
      </button>
    </div>
  </div>

  {#if analysisResult}
    <div class="card card--section">
      <h2 class="section-title">3. Resultado da Análise</h2>
      <div
        class="result-box"
        class:result-box--accepted={analysisResult.accepted}
        class:result-box--rejected={!analysisResult.accepted}
      >
        <strong
          class="result-message"
          class:result-message--accepted={analysisResult.accepted}
          class:result-message--rejected={!analysisResult.accepted}
        >
          {analysisResult.message}
        </strong>
      </div>

      <h3 class="subsection-title">Passos Efetuados na Pilha</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th class="th th--left">Passo</th>
              <th class="th th--left">Pilha (Stack)</th>
              <th class="th th--left">Entrada Restante</th>
              <th class="th th--left">Ação Executada</th>
            </tr>
          </thead>
          <tbody>
            {#each analysisResult.steps as step}
              <tr class="table-row">
                <td class="td td--step-num">{step.step}</td>
                <td class="td td--code">{JSON.stringify(step.stack)}</td>
                <td class="td td--input">{step.inputRemaining}</td>
                <td class="td td--action">{step.action}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</main>

<style>
  .app-shell {
    max-width: 1100px;
    margin: 30px auto;
    padding: 0 20px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
    color: #e0e0e0;
  }

  .card {
    background: #1e1e2e;
    border-radius: 12px;
    padding: 24px;
    border: 1px solid #2e2e3e;
  }

  .card--header {
    text-align: center;
    margin-bottom: 30px;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    border-color: #2a2a4a;
  }

  .card--section {
    margin-bottom: 20px;
  }

  .app-title {
    margin: 0 0 8px;
    font-size: 1.8em;
    color: #e8e8ff;
  }

  .app-subtitle {
    margin: 0;
    color: #8888bb;
    font-size: 0.85em;
  }

  .section-title {
    margin: 0 0 16px;
    font-size: 1.3em;
    color: #b4b4ff;
    border-bottom: 2px solid #3a3a5a;
    padding-bottom: 8px;
  }

  .subsection-title {
    margin: 0 0 10px;
    color: #a0a0cc;
    font-size: 1em;
  }

  .subsection-title--center {
    text-align: center;
    margin-bottom: 12px;
  }

  .productions {
    background: #252535;
    border-radius: 8px;
    padding: 14px 20px;
    max-width: 420px;
    margin: 0 auto 20px;
    border: 1px solid #353550;
  }

  .production-line {
    padding: 3px 0;
    font-size: 0.95em;
  }

  .non-terminal {
    color: #f0c060;
    font-weight: bold;
  }

  .arrow {
    color: #888;
  }

  .production-rhs {
    color: #d0d0f0;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    background: #252535;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #353550;
  }

  .table thead tr {
    background: #2a2a40;
  }

  .th {
    padding: 10px 14px;
    color: #c0c0f0;
    font-size: 0.85em;
    border-bottom: 2px solid #404060;
  }

  .th--left {
    text-align: left;
  }

  .th--center {
    text-align: center;
  }

  .th--terminal {
    color: #80d0a0;
    font-size: 0.85em;
  }

  .table-row {
    border-bottom: 1px solid #303040;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .td {
    padding: 8px 14px;
    font-size: 0.9em;
  }

  .td--center {
    text-align: center;
  }

  .td--nt {
    color: #f0c060;
    font-weight: bold;
  }

  .td--step-num {
    padding: 7px 12px;
    font-size: 0.85em;
    color: #8888aa;
  }

  .td--code {
    padding: 7px 12px;
    font-size: 0.85em;
    color: #c0d0f0;
  }

  .td--input {
    padding: 7px 12px;
    font-size: 0.85em;
    color: #70c0e0;
  }

  .td--action {
    padding: 7px 12px;
    font-size: 0.85em;
    font-style: italic;
    color: #b0b0c0;
  }

  .production-ref {
    color: #a0d0a0;
  }

  .empty-cell {
    color: #555;
  }

  .input-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .sentence-input {
    flex: 1;
    min-width: 200px;
    padding: 10px 14px;
    border-radius: 8px;
    border: 2px solid #353550;
    background: #252535;
    color: #e0e0e0;
    font-family: inherit;
    font-size: 0.9em;
    outline: none;
  }

  .sentence-input:focus {
    border-color: #5a5a8a;
  }

  .btn {
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    font-family: inherit;
    font-size: 0.85em;
    font-weight: bold;
    cursor: pointer;
    color: #fff;
  }

  .btn--analyze {
    background: #3a6a8a;
  }

  .btn--analyze:hover {
    background: #4a7a9a;
  }

  .btn--generate {
    background: #3a7a5a;
  }

  .btn--generate:hover {
    background: #4a8a6a;
  }

  .btn--reset {
    background: #7a4a3a;
  }

  .btn--reset:hover {
    background: #8a5a4a;
  }

  .result-box {
    padding: 14px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    border: 1px solid;
  }

  .result-box--accepted {
    background: #2a5a3a;
    border-color: #4a8a5a;
  }

  .result-box--rejected {
    background: #5a2a2a;
    border-color: #8a4a4a;
  }

  .result-message {
    font-size: 1.05em;
  }

  .result-message--accepted {
    color: #80e0a0;
  }

  .result-message--rejected {
    color: #e08080;
  }
</style>
