import type { ServiceSlug } from "@/content/services";

export type FAQEntry = {
  question: string;
  answer: string;
};

export const serviceFaqs: Record<ServiceSlug, FAQEntry[]> = {
  roofing: [
    {
      question: "How long does an asphalt roof last in New Jersey?",
      answer:
        "A properly installed architectural asphalt roof in North Jersey typically performs for 25 to 30 years. Lifespan depends on ventilation, attic conditions, and how often the roof gets hit with ice, wind, or storm debris.",
    },
    {
      question: "What are the warning signs I need a new roof?",
      answer:
        "Curling or cracked shingles, granules collecting in gutters, ceiling stains, daylight in the attic, repeated leaks, sagging rooflines, or a roof past 20 years are all reasons to have it inspected before another season passes.",
    },
    {
      question: "How long does a roof replacement take?",
      answer:
        "Most asphalt roof replacements are completed in one day once material and weather windows are confirmed. Larger roofs, complex framing, or decking repairs can extend the install to two or three days.",
    },
    {
      question: "Do you help with insurance claims for storm damage?",
      answer:
        "Yes. We document the damage, provide the scope and photos your adjuster needs, and coordinate the replacement once the claim is approved. We don't negotiate on your behalf, but we make sure nothing about the roof gets missed.",
    },
    {
      question: "What manufacturers do you install?",
      answer:
        "Our roofing system options center on GAF shingles, with skylights and sun tunnels integrated when daylight is part of the project. We are a GAF Certified installer, and we register every roof for its manufacturer warranty.",
    },
    {
      question: "Do you replace decking and improve ventilation when needed?",
      answer:
        "Yes. Decking is inspected after tear-off and replaced where soft spots or rot are found. Intake and exhaust ventilation are reviewed on every roof so the attic stays balanced and shingles age the way they're designed to.",
    },
    {
      question: "How do you protect landscaping and clean up after the job?",
      answer:
        "Crews tarp landscaping, protect access paths, and use catch systems around the perimeter. At closeout, debris is hauled out and the property is swept magnetically for nails before the site is handed back.",
    },
    {
      question: "What does a roof replacement cost in NJ?",
      answer:
        "Roof pricing depends on size, pitch, layers, decking condition, ventilation work, and the shingle system you pick. We provide an itemized written estimate after the on-site visit so the number is grounded in your actual roof, not a square-foot guess.",
    },
    {
      question: "Do you offer financing for roofing projects?",
      answer:
        "Yes. Financing is available so a roof replacement doesn't have to come out of one paycheck. Terms and details are reviewed during the estimate, and the financing section of the site has more on how it works.",
    },
    {
      question: "What about permits and inspections?",
      answer:
        "We handle the municipal permit and any required inspections as part of the project. Work is performed under New Jersey Home Improvement Contractor License #13VH13821400.",
    },
  ],
  windows: [
    {
      question: "What makes a replacement window energy-efficient?",
      answer:
        "ENERGY STAR-rated glass packages — multiple panes, Low-E coatings, argon fills, and warm-edge spacers — plus an insulated frame all reduce heat transfer. The install matters just as much: flashing, perimeter insulation, and seals decide whether the rated performance shows up in your home.",
    },
    {
      question: "What's the difference between full-frame and insert (pocket) replacement?",
      answer:
        "Full-frame replacement takes the window out to the rough opening so flashing, wraps, and sills can be corrected. Insert replacement sets a new sash and frame into the existing frame when it's still sound. We choose per opening based on what we see.",
    },
    {
      question: "Which window brands do you install?",
      answer:
        "We're a ProVia authorized installer and spec ProVia's Endure, Aspect, and ecoLite lines with ENERGY STAR-rated glass packages when a project calls for a different fit, finish, or budget.",
    },
    {
      question: "Can replacement windows be installed in winter?",
      answer:
        "Yes. Crews work one or two openings at a time so the home isn't open longer than necessary, and the perimeter is sealed before moving to the next window. Most homes don't notice a temperature swing during the install.",
    },
    {
      question: "How much do new windows quiet the house?",
      answer:
        "Dual-pane Low-E units with proper installation noticeably cut traffic and exterior noise, especially compared with single-pane originals. For exposures near busy roads we can spec laminated or acoustic-rated glass for an additional reduction.",
    },
    {
      question: "Do you work on homes in historic districts?",
      answer:
        "Yes. We coordinate with local historic commissions when needed and select frame profiles, grids, and finishes that meet district guidelines while still upgrading the glass package and seal.",
    },
    {
      question: "What glass options should I look at?",
      answer:
        "For most North Jersey homes, dual-pane Low-E with argon is the baseline. Triple-pane, laminated security glass, tempered safety glass, and obscure or decorative patterns are options for specific rooms and exposures.",
    },
    {
      question: "How long does a window project take?",
      answer:
        "A typical whole-home replacement runs one to three days depending on count and scope. Single window replacements are usually completed in a few hours. The schedule is locked in writing before we start.",
    },
    {
      question: "Do you remove and dispose of the old windows?",
      answer:
        "Yes. Old units are removed, packed, and hauled off the same day. The work area is swept and any interior protection is taken down before the crew leaves.",
    },
    {
      question: "Do new windows help when it's time to sell?",
      answer:
        "Buyers notice modern, efficient windows in a walkthrough and a home inspection. We won't quote a specific resale figure, but updated windows tend to support a stronger appraisal and listing impression.",
    },
    {
      question: "Do you offer financing for window projects?",
      answer:
        "Yes. Financing is available through our partner so a full-home window replacement doesn't have to come out of one paycheck. Options are reviewed during the estimate.",
    },
  ],
  siding: [
    {
      question: "What siding materials do you install?",
      answer:
        "Core options are ProVia CedarMax insulated vinyl and premium vinyl siding lines, with engineered wood and shake profiles available for accent walls, gables, and dormers.",
    },
    {
      question: "How long does new siding last?",
      answer:
        "Properly installed vinyl and insulated vinyl typically perform for 30 to 50 years. Lifespan depends on the wrap and flashing beneath the panels and how trim, soffit, and fascia were detailed at installation.",
    },
    {
      question: "Can you install siding over the existing siding?",
      answer:
        "We generally recommend tearing off the old cladding so the wall can be inspected for rot or water entry and the wrap and flashing corrected. Installing over old siding can hide problems that later cost more to fix.",
    },
    {
      question: "Do you replace house wrap and flashing as part of the project?",
      answer:
        "Yes. Drainable house wrap and corrected flashing around windows, doors, and penetrations are part of the scope. That layer is what actually keeps water out of the wall — the siding is the finish.",
    },
    {
      question: "What is ProVia CedarMax?",
      answer:
        "CedarMax is ProVia's insulated vinyl siding system — a vinyl panel laminated to contoured foam backing. The foam adds R-value, panel rigidity, and a deeper, more uniform shadow line on the wall.",
    },
    {
      question: "Can you coordinate soffit, fascia, and gutters?",
      answer:
        "Yes. Soffit, fascia, frieze, and corner trim are typically replaced alongside siding so the envelope ages together. New gutters can be sequenced after the fascia is rebuilt for the cleanest fit.",
    },
    {
      question: "How long does a siding job take?",
      answer:
        "A typical full-house siding replacement runs roughly one to two weeks depending on home size, weather, and how much trim, soffit, and fascia is involved. The schedule is locked in writing before we start.",
    },
    {
      question: "Can siding be installed in cold or wet weather?",
      answer:
        "Crews work through most of the year. Hard rain and severe cold pause exterior work — we won't leave a wall opened up in conditions that put the home or installation at risk.",
    },
    {
      question: "Will new siding help with pests?",
      answer:
        "A tight new envelope with corrected flashing and trim closes the gaps that mice, wasps, and carpenter bees exploit. Severe infestations should be treated by a pest professional before re-cladding.",
    },
    {
      question: "How do you match colors to the rest of the house?",
      answer:
        "We review profile and color samples on-site against the roof, brick or stone, and trim package. The goal is for the elevations to read as one project, not a panel that fights the roof.",
    },
    {
      question: "Do new siding systems carry a warranty?",
      answer:
        "Yes. The manufacturer covers the panels per their published terms, and our workmanship is covered separately. Specific warranty terms are reviewed in writing with the estimate.",
    },
    {
      question: "What about permits and inspections?",
      answer:
        "We handle the municipal permit and any required inspections as part of the project. Work is performed under New Jersey Home Improvement Contractor License #13VH13821400.",
    },
  ],
  "soffit-fascia": [
    {
      question: "What's the difference between soffit and fascia?",
      answer:
        "Fascia is the vertical board running along the roof edge that the gutters hang from; soffit is the horizontal underside that closes in the eave between the fascia and the wall. Together they finish the roofline, protect the rafter tails, and — when the soffit is vented — feed fresh air into the attic.",
    },
    {
      question: "How do I know if my soffit or fascia needs to be replaced?",
      answer:
        "Peeling paint, soft or crumbling board, water staining, sagging gutters, daylight or pest entry at the eaves, and visible rot at the rafter tails are all signs. We inspect the framing behind the board on every estimate so you know whether it's a wrap or a full replacement.",
    },
    {
      question: "Does vented soffit help with ice dams and attic moisture?",
      answer:
        "Yes. Vented soffit is the intake side of a balanced attic ventilation system — it gives the ridge or gable exhaust air to pull. That airflow keeps the roof deck cold and even in winter, which reduces the melt-and-refreeze cycle that builds ice dams, and helps clear the attic moisture that shortens roof life.",
    },
    {
      question: "Aluminum wrap or engineered profiles — which is better?",
      answer:
        "Aluminum wrap over sound wood is the common, low-maintenance finish — baked-enamel color that holds up without a paint cycle. Engineered (composite) profiles are a good fit where the existing board is gone or where a deeper, dimensional look is wanted. We scope both against the condition of the framing and your budget.",
    },
    {
      question: "How long does a soffit and fascia project take?",
      answer:
        "Most homes are completed in one to three days depending on the linear footage, how much fascia has to be replaced versus wrapped, and whether gutters and roof work are sequenced into the same mobilization.",
    },
    {
      question: "Should soffit and fascia be done with a new roof or new gutters?",
      answer:
        "Whenever possible, yes. The fascia is what gutters hang from and the soffit is what the ridge vent depends on, so pairing the work means the drip edge, gutter line, and ventilation all sequence correctly in one trip — and you only mobilize the crew once.",
    },
    {
      question: "Do you replace the gutters when you replace the fascia?",
      answer:
        "We can. Old gutters have to come down to replace fascia, so it's usually the right moment to rehang with new seamless gutters strapped into sound, freshly wrapped board. If the gutters are still good, we'll reset them carefully after the fascia work.",
    },
    {
      question: "What about permits and the contractor license?",
      answer:
        "We handle the municipal permit and any required inspections when a town requires them for the scope. All work is performed under New Jersey Home Improvement Contractor License #13VH13821400.",
    },
  ],
  gutters: [
    {
      question: "What is a seamless gutter and why does it matter?",
      answer:
        "A seamless gutter is formed from a single continuous coil on-site, so there are no field joints along the run to leak. Sectional gutters rely on seams every ten feet, which is where most leaks start over time.",
    },
    {
      question: "Are the gutters really formed on-site?",
      answer:
        "Yes. A coil and a portable forming machine come to the home and run continuous lengths matched to each side of the roof. Only the corners and end caps are field joints, and those are sealed and riveted.",
    },
    {
      question: "Should I get 5-inch or 6-inch gutters?",
      answer:
        "5-inch K-style is the standard for most homes. 6-inch is recommended where roof area, pitch, or rainfall intensity overruns the smaller profile — typically larger homes, long valleys, or roofs with limited downspout placement.",
    },
    {
      question: "Aluminum or copper?",
      answer:
        "Most homes are served by baked-finish aluminum — durable, color-matched to the home, and a sensible cost. Copper is an option for historic homes and accent porches where the look is part of the architecture.",
    },
    {
      question: "Do I need gutter guards?",
      answer:
        "If trees overhang the roof, a quality micro-mesh guard saves the season-after-season ladder work and prevents the clogs that cause overflow and fascia rot. Open settings without nearby trees often do fine without guards.",
    },
    {
      question: "What brand of gutter guard do you use?",
      answer:
        "We install a stainless micro-mesh style guard that keeps out leaves, needles, and shingle grit while letting heavy rain through. Specific product is confirmed at the estimate based on the roof and tree coverage.",
    },
    {
      question: "Can you repair the fascia at the same time?",
      answer:
        "Yes. Rotten or damaged fascia is replaced before new gutters go up so the hangers fasten into sound wood. Soffit panels are addressed if they're part of the same condition.",
    },
    {
      question: "Should new gutters be installed with a new roof?",
      answer:
        "Pairing roof and gutter replacement is usually the cleanest sequence. Drip edge, flashing, and the gutter line all work together, and the crew can handle them in one mobilization.",
    },
    {
      question: "How often do I need to clean gutters without guards?",
      answer:
        "Twice a year is a good baseline — spring and late fall. Homes under heavier tree coverage benefit from a check after major storms or before winter to keep ice from backing up.",
    },
    {
      question: "Do gutters prevent ice dams?",
      answer:
        "Gutters don't cause ice dams on their own; attic conditions and ventilation do. Properly sized and sloped gutters with clear flow do reduce the water that contributes to dam buildup at the eave.",
    },
    {
      question: "Can downspout placement be changed?",
      answer:
        "Yes. Downspouts are placed where the roof area above warrants them and where the grade can carry water away from the foundation. Buried tie-ins or extensions can be added when surface routing isn't enough.",
    },
    {
      question: "Do you offer a warranty?",
      answer:
        "Yes. Aluminum coil and guard products carry the manufacturer's stated warranty, and our workmanship is covered separately. Specific terms are reviewed in writing with the estimate.",
    },
  ],
  "entry-doors": [
    {
      question: "Fiberglass or steel — which entry door is better?",
      answer:
        "Fiberglass resists denting and dimensional movement and can mimic real wood with grain finishes. Steel offers strong security at a friendlier price point. Both are insulated cores; the right pick comes down to exposure, look, and security goals.",
    },
    {
      question: "How long does an entry door installation take?",
      answer:
        "Most single entry doors are installed in a few hours. Double doors, doors with sidelights or transoms, or full-frame replacements where the existing frame is rotted can run a full day.",
    },
    {
      question: "Do you replace the frame and threshold?",
      answer:
        "Yes when the existing frame, sill, or threshold is worn, rotted, or out of square. A new slab in a tired frame won't seal correctly, so we scope the frame and threshold honestly with the door.",
    },
    {
      question: "What ProVia options do you install?",
      answer:
        "We're a ProVia Authorized Installer for Signet and Heritage fiberglass entry doors, Legacy steel doors, and Spectrum storm doors. Frame, glass package, finish color, and hardware are built to spec.",
    },
    {
      question: "Can a multi-point lock be added?",
      answer:
        "Yes. Multi-point lock systems, smart deadbolts, and premium handle sets are available on most ProVia entry doors. Strike plates are set into solid blocking so the hardware performs the way the spec promises.",
    },
    {
      question: "Do you install storm doors with the entry door?",
      answer:
        "Yes. ProVia Spectrum storm doors pair with the new entry — full-view, retractable-screen, and ventilating options are available. Pairing them with the entry install keeps trim, threshold, and finish aligned.",
    },
    {
      question: "What glass options can I add?",
      answer:
        "Decorative, privacy-rated, and impact-rated glass packages are available — sidelights and transoms can be included to bring usable daylight into the foyer without giving up privacy or security.",
    },
    {
      question: "How well do new entry doors seal against drafts?",
      answer:
        "An insulated polyurethane-core slab, fresh compression weatherstripping at the jambs and head, a corrected adjustable threshold, and a door sweep at the bottom are what stop the drafts. When all four are detailed correctly, a hand held to the perimeter shouldn't pick up airflow on a windy day.",
    },
    {
      question: "Can the finish be repainted later?",
      answer:
        "Yes on most fiberglass and steel doors with the right prep. Factory-stained fiberglass and factory-painted doors hold up well for years; touch-ups and refinish steps are reviewed in the warranty paperwork.",
    },
    {
      question: "Are there security ratings I should look for?",
      answer:
        "Look at frame construction, hinge security, deadbolt grade, and strike plate installation rather than the slab alone. ProVia entry systems include reinforced strike and hinge options for higher-security setups.",
    },
    {
      question: "Do you install French and sliding patio doors?",
      answer:
        "Yes. Sliding patio and hinged French door pairs are installed with full-frame replacement and threshold rebuild when needed so the door swings or rolls true and the seal is honest.",
    },
    {
      question: "What warranty do entry doors carry?",
      answer:
        "ProVia covers the door per their published warranty terms; our workmanship is covered separately. Specifics are reviewed in writing with the estimate so there are no surprises.",
    },
  ],
  "attic-insulation": [
    {
      question: "How do I tell if I need more attic insulation?",
      answer:
        "If the attic floor joists are visible above the insulation, you're light on depth. Drafty rooms, uneven temperatures floor to floor, high seasonal bills, and winter ice dams are all signs the attic isn't pulling its weight.",
    },
    {
      question: "What R-value is right for North Jersey attics?",
      answer:
        "Most of NJ sits in IECC Climate Zone 4 (Zone 5 in the northwest counties), and DOE / ENERGY STAR target R-49 to R-60 for vented attics — roughly 16 to 20 inches of blown-in cellulose on top of an air-sealed deck. Existing depth, joist height, and access can shift the target within that range, but the number to beat is R-49.",
    },
    {
      question: "Blown-in or batt — which should I use?",
      answer:
        "Blown-in cellulose covers attic floors more completely because it flows around wires, framing, and odd geometry. Batts work well in joist bays and knee walls where the cavity is clean and consistent. Most attics use both where each performs best.",
    },
    {
      question: "Do you remove the old insulation first?",
      answer:
        "We remove it when it's compressed, contaminated by rodents, water-damaged, or simply in the way of air sealing. Where the existing material is in good shape, we air-seal and add over the top to the target depth.",
    },
    {
      question: "What does air sealing involve?",
      answer:
        "Top plates, recessed light cans, plumbing and HVAC chases, the attic hatch, and other penetrations get sealed with the right materials before new insulation goes down. Air sealing is what stops the warm air from leaving in the first place.",
    },
    {
      question: "Do you check ventilation as part of the project?",
      answer:
        "Yes. Intake at the soffit and exhaust at the ridge or gables are reviewed and corrected so the attic stays balanced after the upgrade. Sealing without ventilation review can trap moisture and shorten roof life.",
    },
    {
      question: "Can attic insulation help with ice dams?",
      answer:
        "Yes — to a real extent. Air sealing plus correct insulation depth and balanced ventilation keep the roof deck cold and even, which is what reduces the melt-and-refreeze cycle at the eaves that builds ice dams.",
    },
    {
      question: "How much will I save on energy bills?",
      answer:
        "Savings depend on existing insulation, air leakage, HVAC equipment, and how the home is used. We won't quote a percentage we can't back up; what we can promise is a measurable change in comfort and an attic built to a target R-value.",
    },
    {
      question: "How long does an attic insulation project take?",
      answer:
        "Most projects are completed in one day. Removal of old material, larger attics, or complicated knee-wall scopes can extend the schedule to two days. Crews protect access paths and clean up the work area at closeout.",
    },
    {
      question: "Should attic insulation be paired with a new roof?",
      answer:
        "Yes when both are on the table. A roof replacement is the right moment to correct ventilation, and an air-sealed and properly insulated attic protects the new roof from the inside.",
    },
    {
      question: "Will the install be dusty?",
      answer:
        "Blown-in work is contained as much as possible — drop cloths in living spaces, sealed openings, and a vacuum on removal jobs. Some dust is normal in any attic project, and the work area is cleaned before the crew leaves.",
    },
    {
      question: "Is there a warranty on the insulation?",
      answer:
        "Manufacturer warranties cover the insulation materials per their published terms, and our workmanship is covered separately. Specifics are reviewed in writing with the estimate.",
    },
  ],
};

// FAQ sets for the /warranty and /our-process pages. Kept here (a server-safe
// data module) rather than inside the "use client" accordion components so the
// server pages can import them for FAQPage JSON-LD without crossing the client
// boundary (a client export reaches the server as a reference proxy, not the
// array).
export const warrantyFaqs: FAQEntry[] = [
  {
    question: "Does the warranty transfer if I sell the house?",
    answer:
      "Materials coverage is transferable. The buyer receives the original warranty documentation at closing.",
  },
  {
    question: "Who pays if the manufacturer goes out of business?",
    answer:
      "Our workmanship guarantee is our obligation regardless of manufacturer status. For materials, we work with established manufacturers — GAF and ProVia — with long track records in the industry.",
  },
  {
    question: "What's the claim process?",
    answer:
      "Call or email your project manager. We coordinate with the manufacturer on material claims and handle workmanship issues directly. No third-party claims service.",
  },
  {
    question: "Do I need to register anything myself?",
    answer:
      "No. We register your warranty with the manufacturer on the day we close out. You receive the documentation by email.",
  },
];

export const processFaqs: FAQEntry[] = [
  {
    question: "How long does the consultation take?",
    answer:
      "Usually 45–60 minutes on site. We measure, assess existing conditions, and talk through goals. No slide decks, no sales pitch.",
  },
  {
    question: "Who is on site each day?",
    answer:
      "A lead installer and their crew. For larger jobs, a second team may work on a separate section. Your project manager checks in daily and is reachable by phone.",
  },
  {
    question: "What happens if it rains?",
    answer:
      "We monitor forecasts and reschedule around weather that would compromise the install. Most roofing and siding work stops above a certain wind speed or precipitation level — we'd rather delay a day than rush.",
  },
  {
    question: "Can I change the scope once we've started?",
    answer:
      "Yes, with a written change order. We price it out before the work changes. No verbal agreements that create invoice surprises later.",
  },
  {
    question: "Do you need access to the inside of the house?",
    answer:
      "Usually no — most exterior work stays outside. Attic insulation and some skylight work do require interior access, which we schedule with you in advance.",
  },
];

/**
 * Financing FAQs for /financing.
 *
 * Answers are adapted from Pure Finance Group's own copy — see
 * docs/FINANCING_PAGE_MIGRATION.md §2.4 for the source text. Two deliberate
 * departures from that source, both flagged in docs/PURE_FINANCE_PARTNER_REPORT.md:
 *
 *   - We do NOT repeat "Applying will not impact your credit score." That claim
 *     is unverified (question A3) and it would become Elevate's representation
 *     the moment we publish it. Restore it only once the lender confirms the
 *     initial pull is a soft inquiry, in writing.
 *   - "Contractor" is replaced with Elevate's name throughout.
 */
export const financingFaqs: FAQEntry[] = [
  {
    question: "Who actually provides the financing?",
    answer:
      "Pure Financial Group LLC (NMLS #1802643) and its network of third-party lending partners. Elevate is a contractor, not a lender or a broker — we don't set your rate, approve your application, or hold your loan. Approval, rate, and term come from the lender.",
  },
  {
    question: "How does the application work?",
    answer:
      "You pick a plan and click apply, which takes you to the lender's own secure application. You enter your personal, address, and income details there — not on our site. Once the lender has your approved offers, they send them over so we can review the numbers with you against the real project scope.",
  },
  {
    question: "Does applying affect my credit?",
    answer:
      "The lender makes that determination and discloses it during the application. All applications are subject to approval through credit, income, and residency verification. Ask us or the lender before you apply if you want the specifics for your situation.",
  },
  {
    question: "When do payments start?",
    answer:
      "Payments usually begin about 30 days after your project is completed. If your loan includes a promotional no-payment or no-interest period, payments and any interest charges begin after that period ends.",
  },
  {
    question: "How do I make payments once the loan is active?",
    answer:
      "Directly to the lender — Elevate never handles loan payments. Pure Finance Group's payment portal is at purefinancegroup.com/make-payment, and they can be reached at 410-401-4957 or info@purefinancegroup.com.",
  },
  {
    question: "Do I need to apply to get a price on my project?",
    answer:
      "No. We price the project first and there is no application, no credit pull, and no obligation involved in getting an estimate. Financing is something we walk through once there's a real scope and a real number to attach it to.",
  },
  {
    question: "Can I pay the loan off early?",
    answer:
      "That depends on your specific loan program and lender. Prepayment terms are disclosed in your loan documents at approval — read them before you sign, and ask the lender directly if anything is unclear.",
  },
];
