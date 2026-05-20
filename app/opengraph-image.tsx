import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630
};
export const alt = "Tulum Living Weddings destination wedding planning";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 60%, #67e8f9 100%)",
          color: "#ffffff"
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.9 }}>
          Destination Weddings in Tulum
        </div>
        <div style={{ marginTop: 18, fontSize: 74, fontWeight: 700, lineHeight: 1.05 }}>Tulum Living Weddings</div>
        <div style={{ marginTop: 24, fontSize: 36, maxWidth: 920, lineHeight: 1.25 }}>
          Full-service planning and design for effortless, oceanfront celebrations.
        </div>
      </div>
    ),
    size
  );
}
