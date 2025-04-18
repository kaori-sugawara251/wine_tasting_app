import { getTasting, supabase } from '@/lib/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return;
  const recordId = Array.isArray(id) ? id[0] : id;
  if (!recordId) {
    return res.status(400).json({ error: 'ID が指定されていません' });
  }

  switch (req.method) {
    // idから取得
    case 'GET': {
      const { data, error } = await getTasting(recordId);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    }

    // 更新
    case 'PUT': {
      try {
        const { wineName, producer, vintage, region, tastingDate, comment, varieties } = req.body;
        const payload = {
          wine_name: wineName,
          producer,
          vintage: Number(vintage) || null,
          region,
          varieties,
          tasting_date: tastingDate || null,
          comment,
        };
        const { error } = await supabase
          .from('tasting_records')
          .update(payload)
          .eq('id', recordId);
        if (error) throw error;
        return res.status(200).json({ message: '更新成功' });
      } catch (e) {
        return res.status(500).json({ error: e });
      }
    }

    // 削除
    case 'DELETE': {
      const { error } = await supabase
        .from('tasting_records')
        .delete()
        .eq('id', recordId);
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ message: '削除成功' });
    }

    default: {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
}
