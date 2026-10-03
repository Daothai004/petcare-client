// Giỏ hàng lưu tạm trong trình duyệt (localStorage), chưa gửi lên server
// cho tới khi khách bấm "Đặt hàng". Mỗi item: { sanPhamId, soLuong }.
const KEY = "petcare_cart";

function getCart() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function getCartItems() {
  return getCart();
}

export function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.soLuong, 0);
}

export function addToCart(sanPhamId, soLuong) {
  const items = getCart();
  const existing = items.find((i) => i.sanPhamId === sanPhamId);
  if (existing) {
    existing.soLuong += soLuong;
  } else {
    items.push({ sanPhamId, soLuong });
  }
  saveCart(items);
}

export function updateCartQty(sanPhamId, soLuong) {
  const items = getCart().map((i) =>
    i.sanPhamId === sanPhamId ? { ...i, soLuong } : i,
  );
  saveCart(items.filter((i) => i.soLuong > 0));
}

export function removeFromCart(sanPhamId) {
  saveCart(getCart().filter((i) => i.sanPhamId !== sanPhamId));
}

export function clearCart() {
  saveCart([]);
}
