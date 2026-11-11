import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import MediaAsset from "@/models/MediaAsset";
import { generateUploadSignature } from "@/lib/cloudinary/client";
import {
  requirePermission,
  validateIdParam,
} from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_MEDIA_FOLDERS = new Set([
  "company",
  "products",
  "projects",
  "gallery",
  "blogs",
  "seo",
  "surveys",
  "solutions",
  "services",
  "categories",
  "videos",
]);

const ALLOWED_ASSET_FIELDS = [
  "url",
  "publicId",
  "originalFileName",
  "format",
  "width",
  "height",
  "bytes",
  "altText",
  "caption",
] as const;

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission("read:media");
    if (!auth.ok) return auth.response;

    await connectDB();
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    const query: Record<string, any> = {};
    if (folder && folder !== "all" && ALLOWED_MEDIA_FOLDERS.has(folder)) {
      query.folder = folder;
    }

    const assets = await MediaAsset.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("[Get Media Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:media");
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const action = typeof body?.action === "string" ? body.action : "";
    const rawFolder =
      typeof body?.folder === "string"
        ? body.folder.trim().toLowerCase().replace(/^vps_solar\//, "")
        : "company";
    const safeFolder = ALLOWED_MEDIA_FOLDERS.has(rawFolder)
      ? rawFolder
      : "company";

    // Get signed upload credentials for Cloudinary direct upload
    if (action === "sign") {
      const signatureData = generateUploadSignature(safeFolder);
      return NextResponse.json(signatureData);
    }

    const cleanFields = pickAllowedFields<Record<string, any>>(
      body,
      ALLOWED_ASSET_FIELDS
    );
    if (!cleanFields.url || !isSafeMediaUrl(cleanFields.url)) {
      return NextResponse.json(
        { error: "A valid asset URL is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const asset = await MediaAsset.create({
      ...cleanFields,
      folder: safeFolder,
      uploadedBy: auth.session.userId,
    });

    return NextResponse.json({ success: true, asset });
  } catch (error) {
    console.error("[Media Action Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requirePermission("write:media");
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const idErr = validateIdParam(id || undefined, "asset ID");
    if (idErr) return idErr;

    await connectDB();
    const asset = await MediaAsset.findById(id);
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    if (asset.usageCount > 0) {
      return NextResponse.json(
        {
          error:
            "Asset is currently in use across published pages or products",
        },
        { status: 400 }
      );
    }

    await MediaAsset.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Media Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
