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

Even the Commander CLI is wrapped in a typeclass. This allows us to upgrade version fairly easily. Note
we are natively using the command cli 'language' for options and the command line (that is very  stable between version).
It would be possible to remove ourselves from that if we wanted to... but it's not worth it.

# Use the file system for messaging

We know nothing about where our code is going to be run. We want self service, so don't want any heavy weight solutions.
The very simplest messaging just uses a shared file system. 

# Why Material UI

Why not... it's nice. It's easy and adequate for the task.

# How to manage selection state

By this I mean 'are we editing the component or viewing it'. What is the active tab. Things that don't impact the business logic. 
So for example 'which ticket are we working on' is not covered by this section but 'which is the active tab I am looking at' is.

We store this in the react state. NOT via useState, but by the big json object that is the state which we pass down to the components.

# Why are we minimising the use of React Hooks

For example NO UseState. The reason is that we want stateless sideeffect free pure functions whereever possible. Hooks have many
downsides: hard to test, hard to reason about, hard to debug. They also break if you violate the rules which are not always clear. 
They bind the component to every other component on the display. This makes it even harder to reason about the code.

We do use useEffect and useRef where we absolutely have to. Like using machine code it should be used sparingly.

# How do we manage non selection state

We are using the focus on library. This is extremely similar to redux in many ways: there is a single state and we can
focus on part of the state. However there are almost no actions. We can change the state of the bit we are focused on and
that is it

This forces us to use the command pattern (which is a good thing). Components are checked by the type system to ensure
that we know what they do. Compare this to redux where we can change any aspect of the state from anywhere. 

If we want to do a 'major change' that impacts decision making logic like 'what ticket are we working on' or 'edit one of the variables that
the AI would have calculated for us' then we store the 'event' in the state under the section 'sideeffects'. This will be processed
in the main loop and send the event to the file system. 

A separate polling loop will pick up the event from the file system and process it. 

Reasons
* Separating 'what I want to do' from 'how I do it' is a good thing.
  * Easier to test.
  * Easier to reason about.
  * Easier to debug / trace
  * Easier to understand.
* 



# How to do side effects like 'send message' 'do email'

Modify the state and add the sideeffect to a list of side effects. Then in the main loop, process the side effects. Remove after side effects are processed.

Why?




