Delete Project
# Enrich:
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
* Resolve: [sql delete from projects where projectid=#projectid]