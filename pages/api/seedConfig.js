import { assertAdmin } from '../../lib/adminAuth';
import { CONFIG_DOC_IDS, seedAllConfigDefaults } from '../../lib/defaultConfig';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  if (!assertAdmin(req, res)) {
    return;
  }

  try {
    const { force } = req.body || {};
    const result = await seedAllConfigDefaults(Boolean(force), CONFIG_DOC_IDS);

    return res.status(200).json({
      success: true,
      docs: CONFIG_DOC_IDS,
      created: result.created,
      updated: result.updated,
      skipped: result.skipped,
      totalCreated: result.created.length,
      totalUpdated: result.updated.length,
      totalSkipped: result.skipped.length
    });
  } catch (error) {
    console.error('Erro em seedConfig:', error);
    return res.status(500).json({ error: 'Falha ao inicializar configuracoes padrao' });
  }
}
