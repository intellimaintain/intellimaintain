import { SelectedAndList } from "@intellimaintain/react_core";
import { KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { JSONObject } from "@intellimaintain/utils";
import { Paper, Typography } from "@mui/material";
import React from "react";

const yaml = require ( 'js-yaml' );
export type KnowledgeArticles = SelectedAndList<KnowledgeArticle>
function turnToYaml ( jsonObject: JSONObject ) {
  if ( typeof jsonObject !== 'object' ) throw new Error ( `Not an object${JSON.stringify ( jsonObject )}` );
  return Object.entries ( jsonObject ).map ( ( [ key, value ] ) =>
    Object.keys ( value || {} ).length == 0 ? '' : yaml.dump ( { [ key ]: value } ) ).filter ( x => x.length > 0 ).join ( '\n' )
}

export interface YamlDisplayMUIProps {
  yamlContent: any
  maxHeight?: string
}
export function DisplayYaml ( { yamlContent, maxHeight }: YamlDisplayMUIProps ) {
  const withBlankLines = turnToYaml ( yamlContent )
  return (
    <Typography component="pre" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      <code>{withBlankLines}</code>
    </Typography>
  );
}
