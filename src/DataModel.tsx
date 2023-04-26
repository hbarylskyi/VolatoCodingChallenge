export type Field = {
  label: string;
  type: string;
  readOnly: boolean;
  calculate?: string;
};

export type DataModelType = {
  name: string;
  index: number;
  inputs: {
    [name: string]: Field;
  };
};
