export const Type = Function;

export function isType(v: any): v is Type<any> {
  return typeof v === 'function';
}

export interface Type<T> extends Function {
  new (...args: any[]): T;
}

export type Mutable<T extends { [x: string]: any }, K extends string> = {
  [P in K]: T[P];
};

