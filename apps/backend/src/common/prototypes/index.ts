import { ObjectId } from 'bson';

String.prototype.toObjectID = function () {
	return new ObjectId(this as any);
};

String.prototype.toDate = function () {
	return new Date(this as any);
};
