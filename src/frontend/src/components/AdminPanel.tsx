import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Loader2, Play, RefreshCw, Save } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAddToPot,
  useChangeRound,
  useChangeTicketPrice,
  useCurrentRound,
  useSetAdminWallet,
  useTriggerDraw,
} from "../hooks/useQueries";
import { getCurrentWeekYear, icpToE8s } from "../utils/lottery";

export function AdminPanel() {
  const { data: round } = useCurrentRound();

  const [ticketPrice, setTicketPrice] = useState("0.1");
  const [addPotAmount, setAddPotAmount] = useState("");
  const [adminWallet, setAdminWallet] = useState("");
  const [changeYear, setChangeYear] = useState(
    String(getCurrentWeekYear().year),
  );
  const [changeWeek, setChangeWeek] = useState(
    String(getCurrentWeekYear().week),
  );

  const addToPot = useAddToPot();
  const triggerDraw = useTriggerDraw();
  const changePrice = useChangeTicketPrice();
  const changeRound = useChangeRound();
  const setAdminWalletMut = useSetAdminWallet();

  useEffect(() => {
    if (round) {
      setChangeYear(String(Number(round[0])));
      setChangeWeek(String(Number(round[1])));
    }
  }, [round]);

  async function handleChangePrice() {
    try {
      const priceE8s = icpToE8s(Number(ticketPrice));
      await changePrice.mutateAsync(priceE8s);
      toast.success("Ticket price updated!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update price");
    }
  }

  async function handleSaveWallet() {
    if (!adminWallet.trim()) {
      toast.error("Please enter a wallet principal");
      return;
    }
    try {
      await setAdminWalletMut.mutateAsync(adminWallet.trim());
      toast.success("Admin wallet saved!");
    } catch (err: any) {
      toast.error(err?.message || "Invalid principal or failed to save");
    }
  }

  async function handleAddToPot() {
    try {
      const amountE8s = icpToE8s(Number(addPotAmount));
      await addToPot.mutateAsync(amountE8s);
      toast.success(`Added ${addPotAmount} ICP to pot!`);
      setAddPotAmount("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to add to pot");
    }
  }

  async function handleTriggerDraw() {
    try {
      await triggerDraw.mutateAsync();
      toast.success("Draw executed successfully!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to trigger draw");
    }
  }

  async function handleChangeRound() {
    try {
      await changeRound.mutateAsync({
        year: BigInt(changeYear),
        week: BigInt(changeWeek),
      });
      toast.success("Round updated!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to change round");
    }
  }

  return (
    <section id="admin" className="relative z-10 py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="font-cinzel text-2xl font-bold gold-gradient">
              Admin Panel
            </h2>
            <p
              className="text-sm mt-2"
              style={{ color: "oklch(0.60 0.02 300)" }}
            >
              Manage lottery settings and operations
            </p>
          </div>

          <div className="grid gap-4">
            {/* Ticket Price */}
            <div className="card-casino rounded-xl p-5">
              <h3
                className="font-cinzel text-sm font-bold mb-4"
                style={{ color: "#F6D27A" }}
              >
                🎫 Ticket Price
              </h3>
              <div className="space-y-3">
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.02 300)" }}
                >
                  Set the ticket price in ICP. Current:{" "}
                  {round ? "(round active)" : "loading..."}
                </p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    min="0.01"
                    step="0.01"
                    placeholder="0.1"
                    data-ocid="admin.input"
                    style={{
                      background: "oklch(0.08 0.03 295)",
                      border: "1px solid #B88A2A",
                      color: "#F2EDF7",
                      fontFamily: "Cinzel, serif",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleChangePrice}
                    disabled={changePrice.isPending}
                    className="btn-gold px-4 py-2 rounded-lg text-sm flex items-center gap-1 whitespace-nowrap"
                    data-ocid="admin.save_button"
                  >
                    {changePrice.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Wallet */}
            <div className="card-casino rounded-xl p-5">
              <h3
                className="font-cinzel text-sm font-bold mb-4"
                style={{ color: "#F6D27A" }}
              >
                💰 Admin Wallet Address
              </h3>
              <div className="space-y-3">
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.02 300)" }}
                >
                  Your wallet principal where the 5% maintenance fee is sent.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={adminWallet}
                    onChange={(e) => setAdminWallet(e.target.value)}
                    className="font-mono text-xs"
                    placeholder="aaaaa-aa...principal-id"
                    data-ocid="admin.input"
                    style={{
                      background: "oklch(0.08 0.03 295)",
                      border: "1px solid #B88A2A",
                      color: "#F2EDF7",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveWallet}
                    disabled={setAdminWalletMut.isPending}
                    className="btn-gold px-4 py-2 rounded-lg text-sm flex items-center gap-1 whitespace-nowrap"
                    data-ocid="admin.save_button"
                  >
                    {setAdminWalletMut.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Pot */}
            <div className="card-casino rounded-xl p-5">
              <h3
                className="font-cinzel text-sm font-bold mb-4"
                style={{ color: "#F6D27A" }}
              >
                ➕ Add ICP to Pot
              </h3>
              <div className="space-y-3">
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.02 300)" }}
                >
                  Manually add ICP to the current draw's pot.
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                      style={{ color: "#C7902B" }}
                    />
                    <Input
                      type="number"
                      value={addPotAmount}
                      onChange={(e) => setAddPotAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                      className="pl-9"
                      placeholder="Amount in ICP"
                      data-ocid="admin.input"
                      style={{
                        background: "oklch(0.08 0.03 295)",
                        border: "1px solid #B88A2A",
                        color: "#F2EDF7",
                        fontFamily: "Cinzel, serif",
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddToPot}
                    disabled={addToPot.isPending || !addPotAmount}
                    className="btn-gold px-4 py-2 rounded-lg text-sm flex items-center gap-1 whitespace-nowrap"
                    data-ocid="admin.primary_button"
                  >
                    {addToPot.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span>Add to Pot</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Change Round */}
            <div className="card-casino rounded-xl p-5">
              <h3
                className="font-cinzel text-sm font-bold mb-4"
                style={{ color: "#F6D27A" }}
              >
                🎯 Change Round
              </h3>
              <div className="space-y-3">
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.02 300)" }}
                >
                  Manually set the current year and week number.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label
                      className="text-xs font-cinzel"
                      style={{ color: "#C7902B" }}
                    >
                      Year
                    </Label>
                    <Input
                      type="number"
                      value={changeYear}
                      onChange={(e) => setChangeYear(e.target.value)}
                      data-ocid="admin.input"
                      style={{
                        background: "oklch(0.08 0.03 295)",
                        border: "1px solid #B88A2A",
                        color: "#F2EDF7",
                        fontFamily: "Cinzel, serif",
                      }}
                    />
                  </div>
                  <div>
                    <Label
                      className="text-xs font-cinzel"
                      style={{ color: "#C7902B" }}
                    >
                      Week (1–52)
                    </Label>
                    <Input
                      type="number"
                      value={changeWeek}
                      onChange={(e) => setChangeWeek(e.target.value)}
                      min="1"
                      max="52"
                      data-ocid="admin.input"
                      style={{
                        background: "oklch(0.08 0.03 295)",
                        border: "1px solid #B88A2A",
                        color: "#F2EDF7",
                        fontFamily: "Cinzel, serif",
                      }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleChangeRound}
                  disabled={changeRound.isPending}
                  className="btn-gold px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  data-ocid="admin.save_button"
                >
                  {changeRound.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Update Round
                </button>
              </div>
            </div>

            {/* Trigger Draw */}
            <div className="card-casino rounded-xl p-5">
              <h3
                className="font-cinzel text-sm font-bold mb-4"
                style={{ color: "#F6D27A" }}
              >
                ⚡ Execute Draw Now
              </h3>
              <div className="space-y-3">
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.60 0.02 300)" }}
                >
                  Manually trigger the draw immediately. Use with caution!
                </p>
                <button
                  type="button"
                  onClick={handleTriggerDraw}
                  disabled={triggerDraw.isPending}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-cinzel text-sm font-bold transition-all"
                  style={{
                    background: "linear-gradient(135deg, #C61E1E, #7A0000)",
                    border: "1px solid #E84040",
                    color: "white",
                    boxShadow: "0 0 20px rgba(198,30,30,0.3)",
                  }}
                  data-ocid="admin.primary_button"
                >
                  {triggerDraw.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Execute Draw Now
                </button>
                <p className="text-xs" style={{ color: "#C61E1E" }}>
                  ⚠️ This will immediately pick a winner and distribute prizes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
