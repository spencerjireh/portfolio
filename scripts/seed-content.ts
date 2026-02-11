import { seedItems } from './seed-data';

const API_BASE = 'https://folionaut.spencerjireh.com/api/v1';
const ADMIN_KEY = process.env.FOLIONAUT_ADMIN_KEY ?? '';
const DRY_RUN = process.argv.includes('--dry-run');

async function seed(): Promise<void> {
  if (!ADMIN_KEY) {
    console.error('Missing FOLIONAUT_ADMIN_KEY environment variable');
    process.exit(1);
  }

  console.log(`Seeding ${seedItems.length} items to ${API_BASE}`);
  if (DRY_RUN) console.log('(dry run -- no requests will be sent)');

  let success = 0;
  let failed = 0;

  for (const item of seedItems) {
    const label = `${item.type}/${item.slug}`;

    if (DRY_RUN) {
      console.log(`  [dry] ${label}`);
      success++;
      continue;
    }

    try {
      const res = await fetch(`${API_BASE}/admin/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': ADMIN_KEY,
        },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        console.log(`  [ok]  ${label}`);
        success++;
      } else {
        const body = await res.text();
        console.error(`  [err] ${label} -- ${res.status}: ${body}`);
        failed++;
      }
    } catch (err) {
      console.error(`  [err] ${label} -- ${err}`);
      failed++;
    }
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

seed();
