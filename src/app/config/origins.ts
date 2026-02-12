const DEFAULT_FRONTEND_ORIGIN = "http://localhost:3000";

const normalizeOrigin = (origin: string) => origin.trim().replace(/\/+$/, "");

export const getFrontendOrigins = (): string[] => {
  const rawOrigins = process.env.FRONTEND_URL ?? "";
  const parsedOrigins = rawOrigins
    .split(",")
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  if (parsedOrigins.length === 0) {
    return [DEFAULT_FRONTEND_ORIGIN];
  }

  return [...new Set(parsedOrigins)];
};

export const getPrimaryFrontendOrigin = (): string => {
  const [primaryOrigin] = getFrontendOrigins();
  return primaryOrigin;
};
