import { useSiteConfig } from "../../hooks/useSiteConfig";

export default function Footer() {

  const { site } = useSiteConfig();

  return (
    <footer
      style={{
        padding: "30px",
        borderTop: "1px solid #eee",
        textAlign: "center",
        marginTop: "40px",
        color: "#666"
      }}
    >

      <div style={{ marginBottom: 10 }}>
        © {new Date().getFullYear()} {site?.brand_name || "MiTienda"}
      </div>

      {site?.email && (
        <div style={{ fontSize: 13 }}>
          {site.email}
        </div>
      )}

      {site?.instagram && (
        <div style={{ marginTop: 8 }}>
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>
      )}

    </footer>
  );
}