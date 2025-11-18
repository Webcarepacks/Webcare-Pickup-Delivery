import { useLoaderData, useActionData, Form } from "react-router";
import { authenticate } from "../shopify.server";
import { prisma } from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session?.shop;

  const locations = await prisma.location.findMany({
    where: { shopDomain },
    orderBy: { createdAt: "desc" },
  });

  return { locations };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session?.shop;
  const formData = await request.formData();
  const name = formData.get("name")?.toString().trim();
  const address = formData.get("address")?.toString().trim();

  if (!name || !address) {
    return { error: "Naam en adres zijn verplicht." };
  }

  await prisma.location.create({
    data: { shopDomain, name, address },
  });

  return { success: true };
};

export default function LocationsPage() {
  const { locations } = useLoaderData();
  const actionData = useActionData();

  return (
    <s-page title="Pickup locaties">
      <div style={{ padding: "16px", display: "grid", gap: "24px" }}>
        <Form method="post" style={{ display: "grid", gap: "12px" }}>
          <h2>Nieuwe pickup locatie</h2>
          {actionData?.error && (
            <s-banner status="critical">{actionData.error}</s-banner>
          )}
          {actionData?.success && (
            <s-banner status="success">Locatie opgeslagen.</s-banner>
          )}
          <label style={{ display: "grid", gap: "4px" }}>
            <span>Naam</span>
            <input name="name" type="text" placeholder="Bijv. Winkelcentrum" />
          </label>
          <label style={{ display: "grid", gap: "4px" }}>
            <span>Adres</span>
            <textarea
              name="address"
              rows={3}
              placeholder="Straatnaam 1\n1234 AB Stad"
            />
          </label>
          <div>
            <s-button variant="primary" submit>
              Locatie opslaan
            </s-button>
          </div>
        </Form>

        <section>
          <h2>Bestaande locaties</h2>
          {locations.length === 0 ? (
            <p>Er zijn nog geen pickup locaties aangemaakt.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "12px" }}>
              {locations.map((location) => (
                <li
                  key={location.id}
                  style={{
                    border: "1px solid var(--p-color-border, #dfe3e8)",
                    borderRadius: "8px",
                    padding: "12px",
                    background: "white",
                  }}
                >
                  <strong>{location.name}</strong>
                  <p style={{ whiteSpace: "pre-wrap", margin: "8px 0" }}>
                    {location.address}
                  </p>
                  {location.active && (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "999px",
                        background: "#e3f1df",
                        color: "#2c6e41",
                        fontSize: "12px",
                      }}
                    >
                      Actief
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </s-page>
  );
}
