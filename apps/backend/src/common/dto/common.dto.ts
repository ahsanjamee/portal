import { tags } from 'typia';

export type StringType = string;
export type NumberType = number;
export type BooleanType = boolean;
export type EmailType = string & tags.Format<'email'>;
export type DateType = string & tags.Format<'date-time'>;
export type PasswordType = string & tags.MinLength<8>;
export type ObjectIdType = string & tags.Pattern<'^[a-fA-F\\d]{24}$'>;

export type appAgentHeader = {
    'app-agent': string | 'any';
};
