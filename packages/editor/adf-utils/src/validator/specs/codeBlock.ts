export default {
  props: {
    type: { type: 'enum', values: ['codeBlock'] },
    content: {
      type: 'array',
      items: [
        [
          'text',
          {
            props: {
              marks: { type: 'array', items: [], maxItems: 0, optional: true },
            },
          },
        ],
      ],
      optional: true,
    },
    marks: { type: 'array', items: [], optional: true },
    attrs: {
      props: {
        language: {
          type: 'enum',
          values: [
            'abap',
            'actionscript',
            'ada',
            'arduino',
            'autoit',
            'c',
            'c++',
            'clojure',
            'coffeescript',
            'csharp',
            'css',
            'cuda',
            'd',
            'dart',
            'delphi',
            'elixir',
            'erlang',
            'fortran',
            'foxpro',
            'go',
            'groovy',
            'haskell',
            'haxe',
            'html',
            'java',
            'javascript',
            'json',
            'julia',
            'kotlin',
            'latex',
            'livescript',
            'lua',
            'mathematica',
            'matlab',
            'objective-c',
            'objective-j',
            'objectpascal',
            'ocaml',
            'octave',
            'perl',
            'php',
            'powershell',
            'prolog',
            'puppet',
            'python',
            'qml',
            'r',
            'racket',
            'restructuredtext',
            'ruby',
            'rust',
            'sass',
            'scala',
            'scheme',
            'shell',
            'smalltalk',
            'sql',
            'standardml',
            'swift',
            'tcl',
            'tex',
            'typescript',
            'vala',
            'vbnet',
            'verilog',
            'vhdl',
            'xml',
            'xquery',
          ],
          optional: true,
        },
      },
      optional: true,
    },
  },
};
