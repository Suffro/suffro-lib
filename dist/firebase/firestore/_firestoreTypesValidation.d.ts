import { Timestamp, DocumentReference, GeoPoint, FieldValue } from 'firebase/firestore';
export interface FirestoreValidate {
    timestamp(v: any): v is Timestamp;
    documentReference(v: any): v is DocumentReference;
    geoPoint(v: any): v is GeoPoint;
    fieldValue(v: any): v is FieldValue;
}
export declare const _firestoreValidate: FirestoreValidate;
//# sourceMappingURL=_firestoreTypesValidation.d.ts.map