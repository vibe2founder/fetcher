<p align="center">
<img src="https://i.imgur.com/zUBBeJx.png" align="center" width=600 />
  <p align="center"><strong>Native Node.js fetch implementation with axios interface</strong></p>
  <p align="center">Just swap the import and use a lighter, native implementation without changing any code.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@vibe2founder/request2http?style=flat-square&color=blue" alt="npm version">
  <img src="https://img.shields.io/npm/dm/@vibe2founder/request2http?style=flat-square&color=green" alt="downloads">
  <img src="https://img.shields.io/npm/l/@vibe2founder/request2http?style=flat-square&color=orange" alt="license">
  <img src="https://img.shields.io/bundlephobia/min/@vibe2founder/request2http?style=flat-square&color=purple" alt="bundle size">
</p>

---

## 🎯 Why one-request-4-all?

Tired of heavy HTTP libraries? **one-request-4-all** is a lightweight, native Node.js fetch implementation that provides the exact same interface as axios. Just change the import and enjoy a smaller bundle size!

### ✨ Key Features

<table>
  <tr>
    <td align="center" width="20%">
      <h3>⚡</h3>
      <strong>Native Fetch</strong><br>
      <sub>Zero dependencies, pure Node.js</sub>
    </td>
    <td align="center" width="20%">
      <h3>🔄</h3>
      <strong>Drop-in Replacement</strong><br>
      <sub>Same axios interface</sub>
    </td>
    <td align="center" width="20%">
      <h3>🎯</h3>
      <strong>TypeScript First</strong><br>
      <sub>Full type safety</sub>
    </td>
    <td align="center" width="20%">
      <h3>🚀</h3>
      <strong>Modern ES Modules</strong><br>
      <sub>Node.js 18+ ready</sub>
    </td>
    <td align="center" width="20%">
      <h3>🔧</h3>
      <strong>Auto-Healing</strong><br>
      <sub>Smart error recovery</sub>
    </td>
  </tr>
</table>

## 📦 Installation

```bash
# npm
npm install @vibe2founder/request2http

# yarn
yarn add @vibe2founder/request2http

# bun
bun add @vibe2founder/request2http
```

## 🚀 Quick Start

### Basic Usage

```typescript
import request2http from "@vibe2founder/request2http";

// GET request
const response = await request2http.get("https://api.example.com/users");
console.log(response.data);

// POST request
const newUser = await request2http.post("https://api.example.com/users", {
  name: "John Doe",
  email: "john@example.com",
});
```

### Drop-in Replacement for Axios

```typescript
// Before (with axios)
import axios from "axios";

// After (with request2http)
import request2http from "@vibe2founder/request2http";

// Same interface, same usage!
const response = await request2http.get("/api/users", {
  headers: {
    Authorization: "Bearer token",
  },
});
```

## 📚 API Reference

### Request Methods

```typescript
// GET, DELETE, HEAD, OPTIONS
await request2http.get<T>(url, config?)
await request2http.delete<T>(url, config?)
await request2http.head<T>(url, config?)
await request2http.options<T>(url, config?)

// POST, PUT, PATCH
await request2http.post<T>(url, data?, config?)
await request2http.put<T>(url, data?, config?)
await request2http.patch<T>(url, data?, config?)

// Generic request
await request2http<T>(config)
await request2http<T>(url, config)
```

### Request Configuration

```typescript
interface request2http<D = any> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: Record<string, string>;
  data?: D;
  params?: Record<string, string | number | boolean>;
  responseType?: 'json' | 'text' | 'stream';
}
```

### Response Object

```typescript
interface one-request-4-allResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  config: request2http<D>;
  request: Response;
}
```

## 🔧 Auto-Healing

one-request-4-all includes a powerful **auto-healing** system that automatically detects and recovers from common HTTP errors:

```typescript
// Auto-healing is enabled by default
const response = await request2http.get("https://api.example.com/data", {
  maxRetries: 3, // Number of retry attempts (default: 3)
  timeout: 5000, // Initial timeout in ms (default: 5000)
  autoHeal: true, // Enable auto-healing (default: true)
});

// Check if the request was healed
if (response.healed) {
  console.log("✅ Request was automatically healed!");
  console.log("Message:", response.healMessage);
  // Example: "Rate limited - retry after 1000ms"
}
```

### Supported Error Recovery

- **401 Unauthorized**: Increases timeout and retries
- **403 Forbidden**: Adjusts timeout for permission checks
- **413 Payload Too Large**: Doubles timeout for large responses
- **422 Validation Error**: Creates values based on expected types
- **429 Rate Limit**: Respects `Retry-After` header or uses exponential backoff
- **Timeout**: Progressively increases timeout (max 30s)
- **Network Errors**: Retries with increased timeout
- **Parse Errors**: Handles malformed JSON responses

### Value Creation Heuristic

When validation fails (422 error), one-request-4-all automatically creates values based on the expected type:

```typescript
import { createValueFromType } from "@vibe2founder/request2http";

createValueFromType("expected email"); // "example@domain.com"
createValueFromType("must be number"); // 0
createValueFromType("expected uuid"); // "00000000-0000-0000-0000-000000000000"
```

📖 **[Read the full Auto-Healing documentation](docs/AUTO_HEALING.md)**

## 💡 Advanced Usage

### Query Parameters

```typescript
const response = await request2http.get("https://api.example.com/users", {
  params: {
    page: 1,
    limit: 10,
    active: true,
  },
});
// GET https://api.example.com/users?page=1&limit=10&active=true
```

### Custom Headers

```typescript
const response = await request2http.post("https://api.example.com/users", userData, {
  headers: {
    Authorization: "Bearer token123",
    "Content-Type": "application/json",
    "X-API-Key": "your-api-key",
  },
});
```

### Different Response Types

```typescript
// JSON (default)
const jsonData = await request2http.get("/api/data");

// Text response
const textData = await request2http.get("/api/text", {
  responseType: "text",
});

// Stream response
const streamData = await request2http.get("/api/file", {
  responseType: "stream",
});
```

### Error Handling

```typescript
try {
  const response = await request2http.get("/api/users/123");
  console.log(response.data);
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.log(error.response.status);
    console.log(error.response.data);
  } else if (error.request) {
    // Network error
    console.log("Network error");
  } else {
    // Other error
    console.log("Error:", error.message);
  }
}
```

## 🔄 Migration from Axios

### Step 1: Change the import

```typescript
// Before
import axios from "axios";

// After
import request2http from "@vibe2founder/request2http";
```

### Step 2: Change the usage (if needed)

```typescript
// Before
const response = await axios.get("/api/users");

// After (same syntax works!)
const response = await request2http.get("/api/users");
```

### Compatibility Notes

- ✅ Same method signatures
- ✅ Same response structure
- ✅ Same error handling
- ✅ Same configuration options
- ✅ Full TypeScript support
- ⚠️ Some advanced axios features may not be implemented yet

## 🧪 Testing

```bash
npm test
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with 💜 by the PureCore team
</p>

<p align="center">
  <a href="https://github.com/suissa/purecore-request2http">⭐ Star us on GitHub</a>
</p>
