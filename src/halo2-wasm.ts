import init, { init_panic_hook, Halo2Wasm, NnWasm } from "./halo2-nn-wasm/halo2_nn_wasm";

export const getHalo2Wasm = async () => {
  await init();
  init_panic_hook();
  const halo2wasm = new Halo2Wasm();
  return halo2wasm;
}

export const getNnWasm = (halo2wasm: Halo2Wasm) => {
  const nnwasm = new NnWasm(halo2wasm);
  return nnwasm;
}

export const CIRCUIT_CONFIG = {
  k: 14,
  numAdvice: 10,
  numLookupAdvice: 1,
  numInstance: 1,
  numLookupBits: 13,
  numVirtualInstance: 1
};

export const MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

export { Halo2Wasm, NnWasm };