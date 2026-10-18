import { listShareImage } from './shareImage'

/** The picture a link to the list unfurls into */
export async function GET(request: Request) {
  return listShareImage(request)
}
