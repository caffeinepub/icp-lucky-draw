import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor Self {
  // --- ICP Ledger ICRC-2 ---
  type Account = { owner : Principal; subaccount : ?Blob };
  type TransferFromArgs = {
    from : Account;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat64;
    from_subaccount : ?Blob;
    spender_subaccount : ?Blob;
  };
  type TransferFromError = {
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #InsufficientAllowance : { allowance : Nat };
    #TooOld;
    #CreatedInFuture : { ledger_time : Nat64 };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };
  type TransferFromResult = { #Ok : Nat; #Err : TransferFromError };

  let ICP_LEDGER = actor "ryjl3-tyaaa-aaaaa-aaaba-cai" : actor {
    icrc2_transfer_from : (TransferFromArgs) -> async TransferFromResult;
  };

  // --- Types ---
  type TicketId = Nat;
  type YearNumber = Nat;
  type WeekNumber = Nat;

  type Ticket = {
    id : TicketId;
    owner : Principal;
    purchaseTime : Time.Time;
  };

  type DrawResult = {
    year : YearNumber;
    week : WeekNumber;
    pot : Nat;
    winner : ?Principal;
    winningTicket : ?TicketId;
    drawTime : Time.Time;
    tickets : Nat;
  };

  public type UserProfile = {
    name : Text;
  };

  module DrawResultCompare {
    public func compare(a : DrawResult, b : DrawResult) : Order.Order {
      switch (Nat.compare(a.year, b.year)) {
        case (#equal) {
          switch (Nat.compare(a.week, b.week)) {
            case (#equal) { Nat.compare(a.pot, b.pot) };
            case (other) { other };
          };
        };
        case (other) { other };
      };
    };
  };

  type TicketCounts = {
    #owing : Nat;
    #purchased : Nat;
  };

  type State = {
    var ticketIdCount : Nat;
    var currentYear : YearNumber;
    var currentWeek : WeekNumber;
    var currentPot : Nat;
    var currentTicketPrice : Nat;
    var currentTickets : List.List<Ticket>;
    var regularTicketCount : TicketId;
    tickets : Map.Map<Principal, TicketCounts>;
    pastDraws : Map.Map<(YearNumber, WeekNumber), DrawResult>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  let state : State = {
    var ticketIdCount = 1;
    var currentYear = 0;
    var currentWeek = 0;
    var currentPot = 0;
    var currentTicketPrice = 10_000_000; // 0.1 ICP in e8s
    var currentTickets = List.empty<Ticket>();
    var regularTicketCount = 0;
    tickets = Map.empty<Principal, TicketCounts>();
    pastDraws = Map.empty<(YearNumber, WeekNumber), DrawResult>();
    userProfiles = Map.empty<Principal, UserProfile>();
  };

  // Stable vars persisted across upgrades
  stable var lotteryAdminPrincipal : ?Principal = null;
  stable var adminWalletPrincipal : ?Principal = null;

  // --- Authorization (mixin for legacy token-based auth) ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  private func requireLotteryAdmin(caller : Principal) {
    switch (lotteryAdminPrincipal) {
      case (?p) {
        if (p != caller) {
          Runtime.trap("Unauthorized: Only the lottery admin can perform this action");
        };
      };
      case null {
        Runtime.trap("No lottery admin set yet");
      };
    };
  };

  // --- Lottery Admin Setup ---

  // First wallet to call this becomes the permanent lottery admin.
  // Subsequent callers get false if they are not the admin, true if they are.
  public shared ({ caller }) func setupLotteryAdmin() : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (lotteryAdminPrincipal) {
      case null {
        lotteryAdminPrincipal := ?caller;
        true;
      };
      case (?p) {
        p == caller;
      };
    };
  };

  public query ({ caller }) func isLotteryAdmin() : async Bool {
    switch (lotteryAdminPrincipal) {
      case (?p) { p == caller };
      case null { false };
    };
  };

  // --- User Profile Functions ---
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) { return null };
    state.userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    state.userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers cannot save profiles");
    };
    state.userProfiles.add(caller, profile);
  };

  // --- Lottery Query Functions ---
  public query ({ caller }) func getCurrentRound() : async (YearNumber, WeekNumber, Nat, Nat) {
    (state.currentYear, state.currentWeek, state.currentPot, state.ticketIdCount - 1);
  };

  public query ({ caller }) func getTicketPrice() : async Nat {
    state.currentTicketPrice;
  };

  public query ({ caller }) func getAdminWallet() : async ?Principal {
    adminWalletPrincipal;
  };

  public query ({ caller }) func getMyTickets() : async Nat {
    if (caller.isAnonymous()) { return 0 };
    switch (state.tickets.get(caller)) {
      case (null) { 0 };
      case (?#purchased(n)) { n };
      case (?#owing(_)) { 0 };
    };
  };

  public query ({ caller }) func getPastDraws(num : Nat) : async [DrawResult] {
    let results = state.pastDraws.values().toArray();
    let sorted = results.sort();
    let len = sorted.size();
    if (num < len) {
      Array.tabulate<DrawResult>(num, func(i) { sorted[len - num + i] });
    } else {
      sorted;
    };
  };

  // --- Lottery User Functions ---
  public shared ({ caller }) func buyTicket() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous callers cannot buy tickets");
    };

    let currentCount = switch (state.tickets.get(caller)) {
      case (null) { 0 };
      case (?#purchased(n)) { n };
      case (?#owing(n)) { n };
    };

    if (currentCount >= 10) {
      Runtime.trap("Ticket purchase limit reached (max 10 per draw)");
    };

    // Pull ICP from user via ICRC-2 (user must have called icrc2_approve first)
    let canisterPrincipal = Principal.fromActor(Self);
    let transferResult = await ICP_LEDGER.icrc2_transfer_from({
      from = { owner = caller; subaccount = null };
      to = { owner = canisterPrincipal; subaccount = null };
      amount = state.currentTicketPrice;
      fee = null;
      memo = null;
      created_at_time = null;
      from_subaccount = null;
      spender_subaccount = null;
    });

    switch (transferResult) {
      case (#Err(e)) {
        let msg = switch (e) {
          case (#InsufficientFunds(_)) { "Insufficient ICP balance" };
          case (#InsufficientAllowance(_)) { "ICP spend not approved. Please try again." };
          case (#BadFee(_)) { "Incorrect transaction fee" };
          case (#TooOld) { "Transaction expired, please try again" };
          case (#CreatedInFuture(_)) { "Transaction timestamp error" };
          case (#Duplicate(_)) { "Duplicate transaction" };
          case (#TemporarilyUnavailable) { "ICP ledger temporarily unavailable" };
          case (#GenericError(e)) { e.message };
          case (_) { "ICP transfer failed" };
        };
        Runtime.trap(msg);
      };
      case (#Ok(_)) {
        let ticket : Ticket = {
          id = state.ticketIdCount;
          owner = caller;
          purchaseTime = Time.now();
        };
        state.currentTickets.add(ticket);
        state.ticketIdCount += 1;
        state.currentPot += state.currentTicketPrice;
        state.tickets.add(caller, #purchased(currentCount + 1));
      };
    };
  };

  // --- Admin Functions ---

  // Called on every wallet connection.
  // If no admin set: makes caller admin and initializes round.
  // If admin already set and caller IS admin: updates round if at year 0.
  // Otherwise: silently does nothing.
  public shared ({ caller }) func adminSetup(year : YearNumber, week : WeekNumber) : async () {
    if (caller.isAnonymous()) { return };
    switch (lotteryAdminPrincipal) {
      case null {
        lotteryAdminPrincipal := ?caller;
        state.currentYear := year;
        state.currentWeek := week;
      };
      case (?p) {
        if (p == caller and state.currentYear == 0) {
          state.currentYear := year;
          state.currentWeek := week;
        };
        // Non-admin: silently do nothing
      };
    };
  };

  public shared ({ caller }) func adminChangeTicketPrice(newTicketPrice : Nat) : async () {
    requireLotteryAdmin(caller);
    state.currentTicketPrice := newTicketPrice;
  };

  public shared ({ caller }) func setAdminWallet(wallet : Principal) : async () {
    requireLotteryAdmin(caller);
    adminWalletPrincipal := ?wallet;
  };

  public shared ({ caller }) func addToPot(amount : Nat) : async () {
    requireLotteryAdmin(caller);
    state.currentPot := state.currentPot + amount;
  };

  public shared ({ caller }) func adminChangeRound(year : YearNumber, week : WeekNumber) : async () {
    requireLotteryAdmin(caller);
    state.currentYear := year;
    state.currentWeek := week;
  };

  public shared ({ caller }) func triggerDraw() : async () {
    requireLotteryAdmin(caller);
    // Draw logic placeholder - to be implemented
  };
};
