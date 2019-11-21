import { isSafeUrl } from '@atlaskit/adf-schema';
import { Token, TokenParser } from './';

// https://www.atlassian.com
export const LINK_TEXT_REGEXP = /^(https?:\/\/|irc:\/\/|mailto:)([\w.?\/\\#-=@]+)/;

export const linkText: TokenParser = ({ input, position, schema }) => {
  const match = input.substring(position).match(LINK_TEXT_REGEXP);

  if (!match) {
    return fallback(input, position);
  }

  // Remove mailto:
  const textRepresentation = match[1] === 'mailto:' ? match[2] : match[0];
  // parse and correctly encode any illegal characters, and
  // so no longer need to be encoded when used below
  const url = decode(unescape(match[0]));

  if (!isSafeUrl(url)) {
    return fallback(input, position);
  }

  const mark = schema.marks.link.create({
    href: url,
  });
  const textNode = schema.text(textRepresentation, [mark]);

  return {
    type: 'pmnode',
    nodes: [textNode],
    length: match[0].length,
  };
};

function unescape(url: string) {
  let result = '';
  for (let i = 0; i < url.length; i++) {
    const char = url[i];
    if (char !== '\\') {
      result += char;
      continue;
    }
    const nextChar = url[i + 1];
    if (nextChar) {
      result += nextChar;
      i++;
    }
  }
  return result;
}

function fallback(input: string, position: number): Token {
  return {
    type: 'text',
    text: input.substr(position, 1),
    length: 1,
  };
}

/**
 * returns a correctly percent-encoded & sanitized url.
 * Will fallback to using a DOM based implementation if the `URL` class
 * doesn't exist.
 *
 * @param raw a 'raw' url (possibly mixed percent-encoded).
 */
function decode(raw: string): string {
  if (URL) {
    const decoded = new URL(raw);
    // IE11 doesn't support the `href` property in the `URL` class.
    // Fallback to the DOM below if it doesn't exist.
    if (decoded.href) {
      return decoded.href;
    }
  }
  // no `URL` class - pollyfill using the dom to parse and
  // decode. This should only be needed for IE11 or lower...
  const anchor = document.createElement('a');
  anchor.href = raw; // The DOM will parses even mixed %-encoded segments of a url when set.
  return anchor.href;
}
