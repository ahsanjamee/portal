import { tags } from 'typia';

//----
// DEFINE CUSTOM TYPE TAGS
//----

// todo! validate does not use outside functions other than js internals & also errors are not ...
export type MongoId = string &
	tags.TagBase<{
		kind: 'mongoID';
		target: 'string';
		value: 'undefinedaaa';
		validate: `/^[0-9a-fA-F]{24}$/.test($input`;
	}>;
