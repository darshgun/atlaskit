import { FlagShape, Flags, CustomAttributes } from './types';
export declare const isType: (value: any, type: string) => boolean;
export declare const isObject: (value: any) => boolean;
export declare const isBoolean: (value: any) => boolean;
export declare const isString: (value: any) => boolean;
export declare const isFlagWithEvaluationDetails: (flag: FlagShape) => boolean;
export declare const isSimpleFlag: (flag: FlagShape) => boolean;
export declare const isOneOf: (value: string, list: string[]) => boolean;
export declare const enforceAttributes: (
  obj: any,
  attributes: string[],
  identifier?: string | undefined,
) => void;
export declare const checkForReservedAttributes: (
  customAttributes: CustomAttributes,
) => void;
export declare const validateFlags: (flags: Flags) => void;
