// pages/api/tasting.ts
import { getAllTastings, supabase } from '@/lib/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 一覧取得
  if (req.method === 'GET') {
    const data = await getAllTastings();
    return res.status(200).json(data);
  }

  // 新規作成
  if (req.method === 'POST') {
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
        created_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from('tasting_records')
        .insert([payload]);
      if (error) throw error;
      return res.status(200).json({ message: '保存成功' });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
