# fidelity.link

A pseudonymous anti-spam identity system based on the blockchain.

Based on previous work by Peter Todd, Jeff Garzik and others.

## Overview

### Glossary

* Identity: An entity that has an unique uuid.
* Fidelity Bond: A set of two transactions, called the commitment transaction
  and the sacrifice transaction.
* Active public key: The public key known to be associated with the identity.
* Commitment transaction: A transaction containing three outputs:
  - A single P2PKH output funding the sacrifice transaction's only input
    address
  - An OP_RETURN output with the serialized sacrifice transaction
  - An OP_RETURN output with the public key that can revokate the fidelity bond
* Sacrifice transaction: A transaction spending the first output of the
  commitment transaction to no outputs (the miner that mines this transaction
  will get all the inputs as fee). This transaction must be time-locked at least
  144 blocks (about 48 hours) into the future since the commitment transaction
  got into a block.
* Revokation transaction: A transaction that changes the active public key
  associated with an identity.

## API

* GET /:uuid
  - Returns whether a given id has recorded a fidelity bond on the blockchain,
    whether its corresponding private key has been compromised, and a summary of
    associated information to this identity (including revokations)
* POST /:uuid
  - Report two transactions on the blockchain to be checked if they have a
    valid commitment sacrifice on the blockchain.
* POST /:uuid/revokation
  - Report that a revokation certificate has been published on the blockchain.
* POST /craft
  - Create but do not sign two transactions composing the fidelity bond.
* POST /craft/revokation
  - Create a revokation transaction for a fidelity bond.

## Bibliography

