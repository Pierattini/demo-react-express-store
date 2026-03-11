import { useTranslation } from "react-i18next";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  sort: string;
  setSort: (value: "default" | "price-asc" | "price-desc") => void;
};

export default function ProductFilters({
  search,
  setSearch,
  sort,
  setSort,
}: Props) {

  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">

      {/* Buscador */}
      <input
        type="text"
        placeholder={t("searchProduct")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      />

      {/* Ordenar */}
      <select
        value={sort}
        onChange={(e) =>
          setSort(e.target.value as "default" | "price-asc" | "price-desc")
        }
        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      >
        <option value="default">{t("sort")}</option>
        <option value="price-asc">{t("priceAsc")}</option>
        <option value="price-desc">{t("priceDesc")}</option>
      </select>

    </div>
  );
}