import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const libraries: ("places")[] = ["places"];

export default function AddressAutocomplete({ value, onChange }: Props) {

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey || "",
    libraries
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    if (place?.formatted_address) {
      onChange(place.formatted_address);
    }
  };

  /* 🔹 Si NO hay API key → usar input normal */
  if (!apiKey) {
    return (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Dirección"
        className="w-full border p-2 rounded-lg"
      />
    );
  }

  /* 🔹 Si Google Maps aún no carga */
  if (!isLoaded) {
    return (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cargando..."
        className="w-full border p-2 rounded-lg"
      />
    );
  }

  return (
    <Autocomplete
      onLoad={(ref) => {
        autocompleteRef.current = ref;
      }}
      onPlaceChanged={handlePlaceChanged}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar dirección..."
        className="w-full border p-2 rounded-lg"
      />
    </Autocomplete>
  );
}