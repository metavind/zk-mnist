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

export { Halo2Wasm, NnWasm };
