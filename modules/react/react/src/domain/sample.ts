import { Ticket, Tickets } from "./ticket/ticket";
import { blankChatState, DemoChatState } from "./domain";
import { KnowledgeArticle, KnowledgeArticles } from "./ka/ka";
import { DisplaySoftwareCatalog, SoftwareCatalog, SoftwareCatalogs } from "./softwarecatalog/sc";

export const ticket1: Ticket =
               {
                 id: 'ticket:pa123', priority: 'P4',name: 'Ticket PA123', description: `Issue:
  * I created a project (P-6666)
  * It is in the EPX acceptance by mistake.
  
Action requested:
 * Please delete this.
 
 Thanks`
               };
export const ticket2: Ticket = { id: 'ticket:pa124', priority: 'P4', name: 'Ticket PA124', description: `Update cost of item QZR to $1234.56` };
let tickets: Tickets = {
  selected: ticket1.id,
  item: ticket1,
  options: [ ticket1, ticket2 ]
}

export const ka1: KnowledgeArticle = {
  id: 'ka:deleteProject',
  name: 'Delete Project', body: `# Enrich:
* Locate environment where project exists
* Project: EPX

# Required:
* Projectid
* environment

# Ticket info:
* Highlight if not P4. 
* If cannot find problem, bounce back to the ticket owner
* Approval by email from #aprover# required before resolution.

# Issue: Delete Project from ESS
* You want me to delete the project #project# in the #env# ESS. 

# Sql
* Check:   [sql select * from projects where projectid=#projectid# | atleaseonerecord]
* Validate: [sql select * from projects where projectid=#projectid# | norecords]
* Resolve: [sql delete from projects where projectid=#projectid]`
};
export const kas: KnowledgeArticles = {
  selected: ka1.id,
  item: ka1,
  options: [ ka1 ]
}

export const  scEPX: SoftwareCatalog = {
id: "sc:EPX",
name: "EPX",
body: `
# Approval
* By email to mr.approver@example.com

# Environments
* Database 
  * type: Oracle
  * user: #supportuser#

## Acceptance
* Database 
  * name: EPX_DB_ACC
  * password: environment variable 'EPX_DB_SECRET_ACC'
## Production
* Database 
  * name: EPX_DB  
  * password: environment variable 'EPX_DB_SECRET_PROD'
`
}
export const scs: SoftwareCatalogs = {
  selected: scEPX.id,
  item: scEPX,
  options: [ scEPX ]
}

const variables =
`* Ticket: ticket:pa123
* Priority: P4
* Project Id: P-6666
* System: EPX
* Environment: Acceptance

* Knowledge Article: ka:deleteProject 
* Approver: mr.approver@example.com
* Database:
  * username: EPX_DB_ACC
  * password: environment variable 'EPX_DB_SECRET_PROD' 
`
export const startAppState: DemoChatState = {
  chatState1: blankChatState ( 'Operator', 'Wizard', kas,scs, tickets, variables ),
  chatState2: blankChatState ( 'Wizard', 'Operator', kas, scs,tickets, variables )
}