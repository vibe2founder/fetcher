# 📡 request2http

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Deps-Zero-00d4aa?logo=checkmarx&logoColor=white)](.)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)
[![Bun](https://img.shields.io/badge/Runtime-Bun-f9f1e1?logo=bun&logoColor=black)](https://bun.sh)
[![Event Sourcing](https://img.shields.io/badge/Pattern-Event_Sourcing-ff6b6b)](.)
[![Proxy](https://img.shields.io/badge/Engine-ES6_Proxy-ffd93d)](.)

> *@vibe2founder/request2http (Fetcher)* — Requisições HTTP em Node.js com interface Axios, mas **nativa e sem dependências pesadas**. Zero inchaço pro seu bundle final.

[🔗 Veja o nosso CHANGELOG.md](CHANGELOG.md) para acompanhar as atualizações mais recentes.

---

## 🚀 Como Funciona

Por que pesar sua runtime com o Axios se a *Fetch API Global* já é a norma na vanguarda do Node/Bun? O `request2http` permite que todo o legado acostumado a bibliotecas de mercado simplesmente importe e trabalhe perfeitamente no novo ecosistema. Interface `Drop-in replacement`.

```typescript
import request2http from "@vibe2founder/request2http"; // Sai axios import, entra request2http

// A mesma facilidade para POST, GET, PUT...
const response = await request2http.post("https://api.example.com/users", {
  name: "John Doe"
});

console.log(response.data)
```

E o melhor? Ferramenta com `Auto-Healing`. Recebeu limitação `429` (Rate limit)? Ele aplica *Exponential Backoff* ou escuta a flag de `Retry-After`. 

---

## 🛠️ Como foi feito

Nosso motor segue diretrizes arquiteturais estritas: **Sem "Código Mágico", mas super Inteligente**. Construímos resiliência com foco em Eventos (Event-driven requests).

A heurística embutida age interceptando falsificações ou falhas externas (401, 403, 422, timeouts absurdos) através de encapsulamento seguro com Cláusulas de Guarda e Tipagem Forte. O Fetcher não usa conversores silenciosos erráticos; sua inteligência de fallback entende instabilidades temporárias reconstruindo falhas sem violar side-effects ocultos para o core.

---

## 🧪 Como testar

Este módulo é robusto, sendo facilmente rastreado pelo ecossistema:

1. Rode seus mocks usando instâncias de simuladores REST sem sair da sua máquina.
2. Comandos `bun test` no ambiente provido ao wsl. 
3. Caso receba erros simulados como `422`, você notará logs estruturados com `response.healed` provando que ferramentas regenerativas foram ativadas mitigando atritos externos!
