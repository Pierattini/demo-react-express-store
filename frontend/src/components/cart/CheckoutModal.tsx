import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import Button from "../ui/Button";

type Props = {
  onClose: () => void;
};

export default function CheckoutModal({ onClose }: Props) {

  const cart = useCart();
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] =
    useState<"bank_transfer" | "stripe">("bank_transfer");

  const [shippingData, setShippingData] = useState({
    full_name: "",
    address: "",
    phone: "",
    notes: ""
  });

  const subtotal = cart.items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const costoEnvio = 0;

  const total = subtotal + costoEnvio;

  const handleConfirmOrder = async () => {

    try {

      setProcessing(true);
      setError(null);

      const res = await cart.checkout({
        ...shippingData,
        paymentMethod
      });

      onClose();

      navigate("/order-success", {
        state: { orderId: res.order.id }
      });

    } catch {

      setError("Ocurrió un error al procesar la compra.");

    } finally {

      setProcessing(false);

    }

  };

  return (

    <div className="absolute inset-0 z-[60] bg-white flex flex-col">

      {/* header */}

      <div className="flex items-center justify-between p-6 border-b">

        <h2 className="text-xl font-semibold">
          Finalizar compra
        </h2>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-black"
        >
          Cerrar
        </button>

      </div>

      {/* contenido */}

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* PASO 1 */}

        {paso === 1 && (

          <div className="bg-gray-50 p-5 rounded-xl border space-y-4">

            <h3 className="font-semibold text-lg">
              Datos de envío
            </h3>

            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as "bank_transfer" | "stripe")
              }
              className="w-full border rounded-lg p-3 bg-white"
            >
              <option value="bank_transfer">
                Transferencia bancaria
              </option>

              <option value="stripe">
                Pago con tarjeta
              </option>
            </select>

            <input
              type="text"
              placeholder="Nombre completo"
              value={shippingData.full_name}
              onChange={(e) =>
                setShippingData({ ...shippingData, full_name: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Dirección completa"
              value={shippingData.address}
              onChange={(e) =>
                setShippingData({ ...shippingData, address: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={shippingData.phone}
              onChange={(e) =>
                setShippingData({ ...shippingData, phone: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />

            <textarea
              placeholder="Notas (opcional)"
              value={shippingData.notes}
              onChange={(e) =>
                setShippingData({ ...shippingData, notes: e.target.value })
              }
              className="w-full border rounded-lg p-3"
              rows={4}
            />

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

          </div>

        )}

        {/* PASO 2 */}

        {paso === 2 && (

          <div className="space-y-6">

            <div className="bg-gray-50 p-5 rounded-xl border space-y-3">

              <h3 className="font-semibold text-lg">
                Resumen del pedido
              </h3>

              <p>
                <span className="font-medium">Nombre:</span> {shippingData.full_name}
              </p>

              <p>
                <span className="font-medium">Dirección:</span> {shippingData.address}
              </p>

              <p>
                <span className="font-medium">Teléfono:</span> {shippingData.phone}
              </p>

            </div>

            <div className="bg-white border rounded-xl p-5 space-y-3">

              <h4 className="font-semibold">
                Detalle del pago
              </h4>

              <div className="flex justify-between text-sm">

                <span>Subtotal</span>
                <span>{subtotal}</span>

              </div>

              <div className="flex justify-between text-sm">

                <span>Costo de envío</span>
                <span className="text-green-600 font-medium">
                  Gratis
                </span>

              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-semibold">

                <span>Total</span>
                <span className="text-[#7C3AED]">
                  {total}
                </span>

              </div>

            </div>

          </div>

        )}

      </div>

      {/* footer */}

      <div className="border-t p-6 bg-white space-y-4">

        <div className="flex justify-between text-sm text-gray-600">

          <span>Productos</span>
          <span>{cart.items.length}</span>

        </div>

        <div className="flex gap-3">

          <Button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-black w-full"
          >
            Cancelar
          </Button>

          {paso === 1 && (

            <Button
              onClick={() => {

                if (!shippingData.address || !shippingData.phone) {

                  setError("Debes ingresar dirección y teléfono.");

                  return;

                }

                setPaso(2);

              }}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white w-full"
            >
              Continuar
            </Button>

          )}

          {paso === 2 && (

            <Button
              onClick={handleConfirmOrder}
              disabled={processing}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white w-full"
            >
              {processing ? "Procesando..." : "Confirmar pedido"}
            </Button>

          )}

        </div>

      </div>

    </div>

  );

}