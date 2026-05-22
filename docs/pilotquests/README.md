# PilotQuests — Long-term Context Notes

This folder exists to “store context” so PilotQuests development stays consistent over time.

## Summary (what is PilotQuests?)
- **PilotQuests** is a Web3 quest platform (similar to Galxe/questn), but **quests are executed by an agent**, not manually by a user.
- Example quest: *“swap 3 USDC to MNT”*.
- The agent will:
  1) execute on-chain actions (e.g., swap), and
  2) **verify** that the action actually happened (on-chain proof/receipt).

## Key dependency (Byreal)
PilotQuests relies on Byreal tooling to execute on-chain activity:
- `byreal-agent-skills` (agent skills): https://github.com/byreal-git/byreal-agent-skills
- `byreal-perps-cli` (CLI): https://github.com/byreal-git/byreal-perps-cli

> Note: technical details for both repos are tracked in separate docs.

## Core concepts (working model)
Minimum terms used in this project:
- **Quest**: action target + verification rules + parameters (amount/token/chain).
- **Run / Attempt**: a single quest execution by an agent (success/failure).
- **Execution (On-chain action)**: one or more transactions performed by the agent.
- **Verification**: proving that execution is valid and matches the quest rules.
- **Receipt / Evidence**: verification artifacts (tx hash, event logs, state diffs, etc.).

## Quest lifecycle (high-level)
1. **Define**: admin/creator defines the quest and verification rules.
2. **Dispatch**: system chooses agent/wallet/environment to run the quest.
3. **Execute**: agent runs steps via Byreal (skills/CLI).
4. **Verify**: system verifies results (on-chain checks).
5. **Complete**: quest is marked completed and evidence is stored.

## Verification directions (what we must guarantee)
Common evidence strategies:
- **Tx-based**: ensure tx hash exists, succeeded, came from the expected address, and targets the expected contract/router.
- **Event-based**: ensure specific events appear (e.g., swap event) with expected parameters.
- **Balance-based**: ensure balances changed as expected (with tolerance for slippage/fees).

## Related docs
- Byreal repo summary & integration notes: `docs/pilotquests/byreal.md`
- Quest & verification model: `docs/pilotquests/quest-model.md`
- Open questions / TODO: `docs/pilotquests/open-questions.md`
