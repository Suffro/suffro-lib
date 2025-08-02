import { Timestamp, GeoPoint } from 'firebase/firestore';
export const _firestoreValidate = {
    timestamp: (v) => v instanceof Timestamp,
    documentReference: (v) => v && typeof v.path === 'string' && typeof v.id === 'string',
    geoPoint: (v) => v instanceof GeoPoint,
    fieldValue: (v) => typeof v === 'object' && v !== null && typeof v._methodName === 'string',
};
//# sourceMappingURL=_firestoreTypesValidation.js.map