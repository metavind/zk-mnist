import { useEffect, useState } from "react";
import DIGITS from "./mnist_fc_unscaled_samples.json";
import './MNIST.css';
import './App.css';
import { MNISTSIZE } from "./config"

import { MODULUS, CIRCUIT_CONFIG, getHalo2Wasm, getNnWasm } from "./halo2-wasm";
import { CircuitScaffold } from "@axiom-crypto/halo2-js";

export const digSize = 4;
const randomDigits = randints(0, Object.keys(DIGITS).length / 2, 16);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randints(lo, hi, cnt) {
  var nums = Array(cnt).fill(0);
  for (let i = 0; i < cnt; i++) {
    var idx = getRandomInt(lo, hi);
    nums[i] = idx;
  };
  return nums;
};

export function MNISTSelect(props) {
  const size = digSize; // array of images to choose from
  const [imgUrl, setImgUrl] = useState([]);
  const [selected, setSelected] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [halo2wasm, setHalo2wasm] = useState(null);
  const [circuit, setCircuit] = useState(null);
  const [proof, setProof] = useState(null);
  const [proofDone, setProofDone] = useState(false)
  const [isVerified, setIsVerified] = useState(false);
  const [verifyDone, setVerifyDone] = useState(false)

  const [grid, setGrid] = useState(Array(size).fill(null).map(_ => Array(size).fill(0)));
  const dataURIList = [];
  var nrows = 4;
  var ncols = 4;
  var image = [];

  useEffect(() => {
    async function setup() {
      const halo2wasm = await getHalo2Wasm();
      setHalo2wasm(halo2wasm);
    }
    setup();
  }, []);

  const getImg = async () => {
    const p = 7; // it's a p*r x p*r 2d grid of pixels
    const r = 28; // with pxp blocks of identical pixels
    // so it's effectively a rxr grid of large pxp block pixels
    // TODO: images are overlapping and getting hidden by subsequent images in grid
    const canvas = document.createElement('canvas')
    canvas.width = 196;
    canvas.height = 196;
    const context = canvas.getContext('2d')
    var imageData = context.createImageData(p * r, p * r);

    for (let n = 0; n < size * size; n++) {
      let idx = randomDigits[n];
      const digit = DIGITS[`in${idx}`];
      for (var pos = 0; pos < p * p * r * r; pos++) {
        // i1,j1 = row and col for the physical grid
        let i1 = Math.floor(pos / (p * r));
        let j1 = pos % (p * r);
        let i = Math.floor(i1 / p);
        let j = Math.floor(j1 / p);
        let ind = i * r + j;
        imageData.data[4 * pos] = digit[ind] * 255;
        imageData.data[4 * pos + 1] = digit[ind] * 255;
        imageData.data[4 * pos + 2] = digit[ind] * 255;
        imageData.data[4 * pos + 3] = 255;
      }
      context.putImageData(imageData, 0, 0);
      const dataURI = canvas.toDataURL();
      dataURIList.push(dataURI);
    }
    setImgUrl(dataURIList);
  };

  useEffect(
    () => {
      getImg();
    }
    , []);

  function getSelectedImageAsInput(selected) {
    var input = new Uint32Array(MNISTSIZE);

    var idx = randomDigits[selected];
    const digit = DIGITS[`in${idx}`];
    for (let j = 0; j < MNISTSIZE; j++) {
      input[j] = digit[j] * 10 ** 6;
    }
    return input;
  }

  useEffect(() => {
    if (selected == null || halo2wasm == null) {
      console.log("No image selected");
      return;
    }

    const circuit = new CircuitScaffold(halo2wasm);
    circuit.newCircuitFromConfig(CIRCUIT_CONFIG);

    setCircuit(circuit);

    var input = getSelectedImageAsInput(selected);
    console.log(input);

    const nnwasm = getNnWasm(halo2wasm);
    const outputs = nnwasm.forward(halo2wasm, input).split('\n').map(x => {
      let bigX = BigInt(x);
      if (bigX > (MODULUS - 1n) / 2n) {
        bigX = -(MODULUS - bigX);
      }
      return bigX;
    });

    console.log(outputs);

    const argmaxOutput = outputs.indexOf(outputs.reduce((a, b) => a > b ? a : b));

    console.log(argmaxOutput);
    setPrediction(argmaxOutput);
  }, [selected]);

  async function doProof() {
    if (selected == null || prediction == null || circuit == null) {
      console.log("No image selected");
      return;
    }

    console.log("Keygen start");
    var kstart = performance.now();
    await circuit.keygen();
    var kend = performance.now();
    console.log(`Keygen time: ${kend - kstart} ms`);

    console.log("Proving start");
    var pstart = performance.now();
    const proof = circuit.prove();
    var pend = performance.now();
    console.log(`Prove time: ${pend - pstart} ms`);

    setProof(proof);
    setProofDone(true);

    // const tensor = new Tensor('float32', Float32Array.from(imgTensor), [batchSize, 1, 28, 28]);

    // const {quantizedEmbedding} = await doClassify(nselected,tensor,batchSize)
    // const { proof, publicSignals } = await generateProof(quantizedEmbedding)
    // // output of the circuit has size {batchSize} so we must slice
    // console.log("Proofdone:");
    // console.log(proof);
    // console.log("classification:");
    // console.log(publicSignals);
    // setPrediction(publicSignals.slice(0, nselected));
    // setPublicSignal(publicSignals);
    // setProof(proof);
    // setProofDone(true);
  }

  async function doVerify() {
    var vstart = performance.now();
    try {
      circuit.verify(proof);
      var vend = performance.now();
      console.log(`Verify time: ${vend - vstart} ms`);
      setIsVerified(true);
    } catch (e) {
      console.error(e);
      setIsVerified(false);
    }
    setVerifyDone(true);
    // const result = await verifyProof(proof, publicSignal)
    // if (result != null) {
    //   setIsVerified(result);
    //   setVerifyDone(true);
    // }
  }

  function GridSquare(row, col, onClick) {
    var _id = "imgSquareDigit(" + row + ", " + col + ")";
    return (
      <div className="imgSquareDigit" key={`${row}-${col}`}>
        <input type="checkbox" id={_id} checked={selected == row * size + col} readOnly />
        <label htmlFor={_id} >
          <img src={imgUrl[row * size + col]} alt="" onClick={() => onClick(row, col)} />
        </label>
      </div>
    );
  }

  function onClick(row, col) {
    console.log("Clicking " + row + ", " + col);
    var idx = row * size + col;
    setSelected(idx);
  }

  function renderCol(col) {
    var mycol = [];
    for (var row = 0; row < size; row++) {
      mycol.push(
        <div key={`${row}-${col}`}>{GridSquare(row, col, onClick)}</div>
      );
    }
    return (
      <div key={`${row}-${col}`}>
        {mycol}
      </div>
    );
  }

  function RenderGrid() {
    var grid = [];
    for (var i = 0; i < size; i++) {
      grid.push(renderCol(i));
    }
    return grid;
  }

  function ProofButton() {
    return (
      <button className="button" onClick={doProof}>
        Prove
      </button>
    );
  }

  function VerifyButton() {
    return (
      <button className="button" onClick={doVerify}>
        Verify
      </button>
    );
  }

  function DisplaySelection() {
    return (
      <div className="selectedPanel">
        <h2>Selected image index</h2>
        <div>
          {selected}
        </div>
      </div>
    );
  }

  function ProofBlock() {
    return (
      <>
        <div className="proof">
          <h2>Proof of computation</h2>
        </div>
        <textarea
          rows={16}
          value={proof}
          onChange={(e) => setProof(e.target.value)}
        />
      </>
    );
  }

  function VerifyBlock() {
    return (
      <div className="proof">
        <h2>Verified: {JSON.stringify(isVerified)}</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="MNISTBoard">
        <div className="bigText">
          Select digits to to classify
        </div>

        <div className="centerObject">
          <div className="grid">
            {RenderGrid()}
          </div>
        </div>
        <div className="buttonPanel">
          <ProofButton />
          <VerifyButton />
          {/* <ResetButton /> */}
        </div>
        {/* <DisplaySelection /> */}
        {prediction !== null && <h2>Prediction: {prediction}</h2>}
        {proofDone && ProofBlock()}
        {verifyDone && VerifyBlock()}
      </div>

    </div>
  );
}