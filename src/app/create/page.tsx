'use client';

import { Controller, useForm } from 'react-hook-form';
import { Button, Container, TextField, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';

type FormData = {
  wineName: string
  producer?: string
  vintage?: Dayjs | null
  region?: string
  tastingDate?: Dayjs | null
  varieties?: string
  comment?: string
}

export default function CreatePage() {
  const { control, handleSubmit, reset, register, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      wineName: '',
      producer: '',
      vintage: null,
      region: '',
      tastingDate: null,
      varieties: '',
      comment: '',
    },
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await fetch('/winetasting/api/tasting', {
        method: 'POST',
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
      if (!res.ok) throw new Error('保存失敗');
    },
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ['tastingRecords'] });
    },
    onError: () => {
      alert('保存に失敗しました');
    }
  });

  const onSubmit = (data: FormData) => mutation.mutate(data);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Button size="small" onClick={() => router.push('/')}>
          一覧へ戻る
        </Button>
      </Typography>
      <Typography variant="h5" gutterBottom>ワインテイスティング記録</Typography>

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
