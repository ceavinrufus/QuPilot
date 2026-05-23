# Byreal — Integration Notes

Goal of this document: capture the key integration points from Byreal tooling used to execute on-chain actions in PilotQuests.

## Repos used
- byreal-agent-skills: https://github.com/byreal-git/byreal-agent-skills
- byreal-perps-cli: https://github.com/byreal-git/byreal-perps-cli

## Role in PilotQuests (initial hypothesis)
- **Agent skills** act as an “adapter layer” so an agent can execute on-chain actions in a structured way.
- **CLI** is used to execute specific actions (e.g., swap/perps) with explicit parameters and outputs that can be parsed for verification.

## Outputs we must map (for verification)
When reviewing the repos above, our focus is:
- How to run the relevant commands for quests (e.g., swap).
- The shape of **output** / logs / return values:
  - does it return a `txHash`?
  - does it include token in/out, fees, chain, address, etc.?
  - is there a “dry-run” or estimation mode?
- How to configure:
  - RPC / chain endpoint
  - wallet/key management (agent wallet)
  - slippage, gas, and other parameters

## Review TODO (quick checklist)
- [ ] List skills/commands relevant for “swap X token to Y token”.
- [ ] Provide full command example + required env vars.
- [ ] Define how to parse outputs to extract `txHash` and other metadata.
- [ ] Error-handling patterns (retry, partial failure).
- [ ] Security best practices (private keys, signer, etc.).
