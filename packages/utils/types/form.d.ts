export interface InputSchemaConfigBase<T = any> {
  initialValue?: T;
  type: string;
  label?: string;
  name: string;
}

export interface StringInputSchemaConfig extends InputSchemaConfigBase<string> {
  type: "string";
}

export interface NumberInputSchemaConfig extends InputSchemaConfigBase<number> {
  type: "number";
}

export interface BooleanInputSchemaConfig
  extends InputSchemaConfigBase<boolean> {
  type: "boolean";
}

export interface ArrayInputSchemaConfig<T = any>
  extends InputSchemaConfigBase<T[]> {
  type: "array";
  children?: InputSchemaConfig[];
}

export interface ObjectInputSchemaConfig<T = object>
  extends InputSchemaConfigBase<T> {
  type: "object";
  children?: InputSchemaConfig[];
}

export interface DateInputSchemaConfig extends InputSchemaConfigBase<Date> {
  type: "date";
}

export interface RangeInputSchemaConfig extends InputSchemaConfigBase<number> {
  type: "range";
}

export interface FileInputSchemaConfig extends InputSchemaConfigBase<File> {
  type: "file";
}

export interface ColorInputSchemaConfig extends InputSchemaConfigBase<string> {
  type: "color";
}

export interface EnumInputSchemaConfig<T = string | number>
  extends InputSchemaConfigBase<T> {
  options: {
    label: string;
    value: T;
  }[];
  type: "enum";
}

export interface SelectInputSchemaConfig<T = string | number>
  extends InputSchemaConfigBase<T[]> {
  options: {
    label: string;
    value: T;
  }[];
  type: "select";
  multiSelect?: boolean;
}

export type ContainerInputSchemaConfig =
  | ArrayInputSchemaConfig
  | ObjectInputSchemaConfig;

export type InputSchemaConfig =
  | StringInputSchemaConfig
  | NumberInputSchemaConfig
  | BooleanInputSchemaConfig
  | DateInputSchemaConfig
  | RangeInputSchemaConfig
  | FileInputSchemaConfig
  | ColorInputSchemaConfig
  | EnumInputSchemaConfig
  | SelectInputSchemaConfig
  | ContainerInputSchemaConfig;

export interface FormSchemaConfig<T = object> {
  inputs?: InputSchemaConfig[];
}
