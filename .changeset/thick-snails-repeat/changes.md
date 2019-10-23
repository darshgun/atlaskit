**Breaking Change**:

> packages/elements/util-service-support/src/serviceUtils.ts:
>
> _Usage change:_ `headers.map(key)` => `headers[key]`.

_Before:_
```
const addToHeaders = (headers: Headers, keyValues?: KeyValues) => { ... }
...
const buildHeaders = (
   secOptions?: SecurityOptions,
   extraHeaders?: KeyValues,
  ): Headers => {
  const headers = new Headers();
  addToHeaders(headers, extraHeaders);
  ...
}
```

_After:_
```
const addToHeaders = (headers: KeyValues, keyValues?: KeyValues) => { ... }
...
const buildHeaders = (
  secOptions?: SecurityOptions,
  extraHeaders?: KeyValues,
  ): KeyValues => {
    const headers = {};
    addToHeaders(headers, extraHeaders);
    ...
}
```