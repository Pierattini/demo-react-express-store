import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getProducts, deleteProduct, updateProduct } from "../../lib/products";
import type { Product } from "../../lib/types";
const API_URL = import.meta.env.VITE_API_URL;
type ProductWithFeatured = Product & {
  featured?: boolean;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductWithFeatured[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  type EditableProduct = Omit<ProductWithFeatured, "image"> & {
  image?: string | File;
};

const [editedProduct, setEditedProduct] =
useState<Partial<EditableProduct>>({});

  
  const [openCreateModal, setOpenCreateModal] = useState(false);
 const [variants, setVariants] = useState([
  { color: "#000000", stock: 0, image: null as File | null }
]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: null as File | null,
  });
  
  const [openDescriptionId, setOpenDescriptionId] =
    useState<number | null>(null);

    async function reloadProducts() {
  try {
    setLoading(true);

    const data = await getProducts();

    const mapped = data.map((p: Product) => ({
      ...p,
       image: p.image ?? "",
    }));

    setProducts(mapped);
  } catch {
    setError("Error cargando productos");
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
  async function load() {
    try {
      const data = await getProducts();

      const mapped = data.map((p: Product) => ({
        ...p,
         image: p.image ?? "",
      }));

      setProducts(mapped);
    } catch {
      setError("Error cargando productos");
    } finally {
      setLoading(false);
    }
  }
  load();
}, []);


  function toggleFeatured(id: number) {
    const featuredCount = products.filter((p) => p.featured).length;

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (!p.featured && featuredCount >= 6) return p;
        return { ...p, featured: !p.featured };
      })
    );
  }

  async function handleDelete(id: number) {
  const confirmDelete = window.confirm("¿Eliminar producto?");
  if (!confirmDelete) return;

  try {
    await deleteProduct(id); // 🔥 llamada real al backend

    setProducts((prev) =>
      prev.filter((p) => p.id !== id)
    );
  } catch {
    alert("Error eliminando producto");
  }
}

   async function handleSave(id: number) {
  try {

    const formData = new FormData();

    const product = products.find((p) => p.id === id);
    if (!product) return;

    formData.append("name", editedProduct.name ?? product.name);
    formData.append("description", editedProduct.description ?? product.description);
    formData.append("price", String(editedProduct.price ?? product.price));
    formData.append("stock", String(editedProduct.stock ?? product.stock));

    if (editedProduct.image instanceof File) {
      formData.append("image", editedProduct.image);
    }

    variants.forEach((v, i) => {
      if (v.image) {
        formData.append(`variant_image_${i}`, v.image);
      }
    });
    formData.append(
"variants",
JSON.stringify(
variants.map(v=>({
color:v.color,
stock:v.stock
}))
)
)
    await updateProduct(id, formData);

    await reloadProducts();

    setEditingId(null);
    setEditedProduct({});

  } catch {
    alert("Error actualizando producto");
  }
}

 async function handleCreate() {

  try {

    const formData = new FormData();

    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", String(newProduct.price));
    formData.append("stock", String(newProduct.stock));
    if (newProduct.image) {
  formData.append("image", newProduct.image);
}

    formData.append(
      "variants",
      JSON.stringify(
        variants.map(v => ({
          color: v.color,
          stock: v.stock
        }))
      )
    );

    variants.forEach((v, i) => {
      if (v.image) {
        formData.append(`variant_image_${i}`, v.image);
      }
    });

    const res = await fetch(`${API_URL}/api/products`, {
  method: "POST",
  body: formData,
  credentials: "include",
});

if (!res.ok) {
  throw new Error("Error creando producto");
}

    await reloadProducts();

    setNewProduct({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      image: null,
    });

    setVariants([
      { color: "#000000", stock: 0, image: null }
    ]);

    setOpenCreateModal(false);

  } catch {
    alert("Error creando producto");
  }
}
function handleEdit(product: ProductWithFeatured) {

  setEditingId(product.id);
  setEditedProduct(product);

  setVariants(
    product.colors?.map((c:{ hex: string }) => ({
      color: c.hex,
      stock: product.stock ?? 0,
      image: null
    })) ?? [{ color:"#000000", stock:0, image:null }]
  );
}
  return (
    <DashboardLayout title="Productos">
      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Lista de productos</h2>
          <Button
            onClick={() => setOpenCreateModal(true)}
            className="bg-[#e5ecfb] text-[#4a6bb3] border border-[#cdd9f7] hover:bg-[#d7e2fa]"
          >
            + Nuevo producto
          </Button>
        </div>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 text-center w-28">Foto</th>
                  <th className="p-4 text-left w-48">Nombre</th>
                  <th className="p-4 text-center w-32">Descripción</th>
                  <th className="p-4 text-center w-28">Precio</th>
                  <th className="p-4 text-center w-28">Colores</th>
                  <th className="p-4 text-center w-24">Stock</th>
                  <th className="p-4 text-center w-20">Home</th>
                  <th className="p-4 text-center w-44">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 text-center">
  {editingId === product.id ? (
    <div className="flex flex-col items-center gap-2">
      {(() => {
  const img =
  editingId === product.id
    ? editedProduct.image ?? product.image
    : product.image;

  const src =
    img instanceof File
      ? URL.createObjectURL(img)
      : typeof img === "string"
      ? img.replace("/upload/", "/upload/w_400,q_auto,f_auto/")
      : "";

  return (
    <img
      src={src}
      className="h-16 w-16 rounded-xl object-cover shadow-sm"
    />
  );
})()}
      <label className="cursor-pointer text-xs px-3 py-1 rounded-full bg-[#f4e9dc] text-[#9a6b3c] border border-[#e7d2bd] hover:bg-[#eedac5] transition">
        Cambiar imagen
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setEditedProduct({
  ...editedProduct,
  image: file,
});
          }}
        />
      </label>
    </div>
  ) : (
  (() => {
    const img =
  editingId === product.id
    ? editedProduct.image ?? product.image
    : product.image;

    let src = "";

    if (img instanceof File) {
      src = URL.createObjectURL(img);
    } else if (typeof img === "string") {
      src = img.replace("/upload/", "/upload/w_400,q_auto,f_auto/");
    }

    return (
      <img
        src={src}
        className="h-16 w-16 rounded-xl object-cover shadow-sm"
      />
    );
  })()
)}
</td>


                    <td className="p-4">
  {editingId === product.id ? (
    <input
      value={editedProduct.name ?? ""}
      onChange={(e) =>
        setEditedProduct({
          ...editedProduct,
          name: e.target.value,
        })
      }
      className="border rounded-md px-2 py-1 w-full"
    />
  ) : (
    product.name
  )}
</td>


                    <td className="p-4 text-center">
                      <button
                        onClick={() => {
    setOpenDescriptionId(product.id);
    setEditedProduct(product);
  }}
                        className="px-4 py-1 text-xs rounded-full bg-[#eef1f6] text-gray-700 border border-[#dde2ea] hover:bg-[#e3e8f1] transition"
                      >
                        Ver
                      </button>
                    </td>

                    <td className="p-4 text-center">
  {editingId === product.id ? (
    <input
      type="number"
      value={editedProduct.price ?? 0}
      onChange={(e) =>
        setEditedProduct({
          ...editedProduct,
          price: Number(e.target.value),
        })
      }
      className="border rounded-md px-2 py-1 w-20 text-center"
    />
  ) : (
    `$${product.price}`
  )}
</td>
<td className="p-4 text-center">

{editingId === product.id ? (

<div className="flex flex-col gap-2 items-center">

{variants.map((v, i) => (

<div key={i} className="flex items-center gap-2">

<input
type="color"
value={v.color}
onChange={(e)=>{
const updated=[...variants]
updated[i].color=e.target.value
setVariants(updated)
}}
/>

<input
type="number"
value={v.stock}
onChange={(e)=>{
const updated=[...variants]
updated[i].stock=Number(e.target.value)
setVariants(updated)
}}
className="w-16 border rounded"
/>

<input
type="file"
onChange={(e)=>{
const updated=[...variants]
updated[i].image=e.target.files?.[0] ?? null
setVariants(updated)
}}
/>

<button
onClick={()=>{
setVariants(variants.filter((_,index)=>index!==i))
}}
className="text-red-500"
>
✕
</button>

</div>

))}

<button
onClick={()=>{
setVariants([
...variants,
{ color:"#000000", stock:0, image:null }
])
}}
className="px-2 py-1 bg-gray-200 rounded"
>
+ color
</button>

</div>

) : (

<div className="flex justify-center gap-2">

{product.colors?.map((c,i)=>(
<span
key={i}
className="w-4 h-4 rounded-full border"
style={{backgroundColor:c.hex}}
/>
))}

</div>

)}

</td>

                    <td className="p-4 text-center">
  {editingId === product.id ? (
    <input
      type="number"
      value={editedProduct.stock ?? 0}
      onChange={(e) =>
        setEditedProduct({
          ...editedProduct,
          stock: Number(e.target.value),
        })
      }
      className="border rounded-md px-2 py-1 w-16 text-center"
    />
  ) : (
    product.stock
  )}
</td>


                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={!!product.featured}
                        onChange={() =>
                          toggleFeatured(product.id)
                        }
                        className="w-4 h-4 accent-[#7c9a7c]"
                      />
                    </td>

                    <td className="p-4">
  <div className="flex justify-center gap-3">
    {editingId === product.id ? (
      <button
        onClick={() => handleSave(product.id)}
        className="px-4 py-1 text-xs rounded-full bg-[#dff5e1] text-[#2e7d32] border border-[#bde7c1] hover:bg-[#ccefd1] transition"
      >
        Guardar
      </button>
    ) : (
      <button
        onClick={() => handleEdit(product)}
        className="px-4 py-1 text-xs rounded-full bg-[#e5ecfb] text-[#4a6bb3] border border-[#cdd9f7] hover:bg-[#d7e2fa] transition"
      >
        Editar
      </button>
    )}

    <button
      onClick={() => handleDelete(product.id)}
      className="px-4 py-1 text-xs rounded-full bg-[#fde4e4] text-[#b23a3a] border border-[#f7caca] hover:bg-[#fcd6d6] transition"
    >
      Eliminar
    </button>
  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MODAL CREAR PRODUCTO */}
      {openCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl space-y-6">
            <h3 className="font-semibold text-lg">
              Nuevo producto
            </h3>

            <div className="space-y-4">
              <input
  placeholder="Nombre"
  value={newProduct.name}
  onChange={(e) =>
    setNewProduct({
      ...newProduct,
      name: e.target.value,
    })
  }
  className="w-full border rounded-lg p-3"
/>

              <textarea
  placeholder="Descripción"
  value={newProduct.description}
  onChange={(e) =>
    setNewProduct({
      ...newProduct,
      description: e.target.value,
    })
  }
  rows={6}
  className="w-full border rounded-lg p-3 resize-none"
/>



              <div>
                <label className="block text-sm mb-1 font-medium">
                  Precio
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Stock
                </label>
                <input
                  type="number"
                  required
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stock: Number(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg p-3"
                />
              </div>
              <div>
<label className="block text-sm mb-2 font-medium">
  Variantes
</label>

<div className="space-y-4">

{variants.map((v, i) => (

<div key={i} className="flex items-center gap-3">

<input
type="color"
value={v.color}
onChange={(e)=>{
const updated=[...variants]
updated[i].color=e.target.value
setVariants(updated)
}}
className="w-12 h-10"
/>

<input
type="number"
placeholder="Stock"
value={v.stock}
onChange={(e)=>{
const updated=[...variants]
updated[i].stock=Number(e.target.value)
setVariants(updated)
}}
className="border rounded px-2 py-1 w-20"
/>

<input
type="file"
onChange={(e)=>{
const updated=[...variants]
updated[i].image=e.target.files?.[0] ?? null
setVariants(updated)
}}
/>

<button
type="button"
onClick={()=>{
setVariants(variants.filter((_,index)=>index!==i))
}}
className="text-red-500"
>
✕
</button>

</div>

))}

<button
type="button"
onClick={()=>{
setVariants([
...variants,
{ color:"#000000", stock:0, image:null }
])
}}
className="px-3 py-1 bg-gray-200 rounded"
>
+ agregar variante
</button>

</div>
</div>
              <div>
                <label className="block text-sm mb-2 font-medium">
                  Imagen
                </label>

                <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#f4e9dc] text-[#9a6b3c] border border-[#e7d2bd] hover:bg-[#eedac5] transition">
                  <input
                    type="file"
                    required
                    className="hidden"
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        image:
                          e.target.files?.[0] ?? null,
                      })
                    }
                  />
                  Seleccionar imagen
                </label>

                {newProduct.image && (
                  <p className="text-xs mt-2 text-gray-500">
                    {newProduct.image.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setOpenCreateModal(false)}
                className="px-5 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreate}
                disabled={
                  !newProduct.name.trim() ||
                  !newProduct.description.trim() ||
                  newProduct.price <= 0 ||
                  newProduct.stock < 0 ||
                  !newProduct.image
                }
                className="px-6 py-2 rounded-full bg-[#cdebd3] text-[#2e7d32] border border-[#a7d8b1] hover:bg-[#bfe3c7] transition disabled:opacity-50"
              >
                Crear producto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DESCRIPCIÓN */}
      {openDescriptionId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-semibold text-lg">
              Descripción del producto
            </h3>

            <textarea
  value={
    editingId === openDescriptionId
      ? editedProduct.description ?? ""
      : products.find(
          (p) => p.id === openDescriptionId
        )?.description ?? ""
  }
  onChange={(e) =>
    editingId === openDescriptionId &&
    setEditedProduct({
      ...editedProduct,
      description: e.target.value,
    })
  }
  readOnly={editingId !== openDescriptionId}
  rows={6}
  className="w-full border rounded-lg p-3 resize-none"
/>

<div className="flex justify-end">
  <button
    onClick={() => setOpenDescriptionId(null)}
    className="px-5 py-2 text-sm rounded-full bg-[#e6e2f8] text-[#5c4d9c] hover:bg-[#d8d1f3]"
  >
    Cerrar
  </button>
</div>

            </div>
          </div>
      )}
    </DashboardLayout>
  );
}
