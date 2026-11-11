import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import InstallationGallery from "@/models/InstallationGallery";
import { getSession } from "@/lib/auth/session";
import { generateUploadSignature } from "@/lib/cloudinary/client";
import { revalidatePublicSite } from "@/lib/revalidate-public";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";
    const includeUnpublished = searchParams.get("includeUnpublished") === "true";

    const filter: Record<string, any> = {};

    if (!includeUnpublished) {
      filter.isPublished = true;
    } else {
      // Check admin session before showing unpublished items
      const session = await getSession();
      if (!session) {
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
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();

    // 1. Signature request for Cloudinary upload
    if (body.action === "sign") {
      const folder = body.folder || "gallery";
      const signatureData = generateUploadSignature(folder);
      return NextResponse.json(signatureData);
    }

    // 2. Reorder action
    if (body.action === "reorder" && Array.isArray(body.items)) {
      await connectDB();
      const updates = body.items.map((it: { id: string; sortOrder: number }) =>
        InstallationGallery.findByIdAndUpdate(it.id, { sortOrder: it.sortOrder })
      );
      await Promise.all(updates);
      revalidatePublicSite(["/gallery"]);
      return NextResponse.json({ success: true, message: "Order updated successfully" });
    }

    // 3. Batch insert action
    if (body.action === "batch" && Array.isArray(body.items)) {
      await connectDB();
      const created = await InstallationGallery.insertMany(body.items);
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

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
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
