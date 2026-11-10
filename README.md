# StreamFlow OTT: Share & Earn, Rental Upgrade Prompt & Upgrade Bonus Pilot Prototype

> **Interactive High-Fidelity UX Prototype** designed and developed in accordance with the Product Requirements Document (`PRD Share & Earn, Rental Upgrade Prompt, Upgrade Bonus Test.md`).

---

## 🌟 Executive Overview & Design Rationale

As an experienced UX designer and product engineer, this prototype addresses the core tension in OTT monetization: **maximizing user lifetime value (LTV) without sacrificing retention or paywall integrity**.

The prototype models the 60-day pilot in the India market (INR `₹`), covering three interlocking growth levers:
1. **Feature A: Share & Earn**: Viewer-to-viewer viral acquisition incentivized with a **15% ad revenue share** on friend views and a flat **₹20 subscription bonus**, capped at ₹300/month with 30-day vesting and fraud controls.
2. **Feature B: Rental-Based Upgrade Prompt**: Real-time contextual trigger targeting basic users who rent $\ge 3$ movies in a calendar month ($₹447$ spent), presenting the math that an ad-free unlimited subscription is only $₹149$/month.
3. **Feature C: Upgrade Bonus A/B Test**: Evaluates whether an upfront incentive (**1 free new-release rental**, licensing capped at $₹60$) lifts upgrade conversion by $\ge 0.25$ percentage points to justify lifetime payback.

---

## 🎯 PRD Feature Mapping & UX Implementation

| PRD Section | Feature | Implementation in Prototype |
| :--- | :--- | :--- |
| **§ 5: Feature A** | **Share & Earn** | • Share modal on every title with unique referral parameter (`?ref=USR_RAHUL_882&title=brahmastra2`).<br>• WhatsApp simulation & link copying.<br>• Non-subscriber paywall intercept with referral preservation.<br>• Accrual logic: 15% ad revenue share (~₹18 per 3-mo active ad viewer) + ₹20 flat subscription bonus.<br>• ₹300 monthly cap progress tracker.<br>• 30-day vesting timeline with manual pilot approval workflow. |
| **§ 6: Feature B** | **Rental Upgrade Prompt** | • Trigger conditions verified: User on basic tier + $\ge 3$ calendar month rentals ($₹447$) outside library + no dismissal in 30 days.<br>• Dynamic copy: *"You've rented 3 movies this month for ₹447. Ad-free unlimited viewing is ₹149/month."*<br>• Visual spend comparison showing ₹298/mo net savings.<br>• 30-day cooldown on "Not now" click (`prompt_dismissed`).<br>• Completely suppressed for ad-free members. |
| **§ 7: Feature C** | **Upgrade Bonus A/B Test** | • Live A/B Arm switcher on the top simulation bar.<br>• **Arm 1 (Prompt only)**: standard spend comparison.<br>• **Arm 2 (Prompt + Bonus)**: Unlocks 1 Free New-Release Rental voucher (valid 7 days) upon upgrade, redeemable in the TVOD store. |
| **§ 8: Supporting** | **Annual Plan & Ad UX** | • Annual billing toggle: *"Pay for 10 months, get 12"* (₹1,490/yr vs ₹1,788/yr, saving 16.7%).<br>• Video player with simulated pre-roll ad break (15s with skip countdown) generating ad ARPU. |
| **§ 9 & 10** | **Pilot Dashboard & Calculations** | • Executive pilot metrics dashboard displaying all 5 PRD metrics.<br>• Real-time financial modeling for Scenarios 1–10 (Gross revenue, rewards ratio target < 15%, LTV ₹1,362.50 vs ₹1,816.67).<br>• Power analysis sample size check (6,700 users/arm for 1pp lift). |
| **§ 5 & 6** | **Telemetry Tracking** | • Live floating telemetry event stream logging: `link_created`, `link_opened`, `paywall_shown`, `subscription_started`, `subscription_completed`, `ad_view_completed`, `reward_accrued`, `reward_vested`, `prompt_shown`, `prompt_clicked`, `prompt_dismissed`, `upgrade_completed`. |

---

## 🎭 Interactive User Personas (Top Simulation Bar)

You can switch personas at any point using the top simulation bar:

1. **Rahul Sharma (`USR_RAHUL_882`) - Basic Ad-Tier User (The Target Sharer & Upgrader)**
   - Has rented **3 movies this month** ($₹447$ spent on *Oppenheimer*, *Spider-Man*, *Mission Impossible*).
   - Eligible for the **Feature B Rental Upgrade Prompt**.
   - Active referrer: has earned $₹140$ this month towards his $₹300$ monthly cap, with 4 friends in vesting pipelines.
2. **Priya Verma (`USR_PRIYA_912`) - Referred Friend (Non-Subscriber)**
   - Simulates clicking Rahul's referral link.
   - Hits the subscription paywall with Rahul's referral attribution pre-bound before video playback.
   - Completing OTP signup and payment credits $₹20$ to Rahul's pending vesting wallet.
3. **Ananya Iyer (`USR_ANANYA_304`) - Ad-Free Premium Subscriber**
   - Subscribed to the Annual Plan (Saved ₹298 via "Pay 10 mo get 12").
   - Enjoys instant zero-ad 4K playback.
   - **Never sees rental upgrade prompts** (adheres to PRD rule: *Ad-free users never see the prompt*).
4. **Product Lead / Executive Mode (`PRD Metrics & Simulator`)**
   - Evaluates pilot health, reward cost ratio (<15% guardrail), and Scenario 1–10 financial models.

---

## 🚀 How to Run the Prototype

The prototype is 100% self-contained with **zero heavy dependencies or installation requirements**.

### Option 1: Direct Browser Launch
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox):
```powershell
# Open directly in Windows default browser
Start-Process index.html
```

### Option 2: Local HTTP Server (Python)
```powershell
python -m http.server 3000
# Then open http://localhost:3000 in your browser
```

---

## 🧪 Guided Step-by-Step Test Scenarios

### Test 1: Feature B & C Rental Upgrade Prompt
1. Set the active persona to **Rahul** on the top bar.
2. Observe the contextual banner or click **"⚡ Test Feature B Prompt"**.
3. Toggle between **Arm 1 (Prompt only)** and **Arm 2 (Prompt + Bonus Rental)** on the top bar.
4. Note the dynamic spend calculation: $₹447$ spent on 3 rentals vs $₹149$/mo ad-free.
5. In Arm 2, click **"Upgrade to Ad-Free for ₹149"** $\rightarrow$ complete subscription.
6. Notice the confetti, user tier upgrade to Ad-Free VIP, and the **1 Free Rental Voucher** credited to the TVOD store!

### Test 2: Feature A Share & Earn Flow
1. As Rahul, click **"🔗 Share & Earn ₹₹₹"** on any title (e.g. *Brahmāstra: Part Two*).
2. Inspect the tracked referral URL (`?ref=USR_RAHUL_882`), reward breakdown (15% ad share + ₹20 sub bonus), and pilot guardrails.
3. Switch persona to **Priya (Referred Friend)**.
4. Try to click **"Watch Full Movie"** $\rightarrow$ Paywall intercepts playback.
5. Complete payment $\rightarrow$ Switch back to Rahul and open **"Share & Earn Wallet"**:
   - $₹20$ bonus credited to Rahul's pending vesting wallet with a 30-day countdown timer!
6. Click **"Simulate Vesting"** to test 30-day vesting transition to available balance.

### Test 3: Executive Metrics & Unit Economics Modeling
1. Click **"📊 PRD Metrics & Simulator"** on the top bar.
2. Review the 5 primary pilot metrics and their targets.
3. Compare **Scenario 3 (10 shares revenue ratio: 9.9%)** against the **15% stopping rule**.
4. Review the **Scenario 7 lifetime ROI calculation** ($+₹21,250$ net gain in favor of the bonus) and **Scenario 9.9 power analysis** ($6,700$ users per arm requirement).

---

## 🎨 Technology Stack
- **Architecture**: Single Page Application (SPA) with reactive component rendering
- **Styling**: Tailwind CSS CDN + custom cinematic dark mode design system (`styles.css`)
- **Typography**: Plus Jakarta Sans & Outfit
- **Telemetry**: Event bus dispatcher streaming PRD tracking events to the live HUD
- **Micro-interactions**: Canvas Confetti, glassmorphism modals, slide-over wallet drawer, simulated video player
