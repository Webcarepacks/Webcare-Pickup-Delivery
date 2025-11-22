import { useLoaderData, useActionData, Form } from "react-router";
import { prisma } from "../db.server";
import { authenticate } from "../shopify.server";

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
  const intent = formData.get("intent");

  if (intent === "delete") {
    const locationId = formData.get("locationId");
    const id = Number(locationId);

    if (!locationId || Number.isNaN(id)) {
      return { error: "Invalid location id." };
    }

    const location = await prisma.location.findFirst({
      where: { id, shopDomain },
    });

    if (!location) {
      return { error: "Invalid location id." };
    }

    await prisma.location.delete({ where: { id } });

    return { deleted: true };
  }

  const readText = (field, required = false) => {
    const value = formData.get(field);
    if (!value) {
      return null;
    }
    const text = value.toString().trim();
    if (!text && required) {
      return null;
    }
    return text || null;
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

  const fields = {
    name: formData.get("name")?.toString() ?? "",
    address: formData.get("address")?.toString() ?? "",
    apartment: formData.get("apartment")?.toString() ?? "",
    city: formData.get("city")?.toString() ?? "",
    zipcode: formData.get("zipcode")?.toString() ?? "",
    province: formData.get("province")?.toString() ?? "",
    country: formData.get("country")?.toString() ?? "",
    showAddress,
    showCity,
    showProvince,
    showPostalCode,
    showCountry,
    offersPickup,
    offersDelivery,
  };

  if (!name || !address) {
    return { error: "Location name and address are required.", fields };
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

  return { success: "Location saved." };
};

export default function LocationsPage() {
  const { locations } = useLoaderData();
  const actionData = useActionData();

  const defaultFields = {
    name: "",
    address: "",
    apartment: "",
    city: "",
    zipcode: "",
    province: "",
    country: "",
    showAddress: true,
    showCity: true,
    showProvince: true,
    showPostalCode: true,
    showCountry: true,
    offersPickup: false,
    offersDelivery: false,
  };

  const formValues = {
    ...defaultFields,
    ...(actionData?.fields ?? {}),
  };

  const badgeBaseStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  };

  const renderAddress = (location) => {
    const lines = [location.address].filter(Boolean);
    if (location.apartment) {
      lines.push(location.apartment);
    }
    const cityZip = [location.city, location.zipcode].filter(Boolean).join(" ");
    if (cityZip) {
      lines.push(cityZip);
    }
    const provinceCountry = [location.province, location.country]
      .filter(Boolean)
      .join(", ");
    if (provinceCountry) {
      lines.push(provinceCountry);
    }
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
            {actionData?.error && (
              <div
                style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#991b1b",
                }}
              >
                {actionData.error}
              </div>
            )}
            {actionData?.success && (
              <div
                style={{
                  background: "#dcfce7",
                  border: "1px solid #86efac",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#14532d",
                }}
              >
                {actionData.success}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            <label style={{ display: "grid", gap: "6px" }}>
              <span style={{ fontWeight: 600 }}>Location name</span>
              <input
                name="name"
                type="text"
                defaultValue={formValues.name}
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
                defaultValue={formValues.address}
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
                defaultValue={formValues.apartment}
                placeholder="Unit 4B"
                style={{
                  borderRadius: "8px",
                  border: "1px solid #cbd5f5",
                  padding: "10px 12px",
                }}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontWeight: 600 }}>City</span>
                <input
                  name="city"
                  type="text"
                  defaultValue={formValues.city}
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
                  defaultValue={formValues.zipcode}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #cbd5f5",
                    padding: "10px 12px",
                  }}
                />
              </label>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontWeight: 600 }}>Province</span>
                <input
                  name="province"
                  type="text"
                  defaultValue={formValues.province}
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #cbd5f5",
                    padding: "10px 12px",
                  }}
                />
              </label>
              <label style={{ display: "grid", gap: "6px" }}>
                <span style={{ fontWeight: 600 }}>Country</span>
                <input
                  name="country"
                  type="text"
                  defaultValue={formValues.country}
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
                { label: "Show address", name: "showAddress", checked: formValues.showAddress },
                { label: "Show city", name: "showCity", checked: formValues.showCity },
                { label: "Show province", name: "showProvince", checked: formValues.showProvince },
                { label: "Show postal code", name: "showPostalCode", checked: formValues.showPostalCode },
                { label: "Show country", name: "showCountry", checked: formValues.showCountry },
              ].map((option) => (
                <label key={option.name} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input type="checkbox" name={option.name} defaultChecked={option.checked} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <h3 style={{ margin: 0 }}>Offerings</h3>
            <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input type="checkbox" name="offersPickup" defaultChecked={formValues.offersPickup} />
              <span>This location offers local pickup</span>
            </label>
            <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input type="checkbox" name="offersDelivery" defaultChecked={formValues.offersDelivery} />
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
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "16px" }}>
              {locations.map((location) => (
                <li
                  key={location.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "16px",
                    background: "#f8fafc",
                    display: "grid",
                    gap: "8px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                    <strong style={{ fontSize: "16px" }}>{location.name}</strong>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {location.active && (
                        <span
                          style={{
                            ...badgeBaseStyle,
                            background: "#dcfce7",
                            color: "#166534",
                          }}
                        >
                          Active
                        </span>
                      )}
                      {location.offersPickup && (
                        <span
                          style={{
                            ...badgeBaseStyle,
                            background: "#e0f2fe",
                            color: "#075985",
                          }}
                        >
                          Pickup
                        </span>
                      )}
                      {location.offersDelivery && (
                        <span
                          style={{
                            ...badgeBaseStyle,
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
                    {renderAddress(location)}
                  </p>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Form method="post">
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="locationId" value={location.id} />
                      <s-button type="submit" variant="secondary">Delete</s-button>
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
