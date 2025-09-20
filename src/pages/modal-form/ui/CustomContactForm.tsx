import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import type { FormModalContext } from '../../../shared/ui/modal';
import z from 'zod';

export interface ContactFormData extends Record<string, string> {
  name: string;
  email: string;
  message: string;
}

const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요.')
    .min(2, '이름은 2자 이상 입력해주세요.'),
  email: z.email('올바른 이메일 형식을 입력해주세요.'),
  message: z
    .string()
    .min(1, '메시지를 입력해주세요.')
    .min(10, '메시지는 최소 10자 이상 입력해주세요.'),
});

export function CustomContactForm({
  context,
}: {
  context: FormModalContext<ContactFormData>;
}) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await context.submit(data);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const loading = context.isLoading || isSubmitting;

  return (
    <div>
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        react-hook-form과 Zod를 사용한 커스텀 폼입니다.
        <br />
        강력한 타입 안전성과 유연한 검증 로직을 제공합니다.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor={nameId}
            style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            이름 *
          </label>
          <input
            id={nameId}
            type="text"
            {...register('name')}
            placeholder="홍길동"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.name ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
            data-autofocus
          />
          {errors.name && (
            <span
              style={{
                color: '#dc3545',
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                display: 'block',
              }}
              role="alert"
            >
              {errors.name.message}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor={emailId}
            style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            이메일 *
          </label>
          <input
            id={emailId}
            type="email"
            {...register('email')}
            placeholder="example@email.com"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.email ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '0.875rem',
            }}
          />
          {errors.email && (
            <span
              style={{
                color: '#dc3545',
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                display: 'block',
              }}
              role="alert"
            >
              {errors.email.message}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor={messageId}
            style={{
              display: 'block',
              fontWeight: '500',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            메시지 *
          </label>
          <textarea
            id={messageId}
            {...register('message')}
            placeholder="문의하실 내용을 자세히 적어주세요."
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.message ? '#dc3545' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '0.875rem',
              resize: 'vertical',
            }}
          />
          {errors.message && (
            <span
              style={{
                color: '#dc3545',
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                display: 'block',
              }}
              role="alert"
            >
              {errors.message.message}
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}
        >
          <button
            type="button"
            onClick={context.cancel}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#f8f9fa',
              color: '#495057',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              minWidth: '80px',
            }}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              minWidth: '80px',
            }}
          >
            {loading ? '제출 중...' : '문의하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
