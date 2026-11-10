import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { toast, Toaster } from "sonner";

test("Toast System: Sonner package availability and exports", () => {
  assert.equal(typeof toast, "function");
  assert.equal(typeof toast.success, "function");
  assert.equal(typeof toast.error, "function");
  assert.equal(typeof toast.warning, "function");
  assert.equal(typeof toast.info, "function");
  assert.equal(typeof toast.loading, "function");
  assert.ok(Toaster, "Toaster component must exist");
});

test("Toast System: toast.ts file defines all required presets and standard messages", () => {
  const toastFilePath = path.resolve(process.cwd(), "src/lib/toast.ts");
  assert.ok(fs.existsSync(toastFilePath), "src/lib/toast.ts must exist");

  const content = fs.readFileSync(toastFilePath, "utf-8");

  // Verify all 6 specific user requested methods and messages
  assert.ok(content.includes('saved: (message = "Saved successfully!"'), "Must include 'Saved successfully!'");
  assert.ok(content.includes('created: (message = "Created successfully!"'), "Must include 'Created successfully!'");
  assert.ok(content.includes('updated: (message = "Updated successfully!"'), "Must include 'Updated successfully!'");
  assert.ok(content.includes('deleted: (message = "Deleted successfully!"'), "Must include 'Deleted successfully!'");
  assert.ok(content.includes('uploaded: (message = "Uploaded successfully!"'), "Must include 'Uploaded successfully!'");
  assert.ok(content.includes('submitted: (message = "Submitted successfully!"'), "Must include 'Submitted successfully!'");

  // Verify auto-dismiss duration is 3000ms
  assert.ok(content.includes("duration: 3000"), "Must set default duration to 3000ms");
});

test("Toast System: ToastProvider.tsx renders with top-right position, close button and icons", () => {
  const providerPath = path.resolve(process.cwd(), "src/components/ui/ToastProvider.tsx");
  assert.ok(fs.existsSync(providerPath), "ToastProvider.tsx must exist");

  const content = fs.readFileSync(providerPath, "utf-8");
  assert.ok(content.includes('position="top-right"'), "Position must be top-right");
  assert.ok(content.includes("duration={3000}"), "Duration must be 3000");
  assert.ok(content.includes("closeButton"), "Must include closeButton");
  assert.ok(content.includes("CheckCircle2"), "Must render green CheckCircle2 for success");
  assert.ok(content.includes("AlertCircle"), "Must render red AlertCircle for error");
  assert.ok(content.includes("AlertTriangle"), "Must render yellow AlertTriangle for warning");
});
