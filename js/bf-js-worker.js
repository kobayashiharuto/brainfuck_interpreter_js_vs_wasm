function optimizeBrainfuck(code) {
    const jumpTable = {};
    const stack = [];
  
    for (let i = 0; i < code.length; i++) {
        if (code[i] === '[') {
            stack.push(i);
        } else if (code[i] === ']') {
            const start = stack.pop();
            const end = i;
            jumpTable[start] = end;
            jumpTable[end] = start;
        }
    }
  
    return jumpTable;
}

function runBrainfuck(code) {
    const memory = new Uint8Array(30000);
    let pointer = 0;
    let output = '';
    const jumpTable = optimizeBrainfuck(code);
  
    for (let i = 0; i < code.length; i++) {
        switch (code[i]) {
            case '>': pointer++; break;
            case '<': pointer--; break;
            case '+': memory[pointer]++; break;
            case '-': memory[pointer]--; break;
            case '.':
                output += String.fromCharCode(memory[pointer]);
                break;
            case '[':
                if (memory[pointer] === 0) {
                    i = jumpTable[i];
                }
                break;
            case ']':
                if (memory[pointer] !== 0) {
                    i = jumpTable[i];
                }
                break;
        }
    }
  
    return output;
}

self.addEventListener('message', function(e) {
    const code = e.data;
    const output = runBrainfuck(code);
    self.postMessage(output); 
});
