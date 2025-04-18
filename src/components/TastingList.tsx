'use client';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Stack,
} from '@mui/material';

export type Record = {
  id: string
  wine_name: string
  producer: string
  vintage: number
  region: string
  tasting_date: string
  varieties: string
  comment: string
}

type FormData = {
  id: string
  wineName: string
  producer?: string
  vintage?: string
  region?: string
  varieties? :string
  tastingDate?: string
  comment?: string
}

interface Props {
  initialRecords: Record[]
}

export function TastingList({ initialRecords }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const convertData = initialRecords.map((d) => ({
    id: d.id,
    wineName: d.wine_name,
    producer: d.producer,
    vintage: `${d.vintage || ''}`,
    varieties: d.varieties,
    region: d.region,
    tastingDate: d.tasting_date,
    comment: d.comment,
  }));

  const { data = convertData } = useQuery<FormData[], Error>({
    queryKey: ['tastingRecords'],
    queryFn: () =>
      fetch('/api/tasting').then(async (res) => {
        if (!res.ok) throw new Error('一覧取得に失敗しました');
        const data = await res.json();
        return data.map((d: any) => ({
          id: d.id,
          wineName: d.wine_name,
          producer: d.producer,
          vintage: `${d.vintage || ''}`,
          varieties: d.varieties,
          region: d.region,
          tastingDate: d.tasting_date,
          comment: d.comment,
        }));
      }),
    initialData: convertData,
  });

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) =>
      fetch(`/api/tasting/${id}`, { method: 'DELETE' }).then((res) => {
        if (!res.ok) throw new Error('削除に失敗しました');
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tastingRecords'] });
    },
  });

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">テイスティング一覧</Typography>
        <Button variant="contained" onClick={() => router.push('/create')}>
          新規登録
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>ワイン名</TableCell>
              <TableCell>生産者</TableCell>
              <TableCell>ヴィンテージ（年）</TableCell>
              <TableCell>産地</TableCell>
              <TableCell>品種</TableCell>
              <TableCell>テイスティング日</TableCell>
              <TableCell>コメント</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((r) => (
              <TableRow key={r.id} hover>
                <TableCell>{r.wineName}</TableCell>
                <TableCell>{r.producer}</TableCell>
                <TableCell>{r.vintage}</TableCell>
                <TableCell>{r.region}</TableCell>
                <TableCell>{r.varieties}</TableCell>
                <TableCell>{r.tastingDate}</TableCell>
                <TableCell>{r.comment}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => router.push(`/${r.id}`)}>
                      編集
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => deleteMutation.mutate(r.id)}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? '削除中…' : '削除'}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
