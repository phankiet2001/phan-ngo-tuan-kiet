import { TOKEN_SVG_URL } from "../constant";

export const getTokenSvgUrl = (token: string) => {
  return `${TOKEN_SVG_URL}/${token}.svg`;
}
