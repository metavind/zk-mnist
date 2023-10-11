import { useState } from 'react'
import { size, MNISTSIZE } from './config';
import './MNIST.css';
import './App.css';

import { CopyBlock, dracula } from "react-code-blocks";

import { getHalo2Wasm, getNnWasm } from "./halo2-wasm";
import { CircuitScaffold, DEFAULT_CIRCUIT_CONFIG } from "@axiom-crypto/halo2-js";


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

export function MNISTDraw() {
  const [quantizedEmbedding, setQuantizedEmbedding] = useState([])
  const [prediction, setPrediction] = useState([]);
  const [proof, setProof] = useState("")
  const [proofDone, setProofDone] = useState(false)
  const [publicSignal, setPublicSignal] = useState()
  const [isVerified, setIsVerified] = useState(false);
  const [verifyDone, setVerifyDone] = useState(false)
  const batchSize = 16;
  const [grid, setGrid] = useState(Array(size).fill(null).map(_ => Array(size).fill(0))); // initialize to a 28x28 array of 0's

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const test = async () => {
    const halo2wasm = await getHalo2Wasm();
    const circuitScaffold = new CircuitScaffold(halo2wasm);
    circuitScaffold.newCircuitFromConfig(DEFAULT_CIRCUIT_CONFIG);
    const nnwasm = getNnWasm(halo2wasm);

    const inp = new Uint32Array([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      376471,
      474510,
      474510,
      474510,
      474510,
      745098,
      474510,
      745098,
      745098,
      635294,
      854902,
      474510,
      474510,
      423529,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      180392,
      419608,
      858824,
      976471,
      988235,
      988235,
      988235,
      988235,
      988235,
      992157,
      988235,
      988235,
      988235,
      988235,
      988235,
      988235,
      984314,
      941176,
      941176,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      176471,
      905882,
      988235,
      988235,
      988235,
      909804,
      619608,
      854902,
      988235,
      792157,
      992157,
      988235,
      850980,
      929412,
      988235,
      988235,
      988235,
      752941,
      592157,
      101961,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      913725,
      988235,
      988235,
      988235,
      764706,
      121569,
      0,
      98039,
      152941,
      74510,
      152941,
      152941,
      98039,
      396078,
      988235,
      988235,
      415686,
      58824,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      729412,
      976471,
      988235,
      988235,
      933333,
      400000,
      82353,
      0,
      0,
      0,
      0,
      0,
      98039,
      768627,
      988235,
      988235,
      309804,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      466667,
      854902,
      988235,
      988235,
      988235,
      729412,
      188235,
      0,
      0,
      0,
      90196,
      501961,
      988235,
      988235,
      831373,
      82353,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      117647,
      749020,
      870588,
      988235,
      988235,
      952941,
      650980,
      74510,
      78431,
      784314,
      988235,
      988235,
      945098,
      380392,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      98039,
      474510,
      952941,
      988235,
      988235,
      796078,
      800000,
      988235,
      988235,
      952941,
      376471,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      286275,
      776471,
      988235,
      988235,
      992157,
      988235,
      968627,
      639216,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      360784,
      815686,
      988235,
      988235,
      992157,
      988235,
      619608,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      125490,
      474510,
      827451,
      992157,
      992157,
      992157,
      1000000,
      992157,
      800000,
      74510,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      133333,
      568627,
      988235,
      988235,
      988235,
      988235,
      764706,
      772549,
      988235,
      988235,
      780392,
      90196,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      137255,
      839216,
      988235,
      988235,
      988235,
      949020,
      592157,
      47059,
      50980,
      945098,
      988235,
      988235,
      207843,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      356863,
      890196,
      988235,
      988235,
      988235,
      772549,
      329412,
      0,
      0,
      0,
      772549,
      988235,
      988235,
      207843,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      831373,
      988235,
      988235,
      917647,
      615686,
      66667,
      0,
      0,
      0,
      0,
      556863,
      988235,
      988235,
      207843,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      101961,
      949020,
      988235,
      988235,
      615686,
      0,
      0,
      0,
      0,
      0,
      211765,
      949020,
      988235,
      988235,
      207843,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      474510,
      988235,
      988235,
      988235,
      207843,
      0,
      109804,
      160784,
      160784,
      435294,
      992157,
      988235,
      988235,
      690196,
      66667,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      172549,
      956863,
      988235,
      988235,
      701961,
      627451,
      874510,
      988235,
      988235,
      988235,
      992157,
      988235,
      698039,
      58824,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      635294,
      988235,
      988235,
      988235,
      988235,
      988235,
      988235,
      988235,
      988235,
      941176,
      439216,
      43137,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      200000,
      658824,
      988235,
      988235,
      988235,
      988235,
      988235,
      682353,
      466667,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
  ]);

    const s = nnwasm.forward(halo2wasm, inp);

    console.log(s);

    await circuitScaffold.keygen();
    const proof = circuitScaffold.prove();

    console.log(proof);
  }

  async function doProof() {
    var start = performance.now();
    // get image from grid
    var imgTensor = Array(batchSize * MNISTSIZE).fill(0);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        imgTensor[i * size + j] = grid[i][j];
      }
    }

    console.log("doProof");
    console.log(imgTensor);

    await test();

    // var nselected = 1;
    // const tensor = new Tensor('float32', Float32Array.from(imgTensor), [batchSize, 1, 28, 28]);
    // const {quantizedEmbedding} = await doClassify(nselected,tensor,batchSize)

    // var endTime = performance.now();
    // console.log(`Call to doSomething took ${endTime - start} milliseconds`)

    // var pstart = performance.now();
    // const { proof, publicSignals } = await generateProof(quantizedEmbedding)
    // var pend = performance.now();
    // console.log(`Proof time: ${ pend - pstart} ms`);
    // setPrediction(publicSignals[0]);
    // setPublicSignal(publicSignals);
    // setProof(proof);
    // setProofDone(true);

  }

  async function doVerify() {
    // const result = await verifyProof(proof, publicSignal)
    // if (result != null) {
    //   setIsVerified(result);
    //   setVerifyDone(true);
    // }
    console.log("doVerify");
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
      <div className="proof">
        <h2>Prediction</h2>
        {prediction}
        <h2>Proof of computation</h2>
        <CopyBlock
          text={JSON.stringify(proof, null, 2)}
          language="json"
          theme={dracula}
        />
      </div>
    );
  }

  function VerifyBlock() {
    return (
      <div className="proof">
        <h2>Verified by on-chain smart contract: {JSON.stringify(isVerified)}</h2>
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
