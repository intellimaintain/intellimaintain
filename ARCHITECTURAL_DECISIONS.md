# Key Goals that everything else hangs off

* Self service
  * Simple installation
  * No external apis / databases that we need to install
* Fast
  * Fast to develop
  * Fast to run
  * Fast to deploy
* Dependencies are friction. Minimise them.
* 
# Use Laoban / yarn for package management

We want nicely structured code so that we can go fast. This
is made much easier if we can work with multipe npm packages 
instead of just one. Many design decisions are made easier: such as dependency management.

# Never use a dependency directly
This can be broken when it makes sense. For example the commander cli. But where possible we 
will wrap the dependency with an interface or typeclass that we control. Thus 90% of 
our code doesn't know about the dependency. This makes it easier to swap out the dependency.

# Use the file system for messaging

We know nothing about where our code is going to be run. We want self service, so don't want any heavy weight solutions.
The very simplest messaging just uses a shared file system. 



