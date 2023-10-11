let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.buffer !== wasm.memory.buffer) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().slice(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.buffer !== wasm.memory.buffer) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.buffer !== wasm.memory.buffer) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
*/
export function init_panic_hook() {
    wasm.init_panic_hook();
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export class Halo2LibWasm {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Halo2LibWasm.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_halo2libwasm_free(ptr);
    }
    /**
    * @param {Halo2Wasm} circuit
    */
    constructor(circuit) {
        _assertClass(circuit, Halo2Wasm);
        const ret = wasm.halo2libwasm_new(circuit.__wbg_ptr);
        return Halo2LibWasm.__wrap(ret);
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    add(a, b) {
        const ret = wasm.halo2libwasm_add(this.__wbg_ptr, a, b);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    sub(a, b) {
        const ret = wasm.halo2libwasm_sub(this.__wbg_ptr, a, b);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @returns {number}
    */
    neg(a) {
        const ret = wasm.halo2libwasm_neg(this.__wbg_ptr, a);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    mul(a, b) {
        const ret = wasm.halo2libwasm_mul(this.__wbg_ptr, a, b);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @param {number} c
    * @returns {number}
    */
    mul_add(a, b, c) {
        const ret = wasm.halo2libwasm_mul_add(this.__wbg_ptr, a, b, c);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    mul_not(a, b) {
        const ret = wasm.halo2libwasm_mul_not(this.__wbg_ptr, a, b);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    */
    assert_bit(a) {
        wasm.halo2libwasm_assert_bit(this.__wbg_ptr, a);
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    div_unsafe(a, b) {
        const ret = wasm.halo2libwasm_div_unsafe(this.__wbg_ptr, a, b);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {string} b
    */
    assert_is_const(a, b) {
        const ptr0 = passStringToWasm0(b, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.halo2libwasm_assert_is_const(this.__wbg_ptr, a, ptr0, len0);
    }
    /**
    * @param {Uint32Array} a
    * @param {Uint32Array} b
    * @returns {number}
    */
    inner_product(a, b) {
        const ptr0 = passArray32ToWasm0(a, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(b, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_inner_product(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret >>> 0;
    }
    /**
    * @param {Uint32Array} a
    * @returns {number}
    */
    sum(a) {
        const ptr0 = passArray32ToWasm0(a, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_sum(this.__wbg_ptr, ptr0, len0);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    and(a, b) {
        const ret = wasm.halo2libwasm_and(this.__wbg_ptr, a, b);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    or(a, b) {
        const ret = wasm.halo2libwasm_or(this.__wbg_ptr, a, b);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @returns {number}
    */
    not(a) {
        const ret = wasm.halo2libwasm_not(this.__wbg_ptr, a);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @returns {number}
    */
    dec(a) {
        const ret = wasm.halo2libwasm_dec(this.__wbg_ptr, a);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @param {number} sel
    * @returns {number}
    */
    select(a, b, sel) {
        const ret = wasm.halo2libwasm_select(this.__wbg_ptr, a, b, sel);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @param {number} c
    * @returns {number}
    */
    or_and(a, b, c) {
        const ret = wasm.halo2libwasm_or_and(this.__wbg_ptr, a, b, c);
        return ret >>> 0;
    }
    /**
    * @param {Uint32Array} a
    * @returns {Uint32Array}
    */
    bits_to_indicator(a) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray32ToWasm0(a, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.halo2libwasm_bits_to_indicator(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v2 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} a
    * @param {string} b
    * @returns {Uint32Array}
    */
    idx_to_indicator(a, b) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(b, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.halo2libwasm_idx_to_indicator(retptr, this.__wbg_ptr, a, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v2 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint32Array} a
    * @param {Uint32Array} indicator
    * @returns {number}
    */
    select_by_indicator(a, indicator) {
        const ptr0 = passArray32ToWasm0(a, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(indicator, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_select_by_indicator(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret >>> 0;
    }
    /**
    * @param {Uint32Array} a
    * @param {number} idx
    * @returns {number}
    */
    select_from_idx(a, idx) {
        const ptr0 = passArray32ToWasm0(a, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_select_from_idx(this.__wbg_ptr, ptr0, len0, idx);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @returns {number}
    */
    is_zero(a) {
        const ret = wasm.halo2libwasm_is_zero(this.__wbg_ptr, a);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {number} b
    * @returns {number}
    */
    is_equal(a, b) {
        const ret = wasm.halo2libwasm_is_equal(this.__wbg_ptr, a, b);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {string} num_bits
    * @returns {Uint32Array}
    */
    num_to_bits(a, num_bits) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(num_bits, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.halo2libwasm_num_to_bits(retptr, this.__wbg_ptr, a, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v2 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} a
    * @param {number} b
    */
    constrain_equal(a, b) {
        wasm.halo2libwasm_constrain_equal(this.__wbg_ptr, a, b);
    }
    /**
    * @param {number} a
    * @param {string} b
    */
    range_check(a, b) {
        const ptr0 = passStringToWasm0(b, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.halo2libwasm_range_check(this.__wbg_ptr, a, ptr0, len0);
    }
    /**
    * @param {number} a
    * @param {number} b
    * @param {string} size
    */
    check_less_than(a, b, size) {
        const ptr0 = passStringToWasm0(size, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.halo2libwasm_check_less_than(this.__wbg_ptr, a, b, ptr0, len0);
    }
    /**
    * @param {number} a
    * @param {string} b
    */
    check_less_than_safe(a, b) {
        const ptr0 = passStringToWasm0(b, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.halo2libwasm_check_less_than_safe(this.__wbg_ptr, a, ptr0, len0);
    }
    /**
    * @param {number} a
    * @param {number} b
    * @param {string} size
    * @returns {number}
    */
    is_less_than(a, b, size) {
        const ptr0 = passStringToWasm0(size, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_is_less_than(this.__wbg_ptr, a, b, ptr0, len0);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {string} b
    * @returns {number}
    */
    is_less_than_safe(a, b) {
        const ptr0 = passStringToWasm0(b, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_is_less_than_safe(this.__wbg_ptr, a, ptr0, len0);
        return ret >>> 0;
    }
    /**
    * @param {number} a
    * @param {string} b
    * @param {string} size
    * @returns {Uint32Array}
    */
    div_mod(a, b, size) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(b, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(size, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.halo2libwasm_div_mod(retptr, this.__wbg_ptr, a, ptr0, len0, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v3 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v3;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} a
    * @param {number} b
    * @param {string} a_size
    * @param {string} b_size
    * @returns {Uint32Array}
    */
    div_mod_var(a, b, a_size, b_size) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(a_size, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(b_size, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.halo2libwasm_div_mod_var(retptr, this.__wbg_ptr, a, b, ptr0, len0, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v3 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v3;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} a
    * @param {number} b
    * @param {string} max_bits
    * @returns {number}
    */
    pow_var(a, b, max_bits) {
        const ptr0 = passStringToWasm0(max_bits, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_pow_var(this.__wbg_ptr, a, b, ptr0, len0);
        return ret >>> 0;
    }
    /**
    * @param {Uint32Array} a
    * @returns {number}
    */
    poseidon(a) {
        const ptr0 = passArray32ToWasm0(a, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_poseidon(this.__wbg_ptr, ptr0, len0);
        return ret >>> 0;
    }
    /**
    * @param {string} val
    * @returns {number}
    */
    witness(val) {
        const ptr0 = passStringToWasm0(val, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_witness(this.__wbg_ptr, ptr0, len0);
        return ret >>> 0;
    }
    /**
    * @param {string} val
    * @returns {number}
    */
    constant(val) {
        const ptr0 = passStringToWasm0(val, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.halo2libwasm_constant(this.__wbg_ptr, ptr0, len0);
        return ret >>> 0;
    }
    /**
    * @param {Halo2Wasm} circuit
    * @param {number} a
    * @param {number} col
    */
    make_public(circuit, a, col) {
        _assertClass(circuit, Halo2Wasm);
        wasm.halo2libwasm_make_public(this.__wbg_ptr, circuit.__wbg_ptr, a, col);
    }
    /**
    * @param {Halo2Wasm} circuit
    * @param {number} a
    */
    log(circuit, a) {
        _assertClass(circuit, Halo2Wasm);
        wasm.halo2libwasm_log(this.__wbg_ptr, circuit.__wbg_ptr, a);
    }
    /**
    * @param {number} a
    * @returns {string}
    */
    value(a) {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.halo2libwasm_value(retptr, this.__wbg_ptr, a);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @returns {number}
    */
    lookup_bits() {
        const ret = wasm.halo2libwasm_lookup_bits(this.__wbg_ptr);
        return ret >>> 0;
    }
}
/**
*/
export class Halo2Wasm {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Halo2Wasm.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_halo2wasm_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.halo2wasm_new();
        return Halo2Wasm.__wrap(ret);
    }
    /**
    */
    clear() {
        wasm.halo2wasm_clear(this.__wbg_ptr);
    }
    /**
    */
    clear_instances() {
        wasm.halo2wasm_clear_instances(this.__wbg_ptr);
    }
    /**
    * @param {Uint8Array} proof
    */
    verify(proof) {
        const ptr0 = passArray8ToWasm0(proof, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.halo2wasm_verify(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @param {number} col
    * @returns {Uint32Array}
    */
    get_instances(col) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.halo2wasm_get_instances(retptr, this.__wbg_ptr, col);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint32Array} instances
    * @param {number} col
    */
    set_instances(instances, col) {
        const ptr0 = passArray32ToWasm0(instances, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.halo2wasm_set_instances(this.__wbg_ptr, ptr0, len0, col);
    }
    /**
    * @param {number} col
    * @returns {any}
    */
    get_instance_values(col) {
        const ret = wasm.halo2wasm_get_instance_values(this.__wbg_ptr, col);
        return takeObject(ret);
    }
    /**
    * @param {CircuitConfig} config
    */
    config(config) {
        wasm.halo2wasm_config(this.__wbg_ptr, addHeapObject(config));
    }
    /**
    * @returns {CircuitStats}
    */
    get_circuit_stats() {
        const ret = wasm.halo2wasm_get_circuit_stats(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    get_vk() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.halo2wasm_get_vk(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    get_partial_vk() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.halo2wasm_get_partial_vk(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    get_pk() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.halo2wasm_get_pk(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    */
    assign_instances() {
        wasm.halo2wasm_assign_instances(this.__wbg_ptr);
    }
    /**
    */
    mock() {
        wasm.halo2wasm_mock(this.__wbg_ptr);
    }
    /**
    * @param {Uint8Array} params
    */
    load_params(params) {
        const ptr0 = passArray8ToWasm0(params, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.halo2wasm_load_params(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @param {Uint8Array} vk
    */
    load_vk(vk) {
        const ptr0 = passArray8ToWasm0(vk, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.halo2wasm_load_vk(this.__wbg_ptr, ptr0, len0);
    }
    /**
    */
    gen_vk() {
        wasm.halo2wasm_gen_vk(this.__wbg_ptr);
    }
    /**
    */
    gen_pk() {
        wasm.halo2wasm_gen_pk(this.__wbg_ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    prove() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.halo2wasm_prove(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {string} a
    */
    log(a) {
        const ptr0 = passStringToWasm0(a, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.halo2wasm_log(this.__wbg_ptr, ptr0, len0);
    }
}
/**
*/
export class NnWasm {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(NnWasm.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nnwasm_free(ptr);
    }
    /**
    * @param {Halo2Wasm} circuit
    */
    constructor(circuit) {
        _assertClass(circuit, Halo2Wasm);
        const ret = wasm.nnwasm_new(circuit.__wbg_ptr);
        return NnWasm.__wrap(ret);
    }
    /**
    * @param {Halo2Wasm} circuit
    * @param {Uint32Array} input
    * @returns {string}
    */
    forward(circuit, input) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(circuit, Halo2Wasm);
            const ptr0 = passArray32ToWasm0(input, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.nnwasm_forward(retptr, this.__wbg_ptr, circuit.__wbg_ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred2_0 = r0;
            deferred2_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_log_8bd383d2184e36d4 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_crypto_c48a774b022d20ac = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_process_298734cf255a885d = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_e2e78e134e3e5d01 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_1cd7a5d853dbea79 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_msCrypto_bcb970640f50a1e8 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_8f08ceecec0f4fee = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_dc1e9a60c158336d = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_37fa2ca9e4e07fab = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_new_898a68150f225f2e = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_581967eacc0e2604 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_cb65541d95d71282 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_self_1ff1d729e9aae938 = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_5f4faef6c12b79ec = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_1d39714405582d3c = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_651f05c6a0944d1c = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_set_502d29070ea18557 = function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    };
    imports.wbg.__wbg_call_01734de55d61e11d = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_buffer_085ec1f694018c4f = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_6da8e527659b86aa = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_8125e318e6245eed = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_5cf90238115182c3 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_newwithlength_e5d69174d6984cd7 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_13db269f57aa838d = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_parse_670c19d4e984792e = function() { return handleError(function (arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_stringify_e25465938f3f611f = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {
    imports.wbg.memory = maybe_memory || new WebAssembly.Memory({initial:59,maximum:65536,shared:true});
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module, maybe_memory) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports, maybe_memory);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input, maybe_memory) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('halo2_nn_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports, maybe_memory);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
