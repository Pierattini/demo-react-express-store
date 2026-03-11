import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    resources: {

      es: {
        translation: {

          home: "Inicio",
          catalog: "Catálogo",
          contact: "Contacto",
          cart: "Carrito",

          login: "Iniciar sesión",
          loginButton: "Entrar",
          loggingIn: "Ingresando...",
          email: "Email",
          password: "Contraseña",

          profile: "Perfil",
          profileComing: "Información del usuario próximamente",

          back: "Volver",

          productDetail: "Detalle de producto",
          productId: "Producto ID",

          total: "Total",
          order: "Orden",
          date: "Fecha",

          shippingInfo: "Datos de despacho",
          name: "Nombre",
          address: "Dirección",
          phone: "Teléfono",
          notes: "Notas",

          myOrders: "Mis órdenes",
          viewDetail: "Ver detalle",
          goToCatalog: "Ir al catálogo",
          noOrders: "Aún no tienes órdenes realizadas",

          viewOrders: "Ver mis órdenes",
          continueShopping: "Seguir comprando",

          orderCreated: "Pedido creado exitosamente",
          orderRegistered: "Tu orden fue registrada correctamente",

          createAccount: "Crear cuenta",
          confirmPassword: "Confirmar contraseña",
          fullName: "Nombre completo",

          veryWeak: "Muy débil",
          weak: "Débil",
          acceptable: "Aceptable",
          strong: "Fuerte",
          veryStrong: "Muy fuerte",

          featuredProducts: "Productos destacados",
          featuredSubtitle: "Selección especial de nuestros productos",

          loadingProducts: "Cargando productos...",
          errorLoadingProducts: "Error al cargar productos",

          noProducts: "No hay productos disponibles",
          productsComingSoon: "Pronto agregaremos nuevos productos.",

          noImage: "Sin imagen",

          addToCart: "Agregar al carrito",

          catalogTitle: "Catálogo",
          catalogSubtitle: "Descubre nuestros productos disponibles",
          searchProduct: "Buscar producto...",
          sort: "Ordenar",
          productsCount: "productos",

          priceAsc: "Precio menor a mayor",
          priceDesc: "Precio mayor a menor",

          cartTitle: "Carrito",
          emptyCartTitle: "Tu carrito está vacío",
          emptyCartDesc: "Agrega productos para comenzar tu compra",

          remove: "Eliminar",
          emptyCart: "Vaciar carrito",
          checkout: "Continuar al pago",

          shippingData: "Datos de despacho",

          bankTransfer: "Transferencia bancaria",
          cardPayment: "Tarjeta (Stripe)",

          fullAddress: "Dirección completa",
          contactPhone: "Teléfono de contacto",
          notesOptional: "Observaciones (opcional)",

          cancel: "Cancelar",
          confirmOrder: "Confirmar pedido",
          processing: "Procesando...",

          errorCheckout: "Error procesando el pedido",
          errorAddressPhone: "Debes completar dirección y teléfono",

          learnMore: "Conocer más",
featuresTitle: "Qué nos diferencia",

quality: "Calidad",
design: "Diseño",
durability: "Durabilidad",

reviewsTitle: "Reseñas",
reviewsSubtitle: "Lo que dicen nuestros clientes",

connectTitle: "Conéctate con nosotros",
connectSubtitle: "Síguenos en nuestras redes sociales",

contactInfo: "Información de contacto",

schedule: "Horario",
scheduleValue: "Lunes a Viernes 9:00 - 18:00",

contactResponse: "Te responderemos lo antes posible",

namePlaceholder: "Tu nombre",
messagePlaceholder: "Escribe tu mensaje",

sendMessage: "Enviar mensaje",
message: "Mensaje",

        }
      },

      en: {
        translation: {

          home: "Home",
          catalog: "Catalog",
          contact: "Contact",
          cart: "Cart",

          login: "Login",
          loginButton: "Sign in",
          loggingIn: "Signing in...",
          email: "Email",
          password: "Password",

          profile: "Profile",
          profileComing: "User information coming soon",

          back: "Back",

          productDetail: "Product detail",
          productId: "Product ID",

          total: "Total",
          order: "Order",
          date: "Date",

          shippingInfo: "Shipping information",
          name: "Name",
          address: "Address",
          phone: "Phone",
          notes: "Notes",

          myOrders: "My orders",
          viewDetail: "View detail",
          goToCatalog: "Go to catalog",
          noOrders: "You have no orders yet",

          viewOrders: "View my orders",
          continueShopping: "Continue shopping",

          orderCreated: "Order created successfully",
          orderRegistered: "Your order was registered correctly",

          createAccount: "Create account",
          confirmPassword: "Confirm password",
          fullName: "Full name",

          veryWeak: "Very weak",
          weak: "Weak",
          acceptable: "Acceptable",
          strong: "Strong",
          veryStrong: "Very strong",

          featuredProducts: "Featured products",
          featuredSubtitle: "Special selection of our products",

          loadingProducts: "Loading products...",
          errorLoadingProducts: "Error loading products",

          noProducts: "No products available",
          productsComingSoon: "New products coming soon.",

          noImage: "No image",

          addToCart: "Add to cart",

          catalogTitle: "Catalog",
          catalogSubtitle: "Discover our available products",
          searchProduct: "Search product...",
          sort: "Sort",
          productsCount: "products",

          priceAsc: "Price low to high",
          priceDesc: "Price high to low",

          cartTitle: "Cart",
          emptyCartTitle: "Your cart is empty",
          emptyCartDesc: "Add products to start your purchase",

          remove: "Remove",
          emptyCart: "Empty cart",
          checkout: "Checkout",

          shippingData: "Shipping information",

          bankTransfer: "Bank transfer",
          cardPayment: "Card (Stripe)",

          fullAddress: "Full address",
          contactPhone: "Contact phone",
          notesOptional: "Notes (optional)",

          cancel: "Cancel",
          confirmOrder: "Confirm order",
          processing: "Processing...",

          errorCheckout: "Error processing order",
          errorAddressPhone: "You must complete address and phone",

          learnMore: "Learn more",
featuresTitle: "What makes us different",

quality: "Quality",
design: "Design",
durability: "Durability",

reviewsTitle: "Reviews",
reviewsSubtitle: "What our customers say",

connectTitle: "Connect with us",
connectSubtitle: "Follow us on our social networks",

contactInfo: "Contact information",

schedule: "Schedule",
scheduleValue: "Monday to Friday 9:00 - 18:00",

contactResponse: "We will reply as soon as possible",

namePlaceholder: "Your name",
messagePlaceholder: "Write your message",

sendMessage: "Send message",
message: "Message",
        }
      }

    }

  });

export default i18n;