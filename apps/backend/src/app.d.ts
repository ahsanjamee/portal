import { ObjectId } from 'bson';

declare global {
	interface String {
		toObjectID(): ObjectId;
		toDate(): Date;
	}
}
