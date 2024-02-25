import React from 'react';
import { ButtonData, KnowledgeArticle } from "@intellimaintain/knowledge_articles";
import { LensProps2, LensProps3 } from "@focuson/state";
import { SideEffect } from "@intellimaintain/react_core";
import { MessageButton } from "@intellimaintain/components";
import { Variables } from "@intellimaintain/variables";
import { NameAnd } from "@laoban/utils";
import { uppercaseFirstLetter } from "@intellimaintain/utils";

export interface ChatButtonProps<S> extends LensProps3<S, KnowledgeArticle | undefined, NameAnd<Variables>, SideEffect[], any> {
  who: string
}
function calcWhenFor ( buttonData: ButtonData, variables: any ): boolean {
  if ( buttonData.when === undefined ) return true
  return !!variables[ buttonData.when ]
}
function calcNotWhenFor ( buttonData: ButtonData, variables: any ) {
  if ( buttonData.notWhen === undefined ) return false
  return !!variables[ buttonData.notWhen ]

}
function calcDisabledFor ( buttonData: ButtonData, variables: any ) {
  if ( buttonData === undefined ) return false
  const when = calcWhenFor ( buttonData, variables )
  const notWhen = calcNotWhenFor ( buttonData, variables )
  return when === false || notWhen === true
}
export function ChatButton<S> ( { state, who }: ChatButtonProps<S> ) {
  const buttons: NameAnd<ButtonData> = state.optJson1 ()?.buttons || {}
  console.log ( 'ChatButton', 'state', state )
  console.log ( 'ChatButton', 'ka', state.optJson1 () )
  console.log ( 'ChatButton', 'buttons', buttons )
  const variables: any = state.optJson2 ()?.Summary?.variables || {}
  console.log ( 'ChatButton', 'variables', variables )
  return (
    <div>
      {Object.entries ( buttons ).map ( ( [ button, buttonData ], index ) => {
        const text = buttonData.text || uppercaseFirstLetter ( button )

        console.log ( 'ChatButton', 'buttonData', buttonData )
        const disabled = calcDisabledFor ( buttonData, variables )
        return <MessageButton key={index} disabled={disabled} state={state.state3 ()} message={{ message: buttonData.message, who }} label={text}/>
      } )}
    </div>
  )
}