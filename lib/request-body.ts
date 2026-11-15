/**
 * Read a request body, giving up as soon as it exceeds `maxBytes`.
 *
 * The Content-Length header is only a hint: a client can omit it (chunked
 * transfer) or understate it, and `request.json()` / `request.formData()` then
 * buffer the whole body regardless. Counting the bytes as they arrive is the
 * only limit that holds. Returns `null` when the limit is exceeded, after
 * cancelling the stream so no more of the body is read.
 */
export async function readBodyWithLimit(
  request: Request,
  maxBytes: number
): Promise<Uint8Array<ArrayBuffer> | null> {
  if (!request.body) return new Uint8Array(0);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}
