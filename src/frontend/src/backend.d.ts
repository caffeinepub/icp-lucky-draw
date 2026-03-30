import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DrawResult {
    pot: bigint;
    tickets: bigint;
    week: WeekNumber;
    year: YearNumber;
    winner?: Principal;
    drawTime: Time;
    winningTicket?: TicketId;
}
export type YearNumber = bigint;
export type Time = bigint;
export type WeekNumber = bigint;
export type TicketId = bigint;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToPot(amount: bigint): Promise<void>;
    adminChangeRound(year: YearNumber, week: WeekNumber): Promise<void>;
    adminChangeTicketPrice(newTicketPrice: bigint): Promise<void>;
    adminSetup(year: YearNumber, week: WeekNumber): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    buyTicket(): Promise<void>;
    getAdminWallet(): Promise<Principal | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentRound(): Promise<[YearNumber, WeekNumber, bigint, bigint]>;
    getMyTickets(): Promise<bigint>;
    getPastDraws(num: bigint): Promise<Array<DrawResult>>;
    getTicketPrice(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isLotteryAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setAdminWallet(wallet: Principal): Promise<void>;
    setupLotteryAdmin(): Promise<boolean>;
    triggerDraw(): Promise<void>;
}
