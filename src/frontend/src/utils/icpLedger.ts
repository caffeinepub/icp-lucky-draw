import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import type { Identity } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";

const ICP_LEDGER_ID = "ryjl3-tyaaa-aaaaa-aaaba-cai";

function icpLedgerIdlFactory({ IDL }: { IDL: any }) {
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const ApproveArgs = IDL.Record({
    amount: IDL.Nat,
    spender: Account,
    expires_at: IDL.Opt(IDL.Nat64),
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
  });
  const ApproveError = IDL.Variant({
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
    AllowanceChanged: IDL.Record({ current_allowance: IDL.Nat }),
    Expired: IDL.Record({ ledger_time: IDL.Nat64 }),
    TooOld: IDL.Null,
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    TemporarilyUnavailable: IDL.Null,
    GenericError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
  });
  const ApproveResult = IDL.Variant({ Ok: IDL.Nat, Err: ApproveError });
  return IDL.Service({
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ["query"]),
    icrc2_approve: IDL.Func([ApproveArgs], [ApproveResult], []),
  });
}

function createLedgerActor(identity: Identity, host?: string) {
  const agent = new HttpAgent({ identity, host });
  return Actor.createActor(icpLedgerIdlFactory, {
    agent,
    canisterId: ICP_LEDGER_ID,
  }) as any;
}

export async function getIcpBalance(
  identity: Identity,
  host?: string,
): Promise<bigint> {
  const actor = createLedgerActor(identity, host);
  const principal: Principal = identity.getPrincipal();
  const balance = await actor.icrc1_balance_of({
    owner: principal,
    subaccount: [],
  });
  return balance as bigint;
}

export async function approveIcpSpend(
  identity: Identity,
  spenderCanisterId: string,
  amount: bigint,
  host?: string,
): Promise<void> {
  const { Principal } = await import("@icp-sdk/core/principal");
  const actor = createLedgerActor(identity, host);
  const spenderPrincipal = Principal.fromText(spenderCanisterId);
  const result = await actor.icrc2_approve({
    amount,
    spender: { owner: spenderPrincipal, subaccount: [] },
    expires_at: [],
    fee: [],
    memo: [],
    from_subaccount: [],
    created_at_time: [],
  });
  if (result && "Err" in result) {
    const err = result.Err;
    if ("InsufficientFunds" in err) {
      throw new Error("Insufficient ICP balance");
    }
    if ("BadFee" in err) {
      throw new Error("Bad fee for ICP approval");
    }
    throw new Error("Failed to approve ICP spending");
  }
}
