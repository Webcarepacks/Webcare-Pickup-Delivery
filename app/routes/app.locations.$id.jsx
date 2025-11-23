import { redirect, useLoaderData, useActionData, Form } from "react-router";
import { authenticate } from "../shopify.server";
import { prisma } from "../db.server";

export async function loader({ request, params }) {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    throw new Response("Invalid location id", { status: 400 });
  }

  const location = await prisma.location.findFirst({
    where: { id, shopDomain },
  });

  if (!location) {
    throw new Response("Location not found", { status: 404 });
  }

  return { location };
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const id = Number(params.id);

  if (!id || Number.isNaN(id)) {
    return { error: "Invalid location id." };
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  const location = await prisma.location.findFirst({
    where: { id, shopDomain },
  });

  if (!location) {
    return { error: "Invalid location id." };
  }

  if (intent === "delete") {
    await prisma.location.delete({
      where: { id },
    });

    return redirect("/app/locations");
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

  if (!name || !address) {
    return {
      error: "Location name and address are required.",
      fields: {
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
      },
    };
  }

  await prisma.location.update({
    where: { id },
    data: {
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

  return redirect("/app/locations");
}

export default function EditLocationPage() {
  const { location } = useLoaderData();
  const actionData = useActionData();

  const formValues = {
    ...location,
    ...(actionData?.fields ?? {}),
  };

  return (
    <s-page title="Edit location">
      <div style={{ padding: "24px", display: "grid", gap: "24px" }}>
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
            <h2 style={{ margin: 0 }}>Update location</h2>
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
                defaultValue={formValues.apartment || ""}
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
                  defaultValue={formValues.city || ""}
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
                  defaultValue={formValues.zipcode || ""}
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
                  defaultValue={formValues.province || ""}
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
                  defaultValue={formValues.country || ""}
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
                  <input type="checkbox" name={option.name} defaultChecked={Boolean(option.checked)} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <h3 style={{ margin: 0 }}>Offerings</h3>
            <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input type="checkbox" name="offersPickup" defaultChecked={Boolean(formValues.offersPickup)} />
              <span>This location offers local pickup</span>
            </label>
            <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input type="checkbox" name="offersDelivery" defaultChecked={Boolean(formValues.offersDelivery)} />
              <span>This location offers local delivery</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <s-button type="submit" variant="primary">
              Save changes
            </s-button>
            <s-button href="/app/locations" variant="secondary">
              Cancel
            </s-button>
          </div>
        </Form>

        <Form
          method="post"
          onSubmit={(event) => {
            if (!window.confirm("Are you sure you want to delete this location?")) {
              event.preventDefault();
            }
          }}
          style={{
            border: "1px solid #e3e8ef",
            borderRadius: "16px",
            padding: "16px 24px",
            background: "white",
            boxShadow: "0 1px 2px rgba(15, 23, 42, 0.08)",
          }}
        >
          <input type="hidden" name="intent" value="delete" />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 4px 0" }}>Delete location</h3>
              <p style={{ margin: 0, color: "#64748b" }}>
                This action cannot be undone.
              </p>
            </div>
            <s-button tone="critical" variant="secondary" type="submit">
              Delete location
            </s-button>
          </div>
        </Form>
      </div>
    </s-page>
  );
}
