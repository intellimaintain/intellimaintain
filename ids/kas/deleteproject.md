Delete Project

# Enrich:
* Locate environment where project exists

# Required:
* Projectid
* environment

# Ticket info:
* Highlight if not P4.
* If cannot find problem, bounce back to the ticket owner
* Approval by email from #aprover# required before resolution.

# Sql
* Check:   [sql select * from projects where projectid=#projectid# | atleastonerecord]
* Validate: [sql select * from projects where projectid=#projectid# | norecords]
* Resolve: [sql delete from projects where projectid=#projectid]

# Variables
* Service: EPX
