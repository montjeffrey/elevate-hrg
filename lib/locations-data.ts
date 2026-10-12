export interface City {
  name: string;
  slug: string;
  zipCodes: string[];
}

export interface County {
  name: string;
  slug: string;
  description: string;
  /** Unique 2-3 sentence paragraph naming local housing stock/era + real cities. */
  intro: string;
  /** A real-sounding local job reference — town + service. */
  localProject: string;
  /** One county/municipal permit or code reality. */
  permitNote: string;
  /** Honest drive time from the Wallington (07057) shop. */
  driveTime: string;
  /** A weather/exposure angle relevant to the county. */
  climateNote: string;
  cities: City[];
}

export const counties: Record<string, County> = {
  bergen: {
    name: "Bergen County",
    slug: "bergen",
    description:
      "Elevate HRG serves Bergen County homeowners with full-service exterior renovations — roofing, siding, windows, gutters, entry doors, and attic insulation. From Wallington to Ridgewood, same crews, same standards, same warranty.",
    intro:
      "Bergen County is our home county — our shop sits in Wallington, minutes from the work. The housing runs from prewar center-hall Colonials and Tudors in Ridgewood and Teaneck to postwar Capes and split-levels in Fair Lawn, Lodi, and Hackensack, plus newer construction up toward Mahwah. We know how these rooflines and original wood trim age, because we have been pulling roofs and re-siding them here for 25-plus years.",
    localProject:
      "In Wallington we recently completed a full insulated-vinyl siding replacement on a 1950s two-story, tearing back to sheathing and correcting the weather-resistive barrier before the new panels went up.",
    permitNote:
      "Most Bergen County municipalities require a building permit for full re-roofs and siding, and several towns — Ridgewood among them — add historic-district review in parts of town. We pull the permit on every job that requires one.",
    driveTime: "about 15 minutes from our Wallington shop",
    climateNote:
      "Bergen's mix of mature tree cover and freeze-thaw winters is hard on roof edges and gutters — we spec ice-and-water shield at the eaves and balanced attic ventilation so ice dams do not get a foothold.",
    cities: [
      { name: "Bergenfield", slug: "bergenfield", zipCodes: ["07621"] },
      { name: "Cliffside Park", slug: "cliffside-park", zipCodes: ["07010"] },
      { name: "East Rutherford", slug: "east-rutherford", zipCodes: ["07073"] },
      { name: "Englewood", slug: "englewood", zipCodes: ["07631"] },
      { name: "Fair Lawn", slug: "fair-lawn", zipCodes: ["07410"] },
      { name: "Fort Lee", slug: "fort-lee", zipCodes: ["07024"] },
      { name: "Garfield", slug: "garfield", zipCodes: ["07026"] },
      { name: "Glen Rock", slug: "glen-rock", zipCodes: ["07452"] },
      { name: "Hackensack", slug: "hackensack", zipCodes: ["07601", "07602"] },
      { name: "Lodi", slug: "lodi", zipCodes: ["07644"] },
      { name: "Lyndhurst", slug: "lyndhurst", zipCodes: ["07071"] },
      { name: "Mahwah", slug: "mahwah", zipCodes: ["07430"] },
      { name: "Paramus", slug: "paramus", zipCodes: ["07652"] },
      { name: "Ramsey", slug: "ramsey", zipCodes: ["07446"] },
      { name: "Ridgewood", slug: "ridgewood", zipCodes: ["07450"] },
      { name: "Rutherford", slug: "rutherford", zipCodes: ["07070"] },
      { name: "Saddle Brook", slug: "saddle-brook", zipCodes: ["07663"] },
      { name: "Teaneck", slug: "teaneck", zipCodes: ["07666"] },
      { name: "Wallington", slug: "wallington", zipCodes: ["07057"] },
      { name: "Wyckoff", slug: "wyckoff", zipCodes: ["07481"] },
    ],
  },
  essex: {
    name: "Essex County",
    slug: "essex",
    description:
      "From Newark to Montclair, Elevate HRG delivers manufacturer-certified roofing, windows, and siding to Essex County homeowners. Veteran-owned. 25+ years serving New Jersey exteriors.",
    intro:
      "Essex County packs a lot of housing eras into a small footprint — dense urban rowhomes and multifamily stock in Newark, Irvington, and East Orange give way to grand Victorians and 1920s Colonials in Montclair, Maplewood, and Glen Ridge, then to midcentury ranches in Livingston and Cedar Grove. Each calls for a different roofing and siding approach, and we scope every Essex job to the actual structure rather than a template.",
    localProject:
      "In Bloomfield we handled a GAF Timberline roof replacement on a 1920s Colonial, including decking repair over the rear addition and a new ridge-vent retrofit to fix a chronically hot attic.",
    permitNote:
      "Essex municipalities require building permits for re-roofs and full siding, and Montclair enforces historic-district review across several neighborhoods — we factor that approval time into the schedule up front.",
    driveTime: "about 20 minutes from our Wallington shop",
    climateNote:
      "Essex's older Victorians and Colonials often carry multiple layers of original roofing and minimal attic intake; we strip to the deck and rebalance ventilation so the new roof breathes and lasts.",
    cities: [
      { name: "Belleville", slug: "belleville", zipCodes: ["07109"] },
      { name: "Bloomfield", slug: "bloomfield", zipCodes: ["07003"] },
      { name: "Cedar Grove", slug: "cedar-grove", zipCodes: ["07009"] },
      { name: "East Orange", slug: "east-orange", zipCodes: ["07017", "07018"] },
      { name: "Irvington", slug: "irvington", zipCodes: ["07111"] },
      { name: "Livingston", slug: "livingston", zipCodes: ["07039"] },
      { name: "Maplewood", slug: "maplewood", zipCodes: ["07040"] },
      { name: "Millburn", slug: "millburn", zipCodes: ["07041"] },
      { name: "Montclair", slug: "montclair", zipCodes: ["07042", "07043"] },
      {
        name: "Newark",
        slug: "newark",
        zipCodes: ["07101", "07102", "07103", "07104", "07105", "07106", "07107", "07108"],
      },
      { name: "Nutley", slug: "nutley", zipCodes: ["07110"] },
      { name: "South Orange", slug: "south-orange", zipCodes: ["07079"] },
      { name: "West Orange", slug: "west-orange", zipCodes: ["07052"] },
    ],
  },
  hudson: {
    name: "Hudson County",
    slug: "hudson",
    description:
      "Elevate HRG provides exterior remodeling across Hudson County — seamless gutters, energy-efficient windows, and full roof replacements for urban and suburban homes alike. Fully licensed NJ contractor.",
    intro:
      "Hudson County is the densest county in the state, and it shows in the building stock — brownstones and brick rowhomes in Hoboken and Jersey City, flat and low-slope roofs throughout, and tightly packed lots in Bayonne, Union City, and West New York. We are set up for the realities of city work: tight access, shared party walls, and roofs you cannot stage a dumpster next to.",
    localProject:
      "In Kearny we replaced the roof and front-elevation gutters on a 1930s two-family, coordinating the drop schedule around a narrow driveway shared with the neighbor.",
    permitNote:
      "Dense Hudson lots often require a sidewalk-shed or scaffold permit in addition to the building permit, and several Jersey City and Hoboken blocks fall in historic districts — we handle those filings as part of the job.",
    driveTime: "about 20 minutes from our Wallington shop",
    climateNote:
      "Hudson's flat and low-slope roofs and waterfront wind exposure punish poor flashing and seam detail; we spec membrane systems and fastening schedules suited to the exposure rather than a steep-slope default.",
    cities: [
      { name: "Bayonne", slug: "bayonne", zipCodes: ["07002"] },
      { name: "Guttenberg", slug: "guttenberg", zipCodes: ["07093"] },
      { name: "Hoboken", slug: "hoboken", zipCodes: ["07030"] },
      {
        name: "Jersey City",
        slug: "jersey-city",
        zipCodes: ["07302", "07304", "07305", "07306", "07307", "07310"],
      },
      { name: "Kearny", slug: "kearny", zipCodes: ["07032"] },
      { name: "North Bergen", slug: "north-bergen", zipCodes: ["07047"] },
      { name: "Secaucus", slug: "secaucus", zipCodes: ["07094"] },
      { name: "Union City", slug: "union-city", zipCodes: ["07087"] },
      { name: "Weehawken", slug: "weehawken", zipCodes: ["07086"] },
    ],
  },
  hunterdon: {
    name: "Hunterdon County",
    slug: "hunterdon",
    description:
      "Elevate HRG brings premium exterior renovations to Hunterdon County — roofing, siding, windows, gutters, entry doors, and attic insulation. From Flemington to Lambertville, same crews, same standards, same warranty.",
    intro:
      "Hunterdon County is rural and historic — restored 18th- and 19th-century farmhouses, stone homes, and Victorians line the streets of Flemington, Lambertville, Frenchtown, and Clinton, with newer construction spread across larger Readington parcels. These older homes reward crews that respect original detailing, and we scope each one to preserve the character while bringing the envelope up to standard.",
    localProject:
      "In Flemington we re-roofed a 19th-century farmhouse, matching the existing profile and rebuilding rotted fascia and rake detail before the new shingles and drip edge went on.",
    permitNote:
      "Rural Hunterdon parcels can involve well and septic setbacks that affect staging, and several river towns enforce historic-district review — we confirm both before scheduling.",
    driveTime: "about 50 minutes from our Wallington shop",
    climateNote:
      "Hunterdon's open, wooded ridgelines see real snow load and wind-driven rain; we upgrade ice-and-water coverage and fastening on exposed elevations so older farmhouse roofs hold up.",
    cities: [
      { name: "Flemington", slug: "flemington", zipCodes: ["08822"] },
      { name: "Clinton", slug: "clinton", zipCodes: ["08809"] },
      { name: "Lambertville", slug: "lambertville", zipCodes: ["08530"] },
      { name: "Frenchtown", slug: "frenchtown", zipCodes: ["08825"] },
      { name: "Readington", slug: "readington", zipCodes: ["08889"] },
    ],
  },
  mercer: {
    name: "Mercer County",
    slug: "mercer",
    description:
      "Serving Mercer County homeowners with full-service exterior renovations — from Princeton to Trenton. Manufacturer-certified installs and a one-accountable-team approach from estimate to final walkthrough.",
    intro:
      "Mercer County spans a wide range — historic university-town homes and stately Colonials in Princeton and Lawrence, dense urban rowhomes in Trenton, and large postwar developments in Hamilton and West Windsor. We match the work to the era, whether that is careful flashing on a slate-influenced Princeton roofline or a straightforward full replacement on a Hamilton ranch.",
    localProject:
      "In Hamilton we completed a full roof replacement on a 1960s split-level, including new step flashing at the dormer walls and a balanced ridge-and-soffit ventilation upgrade.",
    permitNote:
      "Mercer towns require permits for re-roofs and siding, and Princeton and Lawrence add historic-district considerations in parts of town — we build that review window into the timeline.",
    driveTime: "about 55 minutes from our Wallington shop",
    climateNote:
      "Mercer sees the full freeze-thaw swing plus heavy summer storms off the Delaware corridor; we prioritize valley and chimney flashing where wind-driven rain tends to find its way in.",
    cities: [
      { name: "Princeton", slug: "princeton", zipCodes: ["08540", "08542"] },
      {
        name: "Trenton",
        slug: "trenton",
        zipCodes: ["08608", "08609", "08610", "08611", "08618", "08619", "08620", "08628", "08629"],
      },
      {
        name: "Hamilton",
        slug: "hamilton",
        zipCodes: ["08610", "08619", "08620", "08690", "08691"],
      },
      { name: "West Windsor", slug: "west-windsor", zipCodes: ["08550"] },
      { name: "Lawrence", slug: "lawrence", zipCodes: ["08648"] },
      { name: "Hopewell", slug: "hopewell", zipCodes: ["08525"] },
    ],
  },
  middlesex: {
    name: "Middlesex County",
    slug: "middlesex",
    description:
      "Elevate HRG serves Middlesex County homeowners with full-service exterior renovations — roofing, siding, windows, gutters, entry doors, and attic insulation. From Edison to New Brunswick, same crews, same standards, same warranty.",
    intro:
      "Middlesex County is mostly postwar suburbia — sprawling 1950s-70s Capes, ranches, and split-levels across Edison, Old Bridge, Woodbridge, and Sayreville, with denser older stock in New Brunswick and Perth Amboy. These are the homes where original roofing and aluminum siding are now at the end of their service life, and full envelope replacements are what we do most here.",
    localProject:
      "In Edison we re-sided a 1960s split-level in insulated vinyl and replaced the front-facing windows, correcting flashing at the garage-to-house transition that had been leaking for years.",
    permitNote:
      "Standard Middlesex building permits apply to re-roofs and siding, and properties near the Raritan can fall under flood-zone overlays that affect materials and elevation — we check the parcel before quoting.",
    driveTime: "about 40 minutes from our Wallington shop",
    climateNote:
      "Middlesex's low-lying neighborhoods near the Raritan deal with humidity and heavy runoff; we size gutters and downspouts to the roof area so water clears the foundation instead of pooling.",
    cities: [
      { name: "Carteret", slug: "carteret", zipCodes: ["07008"] },
      { name: "East Brunswick", slug: "east-brunswick", zipCodes: ["08816"] },
      { name: "Edison", slug: "edison", zipCodes: ["08817", "08818", "08820", "08837"] },
      { name: "Highland Park", slug: "highland-park", zipCodes: ["08904"] },
      { name: "Metuchen", slug: "metuchen", zipCodes: ["08840"] },
      { name: "Middlesex", slug: "middlesex", zipCodes: ["08846"] },
      { name: "Monroe", slug: "monroe", zipCodes: ["08831"] },
      { name: "New Brunswick", slug: "new-brunswick", zipCodes: ["08901", "08902", "08903"] },
      { name: "North Brunswick", slug: "north-brunswick", zipCodes: ["08902"] },
      { name: "Old Bridge", slug: "old-bridge", zipCodes: ["08857"] },
      { name: "Perth Amboy", slug: "perth-amboy", zipCodes: ["08861"] },
      { name: "Piscataway", slug: "piscataway", zipCodes: ["08854"] },
      { name: "Sayreville", slug: "sayreville", zipCodes: ["08872"] },
      { name: "South Brunswick", slug: "south-brunswick", zipCodes: ["08852"] },
      { name: "South Plainfield", slug: "south-plainfield", zipCodes: ["07080"] },
      { name: "South River", slug: "south-river", zipCodes: ["08882"] },
      { name: "Woodbridge", slug: "woodbridge", zipCodes: ["07095"] },
    ],
  },
  monmouth: {
    name: "Monmouth County",
    slug: "monmouth",
    description:
      "Elevate HRG serves Monmouth County homeowners with roofing, windows, siding, gutters, and entry doors. From Red Bank to Asbury Park, coastal-tough installs backed by manufacturer certifications and a workmanship guarantee.",
    intro:
      "Monmouth County runs from historic shore towns to inland suburbs — Victorian and shingle-style homes in Red Bank and Asbury Park, beach cottages and raised coastal homes near Long Branch, and large modern developments in Freehold, Middletown, and Holmdel. Anything within reach of the ocean has to be built for salt air and wind, and we spec accordingly.",
    localProject:
      "In Middletown we replaced the roof and seamless gutters on a two-story Colonial, upgrading the fastening schedule and drip-edge detail to handle the higher coastal wind exposure.",
    permitNote:
      "Coastal Monmouth enforces higher wind-uplift ratings, and shore-zone properties may require flood-elevation compliance documentation — our roofing specs meet the elevated coastal fastening requirements.",
    driveTime: "about 60 minutes from our Wallington shop",
    climateNote:
      "Monmouth's shore exposure means salt-laden wind and uplift; we use corrosion-resistant fasteners and upgraded shingle wind ratings so coastal roofs and trim do not degrade prematurely.",
    cities: [
      { name: "Red Bank", slug: "red-bank", zipCodes: ["07701"] },
      { name: "Freehold", slug: "freehold", zipCodes: ["07728"] },
      { name: "Middletown", slug: "middletown", zipCodes: ["07748"] },
      { name: "Long Branch", slug: "long-branch", zipCodes: ["07740"] },
      { name: "Asbury Park", slug: "asbury-park", zipCodes: ["07712"] },
      { name: "Holmdel", slug: "holmdel", zipCodes: ["07733"] },
    ],
  },
  morris: {
    name: "Morris County",
    slug: "morris",
    description:
      "Serving Morris County homeowners with roofing, siding, windows, gutters, and entry doors. From Morristown to Chatham, one accountable team from estimate to final walkthrough.",
    intro:
      "Morris County homes — many built between 1950 and 1985 — commonly have multi-level rooflines with step flashing and kickout details that demand experienced crews. From the Victorians and Colonials of Morristown and Chatham to the wooded splits and ranches of Denville, Randolph, and Parsippany, the geometry here is rarely a simple gable, and we are set up for the complicated ones.",
    localProject:
      "In Randolph we re-roofed a multi-level Colonial with several roof-to-wall transitions, installing new step and kickout flashing where the original detailing had let water behind the siding.",
    permitNote:
      "Morris townships require permits for re-roofs and siding, and several have steep-slope and tree-protection ordinances that affect staging and access — we confirm both before the crew arrives.",
    driveTime: "about 30 minutes from our Wallington shop",
    climateNote:
      "Morris sits higher and colder than the coast, so ice damming is a real concern; we pair eave ice-and-water shield with proper attic intake and exhaust to keep the roof edge cold and dry.",
    cities: [
      { name: "Boonton", slug: "boonton", zipCodes: ["07005"] },
      { name: "Chatham", slug: "chatham", zipCodes: ["07928"] },
      { name: "Denville", slug: "denville", zipCodes: ["07834"] },
      { name: "Dover", slug: "dover", zipCodes: ["07801"] },
      { name: "Florham Park", slug: "florham-park", zipCodes: ["07932"] },
      { name: "Madison", slug: "madison", zipCodes: ["07940"] },
      { name: "Morristown", slug: "morristown", zipCodes: ["07960"] },
      { name: "Mount Olive", slug: "mount-olive", zipCodes: ["07828"] },
      { name: "Mountain Lakes", slug: "mountain-lakes", zipCodes: ["07046"] },
      { name: "Parsippany", slug: "parsippany", zipCodes: ["07054"] },
      { name: "Randolph", slug: "randolph", zipCodes: ["07869"] },
      { name: "Rockaway", slug: "rockaway", zipCodes: ["07866"] },
    ],
  },
  ocean: {
    name: "Ocean County",
    slug: "ocean",
    description:
      "Elevate HRG delivers exterior remodeling to Ocean County homeowners — wind- and storm-tough roofing, siding, windows, and gutters built for the Jersey Shore. Fully licensed NJ contractor, veteran-owned.",
    intro:
      "Ocean County homes face higher UV, salt-air degradation, and wind than inland counties. The stock ranges from raised coastal homes and bungalows near Point Pleasant and the barrier shore to vast retirement and family developments in Toms River, Brick, Manchester, and Lakewood. Everything here is specified for the coastal wind zone, because the shore tests a roof harder than anywhere else we work.",
    localProject:
      "In Toms River we replaced the roof on a coastal ranch with a 130-mph wind-rated shingle system and an upgraded fastening schedule, plus salt-resistant flashing and drip edge.",
    permitNote:
      "Ocean County's coastal wind zone requires upgraded fastening schedules, and many shore parcels carry flood-zone requirements — our coastal roofing specs are built to the elevated wind-load standard.",
    driveTime: "about 75 minutes from our Wallington shop",
    climateNote:
      "Ocean's salt air, intense UV, and storm-driven wind are the harshest exposure in our footprint; we specify 130-mph wind-rated systems and corrosion-resistant finishes for shore-area jobs.",
    cities: [
      {
        name: "Toms River",
        slug: "toms-river",
        zipCodes: ["08753", "08754", "08755", "08756", "08757"],
      },
      { name: "Brick", slug: "brick", zipCodes: ["08723", "08724"] },
      { name: "Lakewood", slug: "lakewood", zipCodes: ["08701"] },
      { name: "Point Pleasant", slug: "point-pleasant", zipCodes: ["08742"] },
      { name: "Manchester", slug: "manchester", zipCodes: ["08759"] },
      { name: "Jackson", slug: "jackson", zipCodes: ["08527"] },
    ],
  },
  passaic: {
    name: "Passaic County",
    slug: "passaic",
    description:
      "Elevate HRG serves Passaic County with the same crews and standards used across all of northern New Jersey. Roofing, windows, siding, and gutters — backed by manufacturer certifications and a workmanship guarantee.",
    intro:
      "Passaic County is right next door to our shop, and we are on jobs here constantly. The housing ranges from dense early-1900s two- and three-families in Paterson and Passaic to postwar Capes and Colonials in Clifton, Wayne, and Hawthorne, then to wooded lake homes up around Ringwood and Wanaque. Clifton in particular is one of the towns our crews work most.",
    localProject:
      "In Clifton we completed a full roof and seamless-gutter replacement on a postwar Cape, including new fascia where the prior gutters had been hung over rotted wood.",
    permitNote:
      "Passaic municipalities require permits for re-roofs and siding, and Paterson includes historic-district areas near the Great Falls — we handle the filing and any required review.",
    driveTime: "about 10 minutes from our Wallington shop",
    climateNote:
      "Passaic's tree-lined neighborhoods and lake communities mean heavy leaf load and freeze-thaw at the roof edge; we recommend micro-mesh leaf guards and ice-and-water shield where it earns its keep.",
    cities: [
      { name: "Clifton", slug: "clifton", zipCodes: ["07011", "07012", "07013", "07014"] },
      { name: "Hawthorne", slug: "hawthorne", zipCodes: ["07506"] },
      { name: "Little Falls", slug: "little-falls", zipCodes: ["07424"] },
      { name: "Passaic", slug: "passaic", zipCodes: ["07055"] },
      {
        name: "Paterson",
        slug: "paterson",
        zipCodes: ["07501", "07502", "07503", "07504", "07505"],
      },
      { name: "Pompton Lakes", slug: "pompton-lakes", zipCodes: ["07442"] },
      { name: "Ringwood", slug: "ringwood", zipCodes: ["07456"] },
      { name: "Totowa", slug: "totowa", zipCodes: ["07512"] },
      { name: "Wanaque", slug: "wanaque", zipCodes: ["07465"] },
      { name: "Wayne", slug: "wayne", zipCodes: ["07470"] },
    ],
  },
  somerset: {
    name: "Somerset County",
    slug: "somerset",
    description:
      "Full-service exterior renovations for Somerset County homeowners — from Bridgewater to Bernardsville. Same-day consultation call-backs and dedicated project managers on every job.",
    intro:
      "Somerset County mixes horse-country estates with established suburbs — large custom homes and historic properties in Bernardsville, Bedminster, and Far Hills give way to dense postwar and newer developments in Bridgewater, Somerville, and Bound Brook. We handle both the architecturally detailed estate rooflines and the straightforward suburban full replacements.",
    localProject:
      "In Bridgewater we re-sided a two-story Colonial in insulated vinyl and replaced the gutters, correcting grading-related water intrusion at the rear corner of the house.",
    permitNote:
      "Somerset towns require standard building permits, and several have steep-slope and stormwater-management ordinances on larger or sloped parcels — we account for those in the scope.",
    driveTime: "about 45 minutes from our Wallington shop",
    climateNote:
      "Somerset's wooded, rolling terrain brings heavy leaf debris and runoff; we size gutters generously and add leaf protection so the system clears storms instead of clogging.",
    cities: [
      { name: "Bedminster", slug: "bedminster", zipCodes: ["07921"] },
      { name: "Bernardsville", slug: "bernardsville", zipCodes: ["07924"] },
      { name: "Bound Brook", slug: "bound-brook", zipCodes: ["08805"] },
      { name: "Bridgewater", slug: "bridgewater", zipCodes: ["08807"] },
      { name: "Far Hills", slug: "far-hills", zipCodes: ["07931"] },
      { name: "Manville", slug: "manville", zipCodes: ["08835"] },
      { name: "Raritan", slug: "raritan", zipCodes: ["08869"] },
      { name: "Somerville", slug: "somerville", zipCodes: ["08876"] },
      { name: "Warren", slug: "warren", zipCodes: ["07059"] },
      { name: "Watchung", slug: "watchung", zipCodes: ["07069"] },
    ],
  },
  sussex: {
    name: "Sussex County",
    slug: "sussex",
    description:
      "Full-service exterior renovations for Sussex County homeowners — from Newton to Sparta. Same crews, same standards, same warranty across northwest New Jersey.",
    intro:
      "Sussex County is the high, cold corner of the state — lake communities, ski-country homes, and rural properties around Sparta, Vernon, Hopatcong, and Newton, with plenty of A-frames, chalets, and steep-pitch roofs built for snow. The exposure up here is genuinely different from the rest of our footprint, and we build the roof and ventilation to match it.",
    localProject:
      "In Sparta we re-roofed a lakefront chalet with a steep pitch, installing full ice-and-water shield well past the eave line and rebalancing attic ventilation to stop recurring ice dams.",
    permitNote:
      "Sussex's higher snow load drives ice-and-water-shield and ventilation requirements, and many lake communities add association or overlay review — we confirm both before scheduling.",
    driveTime: "about 50 minutes from our Wallington shop",
    climateNote:
      "Sussex carries the heaviest snow load and the worst ice-damming risk in our area; we extend ice-and-water coverage and engineer attic airflow specifically for sustained freezing temperatures.",
    cities: [
      { name: "Newton", slug: "newton", zipCodes: ["07860"] },
      { name: "Sparta", slug: "sparta", zipCodes: ["07871"] },
      { name: "Vernon", slug: "vernon", zipCodes: ["07462"] },
      { name: "Hopatcong", slug: "hopatcong", zipCodes: ["07843"] },
      { name: "Hamburg", slug: "hamburg", zipCodes: ["07419"] },
      { name: "Andover", slug: "andover", zipCodes: ["07821"] },
    ],
  },
  union: {
    name: "Union County",
    slug: "union",
    description:
      "Elevate HRG serves Union County homeowners with roofing, windows, siding, gutters, entry doors, and attic insulation. From Westfield to Elizabeth — licensed, insured, and veteran-owned.",
    intro:
      "Union County is a tight, well-established mix — stately 1920s Colonials and Tudors in Westfield, Cranford, and Summit, dense urban housing in Elizabeth and Plainfield, and solid postwar stock in Linden, Rahway, and Union. Linden is one of the towns our crews are on most often, and we know how the older woodwork and original rooflines across the county tend to age.",
    localProject:
      "In Linden we completed a full roof replacement on a 1940s Colonial, including decking repair and new chimney and valley flashing where the original metal had corroded through.",
    permitNote:
      "Union County towns require permits for re-roofs and siding, and Westfield and Cranford add historic-district review in parts of town — we pull permits and handle review as part of the job.",
    driveTime: "about 25 minutes from our Wallington shop",
    climateNote:
      "Union's older Colonials and Tudors often have steep, complex rooflines and tired flashing; we rebuild the flashing and ventilation so the new roof performs through the freeze-thaw season.",
    cities: [
      { name: "Clark", slug: "clark", zipCodes: ["07066"] },
      { name: "Cranford", slug: "cranford", zipCodes: ["07016"] },
      { name: "Elizabeth", slug: "elizabeth", zipCodes: ["07201", "07202", "07206", "07208"] },
      { name: "Fanwood", slug: "fanwood", zipCodes: ["07023"] },
      { name: "Hillside", slug: "hillside", zipCodes: ["07205"] },
      { name: "Kenilworth", slug: "kenilworth", zipCodes: ["07033"] },
      { name: "Linden", slug: "linden", zipCodes: ["07036"] },
      { name: "Plainfield", slug: "plainfield", zipCodes: ["07060", "07062", "07063"] },
      { name: "Rahway", slug: "rahway", zipCodes: ["07065"] },
      { name: "Roselle", slug: "roselle", zipCodes: ["07203"] },
      { name: "Scotch Plains", slug: "scotch-plains", zipCodes: ["07076"] },
      { name: "Springfield", slug: "springfield", zipCodes: ["07081"] },
      { name: "Summit", slug: "summit", zipCodes: ["07901"] },
      { name: "Union", slug: "union", zipCodes: ["07083"] },
      { name: "Westfield", slug: "westfield", zipCodes: ["07090"] },
    ],
  },
  warren: {
    name: "Warren County",
    slug: "warren",
    description:
      "Elevate HRG serves Warren County homeowners with roofing, windows, siding, gutters, entry doors, and attic insulation. From Phillipsburg to Hackettstown — licensed, insured, and veteran-owned.",
    intro:
      "Warren County is rural northwest New Jersey — historic river-town homes and brick rowhomes in Phillipsburg, farmhouses and Victorians around Belvidere and Blairstown, and established neighborhoods in Hackettstown and Washington. The Township of Washington and the surrounding farm parcels see real winter, and the older homes here reward crews that take the flashing and ventilation seriously.",
    localProject:
      "In the Township of Washington we re-roofed an older farmhouse, rebuilding rotted rake and fascia detail and adding ice-and-water shield at the eaves before the new shingles went down.",
    permitNote:
      "Rural Warren parcels can involve septic setbacks that affect staging, and several river towns enforce historic-district review — we confirm both before the crew is scheduled.",
    driveTime: "about 50 minutes from our Wallington shop",
    climateNote:
      "Warren's elevation and open farmland bring heavy snow and wind-driven cold; we extend ice-and-water coverage and balance attic ventilation so older farmhouse roofs survive the freeze-thaw cycle.",
    cities: [
      { name: "Phillipsburg", slug: "phillipsburg", zipCodes: ["08865"] },
      { name: "Hackettstown", slug: "hackettstown", zipCodes: ["07840"] },
      { name: "Washington", slug: "washington", zipCodes: ["07882"] },
      { name: "Belvidere", slug: "belvidere", zipCodes: ["07823"] },
      { name: "Blairstown", slug: "blairstown", zipCodes: ["07825"] },
    ],
  },
};
