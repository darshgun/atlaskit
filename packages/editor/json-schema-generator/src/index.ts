/* eslint-disable no-bitwise */
import * as ts from 'typescript';
import { readFileSync, writeFileSync } from 'fs';
import JSON5 from 'json5';
import { resolve, join } from 'path';
import * as prettier from 'prettier';
import mkdirp from 'mkdirp';

import JSONSchemaNode, {
  SchemaNode,
  StringSchemaNode,
  ArraySchemaNode,
  ObjectSchemaNode,
  EnumSchemaNode,
  PrimitiveSchemaNode,
  RefSchemaNode,
  EmptySchemaNode,
  AnyOfSchemaNode,
  AllOfSchemaNode,
} from './json-schema-nodes';

import {
  extractLiteralValue,
  getTags,
  getTypeFromSymbol,
  isAnyType,
  isArrayType,
  isBooleanType,
  isInterfaceDeclaration,
  isIntersectionType,
  isLiteralType,
  isNonPrimitiveType,
  isNumberType,
  isObjectType,
  isSourceFile,
  isStringLiteralType,
  isStringType,
  isTypeAliasDeclaration,
  isUnionType,
  getPmName,
  LiteralType,
} from './utils';

export default (
  files: string[],
  flags: any,
  root = 'doc_node',
  description = 'Schema for Atlassian Document Format.',
) => {
  const entryPointsTsConfig = JSON5.parse(
    readFileSync(
      join(__dirname, '../../../../tsconfig.entry-points.json'),
      'utf8',
    ),
  );
  const program = ts.createProgram(files, {
    jsx: ts.JsxEmit.React,
    // We need our paths configuration here to compile atlaskit dependencies now that we no longer
    // have root index.ts files
    baseUrl: join(__dirname, '..'),
    paths: entryPointsTsConfig.compilerOptions.paths,
  });
  const checker = program.getTypeChecker();
  const typeIdToDefName: Map<number, string> = new Map();
  const experimentalNodes: Set<number> = new Set();
  const isSpecMode =
    flags.mode.toLowerCase() === 'spec' ? () => true : () => false;

  const SKIP_LIST = isSpecMode() ? ['applicationCard_node'] : [];

  const jsonSchema = new JSONSchemaNode('draft-04', description, root);

  let ticks = 0;
  program.getSourceFiles().forEach(walk);

  waitForTicks()
    .then(() => mkdirp(flags.outDir, () => {}))
    .then(() => {
      const { outDir, stage } = flags;
      const resolvedOutDir = resolve(outDir);
      if (!isSpecMode()) {
        jsonSchema.markAsUsed(root);
        const outputFileName =
          stage != null ? `stage-${stage}.json` : 'full.json';
        writeFileSync(
          join(resolvedOutDir, outputFileName),
          JSON.stringify(jsonSchema, null, 2) + '\n',
        );
      } else {
        prettier.resolveConfig(process.cwd()).then(resolvedConfig => {
          const options = {
            parser: 'babylon',
            ...resolvedConfig,
          } as prettier.Options;

          const exports = [
            '// DO NOT MODIFY THIS FILE, USE `yarn generate:spec`',
          ];

          jsonSchema.definitions.forEach((def, name) => {
            const fileName = getPmName(name);
            exports.push(
              `export { default as ${fileName} } from './${fileName}';`,
            );
            writeFileSync(
              join(resolvedOutDir, `${fileName}.ts`),
              prettier.format(
                `export default ${JSON.stringify(def.node.toSpec())}`,
                options!,
              ),
            );
          });
          // Generate index.ts with exports
          writeFileSync(
            join(resolvedOutDir, 'index.ts'),
            prettier.format(exports.join('\n'), options!),
          );
        });
      }
    })
    // eslint-disable-next-line no-console
    .catch(console.error);

  function waitForTicks() {
    return new Promise(resolve => {
      const waitForTick = () => {
        process.nextTick(() => {
          ticks--;
          ticks > 0 ? waitForTick() : resolve();
        });
      };
      waitForTick();
    });
  }

  function walk(node: ts.Node) {
    if (isSourceFile(node)) {
      node.forEachChild(walk);
    } else if (isInterfaceDeclaration(node) || isTypeAliasDeclaration(node)) {
      const symbol: ts.Symbol = (node as any).symbol;
      const { name, ...rest } = getTags(symbol.getJsDocTags());
      if (name) {
        if (jsonSchema.hasDefinition(name)) {
          throw new Error(`Duplicate definition for ${name}`);
        }
        const type = checker.getTypeAtLocation(node);

        if (SKIP_LIST.includes(name)) {
          jsonSchema.addDefinition(name, new ObjectSchemaNode());
          typeIdToDefName.set((type as any).id, name);
          jsonSchema.markAsUsed(name);
        } else {
          const defNode = getSchemaNodeFromType(type, rest);
          if (defNode) {
            jsonSchema.addDefinition(name, defNode);
            typeIdToDefName.set((type as any).id, name);
          }
        }
      }
    } else {
      // If in future we need support for other nodes, this will help to debug
      // console.log(syntaxKindToName(node.kind));
      // node.forEachChild(walk);
    }
  }

  function shouldExclude(stage?: string) {
    return (
      (flags.stage === undefined && stage !== undefined) ||
      (flags.stage !== undefined &&
        stage !== undefined &&
        stage.toString() !== flags.stage)
    );
  }

  function filterValidators(validators: any) {
    const ANY_STAGE_VALIDATOR_REGEXP = RegExp(`^(.*)_stage_(:?.*)$`);
    const CURRENT_STAGE_VALIDATOR_REGEXP = RegExp(
      `^(.*)_stage_${flags.stage}$`,
    );
    const currentStageValidators = Object.entries(validators).reduce(
      (result: any, [key, value]) => {
        const match = key.match(CURRENT_STAGE_VALIDATOR_REGEXP);
        if (match) {
          result[match[1]] = value;
        }
        return result;
      },
      {},
    );
    const filteredValidators = Object.entries(validators).reduce(
      (result: any, [key, value]) => {
        const match = key.match(ANY_STAGE_VALIDATOR_REGEXP);
        if (!match) {
          result[key] = value;
        }
        return result;
      },
      {},
    );
    return { ...filteredValidators, ...currentStageValidators };
  }

  function getSchemaNodeFromType(
    type: ts.Type,
    validators: any = {},
  ): SchemaNode | undefined {
    const typeId = (type as any).id;
    if (shouldExclude(validators['stage'])) {
      experimentalNodes.add(typeId);
      return;
    } else if (experimentalNodes.has(typeId)) {
      return;
    }

    const filteredValidators = filterValidators(validators);
    const nodeName = typeIdToDefName.get(typeId)!;
    if (typeIdToDefName.has(typeId)) {
      // Found a $ref
      jsonSchema.markAsUsed(nodeName);
      return new RefSchemaNode(nodeName);
    } else if (isStringType(type)) {
      return new StringSchemaNode(filteredValidators);
    } else if (isBooleanType(type)) {
      return new PrimitiveSchemaNode('boolean');
    } else if (isNumberType(type)) {
      return new PrimitiveSchemaNode('number', filteredValidators);
    } else if (isUnionType(type)) {
      const isEnum = type.types.every(t => isStringLiteralType(t));
      if (isEnum) {
        return new EnumSchemaNode(
          type.types.map(t => (t as LiteralType).value),
        );
      } else {
        return new AnyOfSchemaNode(
          type.types.map(t => getSchemaNodeFromType(t)!).filter(Boolean),
        );
      }
    } else if (isIntersectionType(type)) {
      return new AllOfSchemaNode(
        type.types
          .map(
            t =>
              getSchemaNodeFromType(t, getTags(t.getSymbol()!.getJsDocTags()))!,
          )
          .filter(Boolean),
      );
    } else if (isArrayType(type)) {
      const node = new ArraySchemaNode([], filteredValidators);
      // [X, X | Y]
      if (!type.typeArguments) {
        const types = type.getNumberIndexType()!;

        // Look for all indexed type
        let i = 0;
        let prop: ts.Symbol;
        while ((prop = type.getProperty(`${i}`)!)) {
          node.push(getSchemaNodeFromType(getTypeFromSymbol(checker, prop)));
          i++;
        }

        /**
         * This will always be a Union type because it's not possible to write something like
         * interface X extends Array<X> {
         *  0: X;
         * }
         */
        if (isUnionType(types)) {
          node.push(getSchemaNodeFromType(types));
        }
      } else {
        const types = type.typeArguments;
        node.push(
          types.length === 1 && isAnyType(types[0]) // Array<any>
            ? []
            : types.map(t => getSchemaNodeFromType(t)!).filter(Boolean),
        );
      }
      return node;
    } else if (isObjectType(type)) {
      const obj = new ObjectSchemaNode(
        {},
        { additionalProperties: false, ...filteredValidators },
      );
      // Use node's queue to prevent circular dependency
      process.nextTick(() => {
        ticks++;
        const props = checker.getPropertiesOfType(type);
        props.forEach(prop => {
          const name = prop.getName();
          // Drop private properties __fileName, __fileType, etc
          if ((name[0] !== '_' || name[1] !== '_') && prop.valueDeclaration) {
            const propType = getTypeFromSymbol(checker, prop);
            const isRequired =
              (prop.getFlags() & ts.SymbolFlags.Optional) === 0;
            const validators: any = getTags(prop.getJsDocTags());
            if (!shouldExclude(validators['stage'])) {
              // Remove it from validators otherwise it will end up as a property in ADF
              delete validators['stage'];
              const node = getSchemaNodeFromType(propType, validators);
              if (node) {
                obj.addProperty(name, node, isRequired);
              }
            }
          }
        });
      });
      return obj;
    } else if (isLiteralType(type)) {
      // Using ConstSchemaNode doesn't pass validation
      return new EnumSchemaNode(extractLiteralValue(type));
    } else if (isNonPrimitiveType(type)) {
      // object
      return new EmptySchemaNode();
    }

    throw new Error(`TODO: ${checker.typeToString(type)} to be defined`);
  }
};
