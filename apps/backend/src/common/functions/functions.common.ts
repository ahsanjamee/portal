import * as _ from 'lodash';

export const objectDiff = (a: Record<string, any>, b: Record<string, any>) =>
    _.fromPairs(_.differenceWith(_.toPairs(a), _.toPairs(b), _.isEqual));

type UnionKeys<T> = T extends T ? keyof T : never;
export const typedOmit = <T extends object, K extends UnionKeys<T>>(obj: T, keys: K[]): Omit<T, K> => {
    return _.omit(obj, keys);
};
