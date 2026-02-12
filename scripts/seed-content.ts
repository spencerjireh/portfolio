import { seedItems } from './seed-data';

const API_BASE = 'https://folionaut.spencerjireh.com/api/v1';
const ADMIN_KEY = process.env.FOLIONAUT_ADMIN_KEY ?? '';
const DRY_RUN = process.argv.includes('--dry-run');

const headers = {
  'Content-Type': 'application/json',
  'X-Admin-Key': ADMIN_KEY,
};

interface ContentRow {
  id: string;
  type: string;
  slug: string;
  sortOrder: number;
  data: Record<string, unknown>;
}

async function fetchExisting(): Promise<Map<string, ContentRow>> {
  const res = await fetch(`${API_BASE}/content/bundle`);
  if (!res.ok) throw new Error(`Failed to fetch bundle: ${res.status}`);
  const json = (await res.json()) as { data: Record<string, ContentRow[]> };
  const map = new Map<string, ContentRow>();
  for (const items of Object.values(json.data)) {
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      map.set(`${item.type}/${item.slug}`, item);
    }
  }
  return map;
}

async function seed(): Promise<void> {
  if (!ADMIN_KEY) {
    console.error('Missing FOLIONAUT_ADMIN_KEY environment variable');
    process.exit(1);
  }

  console.log(`Seeding ${seedItems.length} items to ${API_BASE}`);
  if (DRY_RUN) console.log('(dry run -- no requests will be sent)');

  const existing = DRY_RUN ? new Map() : await fetchExisting();
  console.log(`Found ${existing.size} existing items\n`);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of seedItems) {
    const label = `${item.type}/${item.slug}`;
    const match = existing.get(label);

    if (DRY_RUN) {
      console.log(`  [dry] ${label} (${match ? 'update' : 'create'})`);
      created++;
      continue;
    }

    try {
      let res: Response;

      if (match) {
        // Update existing item via PUT
        res = await fetch(`${API_BASE}/admin/content/${match.id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            data: item.data,
            status: item.status,
            sortOrder: item.sortOrder,
          }),
        });
        if (res.ok) {
          console.log(`  [upd] ${label} (${match.id})`);
          updated++;
        } else {
          const body = await res.text();
          console.error(`  [err] ${label} PUT -- ${res.status}: ${body}`);
          failed++;
        }
      } else {
        // Create new item via POST
        res = await fetch(`${API_BASE}/admin/content`, {
          method: 'POST',
          headers,
          body: JSON.stringify(item),
        });
        if (res.ok) {
          console.log(`  [new] ${label}`);
          created++;
        } else {
          const body = await res.text();
          console.error(`  [err] ${label} POST -- ${res.status}: ${body}`);
          failed++;
        }
      }
    } catch (err) {
      console.error(`  [err] ${label} -- ${err}`);
      failed++;
    }
  }

  console.log(
    `\nDone: ${created} created, ${updated} updated, ${skipped} skipped, ${failed} failed`,
  );
  if (failed > 0) process.exit(1);
}

seed();
