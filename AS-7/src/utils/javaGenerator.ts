import type { Node, Edge } from '@xyflow/react';
import type { UMLClassData, Visibility, RelationData } from '../types';

export function generateJavaCode(nodes: Node<UMLClassData>[], edges: Edge[]): Record<string, string> {
  const codeMap: Record<string, string> = {};

  const visibilityMap: Record<Visibility, string> = {
    '+': 'public',
    '-': 'private',
    '#': 'protected',
    '~': '' // package-private
  };

  nodes.forEach(node => {
    const { name, type, attributes, methods } = node.data;
    let code = '';

    // Find relationships for this class
    const sourceEdges = edges.filter(e => e.source === node.id);
    // Determine extends and implements
    let extendsClass = '';
    const implementsInterfaces: string[] = [];
    const fieldsFromRelations: string[] = [];

    sourceEdges.forEach(edge => {
      const targetNode = nodes.find(n => n.id === edge.target);
      if (!targetNode) return;

      const relationType = (edge.data as RelationData)?.type || 'association';

      if (relationType === 'inheritance') {
        if (targetNode.data.type === 'interface' && type === 'class') {
          implementsInterfaces.push(targetNode.data.name); // Although technically realization, but let's map extends/implements correctly
        } else {
          extendsClass = targetNode.data.name;
        }
      } else if (relationType === 'implementation') {
        implementsInterfaces.push(targetNode.data.name);
      } else if (['association', 'aggregation', 'composition'].includes(relationType)) {
        // Create a field for the association
        const isList = (edge.data as RelationData)?.targetMultiplicity === '*' || (edge.data as RelationData)?.targetMultiplicity === '0..*';
        const fieldType = isList ? `List<${targetNode.data.name}>` : targetNode.data.name;
        const fieldName = targetNode.data.name.charAt(0).toLowerCase() + targetNode.data.name.slice(1) + (isList ? 's' : '');
        fieldsFromRelations.push(`    private ${fieldType} ${fieldName};`);
      }
    });

    // Class Declaration
    let classDecl = `public ${type} ${name}`;
    if (extendsClass) {
      classDecl += ` extends ${extendsClass}`;
    }
    if (implementsInterfaces.length > 0) {
      classDecl += ` implements ${implementsInterfaces.join(', ')}`;
    }
    classDecl += ' {\n';
    code += classDecl;

    // Attributes
    attributes.forEach(attr => {
      const vis = visibilityMap[attr.visibility] ? visibilityMap[attr.visibility] + ' ' : '';
      code += `    ${vis}${attr.type} ${attr.name};\n`;
    });

    if (fieldsFromRelations.length > 0) {
      code += '\n    // Association Fields\n';
      fieldsFromRelations.forEach(f => code += f + '\n');
    }

    if (attributes.length > 0 || fieldsFromRelations.length > 0) {
      code += '\n';
    }

    // Methods
    methods.forEach(method => {
      const vis = visibilityMap[method.visibility] ? visibilityMap[method.visibility] + ' ' : '';
      const staticKwd = method.isStatic ? 'static ' : '';
      const abstractKwd = method.isAbstract || type === 'interface' ? 'abstract ' : '';
      
      const params = method.parameters.map(p => `${p.type} ${p.name}`).join(', ');
      
      code += `    ${vis}${staticKwd}${abstractKwd}${method.returnType} ${method.name}(${params})`;
      
      if (type === 'interface' || method.isAbstract) {
        code += ';\n';
      } else {
        code += ' {\n        // TODO: Implement method logic\n';
        if (method.returnType !== 'void') {
          code += `        return null;\n`;
        }
        code += '    }\n\n';
      }
    });

    code += '}\n';
    codeMap[`${name}.java`] = code;
  });

  return codeMap;
}
