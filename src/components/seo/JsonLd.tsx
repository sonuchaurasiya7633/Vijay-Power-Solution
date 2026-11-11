export default function JsonLd({
  data,
}: {
  data: Record<string, any> | Array<Record<string, any>> | null | undefined;
}) {
  if (!data) return null;
  if (Array.isArray(data) && data.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
