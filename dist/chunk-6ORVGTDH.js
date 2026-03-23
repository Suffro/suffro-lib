import {
  logger
} from "./chunk-54MRKUDF.js";

// node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
var cursorRequestMap = /* @__PURE__ */ new WeakMap();
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);

// node_modules/idb/build/index.js
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));

// src/idb/_idb.ts
async function idb(dbName, version, storeDefs) {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    console.error("[IDB] IndexedDB is not available in this context.");
    return null;
  }
  const DB_INSTANCE = await openDB(dbName, version, {
    upgrade(db) {
      if (!storeDefs) return;
      for (const [storeName, schema] of Object.entries(storeDefs)) {
        if (!db.objectStoreNames.contains(storeName)) {
          const store = db.createObjectStore(storeName, {
            keyPath: schema.keyPath ?? "id"
          });
          if (schema.indices) {
            for (const index of schema.indices) {
              store.createIndex(index.name, index.keyPath, index.options);
            }
          }
        }
      }
    }
  });
  async function _get() {
    return DB_INSTANCE;
  }
  async function _state(storeName) {
    try {
      const db = await _get();
      if (!db.objectStoreNames.contains(storeName)) {
        return "not-found";
      }
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const count = await store.count();
      return count === 0 ? "empty" : "populated";
    } catch (err) {
      logger.error("Error on DB check:", err);
      return "not-found";
    }
  }
  async function _exists(storeName) {
    const res = await _state(storeName);
    return !(res === "not-found");
  }
  async function _isPopulated(storeName) {
    const res = await _state(storeName);
    return res === "populated";
  }
  async function _clearStore(storeName) {
    const db = await _get();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    await store.clear();
    await tx.done;
    _notifyChange({ type: "clearStore", store: storeName });
  }
  function _deleteDb() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => console.warn("Delete blocked: close all tabs.");
    });
  }
  async function _getAllKeys(storeName) {
    const db = await _get();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    return await store.getAllKeys();
  }
  async function _findByField(storeName, field, value) {
    const db = await _get();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    if (!store.indexNames.contains(field)) {
      throw new Error(`Index "${String(field)}" does not exist`);
    }
    const index = store.index(field);
    return await index.getAll(value);
  }
  async function _delete(storeName, keys) {
    const db = await _get();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    for (const key of keys) {
      await store.delete(key);
    }
    await tx.done;
    _notifyChange({ type: "delete", store: storeName, keys });
  }
  async function _put(storeName, doc) {
    const db = await _get();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    await store.put(doc);
    await tx.done;
    _notifyChange({ type: "put", store: storeName, doc });
  }
  async function _bulkPut(storeName, docs) {
    const db = await _get();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    for (const doc of docs) {
      await store.put(doc);
    }
    await tx.done;
    _notifyChange({ type: "bulkPut", store: storeName, count: docs.length });
  }
  const channel = new BroadcastChannel("indexeddb-sync");
  function _onChange(callback) {
    channel.onmessage = (event) => {
      callback(event.data);
    };
  }
  function _notifyChange(payload) {
    channel.postMessage(payload);
  }
  async function _paginate(storeName, limit, offset) {
    const db = await _get();
    const tx = db.transaction(storeName);
    const store = tx.objectStore(storeName);
    const results = [];
    let skipped = 0;
    const cursor = await store.openCursor();
    while (cursor && results.length < limit) {
      if (skipped < offset) {
        skipped++;
        await cursor.continue();
        continue;
      }
      results.push(cursor.value);
      await cursor.continue();
    }
    return results;
  }
  const endpoints = {
    get: _get,
    state: _state,
    delete: _delete,
    exists: _exists,
    isPopulated: _isPopulated,
    put: _put,
    bulkPut: _bulkPut,
    findByField: _findByField,
    getAllKeys: _getAllKeys,
    notifyChange: _notifyChange,
    onChange: _onChange,
    deleteDb: _deleteDb,
    clearStore: _clearStore,
    paginate: _paginate
  };
  return endpoints;
}

export {
  idb
};
//# sourceMappingURL=chunk-6ORVGTDH.js.map