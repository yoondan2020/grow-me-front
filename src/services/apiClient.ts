import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { ErrorResponse } from '@/types/api';

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

/**
 * .env의 EXPO_PUBLIC_API_BASE_URL(예: http://localhost:8080, 끝의 / 제외).
 * 휴대폰(Expo Go)·에뮬레이터에서 localhost는 기기 자신을 가리키므로, 개발 중에는 Metro를 띄운 PC 주소
 * (expoConfig.hostUri, 예: 172.30.1.40:8081)의 호스트로 바꿔 같은 Wi-Fi의 백엔드에 연결합니다.
 */
function resolveApiBaseUrl(): string {
  const configured = (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');
  if (!configured || Platform.OS === 'web') return configured;

  const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
  // React Native의 URL은 hostname 변경을 지원하지 않으므로 문자열로 호스트만 바꿉니다.
  const match = configured.match(/^(https?:\/\/)([^/:]+)(.*)$/);
  if (!devHost || !match || !LOCAL_HOSTS.has(match[2])) return configured;
  return `${match[1]}${devHost}${match[3]}`;
}

const API_BASE_URL = resolveApiBaseUrl();

/** 서버에 닿지 못한 경우의 오류 코드 */
export const NETWORK_ERROR = 'NETWORK_ERROR';

/** API 요청 실패. code는 서버 ErrorCode(예: DAILY_LIMIT_EXCEEDED) 또는 NETWORK_ERROR입니다. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fieldErrors: ErrorResponse['fieldErrors'] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  query?: Record<string, string>;
  body?: unknown;
};

function isErrorResponse(value: unknown): value is ErrorResponse {
  return typeof value === 'object' && value !== null && 'code' in value && 'message' in value;
}

/** 응답 본문이 없으면(204) undefined를 돌려줍니다. 실패하면 ApiError를 던집니다. */
export async function request<T>(path: string, { method = 'GET', query, body }: RequestOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError(0, NETWORK_ERROR, 'API 주소가 설정되지 않았어요. .env의 EXPO_PUBLIC_API_BASE_URL을 확인해 주세요.');
  }
  const search = query ? `?${new URLSearchParams(query).toString()}` : '';

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}${search}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, NETWORK_ERROR, '서버에 연결하지 못했어요. 네트워크 상태를 확인해 주세요.');
  }

  const text = await response.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : undefined;
  } catch {
    data = undefined;
  }

  if (!response.ok) {
    if (isErrorResponse(data)) {
      // 입력값 오류는 첫 필드 메시지(예: '제목은 40자 이하로 입력해 주세요.')가 더 구체적입니다.
      const message = data.fieldErrors?.[0]?.message ?? data.message;
      throw new ApiError(response.status, data.code, message, data.fieldErrors ?? []);
    }
    throw new ApiError(response.status, 'UNKNOWN', '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.');
  }
  return data as T;
}

/** 사용자에게 보여줄 오류 메시지 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return '알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해 주세요.';
}
