export const SITE_URL = "https://renma.flinkeo.online";

export function canonical(path: string = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return p === "/" ? SITE_URL : `${SITE_URL}${p}`;
}
