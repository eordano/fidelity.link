# fidelity.link

A pseudonymous anti-spam identity system based on the blockchain.

Concept and idea based previous work by Peter Todd, Jeff Garzik and others.

## Overview

A fidelity bond for the purposes of this app is a certain amount of bitcoin
days that are sacrificed to the miners or whoever gets to redeem a transaction.

The value of the fidelity bond is the amount of satoshis being sacrificed.

In order to certify that the bitcoins can be redeemed by anyone, an output of
a transaction is locked with OP\_CHECKLOCKTIMEVERIFY, and the redeem script
is revealed in the same transaction with an OP\_RETURN. P2SH is needed due to
the use of a non-standard script.

At least 2015 blocks must be mined between the block that includes the fidelity
bond transaction and the block redeeming it. OP\_CHECKSEQUENCEVERIFY is more
suited than OP_CLTV for this, but hasn't been deployed yet.

The redeem script structure is:
  <magic string> <block height> OP\_CHECKLOCKTIMEVERIFY OP\_DROP
