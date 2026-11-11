import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import InstallationGallery from "@/models/InstallationGallery";
import { getSession } from "@/lib/auth/session";
import { revalidatePublicSite } from "@/lib/revalidate-public";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const item = await InstallationGallery.findById(params.id).lean();
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const updated = await InstallationGallery.findByIdAndUpdate(
      params.id,
      {
        ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl } : {}),
        ...(body.cloudinaryPublicId !== undefined ? { cloudinaryPublicId: body.cloudinaryPublicId } : {}),
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(body.customerName !== undefined ? { customerName: body.customerName } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.state !== undefined ? { state: body.state } : {}),
        ...(body.category !== undefined ? { category: body.category } : {}),
        ...(body.capacityKw !== undefined ? { capacityKw: body.capacityKw ? Number(body.capacityKw) : undefined } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.isFeatured !== undefined ? { isFeatured: Boolean(body.isFeatured) } : {}),
        ...(body.isPublished !== undefined ? { isPublished: Boolean(body.isPublished) } : {}),
        ...(body.sortOrder !== undefined ? { sortOrder: Number(body.sortOrder) } : {}),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    revalidatePublicSite(["/gallery"]);
    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error("[Update Gallery Item Error]", error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await connectDB();
    const deleted = await InstallationGallery.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    revalidatePublicSite(["/gallery"]);
    return NextResponse.json({ success: true, message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("[Delete Gallery Item Error]", error);
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 });
  }
}
