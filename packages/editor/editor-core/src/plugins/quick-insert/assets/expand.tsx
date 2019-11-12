import * as React from 'react';
import { IconProps } from '../types';

export default function IconExpand({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><g transform="translate(7 8)"><path d="M1 0h31v24H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1z" fill="#EBECF0"/><path d="M3 7h31v15H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" fill="#FFF"/><path d="M5.5 18h14a.5.5 0 1 1 0 1h-14a.5.5 0 1 1 0-1zm0-3h23a.5.5 0 1 1 0 1h-23a.5.5 0 1 1 0-1zm0-3h23a.5.5 0 1 1 0 1h-23a.5.5 0 1 1 0-1zm0-3h23a.5.5 0 1 1 0 1h-23a.5.5 0 0 1 0-1z" fill="#A5ADBA"/><rect fill="#2684FF" x="7" y="3" width="18" height="1" rx=".5"/><path d="M2.646 2.354a.5.5 0 1 1 .708-.708l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 1 1-.708-.708L3.793 3.5 2.646 2.354z" fill="#2684FF" fill-rule="nonzero"/></g></g></svg>`,
      }}
    />
  );
}
