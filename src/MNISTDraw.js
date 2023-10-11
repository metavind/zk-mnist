import { useEffect, useState } from 'react'
import { size, MNISTSIZE } from './config';
import './MNIST.css';
import './App.css';

import { CopyBlock, dracula } from "react-code-blocks";

import { getHalo2Wasm, getNnWasm } from "./halo2-wasm";
import { CircuitScaffold } from "@axiom-crypto/halo2-js";


function MNISTBoard(props) {
  const [mouseDown, setMouseDown] = useState(false);

  function GridSquare(row, col, onChange) {
    function handleChange() {
      if (mouseDown) {
        onChange(row, col)
      }
    }

    function handleMouseDown() {
      setMouseDown(true);
      onChange(row, col)
    }

    function handleMouseUp() {
      setMouseDown(false);
    }

    return (
      <div key={`${row}-${col}}`} className={"square" + (props.grid[row][col] ? " on" : " off")}
        onMouseEnter={() => handleChange()}
        onMouseDown={() => handleMouseDown()}
        onMouseUp={() => handleMouseUp()}
      >
      </div>
    );
  }


  // Create column of of GridSquare objects
  function renderCol(col) {
    var mycol = [];
    for (var row = 0; row < size; row++) {
      mycol.push(
        <div key={`${row}-${col}`}>{GridSquare(row, col, props.onChange)}</div>
      );
    }
    return (
      <div key={col}>
        {mycol}
      </div>
    );
  }

  function RenderGrid() {
    var mygrid = [];
    for (var i = 0; i < size; i++) {
      mygrid.push(renderCol(i));
    }
    return mygrid;
  }

  return (
    <div className="MNISTBoard" >
      <div className="centerObject">
        <div className="grid">
          {RenderGrid()}
        </div>
      </div>
    </div>
  )
}

const CIRCUIT_CONFIG = {
    k: 14,
    numAdvice: 10,
    numLookupAdvice: 1,
    numInstance: 1,
    numLookupBits: 13,
    numVirtualInstance: 1
};

const MODULUS = BigInt("21888242871839275222246405745257275088548364400416034343698204186575808495617");

export function MNISTDraw() {
  const [quantizedEmbedding, setQuantizedEmbedding] = useState([])
  const [prediction, setPrediction] = useState(null);
  const [proof, setProof] = useState(null);
  const [circuit, setCircuit] = useState(null);
  const [halo2wasm, setHalo2wasm] = useState(null);
  const [proofDone, setProofDone] = useState(false)
  const [publicSignal, setPublicSignal] = useState()
  const [isVerified, setIsVerified] = useState(false);
  const [verifyDone, setVerifyDone] = useState(false)
  const [grid, setGrid] = useState(Array(size).fill(null).map(_ => Array(size).fill(0))); // initialize to a 28x28 array of 0's

  useEffect(() => {
    async function setup() {
      const halo2wasm = await getHalo2Wasm();
      const circuit = new CircuitScaffold(halo2wasm);
      circuit.newCircuitFromConfig(CIRCUIT_CONFIG);
      
      setCircuit(circuit);
      setHalo2wasm(halo2wasm);
    }
    setup();
  }, []);

  async function doProof() {
    var start = performance.now();
    // get image from grid
    var input = new Uint32Array(MNISTSIZE);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        input[i * size + j] = grid[i][j] * 255 * 10**6;
      }
    }
    console.log(input); 

    const nnwasm = getNnWasm(halo2wasm);
    const outputs = nnwasm.forward(halo2wasm, input).split('\n').map(x => {
      let bigX =  BigInt(x);
      if (bigX > (MODULUS - 1n) / 2n) {
        bigX = -(MODULUS - bigX);
      }
      return bigX;
    });
    
    console.log(outputs);
    
    const argmaxOutputs = outputs.indexOf(outputs.reduce((a, b) => a > b ? a : b));
    
    console.log(argmaxOutputs);

    // var kstart = performance.now();
    // await circuit.keygen();
    // var kend = performance.now();
    // console.log(`Keygen time: ${ kend - kstart} ms`);

    // var pstart = performance.now();
    // const proof = circuit.prove();
    // var pend = performance.now();
    // console.log(`Prove time: ${ pend - pstart} ms`);

    // setPrediction(argmaxOutputs);
    // setProof(proof);
    // setProofDone(true);

    // var nselected = 1;
    // const tensor = new Tensor('float32', Float32Array.from(imgTensor), [batchSize, 1, 28, 28]);
    // const {quantizedEmbedding} = await doClassify(nselected,tensor,batchSize)

    // var endTime = performance.now();
    // console.log(`Call to doSomething took ${endTime - start} milliseconds`)

    // const { proof, publicSignals } = await generateProof(quantizedEmbedding)
    // setPrediction(publicSignals[0]);
    // setPublicSignal(publicSignals);
    // setProof(proof);
    // setProofDone(true);
  }

  async function doVerify() {
    var vstart = performance.now();
    try {
      circuit.verify(proof);
      setIsVerified(true);
    } catch (e) {
      console.error(e);
      setIsVerified(false);
    }
    var vend = performance.now();
    console.log(`Verify time: ${ vend - vstart} ms`);
    setVerifyDone(true);
    // const result = await verifyProof(proof, publicSignal)
    // if (result != null) {
    //   setIsVerified(result);
    //   setVerifyDone(true);
    // }
  }

  function resetImage() {
    var newArray = Array(size).fill(null).map(_ => Array(size).fill(0));
    setGrid(newArray);
    setProofDone(false);
    setVerifyDone(false);
  }

  function handleSetSquare(myrow, mycol) {
    var newArray = [];
    for (var i = 0; i < grid.length; i++)
      newArray[i] = grid[i].slice();
    newArray[myrow][mycol] = 1;
    setGrid(newArray);
  }

  function ProofButton() {
    return (
      <button className="button" onClick={doProof}>
        Classify & Prove
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

  function ResetButton() {
    return (
      <button className="button" onClick={resetImage}>
        Reset image
      </button>
    );
  }

  function ProofBlock() {
    return (
      <>
        <div className="proof">
          <h2>Prediction</h2>
          {prediction}
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
    <div className="MNISTPage">
      <h2>Draw and classify a digit</h2>
      <div className="container">
        <MNISTBoard grid={grid} onChange={(r, c) => handleSetSquare(r, c)} />

        <div className="buttonPanel">
          <ProofButton />
          <VerifyButton />
          <ResetButton />
        </div>
      </div>
      {proofDone && ProofBlock()}
      {verifyDone && VerifyBlock()}
    </div>
  );
};
