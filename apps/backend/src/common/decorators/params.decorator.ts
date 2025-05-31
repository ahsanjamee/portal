import { TypedParam } from '@nestia/core';

export const ResourceId = (name = 'id') => TypedParam(name);
