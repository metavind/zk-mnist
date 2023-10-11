/* tslint:disable */
/* eslint-disable */
/**
*/
export function init_panic_hook(): void;
export interface CircuitStats {
    advice: number;
    lookup: number;
    fixed: number;
    instance: number;
    k: number;
}

export interface CircuitConfig {
    k: number;
    numAdvice: number;
    numLookupAdvice: number;
    numInstance: number;
    numLookupBits: number;
    numVirtualInstance: number;
}

/**
*/
export class Halo2LibWasm {
  free(): void;
/**
* @param {Halo2Wasm} circuit
*/
  constructor(circuit: Halo2Wasm);
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  add(a: number, b: number): number;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  sub(a: number, b: number): number;
/**
* @param {number} a
* @returns {number}
*/
  neg(a: number): number;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  mul(a: number, b: number): number;
/**
* @param {number} a
* @param {number} b
* @param {number} c
* @returns {number}
*/
  mul_add(a: number, b: number, c: number): number;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  mul_not(a: number, b: number): number;
/**
* @param {number} a
*/
  assert_bit(a: number): void;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  div_unsafe(a: number, b: number): number;
/**
* @param {number} a
* @param {string} b
*/
  assert_is_const(a: number, b: string): void;
/**
* @param {Uint32Array} a
* @param {Uint32Array} b
* @returns {number}
*/
  inner_product(a: Uint32Array, b: Uint32Array): number;
/**
* @param {Uint32Array} a
* @returns {number}
*/
  sum(a: Uint32Array): number;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  and(a: number, b: number): number;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  or(a: number, b: number): number;
/**
* @param {number} a
* @returns {number}
*/
  not(a: number): number;
/**
* @param {number} a
* @returns {number}
*/
  dec(a: number): number;
/**
* @param {number} a
* @param {number} b
* @param {number} sel
* @returns {number}
*/
  select(a: number, b: number, sel: number): number;
/**
* @param {number} a
* @param {number} b
* @param {number} c
* @returns {number}
*/
  or_and(a: number, b: number, c: number): number;
/**
* @param {Uint32Array} a
* @returns {Uint32Array}
*/
  bits_to_indicator(a: Uint32Array): Uint32Array;
/**
* @param {number} a
* @param {string} b
* @returns {Uint32Array}
*/
  idx_to_indicator(a: number, b: string): Uint32Array;
/**
* @param {Uint32Array} a
* @param {Uint32Array} indicator
* @returns {number}
*/
  select_by_indicator(a: Uint32Array, indicator: Uint32Array): number;
/**
* @param {Uint32Array} a
* @param {number} idx
* @returns {number}
*/
  select_from_idx(a: Uint32Array, idx: number): number;
/**
* @param {number} a
* @returns {number}
*/
  is_zero(a: number): number;
/**
* @param {number} a
* @param {number} b
* @returns {number}
*/
  is_equal(a: number, b: number): number;
/**
* @param {number} a
* @param {string} num_bits
* @returns {Uint32Array}
*/
  num_to_bits(a: number, num_bits: string): Uint32Array;
/**
* @param {number} a
* @param {number} b
*/
  constrain_equal(a: number, b: number): void;
/**
* @param {number} a
* @param {string} b
*/
  range_check(a: number, b: string): void;
/**
* @param {number} a
* @param {number} b
* @param {string} size
*/
  check_less_than(a: number, b: number, size: string): void;
/**
* @param {number} a
* @param {string} b
*/
  check_less_than_safe(a: number, b: string): void;
/**
* @param {number} a
* @param {number} b
* @param {string} size
* @returns {number}
*/
  is_less_than(a: number, b: number, size: string): number;
/**
* @param {number} a
* @param {string} b
* @returns {number}
*/
  is_less_than_safe(a: number, b: string): number;
/**
* @param {number} a
* @param {string} b
* @param {string} size
* @returns {Uint32Array}
*/
  div_mod(a: number, b: string, size: string): Uint32Array;
/**
* @param {number} a
* @param {number} b
* @param {string} a_size
* @param {string} b_size
* @returns {Uint32Array}
*/
  div_mod_var(a: number, b: number, a_size: string, b_size: string): Uint32Array;
/**
* @param {number} a
* @param {number} b
* @param {string} max_bits
* @returns {number}
*/
  pow_var(a: number, b: number, max_bits: string): number;
/**
* @param {Uint32Array} a
* @returns {number}
*/
  poseidon(a: Uint32Array): number;
/**
* @param {string} val
* @returns {number}
*/
  witness(val: string): number;
/**
* @param {string} val
* @returns {number}
*/
  constant(val: string): number;
/**
* @param {Halo2Wasm} circuit
* @param {number} a
* @param {number} col
*/
  make_public(circuit: Halo2Wasm, a: number, col: number): void;
/**
* @param {Halo2Wasm} circuit
* @param {number} a
*/
  log(circuit: Halo2Wasm, a: number): void;
/**
* @param {number} a
* @returns {string}
*/
  value(a: number): string;
/**
* @returns {number}
*/
  lookup_bits(): number;
}
/**
*/
export class Halo2Wasm {
  free(): void;
/**
*/
  constructor();
/**
*/
  clear(): void;
/**
*/
  clear_instances(): void;
/**
* @param {Uint8Array} proof
*/
  verify(proof: Uint8Array): void;
/**
* @param {number} col
* @returns {Uint32Array}
*/
  get_instances(col: number): Uint32Array;
/**
* @param {Uint32Array} instances
* @param {number} col
*/
  set_instances(instances: Uint32Array, col: number): void;
/**
* @param {number} col
* @returns {any}
*/
  get_instance_values(col: number): any;
/**
* @param {CircuitConfig} config
*/
  config(config: CircuitConfig): void;
/**
* @returns {CircuitStats}
*/
  get_circuit_stats(): CircuitStats;
/**
* @returns {Uint8Array}
*/
  get_vk(): Uint8Array;
/**
* @returns {Uint8Array}
*/
  get_partial_vk(): Uint8Array;
/**
* @returns {Uint8Array}
*/
  get_pk(): Uint8Array;
/**
*/
  assign_instances(): void;
/**
*/
  mock(): void;
/**
* @param {Uint8Array} params
*/
  load_params(params: Uint8Array): void;
/**
* @param {Uint8Array} vk
*/
  load_vk(vk: Uint8Array): void;
/**
*/
  gen_vk(): void;
/**
*/
  gen_pk(): void;
/**
* @returns {Uint8Array}
*/
  prove(): Uint8Array;
/**
* @param {string} a
*/
  log(a: string): void;
}
/**
*/
export class NnWasm {
  free(): void;
/**
* @param {Halo2Wasm} circuit
*/
  constructor(circuit: Halo2Wasm);
/**
* @param {Halo2Wasm} circuit
* @param {Uint32Array} input
* @returns {string}
*/
  forward(circuit: Halo2Wasm, input: Uint32Array): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly __wbg_nnwasm_free: (a: number) => void;
  readonly nnwasm_new: (a: number) => number;
  readonly nnwasm_forward: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_halo2wasm_free: (a: number) => void;
  readonly halo2wasm_new: () => number;
  readonly halo2wasm_clear: (a: number) => void;
  readonly halo2wasm_clear_instances: (a: number) => void;
  readonly halo2wasm_verify: (a: number, b: number, c: number) => void;
  readonly halo2wasm_get_instances: (a: number, b: number, c: number) => void;
  readonly halo2wasm_set_instances: (a: number, b: number, c: number, d: number) => void;
  readonly halo2wasm_get_instance_values: (a: number, b: number) => number;
  readonly halo2wasm_config: (a: number, b: number) => void;
  readonly halo2wasm_get_circuit_stats: (a: number) => number;
  readonly halo2wasm_get_vk: (a: number, b: number) => void;
  readonly halo2wasm_get_partial_vk: (a: number, b: number) => void;
  readonly halo2wasm_get_pk: (a: number, b: number) => void;
  readonly halo2wasm_assign_instances: (a: number) => void;
  readonly halo2wasm_mock: (a: number) => void;
  readonly halo2wasm_load_params: (a: number, b: number, c: number) => void;
  readonly halo2wasm_load_vk: (a: number, b: number, c: number) => void;
  readonly halo2wasm_gen_vk: (a: number) => void;
  readonly halo2wasm_gen_pk: (a: number) => void;
  readonly halo2wasm_prove: (a: number, b: number) => void;
  readonly halo2wasm_log: (a: number, b: number, c: number) => void;
  readonly init_panic_hook: () => void;
  readonly __wbg_halo2libwasm_free: (a: number) => void;
  readonly halo2libwasm_new: (a: number) => number;
  readonly halo2libwasm_add: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_sub: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_neg: (a: number, b: number) => number;
  readonly halo2libwasm_mul: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_mul_add: (a: number, b: number, c: number, d: number) => number;
  readonly halo2libwasm_mul_not: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_assert_bit: (a: number, b: number) => void;
  readonly halo2libwasm_div_unsafe: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_assert_is_const: (a: number, b: number, c: number, d: number) => void;
  readonly halo2libwasm_inner_product: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly halo2libwasm_sum: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_and: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_or: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_not: (a: number, b: number) => number;
  readonly halo2libwasm_dec: (a: number, b: number) => number;
  readonly halo2libwasm_select: (a: number, b: number, c: number, d: number) => number;
  readonly halo2libwasm_or_and: (a: number, b: number, c: number, d: number) => number;
  readonly halo2libwasm_bits_to_indicator: (a: number, b: number, c: number, d: number) => void;
  readonly halo2libwasm_idx_to_indicator: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly halo2libwasm_select_by_indicator: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly halo2libwasm_select_from_idx: (a: number, b: number, c: number, d: number) => number;
  readonly halo2libwasm_is_zero: (a: number, b: number) => number;
  readonly halo2libwasm_is_equal: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_num_to_bits: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly halo2libwasm_constrain_equal: (a: number, b: number, c: number) => void;
  readonly halo2libwasm_range_check: (a: number, b: number, c: number, d: number) => void;
  readonly halo2libwasm_check_less_than: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly halo2libwasm_check_less_than_safe: (a: number, b: number, c: number, d: number) => void;
  readonly halo2libwasm_is_less_than: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly halo2libwasm_is_less_than_safe: (a: number, b: number, c: number, d: number) => number;
  readonly halo2libwasm_div_mod: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly halo2libwasm_div_mod_var: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => void;
  readonly halo2libwasm_pow_var: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly halo2libwasm_poseidon: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_witness: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_constant: (a: number, b: number, c: number) => number;
  readonly halo2libwasm_make_public: (a: number, b: number, c: number, d: number) => void;
  readonly halo2libwasm_log: (a: number, b: number, c: number) => void;
  readonly halo2libwasm_value: (a: number, b: number, c: number) => void;
  readonly halo2libwasm_lookup_bits: (a: number) => number;
  readonly memory: WebAssembly.Memory;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_thread_destroy: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput, maybe_memory?: WebAssembly.Memory): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
* @param {WebAssembly.Memory} maybe_memory
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>, maybe_memory?: WebAssembly.Memory): Promise<InitOutput>;
