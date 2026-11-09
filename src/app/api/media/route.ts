import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import MediaAsset from "@/models/MediaAsset";
import { getSession } from "@/lib/auth/session";
import { generateUploadSignature } from "@/lib/cloudinary/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

        const query: Record<string, any> = {};
    if (folder && folder !== "all") query.folder = folder;

    const assets = await MediaAsset.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("[Get Media Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action, folder = "company", ...assetData } = body;

    // Action: Get signed upload credentials for Cloudinary direct upload
    if (action === "sign") {
      const signatureData = generateUploadSignature(folder);
      return NextResponse.json(signatureData);
    }

    // Action: Save uploaded asset record into DB
    await connectDB();
    const asset = await MediaAsset.create({
      ...assetData,
      folder,
      uploadedBy: session.userId,
    });

    return NextResponse.json({ success: true, asset });
  } catch (error) {
    console.error("[Media Action Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Asset ID required" }, { status: 400 });

    await connectDB();
    const asset = await MediaAsset.findById(id);
    if (!asset) return NextResponse.json({ error: "Asset not found" }, { status: 404 });

    // Prevent accidental deletion if usageCount > 0
    if (asset.usageCount > 0) {
      return NextResponse.json(
        { error: "Asset is currently in use across published pages or products" },
        { status: 400 }
      );
    }

    await MediaAsset.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Media Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
