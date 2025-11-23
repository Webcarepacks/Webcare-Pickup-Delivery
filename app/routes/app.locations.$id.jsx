import { redirect, useLoaderData, useActionData, Form } from "react-router";
import { authenticate } from "../shopify.server";
import { prisma } from "../db.server";

export const loader = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const id = Number(params.id);

  const location = await prisma.location.findFirst({
    where: { id, shopDomain },
  });

  if (!location) {
    throw new Response("Not found", { status: 404 });
  }

  return { location };
};

export const action = async ({ request, params }) => {
  const { session } = await authenticate.admin(request);
  const shopDomain = session.shop;
  const id = Number(params.id);

  const formData = await request.formData();

  const name = formData.get("name");
  const address = formData.get("address");
  const apartment = formData.get("apartment");
  const city = formData.get("city");
  const zipcode = formData.get("zipcode");
  const province = formData.get("province");
  const country = formData.get("country");

  if (!name || !address) {
    return { error: "Location name and address are required." };
  }

  await prisma.location.update({
    where: { id },
    data: {
      name,
      address,
      apartment: apartment || "",
      city: city || "",
      zipcode: zipcode || "",
      province: province || "",
      country: country || "",
      showAddress: formData.get("showAddress") === "on",
      showCity: formData.get("showCity") === "on",
      showProvince: formData.get("showProvince") === "on",
      showPostalCode: formData.get("showPostalCode") === "on",
      showCountry: formData.get("showCountry") === "on",
      offersPickup: formData.get("offersPickup") === "on",
      offersDelivery: formData.get("offersDelivery") === "on",
    },
  });

  return redirect("/app/locations");
};

export default function EditLocationPage() {
  const { location } = useLoaderData();
  const actionData = useActionData();

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
                defaultValue={location.name}
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
                defaultValue={location.address}
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
                defaultValue={location.apartment || ""}
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
                  defaultValue={location.city || ""}
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
                  defaultValue={location.zipcode || ""}
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
                  defaultValue={location.province || ""}
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
                  defaultValue={location.country || ""}
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
                { label: "Show address", name: "showAddress", checked: location.showAddress },
                { label: "Show city", name: "showCity", checked: location.showCity },
                { label: "Show province", name: "showProvince", checked: location.showProvince },
                { label: "Show postal code", name: "showPostalCode", checked: location.showPostalCode },
                { label: "Show country", name: "showCountry", checked: location.showCountry },
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
              <input type="checkbox" name="offersPickup" defaultChecked={Boolean(location.offersPickup)} />
              <span>This location offers local pickup</span>
            </label>
            <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input type="checkbox" name="offersDelivery" defaultChecked={Boolean(location.offersDelivery)} />
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
      </div>
    </s-page>
  );
}
