import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import InstallationGallery from "@/models/InstallationGallery";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { generateUploadSignature } from "@/lib/cloudinary/client";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, isValidObjectId } from "@/lib/security/sanitize";

const ALLOWED_GALLERY_FOLDERS = new Set(["gallery", "products", "projects", "pages", "media"]);

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    const filter: Record<string, unknown> = {};

    if (!includeUnpublished) {
      filter.isPublished = true;
    } else {
      // Check admin session & permission before showing unpublished items
      const session = await getSession();
      if (!session || !hasPermission(session.role, "read:cms")) {
        filter.isPublished = true;
      }
    }

    if (featuredOnly) {
      filter.isFeatured = true;
    }

    const items = await InstallationGallery.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error("[Get Installation Gallery Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch installation gallery items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Signature request for Cloudinary upload
    if (body.action === "sign") {
      const auth = await requirePermission("write:media");
      if (!auth.ok) return auth.response;
      const requestedFolder = typeof body.folder === "string" ? body.folder.trim() : "gallery";
      const folder = ALLOWED_GALLERY_FOLDERS.has(requestedFolder) ? requestedFolder : "gallery";
      const signatureData = generateUploadSignature(folder);
      return NextResponse.json(signatureData);
    }

    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    // 2. Reorder action
    if (body.action === "reorder" && Array.isArray(body.items)) {
      await connectDB();
      const updates = body.items
        .filter((it: { id?: string; sortOrder?: number }) => it?.id && isValidObjectId(String(it.id)))
        .map((it: { id: string; sortOrder: number }) =>
          InstallationGallery.findByIdAndUpdate(it.id, { sortOrder: Number(it.sortOrder) || 0 })
        );
      await Promise.all(updates);
      revalidatePublicSite(["/gallery"]);
      return NextResponse.json({ success: true, message: "Order updated successfully" });
    }

    // 3. Batch insert action
    if (body.action === "batch" && Array.isArray(body.items)) {
      const safeItems = body.items
        .filter((it: any) => it && typeof it.imageUrl === "string" && isSafeMediaUrl(it.imageUrl))
        .map((it: any) => ({
          imageUrl: it.imageUrl,
          cloudinaryPublicId: it.cloudinaryPublicId,
          title: it.title || "Customer Solar Installation",
          customerName: it.customerName,
          city: it.city,
          state: it.state,
          category: it.category || "Residential Rooftop",
          capacityKw: it.capacityKw ? Number(it.capacityKw) : undefined,
          description: it.description,
          isFeatured: Boolean(it.isFeatured),
          isPublished: it.isPublished !== undefined ? Boolean(it.isPublished) : true,
          sortOrder: Number(it.sortOrder) || 0,
        }));
      await connectDB();
      const created = await InstallationGallery.insertMany(safeItems);
      revalidatePublicSite(["/gallery"]);
      return NextResponse.json({ success: true, count: created.length, items: created }, { status: 201 });
    }

    // 4. Single item create
    await connectDB();
    const {
      imageUrl,
      cloudinaryPublicId,
      title = "Customer Solar Installation",
      customerName,
      city,
      state,
      category = "Residential Rooftop",
      capacityKw,
      description,
      isFeatured = false,
      isPublished = true,
      sortOrder = 0,
    } = body;

    if (!imageUrl || typeof imageUrl !== "string" || !isSafeMediaUrl(imageUrl)) {
      return NextResponse.json({ error: "Valid image URL is required" }, { status: 400 });
    }

    const item = await InstallationGallery.create({
      imageUrl,
      cloudinaryPublicId,
      title,
      customerName,
      city,
      state,
      category,
      capacityKw: capacityKw ? Number(capacityKw) : undefined,
      description,
      isFeatured: Boolean(isFeatured),
      isPublished: Boolean(isPublished),
      sortOrder: Number(sortOrder) || 0,
    });

    revalidatePublicSite(["/gallery"]);
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("[Create Installation Gallery Error]", error);
    return NextResponse.json(
      { error: "Failed to create installation gallery item" },
      { status: 500 }
    );
  }
}
