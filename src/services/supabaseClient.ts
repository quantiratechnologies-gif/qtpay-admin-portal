import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { PlatformTransaction } from "../types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://sb-qpay-saudi.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_fiRLd5ddXPUH_onp8AH86w_JQoVgAmH";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  try {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
      return supabaseInstance;
    }
  } catch (err) {
    console.warn("[Supabase] Admin client initialization notice:", err);
  }
  return null;
}

// Subscribe to all platform transactions in real time
export function subscribeToPlatformTransactions(
  onNewTransaction: (tx: PlatformTransaction) => void
): () => void {
  const supabase = getSupabase();
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel("public:transactions:admin_stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transactions" },
        (payload) => {
          const row = payload.new as any;
          if (row) {
            const amount = Number(row.amount || 0);
            const mdr = Number((amount * 0.012).toFixed(2));
            const tx: PlatformTransaction = {
              id: row.id || `tx-${Date.now()}`,
              orderRef: row.order_ref || `SAR-${Date.now().toString().slice(-6)}`,
              senderName: row.sender_name || "Customer (mada)",
              receiverName: row.receiver_name || "Merchant Store",
              amount: amount,
              vatAmount: Number(row.vat_amount || (amount * 0.15).toFixed(2)),
              netAmount: Number(row.net_amount || (amount * 0.85).toFixed(2)),
              platformMdrSar: mdr,
              paymentMethod: (row.payment_method || "mada") as any,
              channel: row.category?.includes("POS") ? "pos_softpos" : "consumer_p2p",
              status: row.status === "refunded" ? "refunded" : "settled",
              terminalId: row.terminal_id || "TRM-984210",
              sarieUtr: row.order_ref || `SARIE${Date.now()}`,
              madaRrn: `RRN-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
              cardLast4: row.card_last4 || "9082",
              timestamp: row.created_at || new Date().toISOString(),
              zatcaQrCode: row.zatca_qr_code,
            };
            onNewTransaction(tx);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn("[Supabase] Realtime stream subscription notice:", err);
    return () => {};
  }
}
