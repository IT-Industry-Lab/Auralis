export type RegisterField = 'username' | 'email' | 'password';

export type RegisterFieldError = {
  field: RegisterField;
  message: string;
};

export type RegisterErrorDetails = {
  fieldError?: RegisterFieldError;
  message: string;
};

export class RegisterApiError extends Error {
  readonly fieldError?: RegisterFieldError;

  constructor(details: RegisterErrorDetails) {
    super(details.message);
    this.name = 'RegisterApiError';
    this.fieldError = details.fieldError;
  }
}

const FIELD_NAMES: Record<string, RegisterField> = {
  username: 'username',
  email: 'email',
  password: 'password',
};

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toMessage = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const message = value.trim();
    return message || undefined;
  }

  if (Array.isArray(value)) {
    const messages = value
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim());

    return messages.length > 0 ? messages.join(' ') : undefined;
  }

  return undefined;
};

const toField = (value: unknown): RegisterField | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  return FIELD_NAMES[value.trim().toLowerCase()];
};

const toFieldError = (payload: unknown): RegisterFieldError | undefined => {
  if (!isRecord(payload)) {
    return undefined;
  }

  const directField = toField(payload.field);
  const directMessage = toMessage(payload.message) ?? toMessage(payload.error);

  if (directField && directMessage) {
    return { field: directField, message: directMessage };
  }

  const errors = payload.errors;

  if (isRecord(errors)) {
    for (const [key, value] of Object.entries(errors)) {
      const field = toField(key);
      const message = toMessage(value);

      if (field && message) {
        return { field, message };
      }
    }
  }

  if (Array.isArray(errors)) {
    for (const error of errors) {
      if (!isRecord(error)) {
        continue;
      }

      const field = toField(error.field ?? error.name ?? error.property);
      const message = toMessage(error.message) ?? toMessage(error.error);

      if (field && message) {
        return { field, message };
      }
    }
  }

  return undefined;
};

export const parseRegisterError = (payload: unknown, status: number): RegisterErrorDetails => {
  const fieldError = toFieldError(payload);
  const generalMessage = isRecord(payload)
    ? (toMessage(payload.message) ?? toMessage(payload.error))
    : undefined;

  return {
    ...(fieldError ? { fieldError } : {}),
    message: generalMessage ?? `Registration failed with status ${status}`,
  };
};
