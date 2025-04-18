'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container, Typography, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

type FormData = {
  wineName: string
  producer?: string
  vintage?: Dayjs | null
  region?: string
  varieties? :string
  tastingDate?: Dayjs | null
  comment?: string
}

type Record = {
  id: string
  wine_name: string
  producer: string
  vintage: number
  region: string
  tasting_date: string
  varieties: string
  comment: string
}


interface Props {
  initialRecord: Record
}

export function TastingEdit({ initialRecord }: Props) {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const queryClient = useQueryClient();

  const convertData = {
    id: initialRecord.id,
    wineName: initialRecord.wine_name,
    producer: initialRecord.producer,
    vintage: initialRecord.vintage ? dayjs(initialRecord.vintage) : null,
    varieties: initialRecord.varieties,
    region: initialRecord.region,
    tastingDate: initialRecord.tasting_date ? dayjs(initialRecord.tasting_date) : null,
    comment: initialRecord.comment,
  };

  const { data: record = convertData } = useQuery<FormData, Error>({
    queryKey: ['tastingRecord', id],
    queryFn: async () => {
      const res = await fetch(`/api/tasting/${id}`);
      if (!res.ok) throw new Error('取得失敗');
      const d = await res.json();
      return {
        wineName: d.wine_name,
        producer: d.producer,
        vintage: d.vintage ? dayjs(d.vintage) : null,
        varieties: d.varieties,
        region: d.region,
        tastingDate: d.tasting_date ? dayjs(d.tasting_date) : null,
        comment: d.comment,
      };
    },
    initialData: convertData,
    enabled: !!id,
  });

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: convertData,
  });

  useEffect(() => {
    if (record) reset(record);
  }, [record, reset]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch(`/api/tasting/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          vintage: data.vintage
            ? data.vintage.format('YYYY')
            : null,
          tastingDate: data.tastingDate
            ? data.tastingDate.toDate()
            : null,
        }),
      });
      if (!res.ok) throw new Error('更新に失敗しました');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tastingRecords'] });
      router.push('/');
    },
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Button size="small" onClick={() => router.push('/')}>
          一覧へ戻る
        </Button>
      </Typography>
      <Typography variant="h5" gutterBottom>ワインテイスティング記録の修正</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth margin="normal" label="ワイン名"
          {...register('wineName', { required: '必須です' })}
          error={!!errors.wineName}
          helperText={errors.wineName?.message}
        />
        <TextField
          fullWidth margin="normal" label="生産者"
          {...register('producer')}
          error={!!errors.producer}
          helperText={errors.producer?.message}
        />
        <Controller
          name="vintage"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <DatePicker
              label="ヴィンテージ（年）"
              views={['year']}
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
            />
          )}
        />
        <TextField
          fullWidth margin="normal" label="産地（国・地域）"
          {...register('region')}
          error={!!errors.region}
          helperText={errors.region?.message}
        />
        <TextField
          fullWidth margin="normal" label="品種"
          {...register('varieties')}
          error={!!errors.varieties}
          helperText={errors.varieties?.message}
        />
        <Controller
          name="tastingDate"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <DatePicker
              label="テイスティング日"
              value={field.value}
              onChange={(newValue) => field.onChange(newValue)}
            />
          )}
        />
        <TextField
          fullWidth margin="normal" label="コメント"
          {...register('comment')}
          error={!!errors.comment}
          helperText={errors.comment?.message}
        />
        <Button
          fullWidth variant="contained"
          type="submit" sx={{ mt: 2 }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? '更新中…' : '更新'}
        </Button>
      </form>
    </Container>
  );
}
