import { LensProps } from "@focuson/state";
import { KnowledgeArticle } from "../state/FullState";


export function KnowledgeArticle<S, C> ( { state }: LensProps<S, KnowledgeArticle, C> ) {
  const ka = state.optJson () || { title: 'Unknown', body: '' }
  return <div>
    <h2>{ka.title}</h2>
    <p><pre>{ka.body}</pre></p>
  </div>
}