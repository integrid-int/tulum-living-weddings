#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "next-sanity";

const DEFAULT_SITE_URL = "https://www.tulumlivingweddings.com";
const DEFAULT_API_VERSION = "2026-01-01";
const HOME_HERO_IMAGE = "https://www.tulumlivingweddings.com/wp-content/uploads/2018/02/tulumbeachwedding.jpg";
const GALLERY_IMAGE_SOURCES = [
  "https://www.tulumlivingweddings.com/wp-content/gallery/venues-and-ceremonies/Tulum-Wedding-ceremony.jpg",
  "https://www.tulumlivingweddings.com/wp-content/gallery/flowers/Tulum-Wedding-Flowers.jpg",
  "https://www.tulumlivingweddings.com/wp-content/gallery/food-and-beverage/Tulum-Wedding-Food-and-Drinks.jpg",
  "https://www.tulumlivingweddings.com/wp-content/gallery/entertainment-and-shows/Tulum-wedding-entertainment.jpg",
  "https://www.tulumlivingweddings.com/wp-content/gallery/captured-moments-from-photographers/Tulum-wedding-photographer5.jpg",
  "https://www.tulumlivingweddings.com/wp-content/gallery/venues-and-ceremonies/Tulum-Wedding-Venue15.jpg"
];
const TESTIMONIAL_IMAGE_SOURCES = [
  "https://www.tulumlivingweddings.com/wp-content/uploads/2017/09/LG_Wedding_0273-300x200.jpg",
  "https://www.tulumlivingweddings.com/wp-content/uploads/2018/02/weddingcouplewithmariachis-300x200.jpg",
  "https://www.tulumlivingweddings.com/wp-content/uploads/2018/02/Tulum-Living-Fire-Show-245x300.jpg"
];

function blockContent(text) {
  return [
    {
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          marks: [],
          text
        }
      ]
    }
  ];
}

export const ORIGINAL_SEED_DATA = {
  navigation: {
    id: "navigation.main",
    title: "Primary navigation",
    items: [
      { label: "Home", href: `${DEFAULT_SITE_URL}/` },
      { label: "How We Can Help", href: `${DEFAULT_SITE_URL}/how-we-can-help` },
      { label: "So- Why Us?", href: `${DEFAULT_SITE_URL}/so-why-us` },
      { label: "Gallery", href: `${DEFAULT_SITE_URL}/gallery` },
      { label: "Testimonials", href: `${DEFAULT_SITE_URL}/testimonials` },
      { label: "FAQ", href: `${DEFAULT_SITE_URL}/faq` },
      { label: "Pricing", href: `${DEFAULT_SITE_URL}/pricing` },
      { label: "Contact", href: `${DEFAULT_SITE_URL}/contact` }
    ]
  },
  siteSettings: {
    id: "siteSettings.main",
    siteTitle: "Tulum Living Weddings & Events",
    defaultSeo: {
      title: "Tulum Living Weddings & Events",
      description:
        "Destination wedding planning in Tulum with full-service coordination, design, and trusted local vendor partnerships.",
      canonicalUrl: `${DEFAULT_SITE_URL}/`,
      noIndex: false
    }
  },
  pages: {
    home: {
      id: "page.home",
      title: "Welcome to Tulum Living Weddings and Events!",
      heroTitle: "Welcome to Tulum Living Weddings and Events!",
      heroSubtitle:
        "Congratulations on your engagement! Destination weddings in Tulum are magical, from white-sand beaches and turquoise waters to sacred cenotes and jungle settings. We have been planning weddings and events in Tulum since 2009.",
      heroImageUrl: HOME_HERO_IMAGE,
      primaryCta: {
        label: "Start planning your wedding",
        href: `${DEFAULT_SITE_URL}/contact`,
        openInNewTab: false
      },
      seo: {
        title: "Tulum Living Weddings & Events | Destination Wedding Planning",
        description:
          "Plan your destination wedding in Tulum with expert local coordination, design support, and trusted vendor partnerships.",
        canonicalUrl: `${DEFAULT_SITE_URL}/`,
        noIndex: false
      }
    },
    howWeCanHelp: {
      id: "page.how-we-help",
      title: "How we can help",
      intro:
        "From flowers, decor and design to photography, videography, sound, lighting, entertainment, and all the fun details, we collaborate with trusted local experts to bring your vision to life.",
      serviceBlocks: [
        {
          heading: "Flower, Decor & Design",
          description:
            "We work with talented florists and designers to create centerpieces, bridal bouquets, lounge setups, and lighting concepts tailored to your celebration."
        },
        {
          heading: "Photography and Videography",
          description:
            "Our media partners capture every key moment, from formal portraits and dance-floor highlights to unique cenote sessions."
        },
        {
          heading: "Sound, Lighting and Entertainment",
          description:
            "From ceremony audio and toasts to DJs, live performers, and production effects, we coordinate the full atmosphere."
        },
        {
          heading: "Guest Experience Details",
          description:
            "Airport transfers, welcome bags, excursions, beauty appointments, and event-week logistics are all managed in one coordinated plan."
        }
      ],
      primaryCta: {
        label: "Discuss your event details",
        href: `${DEFAULT_SITE_URL}/contact`,
        openInNewTab: false
      },
      seo: {
        title: "How We Can Help | Tulum Living Weddings",
        description:
          "Explore our wedding planning services in Tulum including decor, entertainment, guest logistics, and production support.",
        canonicalUrl: `${DEFAULT_SITE_URL}/how-we-can-help`,
        noIndex: false
      }
    },
    whyUs: {
      id: "page.why-us",
      title: "So- why us?",
      intro:
        "We believe the biggest planning stress points are communication and budget visibility. Our process keeps response times fast and your finances transparent from day one.",
      reasons: [
        {
          title: "Communication first",
          description:
            "We respond quickly and keep planning decisions moving so you never wonder what is happening behind the scenes."
        },
        {
          title: "Transparent budgeting",
          description:
            "We use structured tracking so every spend decision is visible, aligned, and easy to review throughout the planning cycle."
        },
        {
          title: "Deep local relationships",
          description:
            "After more than a decade in Tulum, we collaborate with trusted local vendors and guide you toward the best fit for your style."
        },
        {
          title: "Personal partnership",
          description:
            "We build long-term relationships with our couples and treat each celebration with care, ownership, and high-touch support."
        }
      ],
      primaryCta: {
        label: "Read client testimonials",
        href: `${DEFAULT_SITE_URL}/testimonials`,
        openInNewTab: false
      },
      seo: {
        title: "So- Why Us? | Tulum Living Weddings",
        description:
          "Learn how Tulum Living Weddings combines local expertise, transparent planning, and high-touch support for destination celebrations.",
        canonicalUrl: `${DEFAULT_SITE_URL}/so-why-us`,
        noIndex: false
      }
    },
    gallery: {
      id: "page.gallery",
      title: "Gallery of inspiration",
      intro:
        "Explore inspiration across venues and ceremonies, flowers and decor, entertainment, captured moments, and food and beverage.",
      seo: {
        title: "Gallery of Inspiration | Tulum Living Weddings",
        description:
          "Browse destination wedding inspiration from real Tulum celebrations, including decor, ceremonies, receptions, and entertainment.",
        canonicalUrl: `${DEFAULT_SITE_URL}/gallery`,
        noIndex: false
      }
    },
    testimonials: {
      id: "page.testimonials",
      title: "Testimonials",
      intro:
        "Couples and families consistently describe our process as organized, calm, and deeply supportive from planning through wedding weekend.",
      seo: {
        title: "Testimonials | Tulum Living Weddings",
        description:
          "Read real reviews from couples and guests who celebrated destination weddings in Tulum with our planning team.",
        canonicalUrl: `${DEFAULT_SITE_URL}/testimonials`,
        noIndex: false
      }
    },
    faq: {
      id: "page.faq",
      title: "Frequently asked questions",
      intro:
        "Answers to common planning questions for destination weddings in Tulum, from timelines and legal requirements to guest logistics.",
      seo: {
        title: "FAQ | Tulum Living Weddings",
        description:
          "Get quick answers about planning destination weddings in Tulum, including coordination timelines, vendors, and legal ceremony support.",
        canonicalUrl: `${DEFAULT_SITE_URL}/faq`,
        noIndex: false
      }
    },
    pricing: {
      id: "page.pricing",
      title: "Planning packages",
      intro:
        "Flexible planning packages tailored to your wedding scope, from advisory support to full-service coordination and event-week execution.",
      primaryCta: {
        label: "Book a planning consultation",
        href: `${DEFAULT_SITE_URL}/contact`,
        openInNewTab: false
      },
      seo: {
        title: "Planning Packages | Tulum Living Weddings",
        description:
          "Compare destination wedding planning packages in Tulum and find the support level that fits your event vision and budget.",
        canonicalUrl: `${DEFAULT_SITE_URL}/pricing`,
        noIndex: false
      }
    },
    contact: {
      id: "page.contact",
      title: "Contact us",
      intro:
        "Tell us about your event and we will guide next steps. The best way to reach us is by email and we respond promptly.",
      contactEmail: "TulumLiving@gmail.com",
      contactPhone: "+52 (984) 123-0456",
      submitButtonLabel: "Send your plans",
      successMessage: "Thank you for contacting Tulum Living Weddings. We will follow up shortly.",
      seo: {
        title: "Contact Us | Tulum Living Weddings",
        description:
          "Contact Tulum Living Weddings to start planning your destination wedding in Tulum with our local coordination team.",
        canonicalUrl: `${DEFAULT_SITE_URL}/contact`,
        noIndex: false
      }
    }
  },
  collections: {
    galleryItems: [
      {
        id: "gallery.beach-ceremony-hero",
        title: "Beach ceremony at golden hour",
        category: "Venues and Ceremonies",
        imageUrl: GALLERY_IMAGE_SOURCES[0],
        alt: "Beach wedding ceremony setup in Tulum",
        source: "manual",
        isFeatured: true,
        sortOrder: 1
      },
      {
        id: "gallery.flowers-and-decor",
        title: "Flowers and decor details",
        category: "Flowers and Decor",
        imageUrl: GALLERY_IMAGE_SOURCES[1],
        alt: "Destination wedding flowers and decor in Tulum",
        source: "manual",
        isFeatured: true,
        sortOrder: 2
      },
      {
        id: "gallery.food-and-beverage",
        title: "Food and beverage experience",
        category: "Food and Beverage",
        imageUrl: GALLERY_IMAGE_SOURCES[2],
        alt: "Wedding reception food and beverage service",
        source: "manual",
        isFeatured: true,
        sortOrder: 3
      },
      {
        id: "gallery.entertainment-show",
        title: "Entertainment and live shows",
        category: "Entertainment",
        imageUrl: GALLERY_IMAGE_SOURCES[3],
        alt: "Live wedding entertainment performance in Tulum",
        source: "manual",
        isFeatured: true,
        sortOrder: 4
      },
      {
        id: "gallery.captured-moments",
        title: "Captured moments from photographers",
        category: "Captured moments",
        imageUrl: GALLERY_IMAGE_SOURCES[4],
        alt: "Wedding photographer moment during beach reception",
        source: "manual",
        isFeatured: false,
        sortOrder: 5
      },
      {
        id: "gallery.destination-venue",
        title: "Destination venue inspiration",
        category: "Venues and Ceremonies",
        imageUrl: GALLERY_IMAGE_SOURCES[5],
        alt: "Tulum destination wedding venue with ocean backdrop",
        source: "manual",
        isFeatured: false,
        sortOrder: 6
      }
    ],
    testimonials: [
      {
        id: "testimonial.brandon",
        coupleName: "Brandon",
        eventType: "Destination Wedding",
        location: "Tulum",
        quote:
          "Mindy’s sincere desire to support every need set her apart. Her attention to detail, resourcefulness, and organizational skill made our wedding unforgettable.",
        imageUrl: TESTIMONIAL_IMAGE_SOURCES[0],
        imageAlt: "Wedding couple at beach ceremony in Tulum",
        isFeatured: true,
        sortOrder: 1
      },
      {
        id: "testimonial.kelly",
        coupleName: "Kelly",
        eventType: "Destination Wedding",
        location: "Tulum",
        quote:
          "From day one she was on top of everything and always available. She and her team were kind, honest, and always hustling to get the job done.",
        imageUrl: TESTIMONIAL_IMAGE_SOURCES[1],
        imageAlt: "Couple with mariachi musicians in Tulum",
        isFeatured: true,
        sortOrder: 2
      },
      {
        id: "testimonial.greg",
        coupleName: "Greg",
        eventType: "Destination Wedding",
        location: "Tulum",
        quote:
          "Every vendor was excellent and we barely had to coordinate anything ourselves. She adapted quickly and delivered a beautiful day our guests still talk about.",
        imageUrl: TESTIMONIAL_IMAGE_SOURCES[2],
        imageAlt: "Wedding entertainment show during reception",
        isFeatured: true,
        sortOrder: 3
      },
      {
        id: "testimonial.laura",
        coupleName: "Laura",
        eventType: "Destination Wedding",
        location: "Tulum",
        quote:
          "We worked together for two years and our wedding was nothing short of spectacular. Every detail was handled with care and precision.",
        imageUrl: TESTIMONIAL_IMAGE_SOURCES[0],
        imageAlt: "Couple portrait from destination wedding",
        isFeatured: false,
        sortOrder: 4
      },
      {
        id: "testimonial.andrea",
        coupleName: "Andrea",
        eventType: "Destination Wedding",
        location: "Tulum",
        quote:
          "Her organized, methodical approach instantly put us at ease. She delivered the exact result we hoped for and managed every detail beautifully.",
        imageUrl: TESTIMONIAL_IMAGE_SOURCES[1],
        imageAlt: "Bride and groom celebrating after ceremony",
        isFeatured: false,
        sortOrder: 5
      }
    ],
    faqItems: [
      {
        id: "faq.start-planning-timeline",
        question: "How far in advance should we start planning a Tulum destination wedding?",
        answer:
          "Most couples begin 9 to 14 months before their date. We can also support accelerated timelines with a focused planning roadmap.",
        category: "Planning",
        sortOrder: 1
      },
      {
        id: "faq.legal-ceremony",
        question: "Can you help us with legal ceremony requirements in Mexico?",
        answer:
          "Yes. We guide required documents, blood test coordination, and apostille support so your legal process is clear and manageable.",
        category: "Legal",
        sortOrder: 2
      },
      {
        id: "faq.vendor-management",
        question: "Do you coordinate vendors and contracts for us?",
        answer:
          "Absolutely. We curate trusted local vendors, coordinate communication, and keep all planning details aligned with your budget and vision.",
        category: "Vendors",
        sortOrder: 3
      },
      {
        id: "faq.guest-logistics",
        question: "Can you support guest logistics and event-week experiences?",
        answer:
          "Yes. We coordinate airport transfers, excursions, welcome details, and event-week schedules to make the guest experience seamless.",
        category: "Guest Experience",
        sortOrder: 4
      }
    ],
    pricingPackages: [
      {
        id: "pricing.planning-essentials",
        packageName: "Planning Essentials",
        summary: "Core planning support for couples who want local guidance and structure.",
        priceLabel: "Starting at $2,500 USD",
        inclusions: [
          "Initial planning strategy call",
          "Venue and vendor shortlist",
          "Budget and timeline roadmap",
          "Monthly planning check-ins"
        ],
        addOns: ["Guest transfer coordination", "Welcome event planning"],
        cta: {
          label: "Request package details",
          href: `${DEFAULT_SITE_URL}/contact`,
          openInNewTab: false
        },
        isFeatured: false,
        sortOrder: 1
      },
      {
        id: "pricing.signature-planning",
        packageName: "Signature Planning",
        summary: "Comprehensive planning and design support for full destination wedding execution.",
        priceLabel: "Starting at $5,500 USD",
        inclusions: [
          "Full vendor coordination",
          "Design and decor direction",
          "Production timeline management",
          "Ceremony and reception run-of-show"
        ],
        addOns: ["Welcome party design", "Post-wedding brunch planning"],
        cta: {
          label: "Book a consultation",
          href: `${DEFAULT_SITE_URL}/contact`,
          openInNewTab: false
        },
        isFeatured: true,
        sortOrder: 2
      },
      {
        id: "pricing.weekend-concierge",
        packageName: "Weekend Concierge",
        summary: "High-touch multi-day support for destination wedding weekends and guest experiences.",
        priceLabel: "Custom proposal",
        inclusions: [
          "On-site coordination team",
          "Multi-day event flow management",
          "Guest logistics oversight",
          "Vendor and production supervision"
        ],
        addOns: ["Excursion planning", "Private transportation management"],
        cta: {
          label: "Start weekend planning",
          href: `${DEFAULT_SITE_URL}/contact`,
          openInNewTab: false
        },
        isFeatured: true,
        sortOrder: 3
      }
    ]
  }
};

export function collectSeedImageUrls(seedData = ORIGINAL_SEED_DATA) {
  const urls = new Set();
  urls.add(seedData.pages.home.heroImageUrl);

  for (const galleryItem of seedData.collections.galleryItems) {
    urls.add(galleryItem.imageUrl);
  }

  for (const testimonial of seedData.collections.testimonials) {
    urls.add(testimonial.imageUrl);
  }

  return [...urls].filter(Boolean);
}

function imageFieldFromRef(imageAssetRefByUrl, url, alt) {
  const assetRef = imageAssetRefByUrl.get(url);
  if (!assetRef) {
    throw new Error(`Missing uploaded image asset reference for URL: ${url}`);
  }

  return {
    _type: "imageWithAlt",
    alt,
    image: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: assetRef
      }
    }
  };
}

function referenceArray(ids) {
  return ids.map((id) => ({
    _type: "reference",
    _ref: id
  }));
}

export function createSeedDocuments(seedData, imageAssetRefByUrl) {
  const galleryDocs = seedData.collections.galleryItems.map((item) => ({
    _id: item.id,
    _type: "galleryItem",
    title: item.title,
    category: item.category,
    images: [imageFieldFromRef(imageAssetRefByUrl, item.imageUrl, item.alt)],
    source: item.source,
    isFeatured: item.isFeatured,
    sortOrder: item.sortOrder
  }));

  const testimonialDocs = seedData.collections.testimonials.map((item) => ({
    _id: item.id,
    _type: "testimonial",
    coupleName: item.coupleName,
    eventType: item.eventType,
    location: item.location,
    quote: item.quote,
    image: imageFieldFromRef(imageAssetRefByUrl, item.imageUrl, item.imageAlt),
    isFeatured: item.isFeatured,
    sortOrder: item.sortOrder
  }));

  const faqDocs = seedData.collections.faqItems.map((item) => ({
    _id: item.id,
    _type: "faqItem",
    question: item.question,
    answer: blockContent(item.answer),
    category: item.category,
    sortOrder: item.sortOrder
  }));

  const pricingDocs = seedData.collections.pricingPackages.map((item) => ({
    _id: item.id,
    _type: "pricingPackage",
    packageName: item.packageName,
    summary: item.summary,
    priceLabel: item.priceLabel,
    inclusions: item.inclusions,
    addOns: item.addOns,
    cta: item.cta,
    isFeatured: item.isFeatured,
    sortOrder: item.sortOrder
  }));

  const navigationDoc = {
    _id: seedData.navigation.id,
    _type: "navigation",
    title: seedData.navigation.title,
    items: seedData.navigation.items.map((item) => ({
      _type: "cta",
      label: item.label,
      href: item.href,
      openInNewTab: false
    }))
  };

  const siteSettingsDoc = {
    _id: seedData.siteSettings.id,
    _type: "siteSettings",
    siteTitle: seedData.siteSettings.siteTitle,
    defaultSeo: seedData.siteSettings.defaultSeo,
    primaryNavigation: {
      _type: "reference",
      _ref: seedData.navigation.id
    }
  };

  const pageDocs = [
    {
      _id: seedData.pages.home.id,
      _type: "pageHome",
      title: seedData.pages.home.title,
      heroTitle: seedData.pages.home.heroTitle,
      heroSubtitle: seedData.pages.home.heroSubtitle,
      heroImage: imageFieldFromRef(
        imageAssetRefByUrl,
        seedData.pages.home.heroImageUrl,
        "Beach destination wedding setup in Tulum"
      ),
      primaryCta: seedData.pages.home.primaryCta,
      featuredGalleryItems: referenceArray(seedData.collections.galleryItems.slice(0, 4).map((item) => item.id)),
      featuredTestimonials: referenceArray(seedData.collections.testimonials.slice(0, 3).map((item) => item.id)),
      featuredPackages: referenceArray(seedData.collections.pricingPackages.slice(0, 2).map((item) => item.id)),
      seo: seedData.pages.home.seo
    },
    {
      _id: seedData.pages.howWeCanHelp.id,
      _type: "pageHowWeHelp",
      title: seedData.pages.howWeCanHelp.title,
      intro: seedData.pages.howWeCanHelp.intro,
      serviceBlocks: seedData.pages.howWeCanHelp.serviceBlocks,
      primaryCta: seedData.pages.howWeCanHelp.primaryCta,
      seo: seedData.pages.howWeCanHelp.seo
    },
    {
      _id: seedData.pages.whyUs.id,
      _type: "pageWhyUs",
      title: seedData.pages.whyUs.title,
      intro: seedData.pages.whyUs.intro,
      reasons: seedData.pages.whyUs.reasons,
      primaryCta: seedData.pages.whyUs.primaryCta,
      seo: seedData.pages.whyUs.seo
    },
    {
      _id: seedData.pages.gallery.id,
      _type: "pageGallery",
      title: seedData.pages.gallery.title,
      intro: seedData.pages.gallery.intro,
      featuredItems: referenceArray(seedData.collections.galleryItems.slice(0, 4).map((item) => item.id)),
      seo: seedData.pages.gallery.seo
    },
    {
      _id: seedData.pages.testimonials.id,
      _type: "pageTestimonials",
      title: seedData.pages.testimonials.title,
      intro: seedData.pages.testimonials.intro,
      featuredTestimonials: referenceArray(seedData.collections.testimonials.slice(0, 4).map((item) => item.id)),
      seo: seedData.pages.testimonials.seo
    },
    {
      _id: seedData.pages.faq.id,
      _type: "pageFaq",
      title: seedData.pages.faq.title,
      intro: seedData.pages.faq.intro,
      featuredFaqItems: referenceArray(seedData.collections.faqItems.map((item) => item.id)),
      seo: seedData.pages.faq.seo
    },
    {
      _id: seedData.pages.pricing.id,
      _type: "pagePricing",
      title: seedData.pages.pricing.title,
      intro: seedData.pages.pricing.intro,
      featuredPackages: referenceArray(seedData.collections.pricingPackages.map((item) => item.id)),
      primaryCta: seedData.pages.pricing.primaryCta,
      seo: seedData.pages.pricing.seo
    },
    {
      _id: seedData.pages.contact.id,
      _type: "pageContact",
      title: seedData.pages.contact.title,
      intro: seedData.pages.contact.intro,
      contactEmail: seedData.pages.contact.contactEmail,
      contactPhone: seedData.pages.contact.contactPhone,
      submitButtonLabel: seedData.pages.contact.submitButtonLabel,
      successMessage: seedData.pages.contact.successMessage,
      seo: seedData.pages.contact.seo
    }
  ];

  return [navigationDoc, siteSettingsDoc, ...galleryDocs, ...testimonialDocs, ...faqDocs, ...pricingDocs, ...pageDocs];
}

function parseArgs(argv) {
  const args = {
    apply: false,
    dryRun: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--apply") {
      args.apply = true;
      continue;
    }

    if (current === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (current === "--output" && next) {
      args.output = next;
      index += 1;
      continue;
    }

    if (current === "--project-id" && next) {
      args.projectId = next;
      index += 1;
      continue;
    }

    if (current === "--dataset" && next) {
      args.dataset = next;
      index += 1;
      continue;
    }

    if (current === "--token" && next) {
      args.token = next;
      index += 1;
      continue;
    }

    if (current === "--help" || current === "-h") {
      args.help = true;
      continue;
    }

    throw new Error(`Unknown argument: ${current}`);
  }

  return args;
}

function printUsage() {
  console.log(`Seed original Tulum Living site content into Sanity

Usage:
  node scripts/seed-original-site-content.mjs --dry-run
  node scripts/seed-original-site-content.mjs --apply
  node scripts/seed-original-site-content.mjs --apply --project-id <id> --dataset production --token <token>

Options:
  --apply            Upload images and upsert seed documents to Sanity.
  --dry-run          Build seed payload without writing to Sanity.
  --output <file>    Write generated seed documents to a local JSON file.
  --project-id <id>  Override NEXT_PUBLIC_SANITY_PROJECT_ID
  --dataset <name>   Override NEXT_PUBLIC_SANITY_DATASET
  --token <token>    Override SANITY_API_WRITE_TOKEN
`);
}

function resolveRuntimeConfig(args) {
  const projectId = args.projectId ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = args.dataset ?? process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = args.token ?? process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    throw new Error(
      "Missing Sanity write config. Provide project id, dataset, and SANITY_API_WRITE_TOKEN (or --token)."
    );
  }

  return {
    projectId,
    dataset,
    token,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || DEFAULT_API_VERSION
  };
}

async function uploadSeedImages(client, urls) {
  const uploadedRefs = new Map();
  for (const url of urls) {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36"
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download image ${url}: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    const filename = basename(new URL(url).pathname) || "seed-image.jpg";

    const asset = await client.assets.upload("image", imageBuffer, {
      filename,
      contentType
    });
    uploadedRefs.set(url, asset._id);
  }

  return uploadedRefs;
}

async function runSeed(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (args.help) {
    printUsage();
    return 0;
  }

  if (args.dryRun && args.apply) {
    throw new Error("Use either --dry-run or --apply, not both.");
  }

  if (!args.apply) {
    const imageRefs = new Map(
      collectSeedImageUrls(ORIGINAL_SEED_DATA).map((url, index) => [url, `image-dryrun-${index}-seed`])
    );
    const documents = createSeedDocuments(ORIGINAL_SEED_DATA, imageRefs);
    const summary = {
      mode: "dry-run",
      documents: documents.length,
      imageUrls: imageRefs.size,
      singletonPages: documents.filter((doc) => doc._type.startsWith("page")).length
    };

    console.log(JSON.stringify(summary, null, 2));
    if (args.output) {
      const outputPath = resolve(args.output);
      await writeFile(outputPath, `${JSON.stringify(documents, null, 2)}\n`, "utf8");
      console.log(`Wrote dry-run payload to ${outputPath}`);
    }
    return 0;
  }

  const config = resolveRuntimeConfig(args);
  const client = createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    token: config.token,
    apiVersion: config.apiVersion,
    useCdn: false
  });

  const imageUrls = collectSeedImageUrls(ORIGINAL_SEED_DATA);
  const uploadedRefs = await uploadSeedImages(client, imageUrls);
  const documents = createSeedDocuments(ORIGINAL_SEED_DATA, uploadedRefs);

  let transaction = client.transaction();
  for (const document of documents) {
    transaction = transaction.createOrReplace(document);
  }

  await transaction.commit();
  console.log(
    JSON.stringify(
      {
        mode: "apply",
        uploadedImages: uploadedRefs.size,
        upsertedDocuments: documents.length,
        dataset: config.dataset,
        projectId: config.projectId
      },
      null,
      2
    )
  );

  return 0;
}

function isMainModule() {
  if (!process.argv[1]) {
    return false;
  }

  return import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
}

if (isMainModule()) {
  runSeed().then((code) => {
    if (code !== 0) {
      process.exit(code);
    }
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
