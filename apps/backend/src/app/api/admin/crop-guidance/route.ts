import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/dev-db';
import { revalidateFrontendPath } from '@/lib/revalidation-dispatcher';
import {
  CropGuidancePageContent,
  CropMasterGuide,
  DEFAULT_CROP_GUIDANCE_PAGE_CONTENT,
  DEFAULT_CROP_GUIDANCE_STAGES,
  DEFAULT_CROP_MASTER_GUIDES,
  GuideTableSection,
} from '@/lib/crop-guidance-defaults';

export interface CropGuidanceItem {
  id: string;
  stageNumber: number;
  crop?: string;
  title: string;
  checklistTitle?: string;
  subtitle: string;
  summary: string;
  keyActions: string[];
  recommendedTools: string[];
  recommendedProducts?: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function getAllDevDbFilePaths(): string[] {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, 'data', 'dev-database.json'),
    path.resolve(cwd, 'apps', 'backend', 'data', 'dev-database.json'),
    path.resolve(cwd, 'apps', 'frontend', 'data', 'dev-database.json'),
    path.resolve(cwd, '..', 'backend', 'data', 'dev-database.json'),
    path.resolve(cwd, '..', 'frontend', 'data', 'dev-database.json'),
    path.resolve(cwd, '..', '..', 'apps', 'backend', 'data', 'dev-database.json'),
    path.resolve(cwd, '..', '..', 'apps', 'frontend', 'data', 'dev-database.json'),
  ];
  return Array.from(new Set(candidates)).filter((p) => fs.existsSync(p));
}

let cropGuidanceSyncTimer: ReturnType<typeof setTimeout> | null = null;

function syncCropGuidanceToAllFiles(db: any) {
  writeDb(db);
  if (cropGuidanceSyncTimer) {
    clearTimeout(cropGuidanceSyncTimer);
  }
  cropGuidanceSyncTimer = setTimeout(async () => {
    for (const filePath of getAllDevDbFilePaths()) {
      try {
        const raw = await fs.promises.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        parsed.cropGuidance = db.cropGuidance;
        parsed.cropGuidanceMasterGuides = db.cropGuidanceMasterGuides;
        parsed.cropGuidancePageContent = db.cropGuidancePageContent;
        await fs.promises.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
      } catch {}
    }
  }, 25);
}

function ensureCropGuidanceInitialized(db: any) {
  let changed = false;
  if (!Array.isArray(db.cropGuidance) || db.cropGuidance.length === 0) {
    db.cropGuidance = JSON.parse(JSON.stringify(DEFAULT_CROP_GUIDANCE_STAGES));
    changed = true;
  }
  if (!Array.isArray(db.cropGuidanceMasterGuides) || db.cropGuidanceMasterGuides.length === 0) {
    db.cropGuidanceMasterGuides = JSON.parse(JSON.stringify(DEFAULT_CROP_MASTER_GUIDES));
    changed = true;
  }
  if (!db.cropGuidancePageContent) {
    db.cropGuidancePageContent = JSON.parse(JSON.stringify(DEFAULT_CROP_GUIDANCE_PAGE_CONTENT));
    changed = true;
  }
  if (changed) {
    syncCropGuidanceToAllFiles(db);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const crop = searchParams.get('crop');
    const status = searchParams.get('status'); // 'active' | 'inactive' | 'all'

    const db = readDb();
    ensureCropGuidanceInitialized(db);

    let items: CropGuidanceItem[] = (db.cropGuidance || []).slice();

    if (search) {
      items = items.filter(
        (i) =>
          i.title?.toLowerCase().includes(search) ||
          i.subtitle?.toLowerCase().includes(search) ||
          i.summary?.toLowerCase().includes(search) ||
          (i.keyActions || []).some((a) => a.toLowerCase().includes(search))
      );
    }

    if (crop && crop !== 'All' && crop !== 'ALL') {
      items = items.filter(
        (i) => !i.crop || i.crop === 'All Crops' || i.crop.toLowerCase() === crop.toLowerCase()
      );
    }

    if (status === 'active') {
      items = items.filter((i) => i.isActive);
    } else if (status === 'inactive') {
      items = items.filter((i) => !i.isActive);
    }

    items.sort((a, b) => {
      const orderA = a.stageNumber ?? a.displayOrder ?? 0;
      const orderB = b.stageNumber ?? b.displayOrder ?? 0;
      return orderA - orderB;
    });

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
      stages: items,
      masterGuides: db.cropGuidanceMasterGuides || DEFAULT_CROP_MASTER_GUIDES,
      pageContent: {
        ...DEFAULT_CROP_GUIDANCE_PAGE_CONTENT,
        ...(db.cropGuidancePageContent || {}),
      },
      dbSynced: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch crop guidance items' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const entity = body.entity || 'stage';
    const db = readDb();
    ensureCropGuidanceInitialized(db);

    // 1. Create a new Crop Master Guide (e.g., Chilli, Tomato, Rose, etc.)
    if (entity === 'masterGuide') {
      const name = (body.name || '').trim();
      if (!name) {
        return NextResponse.json(
          { success: false, message: 'Crop Name is required' },
          { status: 400 }
        );
      }
      const id =
        (body.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, '') ||
        `crop-${Date.now()}`;

      const defaultSections: GuideTableSection[] = Array.isArray(body.sections)
        ? body.sections
        : [
            {
              title: `${name} Cultivation Stages & Growth Guide`,
              badge: 'Cultivation & Growth Stages',
              theme: 'emerald',
              headers: [
                'Stage Name',
                'Key Objectives & Activities',
                'Field Management & Best Practices',
                'Farmer Verification Check',
              ],
              rows: [
                [
                  'Land Preparation',
                  'Select sunny location with good drainage; test soil pH, EC, and nutrient status; remove weeds, stones, and crop residues.',
                  'Prepare fine soil and raised beds where drainage is needed. Incorporate well-decomposed organic manure according to soil test and local recommendations. Plan irrigation and drainage facilities.',
                  'Is the soil suitable, fertile, well-drained, and free of weeds?',
                ],
                [
                  'Planting & Establishment',
                  'Select healthy, disease-free plants suited to the intended market; follow recommended spacing for variety and production system.',
                  'Plant carefully without damaging roots. Irrigate after planting as needed. Replace dead or weak plants and monitor establishment.',
                  'Are the plants establishing uniformly across the field?',
                ],
                [
                  'Vegetative Growth',
                  'Maintain appropriate soil moisture; apply fertilizers based on plant growth and nutrient requirements.',
                  'Remove weeds and monitor new shoots. Check regularly for aphids, thrips, mites, leaf spots, powdery mildew, and downy mildew.',
                  'Are leaves green and shoots growing normally without pest/disease stress?',
                ],
                [
                  'Pruning & Canopy Management',
                  'Prune or train according to variety, growing system, and target flowering schedule.',
                  'Remove dead, diseased, and weak branches. Maintain proper plant structure and airflow. Clean pruning tools and dispose of infected plant material appropriately.',
                  'Are healthy new shoots developing uniformly?',
                ],
                [
                  'Bud Formation & Flowering / Fruiting',
                  'Maintain balanced nutrition and suitable irrigation; monitor bud/flower development and quality.',
                  'Inspect buds, flowers, and young shoots for thrips, mites, and borers. Check for deformation, drop, and disease symptoms. Use verified crop-protection measures when necessary.',
                  'Are buds/flowers developing uniformly with good quality?',
                ],
                [
                  'Harvesting & Postharvest',
                  'Harvest at the appropriate maturity stage for the target market.',
                  'Use clean, sharp harvesting tools. Handle produce gently to avoid bruising and damage. Grade according to size and quality, and transport promptly.',
                  'Is the harvested produce meeting market requirements for freshness and quality?',
                ],
              ],
            },
            {
              title: `Major ${name} Pests - Symptoms & Management`,
              badge: 'Pest Diagnostics & IPM',
              theme: 'amber',
              headers: [
                'Pest Common Name',
                'Common Symptoms & Field Signs',
                'Cultural & IPM Management',
                'Recommended Chemical / Active Ingredients',
              ],
              rows: [
                [
                  'Aphids',
                  'Clusters of small insects on tender shoots and buds, curled leaves, sticky honeydew, and distorted growth.',
                  'Remove severely infested shoots where practical, monitor regularly, and conserve natural enemies such as ladybird beetles.',
                  'Acetamiprid, Flonicamid',
                ],
                [
                  'Thrips',
                  'Silvery or brown scars on leaves/petals, damaged buds, and deformed growth.',
                  'Inspect tender buds and leaves, install blue/yellow sticky traps, and maintain field sanitation.',
                  'Spinetoram, Spinosad',
                ],
                [
                  'Spider Mites',
                  'Fine yellow speckling, bronzing, leaf drying, and fine webbing on leaf undersides.',
                  'Inspect leaf undersides regularly, reduce dust stress, and avoid conditions that favor mite outbreaks.',
                  'Abamectin, Hexythiazox',
                ],
                [
                  'Caterpillars / Borers',
                  'Irregular holes in leaves, bored buds/fruits, and visible larvae or frass.',
                  'Handpick larvae where practical, use pheromone traps, and remove damaged plant parts.',
                  'Emamectin benzoate, Chlorantraniliprole',
                ],
              ],
            },
            {
              title: `Major ${name} Diseases - Symptoms & Management`,
              badge: 'Disease Management',
              theme: 'rose',
              headers: [
                'Disease Name',
                'Common Symptoms & Field Signs',
                'Cultural & Preventive Management',
                'Recommended Fungicide / Bactericide Active Ingredients',
              ],
              rows: [
                [
                  'Powdery Mildew',
                  'White powdery fungal growth on leaves, stems, and buds; leaf curling and stunted growth.',
                  'Maintain proper spacing and airflow, avoid excess nitrogen, and remove infected tissues early.',
                  'Myclobutanil, Tebuconazole + Trifloxystrobin',
                ],
                [
                  'Downy Mildew',
                  'Purplish-brown irregular spots on upper leaf surfaces with downy growth underneath; rapid defoliation in humid weather.',
                  'Improve greenhouse/field ventilation, avoid overhead wetting late in the day, and remove fallen leaves.',
                  'Mandipropamid, Dimethomorph',
                ],
                [
                  'Leaf Spot / Blight',
                  'Circular brown or black spots with yellow halos on leaves, leading to premature leaf drop.',
                  'Remove infected leaves, practice crop sanitation, and avoid water splash on foliage.',
                  'Azoxystrobin, Mancozeb',
                ],
              ],
            },
            {
              title: `${name} Nutrient Deficiencies & Physiological Disorders`,
              badge: 'Nutrition & Disorders',
              theme: 'sky',
              headers: [
                'Nutrient / Disorder',
                'Deficiency / Disorder Symptoms',
                'Preventive & Cultural Management',
                'Corrective Foliar / Soil Application',
              ],
              rows: [
                [
                  'Nitrogen (N) Deficiency',
                  'Uniform pale green to yellowing of older leaves first; stunted shoot growth and thin stems.',
                  'Apply balanced basal and split nitrogen doses based on soil test and crop stage.',
                  'Urea or Water-Soluble NPK (19:19:19) fertigation/foliar spray',
                ],
                [
                  'Iron (Fe) Deficiency',
                  'Interveinal chlorosis (yellowing between green veins) on young terminal leaves.',
                  'Check and correct high soil pH, avoid waterlogging, and improve root aeration.',
                  'Foliar spray of Chelated Iron (Fe-EDTA / Fe-EDDHA)',
                ],
                [
                  'Boron (B) & Calcium (Ca) Deficiency',
                  'Deformed buds, brittle young leaves, flower/fruit drop, or tip burn.',
                  'Maintain uniform soil moisture to support calcium uptake and apply micronutrients on schedule.',
                  'Calcium Nitrate + Solubor (Boron 20%) foliar application',
                ],
              ],
            },
          ];

      const newCropGuide: CropMasterGuide = {
        id,
        name,
        category: (body.category || 'Commercial Horticulture & Field Crop').trim(),
        tagline: (
          body.tagline ||
          `Complete ${name} Cultivation Stages, Pest & Disease IPM, and Nutrient Management`
        ).trim(),
        sections: defaultSections,
      };

      const existingIdx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === id
      );
      if (existingIdx >= 0) {
        newCropGuide.id = `${id}-${Date.now()}`;
      }
      db.cropGuidanceMasterGuides.push(newCropGuide);
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}

      return NextResponse.json({
        success: true,
        data: newCropGuide,
        masterGuides: db.cropGuidanceMasterGuides,
        message: `Crop guide "${name}" created successfully`,
      });
    }

    // 2. Add a new Table Section inside a Crop Master Guide (Blank by default)
    if (entity === 'masterSection') {
      const { cropId, section } = body;
      const guideIdx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === cropId
      );
      if (guideIdx === -1) {
        return NextResponse.json({ success: false, message: 'Crop guide not found' }, { status: 404 });
      }
      const headers =
        Array.isArray(section?.headers) && section.headers.length > 0
          ? section.headers.map((h: any) => String(h ?? ''))
          : ['', '', '', ''];
      const colCount = headers.length;
      const rows =
        Array.isArray(section?.rows)
          ? section.rows.map((r: any) =>
              Array.isArray(r)
                ? Array.from({ length: colCount }, (_, i) => String(r[i] ?? ''))
                : Array(colCount).fill('')
            )
          : [Array(colCount).fill('')];

      const newSec: GuideTableSection = {
        title: section?.title !== undefined ? String(section.title) : '',
        badge: section?.badge !== undefined ? String(section.badge) : '',
        theme: section?.theme || 'emerald',
        headers,
        rows,
      };
      db.cropGuidanceMasterGuides[guideIdx].sections.push(newSec);
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}

      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'New blank section added to crop guide',
      });
    }

    // 3. Add a new Column inside a Section of a Crop Master Guide
    if (entity === 'masterColumn') {
      const { cropId, sectionIndex, header } = body;
      const guideIdx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === cropId
      );
      if (guideIdx === -1) {
        return NextResponse.json({ success: false, message: 'Crop guide not found' }, { status: 404 });
      }
      const sec = db.cropGuidanceMasterGuides[guideIdx].sections?.[Number(sectionIndex)];
      if (!sec) {
        return NextResponse.json({ success: false, message: 'Section not found' }, { status: 404 });
      }
      if (!Array.isArray(sec.headers)) sec.headers = [];
      sec.headers.push(header !== undefined ? String(header) : '');
      const newColLen = sec.headers.length;
      if (Array.isArray(sec.rows)) {
        sec.rows = sec.rows.map((r: string[]) => {
          const nextRow = Array.isArray(r) ? [...r] : [];
          while (nextRow.length < newColLen) nextRow.push('');
          return nextRow;
        });
      }
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}

      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Column added successfully',
      });
    }

    // 4. Add a new Row inside a Section of a Crop Master Guide
    if (entity === 'masterRow') {
      const { cropId, sectionIndex, row } = body;
      const guideIdx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === cropId
      );
      if (guideIdx === -1) {
        return NextResponse.json({ success: false, message: 'Crop guide not found' }, { status: 404 });
      }
      const sec = db.cropGuidanceMasterGuides[guideIdx].sections?.[Number(sectionIndex)];
      if (!sec) {
        return NextResponse.json({ success: false, message: 'Section not found' }, { status: 404 });
      }
      const colCount = sec.headers?.length || 4;
      const cleanRow = Array.isArray(row)
        ? Array.from({ length: colCount }, (_, i) => String(row[i] ?? ''))
        : Array(colCount).fill('');
      sec.rows.push(cleanRow);
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}

      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Row added successfully',
      });
    }

    // 4. Default: Create a new 7-Stage Agricultural Production Stage
    const {
      title,
      checklistTitle,
      subtitle,
      summary,
      stageNumber,
      crop,
      keyActions,
      recommendedTools,
      recommendedProducts,
      displayOrder,
      isActive,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, message: 'Stage Title is required' },
        { status: 400 }
      );
    }

    const newItem: CropGuidanceItem = {
      id: body.id || `cg-stage-${Date.now()}`,
      stageNumber: Number(stageNumber) || db.cropGuidance.length + 1,
      crop: crop || 'All Crops',
      title: title.trim(),
      checklistTitle: (checklistTitle || 'Agronomist Action Checklist').trim(),
      subtitle: (subtitle || '').trim(),
      summary: (summary || '').trim(),
      keyActions: Array.isArray(keyActions)
        ? keyActions.filter((a) => typeof a === 'string' && a.trim().length > 0)
        : [],
      recommendedTools: Array.isArray(recommendedTools)
        ? recommendedTools.filter((t) => typeof t === 'string' && t.trim().length > 0)
        : [],
      recommendedProducts: Array.isArray(recommendedProducts)
        ? recommendedProducts.filter((p) => typeof p === 'string' && p.trim().length > 0)
        : [],
      displayOrder: Number(displayOrder) || db.cropGuidance.length + 1,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.cropGuidance.push(newItem);
    syncCropGuidanceToAllFiles(db);

    try {
      await revalidateFrontendPath('/crop-guidance');
    } catch {}

    return NextResponse.json({
      success: true,
      data: newItem,
      stages: db.cropGuidance,
      message: 'Crop guidance stage created successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create crop guidance item' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const entity = body.entity || 'stage';
    const db = readDb();
    ensureCropGuidanceInitialized(db);

    // 1. Update Page Content (Hero & Banner Text)
    if (entity === 'pageContent') {
      const nextContent: CropGuidancePageContent = {
        ...DEFAULT_CROP_GUIDANCE_PAGE_CONTENT,
        ...(db.cropGuidancePageContent || {}),
        ...(body.pageContent || body),
      };
      delete (nextContent as any).entity;
      db.cropGuidancePageContent = nextContent;
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}

      return NextResponse.json({
        success: true,
        pageContent: db.cropGuidancePageContent,
        message: 'Crop Guidance page banner & hero content updated',
      });
    }

    // 2. Replace all Master Guides at once
    if (entity === 'masterGuidesAll') {
      if (Array.isArray(body.masterGuides)) {
        db.cropGuidanceMasterGuides = body.masterGuides;
        syncCropGuidanceToAllFiles(db);
        try {
          await revalidateFrontendPath('/crop-guidance');
        } catch {}
      }
      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'All Crop-Specific Master Guides updated',
      });
    }

    // 3. Update a single Crop Master Guide (name, category, tagline, or sections)
    if (entity === 'masterGuide') {
      const { cropId, id, name, category, tagline, sections } = body;
      const targetId = cropId || id;
      const idx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === targetId
      );
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'Crop guide not found' }, { status: 404 });
      }
      const current = db.cropGuidanceMasterGuides[idx];
      db.cropGuidanceMasterGuides[idx] = {
        ...current,
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(category !== undefined ? { category: category.trim() } : {}),
        ...(tagline !== undefined ? { tagline: tagline.trim() } : {}),
        ...(Array.isArray(sections) ? { sections } : {}),
      };
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}

      return NextResponse.json({
        success: true,
        data: db.cropGuidanceMasterGuides[idx],
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Crop Master Guide updated',
      });
    }

    // 4. Update a Section inside a Crop Master Guide
    if (entity === 'masterSection') {
      const { cropId, sectionIndex, section } = body;
      const idx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === cropId
      );
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'Crop guide not found' }, { status: 404 });
      }
      const secIdx = Number(sectionIndex);
      if (!db.cropGuidanceMasterGuides[idx].sections?.[secIdx]) {
        return NextResponse.json({ success: false, message: 'Section not found' }, { status: 404 });
      }
      const existingSec = db.cropGuidanceMasterGuides[idx].sections[secIdx];
      db.cropGuidanceMasterGuides[idx].sections[secIdx] = {
        ...existingSec,
        ...(section.title !== undefined ? { title: section.title } : {}),
        ...(section.badge !== undefined ? { badge: section.badge } : {}),
        ...(section.theme !== undefined ? { theme: section.theme } : {}),
        ...(Array.isArray(section.headers) ? { headers: section.headers } : {}),
        ...(Array.isArray(section.rows) ? { rows: section.rows } : {}),
      };
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}

      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Section updated successfully',
      });
    }

    // 5. Update a single Column Header inside a Section of a Crop Master Guide
    if (entity === 'masterColumn') {
      const { cropId, sectionIndex, columnIndex, header } = body;
      const idx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === cropId
      );
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'Crop guide not found' }, { status: 404 });
      }
      const sec = db.cropGuidanceMasterGuides[idx].sections?.[Number(sectionIndex)];
      if (!sec || !sec.headers) {
        return NextResponse.json({ success: false, message: 'Section not found' }, { status: 404 });
      }
      sec.headers[Number(columnIndex)] = String(header ?? '');
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}

      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Column header updated successfully',
      });
    }

    // 6. Update a single Row inside a Section of a Crop Master Guide
    if (entity === 'masterRow') {
      const { cropId, sectionIndex, rowIndex, row } = body;
      const idx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === cropId
      );
      if (idx === -1) {
        return NextResponse.json({ success: false, message: 'Crop guide not found' }, { status: 404 });
      }
      const sec = db.cropGuidanceMasterGuides[idx].sections?.[Number(sectionIndex)];
      if (!sec || !sec.rows?.[Number(rowIndex)]) {
        return NextResponse.json({ success: false, message: 'Row not found' }, { status: 404 });
      }
      sec.rows[Number(rowIndex)] = Array.isArray(row) ? row.map((c: any) => String(c ?? '')) : sec.rows[Number(rowIndex)];
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}

      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Row updated successfully',
      });
    }

    // 6. Default: Update a 7-Stage Agricultural Production Stage
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Crop guidance ID is required' },
        { status: 400 }
      );
    }

    const index = db.cropGuidance.findIndex((item: CropGuidanceItem) => item.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, message: 'Crop guidance item not found' },
        { status: 404 }
      );
    }

    const current = db.cropGuidance[index];
    const updated: CropGuidanceItem = {
      ...current,
      ...(body.title !== undefined ? { title: body.title.trim() } : {}),
      ...(body.checklistTitle !== undefined ? { checklistTitle: body.checklistTitle.trim() } : {}),
      ...(body.subtitle !== undefined ? { subtitle: body.subtitle.trim() } : {}),
      ...(body.summary !== undefined ? { summary: body.summary.trim() } : {}),
      ...(body.stageNumber !== undefined ? { stageNumber: Number(body.stageNumber) } : {}),
      ...(body.crop !== undefined ? { crop: body.crop } : {}),
      ...(body.keyActions !== undefined
        ? {
            keyActions: Array.isArray(body.keyActions)
              ? body.keyActions.filter((a: any) => typeof a === 'string' && a.trim().length > 0)
              : [],
          }
        : {}),
      ...(body.recommendedTools !== undefined
        ? {
            recommendedTools: Array.isArray(body.recommendedTools)
              ? body.recommendedTools.filter((t: any) => typeof t === 'string' && t.trim().length > 0)
              : [],
          }
        : {}),
      ...(body.recommendedProducts !== undefined
        ? {
            recommendedProducts: Array.isArray(body.recommendedProducts)
              ? body.recommendedProducts.filter((p: any) => typeof p === 'string' && p.trim().length > 0)
              : [],
          }
        : {}),
      ...(body.displayOrder !== undefined ? { displayOrder: Number(body.displayOrder) } : {}),
      ...(body.isActive !== undefined ? { isActive: Boolean(body.isActive) } : {}),
      updatedAt: new Date().toISOString(),
    };

    db.cropGuidance[index] = updated;
    syncCropGuidanceToAllFiles(db);

    try {
      await revalidateFrontendPath('/crop-guidance');
    } catch {}

    return NextResponse.json({
      success: true,
      data: updated,
      stages: db.cropGuidance,
      message: 'Crop guidance stage updated successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update crop guidance item' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const entity = searchParams.get('entity') || 'stage';
    const id = searchParams.get('id');
    const cropId = searchParams.get('cropId');
    const sectionIndex = searchParams.get('sectionIndex');
    const rowIndex = searchParams.get('rowIndex');
    const columnIndex = searchParams.get('columnIndex');

    const db = readDb();
    ensureCropGuidanceInitialized(db);

    if (entity === 'masterColumn' && cropId && sectionIndex !== null && columnIndex !== null) {
      const idx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === cropId
      );
      const sec = idx >= 0 ? db.cropGuidanceMasterGuides[idx].sections?.[Number(sectionIndex)] : null;
      if (sec && Array.isArray(sec.headers) && sec.headers.length > 1) {
        const colIdx = Number(columnIndex);
        sec.headers.splice(colIdx, 1);
        if (Array.isArray(sec.rows)) {
          sec.rows = sec.rows.map((r: string[]) => {
            const nextRow = Array.isArray(r) ? [...r] : [];
            nextRow.splice(colIdx, 1);
            return nextRow;
          });
        }
        syncCropGuidanceToAllFiles(db);
        try {
          await revalidateFrontendPath('/crop-guidance');
        } catch {}
      }
      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Column deleted successfully',
      });
    }

    if (entity === 'masterGuide' && cropId) {
      db.cropGuidanceMasterGuides = db.cropGuidanceMasterGuides.filter(
        (g: CropMasterGuide) => g.id !== cropId
      );
      syncCropGuidanceToAllFiles(db);
      try {
        await revalidateFrontendPath('/crop-guidance');
      } catch {}
      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Crop Master Guide deleted successfully',
      });
    }

    if (entity === 'masterSection' && cropId && sectionIndex !== null) {
      const idx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === cropId
      );
      if (idx >= 0 && db.cropGuidanceMasterGuides[idx].sections) {
        db.cropGuidanceMasterGuides[idx].sections.splice(Number(sectionIndex), 1);
        syncCropGuidanceToAllFiles(db);
        try {
          await revalidateFrontendPath('/crop-guidance');
        } catch {}
      }
      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Section deleted successfully',
      });
    }

    if (entity === 'masterRow' && cropId && sectionIndex !== null && rowIndex !== null) {
      const idx = db.cropGuidanceMasterGuides.findIndex(
        (g: CropMasterGuide) => g.id === cropId
      );
      if (
        idx >= 0 &&
        db.cropGuidanceMasterGuides[idx].sections?.[Number(sectionIndex)]?.rows
      ) {
        db.cropGuidanceMasterGuides[idx].sections[Number(sectionIndex)].rows.splice(
          Number(rowIndex),
          1
        );
        syncCropGuidanceToAllFiles(db);
        try {
          await revalidateFrontendPath('/crop-guidance');
        } catch {}
      }
      return NextResponse.json({
        success: true,
        masterGuides: db.cropGuidanceMasterGuides,
        message: 'Row deleted successfully',
      });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Crop guidance ID is required' },
        { status: 400 }
      );
    }

    const initialLen = db.cropGuidance.length;
    db.cropGuidance = db.cropGuidance.filter((i: CropGuidanceItem) => i.id !== id);

    if (db.cropGuidance.length === initialLen) {
      return NextResponse.json(
        { success: false, message: 'Crop guidance stage not found' },
        { status: 404 }
      );
    }

    syncCropGuidanceToAllFiles(db);

    try {
      await revalidateFrontendPath('/crop-guidance');
    } catch {}

    return NextResponse.json({
      success: true,
      stages: db.cropGuidance,
      message: 'Crop guidance stage deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete crop guidance item' },
      { status: 500 }
    );
  }
}
