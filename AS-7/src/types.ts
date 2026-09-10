export type Visibility = '+' | '-' | '#' | '~';
export type ClassType = 'class' | 'interface' | 'abstract' | 'enum';

export interface MethodParam {
  name: string;
  type: string;
}

export interface ClassMethod {
  id: string;
  visibility: Visibility;
  name: string;
  returnType: string;
  parameters: MethodParam[];
  isStatic?: boolean;
  isAbstract?: boolean;
}

export interface ClassAttribute {
  id: string;
  visibility: Visibility;
  name: string;
  type: string;
}

export interface UMLClassData extends Record<string, unknown> {
  name: string;
  type: ClassType;
  attributes: ClassAttribute[];
  methods: ClassMethod[];
}

export type RelationType = 'inheritance' | 'implementation' | 'association' | 'aggregation' | 'composition' | 'dependency';

export interface RelationData extends Record<string, unknown> {
  type: RelationType;
  sourceMultiplicity?: string;
  targetMultiplicity?: string;
}
