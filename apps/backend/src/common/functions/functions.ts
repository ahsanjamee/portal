import * as _ from 'lodash';

export const objectDiff = (a: Record<string, any>, b: Record<string, any>) =>
	_.fromPairs(_.differenceWith(_.toPairs(a), _.toPairs(b), _.isEqual));
