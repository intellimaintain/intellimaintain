# What are these for?

* When we start we don't have operator data so we need to ask the user for their email etc
* Then we don't have any data about the ticket, so we need to ask the user for that too

This is easily dealt with by a partial function, defaulting to normal 'chat'

Note this makes these composible...

# What are the questions?

I think that we are going to need others
* When we want to do sql we will find we don't have the database connection details
* When we want to send an email we will find we don't have the email server details
* When we need to access LDAP we will find we don't have the LDAP server details

Thus when we are wanting to do a sql question we probably want
* normal questions
* plus 'sql detail questions'
* Then the sql display.

Same for LDAP/etc...

Thus we are basically reverse chaining the questions

# Reverse Chaining

That leads to an interesting question.

The whole thing is really reverse chaining once we know the ticket type. Very little AI needed.

So do we just get the AI to compile down to backward chaining? In some horn-clauses  sense that is the natural language
of expert systems and we are effectively making a simple expert system here.

Some thoughts on that
https://chat.openai.com/share/9a18f799-501b-473f-9204-21876b24f62f

Example:

To finish the ticket we need to do the following:
* Validated the ticket is closed

To validate the ticket is closed
* 

To validate the ticket is fixed we need to do the following:
* Check the ticket has been validated
* Check the ticket has been resolved




