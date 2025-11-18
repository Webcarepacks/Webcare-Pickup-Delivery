export default function LocationsPage() {
  return (
    <s-page title="Pickup locaties">
      <div style={{ padding: "16px" }}>
        <h2>Pickup locaties</h2>
        <p style={{ marginTop: "8px" }}>
          Hier kun je later afhaallocaties toevoegen en beheren.
        </p>

        <s-button href="/app/locations/new" variant="primary">
          Nieuwe locatie toevoegen
        </s-button>
      </div>
    </s-page>
  );
}
