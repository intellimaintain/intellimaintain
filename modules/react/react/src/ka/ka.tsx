import { LensProps } from "@focuson/state";
import { KnowledgeArticle } from "../state/FullState";
import { Box, Typography } from "@mui/material";


export function KnowledgeArticle<S, C> ( { state }: LensProps<S, KnowledgeArticle, C> ) {
  const ka = state.optJson () || { title: 'Unknown', body: '' }
  return <Box>
    <Typography variant="h2" component="h2" gutterBottom>
      {ka.title}
    </Typography>
    <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
      {ka.body}
    </Typography>
  </Box>
}