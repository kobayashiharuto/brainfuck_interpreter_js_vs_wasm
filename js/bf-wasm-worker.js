// /js/wasm-worker.js
import init, { run_brainfuck } from '../pkg/wasm_project.js';

let isInitialized = false; 

async function runBrainfuck(code) {
  if (!isInitialized) {
    await init();
    isInitialized = true;
  }
  const bfCode = code;
  const output = run_brainfuck(bfCode);
  console.log(output);
  return output;
}

self.addEventListener('message', async function(e) {
    const code = e.data;
    const output = await runBrainfuck(code);
    self.postMessage(output);
});
