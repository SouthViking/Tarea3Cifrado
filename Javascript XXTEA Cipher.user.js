// ==UserScript==
// @name         Javascript XXTEA Cipher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Descifrador XXTEA - Tarea 3 Criptografía y Seguridad en Redes - Sebastián Toro Severino
// @author       You
// @match        https://b9twy.csb.app/
// @grant        none
// ==/UserScript==

! function(r) {
    "use strict";
    var c = !0;
    try {
        String.fromCharCode.apply(String, new Uint8Array([1, 2]))
    } catch (r) {
        c = !1, Object.defineProperty(Array.prototype, "subarray", {
            value: Array.prototype.slice
        })
    }
    var s = 2654435769;

    function n(r, e) {
        var n = r.length,
            t = n << 2;
        if (e) {
            var a = r[n - 1];
            if (a < (t -= 4) - 3 || t < a) return null;
            t = a
        }
        for (var o = new Uint8Array(t), i = 0; i < t; ++i) o[i] = r[i >> 2] >> ((3 & i) << 3);
        return o
    }

    function t(r, e) {
        var n, t = r.length,
            a = t >> 2;
        0 != (3 & t) && ++a, e ? (n = new Uint32Array(a + 1))[a] = t : n = new Uint32Array(a);
        for (var o = 0; o < t; ++o) n[o >> 2] |= r[o] << ((3 & o) << 3);
        return n
    }

    function h(r) {
        return 4294967295 & r
    }

    function l(r, e, n, t, a, o) {
        return (n >>> 5 ^ e << 2) + (e >>> 3 ^ n << 4) ^ (r ^ e) + (o[3 & t ^ a] ^ n)
    }

    function a(r) {
        if (r.length < 16) {
            var e = new Uint8Array(16);
            e.set(r), r = e
        }
        return r
    }

    function o(r) {
        for (var e = r.length, n = new Uint8Array(3 * e), t = 0, a = 0; a < e; a++) {
            var o = r.charCodeAt(a);
            if (o < 128) n[t++] = o;
            else if (o < 2048) n[t++] = 192 | o >> 6, n[t++] = 128 | 63 & o;
            else {
                if (!(o < 55296 || 57343 < o)) {
                    if (a + 1 < e) {
                        var i = r.charCodeAt(a + 1);
                        if (o < 56320 && 56320 <= i && i <= 57343) {
                            var c = 65536 + ((1023 & o) << 10 | 1023 & i);
                            n[t++] = 240 | c >> 18, n[t++] = 128 | c >> 12 & 63, n[t++] = 128 | c >> 6 & 63, n[t++] = 128 | 63 & c, a++;
                            continue
                        }
                    }
                    throw new Error("Malformed string")
                }
                n[t++] = 224 | o >> 12, n[t++] = 128 | o >> 6 & 63, n[t++] = 128 | 63 & o
            }
        }
        return n.subarray(0, t)
    }

    function i(r) {
        var e = r.length;
        return 0 === e ? "" : (e < 32767 ? function(r, e) {
            for (var n = new Array(e), t = 0, a = 0, o = r.length; t < e && a < o; t++) {
                var i = r[a++];
                switch (i >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        n[t] = i;
                        break;
                    case 12:
                    case 13:
                        if (!(a < o)) throw new Error("Unfinished UTF-8 octet sequence");
                        n[t] = (31 & i) << 6 | 63 & r[a++];
                        break;
                    case 14:
                        if (!(a + 1 < o)) throw new Error("Unfinished UTF-8 octet sequence");
                        n[t] = (15 & i) << 12 | (63 & r[a++]) << 6 | 63 & r[a++];
                        break;
                    case 15:
                        if (!(a + 2 < o)) throw new Error("Unfinished UTF-8 octet sequence");
                        var c = ((7 & i) << 18 | (63 & r[a++]) << 12 | (63 & r[a++]) << 6 | 63 & r[a++]) - 65536;
                        if (!(0 <= c && c <= 1048575)) throw new Error("Character outside valid Unicode range: 0x" + c.toString(16));
                        n[t++] = c >> 10 & 1023 | 55296, n[t] = 1023 & c | 56320;
                        break;
                    default:
                        throw new Error("Bad UTF-8 encoding 0x" + i.toString(16))
                }
            }
            return t < e && (n.length = t), String.fromCharCode.apply(String, n)
        } : function(r, e) {
            for (var n = [], t = new Array(32768), a = 0, o = 0, i = r.length; a < e && o < i; a++) {
                var c = r[o++];
                switch (c >> 4) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        t[a] = c;
                        break;
                    case 12:
                    case 13:
                        if (!(o < i)) throw new Error("Unfinished UTF-8 octet sequence");
                        t[a] = (31 & c) << 6 | 63 & r[o++];
                        break;
                    case 14:
                        if (!(o + 1 < i)) throw new Error("Unfinished UTF-8 octet sequence");
                        t[a] = (15 & c) << 12 | (63 & r[o++]) << 6 | 63 & r[o++];
                        break;
                    case 15:
                        if (!(o + 2 < i)) throw new Error("Unfinished UTF-8 octet sequence");
                        var f = ((7 & c) << 18 | (63 & r[o++]) << 12 | (63 & r[o++]) << 6 | 63 & r[o++]) - 65536;
                        if (!(0 <= f && f <= 1048575)) throw new Error("Character outside valid Unicode range: 0x" + f.toString(16));
                        t[a++] = f >> 10 & 1023 | 55296, t[a] = 1023 & f | 56320;
                        break;
                    default:
                        throw new Error("Bad UTF-8 encoding 0x" + c.toString(16))
                }
                if (32766 <= a) {
                    var u = a + 1;
                    t.length = u, n.push(String.fromCharCode.apply(String, t)), e -= u, a = -1
                }
            }
            return 0 < a && (t.length = a, n.push(String.fromCharCode.apply(String, t))), n.join("")
        })(r, e)
    }

    function f(r) {
        var e = r.length;
        if (0 === e) return "";
        var n = c ? r : function(r) {
            for (var e = r.length, n = new Array(r.length), t = 0; t < e; ++t) n[t] = r[t];
            return n
        }(r);
        if (e < 65535) return String.fromCharCode.apply(String, n);
        for (var t = 32767 & e, a = e >> 15, o = new Array(t ? 1 + a : a), i = 0; i < a; ++i) o[i] = String.fromCharCode.apply(String, n.subarray(i << 15, i + 1 << 15));
        return t && (o[a] = String.fromCharCode.apply(String, n.subarray(a << 15, e))), o.join("")
    }

    function u(r, e) {
        return "string" == typeof r && (r = o(r)), "string" == typeof e && (e = o(e)), null == r || 0 === r.length ? r : n(function(r, e) {
            var n, t, a, o, i, c, f = r.length,
                u = f - 1;
            for (t = r[u], c = (a = 0) | Math.floor(6 + 52 / f); 0 < c; --c) {
                for (o = (a = h(a + s)) >>> 2 & 3, i = 0; i < u; ++i) n = r[i + 1], t = r[i] = h(r[i] + l(a, n, t, i, o, e));
                n = r[0], t = r[u] = h(r[u] + l(a, n, t, u, o, e))
            }
            return r
        }(t(r, !0), t(a(e), !1)), !1)
    }

    function g(r, e) {
        return "string" == typeof r && (r = function(r) {
            for (var e = window.atob(r), n = e.length, t = new Uint8Array(n), a = 0; a < n; a++) t[a] = e.charCodeAt(a);
            return t
        }(r)), "string" == typeof e && (e = o(e)), null == r || 0 === r.length ? r : n(function(r, e) {
            var n, t, a, o, i, c = r.length,
                f = c - 1;
            for (n = r[0], a = h(Math.floor(6 + 52 / c) * s); 0 !== a; a = h(a - s)) {
                for (o = a >>> 2 & 3, i = f; 0 < i; --i) t = r[i - 1], n = r[i] = h(r[i] - l(a, n, t, i, o, e));
                t = r[f], n = r[0] = h(r[0] - l(a, n, t, 0, o, e))
            }
            return r
        }(t(r, !1), t(a(e), !1)), !0)
    }
    r.xxtea = Object.create(null, {
        toBytes: {
            value: o
        },
        toString: {
            value: i
        },
        encrypt: {
            value: u
        },
        encryptToString: {
            value: function(r, e) {
                return window.btoa(f(u(r, e)))
            }
        },
        decrypt: {
            value: g
        },
        decryptToString: {
            value: function(r, e) {
                return i(g(r, e))
            }
        }
    })

    // Se obtiene el elemento <div> según la clase 'XXTEA' (algoritmo seleccionado)
    const elementoDiv = document.getElementsByClassName('XXTEA')[0];
    const msgCifrado = elementoDiv.id;

    var encrypt_data = xxtea.encrypt(xxtea.toBytes('Hola me llamo Sebastián'), xxtea.toBytes('abc__;óñpuhd12'));
    console.log((btoa(String.fromCharCode.apply(String, encrypt_data))));

    //////////////////////////////////////////////////////////////////////////

    var key = prompt('Ingrese la key configurada en el archivo Python:');

    console.log('Mensaje cifrado en Python: '+msgCifrado);
    //console.log((btoa(String.fromCharCode.apply(String, msgCifrado))));
    //var decrypt_data = xxtea.toString(xxtea.decrypt(msgCifrado, xxtea.toBytes(key)));
    console.log(msgCifrado);
    console.log('Mensaje descifrado en JS: '+xxtea.decrypt(msgCifrado, xxtea.toBytes(key)));
    //console.log(decrypt_data);
    //console.log(str === decrypt_data);

}(this || [eval][0]("this"));
