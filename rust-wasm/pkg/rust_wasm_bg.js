import * as wasm from './rust_wasm_bg.wasm';

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

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
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
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

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_30(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__he7f10970df57129b(arg0, arg1, addHeapObject(arg2));
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {string} url
* @param {string} key
* @returns {Promise<any>}
*/
export function get_image_from_db(url, key) {
    var ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.get_image_from_db(ptr0, len0, ptr1, len1);
    return takeObject(ret);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
function __wbg_adapter_87(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__hd76261d73af606d5(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export class Image {

    static __wrap(ptr) {
        const obj = Object.create(Image.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_image_free(ptr);
    }
    /**
    * @param {BigInt} id
    * @param {number} width
    * @param {number} height
    * @returns {Image}
    */
    static new(id, width, height) {
        uint64CvtShim[0] = id;
        const low0 = u32CvtShim[0];
        const high0 = u32CvtShim[1];
        var ret = wasm.image_new(low0, high0, width, height);
        return Image.__wrap(ret);
    }
    /**
    * @param {any} val
    * @returns {Image}
    */
    static decode(val) {
        try {
            var ret = wasm.image_decode(addBorrowedObject(val));
            return Image.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {number}
    */
    width() {
        var ret = wasm.image_width(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {number}
    */
    height() {
        var ret = wasm.image_height(this.ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} row
    * @param {number} col
    * @returns {number}
    */
    get_index(row, col) {
        var ret = wasm.image_get_index(this.ptr, row, col);
        return ret >>> 0;
    }
    /**
    * @param {number} row
    * @param {number} col
    * @returns {Pixel}
    */
    get_pixel(row, col) {
        var ret = wasm.image_get_pixel(this.ptr, row, col);
        return Pixel.__wrap(ret);
    }
    /**
    */
    sort_pixels() {
        wasm.image_sort_pixels(this.ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    pixels() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.image_pixels(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {number} x
    * @param {number} y
    * @param {Uint8Array} color
    */
    paint(x, y, color) {
        var ptr0 = passArray8ToWasm0(color, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.image_paint(this.ptr, x, y, ptr0, len0);
    }
    /**
    * @param {number} idx
    * @param {Uint8Array} color
    */
    paint_with_idx(idx, color) {
        var ptr0 = passArray8ToWasm0(color, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.image_paint_with_idx(this.ptr, idx, ptr0, len0);
    }
    /**
    * @returns {string}
    */
    encode() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.image_encode(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class Pixel {

    static __wrap(ptr) {
        const obj = Object.create(Pixel.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pixel_free(ptr);
    }
    /**
    * @returns {string}
    */
    encode() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pixel_encode(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {any} val
    * @returns {Pixel}
    */
    static decode(val) {
        try {
            var ret = wasm.pixel_decode(addBorrowedObject(val));
            return Pixel.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {BigInt}
    */
    id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.pixel_id(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {number}
    */
    r() {
        var ret = wasm.pixel_r(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    g() {
        var ret = wasm.pixel_g(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    b() {
        var ret = wasm.pixel_b(this.ptr);
        return ret;
    }
}

export function __wbindgen_json_parse(arg0, arg1) {
    var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_json_serialize(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_error_new(arg0, arg1) {
    var ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_object_drop_ref(arg0) {
    takeObject(arg0);
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_object_clone_ref(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

export function __wbindgen_string_new(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export function __wbg_fetch_fb26f738d9707b16(arg0) {
    var ret = fetch(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbindgen_cb_drop(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

export function __wbg_fetch_fe54824ee845f6b4(arg0, arg1) {
    var ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_instanceof_Response_ea36d565358a42f7(arg0) {
    var ret = getObject(arg0) instanceof Response;
    return ret;
};

export function __wbg_url_6e564c9e212456f8(arg0, arg1) {
    var ret = getObject(arg1).url;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbg_status_3a55bb50e744b834(arg0) {
    var ret = getObject(arg0).status;
    return ret;
};

export function __wbg_headers_e4204c6775f7b3b4(arg0) {
    var ret = getObject(arg0).headers;
    return addHeapObject(ret);
};

export function __wbg_text_aeba5a5bbfef7f15() { return handleError(function (arg0) {
    var ret = getObject(arg0).text();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_newwithstrandinit_c07f0662ece15bc6() { return handleError(function (arg0, arg1, arg2) {
    var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_226d109446575877() { return handleError(function () {
    var ret = new Headers();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_append_4d85f35672cbffa7() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    getObject(arg0).append(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
}, arguments) };

export function __wbindgen_is_function(arg0) {
    var ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export function __wbg_newnoargs_f579424187aa1717(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export function __wbindgen_is_object(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbg_next_c7a2a6b012059a5e(arg0) {
    var ret = getObject(arg0).next;
    return addHeapObject(ret);
};

export function __wbg_next_dd1a890d37e38d73() { return handleError(function (arg0) {
    var ret = getObject(arg0).next();
    return addHeapObject(ret);
}, arguments) };

export function __wbg_done_982b1c7ac0cbc69d(arg0) {
    var ret = getObject(arg0).done;
    return ret;
};

export function __wbg_value_2def2d1fb38b02cd(arg0) {
    var ret = getObject(arg0).value;
    return addHeapObject(ret);
};

export function __wbg_iterator_4b9cedbeda0c0e30() {
    var ret = Symbol.iterator;
    return addHeapObject(ret);
};

export function __wbg_get_8bbb82393651dd9c() { return handleError(function (arg0, arg1) {
    var ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_call_89558c3e96703ca1() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_d3138911a89329b0() {
    var ret = new Object();
    return addHeapObject(ret);
};

export function __wbg_call_94697a95cb7e239c() { return handleError(function (arg0, arg1, arg2) {
    var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

export function __wbg_new_4beacc9c71572250(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_87(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        var ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_resolve_4f8f547f26b30b27(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_then_a6860c82b90816ca(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export function __wbg_then_58a04e42527f52c6(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export function __wbg_self_e23d74ae45fb17d1() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_window_b4be7f48b24ac56e() { return handleError(function () {
    var ret = window.window;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_globalThis_d61b1f48a57191ae() { return handleError(function () {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

export function __wbg_global_e7669da72fd7f239() { return handleError(function () {
    var ret = global.global;
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_is_undefined(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export function __wbg_buffer_5e74a88a1424a2e0(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export function __wbg_newwithbyteoffsetandlength_278ec7532799393a(arg0, arg1, arg2) {
    var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export function __wbg_new_e3b800e570795b3c(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export function __wbg_has_3850edde6df9191b() { return handleError(function (arg0, arg1) {
    var ret = Reflect.has(getObject(arg0), getObject(arg1));
    return ret;
}, arguments) };

export function __wbg_set_c42875065132a932() { return handleError(function (arg0, arg1, arg2) {
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };

export function __wbg_stringify_f8bfc9e2d1e8b6a0() { return handleError(function (arg0) {
    var ret = JSON.stringify(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };

export function __wbindgen_debug_string(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_memory() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

export function __wbindgen_closure_wrapper466(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 136, __wbg_adapter_30);
    return addHeapObject(ret);
};

