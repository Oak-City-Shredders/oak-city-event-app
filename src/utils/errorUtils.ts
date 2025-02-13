interface ErrorDetails {
  message?: string;
  errors?: { reason?: string }[];
}

interface Error {
  status?: string;
  details?: ErrorDetails;
  message: string;
}

export const getErrorMessage = (error: Error): string => {
  return `Error ${error.status || ''}: ${
    error.details?.message || error.message
  }\nReason: ${error.details?.errors?.[0]?.reason || 'Unknown'}`;
};
