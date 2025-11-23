import { Form, useActionData, useLoaderData } from "react-router";
import { prisma } from "../db.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;

  const locations = await prisma.location.findMany({
    where: { shopDomain },
    orderBy: { createdAt: "desc" },
  });

  return { locations };
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    const id = Number(formData.get("locationId"));
    if (!id || Number.isNaN(id)) {
      return { error: "Invalid location id." };
    }

    await prisma.location.delete({ where: { id } });
    return { deleted: true };
  }

  const readText = (field, required = false) => {
    const value = formData.get(field)?.toString().trim();
    if (!value) return required ? null : null;
    return value || null;
  };

  const name = readText("name", true);
  const address = readText("address", true);
  const apartment = readText("apartment");
  const city = readText("city");
  const zipcode = readText("zipcode");
  const province = readText("province");
  const country = readText("country");

  const showAddress = formData.get("showAddress") === "on";
  const showCity = formData.get("showCity") === "on";
  const showProvince = formData.get("showProvince") === "on";
  const showPostalCode = formData.get("showPostalCode") === "on";
  const showCountry = formData.get("showCountry") === "on";
  const offersPickup = formData.get("offersPickup") === "on";
  const offersDelivery = formData.get("offersDelivery") === "on";

  if (!name || !address) {
    return { error: "Location name and address are required." };
  }

  await prisma.location.create({
    data: {
      shopDomain,
      name,
      address,
      apartment,
      city,
      zipcode,
      province,
      country,
      showAddress,
      showCity,
      showProvince,
      showPostalCode,
      showCountry,
      offersPickup,
      offersDelivery,
    },
  });

  return { success: true };
};

export default function LocationsPage() {
  const { locations } = useLoaderData();
  const actionData = useActionData();

  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  };

  const renderAddress = (location) => {
    const lines = [location.address].filter(Boolean);
    if (location.apartment) lines.push(location.apartment);
    const cityZip = [location.city, location.zipcode].filter(Boolean).join(" ");
    if (cityZip) lines.push(cityZip);
    const provinceCountry = [location.province, location.country]
      .filter(Boolean)
      .join(", ");
    if (provinceCountry) lines.push(provinceCountry);
    return lines.join("\n");
  };

  return (
    <s-page title="Pickup locations">
      <div style={{ padding: "24px", display: "grid", gap: "24px" }}>
        <div
          style={{
            borderRadius: "12px",
            background: "#ebf5ff",
            border: "1px solid #90c2ff",
            padding: "16px",
            color: "#1e3a8a",
          }}
        >
          <strong style={{ display: "block", marginBottom: "4px" }}>
            Custom locations are not tracked by Shopify.
          </strong>
          <span>
            Custom locations will appear as pickup/delivery options within the storefront widget only.
          </span>
        </div>

        {actionData?.error && (
          <s-inline-stack align="start">
            <s-badge tone="critical">{actionData.error}</s-badge>
          </s-inline-stack>
        )}

        <Form
          method="post"
          style={{
            display: "grid",
            gap: "20px",
            padding: "24px",
            borderRadius: "16px",
            background: "white",
            border: "1px solid #e3e8ef",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
          }}
        >
          <div style={{ display: "grid", gap: "12px" }}>
            <h2 style={{ margin: 0 }}>Create a custom location</h2>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontWeight: 600 }}>Location name</span>
              <input
                name="name"
                type="text"
                placeholder="e.g. Main street pickup"
                style={{
                  borderRadius: "8px",
                  border: "1px solid #cbd5f5",
                  padding: "10px 12px",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontWeight: 600 }}>Address</span>
              <textarea
                name="address"
                rows={3}
                placeholder="123 Market Street"
                style={{
                  borderRadius: "8px",
                  border: "1px solid #cbd5f5",
                  padding: "10px 12px",
                  resize: "vertical",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontWeight: 600 }}>Apartment, suite, etc.</span>
              <input
                name="apartment"
                type="text"
                placeholder="Unit 4B"
                style={{
                  borderRadius: "8px",
                  border: "1px solid #cbd5f5",
                  padding: "10px 12px",
                }}
              />
            </label>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontWeight: 600 }}>City</span>
                <input
                  name="city"
                  type="text"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #cbd5f5",
                    padding: "10px 12px",
                  }}
                />
              </label>
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontWeight: 600 }}>Zipcode</span>
                <input
                  name="zipcode"
                  type="text"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #cbd5f5",
                    padding: "10px 12px",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontWeight: 600 }}>Province</span>
                <input
                  name="province"
                  type="text"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #cbd5f5",
                    padding: "10px 12px",
                  }}
                />
              </label>
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontWeight: 600 }}>Country/region</span>
                <input
                  name="country"
                  type="text"
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #cbd5f5",
                    padding: "10px 12px",
                  }}
                />
              </label>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <h3 style={{ margin: 0 }}>Display options</h3>
            <div style={{ display: "grid", gap: "8px" }}>
              {[
                { label: "Show address", name: "showAddress", checked: true },
                { label: "Show city", name: "showCity", checked: true },
                { label: "Show province", name: "showProvince", checked: true },
                { label: "Show postal code", name: "showPostalCode", checked: true },
                { label: "Show country", name: "showCountry", checked: true },
              ].map((option) => (
                <label
                  key={option.name}
                  style={{ display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <input type="checkbox" name={option.name} defaultChecked={option.checked} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <h3 style={{ margin: 0 }}>Offerings</h3>
            <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input type="checkbox" name="offersPickup" />
              <span>This location offers local pickup</span>
            </label>
            <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input type="checkbox" name="offersDelivery" />
              <span>This location offers local delivery</span>
            </label>
          </div>

          <div>
            <s-button type="submit" variant="primary">
              Save location
            </s-button>
          </div>
        </Form>

        <section
          style={{
            border: "1px solid #e3e8ef",
            borderRadius: "16px",
            padding: "24px",
            background: "white",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Existing locations</h2>
          {locations.length === 0 ? (
            <p style={{ color: "#64748b" }}>No custom locations yet.</p>
          ) : (
            <ul
              style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "16px" }}
            >
              {locations.map((loc) => (
                <li
                  key={loc.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "16px",
                    background: "#f8fafc",
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <strong style={{ fontSize: "16px" }}>{loc.name}</strong>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {loc.active && (
                        <span
                          style={{
                            ...badgeStyle,
                            background: "#dcfce7",
                            color: "#166534",
                          }}
                        >
                          Active
                        </span>
                      )}
                      {loc.offersPickup && (
                        <span
                          style={{
                            ...badgeStyle,
                            background: "#e0f2fe",
                            color: "#075985",
                          }}
                        >
                          Pickup
                        </span>
                      )}
                      {loc.offersDelivery && (
                        <span
                          style={{
                            ...badgeStyle,
                            background: "#fef9c3",
                            color: "#92400e",
                          }}
                        >
                          Delivery
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ whiteSpace: "pre-line", margin: 0, color: "#334155" }}>
                    {renderAddress(loc)}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <s-button href={`/app/locations/${loc.id}`} variant="secondary">
                      Edit
                    </s-button>
                    <Form
                      method="post"
                      onSubmit={(event) => {
                        if (!window.confirm("Are you sure you want to delete this location?")) {
                          event.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="locationId" value={loc.id} />
                      <s-button type="submit" tone="critical" variant="secondary" size="slim">
                        Delete
                      </s-button>
                    </Form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </s-page>
  );
}
