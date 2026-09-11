// Overpass proxy (no ML involved) — mirrors the retired Supabase edge function.
export const search = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000 } = req.body;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });
    const q = `[out:json][timeout:25];(node['amenity'='hospital'](around:${radius},${lat},${lng});` +
      `way['amenity'='hospital'](around:${radius},${lat},${lng});` +
      `node['amenity'='clinic'](around:${radius},${lat},${lng}););out center body 20;`;
    for (const base of ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter']) {
      try {
        const r = await fetch(base, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(q)}`,
          signal: AbortSignal.timeout(15000),
        });
        if (!r.ok) continue;
        const data = await r.json();
        const R = 6371, rad = (d) => (d * Math.PI) / 180;
        const hospitals = (data.elements || [])
          .filter((el) => el.tags?.name)
          .map((el, i) => {
            const la = el.lat || el.center?.lat, lo = el.lon || el.center?.lon;
            const a = Math.sin(rad(la - lat) / 2) ** 2 +
              Math.cos(rad(lat)) * Math.cos(rad(la)) * Math.sin(rad(lo - lng) / 2) ** 2;
            const t = el.tags || {};
            return {
              id: el.id || i, name: t.name, lat: la, lng: lo,
              address: [t['addr:street'], t['addr:city']].filter(Boolean).join(', ') || 'Address not available',
              phone: t.phone || t['contact:phone'] || null,
              emergency: t.emergency === 'yes',
              type: t.amenity === 'hospital' ? 'Hospital' : 'Clinic',
              distance: Math.round(2 * R * Math.asin(Math.sqrt(a)) * 100) / 100,
            };
          })
          .sort((a, b) => a.distance - b.distance);
        return res.json({ hospitals });
      } catch { /* next mirror */ }
    }
    res.json({ hospitals: [], warning: 'Hospital search temporarily busy.' });
  } catch (err) {
    next(err);
  }
};
