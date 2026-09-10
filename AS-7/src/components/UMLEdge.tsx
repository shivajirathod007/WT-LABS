import { getBezierPath, BaseEdge } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import type { RelationData } from '../types';

export function UMLEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relationData = data as RelationData | undefined;
  const relType = relationData?.type || 'association';

  let customMarkerEnd = markerEnd;
  let strokeDasharray = 'none';

  // Customize based on relation type
  if (relType === 'inheritance') {
    customMarkerEnd = 'url(#inheritance-arrow)';
  } else if (relType === 'implementation') {
    customMarkerEnd = 'url(#inheritance-arrow)';
    strokeDasharray = '5,5';
  } else if (relType === 'composition') {
    customMarkerEnd = 'url(#composition-diamond)';
  } else if (relType === 'aggregation') {
    customMarkerEnd = 'url(#aggregation-diamond)';
  } else if (relType === 'dependency') {
    customMarkerEnd = 'url(#dependency-arrow)';
    strokeDasharray = '5,5';
  } else if (relType === 'association') {
    customMarkerEnd = 'url(#dependency-arrow)';
  }

  const selectedStyle = selected ? { stroke: '#ec4899', strokeWidth: 2, filter: 'drop-shadow(0 0 5px #ec4899)' } : {};

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={customMarkerEnd as string} 
        style={{ ...style, strokeDasharray, stroke: '#94a3b8', strokeWidth: 1.5, ...selectedStyle }} 
      />
      {/* Invisible thicker path for easier interaction/clicking */}
      <BaseEdge 
        path={edgePath} 
        style={{ stroke: 'transparent', strokeWidth: 15, cursor: 'pointer' }} 
      />
    </>
  );
}
