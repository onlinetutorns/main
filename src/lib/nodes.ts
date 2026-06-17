import { createClient } from "@/lib/supabase/server";
import type { NodeRow } from "@/types/node";

const NODE_SELECT_COLUMNS =
  "question_id, node1_id, node2_id, node3_id, node4_id, node5_id, node6_id, node7_id, node8_id, node9_id, node10_id";

export async function getAllNodes(): Promise<NodeRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("nodes").select(NODE_SELECT_COLUMNS);

  if (error) {
    throw new Error(`ノードの取得に失敗しました: ${error.message}`);
  }

  return data as NodeRow[];
}
