type A = { [P in keyof T]: T[P] };
type B = { [P in keyof T]?: T[P] };
type C = { readonly [P in keyof T]: T[P] };
type D = { readonly [P in keyof T]?: T[P] };
type E = { [P in keyof T] };
type F = { readonly [P in keyof T] };
