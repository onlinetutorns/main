export const NODE_ID_COLUMNS = [
  "node1_id",
  "node2_id",
  "node3_id",
  "node4_id",
  "node5_id",
  "node6_id",
  "node7_id",
  "node8_id",
  "node9_id",
  "node10_id",
] as const;

export type NodeRow = {
  question_id: string;
  node1_id: string | null;
  node2_id: string | null;
  node3_id: string | null;
  node4_id: string | null;
  node5_id: string | null;
  node6_id: string | null;
  node7_id: string | null;
  node8_id: string | null;
  node9_id: string | null;
  node10_id: string | null;
};

export function getNodeChain(row: NodeRow): string[] {
  return NODE_ID_COLUMNS.map((column) => row[column]).filter(
    (id): id is string => id != null,
  );
}

export function getPreviousNodeIdInChain(
  row: NodeRow,
  currentQuestionId: string,
): string | null {
  const chain = getNodeChain(row);
  const originId = row.question_id;

  if (currentQuestionId === originId) {
    return chain.length > 0 ? chain[chain.length - 1] : null;
  }

  const index = chain.indexOf(currentQuestionId);
  if (index <= 0) {
    return null;
  }

  return chain[index - 1];
}

export function resolveOriginQuestionId(
  currentQuestionId: string,
  originParam: string | null | undefined,
  rows: NodeRow[],
): string | null {
  if (originParam) {
    const originRow = rows.find((row) => row.question_id === originParam);
    if (originRow) {
      return originParam;
    }
  }

  const asOrigin = rows.find((row) => row.question_id === currentQuestionId);
  if (asOrigin) {
    return currentQuestionId;
  }

  for (const row of rows) {
    if (getNodeChain(row).includes(currentQuestionId)) {
      return row.question_id;
    }
  }

  return null;
}

export function resolveNodeNavigation(
  currentQuestionId: string,
  originParam: string | null | undefined,
  rows: NodeRow[],
): { originQuestionId: string | null; previousNodeId: string | null } {
  const originQuestionId = resolveOriginQuestionId(
    currentQuestionId,
    originParam,
    rows,
  );

  if (!originQuestionId) {
    return { originQuestionId: null, previousNodeId: null };
  }

  const originRow = rows.find((row) => row.question_id === originQuestionId);
  if (!originRow) {
    return { originQuestionId: null, previousNodeId: null };
  }

  return {
    originQuestionId,
    previousNodeId: getPreviousNodeIdInChain(originRow, currentQuestionId),
  };
}
