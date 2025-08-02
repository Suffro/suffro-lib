"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._firestoreValidate = void 0;
const firestore_1 = require("firebase/firestore");
exports._firestoreValidate = {
    timestamp: (v) => v instanceof firestore_1.Timestamp,
    documentReference: (v) => v && typeof v.path === 'string' && typeof v.id === 'string',
    geoPoint: (v) => v instanceof firestore_1.GeoPoint,
    fieldValue: (v) => typeof v === 'object' && v !== null && typeof v._methodName === 'string',
};
