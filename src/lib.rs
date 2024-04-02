use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn run_brainfuck(code: &str) -> String {
    let mut output = String::new();
    let mut memory = vec![0u8; 30000];
    let mut pointer = 0usize;
    let jump_table = optimize_brainfuck(code);
    let mut pc = 0usize;
    let code_bytes = code.as_bytes();

    while pc < code.len() {
        match code_bytes[pc] as char {
            '>' => pointer += 1,
            '<' => pointer -= 1,
            '+' => memory[pointer] = memory[pointer].wrapping_add(1),
            '-' => memory[pointer] = memory[pointer].wrapping_sub(1),
            '.' => output.push(memory[pointer] as char),
            '[' => {
                if memory[pointer] == 0 {
                    pc = *jump_table.get(&pc).unwrap();
                }
            }
            ']' => {
                if memory[pointer] != 0 {
                    pc = *jump_table.get(&pc).unwrap();
                }
            }
            _ => {}
        }
        pc += 1;
    }

    output
}

fn optimize_brainfuck(code: &str) -> HashMap<usize, usize> {
    let mut jump_table = HashMap::new();
    let mut stack = Vec::new();

    for (i, c) in code.chars().enumerate() {
        match c {
            '[' => stack.push(i),
            ']' => {
                let start = stack.pop().expect("Mismatched brackets");
                jump_table.insert(start, i);
                jump_table.insert(i, start);
            }
            _ => {}
        }
    }

    if !stack.is_empty() {
        panic!("Mismatched brackets");
    }

    jump_table
}
