import { Timestamp } from 'firebase-admin/firestore';
import {
  Timestamp as LocalTimestamp,
  DocumentReference,
  GeoPoint,
  FieldValue
} from 'firebase/firestore';

export interface FirestoreValidate {
  timestamp(v: any): v is (Timestamp | LocalTimestamp);
  clientTimestamp(v: any): v is (LocalTimestamp);
  adminTimestamp(v: any): v is (Timestamp);
  documentReference(v: any): v is DocumentReference;
  geoPoint(v: any): v is GeoPoint;
  fieldValue(v: any): v is FieldValue;
}

export const _firestoreValidate: FirestoreValidate = {
  timestamp: (v): v is (Timestamp | LocalTimestamp) => (v instanceof Timestamp || v instanceof LocalTimestamp),
  clientTimestamp: (v): v is LocalTimestamp => (v instanceof LocalTimestamp),
  adminTimestamp: (v): v is Timestamp => (v instanceof Timestamp),
  documentReference: (v): v is DocumentReference =>
    v && typeof v.path === 'string' && typeof v.id === 'string',
  geoPoint: (v): v is GeoPoint => v instanceof GeoPoint,
  fieldValue: (v): v is FieldValue =>
    typeof v === 'object' && v !== null && typeof (v as any)._methodName === 'string',
};
