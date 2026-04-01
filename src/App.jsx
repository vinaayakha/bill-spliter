import { useState, useMemo } from "react";

const ITEMS = [
  { id: 1, name: "Garlic Bread Cheesy", qty: 1, price: 349, total: 349, isPitcher: false },
  { id: 2, name: "Hefeweizen [m] (Pitcher 1.5L)", qty: 1, price: 1449, total: 1449, isPitcher: true },
  { id: 3, name: "Whisky Sour (Glass)", qty: 1, price: 699, total: 699, isPitcher: false },
  { id: 4, name: "Mie Goreng (Grilled Chicken)", qty: 1, price: 628, total: 628, isPitcher: false },
  { id: 5, name: "Crispy Corn", qty: 1, price: 349, total: 349, isPitcher: false },
  { id: 6, name: "New England IPA (500ml Mug)", qty: 3, price: 549, total: 1647, isPitcher: true },
  { id: 7, name: "New England IPA (Pitcher 1.5L)", qty: 2, price: 1449, total: 2898, isPitcher: true },
  { id: 8, name: "Fresh Lime", qty: 1, price: 129, total: 129, isPitcher: false },
  { id: 9, name: "Virgin Mojito", qty: 1, price: 299, total: 299, isPitcher: false },
  { id: 10, name: "Soda", qty: 2, price: 69, total: 138, isPitcher: false },
  { id: 11, name: "Hefeweizen [m] (500ml Mug)", qty: 1, price: 549, total: 549, isPitcher: false },
  { id: 12, name: "Korean Chilli Chicken", qty: 1, price: 599, total: 599, isPitcher: false },
  { id: 13, name: "Mie Goreng (Veg)", qty: 2, price: 499, total: 998, isPitcher: true },
  { id: 14, name: "Mushroom Add On", qty: 1, price: 79, total: 79, isPitcher: false },
];

const SUBTOTAL = 10810;
const SGST = 89.20;
const CGST = 89.20;
const ROUND_OFF = -0.40;
const BILL_TOTAL = 10988;
const DISCOUNT = 969;
const GRAND_TOTAL = 10019;

const PARTICIPANTS = [
  "Vinayak", "Prasun", "Vinamara", "Shashank",
  "Nikhil", "Priyanka", "Nitesh", "Awadh", "Sohinee","Kailash","Vishal"
];

const COLORS = [
  "#1a73e8", "#e8453c", "#f09300", "#0b8043",
  "#7b1fa2", "#c2185b", "#00838f", "#558b2f", "#d84315","#5e35b1", "#039be5",
];

const FRACTION_OPTIONS = [
  { label: "Equal", value: "equal" },
  { label: "\u2153", value: "1/3" },
  { label: "\u00bd", value: "1/2" },
  { label: "\u2154", value: "2/3" },
  { label: "Full", value: "full" },
];

function colLetter(i) {
  return String.fromCharCode(65 + i);
}

export default function App() {
  const [tab, setTab] = useState("split");
  const [selections, setSelections] = useState(() => {
    const init = {};
    PARTICIPANTS.forEach(p => { init[p] = {}; });
    return init;
  });

  const toggleItem = (person, itemId, item) => {
    setSelections(prev => {
      const next = { ...prev, [person]: { ...prev[person] } };
      if (next[person][itemId]) {
        delete next[person][itemId];
      } else {
        next[person][itemId] = "equal";
      }
      return next;
    });
  };

  const setFraction = (person, itemId, fraction) => {
    setSelections(prev => {
      const next = { ...prev, [person]: { ...prev[person] } };
      next[person][itemId] = fraction;
      return next;
    });
  };

  const getSharers = (itemId) => {
    return PARTICIPANTS.filter(p => selections[p]?.[itemId]);
  };

  const getPersonShare = (person, item) => {
    const frac = selections[person]?.[item.id];
    if (!frac) return 0;
    if (item.isPitcher && frac !== "equal") {
      if (frac === "1/3") return item.total / 3;
      if (frac === "1/2") return item.total / 2;
      if (frac === "2/3") return (item.total * 2) / 3;
      if (frac === "full") return item.total;
    }
    const sharers = getSharers(item.id);
    return sharers.length > 0 ? item.total / sharers.length : 0;
  };

  const contributions = useMemo(() => {
    const contrib = {};
    PARTICIPANTS.forEach(p => { contrib[p] = 0; });
    ITEMS.forEach(item => {
      PARTICIPANTS.forEach(p => {
        contrib[p] += getPersonShare(p, item);
      });
    });
    // Scale each person's share proportionally so totals sum to GRAND_TOTAL (after discount)
    const totalSelected = Object.values(contrib).reduce((a, b) => a + b, 0);
    if (totalSelected > 0) {
      const scaleFactor = GRAND_TOTAL / totalSelected;
      PARTICIPANTS.forEach(p => {
        contrib[p] = contrib[p] * scaleFactor;
      });
    }
    return contrib;
  }, [selections]);

  const totalAssigned = Object.values(contributions).reduce((a, b) => a + b, 0);
  const unassigned = GRAND_TOTAL - totalAssigned;

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      background: "#F8F9FA",
      color: "#202124",
      minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #dadce0; border-radius: 3px; }
        button { font-family: inherit; }
        select { font-family: inherit; }
      `}</style>

      {/* Top Bar */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #dadce0",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}>
        <div style={{
          width: "32px", height: "32px", borderRadius: "4px",
          background: "linear-gradient(135deg, #34a853, #0f9d58)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="16" height="16" rx="2" stroke="#fff" strokeWidth="1.5" fill="none"/>
            <line x1="1" y1="7" x2="17" y2="7" stroke="#fff" strokeWidth="1"/>
            <line x1="1" y1="12" x2="17" y2="12" stroke="#fff" strokeWidth="1"/>
            <line x1="7" y1="1" x2="7" y2="17" stroke="#fff" strokeWidth="1"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "#202124" }}>Bill Split — 27 Mar 2026</div>
          <div style={{ fontSize: "11px", color: "#5f6368" }}>Bill #12717 · Paid ₹{GRAND_TOTAL.toLocaleString()} <span style={{color:"#c5221f"}}>(₹{DISCOUNT} discount)</span></div>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #dadce0",
        display: "flex",
        padding: "0 12px",
      }}>
        {[
          { key: "bill", label: "Receipt" },
          { key: "split", label: "Split Sheet" },
          { key: "summary", label: "Summary" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "10px 20px",
            fontSize: "13px",
            fontWeight: tab === t.key ? 600 : 400,
            color: tab === t.key ? "#1a73e8" : "#5f6368",
            background: "none",
            border: "none",
            borderBottom: tab === t.key ? "3px solid #1a73e8" : "3px solid transparent",
            cursor: "pointer",
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ═══════ BILL TAB ═══════ */}
      {tab === "bill" && (
        <div style={{ padding: "20px", maxWidth: "460px", margin: "0 auto" }}>
          <div style={{
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #dadce0",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}>
            <div style={{
              padding: "20px",
              textAlign: "center",
              borderBottom: "1px dashed #dadce0",
            }}>
              <div style={{ fontSize: "11px", color: "#5f6368" }}>GSTIN: 29AADCB0331P1</div>
              <div style={{ fontSize: "11px", color: "#5f6368" }}>FSSAI Lic No. 11221334000882</div>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#202124" }}>Name: binamra (M: 9611560780)</div>
              <div style={{
                marginTop: "10px", display: "flex", justifyContent: "space-between",
                fontSize: "12px", color: "#5f6368",
              }}>
                <span>Date: 27/03/26 23:42</span>
                <span>Dine In: 38</span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: "12px", color: "#5f6368",
              }}>
                <span>Cashier: Kiran</span>
                <span>Bill No.: 12717</span>
              </div>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dadce0" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#5f6368" }}>Item</th>
                  <th style={{ padding: "8px 8px", textAlign: "center", fontWeight: 600, color: "#5f6368", width: "36px" }}>Qty</th>
                  <th style={{ padding: "8px 8px", textAlign: "right", fontWeight: 600, color: "#5f6368", width: "64px" }}>Price</th>
                  <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: "#5f6368", width: "72px" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {ITEMS.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f1f3f4" }}>
                    <td style={{ padding: "8px 12px", color: "#202124" }}>{item.name}</td>
                    <td style={{ padding: "8px 8px", textAlign: "center", color: "#5f6368" }}>{item.qty}</td>
                    <td style={{ padding: "8px 8px", textAlign: "right", color: "#5f6368", fontFamily: "'Roboto Mono', monospace", fontSize: "12px" }}>{item.price}</td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 500, fontFamily: "'Roboto Mono', monospace", fontSize: "12px" }}>{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: "2px solid #dadce0", padding: "12px" }}>
              {[
                { label: "Sub Total", val: SUBTOTAL.toLocaleString() },
                { label: "SGST 2.5%", val: SGST.toFixed(2) },
                { label: "CGST 2.5%", val: CGST.toFixed(2) },
                { label: "Round off", val: ROUND_OFF.toFixed(2) },
              ].map(r => (
                <div key={r.label} style={{
                  display: "flex", justifyContent: "space-between", padding: "3px 0",
                  fontSize: "12px", color: "#5f6368", fontFamily: "'Roboto Mono', monospace",
                }}>
                  <span>{r.label}</span><span>{r.val}</span>
                </div>
              ))}
              <div style={{
                display: "flex", justifyContent: "space-between", padding: "3px 0",
                fontSize: "12px", color: "#5f6368", fontFamily: "'Roboto Mono', monospace",
                borderTop: "1px solid #dadce0", marginTop: "4px", paddingTop: "6px",
              }}>
                <span>Bill Total</span><span>₹{BILL_TOTAL.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", padding: "3px 0",
                fontSize: "12px", color: "#137333", fontFamily: "'Roboto Mono', monospace",
                fontWeight: 600,
              }}>
                <span>Discount</span><span>-₹{DISCOUNT.toLocaleString()}</span>
              </div>
              <div style={{
                display: "flex", justifyContent: "space-between", padding: "10px 0 4px",
                fontSize: "18px", fontWeight: 700, color: "#202124",
                borderTop: "2px solid #202124", marginTop: "8px",
                fontFamily: "'Roboto Mono', monospace",
              }}>
                <span>Amount Paid</span><span>₹{GRAND_TOTAL.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ SPLIT SHEET TAB ═══════ */}
      {tab === "split" && (
        <div style={{ overflowX: "auto", padding: "0" }}>
          <table style={{
            borderCollapse: "collapse", fontSize: "12px",
            minWidth: "100%", background: "#fff",
          }}>
            <thead>
              <tr>
                <th style={{
                  position: "sticky", left: 0, zIndex: 12,
                  background: "#f8f9fa", width: "32px", minWidth: "32px",
                  borderRight: "1px solid #dadce0", borderBottom: "1px solid #dadce0",
                }} />
                <th style={{
                  position: "sticky", left: "32px", zIndex: 12,
                  background: "#f8f9fa",
                  borderRight: "2px solid #c0c0c0", borderBottom: "1px solid #dadce0",
                  padding: "4px 8px", color: "#5f6368", fontWeight: 400,
                  fontSize: "11px", textAlign: "center", minWidth: "180px",
                }}>A</th>
                <th style={{
                  background: "#f8f9fa",
                  borderRight: "1px solid #dadce0", borderBottom: "1px solid #dadce0",
                  padding: "4px 8px", color: "#5f6368", fontWeight: 400,
                  fontSize: "11px", textAlign: "center", minWidth: "72px",
                }}>B</th>
                {PARTICIPANTS.map((_, i) => (
                  <th key={i} style={{
                    background: "#f8f9fa",
                    borderRight: "1px solid #dadce0", borderBottom: "1px solid #dadce0",
                    padding: "4px 8px", color: "#5f6368", fontWeight: 400,
                    fontSize: "11px", textAlign: "center", minWidth: "90px",
                  }}>{colLetter(i + 2)}</th>
                ))}
              </tr>
              <tr style={{ background: "#e8f0fe" }}>
                <td style={{
                  position: "sticky", left: 0, zIndex: 11,
                  background: "#e8eaed", textAlign: "center",
                  borderRight: "1px solid #dadce0", borderBottom: "2px solid #c0c0c0",
                  color: "#5f6368", fontSize: "11px", padding: "2px",
                }}>1</td>
                <td style={{
                  position: "sticky", left: "32px", zIndex: 11,
                  background: "#e8f0fe",
                  borderRight: "2px solid #c0c0c0", borderBottom: "2px solid #c0c0c0",
                  padding: "8px 10px", fontWeight: 700, color: "#1a73e8",
                }}>Item</td>
                <td style={{
                  background: "#e8f0fe",
                  borderRight: "1px solid #dadce0", borderBottom: "2px solid #c0c0c0",
                  padding: "8px 10px", fontWeight: 700, color: "#1a73e8", textAlign: "right",
                }}>Amount</td>
                {PARTICIPANTS.map((p, i) => (
                  <td key={p} style={{
                    background: "#e8f0fe",
                    borderRight: "1px solid #dadce0", borderBottom: "2px solid #c0c0c0",
                    padding: "8px 6px", fontWeight: 700, textAlign: "center", whiteSpace: "nowrap",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      <span style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: COLORS[i], display: "inline-block",
                      }} />
                      <span style={{ color: COLORS[i], fontSize: "12px" }}>{p}</span>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((item, ri) => {
                const rowNum = ri + 2;
                return (
                  <tr key={item.id} style={{ background: ri % 2 === 0 ? "#fff" : "#f8f9fb" }}>
                    <td style={{
                      position: "sticky", left: 0, zIndex: 5,
                      background: "#f8f9fa", textAlign: "center",
                      borderRight: "1px solid #dadce0", borderBottom: "1px solid #efefef",
                      color: "#5f6368", fontSize: "11px", padding: "2px",
                    }}>{rowNum}</td>
                    <td style={{
                      position: "sticky", left: "32px", zIndex: 5,
                      background: ri % 2 === 0 ? "#fff" : "#f8f9fb",
                      borderRight: "2px solid #e0e0e0", borderBottom: "1px solid #efefef",
                      padding: "10px 10px", fontWeight: 500, whiteSpace: "nowrap", color: "#202124",
                    }}>
                      {item.name}
                      {item.isPitcher && (
                        <span style={{
                          marginLeft: "6px", fontSize: "9px",
                          background: "#fce8e6", color: "#c5221f",
                          padding: "1px 5px", borderRadius: "3px", fontWeight: 600,
                        }}>PITCHER</span>
                      )}
                    </td>
                    <td style={{
                      borderRight: "1px solid #dadce0", borderBottom: "1px solid #efefef",
                      padding: "10px 10px", textAlign: "right",
                      fontFamily: "'Roboto Mono', monospace",
                      fontSize: "12px", color: "#202124", fontWeight: 500,
                    }}>₹{item.total.toLocaleString()}</td>
                    {PARTICIPANTS.map((p, pi) => {
                      const sel = selections[p]?.[item.id];
                      const share = getPersonShare(p, item);
                      return (
                        <td key={p} style={{
                          borderRight: "1px solid #efefef", borderBottom: "1px solid #efefef",
                          padding: "4px", textAlign: "center",
                          background: sel ? `${COLORS[pi]}0D` : (ri % 2 === 0 ? "#fff" : "#f8f9fb"),
                          transition: "background 0.15s",
                        }}>
                          <div style={{
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: "2px",
                          }}>
                            <button
                              onClick={() => toggleItem(p, item.id, item)}
                              style={{
                                width: "22px", height: "22px", borderRadius: "4px",
                                border: sel ? `2px solid ${COLORS[pi]}` : "2px solid #c0c0c0",
                                background: sel ? COLORS[pi] : "#fff",
                                cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.1s",
                              }}
                            >
                              {sel && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </button>
                            {sel && item.isPitcher && (
                              <select
                                value={sel}
                                onChange={e => setFraction(p, item.id, e.target.value)}
                                style={{
                                  fontSize: "10px", padding: "1px 2px",
                                  border: `1px solid ${COLORS[pi]}66`,
                                  borderRadius: "3px", background: "#fff",
                                  color: COLORS[pi], fontWeight: 600,
                                  cursor: "pointer", outline: "none", width: "62px",
                                }}
                              >
                                {FRACTION_OPTIONS.map(f => (
                                  <option key={f.value} value={f.value}>{f.label}</option>
                                ))}
                              </select>
                            )}
                            {sel && (
                              <span style={{
                                fontSize: "10px",
                                fontFamily: "'Roboto Mono', monospace",
                                color: COLORS[pi], fontWeight: 600,
                              }}>₹{Math.round(share)}</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Separator */}
              <tr>
                <td style={{
                  position: "sticky", left: 0, zIndex: 5,
                  background: "#f8f9fa", textAlign: "center",
                  borderRight: "1px solid #dadce0",
                  color: "#5f6368", fontSize: "11px", padding: "2px",
                }}>{ITEMS.length + 2}</td>
                <td colSpan={2 + PARTICIPANTS.length} style={{
                  borderTop: "2px solid #c0c0c0", borderBottom: "2px solid #c0c0c0",
                  background: "#f8f9fa", height: "4px",
                }} />
              </tr>

              {/* Tax & Discount row */}
              <tr style={{ background: "#fef7e0" }}>
                <td style={{
                  position: "sticky", left: 0, zIndex: 5,
                  background: "#f8f9fa", textAlign: "center",
                  borderRight: "1px solid #dadce0",
                  color: "#5f6368", fontSize: "11px", padding: "2px",
                }}>{ITEMS.length + 3}</td>
                <td style={{
                  position: "sticky", left: "32px", zIndex: 5,
                  background: "#fef7e0",
                  borderRight: "2px solid #e0e0e0",
                  padding: "8px 10px", fontWeight: 600, color: "#e37400", fontSize: "12px",
                }}>Tax + Discount Applied</td>
                <td style={{
                  padding: "8px 10px", textAlign: "right",
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "12px", fontWeight: 600, color: "#e37400",
                }}>-₹{DISCOUNT}</td>
                <td colSpan={PARTICIPANTS.length} style={{
                  padding: "8px 10px", fontSize: "11px",
                  color: "#b06000", textAlign: "center",
                }}>Tax & discount scaled proportionally per share</td>
              </tr>

              {/* Total row */}
              <tr style={{ background: "#e6f4ea" }}>
                <td style={{
                  position: "sticky", left: 0, zIndex: 5,
                  background: "#f8f9fa", textAlign: "center",
                  borderRight: "1px solid #dadce0",
                  color: "#5f6368", fontSize: "11px", padding: "2px",
                }}>{ITEMS.length + 4}</td>
                <td style={{
                  position: "sticky", left: "32px", zIndex: 5,
                  background: "#e6f4ea",
                  borderRight: "2px solid #c0c0c0",
                  padding: "10px 10px", fontWeight: 700, color: "#137333", fontSize: "13px",
                }}>TOTAL SHARE</td>
                <td style={{
                  padding: "10px 10px", textAlign: "right",
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "14px", fontWeight: 700, color: "#137333",
                  borderRight: "1px solid #dadce0",
                }}>₹{GRAND_TOTAL.toLocaleString()}</td>
                {PARTICIPANTS.map((p, i) => (
                  <td key={p} style={{
                    padding: "10px 6px", textAlign: "center",
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "14px", fontWeight: 700,
                    color: contributions[p] > 0 ? "#137333" : "#bbb",
                    borderRight: "1px solid #c8e6c9",
                  }}>₹{Math.round(contributions[p]).toLocaleString()}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ═══════ SUMMARY TAB ═══════ */}
      {tab === "summary" && (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
          {Math.abs(unassigned) > 1 ? (
            <div style={{
              padding: "12px 16px", borderRadius: "8px", marginBottom: "16px",
              background: "#fce8e6", border: "1px solid #f5c6cb",
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "13px", color: "#c5221f",
            }}>
              <span style={{ fontSize: "18px" }}>⚠️</span>
              ₹{Math.round(Math.abs(unassigned)).toLocaleString()} still unassigned — assign all items in the Split Sheet tab
            </div>
          ) : (
            <div style={{
              padding: "12px 16px", borderRadius: "8px", marginBottom: "16px",
              background: "#e6f4ea", border: "1px solid #ceead6",
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "13px", color: "#137333",
            }}>
              <span style={{ fontSize: "18px" }}>✅</span>
              Bill fully split!
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {PARTICIPANTS.map((p, i) => {
              const amt = contributions[p];
              const itemsCount = Object.keys(selections[p] || {}).length;
              return (
                <div key={p} style={{
                  background: "#fff",
                  border: "1px solid #dadce0",
                  borderRadius: "10px",
                  padding: "16px",
                  borderLeft: `4px solid ${COLORS[i]}`,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: COLORS[i],
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: "13px", fontWeight: 700,
                    }}>{p[0]}</div>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#202124" }}>{p}</span>
                  </div>
                  <div style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: "24px", fontWeight: 700,
                    color: amt > 0 ? "#202124" : "#bbb",
                  }}>₹{Math.round(amt).toLocaleString()}</div>
                  <div style={{ fontSize: "11px", color: "#5f6368", marginTop: "4px" }}>
                    {itemsCount} item{itemsCount !== 1 ? "s" : ""} selected
                  </div>
                  {itemsCount > 0 && (
                    <div style={{ marginTop: "10px", borderTop: "1px solid #f1f3f4", paddingTop: "8px" }}>
                      {ITEMS.filter(item => selections[p]?.[item.id]).map(item => {
                        const share = getPersonShare(p, item);
                        const frac = selections[p][item.id];
                        return (
                          <div key={item.id} style={{
                            display: "flex", justifyContent: "space-between",
                            fontSize: "11px", padding: "2px 0", color: "#5f6368",
                          }}>
                            <span style={{ maxWidth: "65%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.name}
                              {item.isPitcher && frac !== "equal" && (
                                <span style={{ color: COLORS[i], fontWeight: 600, marginLeft: "4px" }}>({frac})</span>
                              )}
                              {!item.isPitcher && getSharers(item.id).length > 1 && (
                                <span style={{ color: "#999", marginLeft: "4px" }}>÷{getSharers(item.id).length}</span>
                              )}
                            </span>
                            <span style={{
                              fontFamily: "'Roboto Mono', monospace",
                              fontWeight: 500, color: "#202124",
                            }}>₹{Math.round(share)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: "16px", background: "#fff",
            border: "1px solid #dadce0", borderRadius: "10px",
            padding: "16px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}>
            <div>
              <div style={{ fontSize: "12px", color: "#5f6368", textTransform: "uppercase", letterSpacing: "0.5px" }}>Amount Paid</div>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "22px", fontWeight: 700 }}>₹{GRAND_TOTAL.toLocaleString()}</div>
              <div style={{ fontSize: "10px", color: "#137333", marginTop: "2px" }}>After ₹{DISCOUNT} discount</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#5f6368", textTransform: "uppercase", letterSpacing: "0.5px" }}>Assigned</div>
              <div style={{
                fontFamily: "'Roboto Mono', monospace", fontSize: "22px", fontWeight: 700,
                color: Math.abs(unassigned) <= 1 ? "#137333" : "#e37400",
              }}>₹{Math.round(totalAssigned).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}