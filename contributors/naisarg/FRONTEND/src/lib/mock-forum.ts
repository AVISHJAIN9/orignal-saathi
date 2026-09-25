// MOCK: there is no real community-forum backend in this repo (see Step 0
// of the task this file implements — no api/ directory, no OpenAPI spec, no
// env-configured API base URL). This module stands in for a future
//   GET  /api/v1/forum/posts                    listPosts
//   POST /api/v1/forum/posts                     createPost
//   POST /api/v1/forum/posts/:id/replies         addReply
//   POST /api/v1/forum/posts/:id/bookmark        toggleBookmark
//   POST /api/v1/forum/replies/:id/helpful       toggleHelpfulVote
// with the workbench (nexus-workbench.tsx) holding the resulting state
// client-side and mutating it optimistically — same pattern as
// mock-registration.ts.
//
// Every citation below points at one of this repo's 6 real seeded
// standards (src/lib/mock-standards.ts) using the exact standardNumber/
// title pairs already shown in chat citations (see
// src/i18n/locales/en/conversation.json) — never an invented clause,
// amendment, or circular number. An earlier reference draft of this file
// cited specific fabricated clause numbers and gazette/circular numbers,
// and attributed technical claims to real companies and test labs (e.g.
// "Havells", "TÜV SÜD", "NABL", "ERTL") that never said any of this — this
// version uses only fictional persons and fictional company names, and
// keeps every technical claim general enough not to require a citation
// this repo's real seed data can't back up.
//
// Authorship for anything a signed-in visitor posts (a new question, a
// reply) is filled in by nexus-workbench.tsx from the real S1 AuthUser and
// the user's own chosen profile tone, not a hardcoded name — this seed
// data is the only place a fictional persona is used.

export type ForumCategory =
  | "all"
  | "saved"
  | "standards"
  | "conformity"
  | "testing"
  | "certification"
  | "regulatory"
  | "implementation"
  | "open";

export type VerificationStatus =
  "open" | "discussed" | "verified" | "expert_verified";

export type AvatarTone = "navy" | "sage" | "clay";

export interface ForumCitation {
  code: string;
  title: string;
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: string;
  authorOrg?: string;
  authorAvatarTone: AvatarTone;
  isVerifiedExpert: boolean;
  content: string;
  timestamp: string;
  helpfulCount: number;
  hasUserUpvoted?: boolean;
  citations?: ForumCitation[];
}

export interface ForumPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorRole: string;
  authorOrg?: string;
  authorAvatarTone: AvatarTone;
  date: string;
  category: Exclude<ForumCategory, "all" | "saved" | "open">;
  verificationStatus: VerificationStatus;
  repliesCount: number;
  viewsCount: number;
  tags: string[];
  isBookmarked?: boolean;
  replies: ForumReply[];
}

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "nexus-001",
    title:
      "Ventilation cut-outs on full-face helmets — how much shell area can they take up under IS 4151?",
    excerpt:
      "Looking for guidance on how aggressive forced-air ventilation slots can be before they start to count against the shell's impact-absorption performance.",
    content:
      "We're finalising a full-face helmet shell with a larger front vent than our previous model, aimed at hot-climate riders. Before we commit to tooling, has anyone gone through IS 4151 impact testing with a similarly sized vent cut-out and seen it affect shock-absorption results? Trying to gauge whether we should get a pre-test opinion from our lab before submitting the full sample set.",
    authorName: "Ananya Kulkarni",
    authorRole: "Chief Compliance Engineer",
    authorOrg: "Shaurya Safety Gear Pvt. Ltd.",
    authorAvatarTone: "navy",
    date: "2 hours ago",
    category: "standards",
    verificationStatus: "expert_verified",
    repliesCount: 2,
    viewsCount: 412,
    tags: ["IS 4151", "Helmets", "Shell Design", "Impact Testing"],
    replies: [
      {
        id: "reply-1",
        authorName: "Devraj Menon",
        authorRole: "Independent Compliance Auditor",
        authorAvatarTone: "sage",
        isVerifiedExpert: true,
        content:
          "Vent placement matters more than total vent area — cut-outs positioned away from the primary impact zones generally clear testing without issue, but anything crossing the crown impact area is worth a pre-test dry run. Most labs will do an informal shell-only drop check before you commit to full sample submission if you ask.",
        timestamp: "1 hour ago",
        helpfulCount: 21,
        citations: [
          {
            code: "IS 4151",
            title: "Protective Helmets for Two-Wheeler Riders — Specification",
          },
        ],
      },
      {
        id: "reply-2",
        authorName: "Farhan Qureshi",
        authorRole: "Product Safety Lead",
        authorOrg: "Brightline Home Appliances",
        authorAvatarTone: "clay",
        isVerifiedExpert: false,
        content:
          "Not a helmet manufacturer myself, but we ran into the same 'ask the lab before you tool up' advice on an unrelated product — saved us a full re-tool. Worth the extra week.",
        timestamp: "40 mins ago",
        helpfulCount: 6,
      },
    ],
  },
  {
    id: "nexus-002",
    title:
      "Does a QCO under IS 302 apply to a small kitchen appliance we only sell as a bundled accessory?",
    excerpt:
      "Trying to work out whether an electric appliance sold only as a bundled accessory to a larger product still needs its own BIS registration.",
    content:
      "We import a compact electric appliance that we only ever sell bundled inside a larger kit — it's never listed or sold as a standalone SKU. Does the household electrical appliance QCO still apply to it on its own, or does bundling change how it's classified? Want to get this right before our next shipment clears customs.",
    authorName: "Farhan Qureshi",
    authorRole: "Regulatory Affairs Lead",
    authorOrg: "Brightline Home Appliances",
    authorAvatarTone: "clay",
    date: "Yesterday",
    category: "regulatory",
    verificationStatus: "verified",
    repliesCount: 1,
    viewsCount: 588,
    tags: ["IS 302", "QCO", "Imports", "Bundled Products"],
    replies: [
      {
        id: "reply-3",
        authorName: "Meera Pillai",
        authorRole: "Quality Assurance Head",
        authorOrg: "Suvarna Ornaments",
        authorAvatarTone: "navy",
        isVerifiedExpert: true,
        content:
          "The QCO applies to the product itself, not to how it's merchandised — if the item falls within the notified scope, bundling it inside another kit doesn't exempt it. Worth confirming the exact product description against the notified scope with your registration consultant before the next shipment.",
        timestamp: "20 hours ago",
        helpfulCount: 15,
        citations: [
          {
            code: "IS 302",
            title: "Safety of Household Electrical Appliances",
          },
        ],
      },
    ],
  },
  {
    id: "nexus-003",
    title:
      "Re-hallmarking gold jewellery after a repair — same purity grade or full re-assay under IS 1417?",
    excerpt:
      "Question on whether jewellery returned for a minor repair needs a full re-assay before it can be sold again, or whether the original purity grade still stands.",
    content:
      "A customer returned a piece for a minor clasp repair — no gold was added or removed, just soldering on the existing clasp. Do we need to send it through a full re-assay before it goes back on the shelf, or does the original hallmark purity grade still hold since the composition didn't change?",
    authorName: "Meera Pillai",
    authorRole: "Quality Assurance Head",
    authorOrg: "Suvarna Ornaments",
    authorAvatarTone: "navy",
    date: "2 days ago",
    category: "certification",
    verificationStatus: "discussed",
    repliesCount: 1,
    viewsCount: 349,
    tags: ["IS 1417", "Hallmarking", "Gold Jewellery", "Repairs"],
    replies: [
      {
        id: "reply-4",
        authorName: "Ritesh Bhatt",
        authorRole: "Quality Assurance Manager",
        authorOrg: "Clearspring Beverages",
        authorAvatarTone: "sage",
        isVerifiedExpert: false,
        content:
          "We've seen jewellers in our network treat any solder or added metal as grounds for re-assay, purely to avoid disputes later — even when the added amount is tiny. Might be worth doing the same here even if it's not strictly required, just for the paper trail.",
        timestamp: "1 day ago",
        helpfulCount: 8,
      },
    ],
  },
  {
    id: "nexus-004",
    title:
      "How often should in-house labs re-run the full parameter panel for packaged water under IS 14543?",
    excerpt:
      "Asking what a reasonable internal testing cadence looks like for the full parameter panel versus a lighter routine check between batches.",
    content:
      "Our in-house lab runs a lighter daily check on packaged water batches, but I want to sanity-check our cadence for the full parameter panel against what other plants are doing. Weekly feels aggressive for our batch volume — is that overkill, or is it closer to the norm for plants our size?",
    authorName: "Ritesh Bhatt",
    authorRole: "Quality Assurance Manager",
    authorOrg: "Clearspring Beverages",
    authorAvatarTone: "sage",
    date: "3 days ago",
    category: "testing",
    verificationStatus: "verified",
    repliesCount: 1,
    viewsCount: 501,
    tags: ["IS 14543", "Packaged Water", "In-house Testing", "Lab Cadence"],
    replies: [
      {
        id: "reply-5",
        authorName: "Kavita Nair",
        authorRole: "Production Head",
        authorOrg: "Suraksha Cookware Works",
        authorAvatarTone: "clay",
        isVerifiedExpert: false,
        content:
          "Not a water bottler, but for our own periodic surveillance testing we settled on a cadence after comparing notes with two other plants in our sector — weekly wasn't unusual for mid-volume lines. Might be worth asking your surveillance auditor directly what cadence they'd expect to see logged.",
        timestamp: "2 days ago",
        helpfulCount: 11,
        citations: [
          {
            code: "IS 14543",
            title: "Packaged Natural Mineral Water — Specification",
          },
        ],
      },
    ],
  },
  {
    id: "nexus-005",
    title:
      "What in-line checks are realistic for pressure cooker gasket seating during high-volume production under IS 2347?",
    excerpt:
      "Looking for practical in-line check ideas for gasket seating on a high-volume line, without slowing the line down too much.",
    content:
      "We're scaling up production and want to add an in-line check for gasket seating before cookers go into their final safety valve check. Sampling every unit isn't realistic at our line speed — has anyone landed on a sampling rate or a quick visual/pressure check that catches seating issues without becoming a bottleneck?",
    authorName: "Kavita Nair",
    authorRole: "Production Head",
    authorOrg: "Suraksha Cookware Works",
    authorAvatarTone: "clay",
    date: "4 days ago",
    category: "implementation",
    verificationStatus: "open",
    repliesCount: 0,
    viewsCount: 203,
    tags: ["IS 2347", "Pressure Cookers", "Factory QC", "Line Sampling"],
    replies: [],
  },
  {
    id: "nexus-006",
    title:
      "Does a toy resold by an unrelated marketplace seller still need to carry the original manufacturer's IS 9873 conformity marking?",
    excerpt:
      "Question on whether resale through a marketplace changes what conformity marking needs to stay visible on the product.",
    content:
      "We license our toy design to a manufacturer who holds the IS 9873 registration and marking. A marketplace seller unrelated to either of us has started reselling the product. Does the conformity marking obligation follow the physical product regardless of who's reselling it, or does something change once it passes through a third-party seller?",
    authorName: "Owais Ahmed",
    authorRole: "Compliance Consultant",
    authorOrg: "Playnest Toys India",
    authorAvatarTone: "navy",
    date: "5 days ago",
    category: "conformity",
    verificationStatus: "expert_verified",
    repliesCount: 1,
    viewsCount: 275,
    tags: ["IS 9873", "Toys", "Marketplace Resale", "Conformity Marking"],
    replies: [
      {
        id: "reply-6",
        authorName: "Ananya Kulkarni",
        authorRole: "Chief Compliance Engineer",
        authorOrg: "Shaurya Safety Gear Pvt. Ltd.",
        authorAvatarTone: "navy",
        isVerifiedExpert: true,
        content:
          "The marking obligation attaches to the physical product as manufactured, not to whoever is currently selling it — a reseller can't remove or alter it, but they also don't need a marking of their own as long as the original one stays intact and unaltered.",
        timestamp: "4 days ago",
        helpfulCount: 17,
        citations: [
          {
            code: "IS 9873 (Part 1):2025",
            title: "Safety of Toys: Mechanical and Physical Properties",
          },
        ],
      },
    ],
  },
];
