export interface Editable<T = any> {
  value: T;
  onChange: (value: T) => void;
}

export interface StringInput extends Editable<string> {}

export interface NumberInput extends Editable<number> {}

export interface BooleanInput extends Editable<boolean> {}

export interface ArrayInput<T = any> extends Editable<T[]> {}

export interface ObjectInput<T = object> extends Editable<T> {}

export interface DateInput extends Editable<Date> {}

export interface RangeInput extends Editable<number> {}

export interface FileInput extends Editable<File> {}

export interface FilesInput extends Editable<File[]> {}

export interface ColorInput extends Editable<string> {}

export interface EnumInput<T = string | number> extends Editable<T> {
  options: T[];
}

export interface MultiSelectInput<T = string[] | number[]>
  extends Editable<T[]> {
  options: T[];
}

export type Input =
  | StringInput
  | NumberInput
  | BooleanInput
  | ArrayInput
  | ObjectInput
  | DateInput
  | RangeInput
  | FileInput
  | FilesInput
  | ColorInput
  | EnumInput
  | MultiSelectInput;

export interface Form<T = object> extends Editable<T> {
  inputs?: (Input & {
    children?: Input[];
  })[];
}
