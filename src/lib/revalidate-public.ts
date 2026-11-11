import { revalidatePath } from "next/cache";

/**
 * Invalidates Next.js ISR route cache across the public website after admin updates.
 * Wrapped defensively so direct execution outside request lifecycle (e.g. unit tests) never throws.
 */
export function revalidatePublicSite(extraPaths: string[] = []): void {
  try {
    revalidatePath("/", "layout");
    for (const p of extraPaths) {
      revalidatePath(p);
    }
  } catch {
    // No-op when invoked outside Next.js server request context
  }
}
