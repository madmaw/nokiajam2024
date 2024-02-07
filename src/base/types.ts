export type RequiredKeys<T> = Readonly<{
  [K in keyof T]-?: (
    {} extends { [P in K]: T[K] } ? false : true
  )
}>;

export type DefinedKeys<T> = Readonly<{
  [K in keyof T]: undefined extends T[K] ? false : true
}>;

type Derpfined = {
  a: string,
  b: string | undefined,
  c?: number,
  d: undefined,
  //e: never,
  f: null,
};

const d: Derpfined = {
  a: 'a',
  b: 'b',
  c: 1,
  d: undefined,
  f: null,
};

type RequiredDerpfined = RequiredKeys<Derpfined>;
type DefinedDerpfined = DefinedKeys<Derpfined>;

const required: RequiredDerpfined = {
  a: true,
  b: true,
  c: false,
  d: true,
  //e: true,
  f: true,
};

const defined: DefinedDerpfined = {
  a: true,
  b: false,
  c: false,
  d: false,
  //e: true,
  f: true,
};

for (const key in required) {
  console.log(key, d[key as keyof Derpfined]);
}
