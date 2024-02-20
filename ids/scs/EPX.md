
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
